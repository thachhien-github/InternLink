-- ============================================================
-- FIX CORRUPTED VIETNAMESE TEXT IN INTERNLINK DATABASE
-- Run this inside the SQL Server container:
--   docker exec -i internlink_api /opt/mssql-tools18/bin/sqlcmd \
--     -S localhost -U sa -P sa -C -d InternLink \
--     -i /dev/stdin < scripts/fix-corrupted-vietnamese.sql
-- ============================================================

-- ============================================================
-- STEP 1: FIND ALL CORRUPTED RECORDS
-- ============================================================
PRINT '=== STEP 1: FINDING CORRUPTED RECORDS ==='

-- Users table
PRINT ''
PRINT '--- Users.FullName with ? ---'
SELECT UserId, FullName, Username, Email
FROM Users
WHERE FullName LIKE '%?%'
ORDER BY FullName;

PRINT ''
PRINT '--- Users.Username with ? ---'
SELECT UserId, FullName, Username
FROM Users
WHERE Username LIKE '%?%'
ORDER BY Username;

-- Students table
PRINT ''
PRINT '--- Students.FullName with ? ---'
SELECT StudentId, StudentCode, FullName, Class, Major
FROM Students
WHERE FullName LIKE '%?%'
ORDER BY FullName;

-- Lecturers table
PRINT ''
PRINT '--- Lecturers.FullName with ? ---'
SELECT LecturerId, StaffCode, FullName, Department
FROM Lecturers
WHERE FullName LIKE '%?%'
ORDER BY FullName;

-- Companies table
PRINT ''
PRINT '--- Companies with ? ---'
SELECT CompanyId, CompanyName, ContactPerson, Industry
FROM Companies
WHERE CompanyName LIKE '%?%'
   OR ContactPerson LIKE '%?%'
   OR Industry LIKE '%?%'
ORDER BY CompanyName;

-- Semesters table
PRINT ''
PRINT '--- Semesters with ? ---'
SELECT SemesterId, Name, Term, Description
FROM Semesters
WHERE Name LIKE '%?%'
   OR Term LIKE '%?%'
   OR Description LIKE '%?%'
ORDER BY Name;

-- Notifications table
PRINT ''
PRINT '--- Notifications with ? ---'
SELECT TOP 50 NotificationId, Title, LEFT(Content, 100) AS ContentPreview
FROM Notifications
WHERE Title LIKE '%?%'
   OR Content LIKE '%?%'
ORDER BY CreatedAt DESC;

-- WeeklyReports table
PRINT ''
PRINT '--- WeeklyReports with ? ---'
SELECT TOP 50 WeeklyReportId, Title, LEFT(Content, 100) AS ContentPreview
FROM WeeklyReports
WHERE Title LIKE '%?%'
   OR Content LIKE '%?%'
   OR LecturerComment LIKE '%?%'
ORDER BY CreatedAt DESC;

-- Feedbacks table
PRINT ''
PRINT '--- Feedbacks with ? ---'
SELECT TOP 50 FeedbackId, LEFT(Comment, 100) AS CommentPreview
FROM Feedbacks
WHERE Comment LIKE '%?%'
ORDER BY CreatedAt DESC;

-- Evaluations table
PRINT ''
PRINT '--- Evaluations with ? ---'
SELECT TOP 50 EvaluationId, LEFT(Comments, 100) AS CommentsPreview,
       LEFT(Strengths, 100) AS StrengthsPreview,
       LEFT(AreasForImprovement, 100) AS AreasPreview
FROM Evaluations
WHERE Comments LIKE '%?%'
   OR Strengths LIKE '%?%'
   OR AreasForImprovement LIKE '%?%'
ORDER BY EvaluatedAt DESC;

-- ============================================================
-- STEP 2: COMMON VIETNAMESE NAME FIXES
-- These cover the most common corruption patterns
-- Add more patterns as you discover them
-- ============================================================
PRINT ''
PRINT '=== STEP 2: APPLYING COMMON FIXES ==='

