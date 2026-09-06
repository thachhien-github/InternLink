-- Reset demo data: wipe all business data, keep ONLY the 'admin' user (Password123!)
-- Child tables first (FK order), then parents. Runs in one transaction — rolls back on error.
SET XACT_ABORT ON;
SET QUOTED_IDENTIFIER ON;
BEGIN TRAN;

DELETE FROM Feedbacks;
DELETE FROM WeeklyReports;
DELETE FROM Documents;
DELETE FROM Submissions;
DELETE FROM Evaluations;
DELETE FROM EvaluationRubricCriteria;
DELETE FROM EvaluationRubrics;
DELETE FROM SemesterCompanies;
DELETE FROM SemesterLecturers;
DELETE FROM Internships;
DELETE FROM AccountRequests;
DELETE FROM Notifications;
DELETE FROM RefreshTokens;
DELETE FROM PasswordResetTokens;
DELETE FROM Students;
DELETE FROM Lecturers;
DELETE FROM Companies;
DELETE FROM Semesters;

-- Keep the demo admin account only
DELETE FROM Users WHERE Username <> N'admin';

COMMIT;

-- Report what remains
SELECT 'Users' AS TableName, COUNT(*) AS Remaining FROM Users
UNION ALL SELECT 'Semesters', COUNT(*) FROM Semesters
UNION ALL SELECT 'Students', COUNT(*) FROM Students
UNION ALL SELECT 'Lecturers', COUNT(*) FROM Lecturers
UNION ALL SELECT 'Companies', COUNT(*) FROM Companies
UNION ALL SELECT 'Internships', COUNT(*) FROM Internships;
