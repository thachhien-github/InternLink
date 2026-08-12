# Domain Model

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.2

**Status:** Active — aligned with implementation (Admin module Phase 0)

---

# 1. Overview

Domain Model mô tả các đối tượng nghiệp vụ (Business Entities) của hệ thống và mối quan hệ giữa chúng.

Khác với ERD, Domain Model tập trung vào nghiệp vụ thay vì thiết kế cơ sở dữ liệu.

**Quy ước triển khai:** C# entity dùng `Id`; cột DB map `{Entity}Id`. Chi tiết: `docs/05c-Data-Dictionary.md`.

---

# 2. Core Domains

## User

Đại diện cho tài khoản đăng nhập hệ thống.

Vai trò:

- **SuperAdmin** — quản trị hệ thống (phòng/khoa); không thay thế Giảng viên trong nghiệp vụ hàng ngày
- **Lecturer** — hướng dẫn thực tập cho sinh viên được phân công
- **Student** — sinh viên thực tập

Quan hệ: 1 User có thể link 0..1 Lecturer hoặc 0..1 Student (qua `UserId`). SuperAdmin thường **không** link profile Lecturer/Student.

### SuperAdmin — trách nhiệm nghiệp vụ

- Import danh sách sinh viên, giảng viên, doanh nghiệp
- Cấp và quản lý tài khoản (SV, GV): tạo, khóa/mở, reset mật khẩu
- Gửi email mời tham gia hệ thống (link + username + password)
- Phân công sinh viên cho giảng viên hướng dẫn
- Quản lý profile giảng viên (`LecturerProfile`)

**Không thuộc SuperAdmin:** duyệt báo cáo, gửi feedback, chấm điểm, export cuối kỳ — thuộc Lecturer.

### Authorization policies (triển khai)

| Policy | Role | Dùng cho |
|--------|------|----------|
| `RequireAdmin` | SuperAdmin | Module Admin mới (`/api/Admin/*`) |
| `RequireSuperAdmin` | SuperAdmin | Alias — endpoint hiện có (vd. `LecturerProfile` write) |
| `RequireLecturer` | Lecturer | Workflow GV — **không** gộp SuperAdmin |
| `RequireStudent` | Student | Nộp báo cáo, xem phản hồi |

Chi tiết triển khai: `docs/Admin-Implementation-Plan.md`.

---

## Lecturer

Profile giảng viên (tách khỏi User).

Thuộc tính nghiệp vụ: `StaffCode`, `FullName`, `Email`, `Department`.

Responsibilities:

- Theo dõi sinh viên **được phân công** (qua `Internship.LecturerId`)
- Nhận xét, duyệt báo cáo, chấm điểm
- Gán doanh nghiệp cho hồ sơ thực tập (trong phạm vi SV được giao)
- Export báo cáo tổng kết cuối kỳ (Excel)

---

## Student

Đại diện cho sinh viên thực tập.

Thuộc tính: `StudentCode` (MSSV), `FullName`, `Class`, `Major`.

Responsibilities:

- Cập nhật tiến độ, nộp báo cáo tuần / sản phẩm
- Xem phản hồi và trạng thái thực tập

---

## Company

Đại diện cho doanh nghiệp tiếp nhận thực tập.

Thuộc tính: `CompanyName`, `ContactPerson`, `Industry`, `Capacity`.

---

## Internship

Hồ sơ thực tập của một sinh viên (1 SV : 1 Internship).

Thuộc tính: `Position`, `StartDate`, `EndDate`, `Status`, `LecturerId`, `CompanyId`.

Quan hệ:

- Student 1:1 Internship
- Company 1:N Internship
- Lecturer 1:N Internship

---

# 3. Progress Domains

## WeeklyReport

Báo cáo tiến độ theo tuần (`WeekNumber`, `Content`, `Status`).

---

## InternshipLog

Nhật ký công việc — **planned**, chưa triển khai.

---

## Submission

Lần nộp báo cáo hoặc sản phẩm; hỗ trợ versioning và resubmit.

---

## Feedback

Nhận xét của giảng viên trên Submission. Liên kết `Lecturer` (không qua User).

---

## Evaluation

Đánh giá cuối kỳ: 4 tiêu chí (Technical, Communication, Teamwork, Initiative) + `FinalGrade`, `IsFinalized`.

---

# 4. Supporting Domains

## Document

Tài liệu / biểu mẫu gắn Internship; upload file thật (metadata + path).

---

## Notification

Thông báo hệ thống (`Title`, `Content`, `IsRead`).

---

# 5. Domain Relationships

```
User ──0..1── Lecturer ──1:N── Internship
User ──0..1── Student  ──1:1── Internship
Company ──1:N── Internship
Internship ──1:N── WeeklyReport | Submission | Document
Internship ──0..1── Evaluation
Submission ──1:N── Feedback
User ──1:N── Notification
```

---

# 6. Summary

InternLink gồm **12 miền nghiệp vụ** (11 đã triển khai + InternshipLog planned):

User · Lecturer · Student · Company · Internship · WeeklyReport · Submission · Feedback · Evaluation · Document · Notification · *(InternshipLog)*