-- Common surname fixes (Nguyễn, Trần, etc.)
DECLARE @fix TABLE (OldText NVARCHAR(500), NewText NVARCHAR(500))

INSERT @fix (OldText, NewText) VALUES
-- Surnames
(N'Nguy?n', N'Nguyễn'),
(N'Nguy~n', N'Nguyễn'),
(N'Tr?n', N'Trần'),
(N'Tr~n', N'Trần'),
(N'Ho?ng', N'Hoàng'),
(N'Ho~ng', N'Hoàng'),
(N'Ph?n', N'Phan'),
(N'Ph~n', N'Phan'),
(N'V? ', N'Vũ '),
(N'B?i', N'Bùi'),
(N'Đ?ng', N'Đặng'),
(N'Đo?n', N'Đoàn'),
(N'L??ng', N'Đường'),
(N'D??ng', N'Dương'),
(N'L? ', N'Lý '),
(N'Ng? ', N'Ngô '),
(N'T? ', N'Tô '),
(N'Võ ', N'Võ '),
(N'Lâm', N'Lâm'),
(N'Mai', N'Mai'),
(N'Dương', N'Dương'),
(N'Hà ', N'Hà '),
(N'Hồ ', N'Hồ '),
(N'Tạ ', N'Tạ '),
(N'Trương', N'Trương'),
(N'Lý ', N'Lý '),
(N'Đinh', N'Đinh'),
(N'Đỗ ', N'Đỗ '),
(N'Nghễnh', N'Nghệ An'),

-- Common first names
(N'H?i', N'Hội'),
(N'H??ng', N'Hương'),
(N'H??ng', N'Hường'),
(N'Thu?y', N'Thúy'),
(N'Th?o', N'Thảo'),
(N'Thu?y', N'Thuý'),
(N'Tuy?t', N'Tuyết'),
(N'Mai ', N'Mai '),
(N'H?',
N'Hạnh'),
(N'T?m', N'Tâm'),
(N'Tâm', N'Tâm'),
(N'Linh', N'Linh'),
(N'Ph??ng', N'Phương'),
(N'Ph??ng', N'Phượng'),
(N'Ng?c', N'Ngọc'),
(N'Ng?c', N'Ngọc'),
(N'Y?n', N'Yến'),
(N'M?nh', N'Minh'),
(N'Đ?c', N'Đức'),
(N'T?i', N'Tài'),
(N'V?nh', N'Vĩnh'),
(N'Thanh', N'Thanh'),
(N'Ng?c', N'Ngọc'),
(N'Qu?nh', N'Quỳnh'),
(N'Quynh', N'Quỳnh'),
(N'Tu?n', N'Tuấn'),
(N'Tiến', N'Tiến'),
(N'Duy ', N'Duy '),

-- Common middle/context words
(N'Hi?n', N'Hiện'),
(N'công ngh? thu?t', N'công nghệ thông tin'),
(N'C?ng ngh? Thu?t', N'Công nghệ Thông tin'),
(N'C?ng ngh? th?ng tin', N'Công nghệ Thông tin'),
(N'K? thu?t Ph?n m?m', N'Kỹ thuật Phần mềm'),
(N'M?ng m?y tinh', N'Mạng máy tính'),
(N'H? th?ng Th?ng tin', N'Hệ thống Thông tin'),
(N'Khoa C?ng ngh? Th?ng tin', N'Khoa Công nghệ Thông tin');

