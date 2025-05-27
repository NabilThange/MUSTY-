-- ============================================================================
-- MUSTY SAMPLE DATA INSERTION
-- ============================================================================

-- ============================================================================
-- 1. SYLLABUS DATA
-- ============================================================================
INSERT INTO syllabus (year, semester, subject_code, subject_name, branch, pdf_url) VALUES
-- First Year Engineering (FE) - Semester 1
('FE', 1, 'FEC101', 'Engineering Mathematics I', 'COMP', '/syllabus/fe-sem1-math1.pdf'),
('FE', 1, 'FEC102', 'Engineering Physics I', 'COMP', '/syllabus/fe-sem1-physics1.pdf'),
('FE', 1, 'FEC103', 'Engineering Chemistry I', 'COMP', '/syllabus/fe-sem1-chemistry1.pdf'),
('FE', 1, 'FEC104', 'Engineering Mechanics', 'COMP', '/syllabus/fe-sem1-mechanics.pdf'),
('FE', 1, 'FEC105', 'Basic Electrical Engineering', 'COMP', '/syllabus/fe-sem1-electrical.pdf'),

-- First Year Engineering (FE) - Semester 2
('FE', 2, 'FEC201', 'Engineering Mathematics II', 'COMP', '/syllabus/fe-sem2-math2.pdf'),
('FE', 2, 'FEC202', 'Engineering Physics II', 'COMP', '/syllabus/fe-sem2-physics2.pdf'),
('FE', 2, 'FEC203', 'Engineering Chemistry II', 'COMP', '/syllabus/fe-sem2-chemistry2.pdf'),
('FE', 2, 'FEC204', 'Engineering Graphics', 'COMP', '/syllabus/fe-sem2-graphics.pdf'),
('FE', 2, 'FEC205', 'C Programming', 'COMP', '/syllabus/fe-sem2-cprogramming.pdf'),

-- Second Year Engineering (SE) - Semester 3 - Computer Engineering
('SE', 3, 'CSC301', 'Data Structures', 'COMP', '/syllabus/se-sem3-datastructures.pdf'),
('SE', 3, 'CSC302', 'Computer Organization', 'COMP', '/syllabus/se-sem3-computerorg.pdf'),
('SE', 3, 'CSC303', 'Discrete Mathematics', 'COMP', '/syllabus/se-sem3-discretemath.pdf'),
('SE', 3, 'CSC304', 'Digital Logic Design', 'COMP', '/syllabus/se-sem3-digitallogic.pdf'),
('SE', 3, 'CSC305', 'Object Oriented Programming', 'COMP', '/syllabus/se-sem3-oop.pdf');

-- ============================================================================
-- 2. PYQS DATA (Previous Year Questions)
-- ============================================================================
INSERT INTO pyqs (subject_code, semester, branch, year, type, pdf_url) VALUES
-- FE Semester 1 PYQs
('FEC101', 1, 'COMP', 2023, 'main', '/pyqs/fe-sem1-math1-2023.pdf'),
('FEC101', 1, 'COMP', 2022, 'main', '/pyqs/fe-sem1-math1-2022.pdf'),
('FEC102', 1, 'COMP', 2023, 'main', '/pyqs/fe-sem1-physics1-2023.pdf'),
('FEC103', 1, 'COMP', 2023, 'main', '/pyqs/fe-sem1-chemistry1-2023.pdf'),
('FEC104', 1, 'COMP', 2023, 'main', '/pyqs/fe-sem1-mechanics-2023.pdf'),

-- FE Semester 2 PYQs
('FEC201', 2, 'COMP', 2023, 'main', '/pyqs/fe-sem2-math2-2023.pdf'),
('FEC202', 2, 'COMP', 2023, 'main', '/pyqs/fe-sem2-physics2-2023.pdf'),
('FEC205', 2, 'COMP', 2023, 'main', '/pyqs/fe-sem2-cprogramming-2023.pdf'),

-- SE Semester 3 PYQs
('CSC301', 3, 'COMP', 2023, 'main', '/pyqs/se-sem3-datastructures-2023.pdf'),
('CSC302', 3, 'COMP', 2023, 'main', '/pyqs/se-sem3-computerorg-2023.pdf'),
('CSC305', 3, 'COMP', 2023, 'main', '/pyqs/se-sem3-oop-2023.pdf');

