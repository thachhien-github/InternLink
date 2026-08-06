# Data Dictionary

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.0

**Status:** Draft

---

# 1. Overview

Data Dictionary mô tả chi tiết cấu trúc dữ liệu của hệ thống InternLink.

Tài liệu này là cầu nối giữa Entity Relationship Diagram (ERD) và quá trình triển khai cơ sở dữ liệu bằng SQL Server và Entity Framework Core.

---

# 2. Naming Convention

## Table

- PascalCase
- Ví dụ

```
Student
Company
Internship
```

---

## Column

- PascalCase

Ví dụ

```
StudentId
CompanyName
CreatedAt
```

---

## Primary Key

```
<EntityName>Id
```

Ví dụ

```
StudentId
CompanyId
SubmissionId
```

---

## Foreign Key

```
<EntityName>Id
```

Ví dụ

```
StudentId
CompanyId
LecturerId
```

---

# 3. Data Dictionary

---

## User

| Column | Data Type | Nullable | Description |
|----------|-----------|----------|-------------|
| UserId | UNIQUEIDENTIFIER | No | Primary Key |
| Username | NVARCHAR(100) | No | Tên đăng nhập |
| PasswordHash | NVARCHAR(MAX) | No | Mật khẩu đã mã hóa |
| Role | NVARCHAR(20) | No | Lecturer / Student |
| CreatedAt | DATETIME2 | No | Ngày tạo |

---

## Lecturer

| Column | Data Type | Nullable | Description |
|----------|-----------|----------|-------------|
| LecturerId | UNIQUEIDENTIFIER | No | Primary Key |
| UserId | UNIQUEIDENTIFIER | No | FK -> User |
| FullName | NVARCHAR(100) | No | Họ tên |
| Email | NVARCHAR(100) | No | Email |
| Phone | NVARCHAR(20) | Yes | Số điện thoại |

---

## Student

| Column | Data Type | Nullable | Description |
|----------|-----------|----------|-------------|
| StudentId | UNIQUEIDENTIFIER | No | Primary Key |
| UserId | UNIQUEIDENTIFIER | No | FK -> User |
| StudentCode | NVARCHAR(20) | No | MSSV |
| FullName | NVARCHAR(100) | No | Họ tên |
| Class | NVARCHAR(50) | No | Lớp |
| Major | NVARCHAR(100) | No | Chuyên ngành |
| Email | NVARCHAR(100) | No | Email |
| Phone | NVARCHAR(20) | Yes | Số điện thoại |

---

## Company

| Column | Data Type | Nullable | Description |
|----------|-----------|----------|-------------|
| CompanyId | UNIQUEIDENTIFIER | No | Primary Key |
| CompanyName | NVARCHAR(200) | No | Tên doanh nghiệp |
| Website | NVARCHAR(255) | Yes | Website |
| Address | NVARCHAR(255) | Yes | Địa chỉ |
| Industry | NVARCHAR(100) | Yes | Lĩnh vực |
| ContactPerson | NVARCHAR(100) | Yes | Người liên hệ |
| ContactEmail | NVARCHAR(100) | Yes | Email liên hệ |
| ContactPhone | NVARCHAR(20) | Yes | SĐT liên hệ |
| Capacity | INT | Yes | Số lượng tiếp nhận |
| Note | NVARCHAR(MAX) | Yes | Ghi chú |

---

## Internship

| Column | Data Type | Nullable | Description |
|----------|-----------|----------|-------------|
| InternshipId | UNIQUEIDENTIFIER | No | Primary Key |
| StudentId | UNIQUEIDENTIFIER | No | FK -> Student |
| LecturerId | UNIQUEIDENTIFIER | No | FK -> Lecturer |
| CompanyId | UNIQUEIDENTIFIER | No | FK -> Company |
| Position | NVARCHAR(100) | No | Vị trí thực tập |
| StartDate | DATE | No | Ngày bắt đầu |
| EndDate | DATE | No | Ngày kết thúc |
| Status | NVARCHAR(30) | No | Trạng thái thực tập |

---

## WeeklyReport

| Column | Data Type | Nullable | Description |
|----------|-----------|----------|-------------|
| WeeklyReportId | UNIQUEIDENTIFIER | No | Primary Key |
| InternshipId | UNIQUEIDENTIFIER | No | FK -> Internship |
| WeekNumber | INT | No | Tuần báo cáo |
| Content | NVARCHAR(MAX) | Yes | Nội dung |
| SubmittedAt | DATETIME2 | Yes | Thời gian nộp |

