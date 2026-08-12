# Use Case Specification

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 2.0

**Status:** Active — aligned with Admin module (Phases 0–7)

**Diagrams:**
- Use Case: [`docs/images/usecase/usecase-diagram.md`](images/usecase/usecase-diagram.md)
- Sequence: [`docs/images/sequence/`](images/sequence/)

---

# 1. Overview

Tài liệu mô tả chức năng người dùng trên InternLink theo **ba tác nhân**:

| Actor | Vai trò |
|-------|---------|
| **SuperAdmin** | Quản trị hệ thống (phòng/khoa): import dữ liệu, cấp TK, email mời, phân công SV→GV |
| **Lecturer** | Hướng dẫn thực tập: theo dõi SV được giao, gán DN, duyệt/chấm, export |
| **Student** | Sinh viên thực tập: nộp báo cáo, xem phản hồi |

---

# 2. Actors

## SuperAdmin

Quản trị viên hệ thống — **không** thay thế Giảng viên trong nghiệp vụ hàng ngày.

Responsibilities:

- Import / CRUD sinh viên, giảng viên, doanh nghiệp
- Cấp và quản lý tài khoản (tạo, khóa, reset mật khẩu)
- Gửi email mời tham gia (invitation)
- Phân công sinh viên cho giảng viên (bulk assign)
- Kiểm tra email (test SMTP)

---

## Lecturer

Giảng viên hướng dẫn thực tập (chỉ SV được phân công).

Responsibilities:

- Xem danh sách SV / DN (read-only master data)
- Gán doanh nghiệp cho hồ sơ thực tập
- Theo dõi tiến độ, duyệt submission / weekly report
- Gửi feedback, chấm điểm, finalize evaluation
- Upload tài liệu, export Excel cuối kỳ

---

## Student

Sinh viên thực tập.

Responsibilities:

- Đăng nhập / đổi mật khẩu / quên mật khẩu
- Nộp báo cáo tuần, sản phẩm / báo cáo cuối
- Xem phản hồi, nộp lại khi được yêu cầu
- Tải tài liệu, xem thông báo

---

# 3. Use Case List

## 3.1 Auth (chung)

| ID | Use Case | Actor | Status |
|----|----------|--------|--------|
| UC-01 | Login | SuperAdmin, Lecturer, Student | ✅ |
| UC-02 | Change Password | SuperAdmin, Lecturer, Student | ✅ |
| UC-03 | Forgot Password | SuperAdmin, Lecturer, Student | ✅ |
| UC-04 | Reset Password | SuperAdmin, Lecturer, Student | ✅ |
| UC-05 | View Current User (Me) | SuperAdmin, Lecturer, Student | ✅ |

## 3.2 SuperAdmin

| ID | Use Case | Actor | Status |
|----|----------|--------|--------|
| UC-A01 | Manage Students (CRUD / Import) | SuperAdmin | ✅ |
| UC-A02 | Create Student Account + Invitation Email | SuperAdmin | ✅ |
| UC-A03 | Manage Lecturers (CRUD / Import) | SuperAdmin | ✅ |
| UC-A04 | Create Lecturer Account + Invitation Email | SuperAdmin | ✅ |
| UC-A05 | Manage Companies (CRUD / Import) | SuperAdmin | ✅ |
| UC-A06 | Manage Users (CRUD / Deactivate) | SuperAdmin | ✅ |
| UC-A07 | Admin Reset User Password | SuperAdmin | ✅ |
| UC-A08 | Bulk Assign Students → Lecturer | SuperAdmin | ✅ |
| UC-A09 | Unassign Student from Lecturer | SuperAdmin | ✅ |
| UC-A10 | View Assignments by Lecturer | SuperAdmin | ✅ |
| UC-A11 | Test Invitation Email | SuperAdmin | ✅ |

## 3.3 Lecturer

| ID | Use Case | Actor | Status |
|----|----------|--------|--------|
| UC-L01 | View Assigned Internships | Lecturer | ✅ |
| UC-L02 | View Students (read-only) | Lecturer | ✅ |
| UC-L03 | View Companies (read-only) | Lecturer | ✅ |
| UC-L04 | Assign / Change Company for Internship | Lecturer | ✅ |
| UC-L05 | Review Submission | Lecturer | ✅ |
| UC-L06 | Send Feedback | Lecturer | ✅ |
| UC-L07 | Review Weekly Report | Lecturer | ✅ |
| UC-L08 | Evaluate / Grade Internship | Lecturer | ✅ |
| UC-L09 | Finalize Evaluation | Lecturer | ✅ |
| UC-L10 | Upload / Manage Documents | Lecturer | ✅ |
| UC-L11 | Export End-of-Term Excel | Lecturer | ✅ |
| UC-L12 | Manage Lecturer Profile (own / overview) | SuperAdmin, Lecturer | ✅ |

