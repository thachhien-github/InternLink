-- InternLink schema verification (run after EF migrations)
-- Expected: 12 business tables + __EFMigrationsHistory

SET NOCOUNT ON;

DECLARE @ExpectedTables TABLE (TableName SYSNAME);
INSERT INTO @ExpectedTables (TableName) VALUES
    (N'Users'),
    (N'Lecturers'),
    (N'Students'),
    (N'Companies'),
    (N'Internships'),
    (N'WeeklyReports'),
    (N'Submissions'),
    (N'Feedbacks'),
    (N'Evaluations'),
    (N'Documents'),
    (N'Notifications'),
    (N'PasswordResetTokens');

SELECT
    e.TableName,
    CASE WHEN t.name IS NOT NULL THEN N'OK' ELSE N'MISSING' END AS Status
FROM @ExpectedTables e
LEFT JOIN sys.tables t ON t.name = e.TableName
ORDER BY e.TableName;

-- Users: MustChangePassword column (Admin Phase 5)
SELECT
    CASE WHEN COL_LENGTH(N'dbo.Users', N'MustChangePassword') IS NOT NULL
         THEN N'OK: Users.MustChangePassword'
         ELSE N'MISSING: Users.MustChangePassword'
    END AS UsersMustChangePassword;

-- PasswordResetTokens indexes
SELECT
    i.name AS IndexName,
    i.is_unique AS IsUnique
FROM sys.indexes i
INNER JOIN sys.tables t ON i.object_id = t.object_id
WHERE t.name = N'PasswordResetTokens' AND i.name IS NOT NULL;

-- Applied migrations
SELECT MigrationId, ProductVersion
FROM dbo.__EFMigrationsHistory
ORDER BY MigrationId;
