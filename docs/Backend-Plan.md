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
- `InternLink.Tests`: 44 unit tests.

## 3. Database (11 bảng — đã chuẩn hóa naming v1.1)
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

**Migrations:** InitialCreate → LecturerWorkflow → Document/Evaluation → StudentUser/WeeklyReport/Notification → AddLecturerEntity → StandardizeColumnNaming

## 4. API modules (73 paths)

| Controller | Role | Trạng thái |
|------------|------|------------|
| AuthController | All | ✅ Login, me, change-password |
| StudentController | Lecturer | ✅ CRUD, filter, import Excel |
| CompanyController | Lecturer | ✅ CRUD, filter |
| InternshipController | Lecturer | ✅ CRUD, filter, assign, status |
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
| 2 | Manage Students | ✅ + import Excel |
| 3 | Manage Companies | ✅ |
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

## 7. Chưa làm / để sau
- InternshipLog entity + API
- Forgot/reset password (stub — cần email service)
- SuperAdmin truy cập endpoint RequireLecturer *(cần xem xét)*
- Upgrade AutoMapper (NU1903)
- Frontend integration

## 8. Kiểm tra
```bash
cd backend/InternLink
dotnet build
dotnet test
dotnet ef database update --project InternLink.Infrastructure --startup-project InternLink.API
dotnet run --project InternLink.API
# Swagger: http://localhost:7109/swagger
```
