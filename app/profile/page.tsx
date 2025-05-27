"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Trophy,
  Activity,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Settings,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface UserProfile {
  id: string
  fullName: string
  email: string
  prn?: string
  phone?: string
  bio?: string
  profilePicture?: string
  yearOfStudy: string
  currentSemester: number
  department: string
  program: string
  enrollmentDate: string
  profileVisibility: "public" | "private" | "classmates"
}

interface AcademicProgress {
  totalSubjects: number
  completedSubjects: number
  totalAssignments: number
  completedAssignments: number
  overallProgress: number
  currentGPA: number
  attendancePercentage: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earnedDate: string
  category: "academic" | "participation" | "milestone"
}

interface ActivityLog {
  id: string
  action: string
  timestamp: string
  details: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [editedData, setEditedData] = useState<Partial<UserProfile>>({})

  // Redirect if not authenticated
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push("/landing")
    }
  }, [authState.isAuthenticated, authState.isLoading, router])

  // Initialize profile data
  useEffect(() => {
    if (authState.user) {
      const mockProfile: UserProfile = {
        id: authState.user.id,
        fullName: authState.user.fullName,
        email: authState.user.email,
        prn: authState.user.prn || "2023COMP001",
        phone: "+91 9876543210",
        bio: "Computer Science student passionate about web development and AI. Currently exploring full-stack development with React and Node.js.",
        profilePicture: "/placeholder.svg?height=120&width=120",
        yearOfStudy: "FY",
        currentSemester: authState.user.current_semester || 1,
        department: "Computer Engineering",
        program: "Bachelor of Engineering",
        enrollmentDate: "2023-08-15",
        profileVisibility: "classmates",
      }
      setProfileData(mockProfile)
      setEditedData(mockProfile)
    }
  }, [authState.user])

  // Mock data for academic progress
  const academicProgress: AcademicProgress = {
    totalSubjects: 6,
    completedSubjects: 2,
    totalAssignments: 24,
    completedAssignments: 18,
    overallProgress: 75,
    currentGPA: 8.5,
    attendancePercentage: 92,
  }

  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: "1",
      title: "First Assignment",
      description: "Completed your first assignment",
      icon: "📝",
      earnedDate: "2024-01-15",
      category: "milestone",
    },
    {
      id: "2",
      title: "Perfect Attendance",
      description: "100% attendance for a month",
      icon: "🎯",
      earnedDate: "2024-01-30",
      category: "participation",
    },
    {
      id: "3",
      title: "Top Performer",
      description: "Scored above 90% in Mathematics",
      icon: "🏆",
      earnedDate: "2024-02-10",
      category: "academic",
    },
  ]

  // Mock activity log
  const activityLog: ActivityLog[] = [
    {
      id: "1",
      action: "Submitted Assignment",
      timestamp: "2024-01-20T10:30:00Z",
      details: "Data Structures Lab Assignment 2",
    },
    {
      id: "2",
      action: "Completed Chapter",
      timestamp: "2024-01-19T15:45:00Z",
      details: "Applied Mathematics I - Chapter 3",
    },
    {
      id: "3",
      action: "Joined Study Group",
      timestamp: "2024-01-18T09:15:00Z",
      details: "Physics Study Group - Mechanics",
    },
  ]

  const handleSave = () => {
    if (profileData && editedData) {
      setProfileData({ ...profileData, ...editedData })
      setIsEditing(false)
      // Here you would typically save to backend
    }
  }

  const handleCancel = () => {
    setEditedData(profileData || {})
    setIsEditing(false)
  }

  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-yellow-500 border-4 border-black rotate-12 animate-pulse"></div>
            <div className="h-12 w-12 bg-blue-600 border-4 border-black -ml-6 -rotate-12 animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-black font-mono">STUDGEM</h1>
          <p className="font-bold font-mono">Loading Profile...</p>
        </div>
      </div>
    )
  }

  if (!authState.isAuthenticated || !profileData) {
    return null
  }

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-white">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="border-4 border-black hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-yellow-500 border-4 border-black rotate-12"></div>
              <div className="h-8 w-8 bg-blue-600 border-4 border-black -ml-4 -rotate-12"></div>
              <h1 className="text-xl font-black tracking-tighter ml-2">USER PROFILE</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="border-4 border-black hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white border-4 border-black hover:bg-blue-500 shadow-brutal"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                EDIT PROFILE
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-green-600 text-white border-4 border-black hover:bg-green-500 shadow-brutal"
                >
                  <Save className="h-4 w-4 mr-2" />
                  SAVE
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-4 border-black hover:bg-gray-100 shadow-brutal"
                >
                  <X className="h-4 w-4 mr-2" />
                  CANCEL
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="bg-white border-8 border-black p-6 shadow-brutal mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Picture */}
            <div className="relative">
              <div className="h-32 w-32 bg-gray-200 border-8 border-black flex items-center justify-center">
                {profileData.profilePicture ? (
                  <img
                    src={profileData.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-gray-500" />
                )}
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-blue-600 text-white border-4 border-black flex items-center justify-center hover:bg-blue-500">
                  <Camera className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    value={editedData.fullName || ""}
                    onChange={(e) => setEditedData({ ...editedData, fullName: e.target.value })}
                    className="text-2xl font-black border-4 border-black"
                    placeholder="Full Name"
                  />
                  <Textarea
                    value={editedData.bio || ""}
                    onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                    className="border-4 border-black"
                    placeholder="Bio"
                    rows={3}
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-black tracking-tighter uppercase">{profileData.fullName}</h1>
                  <p className="text-lg font-bold text-gray-600 mt-2">
                    {profileData.department} • {profileData.yearOfStudy} • Semester {profileData.currentSemester}
                  </p>
                  <p className="text-gray-700 mt-3">{profileData.bio}</p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="bg-blue-100 border-4 border-black px-4 py-2">
                  <span className="font-bold">PRN: {profileData.prn}</span>
                </div>
                <div className="bg-green-100 border-4 border-black px-4 py-2">
                  <span className="font-bold">GPA: {academicProgress.currentGPA}</span>
                </div>
                <div className="bg-yellow-100 border-4 border-black px-4 py-2">
                  <span className="font-bold">Attendance: {academicProgress.attendancePercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "overview", label: "OVERVIEW", icon: User },
            { id: "academic", label: "ACADEMIC", icon: GraduationCap },
            { id: "achievements", label: "ACHIEVEMENTS", icon: Trophy },
            { id: "activity", label: "ACTIVITY", icon: Activity },
            { id: "contact", label: "CONTACT", icon: Mail },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-bold border-4 border-black shadow-brutal transition-all ${
                activeTab === tab.id
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100 hover:translate-y-1 hover:shadow-none"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Academic Progress */}
              <Card className="border-8 border-black shadow-brutal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-black uppercase">
                    <BookOpen className="h-5 w-5" />
                    ACADEMIC PROGRESS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-bold">Overall Progress</span>
                      <span className="font-bold">{academicProgress.overallProgress}%</span>
                    </div>
                    <Progress value={academicProgress.overallProgress} className="h-4 border-2 border-black" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-100 border-4 border-black p-3 text-center">
                      <div className="text-2xl font-black">{academicProgress.completedSubjects}</div>
                      <div className="text-sm font-bold">SUBJECTS COMPLETED</div>
                    </div>
                    <div className="bg-green-100 border-4 border-black p-3 text-center">
                      <div className="text-2xl font-black">{academicProgress.completedAssignments}</div>
                      <div className="text-sm font-bold">ASSIGNMENTS DONE</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card className="border-8 border-black shadow-brutal">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-black uppercase">
                    <Trophy className="h-5 w-5" />
                    RECENT ACHIEVEMENTS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.slice(0, 3).map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-black"
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <div className="font-bold">{achievement.title}</div>
                          <div className="text-sm text-gray-600">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "academic" && (
            <div className="space-y-6">
              <Card className="border-8 border-black shadow-brutal">
                <CardHeader>
                  <CardTitle className="font-black uppercase">ACADEMIC DETAILS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="font-bold text-sm">PROGRAM</label>
                        <div className="bg-gray-100 border-4 border-black p-3 mt-1">{profileData.program}</div>
                      </div>
                      <div>
                        <label className="font-bold text-sm">DEPARTMENT</label>
                        <div className="bg-gray-100 border-4 border-black p-3 mt-1">{profileData.department}</div>
                      </div>
                      <div>
                        <label className="font-bold text-sm">YEAR OF STUDY</label>
                        <div className="bg-gray-100 border-4 border-black p-3 mt-1">{profileData.yearOfStudy}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="font-bold text-sm">CURRENT SEMESTER</label>
                        <div className="bg-gray-100 border-4 border-black p-3 mt-1">
                          Semester {profileData.currentSemester}
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-sm">ENROLLMENT DATE</label>
                        <div className="bg-gray-100 border-4 border-black p-3 mt-1">
                          {new Date(profileData.enrollmentDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-sm">CURRENT GPA</label>
                        <div className="bg-green-100 border-4 border-black p-3 mt-1 font-black">
                          {academicProgress.currentGPA}/10.0
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="border-8 border-black shadow-brutal">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <h3 className="font-black text-lg mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 mb-4">{achievement.description}</p>
                    <Badge
                      variant="outline"
                      className={`border-2 border-black ${
                        achievement.category === "academic"
                          ? "bg-blue-100"
                          : achievement.category === "participation"
                            ? "bg-green-100"
                            : "bg-yellow-100"
                      }`}
                    >
                      {achievement.category.toUpperCase()}
                    </Badge>
                    <div className="text-sm text-gray-500 mt-2">
                      {new Date(achievement.earnedDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "activity" && (
            <Card className="border-8 border-black shadow-brutal">
              <CardHeader>
                <CardTitle className="font-black uppercase">RECENT ACTIVITY</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLog.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 border-2 border-black">
                      <div className="h-3 w-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="font-bold">{activity.action}</div>
                        <div className="text-gray-600">{activity.details}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "contact" && (
            <Card className="border-8 border-black shadow-brutal">
              <CardHeader>
                <CardTitle className="font-black uppercase">CONTACT INFORMATION</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="font-bold text-sm flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        EMAIL ADDRESS
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedData.email || ""}
                          onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                          className="border-4 border-black mt-1"
                        />
                      ) : (
                        <div className="bg-gray-100 border-4 border-black p-3 mt-1">{profileData.email}</div>
                      )}
                    </div>
                    <div>
                      <label className="font-bold text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        PHONE NUMBER
                      </label>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={editedData.phone || ""}
                          onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                          className="border-4 border-black mt-1"
                        />
                      ) : (
                        <div className="bg-gray-100 border-4 border-black p-3 mt-1">
                          {profileData.phone || "Not provided"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="font-bold text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        PROFILE VISIBILITY
                      </label>
                      {isEditing ? (
                        <select
                          value={editedData.profileVisibility || "classmates"}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              profileVisibility: e.target.value as "public" | "private" | "classmates",
                            })
                          }
                          className="w-full border-4 border-black p-3 mt-1 bg-white"
                        >
                          <option value="public">Public</option>
                          <option value="classmates">Classmates Only</option>
                          <option value="private">Private</option>
                        </select>
                      ) : (
                        <div className="bg-gray-100 border-4 border-black p-3 mt-1 capitalize">
                          {profileData.profileVisibility}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