-- Apply surname fixes to Users
UPDATE u SET
    FullName = CASE
        WHEN u.FullName LIKE '%Nguy?n%' THEN REPLACE(u.FullName, 'Nguy?n', N'Nguyễn')
        WHEN u.FullName LIKE '%Tr?n%' THEN REPLACE(u.FullName, 'Tr?n', N'Trần')
        WHEN u.FullName LIKE '%Ho?ng%' THEN REPLACE(u.FullName, 'Ho?ng', N'Hoàng')
        WHEN u.FullName LIKE '%Hi?n%' THEN REPLACE(u.FullName, 'Hi?n', N'Hiện')
        WHEN u.FullName LIKE '%Thu?y%' THEN REPLACE(u.FullName, 'Thu?y', N'Thúy')
        WHEN u.FullName LIKE '%Th?o%' THEN REPLACE(u.FullName, 'Th?o', N'Thảo')
        WHEN u.FullName LIKE '%Tuy?t%' THEN REPLACE(u.FullName, 'Tuy?t', N'Tuyết')
        WHEN u.FullName LIKE '%H??ng%' THEN REPLACE(u.FullName, 'H??ng', N'Hương')
        WHEN u.FullName LIKE '%Ph??ng%' THEN REPLACE(u.FullName, 'Ph??ng', N'Phương')
        WHEN u.FullName LIKE '%Ng?c%' THEN REPLACE(u.FullName, 'Ng?c', N'Ngọc')
        WHEN u.FullName LIKE '%Y?n%' THEN REPLACE(u.FullName, 'Y?n', N'Yến')
        WHEN u.FullName LIKE '%M?nh%' THEN REPLACE(u.FullName, 'M?nh', N'Minh')
        WHEN u.FullName LIKE '%Đ?c%' THEN REPLACE(u.FullName, 'Đ?c', N'Đức')
        WHEN u.FullName LIKE '%T?i%' THEN REPLACE(u.FullName, 'T?i', N'Tài')
        WHEN u.FullName LIKE '%V?nh%' THEN REPLACE(u.FullName, 'V?nh', N'Vĩnh')
        WHEN u.FullName LIKE '%B?i%' THEN REPLACE(u.FullName, 'B?i', N'Bùi')
        WHEN u.FullName LIKE '%Đo?n%' THEN REPLACE(u.FullName, 'Đo?n', N'Đoàn')
        WHEN u.FullName LIKE '%Tu?n%' THEN REPLACE(u.FullName, 'Tu?n', N'Tuấn')
        WHEN u.FullName LIKE '%Qu?nh%' THEN REPLACE(u.FullName, 'Qu?nh', N'Quỳnh')
        WHEN u.FullName LIKE '%V? %' THEN REPLACE(u.FullName, 'V? ', N'Vũ ')
        ELSE u.FullName
    END
FROM Users u
WHERE u.FullName LIKE '%?%';

-- Apply same fixes to Students
UPDATE s SET
    FullName = CASE
        WHEN s.FullName LIKE '%Nguy?n%' THEN REPLACE(s.FullName, 'Nguy?n', N'Nguyễn')
        WHEN s.FullName LIKE '%Tr?n%' THEN REPLACE(s.FullName, 'Tr?n', N'Trần')
        WHEN s.FullName LIKE '%Ho?ng%' THEN REPLACE(s.FullName, 'Ho?ng', N'Hoàng')
        WHEN s.FullName LIKE '%Hi?n%' THEN REPLACE(s.FullName, 'Hi?n', N'Hiện')
        WHEN s.FullName LIKE '%Thu?y%' THEN REPLACE(s.FullName, 'Thu?y', N'Thúy')
        WHEN s.FullName LIKE '%Th?o%' THEN REPLACE(s.FullName, 'Th?o', N'Thảo')
        WHEN s.FullName LIKE '%Tuy?t%' THEN REPLACE(s.FullName, 'Tuy?t', N'Tuyết')
        WHEN s.FullName LIKE '%H??ng%' THEN REPLACE(s.FullName, 'H??ng', N'Hương')
        WHEN s.FullName LIKE '%Ph??ng%' THEN REPLACE(s.FullName, 'Ph??ng', N'Phương')
        WHEN s.FullName LIKE '%Ng?c%' THEN REPLACE(s.FullName, 'Ng?c', N'Ngọc')
        WHEN s.FullName LIKE '%Y?n%' THEN REPLACE(s.FullName, 'Y?n', N'Yến')
        WHEN s.FullName LIKE '%M?nh%' THEN REPLACE(s.FullName, 'M?nh', N'Minh')
        WHEN s.FullName LIKE '%Đ?c%' THEN REPLACE(s.FullName, 'Đ?c', N'Đức')
        WHEN s.FullName LIKE '%T?i%' THEN REPLACE(s.FullName, 'T?i', N'Tài')
        WHEN s.FullName LIKE '%V?nh%' THEN REPLACE(s.FullName, 'V?nh', N'Vĩnh')
        WHEN s.FullName LIKE '%B?i%' THEN REPLACE(s.FullName, 'B?i', N'Bùi')
        WHEN s.FullName LIKE '%Đo?n%' THEN REPLACE(s.FullName, 'Đo?n', N'Đoàn')
        WHEN s.FullName LIKE '%Tu?n%' THEN REPLACE(s.FullName, 'Tu?n', N'Tuấn')
        WHEN s.FullName LIKE '%Qu?nh%' THEN REPLACE(s.FullName, 'Qu?nh', N'Quỳnh')
        WHEN s.FullName LIKE '%V? %' THEN REPLACE(s.FullName, 'V? ', N'Vũ ')
        WHEN s.FullName LIKE '%D??ng%' THEN REPLACE(s.FullName, 'D??ng', N'Dương')
        WHEN s.FullName LIKE '%L? %' THEN REPLACE(s.FullName, 'L? ', N'Lý ')
        WHEN s.FullName LIKE '%L??ng%' THEN REPLACE(s.FullName, 'L??ng', N'Đường')
        ELSE s.FullName
    END
