# Database Design

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.2

**Status:** Active — aligned with EF Core / SQL Server (12 tables)

**See also:** [`database/README.md`](../database/README.md) · [`database/MIGRATIONS.md`](../database/MIGRATIONS.md)

---

# 1. Overview

Tài liệu này mô tả các quyết định thiết kế cơ sở dữ liệu của hệ thống InternLink.

Mục tiêu:

- Chuẩn hóa (3NF)
- Dễ mở rộng và bảo trì
- Phù hợp Entity Framework Core code-first
- Hỗ trợ SuperAdmin module + workflow Giảng viên

---

# 2. Database Platform

| Item | Technology |
|------|------------|
| DBMS | Microsoft SQL Server |
| ORM | Entity Framework Core 10 |
| Language | C# |
| Backend | ASP.NET Core Web API |
| Naming | PascalCase tables/columns; PK `{Entity}Id` |

---

# 3. Current Schema (12 tables)

| Table | Purpose |
|-------|---------|
| Users | Authentication, roles, MustChangePassword |
| Lecturers | GV profile, StaffCode unique |
| Students | SV profile, MSSV |
| Companies | DN thực tập |
| Internships | Hồ sơ SV–GV–DN, status workflow |
| WeeklyReports | Báo cáo tuần |
| Submissions | Nộp bài + versioning |
| Feedbacks | Nhận xét GV |
| Evaluations | Chấm cuối kỳ |
| Documents | File metadata |
| Notifications | Thông báo in-app |
| PasswordResetTokens | Forgot-password (hashed token) |

**Planned:** InternshipLogs

Chi tiết cột: `docs/05c-Data-Dictionary.md`

---

# 4. Migration History

| Migration | Change |
|-----------|--------|
| InitialCreate | Core entities |
| AddLecturerWorkflow | Workflow fields |
| AddDocumentAndEvaluationEntities | Documents, Evaluations |
| AddStudentUserAndWeeklyReportAndNotification | User link, weekly reports |
| AddLecturerEntity | Lecturers table |
| StandardizeColumnNaming | `{Entity}Id` PK columns |
| AddMustChangePasswordToUsers | Users.MustChangePassword |
| AddPasswordResetTokens | Self-service password reset |

Full list: [`database/MIGRATIONS.md`](../database/MIGRATIONS.md)

---

# 5. Design Principles

- Third Normal Form (3NF); một bảng một thực thể nghiệp vụ.
- Foreign keys bắt buộc cho quan hệ cha–con.
- Soft delete (`IsDeleted`) trên bảng nghiệp vụ chính.
- Audit: `CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy`.

---

# 6. Primary Key Strategy

Toàn bộ bảng dùng `UNIQUEIDENTIFIER` (GUID):

```text
StudentId, CompanyId, InternshipId, UserId, ...
```

C# entity: `BaseEntity.Id` → map Fluent API → `{Entity}Id`.

---

# 7. Relationship Design

| Type | Example |
|------|---------|
| 1:1 | Student ↔ Internship |
| 1:N | Company → Internships, Lecturer → Internships |
| 1:N | Internship → Submissions, WeeklyReports |
| 1:0..1 | Internship ↔ Evaluation |
| 1:N | User → Notifications, PasswordResetTokens |

ERD: [`database/diagrams/erd.md`](../database/diagrams/erd.md)

---

# 8. File Storage Strategy

Database chỉ lưu metadata (`FileName`, `FilePath`, `FileUrl`, `MimeType`, `FileSize`).  
File binary lưu ngoài SQL (filesystem / object storage).

---

# 9. Soft Delete & Audit

- `IsDeleted BIT` — không xóa vật lý dữ liệu nghiệp vụ quan trọng.
- Token reset cũ được đánh dấu `IsDeleted` khi phát hành token mới.

---

# 10. Index Strategy

| Area | Index |
|------|-------|
| Users | Username (query login) |
| Lecturers | StaffCode (unique) |
| Students | StudentCode, UserId (unique filtered) |
| Internships | StudentId, LecturerId, CompanyId, Status |
| WeeklyReports | (InternshipId, WeekNumber) |
| Notifications | (UserId, IsRead) |
| PasswordResetTokens | TokenHash (unique), (UserId, UsedAt) |

---

# 11. Enum Strategy (Domain → DB int)

## Role

SuperAdmin, Lecturer, Student

## InternshipStatus

NotStarted, InProgress, BehindSchedule, AwaitingFeedback, RequiresRevision, Completed, Graded

## SubmissionStatus

Submitted, Reviewed, RevisionRequested, Approved, Rejected

## WeeklyReportStatus

Draft, Submitted, Reviewed, RevisionRequested, Approved

---

# 12. Security-Related Columns

| Column | Table | Purpose |
|--------|-------|---------|
| PasswordHash | Users | ASP.NET Identity hasher |
| MustChangePassword | Users | Force change on first login / admin reset |
| TokenHash | PasswordResetTokens | SHA-256 of reset token (never store plaintext) |
| ExpiresAt / UsedAt | PasswordResetTokens | Time-bound, one-time use |

---

# 13. Naming Convention

- **Tables:** PascalCase plural (`Students`, `Internships`)
- **PK:** `{Entity}Id`
- **FK:** `{ReferencedEntity}Id`

---

# 14. Future Enhancements

- InternshipBatch, CompanyRating, ActivityLog
- EmailQueue (bulk import mail)
- AIRecommendation, StudentSkill

---

# 15. Summary

Schema hiện tại phục vụ:

1. Quản lý master data (SV, GV, DN) — SuperAdmin
2. Phân công SV → GV + workflow thực tập
3. Nộp bài, phản hồi, chấm điểm
4. Tài khoản, email invitation, forgot password

Triển khai và verify: `dotnet ef database update` + `database/scripts/verify-schema.sql`.
