# Data Dictionary

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.1

**Status:** Active — aligned with EF Core implementation

---

# 1. Overview

Data Dictionary mô tả chi tiết cấu trúc dữ liệu của hệ thống InternLink.

Tài liệu này là cầu nối giữa Entity Relationship Diagram (ERD) và quá trình triển khai cơ sở dữ liệu bằng SQL Server và Entity Framework Core.

---

# 2. Naming Convention

## Table

- PascalCase, **số nhiều** (EF Core / SQL Server convention)
- Ví dụ: `Students`, `Companies`, `Internships`

## Column

- PascalCase
- Ví dụ: `StudentCode`, `CompanyName`, `CreatedAt`

## Primary Key (Database)

```
{EntityName}Id
```

Ví dụ: `StudentId`, `CompanyId`, `LecturerId`

## Foreign Key

```
{ReferencedEntity}Id
```

Ví dụ: `StudentId`, `CompanyId`, `LecturerId`, `UserId`

## Implementation Note (C#)

- Entity C# kế thừa `BaseEntity` với property `Id`
- EF Fluent API map `Id` → cột `{EntityName}Id` trong database
- Ví dụ: `Student.Id` ↔ `Students.StudentId`

## Common Audit Fields

| Column | Data Type | Description |
|--------|-----------|-------------|
| CreatedAt | DATETIME2 | Ngày tạo |
| UpdatedAt | DATETIME2 | Ngày cập nhật |
| CreatedBy | NVARCHAR | Người tạo (optional) |
| UpdatedBy | NVARCHAR | Người cập nhật (optional) |
| IsDeleted | BIT | Xóa mềm |

---

# 3. Data Dictionary

---

## Users

| Column | Data Type | Nullable | Description |
|--------|-----------|----------|-------------|
| UserId | UNIQUEIDENTIFIER | No | Primary Key |
| Username | NVARCHAR(100) | No | Tên đăng nhập |
| PasswordHash | NVARCHAR(MAX) | No | Mật khẩu đã mã hóa |
| FullName | NVARCHAR(200) | Yes | Họ tên |
| Email | NVARCHAR(200) | Yes | Email |
| Role | INT | No | SuperAdmin / Lecturer / Student |
| IsActive | BIT | No | Tài khoản hoạt động |
| LastLoginAt | DATETIME2 | Yes | Lần đăng nhập cuối |
| CreatedAt | DATETIME2 | No | Ngày tạo |
| UpdatedAt | DATETIME2 | Yes | Ngày cập nhật |
| IsDeleted | BIT | No | Xóa mềm |

---

## Lecturers

| Column | Data Type | Nullable | Description |
|--------|-----------|----------|-------------|
| LecturerId | UNIQUEIDENTIFIER | No | Primary Key |
| UserId | UNIQUEIDENTIFIER | Yes | FK → Users (unique khi có) |
| StaffCode | NVARCHAR(50) | No | Mã giảng viên (unique) |
| FullName | NVARCHAR(200) | No | Họ tên |
| Email | NVARCHAR(200) | Yes | Email |
| Phone | NVARCHAR(50) | Yes | Số điện thoại |
| Department | NVARCHAR(150) | Yes | Khoa / bộ môn |

---

## Students

| Column | Data Type | Nullable | Description |
|--------|-----------|----------|-------------|
| StudentId | UNIQUEIDENTIFIER | No | Primary Key |
| UserId | UNIQUEIDENTIFIER | Yes | FK → Users (unique khi có) |
| StudentCode | NVARCHAR(50) | No | MSSV |
| FullName | NVARCHAR(200) | No | Họ tên |
| Class | NVARCHAR(100) | Yes | Lớp |
| Major | NVARCHAR(150) | Yes | Chuyên ngành |
| Email | NVARCHAR(200) | Yes | Email |
| Phone | NVARCHAR(50) | Yes | Số điện thoại |

---

## Companies

| Column | Data Type | Nullable | Description |
|--------|-----------|----------|-------------|
| CompanyId | UNIQUEIDENTIFIER | No | Primary Key |
| CompanyName | NVARCHAR(250) | No | Tên doanh nghiệp |
| Website | NVARCHAR(250) | Yes | Website |
| Address | NVARCHAR(500) | Yes | Địa chỉ |
| Industry | NVARCHAR(150) | Yes | Lĩnh vực |
| ContactPerson | NVARCHAR(200) | Yes | Người liên hệ |
| ContactEmail | NVARCHAR(200) | Yes | Email liên hệ |
| ContactPhone | NVARCHAR(50) | Yes | SĐT liên hệ |
| Capacity | INT | Yes | Số lượng tiếp nhận |
| IsActive | BIT | No | Trạng thái hoạt động |

---

## Internships

| Column | Data Type | Nullable | Description |
|--------|-----------|----------|-------------|
| InternshipId | UNIQUEIDENTIFIER | No | Primary Key |
| StudentId | UNIQUEIDENTIFIER | No | FK → Students |
| LecturerId | UNIQUEIDENTIFIER | Yes | FK → Lecturers |
| CompanyId | UNIQUEIDENTIFIER | No | FK → Companies |
| Position | NVARCHAR(200) | Yes | Vị trí thực tập |
| StartDate | DATE | Yes | Ngày bắt đầu |
| EndDate | DATE | Yes | Ngày kết thúc |
| Status | INT | No | Trạng thái thực tập |
| SupervisorName | NVARCHAR(200) | Yes | Người hướng dẫn tại DN |
| Notes | NVARCHAR(MAX) | Yes | Ghi chú |

---

## WeeklyReports

