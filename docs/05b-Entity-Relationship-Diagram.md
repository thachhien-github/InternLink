# Entity Relationship Diagram (ERD)

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.2

**Status:** Active — aligned with EF Core / SQL Server (12 tables)

**Diagram (Mermaid):** [`database/diagrams/erd.md`](../database/diagrams/erd.md)

---

# 1. Overview

ERD mô tả cấu trúc dữ liệu của hệ thống InternLink.

**Quy ước triển khai:**

- Bảng SQL: PascalCase **số nhiều** (`Students`, `Companies`, …)
- PK cột DB: `{Entity}Id`
- C# entity: property `Id` (map qua Fluent API)

---

# 2. Entities (implemented)

## User

- UserId, Username, PasswordHash, FullName, Email, Role
- IsActive, **MustChangePassword**, LastLoginAt

## PasswordResetToken

- PasswordResetTokenId, UserId, TokenHash, ExpiresAt, UsedAt

## Lecturer

- LecturerId, UserId, StaffCode, FullName, Email, Department

## Student

- StudentId, UserId, StudentCode, FullName, Class, Major

## Company

- CompanyId, CompanyName, Industry, Capacity, IsActive

## Internship

- InternshipId, StudentId, LecturerId, CompanyId, Status, StartDate, EndDate

## WeeklyReport

- WeeklyReportId, InternshipId, WeekNumber, Content, Status

## Submission

- SubmissionId, InternshipId, Type, Status, Version, FileUrl

## Feedback

- FeedbackId, SubmissionId, LecturerId, Comment

## Evaluation

- EvaluationId, InternshipId, EvaluatedById
- TechnicalScore, CommunicationScore, TeamworkScore, InitiativeScore
- FinalGrade, IsFinalized

## Document

- DocumentId, InternshipId, Title, Category, FilePath, MimeType

## Notification

- NotificationId, UserId, Title, Content, IsRead

---

# 3. Planned

## InternshipLog

- InternshipLogId, InternshipId, WorkDate, Description

---

# 4. Relationships

```
User (1) ──0..1── Lecturer
User (1) ──0..1── Student
User (1) ──*──── PasswordResetToken
User (1) ──*──── Notification

Lecturer (1) ──*── Internship
Student (1) ──1── Internship
Company (1) ──*── Internship

Internship (1) ──*── WeeklyReport
Internship (1) ──*── Submission
Internship (1) ──*── Document
Internship (1) ──0..1── Evaluation

Submission (1) ──*── Feedback
Lecturer (1) ──*── Feedback
```

---

# 5. Business Rules

- Một sinh viên một hồ sơ thực tập (1:1) trong đợt.
- Admin phân công `Internship.LecturerId`; Lecturer gán `CompanyId`.
- Một submission có thể có nhiều feedback.
- Một internship tối đa một evaluation đã finalize.

---

# 6. Related Documents

| Doc | Content |
|-----|---------|
| `docs/05c-Data-Dictionary.md` | Column-level detail |
| `docs/05d-Database-Design.md` | Design decisions |
| `database/README.md` | Ops guide, seed, migrate |
