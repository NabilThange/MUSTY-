"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  BookOpen,
  Calendar,
  Circle,
  FileText,
  Gem,
  LayoutDashboard,
  LogOut,
  PieChart,
  Plus,
  Save,
  Settings,
  Square,
  Trash2,
  Edit3,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSemesterData } from "@/hooks/use-semester-data"

interface StudySession {
  id: string
  subjectId: string
  subjectName: string
  subjectCode: string
  chapterId?: string
  chapterName?: string
  startTime: string
  endTime: string
  date: string
  type: "study" | "assignment" | "exam" | "revision"
  priority: "low" | "medium" | "high"
  completed: boolean
  notes?: string
}

interface TimeSlot {
  time: string
  sessions: StudySession[]
}

export default function SchedulePage() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedWeek, setSelectedWeek] = useState(0) // 0 = current week
  const [viewMode, setViewMode] = useState<"day" | "week">("week")
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [showAddSession, setShowAddSession] = useState(false)
  const [editingSession, setEditingSession] = useState<StudySession | null>(null)

  const { subjects } = useSemesterData("")

  // Generate sample sessions for demonstration
  useEffect(() => {
    const sampleSessions: StudySession[] = [
      {
        id: "1",
        subjectId: "math1",
        subjectName: "Applied Mathematics I",
        subjectCode: "BSC101",
        chapterId: "ch1",
        chapterName: "Differential Equations",
        startTime: "09:00",
        endTime: "10:30",
        date: selectedDate,
        type: "study",
        priority: "high",
        completed: false,
        notes: "Focus on exact differential equations",
      },
      {
        id: "2",
        subjectId: "ds",
        subjectName: "Data Structure",
        subjectCode: "PCC2011",
        chapterId: "ch2",
        chapterName: "Stack",
        startTime: "14:00",
        endTime: "15:30",
        date: selectedDate,
        type: "assignment",
        priority: "high",
        completed: false,
        notes: "Complete stack implementation lab",
      },
      {
        id: "3",
        subjectId: "physics",
        subjectName: "Physics for Emerging Fields",
        subjectCode: "BSC2021",
        startTime: "16:00",
        endTime: "17:00",
        date: selectedDate,
        type: "revision",
        priority: "medium",
        completed: true,
        notes: "Review solar energy concepts",
      },
    ]
    setSessions(sampleSessions)
  }, [selectedDate])

  const getWeekDates = (weekOffset: number) => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + weekOffset * 7))
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date.toISOString().split("T")[0])
    }
    return dates
  }

  const getSessionsForDate = (date: string) => {
    return sessions.filter((session) => session.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const getTimeSlots = () => {
    const slots: TimeSlot[] = []
    for (let hour = 6; hour < 24; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`
      const sessionsAtTime = sessions.filter(
        (session) => session.date === selectedDate && session.startTime <= time && session.endTime > time,
      )
      slots.push({ time, sessions: sessionsAtTime })
    }
    return slots
  }

  const addSession = (sessionData: Omit<StudySession, "id">) => {
    const newSession: StudySession = {
      ...sessionData,
      id: Date.now().toString(),
    }
    setSessions((prev) => [...prev, newSession])
    setShowAddSession(false)
  }

  const updateSession = (sessionId: string, updates: Partial<StudySession>) => {
    setSessions((prev) => prev.map((session) => (session.id === sessionId ? { ...session, ...updates } : session)))
  }

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId))
  }

  const toggleSessionComplete = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, completed: !session.completed } : session)),
    )
  }

  return (
    <div className={`min-h-screen font-mono ${darkMode ? "dark" : ""}`}>
      <div className="bg-background text-foreground min-h-screen">
        <SidebarProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar className="z-50">
              <SidebarHeader className="flex flex-col items-center justify-center py-6">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 bg-yellow-500 border-4 border-black rotate-12"></div>
                  <div className="h-10 w-10 bg-blue-600 border-4 border-black -ml-5 -rotate-12"></div>
                </div>
                <span className="font-black text-xl tracking-tighter">STUDGEM</span>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>NAVIGATION</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Dashboard">
                          <Link href="/dashboard" className="flex items-center gap-3 w-full">
                            <LayoutDashboard />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Syllabus">
                          <Link href="/syllabus" className="flex items-center gap-3 w-full">
                            <BookOpen />
                            <span>Syllabus</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive tooltip="Schedule">
                          <Calendar />
                          <span>Schedule</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Resources">
                          <Link href="/resources" className="flex items-center gap-3 w-full">
                            <FileText />
                            <span>Resources</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="AI Assistant">
                          <Link href="/ai-assistant" className="flex items-center gap-3 w-full">
                            <Gem />
                            <span>StudGem AI</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Analytics">
                          <Link href="/analytics" className="flex items-center gap-3 w-full">
                            <PieChart />
                            <span>Analytics</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Logout">
                      <LogOut />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            {/* Main Content */}
            <MainContent
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
              viewMode={viewMode}
              setViewMode={setViewMode}
              sessions={sessions}
              showAddSession={showAddSession}
              setShowAddSession={setShowAddSession}
              editingSession={editingSession}
              setEditingSession={setEditingSession}
              getWeekDates={getWeekDates}
              getSessionsForDate={getSessionsForDate}
              getTimeSlots={getTimeSlots}
              addSession={addSession}
              updateSession={updateSession}
              deleteSession={deleteSession}
              toggleSessionComplete={toggleSessionComplete}
              subjects={subjects}
            />
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}

function MainContent({
  darkMode,
  setDarkMode,
  selectedDate,
  setSelectedDate,
  selectedWeek,
  setSelectedWeek,
  viewMode,
  setViewMode,
  sessions,
  showAddSession,
  setShowAddSession,
  editingSession,
  setEditingSession,
  getWeekDates,
  getSessionsForDate,
  getTimeSlots,
  addSession,
  updateSession,
  deleteSession,
  toggleSessionComplete,
  subjects,
}: any) {
  return (
    <div className="flex flex-col min-h-screen flex-1 transition-all duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-white">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6" />
              <h1 className="text-lg md:text-xl font-black">STUDY SCHEDULE</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="h-10 w-10 bg-yellow-500 border-4 border-black flex items-center justify-center hover:bg-yellow-400 transition-colors"
            >
              {darkMode ? <Circle className="h-5 w-5" /> : <Square className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase">Study Planner</h1>
            <div className="flex gap-3 items-center">
              <div className="h-6 w-6 bg-red-600"></div>
              <div className="h-6 w-6 bg-blue-600"></div>
              <div className="h-6 w-6 bg-yellow-500"></div>
              <p className="text-lg md:text-xl">Organize your study sessions and track progress</p>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* View Controls */}
            <div className="bg-white border-8 border-black p-6 shadow-brutal">
              <h3 className="text-xl font-black mb-4 uppercase border-b-4 border-black pb-2">VIEW MODE</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("day")}
                    className={`flex-1 px-4 py-2 font-bold border-4 border-black transition-all ${
                      viewMode === "day"
                        ? "bg-blue-600 text-white shadow-brutal-inverse"
                        : "bg-white hover:bg-gray-100 shadow-brutal hover:translate-y-1 hover:shadow-none"
                    }`}
                  >
                    DAY
                  </button>
                  <button
                    onClick={() => setViewMode("week")}
                    className={`flex-1 px-4 py-2 font-bold border-4 border-black transition-all ${
                      viewMode === "week"
                        ? "bg-blue-600 text-white shadow-brutal-inverse"
                        : "bg-white hover:bg-gray-100 shadow-brutal hover:translate-y-1 hover:shadow-none"
                    }`}
                  >
                    WEEK
                  </button>
                </div>
              </div>
            </div>

            {/* Date Navigation */}
            <div className="bg-white border-8 border-black p-6 shadow-brutal">
              <h3 className="text-xl font-black mb-4 uppercase border-b-4 border-black pb-2">DATE</h3>
              <div className="space-y-3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border-4 border-black p-3 font-mono text-lg shadow-brutal focus:outline-none focus:border-blue-600"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedWeek((prev) => prev - 1)}
                    className="flex-1 bg-gray-100 border-4 border-black px-3 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    ← PREV
                  </button>
                  <button
                    onClick={() => setSelectedWeek((prev) => prev + 1)}
                    className="flex-1 bg-gray-100 border-4 border-black px-3 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    NEXT →
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-blue-600 text-white border-8 border-black p-6 shadow-brutal">
              <h3 className="text-xl font-black mb-4 uppercase border-b-4 border-white pb-2">TODAY'S STATS</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-bold">Sessions:</span>
                  <span className="font-bold">{getSessionsForDate(selectedDate).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Completed:</span>
                  <span className="font-bold">
                    {getSessionsForDate(selectedDate).filter((s) => s.completed).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Hours:</span>
                  <span className="font-bold">
                    {getSessionsForDate(selectedDate)
                      .reduce((acc, session) => {
                        const start = new Date(`2000-01-01T${session.startTime}`)
                        const end = new Date(`2000-01-01T${session.endTime}`)
                        return acc + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                      }, 0)
                      .toFixed(1)}
                    h
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-black text-white border-8 border-black p-6 shadow-brutal-inverse">
              <h3 className="text-xl font-black mb-4 uppercase border-b-4 border-white pb-2">ACTIONS</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowAddSession(true)}
                  className="w-full bg-green-600 text-white border-4 border-white px-4 py-3 font-bold shadow-brutal-white hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  ADD SESSION
                </button>
                <button className="w-full bg-yellow-500 text-black border-4 border-white px-4 py-3 font-bold shadow-brutal-white hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2">
                  <Save className="h-5 w-5" />
                  SAVE SCHEDULE
                </button>
              </div>
            </div>
          </div>

          {/* Schedule View */}
          {viewMode === "week" ? (
            <WeekView
              weekDates={getWeekDates(selectedWeek)}
              getSessionsForDate={getSessionsForDate}
              toggleSessionComplete={toggleSessionComplete}
              setEditingSession={setEditingSession}
              deleteSession={deleteSession}
            />
          ) : (
            <DayView
              selectedDate={selectedDate}
              timeSlots={getTimeSlots()}
              sessions={getSessionsForDate(selectedDate)}
              toggleSessionComplete={toggleSessionComplete}
              setEditingSession={setEditingSession}
              deleteSession={deleteSession}
            />
          )}

          {/* Add/Edit Session Modal */}
          {(showAddSession || editingSession) && (
            <SessionModal
              session={editingSession}
              subjects={subjects}
              onSave={(sessionData) => {
                if (editingSession) {
                  updateSession(editingSession.id, sessionData)
                  setEditingSession(null)
                } else {
                  addSession(sessionData)
                }
              }}
              onCancel={() => {
                setShowAddSession(false)
                setEditingSession(null)
              }}
              selectedDate={selectedDate}
            />
          )}
        </div>
      </main>
    </div>
  )
}

function WeekView({ weekDates, getSessionsForDate, toggleSessionComplete, setEditingSession, deleteSession }: any) {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return (
    <div className="bg-white border-8 border-black p-6 shadow-brutal">
      <h3 className="text-2xl font-black mb-6 uppercase border-b-4 border-black pb-2">WEEKLY SCHEDULE</h3>
      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date, index) => {
          const sessions = getSessionsForDate(date)
          const dayName = dayNames[index]
          const isToday = date === new Date().toISOString().split("T")[0]

          return (
            <div key={date} className={`border-4 border-black p-4 ${isToday ? "bg-yellow-100" : "bg-gray-50"}`}>
              <div className="text-center mb-3">
                <div className="font-black text-sm uppercase">{dayName}</div>
                <div className="font-bold text-lg">{new Date(date).getDate()}</div>
              </div>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onToggleComplete={() => toggleSessionComplete(session.id)}
                    onEdit={() => setEditingSession(session)}
                    onDelete={() => deleteSession(session.id)}
                    compact
                  />
                ))}
                {sessions.length === 0 && (
                  <div className="text-center text-gray-500 text-sm font-bold py-4">NO SESSIONS</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DayView({ selectedDate, timeSlots, sessions, toggleSessionComplete, setEditingSession, deleteSession }: any) {
  return (
    <div className="bg-white border-8 border-black p-6 shadow-brutal">
      <h3 className="text-2xl font-black mb-6 uppercase border-b-4 border-black pb-2">
        DAILY SCHEDULE - {new Date(selectedDate).toLocaleDateString()}
      </h3>
      <div className="space-y-4">
        {sessions.map((session: StudySession) => (
          <SessionCard
            key={session.id}
            session={session}
            onToggleComplete={() => toggleSessionComplete(session.id)}
            onEdit={() => setEditingSession(session)}
            onDelete={() => deleteSession(session.id)}
          />
        ))}
        {sessions.length === 0 && (
          <div className="text-center py-12 bg-gray-100 border-4 border-dashed border-black">
            <h4 className="text-xl font-black mb-2">NO SESSIONS SCHEDULED</h4>
            <p className="font-bold text-gray-600">Add your first study session to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SessionCard({ session, onToggleComplete, onEdit, onDelete, compact = false }: any) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "study":
        return "bg-blue-600"
      case "assignment":
        return "bg-red-600"
      case "exam":
        return "bg-purple-600"
      case "revision":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-600"
      case "medium":
        return "border-yellow-500"
      case "low":
        return "border-green-600"
      default:
        return "border-gray-400"
    }
  }

  return (
    <div
      className={`border-4 ${getPriorityColor(session.priority)} p-4 ${session.completed ? "opacity-60" : ""} ${compact ? "text-xs" : ""}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-1 text-white font-bold text-xs ${getTypeColor(session.type)}`}>
              {session.type.toUpperCase()}
            </span>
            <span className="font-bold text-sm">
              {session.startTime} - {session.endTime}
            </span>
          </div>
          <h4 className={`font-black ${compact ? "text-sm" : "text-lg"} ${session.completed ? "line-through" : ""}`}>
            {session.subjectCode}
          </h4>
          <p className={`font-bold ${compact ? "text-xs" : "text-sm"} text-gray-600`}>{session.subjectName}</p>
          {session.chapterName && (
            <p className={`${compact ? "text-xs" : "text-sm"} text-gray-500`}>{session.chapterName}</p>
          )}
          {session.notes && !compact && <p className="text-sm text-gray-600 mt-2 italic">{session.notes}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleComplete}
            className={`h-6 w-6 border-4 border-black flex items-center justify-center ${
              session.completed ? "bg-green-500 text-white" : "bg-white"
            }`}
          >
            {session.completed && <span className="text-xs">✓</span>}
          </button>
          {!compact && (
            <>
              <button
                onClick={onEdit}
                className="h-8 w-8 bg-blue-600 text-white border-2 border-black flex items-center justify-center hover:bg-blue-500"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="h-8 w-8 bg-red-600 text-white border-2 border-black flex items-center justify-center hover:bg-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SessionModal({ session, subjects, onSave, onCancel, selectedDate }: any) {
  const [formData, setFormData] = useState({
    subjectId: session?.subjectId || "",
    subjectName: session?.subjectName || "",
    subjectCode: session?.subjectCode || "",
    chapterName: session?.chapterName || "",
    startTime: session?.startTime || "09:00",
    endTime: session?.endTime || "10:00",
    date: session?.date || selectedDate,
    type: session?.type || "study",
    priority: session?.priority || "medium",
    notes: session?.notes || "",
  })

  const handleSubjectChange = (subjectId: string) => {
    const subject = subjects.find((s: any) => s.id === subjectId)
    if (subject) {
      setFormData((prev) => ({
        ...prev,
        subjectId,
        subjectName: subject.name,
        subjectCode: subject.code,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-8 border-black p-6 shadow-brutal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-black mb-6 uppercase border-b-4 border-black pb-2">
          {session ? "EDIT SESSION" : "ADD SESSION"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold mb-2">SUBJECT</label>
              <select
                value={formData.subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full border-4 border-black p-3 font-mono shadow-brutal focus:outline-none focus:border-blue-600"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((subject: any) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold mb-2">CHAPTER/TOPIC</label>
              <Input
                value={formData.chapterName}
                onChange={(e) => setFormData((prev) => ({ ...prev, chapterName: e.target.value }))}
                placeholder="Enter chapter or topic"
                className="border-4 border-black shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">START TIME</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                className="w-full border-4 border-black p-3 font-mono shadow-brutal focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-2">END TIME</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                className="w-full border-4 border-black p-3 font-mono shadow-brutal focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-2">DATE</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full border-4 border-black p-3 font-mono shadow-brutal focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-2">TYPE</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as any }))}
                className="w-full border-4 border-black p-3 font-mono shadow-brutal focus:outline-none focus:border-blue-600"
              >
                <option value="study">Study</option>
                <option value="assignment">Assignment</option>
                <option value="exam">Exam</option>
                <option value="revision">Revision</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-2">PRIORITY</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value as any }))}
                className="w-full border-4 border-black p-3 font-mono shadow-brutal focus:outline-none focus:border-blue-600"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2">NOTES</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes or reminders..."
              rows={3}
              className="w-full border-4 border-black p-3 font-mono shadow-brutal focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1 bg-green-600 text-white border-4 border-black font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
            >
              {session ? "UPDATE SESSION" : "ADD SESSION"}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 text-white border-4 border-black font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
            >
              CANCEL
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
