import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AcademicProvider } from "@/contexts/academic-context"
import { StagewiseToolbarWrapper } from "@/components/stagewise-toolbar-wrapper"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Update the metadata for MUSTY
export const metadata: Metadata = {
  title: "MUSTY - AI Study Companion for Mumbai University",
  description:
    "Free AI-powered study platform with syllabus PDFs, flashcards, quizzes & mindmaps for Mumbai University students",
  keywords: "Mumbai University, study, AI, syllabus, flashcards, quiz, mindmap, education",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className={inter.className} data-gptw="">
        <AcademicProvider>
          <ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false} disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AcademicProvider>
        <StagewiseToolbarWrapper />
      </body>
    </html>
  )
}