## 3.4 Student

| ID | Use Case | Actor | Status |
|----|----------|--------|--------|
| UC-S01 | Submit Weekly Report | Student | ✅ |
| UC-S02 | Upload Final Report / Product | Student | ✅ |
| UC-S03 | View Feedback | Student | ✅ |
| UC-S04 | Resubmit Report | Student | ✅ |
| UC-S05 | Download Documents | Student | ✅ |
| UC-S06 | View Notifications | Student | ✅ |

## 3.5 Planned / deferred

| ID | Use Case | Actor | Status |
|----|----------|--------|--------|
| UC-P01 | Submit Internship Log | Student | ⬜ Planned |
| UC-P02 | Manage Rubric (configurable) | Lecturer | ⬜ Deferred |
| UC-P03 | Advanced Analytics Dashboard | Lecturer | ⬜ Deferred |

---

# 4. Use Case Specifications (key flows)

## UC-01 Login

### Actor

SuperAdmin, Lecturer, Student

### Description

Đăng nhập bằng username / password, nhận JWT.

### Preconditions

Tài khoản tồn tại, `IsActive = true`, chưa soft-delete.

### Main Flow

1. Người dùng nhập username và password.
2. Hệ thống xác thực hash mật khẩu.
3. Hệ thống trả JWT + `Role` + `MustChangePassword`.
4. Nếu `MustChangePassword = true`, client chuyển sang đổi mật khẩu.

### Alternative Flow

- Sai credentials → 401.
- Tài khoản bị khóa (`IsActive = false`) → 401.

### API

`POST /api/Auth/login`

---

## UC-03 Forgot Password

### Actor

SuperAdmin, Lecturer, Student

### Description

Yêu cầu link đặt lại mật khẩu qua email (không trả mật khẩu plaintext).

### Main Flow

1. Người dùng gửi email đã đăng ký.
2. Nếu email tồn tại và active → tạo `PasswordResetToken` (hash, expiry 24h).
3. Gửi email chứa link `{PortalUrl}/reset-password?token=...`.
4. API luôn trả 200 (không lộ email có tồn tại hay không).

### API

`POST /api/Auth/forgot-password`

**Sequence:** [`forgot-password.md`](images/sequence/forgot-password.md)

---

## UC-04 Reset Password

### Actor

SuperAdmin, Lecturer, Student

### Description

Đặt mật khẩu mới bằng token từ email.

### Main Flow

1. Người dùng mở link, nhập mật khẩu mới.
2. Hệ thống hash token, tìm bản ghi chưa dùng / chưa hết hạn.
3. Cập nhật `PasswordHash`, `MustChangePassword = false`, đánh dấu `UsedAt`.
4. Login bằng mật khẩu mới.

### Alternative Flow

- Token hết hạn / đã dùng / sai → 401.

### API

`POST /api/Auth/reset-password`

---

## UC-A01 Manage Students (CRUD / Import)

### Actor

SuperAdmin

### Description

Quản lý master data sinh viên: xem, tạo, sửa, xóa mềm, import Excel.

### Main Flow

1. SuperAdmin mở `/api/Admin/students`.
2. CRUD hoặc import file Excel (có cột Username nếu cần tạo TK).
3. Hệ thống lưu profile `Students`.

### Notes

Lecturer chỉ **đọc** qua `/api/Student` (read-only).

### API

`GET|POST|PUT|DELETE /api/Admin/students`, `POST .../import`

---

## UC-A02 / UC-A04 Create Account + Invitation Email

### Actor

SuperAdmin

### Description

Tạo tài khoản login gắn profile SV/GV và gửi email mời (username + mật khẩu tạm).

### Main Flow

1. SuperAdmin tạo SV/GV (hoặc User) kèm Username + Email.
2. Hệ thống tạo `Users` (role tương ứng), `MustChangePassword = true`.
3. Gửi invitation email (SMTP hoặc log khi `Email:Enabled=false`).
4. Người nhận đăng nhập → bắt buộc đổi MK.

### API

- Students: `POST /api/Admin/students`
- Lecturers: `POST /api/LecturerProfile`
- Users: `POST /api/Admin/users`

**Sequence:** [`invitation-email.md`](images/sequence/invitation-email.md)

---

## UC-A07 Admin Reset User Password

