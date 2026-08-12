# InternLink Backend Implementation Plan

**Version:** 2.0  
**Status:** MVP backend complete — ready for frontend integration  
**Swagger:** http://localhost:7109/swagger

## 1. Mục tiêu
- Xây dựng backend cho InternLink theo đúng thiết kế trong docs.
- Dùng ASP.NET Core Web API + EF Core code-first + SQL Server.
- Kiểm tra thông qua Swagger.

## 2. Nền tảng hiện tại
- `InternLink.API`: Controllers, Swagger, JWT auth, exception middleware.
- `InternLink.Application`: DTO, services, validators, AutoMapper.
- `InternLink.Domain`: Entities, enums, BaseEntity.
- `InternLink.Infrastructure`: DbContext, migrations, seed, services.
- `InternLink.Tests`: 75 unit tests.

## 3. Database (12 bảng — aligned with EF Core v1.2)
- PK cột DB: `{Entity}Id` — C# vẫn dùng `BaseEntity.Id` (map Fluent API).
- Soft delete + audit: `CreatedAt`, `UpdatedAt`, `IsDeleted`, …
- Chi tiết: `docs/05c-Data-Dictionary.md`

| Bảng | Ghi chú |
|------|---------|
| Users | Auth, roles: SuperAdmin / Lecturer / Student |
| Lecturers | Profile GV, link User, StaffCode unique |
| Students | StudentCode (MSSV), import Excel |
| Companies | CompanyName, ContactPerson |
| Internships | Position, LecturerId, Status enum |
| WeeklyReports | Báo cáo tuần |
| Submissions | Nộp bài, versioning |
| Feedbacks | FK → Lecturers |
| Documents | Upload file, Category |
| Evaluations | 4 tiêu chí + FinalGrade |
| Notifications | Content, mark-read |
| PasswordResetTokens | Forgot-password flow |

**Docs:** [`database/README.md`](../database/README.md) · [`docs/05c-Data-Dictionary.md`](05c-Data-Dictionary.md)

**Migrations:** InitialCreate → … → AddMustChangePasswordToUsers → AddPasswordResetTokens

## 4. API modules (73 paths)

| Controller | Role | Trạng thái |
|------------|------|------------|
| AuthController | All | ✅ Login, forgot/reset password, change-password |
| StudentController | Lecturer | ✅ **Read-only** (GET/search) |
| AdminStudentsController | SuperAdmin | ✅ CRUD, import Excel + tạo TK + email |
| CompanyController | SuperAdmin, Lecturer | ✅ **Read-only** (GET/search) |
| AdminCompaniesController | SuperAdmin | ✅ CRUD + import Excel |
| AdminUsersController | SuperAdmin | ✅ CRUD, reset password, soft delete |
| AdminAssignmentsController | SuperAdmin | ✅ Bulk assign SV→GV, unassign |
| InternshipController | Lecturer | ✅ CRUD, filter, assign company (no LecturerId write) |
| LecturerController | Lecturer | ✅ Workflow + **export Excel cuối kỳ** |
| LecturerProfileController | SuperAdmin/Lecturer | ✅ CRUD, import, overview |
| SubmissionController | Student/Lecturer | ✅ CRUD, feedback, resubmit |
| FeedbackController | Lecturer | ✅ Update feedback |
| WeeklyReportController | Student/Lecturer | ✅ CRUD, review |
| DocumentController | Auth | ✅ Upload, CRUD |
| EvaluationController | Lecturer | ✅ Chấm điểm, finalize |
| NotificationController | Auth | ✅ mine, mark-read |

## 5. Use cases — trạng thái

| # | Use case | Trạng thái |
|---|----------|------------|
| 1 | Login JWT | ✅ |
| 2 | Manage Students | ✅ Admin: CRUD/import + TK + email; Lecturer: read-only |
| 3 | Manage Companies | ✅ Admin: CRUD/import; Lecturer: read-only |
| 4 | Assign Company | ✅ |
| 5 | Review Submission | ✅ |
| 6 | Send Feedback | ✅ |
| 7 | Submit Weekly Report | ✅ |
| 8 | View Feedback | ✅ |
| 9 | Resubmit Report | ✅ |
| 10 | Submit Final Report / Product | ✅ |
| 11 | Notifications | ✅ |
| 12 | Export cuối kỳ (Excel) | ✅ `GET /api/Lecturer/export/end-of-term` |

## 6. Seed credentials
- `superadmin` / `lecturer1` / `student1` — password: `Password123!`

## 7. SuperAdmin Module (kế hoạch chi tiết)

**Tài liệu:** [`docs/Admin-Implementation-Plan.md`](Admin-Implementation-Plan.md)

SuperAdmin = quản trị hệ thống (import dữ liệu, cấp TK, email mời, phân công SV→GV).  
**Không** gộp vào `RequireLecturer` — Lecturer giữ nghiệp vụ duyệt/chấm điểm.

| Phase | Nội dung | Trạng thái |
|-------|----------|------------|
| 0 | Policy `RequireAdmin` + docs | ✅ |
| 1 | Hạ tầng email (SMTP + template) | ✅ |
| 2 | Email mời khi import/tạo GV | ✅ |
| 3 | Admin quản lý SV + tạo TK + email | ✅ |
| 4 | Admin quản lý DN + import Excel | ✅ |
| 5 | User management (reset MK, khóa TK) | ✅ |
| 6 | Phân công SV → GV (bulk) | ✅ |
| 7 | Forgot password + swagger/postman | ✅ |

**Smoke test:** [`docs/Admin-Smoke-Test-Checklist.md`](Admin-Smoke-Test-Checklist.md)  
**Postman:** [`api/postman_collection.json`](../api/postman_collection.json)  
**Swagger export:** [`api/swagger.json`](../api/swagger.json)

## 8. Chưa làm / để sau (ngoài Admin module)
- InternshipLog entity + API
- Upgrade AutoMapper (NU1903)
- Frontend integration

## 9. Kiểm tra
```bash
cd backend/InternLink
dotnet build
dotnet test
dotnet ef database update --project InternLink.Infrastructure --startup-project InternLink.API
dotnet run --project InternLink.API
# Swagger: http://localhost:7109/swagger
```
