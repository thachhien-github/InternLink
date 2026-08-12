# Software Requirements Specification (SRS)

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 2.0

**Status:** Active — aligned with MVP + SuperAdmin module

**Related:** [`01-Vision-Scope.md`](01-Vision-Scope.md) · [`04-Use-Case-Specification.md`](04-Use-Case-Specification.md) · [`Backend-Plan.md`](Backend-Plan.md)

---

# 1. Introduction

## 1.1 Purpose

Mô tả yêu cầu chức năng và phi chức năng của InternLink — cơ sở phân tích, thiết kế, phát triển và kiểm thử.

## 1.2 Scope

InternLink là nền tảng web hỗ trợ **SuperAdmin**, **Lecturer** và **Student** trong quản lý thực tập.

MVP gồm:

1. Admin: import master data, cấp TK, email mời, phân công SV→GV
2. Tiến độ thực tập + báo cáo tuần
3. Nộp bài / phản hồi / nộp lại
4. Doanh nghiệp (master + gán vào internship)
5. Đánh giá cuối kỳ + export Excel
6. Auth (JWT, đổi MK, quên/reset MK)

## 1.3 Intended Users

| Role | Mô tả |
|------|--------|
| SuperAdmin | Quản trị hệ thống (khoa/phòng) |
| Lecturer | Giảng viên hướng dẫn |
| Student | Sinh viên thực tập |

## 1.4 Definitions

| Term | Meaning |
|------|---------|
| Internship | Hồ sơ thực tập 1 SV trong đợt (1:1 với Student) |
| Invitation email | Email chứa portal link + username + MK tạm |
| MustChangePassword | Cờ bắt đổi MK sau invitation / admin reset |

---

# 2. Functional Requirements

## FR-01 Authentication & Account Security

| ID | Requirement | UC |
|----|-------------|-----|
| FR-01.1 | Đăng nhập username/password, nhận JWT | UC-01 |
| FR-01.2 | Phân quyền theo Role: SuperAdmin, Lecturer, Student | UC-01 |
| FR-01.3 | Đổi mật khẩu khi đã đăng nhập | UC-02 |
| FR-01.4 | Quên mật khẩu: gửi link reset qua email (không lộ email tồn tại) | UC-03 |
| FR-01.5 | Đặt lại mật khẩu bằng token one-time, có expiry | UC-04 |
| FR-01.6 | Login trả cờ `MustChangePassword` | UC-01 |
| FR-01.7 | Xem thông tin user hiện tại (`/me`) | UC-05 |

Policies: `RequireAdmin`, `RequireLecturer`, `RequireStudent` (Lecturer **không** gồm SuperAdmin).

---

## FR-02 Admin — Student Master Data

| ID | Requirement | UC |
|----|-------------|-----|
| FR-02.1 | SuperAdmin CRUD sinh viên | UC-A01 |
| FR-02.2 | Import Excel (MSSV, thông tin, optional Username) | UC-A01 |
| FR-02.3 | Tạo User role Student + gửi invitation email khi có Username/Email | UC-A02 |
| FR-02.4 | Lecturer chỉ **đọc** danh sách/hồ sơ SV (không write master data) | UC-L02 |

---

## FR-03 Admin — Lecturer & Company Master Data

| ID | Requirement | UC |
|----|-------------|-----|
| FR-03.1 | SuperAdmin CRUD / import Giảng viên (LecturerProfile) | UC-A03 |
| FR-03.2 | Tạo User Lecturer + invitation email | UC-A04 |
| FR-03.3 | SuperAdmin CRUD / import Doanh nghiệp | UC-A05 |
| FR-03.4 | Lecturer đọc danh sách DN; **không** CRUD master DN | UC-L03 |

---

## FR-04 Admin — User Management

| ID | Requirement | UC |
|----|-------------|-----|
| FR-04.1 | SuperAdmin list/filter users (role, active, search) | UC-A06 |
| FR-04.2 | Tạo user Student/Lecturer, link StudentCode/StaffCode | UC-A06 |
| FR-04.3 | Cập nhật FullName, Email, IsActive | UC-A06 |
| FR-04.4 | Soft delete / deactivate user | UC-A06 |
| FR-04.5 | Admin reset password → MK tạm ngẫu nhiên + email; **không** trả MK trong API | UC-A07 |
| FR-04.6 | Không cho sửa/xóa/reset SuperAdmin qua Admin Users API | UC-A06 |

---

## FR-05 Admin — Assignment (SV → GV)

| ID | Requirement | UC |
|----|-------------|-----|
| FR-05.1 | Bulk assign nhiều SV cho một GV | UC-A08 |
| FR-05.2 | SV chưa có Internship → tạo stub NotStarted + DN placeholder | UC-A08 |
| FR-05.3 | SV đã có Internship → cập nhật `LecturerId` (re-assign) | UC-A08 |
| FR-05.4 | Unassign (clear LecturerId); list by lecturer | UC-A09, UC-A10 |
| FR-05.5 | Chỉ SuperAdmin đổi `LecturerId`; Lecturer chỉ gán `CompanyId` | UC-L04 |

---

## FR-06 Internship Progress

| ID | Requirement | UC |
|----|-------------|-----|
| FR-06.1 | Lecturer xem internships được phân công | UC-L01 |
| FR-06.2 | Cập nhật / theo dõi status: NotStarted, InProgress, BehindSchedule, AwaitingFeedback, RequiresRevision, Completed, Graded | — |
| FR-06.3 | Student nộp Weekly Report theo tuần | UC-S01 |
| FR-06.4 | Lecturer review weekly report | UC-L07 |

