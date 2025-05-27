-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  year VARCHAR(10) NOT NULL,
  semester VARCHAR(10) NOT NULL,
  branch VARCHAR(50) NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  type VARCHAR(20) NOT NULL CHECK (type IN ('core', 'elective')),
  syllabus_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study resources table
CREATE TABLE IF NOT EXISTS study_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('pyq', 'notes', 'question_bank')),
  subject_code VARCHAR(50) REFERENCES subjects(code),
  file_url TEXT NOT NULL,
  uploader_name VARCHAR(255),
  year VARCHAR(10),
  exam_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI sessions table (for analytics)
CREATE TABLE IF NOT EXISTS ai_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  mode VARCHAR(50) NOT NULL CHECK (mode IN ('chat', 'flashcards', 'quiz', 'mindmap')),
  context_type VARCHAR(50) NOT NULL CHECK (context_type IN ('syllabus', 'upload')),
  academic_context JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_academic ON subjects(year, semester, branch);
CREATE INDEX IF NOT EXISTS idx_study_resources_subject ON study_resources(subject_code);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_created ON ai_sessions(created_at);

-- Insert sample data
INSERT INTO subjects (name, code, year, semester, branch, credits, type, syllabus_url) VALUES
('Engineering Mathematics I', 'FEC101', 'FY', '1', 'COMP', 4, 'core', '/pdfs/engineering-math-1.pdf'),
('Programming Fundamentals', 'PCC101', 'FY', '1', 'COMP', 4, 'core', '/pdfs/programming-fundamentals.pdf'),
('Digital Logic Design', 'PCC102', 'FY', '1', 'COMP', 3, 'core', '/pdfs/digital-logic.pdf'),
('Communication Skills', 'BSC101', 'FY', '1', 'COMP', 2, 'core', '/pdfs/communication-skills.pdf'),
('Engineering Mathematics II', 'FEC102', 'FY', '2', 'COMP', 4, 'core', '/pdfs/engineering-math-2.pdf'),
('Data Structures', 'PCC201', 'SY', '1', 'COMP', 4, 'core', '/pdfs/data-structures.pdf'),
('Computer Graphics', 'PCC202', 'SY', '1', 'COMP', 3, 'core', '/pdfs/computer-graphics.pdf'),
('Database Management', 'PCC301', 'TY', '1', 'COMP', 4, 'core', '/pdfs/database-management.pdf'),
('Machine Learning', 'PCC401', 'BE', '1', 'COMP', 4, 'elective', '/pdfs/machine-learning.pdf'),
('Artificial Intelligence', 'PCC402', 'BE', '1', 'COMP', 4, 'elective', '/pdfs/artificial-intelligence.pdf');

-- Insert sample study resources
INSERT INTO study_resources (title, type, subject_code, file_url, uploader_name, year, exam_type) VALUES
('Programming Fundamentals PYQ 2023', 'pyq', 'PCC101', '/pdfs/pyq-programming-2023.pdf', 'Student Community', '2023', 'Mid-Sem'),
('Data Structures Notes', 'notes', 'PCC201', '/pdfs/notes-data-structures.pdf', 'Rahul Sharma', NULL, NULL),
('Database MCQ Bank', 'question_bank', 'PCC301', '/pdfs/mcq-database.pdf', 'Priya Patel', NULL, NULL),
('Digital Logic PYQ 2022', 'pyq', 'PCC102', '/pdfs/pyq-digital-logic-2022.pdf', 'Student Community', '2022', 'End-Sem');
