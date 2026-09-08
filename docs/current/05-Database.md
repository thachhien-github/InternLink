# InternLink - Database Reference

**DBMS:** Microsoft SQL Server 2022  
**ORM:** Entity Framework Core 10  
**Verified:** 2026-09-08

## Current schema

The `InternLink` database currently contains the EF migration history table plus these application tables:

- `Users`, `Students`, `Lecturers`, `Companies`, `Semesters`, `Internships`
- `WeeklyReports`, `WeeklyReportVersions`, `Submissions`, `SubmissionAssets`, `Feedbacks`
- `Documents`, `Evaluations`, `EvaluationRubrics`, `EvaluationRubricCriteria`
- `Notifications`, `PasswordResetTokens`, `RefreshTokens`, `SystemSettings`, `AccountRequests`
- `SemesterLecturers`, `SemesterCompanies`

The authoritative column definitions and indexes are in `InternLink.Infrastructure/Persistence/AppDbContext.cs` and the latest migration designer/snapshot.

## Important constraints

- Business records use soft deletion through `IsDeleted` where supported.
- Usernames and profile codes have uniqueness rules defined in the EF model.
- A student may have multiple internships across semesters, with a uniqueness rule per student/semester.
- Semester lecturer and semester company assignments are explicit join tables.
- Weekly report versions and submission assets preserve related history.
- Foreign keys to optional assignment entities may be nullable during setup.

## Migration sequence

The current migration sequence has 16 migrations:

1. `InitialCreate`
2. `AddAvatarUrlToUsers`
3. `AddSemesterLecturers`
4. `AddCompanyCodeToCompanies`
5. `AddSemesterCompanies`
6. `AddDefenseDetailsToEvaluations`
7. `CompleteStudentP0`
8. `AddWeeklyReportFeedback`
9. `AddWeeklyReportVersion`
10. `NormalizeWeeklyReportVersions`
11. `AddWeeklyReportVersions`
12. `AddWeeklyReportVersionsAndFeedbackReadState`
13. `AddReportFeedbackQueryIndexes`
14. `AddSubmissionAssetsAuto`
15. `AddDocumentDownloadCount`
16. `AddDocumentCirculationState`

The last migration must not add `Documents.IsPublished` again because that column is introduced by the preceding document migration. Keep migration files immutable after they have been applied to shared environments; use a corrective migration for future schema changes.

## Commands

```powershell
cd backend/InternLink
dotnet ef database update --project InternLink.Infrastructure --startup-project InternLink.API
dotnet ef migrations add <MigrationName> --project InternLink.Infrastructure --startup-project InternLink.API
```

For a schema check, use `database/scripts/verify-schema.sql` against the intended database. Never point destructive reset scripts at a production database.

## Performance rules

- Use `AsNoTracking()` for read-only queries.
- Project only fields needed by a DTO.
- Apply filtering, ordering and pagination in SQL before `ToListAsync()`.
- Use `CountAsync`/`AnyAsync` for badges and existence checks.
- Add or verify indexes for foreign keys, `CreatedAt`, `IsDeleted`, semester and assignment filters.
- Avoid `ToLower()` on database columns when it prevents index use.
