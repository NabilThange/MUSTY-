"use client"

import { useState, useEffect } from "react"
import { DatabaseService } from "@/lib/database-service"
import { useAuth } from "./use-auth"
import { getMockSubjectsForSemester, getMockProgressForSemester } from "@/lib/mock-semester-data"

export function useSemesterData(semesterId?: string) {
  const { authState } = useAuth()
  const [subjects, setSubjects] = useState<any[]>([])
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSemesterData() {
      if (!semesterId || !authState.user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Extract semester number from semesterId (format: "sem-1", "sem-2", etc.)
        const semesterNumber = Number.parseInt(semesterId.split("-")[1])

        // For FY semesters (1 & 2), use mock data
        if (semesterNumber <= 2) {
          const mockSubjects = getMockSubjectsForSemester(semesterNumber)
          const mockProgress = getMockProgressForSemester(semesterNumber, authState.user.id)

          setSubjects(mockSubjects)
          setProgress(mockProgress)
        } else {
          // For higher semesters, use database (when implemented)
          const [subjectsData, progressData] = await Promise.all([
            DatabaseService.getSubjectsForSemester(semesterId),
            DatabaseService.getUserProgressForSemester(authState.user.id, semesterId),
          ])

          setSubjects(subjectsData)
          setProgress(progressData)
        }
      } catch (err) {
        console.error("Error fetching semester data:", err)
        setError("Failed to load semester data")
      } finally {
        setLoading(false)
      }
    }

    fetchSemesterData()
  }, [semesterId, authState.user?.id])

  // Calculate progress statistics
  const progressStats = {
    totalTopics: progress.length,
    completedTopics: progress.filter((p) => p.is_completed).length,
    completionPercentage:
      progress.length > 0 ? Math.round((progress.filter((p) => p.is_completed).length / progress.length) * 100) : 0,
  }

  return {
    subjects,
    progress,
    progressStats,
    loading,
    error,
  }
}