---

## InternshipLog

| Column | Data Type | Nullable | Description |
|----------|-----------|----------|-------------|
| InternshipLogId | UNIQUEIDENTIFIER | No | Primary Key |
| InternshipId | UNIQUEIDENTIFIER | No | FK -> Internship |
| WorkDate | DATE | No | Ngày làm việc |
| Description | NVARCHAR(MAX) | No | Nội dung công việc |

---

## Submission

| Column | Data Type | Nullable | Description |
|----------|-----------|----------|-------------|
| SubmissionId | UNIQUEIDENTIFIER | No | Primary Key |
| InternshipId | UNIQUEIDENTIFIER | No | FK -> Internship |
| Title | NVARCHAR(200) | No | Tiêu đề |
| FileUrl | NVARCHAR(500) | No | Đường dẫn tệp |
| Version | INT | No | Phiên bản |
| SubmittedAt | DATETIME2 | No | Thời gian nộp |

---

## Feedback

| Column | Data Type | Nullable | Description |
|----------|-----------|----------|-------------|
| FeedbackId | UNIQUEIDENTIFIER | No | Primary Key |
| SubmissionId | UNIQUEIDENTIFIER | No | FK -> Submission |
| LecturerId | UNIQUEIDENTIFIER | No | FK -> Lecturer |
| Comment | NVARCHAR(MAX) | No | Nhận xét |
| CreatedAt | DATETIME2 | No | Thời gian phản hồi |

---

## Evaluation

| Column | Data Type | Nullable | Description |
|----------|-----------|----------|-------------|
| EvaluationId | UNIQUEIDENTIFIER | No | Primary Key |
| InternshipId | UNIQUEIDENTIFIER | No | FK -> Internship |
| ProcessScore | DECIMAL(4,2) | Yes | Điểm quá trình |
| ReportScore | DECIMAL(4,2) | Yes | Điểm báo cáo |
| CompanyScore | DECIMAL(4,2) | Yes | Điểm doanh nghiệp |
| FinalScore | DECIMAL(4,2) | Yes | Điểm tổng kết |
| Comment | NVARCHAR(MAX) | Yes | Nhận xét |

---

## Document

| Column | Data Type | Nullable | Description |
|----------|-----------|----------|-------------|
| DocumentId | UNIQUEIDENTIFIER | No | Primary Key |
| Title | NVARCHAR(200) | No | Tiêu đề |
| Category | NVARCHAR(100) | No | Loại biểu mẫu |
| FileUrl | NVARCHAR(500) | No | Đường dẫn tệp |
| UploadedBy | UNIQUEIDENTIFIER | No | FK -> Lecturer |
| UploadedAt | DATETIME2 | No | Ngày tải lên |

---

## Notification

| Column | Data Type | Nullable | Description |
|----------|-----------|----------|-------------|
| NotificationId | UNIQUEIDENTIFIER | No | Primary Key |
| UserId | UNIQUEIDENTIFIER | No | FK -> User |
| Title | NVARCHAR(200) | No | Tiêu đề |
| Content | NVARCHAR(MAX) | No | Nội dung |
| IsRead | BIT | No | Đã đọc |
| CreatedAt | DATETIME2 | No | Thời gian tạo |

---

# 4. Common Audit Fields

Một số bảng có thể bổ sung các trường dùng chung:

| Column | Data Type | Description |
|----------|-----------|-------------|
| CreatedAt | DATETIME2 | Ngày tạo |
| UpdatedAt | DATETIME2 | Ngày cập nhật |
| DeletedAt | DATETIME2 | Ngày xóa mềm |
| IsDeleted | BIT | Xóa mềm |

---

# 5. Notes

- Sử dụng `UNIQUEIDENTIFIER` làm khóa chính để thuận tiện khi mở rộng hệ thống.
- Các trường văn bản sử dụng `NVARCHAR` để hỗ trợ tiếng Việt.
- Mật khẩu chỉ lưu dưới dạng `PasswordHash`, không lưu mật khẩu gốc.
- Tất cả các mối quan hệ khóa ngoại sẽ được cấu hình bằng Entity Framework Core Fluent API.
- Các giá trị như `Role`, `Status`, `Category` nên được định nghĩa bằng `enum` trong tầng Domain để đảm bảo tính nhất quán giữa mã nguồn và cơ sở dữ liệu.