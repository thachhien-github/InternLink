SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;

-- Fix Student 2421160052: FullName should be "Thạch Hiền"
-- Using N prefix for proper Unicode, and CHAR() for the tricky characters
-- ậ = U+1EAD, ề = U+1EC0
UPDATE Students
SET FullName = N'Th' + NCHAR(0x1EAD) + N'ch Hi' + NCHAR(0x1EC0) + N'n'
WHERE StudentCode = '2421160052' AND IsDeleted = 0;

-- Fix linked User account
UPDATE Users
SET FullName = N'Th' + NCHAR(0x1EAD) + N'ch Hi' + NCHAR(0x1EC0) + N'n'
WHERE UserId = '66891879-80D3-4B95-82FB-100AA10C3917';

-- Verify
SELECT
  s.StudentCode,
  s.FullName AS StudentName,
  u.FullName AS UserName,
  UNICODE(SUBSTRING(s.FullName, 3, 1)) AS StudentChar3,
  UNICODE(SUBSTRING(u.FullName, 3, 1)) AS UserChar3
FROM Students s
LEFT JOIN Users u ON s.UserId = u.UserId
WHERE s.StudentCode = '2421160052' AND s.IsDeleted = 0;
