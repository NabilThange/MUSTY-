"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  HelpCircle,
  Download,
  Trash2,
  Eye,
  Smartphone,
  Mail,
  Lock,
  Key,
  Monitor,
  Moon,
  Sun,
  Volume2,
  ArrowLeft,
  Save,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface NotificationSettings {
  emailNotifications: boolean
  smsAlerts: boolean
  pushNotifications: boolean
  assignmentReminders: boolean
  examAlerts: boolean
  announcementUpdates: boolean
  weeklyDigest: boolean
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  sessionTimeout: number
  loginAlerts: boolean
  passwordLastChanged: string
}

interface DisplaySettings {
  theme: "light" | "dark" | "system"
  fontSize: "small" | "medium" | "large"
  language: string
  timezone: string
  compactMode: boolean
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "classmates"
  showOnlineStatus: boolean
  allowDataCollection: boolean
  shareAnalytics: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("account")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsAlerts: false,
    pushNotifications: true,
    assignmentReminders: true,
    examAlerts: true,
    announcementUpdates: true,
    weeklyDigest: false,
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true,
    passwordLastChanged: "2024-01-15",
  })

  const [display, setDisplay] = useState<DisplaySettings>({
    theme: "light",
    fontSize: "medium",
    language: "en",
    timezone: "Asia/Kolkata",
    compactMode: false,
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "classmates",
    showOnlineStatus: true,
    allowDataCollection: true,
    shareAnalytics: false,
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push("/landing")
    }
  }, [authState.isAuthenticated, authState.isLoading, router])

  const handleSaveSettings = () => {
    // Here you would save settings to backend
    setHasUnsavedChanges(false)
    // Show success message
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Handle account deletion
      logout()
      router.push("/landing")
    }
  }

  const handleExportData = () => {
    // Handle data export
    const data = {
      profile: authState.user,
      settings: { notifications, security, display, privacy },
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `studgem-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
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
          <p className="font-bold font-mono">Loading Settings...</p>
        </div>
      </div>
    )
  }

  if (!authState.isAuthenticated) {
    return null
  }

  const settingSections = [
    { id: "account", label: "ACCOUNT", icon: User },
    { id: "notifications", label: "NOTIFICATIONS", icon: Bell },
    { id: "security", label: "SECURITY", icon: Shield },
    { id: "display", label: "DISPLAY", icon: Palette },
    { id: "privacy", label: "PRIVACY", icon: Eye },
    { id: "support", label: "SUPPORT", icon: HelpCircle },
  ]

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-white">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="border-4 border-black hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-yellow-500 border-4 border-black rotate-12"></div>
              <div className="h-8 w-8 bg-blue-600 border-4 border-black -ml-4 -rotate-12"></div>
              <h1 className="text-xl font-black tracking-tighter ml-2">SETTINGS</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <Button
                onClick={handleSaveSettings}
                className="bg-green-600 text-white border-4 border-black hover:bg-green-500 shadow-brutal"
              >
                <Save className="h-4 w-4 mr-2" />
                SAVE CHANGES
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r-8 border-black bg-white">
          <nav className="p-4 space-y-2">
            {settingSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 font-bold border-4 border-black transition-all ${
                  activeSection === section.id
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-100 hover:translate-y-1 hover:shadow-none"
                } shadow-brutal`}
              >
                <section.icon className="h-5 w-5" />
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {activeSection === "account" && (
              <div className="space-y-6">
                <Card className="border-8 border-black shadow-brutal">
                  <CardHeader>
                    <CardTitle className="font-black uppercase">ACCOUNT MANAGEMENT</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="font-bold text-sm">CHANGE PASSWORD</label>
                        <div className="space-y-3 mt-2">
                          <Input type="password" placeholder="Current Password" className="border-4 border-black" />
                          <Input type="password" placeholder="New Password" className="border-4 border-black" />
                          <Input type="password" placeholder="Confirm New Password" className="border-4 border-black" />
                          <Button className="bg-blue-600 text-white border-4 border-black hover:bg-blue-500 shadow-brutal">
                            UPDATE PASSWORD
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-sm">LINKED ACCOUNTS</label>
                        <div className="space-y-3 mt-2">
                          <div className="flex items-center justify-between p-3 bg-gray-100 border-4 border-black">
                            <span className="font-bold">Google Account</span>
                            <Button variant="outline" size="sm" className="border-2 border-black hover:bg-gray-200">
                              CONNECT
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-100 border-4 border-black">
                            <span className="font-bold">Microsoft Account</span>
                            <Button variant="outline" size="sm" className="border-2 border-black hover:bg-gray-200">
                              CONNECT
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator className="border-2 border-black" />
                    <div className="bg-red-50 border-4 border-red-600 p-4">
                      <h3 className="font-black text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        DANGER ZONE
                      </h3>
                      <p className="text-red-700 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 text-white border-4 border-black hover:bg-red-500 shadow-brutal"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        DELETE ACCOUNT
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <Card className="border-8 border-black shadow-brutal">
                  <CardHeader>
                    <CardTitle className="font-black uppercase">NOTIFICATION PREFERENCES</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="font-black text-lg border-b-4 border-black pb-2">DELIVERY METHODS</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5" />
                              <span className="font-bold">Email Notifications</span>
                            </div>
                            <Switch
                              checked={notifications.emailNotifications}
                              onCheckedChange={(checked) => {
                                setNotifications({ ...notifications, emailNotifications: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <div className="flex items-center gap-3">
                              <Smartphone className="h-5 w-5" />
                              <span className="font-bold">SMS Alerts</span>
                            </div>
                            <Switch
                              checked={notifications.smsAlerts}
                              onCheckedChange={(checked) => {
                                setNotifications({ ...notifications, smsAlerts: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <div className="flex items-center gap-3">
                              <Bell className="h-5 w-5" />
                              <span className="font-bold">Push Notifications</span>
                            </div>
                            <Switch
                              checked={notifications.pushNotifications}
                              onCheckedChange={(checked) => {
                                setNotifications({ ...notifications, pushNotifications: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-black text-lg border-b-4 border-black pb-2">CONTENT TYPES</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <span className="font-bold">Assignment Reminders</span>
                            <Switch
                              checked={notifications.assignmentReminders}
                              onCheckedChange={(checked) => {
                                setNotifications({ ...notifications, assignmentReminders: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <span className="font-bold">Exam Alerts</span>
                            <Switch
                              checked={notifications.examAlerts}
                              onCheckedChange={(checked) => {
                                setNotifications({ ...notifications, examAlerts: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <span className="font-bold">Announcement Updates</span>
                            <Switch
                              checked={notifications.announcementUpdates}
                              onCheckedChange={(checked) => {
                                setNotifications({ ...notifications, announcementUpdates: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <span className="font-bold">Weekly Digest</span>
                            <Switch
                              checked={notifications.weeklyDigest}
                              onCheckedChange={(checked) => {
                                setNotifications({ ...notifications, weeklyDigest: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                <Card className="border-8 border-black shadow-brutal">
                  <CardHeader>
                    <CardTitle className="font-black uppercase">SECURITY SETTINGS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="font-black text-lg border-b-4 border-black pb-2">AUTHENTICATION</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <div className="flex items-center gap-3">
                              <Key className="h-5 w-5" />
                              <span className="font-bold">Two-Factor Authentication</span>
                            </div>
                            <Switch
                              checked={security.twoFactorEnabled}
                              onCheckedChange={(checked) => {
                                setSecurity({ ...security, twoFactorEnabled: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                          <div className="p-3 bg-gray-50 border-2 border-black">
                            <div className="flex items-center gap-3 mb-2">
                              <Lock className="h-5 w-5" />
                              <span className="font-bold">Session Timeout</span>
                            </div>
                            <select
                              value={security.sessionTimeout}
                              onChange={(e) => {
                                setSecurity({ ...security, sessionTimeout: Number(e.target.value) })
                                setHasUnsavedChanges(true)
                              }}
                              className="w-full border-4 border-black p-2 bg-white"
                            >
                              <option value={15}>15 minutes</option>
                              <option value={30}>30 minutes</option>
                              <option value={60}>1 hour</option>
                              <option value={240}>4 hours</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <span className="font-bold">Login Alerts</span>
                            <Switch
                              checked={security.loginAlerts}
                              onCheckedChange={(checked) => {
                                setSecurity({ ...security, loginAlerts: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-black text-lg border-b-4 border-black pb-2">ACCOUNT SECURITY</h3>
                        <div className="space-y-4">
                          <div className="p-3 bg-blue-50 border-2 border-blue-600">
                            <div className="font-bold mb-1">Password Last Changed</div>
                            <div className="text-sm text-gray-600">
                              {new Date(security.passwordLastChanged).toLocaleDateString()}
                            </div>
                          </div>
                          <Button className="w-full bg-blue-600 text-white border-4 border-black hover:bg-blue-500 shadow-brutal">
                            VIEW ACTIVE SESSIONS
                          </Button>
                          <Button className="w-full bg-red-600 text-white border-4 border-black hover:bg-red-500 shadow-brutal">
                            LOGOUT ALL DEVICES
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "display" && (
              <div className="space-y-6">
                <Card className="border-8 border-black shadow-brutal">
                  <CardHeader>
                    <CardTitle className="font-black uppercase">DISPLAY & ACCESSIBILITY</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="font-black text-lg border-b-4 border-black pb-2">APPEARANCE</h3>
                        <div className="space-y-4">
                          <div className="p-3 bg-gray-50 border-2 border-black">
                            <div className="flex items-center gap-3 mb-2">
                              <Monitor className="h-5 w-5" />
                              <span className="font-bold">Theme</span>
                            </div>
                            <div className="flex gap-2">
                              {[
                                { value: "light", icon: Sun, label: "Light" },
                                { value: "dark", icon: Moon, label: "Dark" },
                                { value: "system", icon: Monitor, label: "System" },
                              ].map((theme) => (
                                <button
                                  key={theme.value}
                                  onClick={() => {
                                    setDisplay({ ...display, theme: theme.value as any })
                                    setHasUnsavedChanges(true)
                                  }}
                                  className={`flex items-center gap-2 px-3 py-2 border-2 border-black ${
                                    display.theme === theme.value ? "bg-black text-white" : "bg-white text-black"
                                  }`}
                                >
                                  <theme.icon className="h-4 w-4" />
                                  {theme.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 border-2 border-black">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold">Font Size</span>
                            </div>
                            <select
                              value={display.fontSize}
                              onChange={(e) => {
                                setDisplay({ ...display, fontSize: e.target.value as any })
                                setHasUnsavedChanges(true)
                              }}
                              className="w-full border-4 border-black p-2 bg-white"
                            >
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-black text-lg border-b-4 border-black pb-2">LOCALIZATION</h3>
                        <div className="space-y-4">
                          <div className="p-3 bg-gray-50 border-2 border-black">
                            <div className="flex items-center gap-3 mb-2">
                              <Globe className="h-5 w-5" />
                              <span className="font-bold">Language</span>
                            </div>
                            <select
                              value={display.language}
                              onChange={(e) => {
                                setDisplay({ ...display, language: e.target.value })
                                setHasUnsavedChanges(true)
                              }}
                              className="w-full border-4 border-black p-2 bg-white"
                            >
                              <option value="en">English</option>
                              <option value="hi">हिंदी (Hindi)</option>
                              <option value="mr">मराठी (Marathi)</option>
                            </select>
                          </div>
                          <div className="p-3 bg-gray-50 border-2 border-black">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold">Timezone</span>
                            </div>
                            <select
                              value={display.timezone}
                              onChange={(e) => {
                                setDisplay({ ...display, timezone: e.target.value })
                                setHasUnsavedChanges(true)
                              }}
                              className="w-full border-4 border-black p-2 bg-white"
                            >
                              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                              <option value="UTC">UTC</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <span className="font-bold">Compact Mode</span>
                            <Switch
                              checked={display.compactMode}
                              onCheckedChange={(checked) => {
                                setDisplay({ ...display, compactMode: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-6">
                <Card className="border-8 border-black shadow-brutal">
                  <CardHeader>
                    <CardTitle className="font-black uppercase">PRIVACY & DATA</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="font-black text-lg border-b-4 border-black pb-2">PROFILE PRIVACY</h3>
                        <div className="space-y-4">
                          <div className="p-3 bg-gray-50 border-2 border-black">
                            <div className="flex items-center gap-3 mb-2">
                              <Eye className="h-5 w-5" />
                              <span className="font-bold">Profile Visibility</span>
                            </div>
                            <select
                              value={privacy.profileVisibility}
                              onChange={(e) => {
                                setPrivacy({ ...privacy, profileVisibility: e.target.value as any })
                                setHasUnsavedChanges(true)
                              }}
                              className="w-full border-4 border-black p-2 bg-white"
                            >
                              <option value="public">Public</option>
                              <option value="classmates">Classmates Only</option>
                              <option value="private">Private</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <span className="font-bold">Show Online Status</span>
                            <Switch
                              checked={privacy.showOnlineStatus}
                              onCheckedChange={(checked) => {
                                setPrivacy({ ...privacy, showOnlineStatus: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-black text-lg border-b-4 border-black pb-2">DATA COLLECTION</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <span className="font-bold">Allow Data Collection</span>
                            <Switch
                              checked={privacy.allowDataCollection}
                              onCheckedChange={(checked) => {
                                setPrivacy({ ...privacy, allowDataCollection: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 border-2 border-black">
                            <span className="font-bold">Share Analytics</span>
                            <Switch
                              checked={privacy.shareAnalytics}
                              onCheckedChange={(checked) => {
                                setPrivacy({ ...privacy, shareAnalytics: checked })
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                          <Button
                            onClick={handleExportData}
                            className="w-full bg-blue-600 text-white border-4 border-black hover:bg-blue-500 shadow-brutal"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            EXPORT MY DATA
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "support" && (
              <div className="space-y-6">
                <Card className="border-8 border-black shadow-brutal">
                  <CardHeader>
                    <CardTitle className="font-black uppercase">HELP & SUPPORT</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="font-black text-lg border-b-4 border-black pb-2">GET HELP</h3>
                        <div className="space-y-3">
                          <Button className="w-full bg-blue-600 text-white border-4 border-black hover:bg-blue-500 shadow-brutal justify-start">
                            <HelpCircle className="h-4 w-4 mr-2" />
                            HELP CENTER & FAQ
                          </Button>
                          <Button className="w-full bg-green-600 text-white border-4 border-black hover:bg-green-500 shadow-brutal justify-start">
                            <Mail className="h-4 w-4 mr-2" />
                            CONTACT SUPPORT
                          </Button>
                          <Button className="w-full bg-purple-600 text-white border-4 border-black hover:bg-purple-500 shadow-brutal justify-start">
                            <Volume2 className="h-4 w-4 mr-2" />
                            SUBMIT FEEDBACK
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-black text-lg border-b-4 border-black pb-2">RESOURCES</h3>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 border-2 border-black">
                            <div className="font-bold mb-1">Platform Version</div>
                            <div className="text-sm text-gray-600">StudGem v2.1.0</div>
                          </div>
                          <div className="p-3 bg-gray-50 border-2 border-black">
                            <div className="font-bold mb-1">Last Updated</div>
                            <div className="text-sm text-gray-600">January 20, 2024</div>
                          </div>
                          <Button className="w-full bg-gray-600 text-white border-4 border-black hover:bg-gray-500 shadow-brutal justify-start">
                            VIEW PRIVACY POLICY
                          </Button>
                          <Button className="w-full bg-gray-600 text-white border-4 border-black hover:bg-gray-500 shadow-brutal justify-start">
                            TERMS OF SERVICE
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
