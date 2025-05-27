"use client"

import { useState, useEffect } from "react"
import { DatabaseService } from "@/lib/database-service"
import { useAuth } from "./use-auth"

// Hook for user progress
export function useUserProgress(subjectId?: string) {
  const { authState } = useAuth()
  const [progress, setProgress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProgress() {
      if (!authState.user?.id || !subjectId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await DatabaseService.getUserProgress(authState.user.id, subjectId)
        setProgress(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching progress:", err)
        setError("Failed to load progress")
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [authState.user?.id, subjectId])

  const markTopicComplete = async (topicId: string) => {
    if (!authState.user?.id) return

    try {
      await DatabaseService.markTopicComplete(authState.user.id, topicId)
      // Refresh progress
      const data = await DatabaseService.getUserProgress(authState.user.id, subjectId!)
      setProgress(data)
    } catch (err) {
      console.error("Error marking topic complete:", err)
    }
  }

  return { progress, loading, error, markTopicComplete }
}

// Hook for user subjects
export function useUserSubjects() {
  const { authState } = useAuth()
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubjects() {
      if (!authState.user?.program_id || !authState.user?.current_semester) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await DatabaseService.getSubjectsForProgram(
          authState.user.program_id,
          authState.user.current_semester,
        )
        setSubjects(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching subjects:", err)
        setError("Failed to load subjects")
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [authState.user?.program_id, authState.user?.current_semester])

  return { subjects, loading, error }
}

// Hook for notifications
export function useNotifications() {
  const { authState } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function fetchNotifications() {
      if (!authState.user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await DatabaseService.getUserNotifications(authState.user.id)
        setNotifications(data)
        setUnreadCount(data.filter((n: any) => !n.is_read).length)
      } catch (err) {
        console.error("Error fetching notifications:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [authState.user?.id])

  const markAsRead = async (notificationId: string) => {
    try {
      await DatabaseService.markNotificationRead(notificationId)
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error("Error marking notification as read:", err)
    }
  }

  return { notifications, loading, unreadCount, markAsRead }
}

// Hook for study streak
export function useStudyStreak() {
  const { authState } = useAuth()
  const [streak, setStreak] = useState<any[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStreak() {
      if (!authState.user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await DatabaseService.getUserStudyStreak(authState.user.id)
        setStreak(data)

        // Calculate current streak
        if (data.length > 0) {
          setCurrentStreak(data[0].streak_count || 0)
        }
      } catch (err) {
        console.error("Error fetching study streak:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStreak()
  }, [authState.user?.id])

  const updateStreak = async (studyData: {
    minutes_studied: number
    topics_completed: number
    assignments_submitted: number
  }) => {
    if (!authState.user?.id) return

    try {
      await DatabaseService.updateStudyStreak(authState.user.id, studyData)
      // Refresh streak data
      const data = await DatabaseService.getUserStudyStreak(authState.user.id)
      setStreak(data)
      if (data.length > 0) {
        setCurrentStreak(data[0].streak_count || 0)
      }
    } catch (err) {
      console.error("Error updating study streak:", err)
    }
  }

  return { streak, currentStreak, loading, updateStreak }
}

// Hook for assignments
export function useAssignments(subjectId?: string) {
  const { authState } = useAuth()
  const [assignments, setAssignments] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAssignments() {
      if (!subjectId || !authState.user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const [assignmentData, submissionData] = await Promise.all([
          DatabaseService.getAssignmentsForSubject(subjectId),
          DatabaseService.getUserAssignmentSubmissions(authState.user.id, subjectId),
        ])

        setAssignments(assignmentData)
        setSubmissions(submissionData)
      } catch (err) {
        console.error("Error fetching assignments:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [subjectId, authState.user?.id])

  const submitAssignment = async (assignmentId: string, submissionData: any) => {
    if (!authState.user?.id) return

    try {
      await DatabaseService.submitAssignment({
        user_id: authState.user.id,
        assignment_id: assignmentId,
        ...submissionData,
      })

      // Refresh submissions
      const submissionData2 = await DatabaseService.getUserAssignmentSubmissions(authState.user.id, subjectId!)
      setSubmissions(submissionData2)
    } catch (err) {
      console.error("Error submitting assignment:", err)
      throw err
    }
  }

  return { assignments, submissions, loading, submitAssignment }
}
