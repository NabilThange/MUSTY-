"use client"

import { useState, useEffect } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import type { SupabaseClient } from "@supabase/supabase-js"
import Groq from "groq-sdk"
import { useSearchParams, useRouter } from "next/navigation"
import { MessageCircle, CreditCard, HelpCircle, Brain, Upload, ArrowLeft, Send, RefreshCw, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAcademicContext } from "@/contexts/academic-context"
import Link from "next/link"

// Ensure type safety for academic context
interface AcademicInfo {
  year: number;
  semester: number;
  branch: string;
}

// Groq AI Client with browser safety
const groqApiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || ''

// Only initialize Groq client on the client side
const getGroqClient = () => {
  if (typeof window !== 'undefined') {
    return new Groq({ 
      apiKey: groqApiKey, 
      dangerouslyAllowBrowser: true 
    })
  }
  return null
}

// Type Definitions
type AIMode = "chat" | "flashcards" | "quiz" | "mindmap"
type ContextType = "syllabus" | "upload"

interface AIMessage {
  role: "user" | "assistant"
  content: string
  timestamp: number
}

interface StudyResource {
  id: number
  type: string
  content: string
  source: string
  year: number
  semester: number
  branch: string
}

interface AIPromptContext {
  resources: StudyResource[]
  mode: AIMode
  userMessage: string
  academicInfo: AcademicInfo
}

// Dynamic AI Prompt Generator
function generateDynamicPrompt(context: AIPromptContext): string {
  const { resources, mode, userMessage, academicInfo } = context
  
  const resourceContext = resources
    .map(r => `[${r.type.toUpperCase()}] ${r.content}`)
    .join('\n\n')

  const basePrompt = `You are an AI study assistant for ${academicInfo.year} year, ${academicInfo.branch} branch, Semester ${academicInfo.semester}.

Available Study Resources:
${resourceContext}

`

  switch (mode) {
    case "chat":
      return `${basePrompt}Provide a detailed, academic response to the following query, using the context above:

Query: ${userMessage}

Response should be:
- Precise and informative
- Cite sources from the available resources
- Use academic language
- Explain complex concepts clearly`

    case "flashcards":
      return `${basePrompt}Generate high-quality study flashcards based on the context and this topic:

Topic: ${userMessage}

Flashcard Format:
- Front: Concise, clear question or term
- Back: Detailed explanation, key points, or definition
- Include relevant context from study resources`

    case "quiz":
      return `${basePrompt}Create a challenging academic quiz question related to:

Topic: ${userMessage}

Quiz Question Requirements:
- Difficulty level appropriate for ${academicInfo.year} year students
- Multiple choice with 4 options
- One correct answer
- Include a brief explanation of the correct answer
- Derive content from the available study resources`

    case "mindmap":
      return `${basePrompt}Generate a structured mindmap for the following topic:

Topic: ${userMessage}

Mindmap Guidelines:
- Use a hierarchical, tree-like structure
- Include main concept, branches, and sub-branches
- Derive connections and hierarchy from study resources
- Ensure academic accuracy and depth`

    default:
      return basePrompt
  }
}

