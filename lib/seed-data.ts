export const SAMPLE_SUBJECTS = [
  // First Year Computer Engineering
  {
    name: "Engineering Mathematics I",
    code: "FEC101",
    year: "FY",
    semester: "1",
    branch: "COMP",
    credits: 4,
    type: "core",
    syllabus_url: "/pdfs/engineering-math-1.pdf",
  },
  {
    name: "Programming Fundamentals",
    code: "PCC101",
    year: "FY",
    semester: "1",
    branch: "COMP",
    credits: 4,
    type: "core",
    syllabus_url: "/pdfs/programming-fundamentals.pdf",
  },
  {
    name: "Digital Logic Design",
    code: "PCC102",
    year: "FY",
    semester: "1",
    branch: "COMP",
    credits: 3,
    type: "core",
    syllabus_url: "/pdfs/digital-logic.pdf",
  },
  {
    name: "Communication Skills",
    code: "BSC101",
    year: "FY",
    semester: "1",
    branch: "COMP",
    credits: 2,
    type: "core",
    syllabus_url: "/pdfs/communication-skills.pdf",
  },

  // Second Year Computer Engineering
  {
    name: "Data Structures",
    code: "PCC201",
    year: "SY",
    semester: "1",
    branch: "COMP",
    credits: 4,
    type: "core",
    syllabus_url: "/pdfs/data-structures.pdf",
  },
  {
    name: "Computer Graphics",
    code: "PCC202",
    year: "SY",
    semester: "1",
    branch: "COMP",
    credits: 3,
    type: "core",
    syllabus_url: "/pdfs/computer-graphics.pdf",
  },
  {
    name: "Operating Systems",
    code: "PCC203",
    year: "SY",
    semester: "2",
    branch: "COMP",
    credits: 4,
    type: "core",
    syllabus_url: "/pdfs/operating-systems.pdf",
  },

  // Third Year Computer Engineering
  {
    name: "Database Management",
    code: "PCC301",
    year: "TY",
    semester: "1",
    branch: "COMP",
    credits: 4,
    type: "core",
    syllabus_url: "/pdfs/database-management.pdf",
  },
  {
    name: "Computer Networks",
    code: "PCC302",
    year: "TY",
    semester: "1",
    branch: "COMP",
    credits: 4,
    type: "core",
    syllabus_url: "/pdfs/computer-networks.pdf",
  },

  // Final Year Computer Engineering
  {
    name: "Machine Learning",
    code: "PCC401",
    year: "BE",
    semester: "1",
    branch: "COMP",
    credits: 4,
    type: "elective",
    syllabus_url: "/pdfs/machine-learning.pdf",
  },
  {
    name: "Artificial Intelligence",
    code: "PCC402",
    year: "BE",
    semester: "1",
    branch: "COMP",
    credits: 4,
    type: "elective",
    syllabus_url: "/pdfs/artificial-intelligence.pdf",
  },
]

export const SAMPLE_RESOURCES = [
  {
    title: "Programming Fundamentals PYQ 2023",
    type: "pyq",
    subject_code: "PCC101",
    file_url: "/pdfs/pyq-programming-2023.pdf",
    uploader_name: "Student Community",
    year: "2023",
    exam_type: "Mid-Sem",
  },
  {
    title: "Data Structures Complete Notes",
    type: "notes",
    subject_code: "PCC201",
    file_url: "/pdfs/notes-data-structures.pdf",
    uploader_name: "Rahul Sharma",
  },
  {
    title: "Database MCQ Question Bank",
    type: "question_bank",
    subject_code: "PCC301",
    file_url: "/pdfs/mcq-database.pdf",
    uploader_name: "Priya Patel",
  },
  {
    title: "Digital Logic PYQ 2022",
    type: "pyq",
    subject_code: "PCC102",
    file_url: "/pdfs/pyq-digital-logic-2022.pdf",
    uploader_name: "Student Community",
    year: "2022",
    exam_type: "End-Sem",
  },
  {
    title: "Computer Graphics Lab Manual",
    type: "notes",
    subject_code: "PCC202",
    file_url: "/pdfs/cg-lab-manual.pdf",
    uploader_name: "Lab Instructor",
  },
  {
    title: "Operating Systems Practice Questions",
    type: "question_bank",
    subject_code: "PCC203",
    file_url: "/pdfs/os-practice.pdf",
    uploader_name: "Study Group",
  },
]

export async function seedDatabase() {
  console.log("Seeding database with sample data...")

  try {
    // Note: In a real implementation, you would insert this data into Supabase
    // For now, we'll just log it as the database operations are mocked
    console.log("Sample subjects:", SAMPLE_SUBJECTS.length)
    console.log("Sample resources:", SAMPLE_RESOURCES.length)
    console.log("Database seeding completed!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}