### Actor

SuperAdmin

### Description

Đặt lại mật khẩu tạm ngẫu nhiên, gửi email thông báo (không trả MK trong API response).

### Main Flow

1. SuperAdmin gọi reset trên user.
2. Hệ thống sinh password tạm, hash, `MustChangePassword = true`.
3. Gửi email “Mật khẩu mới”.

### API

`POST /api/Admin/users/{id}/reset-password`

---

## UC-A08 Bulk Assign Students → Lecturer

### Actor

SuperAdmin

### Description

Gán nhiều sinh viên cho một giảng viên.

### Main Flow

1. SuperAdmin chọn `lecturerId` + danh sách `studentIds`.
2. Với mỗi SV:
   - Chưa có Internship → tạo stub (`NotStarted`, DN placeholder).
   - Đã có → cập nhật `LecturerId` (re-assign).
3. Lecturer xem SV trong workflow.

### Postconditions

Lecturer cũ không còn thấy SV đã re-assign.

### API

`POST /api/Admin/assignments`

**Sequence:** [`bulk-assign.md`](images/sequence/bulk-assign.md)

---

## UC-L04 Assign Company for Internship

### Actor

Lecturer

### Description

Gán / đổi doanh nghiệp cho hồ sơ thực tập (SV đã được Admin phân công).

### Main Flow

1. Lecturer chọn internship thuộc mình.
2. Chọn `CompanyId` từ danh sách DN (read-only list).
3. Hệ thống cập nhật `Internships.CompanyId`.

### Notes

Lecturer **không** đổi `LecturerId` — chỉ SuperAdmin phân công GV.

### API

`PUT /api/Internship/{id}/company`

---

## UC-L05 / UC-L06 Review Submission + Send Feedback

### Actor

Lecturer

### Description

Xem submission của SV được giao, gửi nhận xét, cập nhật trạng thái.

### Main Flow

1. Lecturer mở internship → danh sách submissions.
2. Đọc nội dung / file.
3. Gửi feedback (`Comment`, `IsPublic`, optional `NewStatus`).
4. Student nhận thông báo / xem phản hồi.

---

## UC-L08 / UC-L09 Evaluate + Finalize

### Actor

Lecturer

### Description

Chấm 4 tiêu chí (Technical, Communication, Teamwork, Initiative), tính `FinalGrade`, chốt điểm.

### Main Flow

1. Nhập điểm + nhận xét.
2. Lưu evaluation (draft).
3. Finalize → khóa chỉnh sửa.

---

## UC-L11 Export End-of-Term Excel

### Actor

Lecturer

### Description

Xuất Excel tổng kết SV được phân công cuối kỳ.

### API

`GET /api/Lecturer/export/end-of-term`

---

## UC-S01 Submit Weekly Report

### Actor

Student

### Description

Nộp báo cáo tuần gắn internship.

### Preconditions

Đã có Internship (đã được Admin phân công GV).

### Main Flow

1. Chọn tuần (`WeekNumber`).
2. Nhập tiêu đề / nội dung (hoặc file qua Submission).
3. Submit → trạng thái Submitted.
4. Lecturer review.

---

## UC-S04 Resubmit Report

### Actor

Student

### Description

Nộp lại sau khi Lecturer yêu cầu chỉnh sửa (`RevisionRequested`).

### Extend

UC-S03 View Feedback

---

# 5. Relationships

## Include

- UC-L06 Send Feedback → UC-L05 Review Submission
- UC-A02 Create Student Account → invitation email send
- UC-A08 Bulk Assign → create/update Internship

## Extend

- UC-S04 Resubmit → UC-S03 View Feedback
- UC-01 Login → UC-02 Change Password (khi `MustChangePassword`)

## Authorization boundary

```text
RequireAdmin     → SuperAdmin only  (/api/Admin/*)
RequireLecturer  → Lecturer only    (workflow, không gộp SuperAdmin)
RequireStudent   → Student only
```

---

# 6. Summary

| Nhóm | Số UC chính (implemented) |
|------|---------------------------|
| Auth | 5 |
| SuperAdmin | 11 |
| Lecturer | 12 |
| Student | 6 |
| **Tổng** | **~34** (MVP + Admin) |

Ba quy trình cốt lõi sau Admin module:

1. **Admin vận hành:** import master data → cấp TK + email → phân công SV→GV.
2. **Lecturer hướng dẫn:** gán DN → duyệt / feedback → chấm điểm → export.
3. **Student thực tập:** nộp bài → xem phản hồi → nộp lại; tự phục vụ quên MK.
