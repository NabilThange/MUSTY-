"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MessageCircle, CreditCard, HelpCircle, Brain, Upload, ArrowLeft, Send, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAcademicContext } from "@/contexts/academic-context"
import Link from "next/link"

type AIMode = "chat" | "flashcards" | "quiz" | "mindmap"

export default function AIAssistantPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { academicInfo, isContextSet } = useAcademicContext()
  const [activeMode, setActiveMode] = useState<AIMode>("chat")
  const [contextType, setContextType] = useState<"syllabus" | "upload">("syllabus")
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Set mode from URL params
  useEffect(() => {
    const mode = searchParams.get("mode") as AIMode
    if (mode && ["chat", "flashcards", "quiz", "mindmap"].includes(mode)) {
      setActiveMode(mode)
    } else {
      setActiveMode("chat")
    }
  }, [searchParams])

  // Handle mode switching with URL update
  const handleModeSwitch = (newMode: AIMode) => {
    setActiveMode(newMode)
    // Clear messages when switching modes for better UX
    setMessages([])
    // Update URL with new mode
    router.push(`/ai-assistant?mode=${newMode}`)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const newMessage = { role: "user" as const, content: inputMessage }
    setMessages((prev) => [...prev, newMessage])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const response = {
        role: "assistant" as const,
        content: getAIResponse(inputMessage, activeMode, academicInfo),
      }
      setMessages((prev) => [...prev, response])
      setIsLoading(false)
    }, 1000)
  }

  const getAIResponse = (message: string, mode: AIMode, context: any) => {
    const contextInfo = `Based on your ${context.year} ${context.branch} Semester ${context.semester} syllabus:`

    switch (mode) {
      case "chat":
        return `${contextInfo} I can help explain concepts, solve problems, and answer questions about your subjects. What specific topic would you like to explore?`
      case "flashcards":
        return `${contextInfo} I'll create flashcards for your study topics. Here are some sample flashcards for your subjects:\n\n**Front:** What is Object-Oriented Programming?\n**Back:** A programming paradigm based on objects and classes...\n\nWould you like me to create more flashcards for a specific topic?`
      case "quiz":
        return `${contextInfo} Here's a quick quiz question:\n\n**Question:** Which of the following is NOT a principle of OOP?\na) Encapsulation\nb) Inheritance\nc) Compilation\nd) Polymorphism\n\n**Answer:** c) Compilation\n\nWould you like more quiz questions?`
      case "mindmap":
        return `${contextInfo} I'll create a mindmap structure for your topic:\n\n**Computer Networks**\n├── Physical Layer\n├── Data Link Layer\n├── Network Layer\n└── Application Layer\n\nWould you like me to expand any branch or create a mindmap for another topic?`
      default:
        return "I'm here to help with your studies!"
    }
  }

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
              <span className="font-black text-xl tracking-tighter ml-3">STUDGEM AI</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-blue-100 border-4 border-black px-4 py-2">
              <span className="font-bold text-sm">
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
                {[
                  { mode: "chat", icon: MessageCircle, label: "CHAT", desc: "Ask questions & get explanations" },
                  { mode: "flashcards", icon: CreditCard, label: "FLASHCARDS", desc: "Generate study cards" },
                  { mode: "quiz", icon: HelpCircle, label: "QUIZ", desc: "Practice with questions" },
                  { mode: "mindmap", icon: Brain, label: "MINDMAP", desc: "Visual concept maps" },
                ].map(({ mode, icon: Icon, label, desc }) => (
                  <button
                    key={mode}
                    onClick={() => handleModeSwitch(mode as AIMode)}
                    className={`w-full p-4 border-4 border-black text-left transition-all ${
                      activeMode === mode ? "bg-blue-600 text-white shadow-brutal" : "bg-white hover:bg-gray-100"
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

            {/* Context Selector */}
            <div className="bg-white border-8 border-black p-6 shadow-brutal">
              <h3 className="text-xl font-black mb-4 uppercase">STUDY CONTEXT</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setContextType("syllabus")}
                  className={`w-full p-4 border-4 border-black text-left transition-all ${
                    contextType === "syllabus" ? "bg-green-600 text-white shadow-brutal" : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <div className="font-black">📚 USE SYLLABUS</div>
                  <div className="text-sm font-bold opacity-80">
                    {academicInfo.year} {academicInfo.branch} content
                  </div>
                </button>
                <button
                  onClick={() => setContextType("upload")}
                  className={`w-full p-4 border-4 border-black text-left transition-all ${
                    contextType === "upload" ? "bg-yellow-500 text-black shadow-brutal" : "bg-white hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2 font-black">
                    <Upload className="h-5 w-5" />
                    UPLOAD NOTES
                  </div>
                  <div className="text-sm font-bold opacity-80">Use your own materials</div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border-8 border-black shadow-brutal h-[600px] flex flex-col">
              {/* Mode Header */}
              <div className="border-b-4 border-black p-6 bg-gray-50">
                <h2 className="text-2xl font-black uppercase">
                  {activeMode === "chat" && "💬 AI CHAT"}
                  {activeMode === "flashcards" && "🃏 FLASHCARD GENERATOR"}
                  {activeMode === "quiz" && "❓ QUIZ MAKER"}
                  {activeMode === "mindmap" && "🧠 MINDMAP CREATOR"}
                </h2>
                <p className="font-bold text-gray-600 mt-2">
                  {contextType === "syllabus"
                    ? `Using ${academicInfo.year} ${academicInfo.branch} Semester ${academicInfo.semester} syllabus`
                    : "Ready to upload your study materials"}
                </p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">
                      {activeMode === "chat" && "💬"}
                      {activeMode === "flashcards" && "🃏"}
                      {activeMode === "quiz" && "❓"}
                      {activeMode === "mindmap" && "🧠"}
                    </div>
                    <h3 className="text-xl font-black mb-2">
                      {activeMode === "chat" && "START CHATTING"}
                      {activeMode === "flashcards" && "CREATE FLASHCARDS"}
                      {activeMode === "quiz" && "GENERATE QUIZ"}
                      {activeMode === "mindmap" && "BUILD MINDMAP"}
                    </h3>
                    <p className="font-bold text-gray-600">
                      {activeMode === "chat" && "Ask me anything about your subjects!"}
                      {activeMode === "flashcards" && "Tell me what topic you want to study"}
                      {activeMode === "quiz" && "What subject should I quiz you on?"}
                      {activeMode === "mindmap" && "What concept should I map out?"}
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
                    className="flex-1 border-4 border-black font-mono"
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
