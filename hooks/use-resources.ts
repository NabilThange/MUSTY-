"use client"

import { useState, useEffect } from "react"
import { DatabaseService } from "@/lib/new-database-service"

export type ResourceType = "syllabus" | "pyqs" | "pyq_solutions" | "question_banks" | "peer_notes" | "all"

export interface AcademicContext {
  year: string
  semester: number
  branch: string
}

export interface UseResourcesResult {
  data: any[] | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

// Mock data for fallback
const MOCK_DATA = {
  syllabus: [
    {
      id: "mock-syl-1",
      year: "FE",
      semester: 1,
      subject_code: "FEC101",
      subject_name: "Engineering Mathematics I",
      branch: "COMP",
      pdf_url: "/syllabus/fe-sem1-math1.pdf",
      created_at: "2024-01-01",
      type: "syllabus",
    },
  ],
  pyqs: [
    {
      id: "mock-pyq-1",
      subject_code: "FEC101",
      semester: 1,
      branch: "COMP",
      year: 2023,
      type: "main",
      pdf_url: "/pyqs/fe-sem1-math1-2023.pdf",
      created_at: "2024-01-01",
    },
  ],
  pyq_solutions: [
    {
      id: "mock-sol-1",
      pyq_id: "mock-pyq-1",
      pdf_url: "/pyq-solutions/fe-sem1-math1-2023-sol.pdf",
      created_at: "2024-01-01",
      semester: 1,
      branch: "COMP",
      subject_code: "FEC101",
      pyq: {
        subject_code: "FEC101",
        semester: 1,
        branch: "COMP",
        year: 2023,
        type: "main",
      },
    },
  ],
  question_banks: [
    {
      id: "mock-qb-1",
      subject_code: "FEC101",
      semester: 1,
      branch: "COMP",
      pdf_url: "/question-banks/fe-sem1-math1-qbank.pdf",
      source: "faculty",
      created_at: "2024-01-01",
    },
  ],
  peer_notes: [
    {
      id: "mock-pn-1",
      uploader_name: "Rahul Sharma",
      subject_code: "FEC101",
      semester: 1,
      branch: "COMP",
      pdf_url: "/peer-notes/fe-sem1-math1-rahul.pdf",
      rating: 4.5,
      created_at: "2024-01-01",
    },
  ],
}

export function useResources(type: ResourceType, context: AcademicContext): UseResourcesResult {
  const [data, setData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      let result: any[] = []

      // Try to fetch from database first
      try {
        switch (type) {
          case "syllabus":
            result = await DatabaseService.getSyllabus(context.year, context.semester, context.branch)
            break
          case "pyqs":
            result = await DatabaseService.getPYQs(context.semester, context.branch)
            break
          case "pyq_solutions":
            result = await DatabaseService.getPYQSolutions(context.semester, context.branch)
            break
          case "question_banks":
            result = await DatabaseService.getQuestionBanks(context.semester, context.branch)
            break
          case "peer_notes":
            result = await DatabaseService.getPeerNotes(context.semester, context.branch)
            break
          case "all":
            const allData = await DatabaseService.getAllResources(context.year, context.semester, context.branch)
            result = [
              ...allData.syllabus,
              ...allData.pyqs,
              ...allData.pyq_solutions,
              ...allData.question_banks,
              ...allData.peer_notes,
            ]
            break
          default:
            throw new Error(`Unknown resource type: ${type}`)
        }

        // If no data from database, use mock data
        if (!result || result.length === 0) {
          console.log(`No data from database for ${type}, using mock data`)
          result = getMockDataForType(type, context)
        }
      } catch (dbError) {
        console.warn(`Database error for ${type}, falling back to mock data:`, dbError)
        result = getMockDataForType(type, context)
      }

      setData(result)
    } catch (err) {
      console.error(`Error in useResources for ${type}:`, err)
      setError(err instanceof Error ? err : new Error("Unknown error"))
      // Even on error, provide mock data
      setData(getMockDataForType(type, context))
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = () => {
    fetchData()
  }

  useEffect(() => {
    if (context.year && context.semester && context.branch) {
      fetchData()
    }
  }, [type, context.year, context.semester, context.branch])

  return { data, isLoading, error, refetch }
}

function getMockDataForType(type: ResourceType, context: AcademicContext): any[] {
  const filterByContext = (items: any[]) =>
    items.filter(
      (item) =>
        item.semester === context.semester &&
        item.branch === context.branch &&
        (type === "syllabus" ? item.year === context.year : true),
    )

  switch (type) {
    case "syllabus":
      return filterByContext(MOCK_DATA.syllabus)
    case "pyqs":
      return filterByContext(MOCK_DATA.pyqs)
    case "pyq_solutions":
      return filterByContext(MOCK_DATA.pyq_solutions)
    case "question_banks":
      return filterByContext(MOCK_DATA.question_banks)
    case "peer_notes":
      return filterByContext(MOCK_DATA.peer_notes)
    case "all":
      return [
        ...filterByContext(MOCK_DATA.syllabus),
        ...filterByContext(MOCK_DATA.pyqs),
        ...filterByContext(MOCK_DATA.pyq_solutions),
        ...filterByContext(MOCK_DATA.question_banks),
        ...filterByContext(MOCK_DATA.peer_notes),
      ]
    default:
      return []
  }
}
