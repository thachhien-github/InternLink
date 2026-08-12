# EF Core Migration History

**Project:** InternLink  
**Location:** `backend/InternLink/InternLink.Infrastructure/Migrations/`

Áp dụng theo thứ tự thời gian. Lệnh cập nhật DB:

```bash
cd backend/InternLink
dotnet ef database update --project InternLink.Infrastructure --startup-project InternLink.API
```

---

| # | Migration | Ngày (UTC) | Mô tả |
|---|-----------|------------|-------|
| 1 | `InitialCreate` | 2026-08-06 | Users, Students, Companies, Internships, Submissions, Feedbacks |
| 2 | `AddLecturerWorkflow` | 2026-08-07 | Mở rộng workflow GV, Internship fields |
| 3 | `AddDocumentAndEvaluationEntities` | 2026-08-09 | Documents, Evaluations |
| 4 | `AddStudentUserAndWeeklyReportAndNotification` | 2026-08-11 | Students.UserId, WeeklyReports, Notifications |
| 5 | `AddLecturerEntity` | 2026-08-11 | Bảng Lecturers; Internship.LecturerId → FK Lecturers |
| 6 | `StandardizeColumnNaming` | 2026-08-11 | PK cột DB `{Entity}Id` (Fluent API map từ C# `Id`) |
| 7 | `AddMustChangePasswordToUsers` | 2026-08-12 | `Users.MustChangePassword` — bắt đổi MK lần đầu |
| 8 | `AddPasswordResetTokens` | 2026-08-12 | Bảng `PasswordResetTokens` — forgot password flow |

---

## Rollback (dev only)

```bash
dotnet ef migrations remove --project InternLink.Infrastructure --startup-project InternLink.API
```

Hoặc migrate về migration cụ thể:

```bash
dotnet ef database update <PreviousMigrationName> --project InternLink.Infrastructure --startup-project InternLink.API
```

---

## Snapshot

Trạng thái schema hiện tại: `AppDbContextModelSnapshot.cs` (12 DbSet + quan hệ FK/index).