-- ============================================================================
-- 3. PYQ SOLUTIONS DATA
-- ============================================================================
INSERT INTO pyq_solutions (pyq_id, pdf_url) 
SELECT id, CONCAT('/pyq-solutions/', subject_code, '-', year, '-solutions.pdf')
FROM pyqs 
WHERE year = 2023 AND subject_code IN ('FEC101', 'FEC201', 'CSC301');

-- ============================================================================
-- 4. QUESTION BANKS DATA
-- ============================================================================
INSERT INTO question_banks (subject_code, semester, branch, pdf_url, source) VALUES
-- FE Question Banks
('FEC101', 1, 'COMP', '/question-banks/fe-sem1-math1-qbank.pdf', 'internal'),
('FEC102', 1, 'COMP', '/question-banks/fe-sem1-physics1-qbank.pdf', 'internal'),
('FEC205', 2, 'COMP', '/question-banks/fe-sem2-cprogramming-qbank.pdf', 'faculty'),

-- SE Question Banks
('CSC301', 3, 'COMP', '/question-banks/se-sem3-datastructures-qbank.pdf', 'internal'),
('CSC302', 3, 'COMP', '/question-banks/se-sem3-computerorg-qbank.pdf', 'internal'),
('CSC305', 3, 'COMP', '/question-banks/se-sem3-oop-qbank.pdf', 'faculty');

-- ============================================================================
-- 5. PEER NOTES DATA
-- ============================================================================
INSERT INTO peer_notes (uploader_name, subject_code, semester, branch, pdf_url, rating) VALUES
-- FE Peer Notes
('Rahul Sharma', 'FEC101', 1, 'COMP', '/peer-notes/fe-sem1-math1-rahul.pdf', 4.5),
('Priya Patel', 'FEC102', 1, 'COMP', '/peer-notes/fe-sem1-physics1-priya.pdf', 4.2),
('Amit Kumar', 'FEC205', 2, 'COMP', '/peer-notes/fe-sem2-cprogramming-amit.pdf', 4.8),
('Sneha Joshi', 'FEC201', 2, 'COMP', '/peer-notes/fe-sem2-math2-sneha.pdf', 4.3),

-- SE Peer Notes
('Vikram Singh', 'CSC301', 3, 'COMP', '/peer-notes/se-sem3-datastructures-vikram.pdf', 4.7),
('Anita Desai', 'CSC302', 3, 'COMP', '/peer-notes/se-sem3-computerorg-anita.pdf', 4.4),
('Rohan Mehta', 'CSC305', 3, 'COMP', '/peer-notes/se-sem3-oop-rohan.pdf', 4.6);

-- ============================================================================
-- 6. TIMETABLE DATA
-- ============================================================================
INSERT INTO timetable (title, start_date, end_date, year, semester, branch, pdf_url) VALUES
-- FE Timetables
('FE Semester 1 End Sem Exam 2024', '2024-05-15', '2024-05-30', 'FE', 1, 'COMP', '/timetables/fe-sem1-endsem-2024.pdf'),
('FE Semester 2 Mid Sem Exam 2024', '2024-03-10', '2024-03-20', 'FE', 2, 'COMP', '/timetables/fe-sem2-midsem-2024.pdf'),

-- SE Timetables
('SE Semester 3 End Sem Exam 2024', '2024-05-20', '2024-06-05', 'SE', 3, 'COMP', '/timetables/se-sem3-endsem-2024.pdf'),
('SE Semester 3 Practical Exam 2024', '2024-04-15', '2024-04-25', 'SE', 3, 'COMP', '/timetables/se-sem3-practical-2024.pdf');

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Check data insertion
SELECT 'syllabus' as table_name, COUNT(*) as record_count FROM syllabus
UNION ALL
SELECT 'pyqs', COUNT(*) FROM pyqs
UNION ALL
SELECT 'pyq_solutions', COUNT(*) FROM pyq_solutions
UNION ALL
SELECT 'question_banks', COUNT(*) FROM question_banks
UNION ALL
SELECT 'peer_notes', COUNT(*) FROM peer_notes
UNION ALL
SELECT 'timetable', COUNT(*) FROM timetable;

-- Sample query to test academic context filtering
SELECT subject_name, subject_code 
FROM syllabus 
WHERE year = 'FE' AND semester = 1 AND branch = 'COMP'
ORDER BY subject_code;
