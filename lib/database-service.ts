import { supabase } from "./supabase"
import type { Database } from "./supabase"

type Tables = Database["public"]["Tables"]
type User = Tables["users"]["Row"]
type SubjectType = Tables["subjects"]["Row"]
type UserProgress = Tables["user_topic_progress"]["Row"]

export interface Subject {
  id: string
  name: string
  code: string
  year: string
  semester: string
  branch: string
  credits: number
  type: "core" | "elective"
  syllabus_url: string
  created_at: string
}

export interface StudyResource {
  id: string
  title: string
  type: "pyq" | "notes" | "question_bank"
  subject_code: string
  file_url: string
  uploader_name?: string
  year?: string
  exam_type?: string
  created_at: string
}

export interface AISession {
  id: string
  session_id: string
  mode: "chat" | "flashcards" | "quiz" | "mindmap"
  context_type: "syllabus" | "upload"
  academic_context: {
    year: string
    semester: string
    branch: string
  }
  created_at: string
}

export class DatabaseService {
  // User Management
  static async createUser(userData: Tables["users"]["Insert"]) {
    const { data, error } = await supabase.from("users").insert(userData).select().single()

    if (error) throw error
    return data
  }

  static async getUserByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(`
        *,
        academic_programs (
          name,
          degree_type,
          departments (
            name,
            faculties (name)
          )
        )
      `)
        .eq("email", email)
        .single()

      // Handle case where user doesn't exist
      if (error && error.code === "PGRST116") {
        return null // User not found
      }

      if (error) {
        console.error("Database error:", error)
        throw error
      }

