# Entity Relationship Diagram (ERD)

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.1

**Status:** Active — aligned with EF Core / SQL Server implementation

---

# 1. Overview

ERD mô tả cấu trúc dữ liệu của hệ thống InternLink.

Các Entity được xây dựng dựa trên Domain Model và Use Case.

**Quy ước triển khai:**
- Bảng SQL: PascalCase **số nhiều** (`Students`, `Companies`, …)
- PK cột DB: `{Entity}Id` (ví dụ `StudentId`, `LecturerId`)
- C# entity: property `Id` (map qua Fluent API → `{Entity}Id`)

---

# 2. Main Entities

## User

- UserId
- Username
- PasswordHash
- Role

---

## Lecturer

- LecturerId
- FullName
- Email
- Phone

---

## Student

- StudentId
- StudentCode
- FullName
- Class
- Major
- Email
- Phone

---

## Company

- CompanyId
- CompanyName
- Website
- Address
- Industry
- ContactPerson
- ContactEmail
- ContactPhone
- Capacity

---

## Internship

- InternshipId
- StudentId
- LecturerId
- CompanyId
- StartDate
- EndDate
- Position
- Status

---

## WeeklyReport

- ReportId → WeeklyReportId
- InternshipId
- WeekNumber
- Content
- SubmittedAt

---

## InternshipLog

- LogId
- InternshipId
- WorkDate
- Description

---

## Submission

- SubmissionId
- InternshipId
- Title
- FileUrl
- Version
- SubmittedAt

---

## Feedback

- FeedbackId
- SubmissionId
- LecturerId
- Comment
- CreatedAt

---

## Evaluation

- EvaluationId
- InternshipId
- ProcessScore
- ReportScore
- CompanyScore
- FinalScore
- Comment

---

## Document

- DocumentId
- Title
- Category
- FileUrl
- UploadedAt

---

## Notification

- NotificationId
- UserId
- Title
- Content
- IsRead
- CreatedAt

---

# 3. Relationships

User (1) ------ (1) Lecturer

User (1) ------ (1) Student

Lecturer (1) ------ (*) Internship

Student (1) ------ (1) Internship

Company (1) ------ (*) Internship

Internship (1) ------ (*) WeeklyReport

Internship (1) ------ (*) InternshipLog

Internship (1) ------ (*) Submission

Submission (1) ------ (*) Feedback

Internship (1) ------ (1) Evaluation

User (1) ------ (*) Notification

---

# 4. Notes

- Một sinh viên chỉ có một hồ sơ thực tập trong một đợt.
- Một doanh nghiệp tiếp nhận nhiều sinh viên.
- Một lần nộp có thể nhận nhiều phản hồi.
- Một hồ sơ thực tập chỉ có một kết quả đánh giá cuối kỳ.

---

# 5. Next Step

Từ ERD sẽ tiến hành:

- Thiết kế Database
- Thiết kế API
- Xây dựng Entity Framework Core Models