FROM Students s
WHERE s.FullName LIKE '%?%';

-- Apply same fixes to Lecturers
UPDATE l SET
    FullName = CASE
        WHEN l.FullName LIKE '%Nguy?n%' THEN REPLACE(l.FullName, 'Nguy?n', N'Nguyễn')
        WHEN l.FullName LIKE '%Tr?n%' THEN REPLACE(l.FullName, 'Tr?n', N'Trần')
        WHEN l.FullName LIKE '%Ho?ng%' THEN REPLACE(l.FullName, 'Ho?ng', N'Hoàng')
        WHEN l.FullName LIKE '%Hi?n%' THEN REPLACE(l.FullName, 'Hi?n', N'Hiện')
        WHEN l.FullName LIKE '%Thu?y%' THEN REPLACE(l.FullName, 'Thu?y', N'Thúy')
        WHEN l.FullName LIKE '%Th?o%' THEN REPLACE(l.FullName, 'Th?o', N'Thảo')
        WHEN l.FullName LIKE '%Tuy?t%' THEN REPLACE(l.FullName, 'Tuy?t', N'Tuyết')
        WHEN l.FullName LIKE '%H??ng%' THEN REPLACE(l.FullName, 'H??ng', N'Hương')
        WHEN l.FullName LIKE '%Ph??ng%' THEN REPLACE(l.FullName, 'Ph??ng', N'Phương')
        WHEN l.FullName LIKE '%Ng?c%' THEN REPLACE(l.FullName, 'Ng?c', N'Ngọc')
        WHEN l.FullName LIKE '%Y?n%' THEN REPLACE(l.FullName, 'Y?n', N'Yến')
        WHEN l.FullName LIKE '%M?nh%' THEN REPLACE(l.FullName, 'M?nh', N'Minh')
        WHEN l.FullName LIKE '%Đ?c%' THEN REPLACE(l.FullName, 'Đ?c', N'Đức')
        WHEN l.FullName LIKE '%T?i%' THEN REPLACE(l.FullName, 'T?i', N'Tài')
        WHEN l.FullName LIKE '%V?nh%' THEN REPLACE(l.FullName, 'V?nh', N'Vĩnh')
        WHEN l.FullName LIKE '%B?i%' THEN REPLACE(l.FullName, 'B?i', N'Bùi')
        WHEN l.FullName LIKE '%Đo?n%' THEN REPLACE(l.FullName, 'Đo?n', N'Đoàn')
        WHEN l.FullName LIKE '%Tu?n%' THEN REPLACE(l.FullName, 'Tu?n', N'Tuấn')
        WHEN l.FullName LIKE '%Qu?nh%' THEN REPLACE(l.FullName, 'Qu?nh', N'Quỳnh')
        WHEN l.FullName LIKE '%V? %' THEN REPLACE(l.FullName, 'V? ', N'Vũ ')
        WHEN l.FullName LIKE '%D??ng%' THEN REPLACE(l.FullName, 'D??ng', N'Dương')
        WHEN l.FullName LIKE '%L? %' THEN REPLACE(l.FullName, 'L? ', N'Lý ')
        WHEN l.FullName LIKE '%L??ng%' THEN REPLACE(l.FullName, 'L??ng', N'Đường')
        ELSE l.FullName
    END
