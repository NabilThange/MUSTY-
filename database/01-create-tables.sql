-- ============================================================================
-- MUSTY DATABASE SCHEMA - COMPLETE TABLE CREATION
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. SYLLABUS TABLE
-- ============================================================================
CREATE TABLE syllabus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  semester INTEGER NOT NULL,
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  branch TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_syllabus_academic ON syllabus(year, semester, branch);
CREATE INDEX idx_syllabus_subject ON syllabus(subject_code);

-- ============================================================================
-- 2. PYQS TABLE (Previous Year Questions)
-- ============================================================================
CREATE TABLE pyqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code TEXT NOT NULL,
  semester INTEGER NOT NULL,
  branch TEXT NOT NULL,
  year INTEGER NOT NULL,
  type TEXT DEFAULT 'main',
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_pyqs_academic ON pyqs(semester, branch);
CREATE INDEX idx_pyqs_subject ON pyqs(subject_code);
CREATE INDEX idx_pyqs_year ON pyqs(year);

-- ============================================================================
-- 3. PYQ SOLUTIONS TABLE
-- ============================================================================
CREATE TABLE pyq_solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pyq_id UUID REFERENCES pyqs(id) ON DELETE CASCADE,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_pyq_solutions_pyq ON pyq_solutions(pyq_id);

-- ============================================================================
-- 4. QUESTION BANKS TABLE
-- ============================================================================
CREATE TABLE question_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code TEXT NOT NULL,
  semester INTEGER NOT NULL,
  branch TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  source TEXT DEFAULT 'internal',
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_question_banks_academic ON question_banks(semester, branch);
CREATE INDEX idx_question_banks_subject ON question_banks(subject_code);

-- ============================================================================
-- 5. PEER NOTES TABLE
-- ============================================================================
CREATE TABLE peer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_name TEXT,
  subject_code TEXT NOT NULL,
  semester INTEGER NOT NULL,
  branch TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  rating FLOAT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_peer_notes_academic ON peer_notes(semester, branch);
CREATE INDEX idx_peer_notes_subject ON peer_notes(subject_code);
CREATE INDEX idx_peer_notes_rating ON peer_notes(rating);

-- ============================================================================
-- 6. TIMETABLE TABLE
-- ============================================================================
CREATE TABLE timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  year TEXT NOT NULL,
  semester INTEGER NOT NULL,
  branch TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_timetable_academic ON timetable(year, semester, branch);
CREATE INDEX idx_timetable_dates ON timetable(start_date, end_date);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) - Optional for public access
-- ============================================================================
-- Note: Since login is not mandatory, we'll keep tables public for now
-- You can enable RLS later if needed:
-- ALTER TABLE syllabus ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pyqs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pyq_solutions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE question_banks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE peer_notes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Check if all tables were created successfully
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('syllabus', 'pyqs', 'pyq_solutions', 'question_banks', 'peer_notes', 'timetable');