**Note:** InternshipLog (nhật ký ngày) = Planned — chưa bắt buộc MVP.

---

## FR-07 Submission & Feedback

| ID | Requirement | UC |
|----|-------------|-----|
| FR-07.1 | Student nộp báo cáo / sản phẩm (file + metadata) | UC-S02 |
| FR-07.2 | Lưu version history | UC-S02 |
| FR-07.3 | Lecturer review submission | UC-L05 |
| FR-07.4 | Lecturer gửi feedback (public/private, optional status) | UC-L06 |
| FR-07.5 | Student xem feedback và resubmit khi RevisionRequested | UC-S03, UC-S04 |

---

## FR-08 Company Assignment (runtime)

| ID | Requirement | UC |
|----|-------------|-----|
| FR-08.1 | Lecturer gán/đổi Company cho internship thuộc mình | UC-L04 |
| FR-08.2 | Master data DN do SuperAdmin quản lý (FR-03) | UC-A05 |

---

## FR-09 Document Library

| ID | Requirement | UC |
|----|-------------|-----|
| FR-09.1 | Upload tài liệu gắn internship (metadata + storage path) | UC-L10 |
| FR-09.2 | Student tải tài liệu được phép | UC-S05 |
| FR-09.3 | Phân loại Category | UC-L10 |

---

## FR-10 Evaluation & Export

| ID | Requirement | UC |
|----|-------------|-----|
| FR-10.1 | Lecturer chấm 4 tiêu chí + FinalGrade + nhận xét | UC-L08 |
| FR-10.2 | Finalize evaluation (khóa chỉnh sửa) | UC-L09 |
| FR-10.3 | Export Excel cuối kỳ cho SV được phân công | UC-L11 |
| FR-10.4 | Chỉ Lecturer được chấm / finalize | BR-05 |

---

## FR-11 Notification

| ID | Requirement | UC |
|----|-------------|-----|
| FR-11.1 | Thông báo in-app theo user | UC-S06 |
| FR-11.2 | Đánh dấu đã đọc | UC-S06 |

---

## FR-12 Email (platform)

| ID | Requirement | UC |
|----|-------------|-----|
| FR-12.1 | Gửi invitation (portal + username + temp password) | UC-A02, A04 |
| FR-12.2 | Gửi admin password-reset notification | UC-A07 |
| FR-12.3 | Gửi forgot-password link (không kèm password) | UC-03 |
| FR-12.4 | Dev mode: `Email:Enabled=false` → log nội dung (không crash) | UC-A11 |
| FR-12.5 | SuperAdmin test email endpoint | UC-A11 |

---

# 3. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Response thông thường &lt; 3s (dev/local) |
| NFR-02 | JWT auth; password hashed (ASP.NET Identity hasher); reset token hashed (SHA-256) |
| NFR-03 | Role policies tách bạch Admin / Lecturer / Student |
| NFR-04 | Soft delete trên entity nghiệp vụ chính |
| NFR-05 | Layered architecture (API / Application / Domain / Infrastructure) |
| NFR-06 | SQL Server + EF Core code-first migrations |
| NFR-07 | Secrets SMTP không commit; dùng config / user secrets |
| NFR-08 | API trả `ApiResponse&lt;T&gt;`; OpenAPI qua Swagger |
| NFR-09 | Unit tests cho services/templates chính (≥70 tests) |

---

# 4. Business Rules

| ID | Rule |
|----|------|
| BR-01 | Một SV một Internship (1:1) trong đợt |
| BR-02 | Một DN tiếp nhận nhiều SV |
| BR-03 | Một submission có nhiều feedback; có versioning |
| BR-04 | Chỉ Lecturer chấm / finalize evaluation |
| BR-05 | Student chỉ thao tác dữ liệu của mình |
| BR-06 | Chỉ SuperAdmin set/clear `Internship.LecturerId` |
| BR-07 | Lecturer chỉ gán `CompanyId` trên internship mình phụ trách |
| BR-08 | User inactive / deleted không đăng nhập được |
| BR-09 | Password reset token: one-time + expiry |
| BR-10 | Không expose mật khẩu tạm trong JSON API response |

---

# 5. Assumptions

- SuperAdmin cấp tài khoản (hoặc import) cho SV/GV.
- SMTP có thể tắt ở Development (logging stub).
- Hệ thống không thay thế phần mềm quản lý đào tạo nhà trường.
- Frontend React tiêu thụ REST + JWT.

---

# 6. Constraints

- Web Application
- Backend: ASP.NET Core Web API
- Frontend: React (planned / in progress)
- Database: Microsoft SQL Server
- Auth: JWT Bearer
- Email: MailKit SMTP (optional)

---

# 7. Out of Scope / Future

- InternshipLog API
- Configurable Rubric management UI
- Advanced analytics
- AI features
- Zalo / LMS / Hangfire bulk mail
- Mobile app

---

# 8. Traceability (summary)

| Area | Primary docs |
|------|----------------|
| UC list | `04-Use-Case-Specification.md` |
| Domain / DB | `05a`–`05d`, `database/` |
| API | `api/swagger.json`, `08-API-Specification.md` (D4) |
| Admin delivery | `Admin-Implementation-Plan.md` |

---

# 9. Revision History

| Ver | Date | Notes |
|-----|------|-------|
| 1.0 | 2026-07 | Draft — Lecturer + Student only |
| 2.0 | 2026-08-12 | Active — SuperAdmin FR, email, assignment, auth reset |