FROM Lecturers l
WHERE l.FullName LIKE '%?%';

-- Fix Companies too
UPDATE c SET
    CompanyName = CASE
        WHEN c.CompanyName LIKE '%C?ng ngh?%' THEN REPLACE(REPLACE(c.CompanyName, 'C?ng ngh?', N'Công nghệ'), 'thu?t', N'Thông tin')
        ELSE c.CompanyName
    END,
    ContactPerson = CASE
        WHEN c.ContactPerson LIKE '%Nguy?n%' THEN REPLACE(c.ContactPerson, 'Nguy?n', N'Nguyễn')
        WHEN c.ContactPerson LIKE '%Tr?n%' THEN REPLACE(c.ContactPerson, 'Tr?n', N'Trần')
        WHEN c.ContactPerson LIKE '%Hi?n%' THEN REPLACE(c.ContactPerson, 'Hi?n', N'Hiện')
        ELSE c.ContactPerson
    END,
    Industry = CASE
        WHEN c.Industry LIKE '%C?ng ngh?%' THEN REPLACE(c.Industry, 'C?ng ngh?', N'Công nghệ')
        WHEN c.Industry LIKE '%thu?t%' THEN REPLACE(c.Industry, 'thu?t', N'Thông tin')
        WHEN c.Industry LIKE '%M?ng%' THEN REPLACE(c.Industry, 'M?ng', N'Mạng')
        WHEN c.Industry LIKE '%Ph?n m?m%' THEN REPLACE(c.Industry, 'Ph?n m?m', N'Phần mềm')
        ELSE c.Industry
    END
FROM Companies c
WHERE c.CompanyName LIKE '%?%'
   OR c.ContactPerson LIKE '%?%'
   OR c.Industry LIKE '%?%';

-- Fix Semesters
UPDATE sem SET
    Name = CASE
        WHEN sem.Name LIKE '%H?c ky%' THEN REPLACE(sem.Name, 'H?c ky', N'Học kỳ')
        ELSE sem.Name
    END,
    Term = CASE
        WHEN sem.Term LIKE '%H?c ky%' THEN REPLACE(sem.Term, 'H?c ky', N'Học kỳ')
        ELSE sem.Term
    END
FROM Semesters sem
WHERE sem.Name LIKE '%?%'
   OR sem.Term LIKE '%?%';

-- ============================================================
-- STEP 3: VERIFY RESULTS
-- ============================================================
PRINT ''
PRINT '=== STEP 3: VERIFYING RESULTS ==='

PRINT ''
PRINT '--- Remaining Users with ? ---'
SELECT UserId, FullName, Username FROM Users WHERE FullName LIKE '%?%' OR Username LIKE '%?%';

PRINT ''
PRINT '--- Remaining Students with ? ---'
SELECT StudentId, FullName, StudentCode FROM Students WHERE FullName LIKE '%?%';

PRINT ''
PRINT '--- Remaining Lecturers with ? ---'
SELECT LecturerId, FullName, StaffCode FROM Lecturers WHERE FullName LIKE '%?%';

PRINT ''
PRINT '--- Remaining Companies with ? ---'
SELECT CompanyId, CompanyName, ContactPerson FROM Companies
WHERE CompanyName LIKE '%?%' OR ContactPerson LIKE '%?%' OR Industry LIKE '%?%';

PRINT ''
PRINT '=== FIX COMPLETE ==='
PRINT 'If records remain above, they need manual review with correct Vietnamese text.'