| Column | Data Type | Nullable | Description |
|--------|-----------|----------|-------------|
| WeeklyReportId | UNIQUEIDENTIFIER | No | Primary Key |
| InternshipId | UNIQUEIDENTIFIER | No | FK → Internships |
| WeekNumber | INT | No | Tuần báo cáo |
| Title | NVARCHAR(250) | No | Tiêu đề |
| Content | NVARCHAR(8000) | No | Nội dung |
| Status | INT | No | Draft / Submitted / Reviewed |
| SubmittedAt | DATETIME2 | Yes | Thời gian nộp |
| LecturerComment | NVARCHAR(2000) | Yes | Nhận xét GV |

---

## Submissions

| Column | Data Type | Nullable | Description |
|--------|-----------|----------|-------------|
| SubmissionId | UNIQUEIDENTIFIER | No | Primary Key |
| InternshipId | UNIQUEIDENTIFIER | No | FK → Internships |
| Type | INT | No | Loại nộp (WeeklyReport, …) |
| Status | INT | No | Trạng thái nộp |
| Title | NVARCHAR(250) | Yes | Tiêu đề |
| Description | NVARCHAR(1000) | Yes | Mô tả |
| FileName | NVARCHAR(250) | Yes | Tên file |
| FileUrl | NVARCHAR(1000) | Yes | Đường dẫn tệp |
| Version | INT | No | Phiên bản |
| SubmittedAt | DATETIME2 | No | Thời gian nộp |

---

## Feedbacks

| Column | Data Type | Nullable | Description |
|--------|-----------|----------|-------------|
| FeedbackId | UNIQUEIDENTIFIER | No | Primary Key |
| SubmissionId | UNIQUEIDENTIFIER | No | FK → Submissions |
| LecturerId | UNIQUEIDENTIFIER | Yes | FK → Lecturers |
| Comment | NVARCHAR(2000) | No | Nhận xét |
| IsPublic | BIT | No | Hiển thị cho sinh viên |
| CreatedAt | DATETIME2 | No | Thời gian phản hồi |

---

## Evaluations

| Column | Data Type | Nullable | Description |
|--------|-----------|----------|-------------|
| EvaluationId | UNIQUEIDENTIFIER | No | Primary Key |
| InternshipId | UNIQUEIDENTIFIER | No | FK → Internships (1:1) |
| EvaluatedById | UNIQUEIDENTIFIER | Yes | FK → Users (GV thực hiện) |
| TechnicalScore | INT | No | Điểm kỹ thuật (0–10) |
| CommunicationScore | INT | No | Điểm giao tiếp |
| TeamworkScore | INT | No | Điểm làm việc nhóm |
| InitiativeScore | INT | No | Điểm chủ động |
| FinalGrade | DECIMAL(5,2) | No | Điểm tổng |
| Comments | NVARCHAR(3000) | Yes | Nhận xét |
| Strengths | NVARCHAR(2000) | Yes | Điểm mạnh |
| AreasForImprovement | NVARCHAR(2000) | Yes | Cần cải thiện |
| EvaluatedAt | DATETIME2 | No | Ngày đánh giá |
| IsFinalized | BIT | No | Đã chốt điểm |

---

## Documents

| Column | Data Type | Nullable | Description |
|--------|-----------|----------|-------------|
| DocumentId | UNIQUEIDENTIFIER | No | Primary Key |
| InternshipId | UNIQUEIDENTIFIER | No | FK → Internships |
| Title | NVARCHAR(300) | No | Tiêu đề |
| Description | NVARCHAR(2000) | Yes | Mô tả |
| Category | NVARCHAR(100) | Yes | Loại biểu mẫu |
| FileName | NVARCHAR(250) | No | Tên file gốc |
| FilePath | NVARCHAR(500) | No | Đường dẫn lưu trữ |
| FileSize | BIGINT | No | Kích thước (bytes) |
| MimeType | NVARCHAR(100) | No | MIME type |
| UploadedById | UNIQUEIDENTIFIER | Yes | FK → Lecturers |
| UploadedAt | DATETIME2 | No | Ngày tải lên |
| IsRequired | BIT | No | Bắt buộc hay không |

---

## Notifications

| Column | Data Type | Nullable | Description |
|--------|-----------|----------|-------------|
| NotificationId | UNIQUEIDENTIFIER | No | Primary Key |
| UserId | UNIQUEIDENTIFIER | No | FK → Users |
| Title | NVARCHAR(200) | No | Tiêu đề |
| Content | NVARCHAR(2000) | No | Nội dung |
| Link | NVARCHAR(500) | Yes | Liên kết |
| IsRead | BIT | No | Đã đọc |
| ReadAt | DATETIME2 | Yes | Thời gian đọc |
| CreatedAt | DATETIME2 | No | Thời gian tạo |

---

# 4. Planned (not yet implemented)

## InternshipLogs

| Column | Data Type | Nullable | Description |
|--------|-----------|----------|-------------|
| InternshipLogId | UNIQUEIDENTIFIER | No | Primary Key |
| InternshipId | UNIQUEIDENTIFIER | No | FK → Internships |
| WorkDate | DATE | No | Ngày làm việc |
| Description | NVARCHAR(MAX) | No | Nội dung công việc |

---

# 5. Notes

- Sử dụng `UNIQUEIDENTIFIER` làm khóa chính.
- Các trường văn bản sử dụng `NVARCHAR` để hỗ trợ tiếng Việt.
- Mật khẩu chỉ lưu dưới dạng `PasswordHash`.
- Enum lưu DB dạng `int`; API trả về dạng `string`.
- Feedback và Document upload liên kết trực tiếp `Lecturers`, không qua `Users`.
