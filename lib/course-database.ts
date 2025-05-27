// Mumbai University Course Database
// Based on actual MU curriculum for Computer Engineering

export interface Course {
  id: string
  code: string
  name: string
  credits: number
  type: "core" | "elective" | "foundation"
  semester: number
  year: string
  faculty: string
  department: string[]
  chapters: Chapter[]
  assignments: Assignment[]
  examSchedule: ExamSchedule[]
  resources: Resource[]
}

export interface Chapter {
  id: string
  name: string
  topics: Topic[]
  weightage: number // Percentage for exams
  estimatedHours: number
}

export interface Topic {
  id: string
  name: string
  completed: boolean
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedHours: number
}

export interface Assignment {
  id: string
  name: string
  type: "lab" | "assignment" | "project" | "quiz" | "exam"
  dueDate: string
  completed: boolean
  marks?: number
  totalMarks?: number
}

export interface ExamSchedule {
  id: string
  name: string
  type: "internal" | "external" | "practical"
  date: string
  duration: string
  marks: number
}

export interface Resource {
  id: string
  title: string
  type: "video" | "pdf" | "book" | "link" | "notes"
  url: string
  chapterId?: string
  description: string
  rating: number
  uploadedBy: string
  uploadDate: string
}

// Mumbai University Course Database
export const MUMBAI_UNIVERSITY_COURSES: Course[] = [
  {
    id: "fec101",
    code: "FEC101",
    name: "Applied Mathematics I",
    credits: 3,
    type: "foundation",
    semester: 1,
    year: "FY",
    faculty: "Engineering",
    department: ["All Engineering Branches"],
    chapters: [
      {
        id: "fec101-ch1",
        name: "Differential Calculus",
        weightage: 25,
        estimatedHours: 15,
        topics: [
          {
            id: "fec101-t1",
            name: "Successive Differentiation",
            completed: true,
            difficulty: "Medium",
            estimatedHours: 3,
          },
          { id: "fec101-t2", name: "Leibnitz Theorem", completed: true, difficulty: "Hard", estimatedHours: 4 },
          {
            id: "fec101-t3",
            name: "Partial Differentiation",
            completed: false,
            difficulty: "Medium",
            estimatedHours: 4,
          },
          { id: "fec101-t4", name: "Euler's Theorem", completed: false, difficulty: "Hard", estimatedHours: 4 },
        ],
      },
      {
        id: "fec101-ch2",
        name: "Integral Calculus",
        weightage: 25,
        estimatedHours: 15,
        topics: [
          { id: "fec101-t5", name: "Integration by Parts", completed: false, difficulty: "Medium", estimatedHours: 3 },
          {
            id: "fec101-t6",
            name: "Integration by Substitution",
            completed: false,
            difficulty: "Easy",
            estimatedHours: 3,
          },
          { id: "fec101-t7", name: "Definite Integrals", completed: false, difficulty: "Medium", estimatedHours: 4 },
          {
            id: "fec101-t8",
            name: "Applications of Integration",
            completed: false,
            difficulty: "Hard",
            estimatedHours: 5,
          },
        ],
      },
      {
        id: "fec101-ch3",
        name: "Differential Equations",
        weightage: 25,
        estimatedHours: 12,
        topics: [
          {
            id: "fec101-t9",
            name: "First Order Differential Equations",
            completed: false,
            difficulty: "Medium",
            estimatedHours: 4,
          },
          {
            id: "fec101-t10",
            name: "Linear Differential Equations",
            completed: false,
            difficulty: "Hard",
            estimatedHours: 4,
          },
          { id: "fec101-t11", name: "Applications of DE", completed: false, difficulty: "Hard", estimatedHours: 4 },
        ],
      },
      {
        id: "fec101-ch4",
        name: "Matrices and Linear Algebra",
        weightage: 25,
        estimatedHours: 12,
        topics: [
          { id: "fec101-t12", name: "Matrix Operations", completed: false, difficulty: "Easy", estimatedHours: 3 },
          { id: "fec101-t13", name: "Determinants", completed: false, difficulty: "Medium", estimatedHours: 3 },
          {
            id: "fec101-t14",
            name: "Eigenvalues and Eigenvectors",
            completed: false,
            difficulty: "Hard",
            estimatedHours: 6,
          },
        ],
      },
    ],
    assignments: [
      {
        id: "fec101-a1",
        name: "Assignment 1: Differentiation",
        type: "assignment",
        dueDate: "2024-02-15",
        completed: true,
        marks: 18,
        totalMarks: 20,
      },
      {
        id: "fec101-a2",
        name: "Assignment 2: Integration",
        type: "assignment",
        dueDate: "2024-03-15",
        completed: true,
        marks: 16,
        totalMarks: 20,
      },
      {
        id: "fec101-a3",
        name: "Assignment 3: Differential Equations",
        type: "assignment",
        dueDate: "2024-04-15",
        completed: false,
      },
      { id: "fec101-a4", name: "Assignment 4: Matrices", type: "assignment", dueDate: "2024-05-15", completed: false },
      {
        id: "fec101-q1",
        name: "Quiz 1: Calculus Basics",
        type: "quiz",
        dueDate: "2024-02-28",
        completed: true,
        marks: 9,
        totalMarks: 10,
      },
    ],
    examSchedule: [
      {
        id: "fec101-e1",
        name: "Internal Assessment 1",
        type: "internal",
        date: "2024-03-01",
        duration: "1.5 hours",
        marks: 30,
      },
      {
        id: "fec101-e2",
        name: "Internal Assessment 2",
        type: "internal",
        date: "2024-04-15",
        duration: "1.5 hours",
        marks: 30,
      },
      {
        id: "fec101-e3",
        name: "End Semester Exam",
        type: "external",
        date: "2024-05-20",
        duration: "3 hours",
        marks: 70,
      },
    ],
    resources: [
      {
        id: "fec101-r1",
        title: "Higher Engineering Mathematics by B.S. Grewal",
        type: "book",
        url: "#",
        chapterId: "fec101-ch1",
        description: "Standard textbook for engineering mathematics",
        rating: 4.5,
        uploadedBy: "Faculty",
        uploadDate: "2024-01-15",
      },
      {
        id: "fec101-r2",
        title: "Calculus Video Lectures",
        type: "video",
        url: "https://youtube.com/playlist",
        chapterId: "fec101-ch1",
        description: "Complete video series on differential calculus",
        rating: 4.2,
        uploadedBy: "Prof. Sharma",
        uploadDate: "2024-01-20",
      },
    ],
  },
  {
    id: "pcc2011",
    code: "PCC2011",
    name: "Data Structure",
    credits: 3,
    type: "core",
    semester: 1,
    year: "FY",
    faculty: "Engineering",
    department: ["Computer Engineering", "Information Technology", "Computer Science & Engineering"],
    chapters: [
      {
        id: "pcc2011-ch1",
        name: "Introduction to Data Structures",
        weightage: 15,
        estimatedHours: 8,
        topics: [
          { id: "pcc2011-t1", name: "Basic Concepts", completed: true, difficulty: "Easy", estimatedHours: 2 },
          { id: "pcc2011-t2", name: "Abstract Data Types", completed: true, difficulty: "Medium", estimatedHours: 3 },
          { id: "pcc2011-t3", name: "Algorithm Analysis", completed: false, difficulty: "Medium", estimatedHours: 3 },
        ],
      },
      {
        id: "pcc2011-ch2",
        name: "Arrays and Strings",
        weightage: 20,
        estimatedHours: 12,
        topics: [
          { id: "pcc2011-t4", name: "Array Operations", completed: true, difficulty: "Easy", estimatedHours: 3 },
          {
            id: "pcc2011-t5",
            name: "Multi-dimensional Arrays",
            completed: false,
            difficulty: "Medium",
            estimatedHours: 4,
          },
          { id: "pcc2011-t6", name: "String Operations", completed: false, difficulty: "Medium", estimatedHours: 3 },
          { id: "pcc2011-t7", name: "String Algorithms", completed: false, difficulty: "Hard", estimatedHours: 2 },
        ],
      },
      {
        id: "pcc2011-ch3",
        name: "Linked Lists",
        weightage: 25,
        estimatedHours: 15,
        topics: [
          { id: "pcc2011-t8", name: "Singly Linked Lists", completed: false, difficulty: "Medium", estimatedHours: 4 },
          { id: "pcc2011-t9", name: "Doubly Linked Lists", completed: false, difficulty: "Medium", estimatedHours: 4 },
          { id: "pcc2011-t10", name: "Circular Linked Lists", completed: false, difficulty: "Hard", estimatedHours: 4 },
          {
            id: "pcc2011-t11",
            name: "Applications of Linked Lists",
            completed: false,
            difficulty: "Hard",
            estimatedHours: 3,
          },
        ],
      },
      {
        id: "pcc2011-ch4",
        name: "Stacks and Queues",
        weightage: 25,
        estimatedHours: 12,
        topics: [
          { id: "pcc2011-t12", name: "Stack Operations", completed: false, difficulty: "Medium", estimatedHours: 3 },
          { id: "pcc2011-t13", name: "Stack Applications", completed: false, difficulty: "Medium", estimatedHours: 3 },
          { id: "pcc2011-t14", name: "Queue Operations", completed: false, difficulty: "Medium", estimatedHours: 3 },
          { id: "pcc2011-t15", name: "Priority Queues", completed: false, difficulty: "Hard", estimatedHours: 3 },
        ],
      },
      {
        id: "pcc2011-ch5",
        name: "Trees and Graphs",
        weightage: 15,
        estimatedHours: 10,
        topics: [
          { id: "pcc2011-t16", name: "Binary Trees", completed: false, difficulty: "Hard", estimatedHours: 4 },
          { id: "pcc2011-t17", name: "Tree Traversals", completed: false, difficulty: "Hard", estimatedHours: 3 },
          { id: "pcc2011-t18", name: "Graph Representation", completed: false, difficulty: "Hard", estimatedHours: 3 },
        ],
      },
    ],
    assignments: [
      {
        id: "pcc2011-a1",
        name: "Lab 1: Array Implementation",
        type: "lab",
        dueDate: "2024-02-10",
        completed: true,
        marks: 19,
        totalMarks: 20,
      },
      {
        id: "pcc2011-a2",
        name: "Lab 2: Linked List Implementation",
        type: "lab",
        dueDate: "2024-03-10",
        completed: true,
        marks: 17,
        totalMarks: 20,
      },
      { id: "pcc2011-a3", name: "Lab 3: Stack and Queue", type: "lab", dueDate: "2024-04-10", completed: false },
      {
        id: "pcc2011-a4",
        name: "Project: Data Structure Library",
        type: "project",
        dueDate: "2024-05-10",
        completed: false,
      },
      {
        id: "pcc2011-q1",
        name: "Quiz: Basic Concepts",
        type: "quiz",
        dueDate: "2024-02-25",
        completed: true,
        marks: 8,
        totalMarks: 10,
      },
    ],
    examSchedule: [
      {
        id: "pcc2011-e1",
        name: "Internal Assessment 1",
        type: "internal",
        date: "2024-03-05",
        duration: "1.5 hours",
        marks: 30,
      },
      {
        id: "pcc2011-e2",
        name: "Internal Assessment 2",
        type: "internal",
        date: "2024-04-20",
        duration: "1.5 hours",
        marks: 30,
      },
      {
        id: "pcc2011-e3",
        name: "Practical Exam",
        type: "practical",
        date: "2024-05-15",
        duration: "3 hours",
        marks: 50,
      },
      {
        id: "pcc2011-e4",
        name: "End Semester Exam",
        type: "external",
        date: "2024-05-25",
        duration: "3 hours",
        marks: 70,
      },
    ],
    resources: [
      {
        id: "pcc2011-r1",
        title: "Data Structures and Algorithms by Cormen",
        type: "book",
        url: "#",
        chapterId: "pcc2011-ch1",
        description: "Comprehensive textbook on data structures",
        rating: 4.8,
        uploadedBy: "Faculty",
        uploadDate: "2024-01-15",
      },
      {
        id: "pcc2011-r2",
        title: "Data Structures in C++ Video Series",
        type: "video",
        url: "https://youtube.com/playlist",
        chapterId: "pcc2011-ch2",
        description: "Practical implementation videos",
        rating: 4.3,
        uploadedBy: "Prof. Kumar",
        uploadDate: "2024-01-20",
      },
    ],
  },
  {
    id: "bsc2021",
    code: "BSC2021",
    name: "Physics for Emerging Fields",
    credits: 3,
    type: "elective",
    semester: 1,
    year: "FY",
    faculty: "Engineering",
    department: ["All Engineering Branches"],
    chapters: [
      {
        id: "bsc2021-ch1",
        name: "Quantum Mechanics Fundamentals",
        weightage: 30,
        estimatedHours: 18,
        topics: [
          { id: "bsc2021-t1", name: "Wave-Particle Duality", completed: true, difficulty: "Medium", estimatedHours: 4 },
          { id: "bsc2021-t2", name: "Schrödinger Equation", completed: false, difficulty: "Hard", estimatedHours: 6 },
          { id: "bsc2021-t3", name: "Quantum States", completed: false, difficulty: "Hard", estimatedHours: 4 },
          {
            id: "bsc2021-t4",
            name: "Uncertainty Principle",
            completed: false,
            difficulty: "Medium",
            estimatedHours: 4,
          },
        ],
      },
      {
        id: "bsc2021-ch2",
        name: "Nanotechnology Physics",
        weightage: 25,
        estimatedHours: 15,
        topics: [
          { id: "bsc2021-t5", name: "Nanoscale Phenomena", completed: false, difficulty: "Medium", estimatedHours: 4 },
          { id: "bsc2021-t6", name: "Quantum Confinement", completed: false, difficulty: "Hard", estimatedHours: 5 },
          { id: "bsc2021-t7", name: "Carbon Nanotubes", completed: false, difficulty: "Medium", estimatedHours: 3 },
          { id: "bsc2021-t8", name: "Graphene Properties", completed: false, difficulty: "Medium", estimatedHours: 3 },
        ],
      },
      {
        id: "bsc2021-ch3",
        name: "Photonics and Lasers",
        weightage: 25,
        estimatedHours: 15,
        topics: [
          { id: "bsc2021-t9", name: "Laser Principles", completed: false, difficulty: "Medium", estimatedHours: 4 },
          { id: "bsc2021-t10", name: "Optical Fibers", completed: false, difficulty: "Medium", estimatedHours: 4 },
          { id: "bsc2021-t11", name: "Photonic Crystals", completed: false, difficulty: "Hard", estimatedHours: 4 },
          { id: "bsc2021-t12", name: "Laser Applications", completed: false, difficulty: "Easy", estimatedHours: 3 },
        ],
      },
      {
        id: "bsc2021-ch4",
        name: "Renewable Energy Physics",
        weightage: 20,
        estimatedHours: 12,
        topics: [
          { id: "bsc2021-t13", name: "Solar Cell Physics", completed: false, difficulty: "Medium", estimatedHours: 4 },
          {
            id: "bsc2021-t14",
            name: "Wind Energy Principles",
            completed: false,
            difficulty: "Easy",
            estimatedHours: 3,
          },
          {
            id: "bsc2021-t15",
            name: "Energy Storage Systems",
            completed: false,
            difficulty: "Medium",
            estimatedHours: 3,
          },
          { id: "bsc2021-t16", name: "Fuel Cells", completed: false, difficulty: "Medium", estimatedHours: 2 },
        ],
      },
    ],
    assignments: [
      {
        id: "bsc2021-a1",
        name: "Assignment 1: Quantum Mechanics Problems",
        type: "assignment",
        dueDate: "2024-02-20",
        completed: true,
        marks: 16,
        totalMarks: 20,
      },
      { id: "bsc2021-a2", name: "Lab 1: Laser Experiments", type: "lab", dueDate: "2024-03-20", completed: false },
      {
        id: "bsc2021-a3",
        name: "Project: Renewable Energy Analysis",
        type: "project",
        dueDate: "2024-04-25",
        completed: false,
      },
      {
        id: "bsc2021-q1",
        name: "Quiz: Quantum Basics",
        type: "quiz",
        dueDate: "2024-03-01",
        completed: true,
        marks: 7,
        totalMarks: 10,
      },
    ],
    examSchedule: [
      {
        id: "bsc2021-e1",
        name: "Internal Assessment 1",
        type: "internal",
        date: "2024-03-08",
        duration: "1.5 hours",
        marks: 30,
      },
      {
        id: "bsc2021-e2",
        name: "Internal Assessment 2",
        type: "internal",
        date: "2024-04-22",
        duration: "1.5 hours",
        marks: 30,
      },
      {
        id: "bsc2021-e3",
        name: "Practical Exam",
        type: "practical",
        date: "2024-05-18",
        duration: "2 hours",
        marks: 25,
      },
      {
        id: "bsc2021-e4",
        name: "End Semester Exam",
        type: "external",
        date: "2024-05-28",
        duration: "3 hours",
        marks: 70,
      },
    ],
    resources: [
      {
        id: "bsc2021-r1",
        title: "Modern Physics by Krane",
        type: "book",
        url: "#",
        chapterId: "bsc2021-ch1",
        description: "Comprehensive modern physics textbook",
        rating: 4.4,
        uploadedBy: "Faculty",
        uploadDate: "2024-01-15",
      },
      {
        id: "bsc2021-r2",
        title: "Quantum Physics Lectures",
        type: "video",
        url: "https://youtube.com/playlist",
        chapterId: "bsc2021-ch1",
        description: "MIT OpenCourseWare quantum physics",
        rating: 4.7,
        uploadedBy: "MIT",
        uploadDate: "2024-01-10",
      },
    ],
  },
  {
    id: "bsc2031",
    code: "BSC2031",
    name: "Engineering Materials",
    credits: 3,
    type: "elective",
    semester: 1,
    year: "FY",
    faculty: "Engineering",
    department: ["All Engineering Branches"],
    chapters: [
      {
        id: "bsc2031-ch1",
        name: "Structure of Materials",
        weightage: 25,
        estimatedHours: 15,
        topics: [
          { id: "bsc2031-t1", name: "Atomic Structure", completed: true, difficulty: "Easy", estimatedHours: 3 },
          { id: "bsc2031-t2", name: "Crystal Structures", completed: true, difficulty: "Medium", estimatedHours: 4 },
          { id: "bsc2031-t3", name: "Defects in Crystals", completed: false, difficulty: "Medium", estimatedHours: 4 },
          { id: "bsc2031-t4", name: "Phase Diagrams", completed: false, difficulty: "Hard", estimatedHours: 4 },
        ],
      },
      {
        id: "bsc2031-ch2",
        name: "Mechanical Properties",
        weightage: 30,
        estimatedHours: 18,
        topics: [
          { id: "bsc2031-t5", name: "Stress and Strain", completed: false, difficulty: "Medium", estimatedHours: 4 },
          { id: "bsc2031-t6", name: "Elastic Properties", completed: false, difficulty: "Medium", estimatedHours: 4 },
          { id: "bsc2031-t7", name: "Plastic Deformation", completed: false, difficulty: "Hard", estimatedHours: 5 },
          { id: "bsc2031-t8", name: "Fracture Mechanics", completed: false, difficulty: "Hard", estimatedHours: 5 },
        ],
      },
      {
        id: "bsc2031-ch3",
        name: "Metals and Alloys",
        weightage: 25,
        estimatedHours: 15,
        topics: [
          { id: "bsc2031-t9", name: "Iron and Steel", completed: false, difficulty: "Medium", estimatedHours: 4 },
          { id: "bsc2031-t10", name: "Non-ferrous Metals", completed: false, difficulty: "Medium", estimatedHours: 4 },
          { id: "bsc2031-t11", name: "Heat Treatment", completed: false, difficulty: "Hard", estimatedHours: 4 },
          {
            id: "bsc2031-t12",
            name: "Corrosion and Protection",
            completed: false,
            difficulty: "Medium",
            estimatedHours: 3,
          },
        ],
      },
      {
        id: "bsc2031-ch4",
        name: "Advanced Materials",
        weightage: 20,
        estimatedHours: 12,
        topics: [
          { id: "bsc2031-t13", name: "Polymers", completed: false, difficulty: "Medium", estimatedHours: 3 },
          { id: "bsc2031-t14", name: "Ceramics", completed: false, difficulty: "Medium", estimatedHours: 3 },
          { id: "bsc2031-t15", name: "Composites", completed: false, difficulty: "Hard", estimatedHours: 3 },
          { id: "bsc2031-t16", name: "Smart Materials", completed: false, difficulty: "Hard", estimatedHours: 3 },
        ],
      },
    ],
    assignments: [
      {
        id: "bsc2031-a1",
        name: "Assignment 1: Crystal Structure Analysis",
        type: "assignment",
        dueDate: "2024-02-18",
        completed: true,
        marks: 17,
        totalMarks: 20,
      },
      {
        id: "bsc2031-a2",
        name: "Lab 1: Mechanical Testing",
        type: "lab",
        dueDate: "2024-03-18",
        completed: true,
        marks: 18,
        totalMarks: 20,
      },
      { id: "bsc2031-a3", name: "Lab 2: Heat Treatment", type: "lab", dueDate: "2024-04-18", completed: false },
      {
        id: "bsc2031-a4",
        name: "Project: Material Selection",
        type: "project",
        dueDate: "2024-05-05",
        completed: false,
      },
    ],
    examSchedule: [
      {
        id: "bsc2031-e1",
        name: "Internal Assessment 1",
        type: "internal",
        date: "2024-03-06",
        duration: "1.5 hours",
        marks: 30,
      },
      {
        id: "bsc2031-e2",
        name: "Internal Assessment 2",
        type: "internal",
        date: "2024-04-24",
        duration: "1.5 hours",
        marks: 30,
      },
      {
        id: "bsc2031-e3",
        name: "Practical Exam",
        type: "practical",
        date: "2024-05-16",
        duration: "3 hours",
        marks: 50,
      },
      {
        id: "bsc2031-e4",
        name: "End Semester Exam",
        type: "external",
        date: "2024-05-26",
        duration: "3 hours",
        marks: 70,
      },
    ],
    resources: [
      {
        id: "bsc2031-r1",
        title: "Materials Science and Engineering by Callister",
        type: "book",
        url: "#",
        chapterId: "bsc2031-ch1",
        description: "Standard materials science textbook",
        rating: 4.6,
        uploadedBy: "Faculty",
        uploadDate: "2024-01-15",
      },
      {
        id: "bsc2031-r2",
        title: "Materials Testing Lab Manual",
        type: "pdf",
        url: "#",
        chapterId: "bsc2031-ch2",
        description: "Comprehensive lab procedures",
        rating: 4.2,
        uploadedBy: "Lab Instructor",
        uploadDate: "2024-01-25",
      },
    ],
  },
]