export default function AIAssistantPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { academicInfo, isContextSet } = useAcademicContext()
  
  // Enhanced state management
  const [activeMode, setActiveMode] = useState<AIMode>("chat")
  const [contextType, setContextType] = useState<ContextType>("syllabus")
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // New state for resources and AI context
  const [studyResources, setStudyResources] = useState<StudyResource[]>([])
  const [groqClient, setGroqClient] = useState<Groq | null>(null)
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null)

  // Initialize clients on client-side mount
  useEffect(() => {
    const groqClientInstance = getGroqClient()
    
    // Supabase client initialization
    if (typeof window !== 'undefined') {
      const client = createSupabaseBrowserClient()
      setSupabaseClient(client)
    }
    
    if (groqClientInstance) {
      setGroqClient(groqClientInstance)
    }
  }, [])

  // Fetch Study Resources from Supabase
  useEffect(() => {
    async function fetchStudyResources() {
      if (!isContextSet || !supabaseClient) return

      const { data, error } = await supabaseClient
        .from('study_resources')
        .select('*')
        .eq('year', academicInfo.year.toString())
        .eq('semester', academicInfo.semester.toString())
        .eq('branch', academicInfo.branch)

      if (error) {
        console.error("Error fetching study resources:", error)
        return
      }

      setStudyResources(data || [])
    }

    fetchStudyResources()
  }, [academicInfo, isContextSet, supabaseClient])

  // Mode and context persistence
  useEffect(() => {
    const mode = searchParams.get("mode") as AIMode
    if (mode && ["chat", "flashcards", "quiz", "mindmap"].includes(mode)) {
      setActiveMode(mode)
    }
  }, [searchParams])

  // Enhanced mode switching with context preservation
  const handleModeSwitch = (newMode: AIMode) => {
    setActiveMode(newMode)
    router.push(`/ai-assistant?mode=${newMode}`)
  }

  // AI Message Handler
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !groqClient) return

    const newMessage: AIMessage = { 
      role: "user", 
      content: inputMessage,
      timestamp: +Date.now()
    }
    
    setMessages(prev => [...prev, newMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const promptContext: AIPromptContext = {
        resources: studyResources,
        mode: activeMode,
        userMessage: inputMessage,
        academicInfo: {
          year: parseInt(academicInfo.year || '0', 10),
          semester: parseInt(academicInfo.semester || '0', 10),
          branch: academicInfo.branch
        }
      }

      const dynamicPrompt = generateDynamicPrompt(promptContext)

      const aiResponse = await groqClient.chat.completions.create({
        messages: [{ role: "user", content: dynamicPrompt }],
        model: "llama3-8b-8192",
        temperature: 0.7,
        max_tokens: 1024
      })

      const assistantMessage: AIMessage = {
        role: "assistant",
        content: aiResponse.choices[0]?.message?.content || "I couldn't generate a response.",
        timestamp: +Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("AI Response Error:", error)
      const errorMessage: AIMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: +Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Render context warning if not set
  if (!isContextSet) {
    return (
      <div className="min-h-screen bg-white font-mono flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-black mb-4">SETUP REQUIRED</h1>
          <p className="font-bold mb-6">Please set your academic context first</p>
          <Link href="/dashboard">
            <Button className="bg-blue-600 text-white border-4 border-black font-bold">GO TO DASHBOARD</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Mode configuration
  const modes = [
    { 
      mode: "chat", 
      icon: MessageCircle, 
      label: "CHAT", 
      desc: "Ask questions & get explanations",
      emoji: "💬"
    },
    { 
      mode: "flashcards", 
      icon: CreditCard, 
      label: "FLASHCARDS", 
      desc: "Generate study cards",
      emoji: "🃏"
    },
    { 
      mode: "quiz", 
      icon: HelpCircle, 
      label: "QUIZ", 
      desc: "Practice with questions",
      emoji: "❓"
    },
    { 
      mode: "mindmap", 
      icon: Brain, 
      label: "MINDMAP", 
      desc: "Visual concept maps",
      emoji: "🧠"
    }
  ]

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-white">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard">
              <Button variant="outline" className="border-4 border-black font-bold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                DASHBOARD
              </Button>
            </Link>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-500 border-4 border-black rotate-12"></div>
              <div className="h-8 w-8 bg-blue-600 border-4 border-black -ml-4 -rotate-12"></div>
              <span className="font-black text-xl tracking-tighter ml-3 text-black">STUDGEM AI</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-blue-100 border-4 border-black px-4 py-2">
              <span className="font-bold text-sm text-black">
                {academicInfo.year} • Sem {academicInfo.semester} • {academicInfo.branch}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mode Selector */}
            <div className="bg-white border-8 border-black p-6 shadow-brutal">
              <h3 className="text-xl font-black mb-4 uppercase">AI MODES</h3>
              <div className="space-y-3">
                {modes.map(({ mode, icon: Icon, label, desc }) => (
                  <button
                    key={mode}
                    onClick={() => handleModeSwitch(mode as AIMode)}
                    className={`w-full p-4 border-4 border-black text-left transition-all ${
                      activeMode === mode ? "bg-blue-600 text-white shadow-brutal" : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6" />
                      <div>
                        <div className="font-black">{label}</div>
                        <div className="text-sm font-bold opacity-80">{desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Context Information Card */}
            <div className="bg-white border-8 border-black p-6 shadow-brutal">
              <h3 className="text-xl font-black mb-4 uppercase text-black">STUDY CONTEXT</h3>
              <div className="space-y-4">
                <div className="bg-green-100 border-4 border-black p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-5 w-5" />
                    <span className="font-black">RESOURCES LOADED</span>
                  </div>
                  <ul className="list-disc list-inside font-bold text-sm">
                    {studyResources.map((resource, index) => (
                      <li key={index}>{resource.type.toUpperCase()} from {resource.source}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border-8 border-black shadow-brutal h-[600px] flex flex-col">
              {/* Mode Header */}
              <div className="border-b-4 border-black p-6 bg-gray-50">
                <h2 className="text-2xl font-black uppercase text-black">
                  {modes.find(m => m.mode === activeMode)?.emoji} {modes.find(m => m.mode === activeMode)?.label} MODE
                </h2>
                <p className="font-bold text-gray-600 mt-2">
                  Using {academicInfo.year} {academicInfo.branch} Semester {academicInfo.semester} context
                </p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">
                      {modes.find(m => m.mode === activeMode)?.emoji}
                    </div>
                    <h3 className="text-xl font-black mb-2 text-black">
                      {modes.find(m => m.mode === activeMode)?.label} MODE
                    </h3>
                    <p className="font-bold text-gray-600">
                      {modes.find(m => m.mode === activeMode)?.desc}
                    </p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 border-4 border-black ${
                      message.role === "user" ? "bg-blue-100 ml-12" : "bg-gray-100 mr-12"
                    }`}
                  >
                    <div className="font-bold mb-2">{message.role === "user" ? "👤 YOU" : "🤖 STUDGEM AI"}</div>
                    <div className="font-mono whitespace-pre-wrap">{message.content}</div>
                  </div>
                ))}

                {isLoading && (
                  <div className="bg-gray-100 mr-12 p-4 border-4 border-black">
                    <div className="font-bold mb-2">🤖 STUDGEM AI</div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="font-mono">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t-4 border-black p-6 bg-gray-50">
                <div className="flex gap-4">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Ask about ${academicInfo.branch} topics...`}
                    className="flex-1 border-4 border-black font-mono bg-white text-black"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-blue-600 text-white border-4 border-black font-bold px-8"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
