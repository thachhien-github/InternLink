# Database Design

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.0

**Status:** Draft

---

# 1. Overview

Tài liệu này mô tả các quyết định thiết kế cơ sở dữ liệu của hệ thống InternLink.

Mục tiêu là xây dựng một cơ sở dữ liệu:

- Chuẩn hóa
- Dễ mở rộng
- Dễ bảo trì
- Phù hợp với Entity Framework Core
- Đáp ứng nhu cầu quản lý thực tập của giảng viên

---

# 2. Database Platform

| Item | Technology |
|------|------------|
| DBMS | Microsoft SQL Server |
| ORM | Entity Framework Core |
| Language | C# |
| Backend | ASP.NET Core Web API |
| Naming Convention | PascalCase |

---

# 3. Design Principles

Cơ sở dữ liệu được thiết kế dựa trên các nguyên tắc sau:

- Chuẩn hóa đến tối thiểu Third Normal Form (3NF).
- Mỗi bảng chỉ đại diện cho một thực thể nghiệp vụ.
- Hạn chế lưu trùng dữ liệu.
- Sử dụng khóa ngoại để đảm bảo toàn vẹn dữ liệu.
- Ưu tiên khả năng mở rộng hơn tối ưu hóa sớm.

---

# 4. Primary Key Strategy

Toàn bộ bảng sử dụng:

```text
UNIQUEIDENTIFIER (GUID)
```

Ví dụ

```text
StudentId
CompanyId
InternshipId
SubmissionId
```

## Advantages

- Không bị trùng khi mở rộng hệ thống.
- Thuận tiện đồng bộ dữ liệu.
- Phù hợp với EF Core.
- Dễ tích hợp API.

---

# 5. Foreign Key Strategy

Mọi quan hệ giữa các bảng đều sử dụng Foreign Key.

Ví dụ

Student

↓

Internship

↓

Submission

↓

Feedback

Điều này giúp đảm bảo:

- Không tồn tại dữ liệu mồ côi.
- Dễ truy vấn.
- Đảm bảo tính toàn vẹn.

---

# 6. Relationship Design

## One-to-One

Student

↓

Internship

Một sinh viên chỉ có một hồ sơ thực tập trong một đợt.

---

## One-to-Many

Company

↓

Internship

Một doanh nghiệp tiếp nhận nhiều sinh viên.

---

Internship

↓

WeeklyReport

Một hồ sơ thực tập có nhiều báo cáo tuần.

---

Internship

↓

Submission

Một hồ sơ thực tập có nhiều lần nộp.

---

Submission

↓

Feedback

Một lần nộp có nhiều phản hồi.

---

User

↓

Notification

Một người dùng nhận nhiều thông báo.

---

# 7. File Storage Strategy

InternLink không lưu file trực tiếp trong SQL Server.

Database chỉ lưu:

- FileUrl
- FileName
- FileType
- FileSize

Các tệp sẽ được lưu trong File Storage của hệ thống hoặc dịch vụ lưu trữ phù hợp.

Điều này giúp:

- Giảm kích thước cơ sở dữ liệu.
- Tăng hiệu năng.
- Dễ sao lưu.

---

# 8. Soft Delete Strategy

Không xóa dữ liệu vật lý đối với các bảng quan trọng.

Các bảng có thể sử dụng:

```text
IsDeleted
DeletedAt
```

Điều này giúp:

- Khôi phục dữ liệu.
- Đảm bảo lịch sử.
- Hạn chế mất dữ liệu ngoài ý muốn.

---

# 9. Audit Fields

Một số bảng sẽ có các trường chung:

| Column | Description |
|----------|-------------|
| CreatedAt | Thời gian tạo |
| UpdatedAt | Thời gian cập nhật |
| CreatedBy | Người tạo |
| UpdatedBy | Người cập nhật |

Audit Fields hỗ trợ theo dõi lịch sử thay đổi dữ liệu.

---

# 10. Data Integrity

Hệ thống áp dụng các ràng buộc sau:

- Primary Key
- Foreign Key
- NOT NULL
- UNIQUE (khi cần)
- CHECK Constraint (nếu cần)

Ví dụ:

- Username không được trùng.
- StudentCode không được trùng.
- Email phải duy nhất trong từng nhóm người dùng (nếu áp dụng).

---

# 11. Index Strategy

Các trường thường xuyên tìm kiếm sẽ được tạo Index.

Ví dụ:

- StudentCode
- CompanyName
- Username
- Internship.Status
- Submission.SubmittedAt

Điều này giúp tăng tốc độ truy vấn.

---

# 12. Enum Strategy

Các giá trị cố định sẽ được quản lý bằng Enum trong tầng Domain.

Ví dụ

## UserRole

- Lecturer
- Student

---

## InternshipStatus

- NotStarted
- InProgress
- WaitingFeedback
- NeedRevision
- Overdue
- Completed
- Evaluated

---

## DocumentCategory

- InternshipGuide
- RegistrationForm
- WeeklyReport
- FinalReport
- EvaluationForm
- Other

Việc sử dụng Enum giúp đảm bảo tính nhất quán giữa mã nguồn và dữ liệu.

---

# 13. Naming Convention

## Table

PascalCase

Ví dụ

```text
Student
Company
Submission
```

---

## Column

PascalCase

Ví dụ

```text
StudentId
CompanyName
CreatedAt
```

---

## Primary Key

```text
<EntityName>Id
```

---

## Foreign Key

```text
<EntityName>Id
```

---

# 14. Future Database Enhancements

Các tính năng dự kiến trong các phiên bản sau:

- InternshipBatch
- CompanyRating
- CompanyRecruitmentHistory
- ActivityLog
- RefreshToken
- EmailQueue
- AIRecommendation
- AIReportAnalysis
- InternshipSkill
- StudentSkill

Những bảng này không thuộc phạm vi MVP nhưng đã được xem xét để thuận tiện mở rộng sau này.

---

# 15. Summary

Cơ sở dữ liệu của InternLink được thiết kế theo hướng chuẩn hóa, dễ mở rộng và phù hợp với kiến trúc ASP.NET Core Web API kết hợp Entity Framework Core.

Thiết kế tập trung giải quyết ba bài toán nghiệp vụ chính:

- Quản lý tiến độ thực tập.
- Quản lý nộp bài và phản hồi.
- Quản lý doanh nghiệp.

Đồng thời vẫn đảm bảo khả năng mở rộng cho các chức năng AI và phân tích dữ liệu trong tương lai mà không cần thay đổi lớn về cấu trúc cơ sở dữ liệu.