// Helper Functions
export function getCoursesForStudent(
  faculty: string,
  department: string,
  year: string,
  semester: number,
  coreSubject?: string,
  electivePhysics?: string,
  electiveChemistry?: string,
): Course[] {
  const courses = MUMBAI_UNIVERSITY_COURSES.filter((course) => {
    // Filter by faculty, year, and semester
    if (course.faculty !== faculty || course.year !== year || course.semester !== semester) {
      return false
    }

    // For foundation courses, include for all departments
    if (course.type === "foundation") {
      return true
    }

    // For core courses, check if it matches the selected core subject
    if (course.type === "core" && coreSubject) {
      return course.code === coreSubject
    }

    // For elective courses, check if it matches selected electives
    if (course.type === "elective") {
      if (course.code === electivePhysics || course.code === electiveChemistry) {
        return true
      }
    }

    // For department-specific courses
    return course.department.includes(department) || course.department.includes("All Engineering Branches")
  })

  return courses
}

export function calculateCourseProgress(course: Course): number {
  const totalTopics = course.chapters.reduce((acc, chapter) => acc + chapter.topics.length, 0)
  const completedTopics = course.chapters.reduce(
    (acc, chapter) => acc + chapter.topics.filter((topic) => topic.completed).length,
    0,
  )

  return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
}

