"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Circle, Download, FileText, Filter, PieChart, Square, User, LayoutDashboard } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import Link from "next/link"

// Sample data for charts
const subjectFrequencyData = [
  { name: "Normalization", frequency: 8, category: "Database" },
  { name: "SQL Queries", frequency: 12, category: "Database" },
  { name: "Transactions", frequency: 6, category: "Database" },
  { name: "Indexing", frequency: 4, category: "Database" },
  { name: "ER Diagrams", frequency: 7, category: "Database" },
  { name: "Joins", frequency: 10, category: "Database" },
  { name: "Stored Proc.", frequency: 3, category: "Database" },
  { name: "Triggers", frequency: 5, category: "Database" },
]

const performanceData = [
  { name: "Quiz 1", score: 75, average: 68 },
  { name: "Quiz 2", score: 82, average: 70 },
  { name: "Mid-Term", score: 78, average: 72 },
  { name: "Assignment", score: 90, average: 75 },
  { name: "Quiz 3", score: 85, average: 73 },
  { name: "Project", score: 92, average: 80 },
]

export default function AnalyticsPage() {
  const [darkMode, setDarkMode] = useState(false)

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
                        <SidebarMenuButton isActive tooltip="Analytics">
                          <PieChart />
                          <span>Analytics</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Resources">
                          <FileText />
                          <span>Resources</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Profile">
                      <User />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            {/* Main Content */}
            <div className="flex flex-col min-h-screen flex-1 transition-all duration-200">
              {/* Header */}
              <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-white">
                <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <div className="flex items-center">
                      <PieChart className="h-6 w-6" />
                      <h1 className="text-lg md:text-xl font-black ml-2">ANALYTICS & HEATMAPS</h1>
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

              {/* Main Analytics Area */}
              <main className="flex-1 px-4 md:px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto space-y-10">
                  {/* Page Title */}
                  <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase">
                      Smart Analytics
                    </h1>
                    <div className="flex gap-3 items-center">
                      <div className="h-6 w-6 bg-red-600"></div>
                      <div className="h-6 w-6 bg-blue-600"></div>
                      <div className="h-6 w-6 bg-yellow-500"></div>
                      <p className="text-lg md:text-xl">Track your performance and identify key focus areas</p>
                    </div>
                  </div>

                  {/* Course Selector */}
                  <div className="bg-white border-8 border-black p-6 md:p-8 shadow-brutal">
                    <h2 className="text-xl md:text-2xl font-black mb-6 uppercase border-b-4 border-black pb-2">
                      SELECT COURSE
                    </h2>
                    <div className="flex flex-wrap gap-4">
                      <button className="bg-red-600 text-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-sm md:text-base">
                        DATABASE MGMT
                      </button>
                      <button className="bg-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-sm md:text-base">
                        DATA STRUCTURES
                      </button>
                      <button className="bg-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-sm md:text-base">
                        COMPUTER NETWORKS
                      </button>
                      <button className="bg-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-sm md:text-base">
                        OPERATING SYSTEMS
                      </button>
                    </div>
                  </div>

                  {/* Analytics Tabs */}
                  <Tabs defaultValue="heatmap" className="space-y-8">
                    <TabsList className="grid w-full max-w-md grid-cols-3 h-14 bg-transparent gap-4">
                      <TabsTrigger
                        value="heatmap"
                        className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:border-black data-[state=active]:border-4 data-[state=active]:shadow-brutal
                        bg-white border-4 border-black text-sm md:text-lg font-bold h-full"
                      >
                        HEATMAP
                      </TabsTrigger>
                      <TabsTrigger
                        value="performance"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-black data-[state=active]:border-4 data-[state=active]:shadow-brutal
                        bg-white border-4 border-black text-sm md:text-lg font-bold h-full"
                      >
                        PERFORMANCE
                      </TabsTrigger>
                      <TabsTrigger
                        value="predictions"
                        className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border-black data-[state=active]:border-4 data-[state=active]:shadow-brutal
                        bg-white border-4 border-black text-sm md:text-lg font-bold h-full"
                      >
                        PREDICTIONS
                      </TabsTrigger>
                    </TabsList>

                    {/* Heatmap Tab */}
                    <TabsContent value="heatmap" className="space-y-8">
                      <div className="bg-white border-8 border-black p-6 md:p-8 shadow-brutal">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                          <h3 className="text-xl md:text-2xl font-black uppercase border-b-4 border-black pb-2">
                            TOPIC FREQUENCY HEATMAP
                          </h3>
                          <div className="flex gap-2">
                            <button className="bg-white border-4 border-black p-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all">
                              <Filter className="h-5 w-5" />
                            </button>
                            <button className="bg-white border-4 border-black p-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all">
                              <Download className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <p className="mb-8 text-base md:text-lg">
                          This heatmap shows the frequency of topics appearing in past exam papers for Database
                          Management Systems.
                        </p>
                        <div className="h-64 md:h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectFrequencyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis label={{ value: "Frequency", angle: -90, position: "insideLeft" }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "white",
                                  border: "4px solid black",
                                  borderRadius: "0px",
                                  fontFamily: "monospace",
                                }}
                              />
                              <Bar dataKey="frequency" fill="#DC2626" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-8 pt-6 border-t-4 border-black">
                          <h4 className="text-lg md:text-xl font-bold mb-4">AI INSIGHTS</h4>
                          <div className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 border-4 border-black p-6 text-white">
                            <p className="mb-3">
                              <strong>Key Observations:</strong>
                            </p>
                            <ul className="space-y-2 text-sm md:text-base">
                              <li>• SQL Queries appear most frequently (12 times) in past papers</li>
                              <li>• Joins and Normalization are also heavily tested topics</li>
                              <li>• Focus your study time on these high-frequency areas</li>
                              <li>• Stored Procedures appear less frequently but are still important</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Performance Tab */}
                    <TabsContent value="performance" className="space-y-6">
                      <div className="bg-white border-8 border-black p-6 shadow-brutal">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                          <h3 className="text-xl md:text-2xl font-black uppercase border-b-4 border-black pb-2">
                            PERFORMANCE TRACKING
                          </h3>
                          <div className="flex gap-2">
                            <button className="bg-white border-4 border-black p-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all">
                              <Filter className="h-5 w-5" />
                            </button>
                            <button className="bg-white border-4 border-black p-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all">
                              <Download className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <p className="mb-6 text-sm md:text-base">
                          Track your performance across quizzes, assignments, and exams compared to class average.
                        </p>
                        <div className="h-64 md:h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis label={{ value: "Score (%)", angle: -90, position: "insideLeft" }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "white",
                                  border: "4px solid black",
                                  borderRadius: "0px",
                                  fontFamily: "monospace",
                                }}
                              />
                              <Bar dataKey="score" fill="#2563EB" name="Your Score" />
                              <Bar dataKey="average" fill="#9CA3AF" name="Class Average" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-6 pt-6 border-t-4 border-black">
                          <h4 className="text-lg md:text-xl font-bold mb-4">PERFORMANCE SUMMARY</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-600 text-white border-4 border-black p-4">
                              <h5 className="font-bold mb-2">AVERAGE SCORE</h5>
                              <div className="text-3xl md:text-4xl font-black">83.7%</div>
                              <p className="text-sm mt-2">+12.2% above class average</p>
                            </div>
                            <div className="bg-yellow-500 border-4 border-black p-4">
                              <h5 className="font-bold mb-2">HIGHEST SCORE</h5>
                              <div className="text-3xl md:text-4xl font-black">92%</div>
                              <p className="text-sm mt-2">Project submission</p>
                            </div>
                            <div className="bg-black text-white border-4 border-black p-4">
                              <h5 className="font-bold mb-2">IMPROVEMENT</h5>
                              <div className="text-3xl md:text-4xl font-black">+17%</div>
                              <p className="text-sm mt-2">Since beginning of semester</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Predictions Tab */}
                    <TabsContent value="predictions" className="space-y-6">
                      <div className="bg-white border-8 border-black p-6 shadow-brutal">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                          <h3 className="text-xl md:text-2xl font-black uppercase border-b-4 border-black pb-2">
                            AI EXAM PREDICTIONS
                          </h3>
                          <div className="flex gap-2">
                            <button className="bg-white border-4 border-black p-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all">
                              <Download className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <p className="mb-6 text-sm md:text-base">
                          AI-powered predictions for upcoming exam topics based on historical patterns and syllabus
                          coverage.
                        </p>

                        <div className="space-y-6">
                          <div className="bg-gradient-to-br from-cyan-400 to-fuchsia-500 border-4 border-black p-6 text-white">
                            <h4 className="text-lg md:text-xl font-bold mb-4">PREDICTED EXAM FOCUS AREAS</h4>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="font-bold">SQL Queries & Joins</span>
                                <span className="font-bold">92% confidence</span>
                              </div>
                              <div className="w-full h-6 bg-black border-4 border-white">
                                <div className="h-full bg-white" style={{ width: "92%" }}></div>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="font-bold">Normalization</span>
                                <span className="font-bold">85% confidence</span>
                              </div>
                              <div className="w-full h-6 bg-black border-4 border-white">
                                <div className="h-full bg-white" style={{ width: "85%" }}></div>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="font-bold">Transactions & ACID</span>
                                <span className="font-bold">78% confidence</span>
                              </div>
                              <div className="w-full h-6 bg-black border-4 border-white">
                                <div className="h-full bg-white" style={{ width: "78%" }}></div>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="font-bold">ER Diagrams</span>
                                <span className="font-bold">65% confidence</span>
                              </div>
                              <div className="w-full h-6 bg-black border-4 border-white">
                                <div className="h-full bg-white" style={{ width: "65%" }}></div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-black text-white border-4 border-black p-6">
                              <h4 className="text-lg md:text-xl font-bold mb-4 border-b-4 border-white pb-2">
                                RECOMMENDED FOCUS
                              </h4>
                              <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                  <div className="h-6 w-6 bg-red-600 mt-0.5 flex-shrink-0"></div>
                                  <div>
                                    <p className="font-bold">Complex SQL Queries</p>
                                    <p className="text-sm text-gray-300">Practice nested queries and joins</p>
                                  </div>
                                </li>
                                <li className="flex items-start gap-3">
                                  <div className="h-6 w-6 bg-yellow-500 mt-0.5 flex-shrink-0"></div>
                                  <div>
                                    <p className="font-bold">3NF Normalization</p>
                                    <p className="text-sm text-gray-300">Review conversion examples</p>
                                  </div>
                                </li>
                                <li className="flex items-start gap-3">
                                  <div className="h-6 w-6 bg-blue-600 mt-0.5 flex-shrink-0"></div>
                                  <div>
                                    <p className="font-bold">Transaction Isolation</p>
                                    <p className="text-sm text-gray-300">Study concurrency control</p>
                                  </div>
                                </li>
                              </ul>
                            </div>

                            <div className="border-4 border-dashed border-black p-6">
                              <h4 className="text-lg md:text-xl font-bold mb-4 border-b-4 border-black pb-2">
                                STUDY PLAN
                              </h4>
                              <p className="mb-4 text-sm md:text-base">
                                Based on predictions, here's your optimal study plan:
                              </p>
                              <ul className="space-y-2 text-sm md:text-base">
                                <li className="flex items-center gap-2">
                                  <div className="h-4 w-4 bg-red-600"></div>
                                  <span>Day 1-2: SQL Queries & Joins (4 hours)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="h-4 w-4 bg-blue-600"></div>
                                  <span>Day 3: Normalization (3 hours)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="h-4 w-4 bg-yellow-500"></div>
                                  <span>Day 4: Transactions (2 hours)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="h-4 w-4 bg-black"></div>
                                  <span>Day 5: ER Diagrams (2 hours)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <div className="h-4 w-4 bg-cyan-400"></div>
                                  <span>Day 6: Practice Papers (3 hours)</span>
                                </li>
                              </ul>
                              <button className="mt-4 bg-blue-600 text-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all w-full text-sm md:text-base">
                                GENERATE DETAILED PLAN
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}
