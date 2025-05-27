// Mock data for FY Semester 1 & 2 with distinct subjects

export const FY_SEMESTER_1_SUBJECTS = [
  {
    id: "fy-s1-math1",
    code: "BSC101",
    name: "Applied Mathematics – I",
    credits: 3,
    subject_type: "foundation",
    semester: 1,
    year_level: "FY",
    description: "Differential equations, matrices, and numerical methods",
    chapters: [
      {
        id: "ch1-math1",
        title: "Differential Equations",
        topics: ["Exact Equations", "Linear Equations", "Applications"],
      },
      {
        id: "ch2-math1",
        title: "Matrices and Determinants",
        topics: ["Matrix Operations", "Eigenvalues", "Linear Systems"],
      },
    ],
  },
  {
    id: "fy-s1-physics",
    code: "BSC102X",
    name: "Applied Physics – I",
    credits: 2,
    subject_type: "foundation",
    semester: 1,
    year_level: "FY",
    description: "Mechanics, waves, and thermodynamics",
    chapters: [
      {
        id: "ch1-physics",
        title: "Mechanics",
        topics: ["Newton's Laws", "Work & Energy", "Rotational Motion"],
      },
      {
        id: "ch2-physics",
        title: "Wave Motion",
        topics: ["Simple Harmonic Motion", "Wave Properties", "Sound Waves"],
      },
    ],
  },
  {
    id: "fy-s1-chemistry",
    code: "BSC103X",
    name: "Applied Chemistry – I",
    credits: 2,
    subject_type: "foundation",
    semester: 1,
    year_level: "FY",
    description: "Atomic structure, bonding, and basic reactions",
    chapters: [
      {
        id: "ch1-chemistry",
        title: "Atomic Structure",
        topics: ["Quantum Numbers", "Electronic Configuration", "Periodic Properties"],
      },
    ],
  },
  {
    id: "fy-s1-mechanics",
    code: "ESC101",
    name: "Engineering Mechanics",
    credits: 3,
    subject_type: "core",
    semester: 1,
    year_level: "FY",
    description: "Statics and dynamics of engineering systems",
    chapters: [
      {
        id: "ch1-mechanics",
        title: "Statics",
        topics: ["Force Systems", "Equilibrium", "Friction"],
      },
    ],
  },
]

export const FY_SEMESTER_2_SUBJECTS = [
  {
    id: "fy-s2-math2",
    code: "BSC201",
    name: "Applied Mathematics – II",
    credits: 3,
    subject_type: "foundation",
    semester: 2,
    year_level: "FY",
    description: "Complex numbers, partial differentiation, Laplace transforms",
    chapters: [
      {
        id: "ch1-math2",
        title: "Complex Numbers",
        topics: ["Complex Functions", "Conformal Mapping", "Residue Theorem"],
      },
      {
        id: "ch2-math2",
        title: "Laplace Transforms",
        topics: ["Transform Properties", "Inverse Transforms", "Applications"],
      },
    ],
  },
  {
    id: "fy-s2-physics-emerging",
    code: "BSC2021",
    name: "Physics for Emerging Fields",
    credits: 2,
    subject_type: "elective",
    semester: 2,
    year_level: "FY",
    description: "Modern physics applications in emerging technologies",
    chapters: [
      {
        id: "ch1-emerging",
        title: "Solar Energy",
        topics: ["Photovoltaic Effect", "Solar Cells", "Energy Conversion"],
      },
      {
        id: "ch2-emerging",
        title: "MEMS Technology",
        topics: ["Micro-fabrication", "Sensors", "Actuators"],
      },
    ],
  },
  {
    id: "fy-s2-graphics",
    code: "ESC201",
    name: "Engineering Graphics",
    credits: 3,
    subject_type: "core",
    semester: 2,
    year_level: "FY",
    description: "Technical drawing and CAD fundamentals",
    chapters: [
      {
        id: "ch1-graphics",
        title: "Orthographic Projections",
        topics: ["Multi-view Drawing", "Sectional Views", "Dimensioning"],
      },
      {
        id: "ch2-graphics",
        title: "Isometric Projections",
        topics: ["Isometric Views", "3D Visualization", "CAD Basics"],
      },
    ],
  },
  {
    id: "fy-s2-datastructures",
    code: "PCC2011",
    name: "Data Structures",
    credits: 2,
    subject_type: "core",
    semester: 2,
    year_level: "FY",
    description: "Fundamental data structures and algorithms",
    chapters: [
      {
        id: "ch1-ds",
        title: "Linear Data Structures",
        topics: ["Arrays", "Stacks", "Queues", "Linked Lists"],
      },
      {
        id: "ch2-ds",
        title: "Non-Linear Data Structures",
        topics: ["Trees", "Binary Search Trees", "Graph Basics"],
      },
    ],
  },
  {
    id: "fy-s2-python",
    code: "VSEC202",
    name: "Python Programming",
    credits: 2,
    subject_type: "elective",
    semester: 2,
    year_level: "FY",
    description: "Python programming fundamentals and applications",
    chapters: [
      {
        id: "ch1-python",
        title: "Python Basics",
        topics: ["Syntax", "Data Types", "Control Structures"],
      },
      {
        id: "ch2-python",
        title: "Object-Oriented Programming",
        topics: ["Classes", "Inheritance", "Polymorphism"],
      },
    ],
  },
]

export function getMockSubjectsForSemester(semester: number): any[] {
  switch (semester) {
    case 1:
      return FY_SEMESTER_1_SUBJECTS
    case 2:
      return FY_SEMESTER_2_SUBJECTS
    default:
      return []
  }
}

export function getMockProgressForSemester(semester: number, userId: string): any[] {
  const subjects = getMockSubjectsForSemester(semester)
  const progress: any[] = []

  subjects.forEach((subject) => {
    subject.chapters.forEach((chapter: any) => {
      chapter.topics.forEach((topic: string, index: number) => {
        progress.push({
          id: `progress-${subject.id}-${chapter.id}-${index}`,
          user_id: userId,
          topic_id: `topic-${subject.id}-${chapter.id}-${index}`,
          is_completed: Math.random() > 0.6, // Random completion for demo
          completion_percentage: Math.floor(Math.random() * 100),
          topics: {
            id: `topic-${subject.id}-${chapter.id}-${index}`,
            title: topic,
            chapters: {
              id: chapter.id,
              title: chapter.title,
              subjects: {
                id: subject.id,
                name: subject.name,
                code: subject.code,
              },
            },
          },
        })
      })
    })
  })

  return progress
}