export function getAssignmentCompletion(course: Course): { completed: number; total: number } {
  const completed = course.assignments.filter((assignment) => assignment.completed).length
  const total = course.assignments.length

  return { completed, total }
}

export function getNextImportantDate(course: Course): string {
  const today = new Date()

  // Get upcoming assignments
  const upcomingAssignments = course.assignments
    .filter((assignment) => !assignment.completed && new Date(assignment.dueDate) > today)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  // Get upcoming exams
  const upcomingExams = course.examSchedule
    .filter((exam) => new Date(exam.date) > today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (upcomingAssignments.length > 0) {
    const nextAssignment = upcomingAssignments[0]
    const daysUntil = Math.ceil((new Date(nextAssignment.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return `${nextAssignment.name}: ${daysUntil} days`
  }

  if (upcomingExams.length > 0) {
    const nextExam = upcomingExams[0]
    const daysUntil = Math.ceil((new Date(nextExam.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return `${nextExam.name}: ${daysUntil} days`
  }

  return "No upcoming deadlines"
}

export function getCourseById(courseId: string): Course | undefined {
  return MUMBAI_UNIVERSITY_COURSES.find((course) => course.id === courseId || course.code === courseId)
}

export function getResourcesForCourse(courseCode: string, chapterId?: string): Resource[] {
  const course = getCourseById(courseCode)
  if (!course) return []

  if (chapterId) {
    return course.resources.filter((resource) => resource.chapterId === chapterId)
  }

  return course.resources
}