      return data
    } catch (error) {
      console.error("Error fetching user by email:", error)
      return null
    }
  }

  static async updateUserProfile(userId: string, updates: Tables["users"]["Update"]) {
    const { data, error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Subject Management
  static async getSubjectsForProgram(programId: string, semester: number) {
    const { data, error } = await supabase
      .from("program_subjects")
      .select(`
        subjects (
          id,
          code,
          name,
          credits,
          subject_type,
          semester,
          year_level,
          description
        )
      `)
      .eq("program_id", programId)
      .eq("semester", semester)

    if (error) throw error
    return data?.map((item) => item.subjects).filter(Boolean) || []
  }

  static async getSubjectWithChapters(subjectId: string) {
    const { data, error } = await supabase
      .from("subjects")
      .select(`
        *,
        chapters (
          id,
          chapter_number,
          title,
          description,
          weightage_percentage,
          estimated_hours,
          difficulty_level,
          topics (
            id,
            topic_number,
            title,
            description,
            estimated_hours,
            difficulty_level,
            learning_objectives
          )
        )
      `)
      .eq("id", subjectId)
      .single()

    if (error) throw error
    return data
  }

  // Subjects
  static async getSubjects(year: string, semester: string, branch: string): Promise<Subject[]> {
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("year", year)
        .eq("semester", semester)
        .eq("branch", branch)
        .order("code")

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching subjects:", error)
      return []
    }
  }

  static async getSubjectByCode(code: string): Promise<Subject | null> {
    try {
      const { data, error } = await supabase.from("subjects").select("*").eq("code", code).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching subject:", error)
      return null
    }
  }

  // Study Resources
  static async getStudyResources(subjectCode?: string, type?: string): Promise<StudyResource[]> {
    try {
      let query = supabase.from("study_resources").select("*")

      if (subjectCode) {
        query = query.eq("subject_code", subjectCode)
      }

      if (type) {
        query = query.eq("type", type)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching study resources:", error)
      return []
    }
  }

  // AI Sessions (for analytics)
  static async logAISession(sessionData: Omit<AISession, "id" | "created_at">): Promise<void> {
    try {
      const { error } = await supabase.from("ai_sessions").insert([sessionData])

      if (error) throw error
    } catch (error) {
      console.error("Error logging AI session:", error)
    }
  }

  // Get popular subjects (for dashboard stats)
  static async getPopularSubjects(limit = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from("subjects")
        .select("name, code, count:ai_sessions(count)")
        .order("count", { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching popular subjects:", error)
      return []
    }
  }

  // Progress Tracking
  static async getUserProgress(userId: string, subjectId: string) {
    const { data, error } = await supabase
      .from("user_topic_progress")
      .select(`
        *,
        topics (
          id,
          title,
          chapter_id,
          chapters (
            id,
            title,
            subject_id
          )
        )
      `)
      .eq("user_id", userId)
      .eq("topics.chapters.subject_id", subjectId)

    if (error) throw error
    return data || []
  }

  static async updateTopicProgress(
    userId: string,
    topicId: string,
    progressData: Partial<Tables["user_topic_progress"]["Update"]>,
  ) {
    const { data, error } = await supabase
      .from("user_topic_progress")
      .upsert({
        user_id: userId,
        topic_id: topicId,
        ...progressData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async markTopicComplete(userId: string, topicId: string) {
    return this.updateTopicProgress(userId, topicId, {
      is_completed: true,
      completion_percentage: 100,
      completed_at: new Date().toISOString(),
    })
  }

  // Assignment Management
  static async getAssignmentsForSubject(subjectId: string) {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("subject_id", subjectId)
      .eq("is_active", true)
      .order("due_date", { ascending: true })

    if (error) throw error
    return data || []
  }

  static async getUserAssignmentSubmissions(userId: string, subjectId: string) {
    const { data, error } = await supabase
      .from("assignment_submissions")
      .select(`
        *,
        assignments (
          id,
          title,
          assignment_type,
          total_marks,
          due_date,
          subject_id
        )
      `)
      .eq("user_id", userId)
      .eq("assignments.subject_id", subjectId)

    if (error) throw error
    return data || []
  }

  static async submitAssignment(submissionData: Tables["assignment_submissions"]["Insert"]) {
    const { data, error } = await supabase.from("assignment_submissions").insert(submissionData).select().single()

    if (error) throw error
    return data
  }

  // Resource Management
  static async getResourcesForTopic(topicId: string) {
    const { data, error } = await supabase
      .from("resources")
      .select(`
        *,
        resource_ratings (
          rating,
          review_text,
          users (full_name)
        )
      `)
      .eq("topic_id", topicId)
      .eq("is_verified", true)
      .order("download_count", { ascending: false })

    if (error) throw error
    return data || []
  }

  static async addResource(resourceData: Tables["resources"]["Insert"]) {
    const { data, error } = await supabase.from("resources").insert(resourceData).select().single()

    if (error) throw error
    return data
  }

  static async rateResource(userId: string, resourceId: string, rating: number, reviewText?: string) {
    const { data, error } = await supabase
      .from("resource_ratings")
      .upsert({
        user_id: userId,
        resource_id: resourceId,
        rating,
        review_text: reviewText,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Analytics
  static async updateStudyStreak(
    userId: string,
    studyData: {
      minutes_studied: number
      topics_completed: number
      assignments_submitted: number
    },
  ) {
    const today = new Date().toISOString().split("T")[0]

    const { data, error } = await supabase
      .from("study_streaks")
      .upsert({
        user_id: userId,
        study_date: today,
        ...studyData,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserStudyStreak(userId: string, days = 30) {
    const { data, error } = await supabase
      .from("study_streaks")
      .select("*")
      .eq("user_id", userId)
      .order("study_date", { ascending: false })
      .limit(days)

    if (error) throw error
    return data || []
  }

  // Notifications
  static async createNotification(notificationData: Tables["notifications"]["Insert"]) {
    const { data, error } = await supabase.from("notifications").insert(notificationData).select().single()

    if (error) throw error
    return data
  }

  static async getUserNotifications(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  static async markNotificationRead(notificationId: string) {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Study Groups
  static async createStudyGroup(groupData: Tables["study_groups"]["Insert"]) {
    const { data, error } = await supabase.from("study_groups").insert(groupData).select().single()

    if (error) throw error
    return data
  }

  static async joinStudyGroup(groupId: string, userId: string) {
    const { data, error } = await supabase
      .from("group_members")
      .insert({
        group_id: groupId,
        user_id: userId,
        role: "member",
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserStudyGroups(userId: string) {
    const { data, error } = await supabase
      .from("group_members")
      .select(`
        *,
        study_groups (
          id,
          name,
          description,
          subjects (name, code),
          created_by,
          max_members
        )
      `)
      .eq("user_id", userId)

    if (error) throw error
    return data || []
  }

  // Semester Management
  static async getProgramSemesters(programId: string, yearLevel?: number) {
    const query = supabase
      .from("program_semesters")
      .select("*")
      .eq("program_id", programId)
      .eq("is_active", true)
      .order("semester_number", { ascending: true })

    if (yearLevel) {
      query.eq("year_level", yearLevel)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  static async getSubjectsForSemester(programSemesterId: string) {
    const { data, error } = await supabase
      .from("subjects")
      .select(`
      id,
      code,
      name,
      credits,
      subject_type,
      semester,
      year_level,
      description,
      program_semesters (
        semester_number,
        year_level,
        year_label,
        semester_label
      )
    `)
      .eq("program_semester_id", programSemesterId)
      .eq("is_active", true)

    if (error) throw error
    return data || []
  }

  static async getUserProgressForSemester(userId: string, programSemesterId: string) {
    const { data, error } = await supabase
      .from("user_topic_progress")
      .select(`
      *,
      topics (
        id,
        title,
        topic_number,
        chapters (
          id,
          title,
          subjects (
            id,
            name,
            code,
            program_semester_id
          )
        )
      )
    `)
      .eq("user_id", userId)
      .eq("topics.chapters.subjects.program_semester_id", programSemesterId)

    if (error) throw error
    return data || []
  }
}
