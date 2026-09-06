SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;

-- Correct lowercase characters:
-- ạ (lowercase a with dot below) = U+1EA1
-- ề (lowercase e with circumflex and grave) = U+1EC1

-- Fix Student
UPDATE Students
SET FullName = N'Th' + NCHAR(0x1EA1) + N'ch Hi' + NCHAR(0x1EC1) + N'n'
WHERE StudentCode = '2421160052' AND IsDeleted = 0;

-- Fix linked User
UPDATE Users
SET FullName = N'Th' + NCHAR(0x1EA1) + N'ch Hi' + NCHAR(0x1EC1) + N'n'
WHERE UserId = '66891879-80D3-4B95-82FB-100AA10C3917';

-- Verify
SELECT
  s.StudentCode,
  s.FullName AS StudentName,
  u.FullName AS UserName,
  UNICODE(SUBSTRING(s.FullName, 3, 1)) AS C3_should_be_7841,
  UNICODE(SUBSTRING(s.FullName, 9, 1)) AS C9_should_be_7873
FROM Students s
LEFT JOIN Users u ON s.UserId = u.UserId
WHERE s.StudentCode = '2421160052' AND s.IsDeleted = 0;
