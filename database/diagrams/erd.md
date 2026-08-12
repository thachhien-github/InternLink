# InternLink ERD (Implementation)

**Version:** 1.2 — sync với EF Core / SQL Server

```mermaid
erDiagram
    Users {
        uniqueidentifier UserId PK
        nvarchar Username
        nvarchar PasswordHash
        nvarchar FullName
        nvarchar Email
        int Role
        bit IsActive
        bit MustChangePassword
        datetime2 LastLoginAt
        bit IsDeleted
    }

    PasswordResetTokens {
        uniqueidentifier PasswordResetTokenId PK
        uniqueidentifier UserId FK
        nvarchar TokenHash UK
        datetime2 ExpiresAt
        datetime2 UsedAt
        bit IsDeleted
    }

    Lecturers {
        uniqueidentifier LecturerId PK
        uniqueidentifier UserId FK_UK
        nvarchar StaffCode UK
        nvarchar FullName
        nvarchar Department
    }

    Students {
        uniqueidentifier StudentId PK
        uniqueidentifier UserId FK_UK
        nvarchar StudentCode
        nvarchar FullName
        nvarchar Class
        nvarchar Major
    }

    Companies {
        uniqueidentifier CompanyId PK
        nvarchar CompanyName
        nvarchar Industry
        int Capacity
        bit IsActive
    }

    Internships {
        uniqueidentifier InternshipId PK
        uniqueidentifier StudentId FK_UK
        uniqueidentifier LecturerId FK
        uniqueidentifier CompanyId FK
        int Status
        date StartDate
        date EndDate
    }

    WeeklyReports {
        uniqueidentifier WeeklyReportId PK
        uniqueidentifier InternshipId FK
        int WeekNumber
        int Status
    }

    Submissions {
        uniqueidentifier SubmissionId PK
        uniqueidentifier InternshipId FK
        int Type
        int Status
        int Version
    }

    Feedbacks {
        uniqueidentifier FeedbackId PK
        uniqueidentifier SubmissionId FK
        uniqueidentifier LecturerId FK
        nvarchar Comment
    }

    Evaluations {
        uniqueidentifier EvaluationId PK
        uniqueidentifier InternshipId FK_UK
        uniqueidentifier EvaluatedById FK
        decimal FinalGrade
        bit IsFinalized
    }

    Documents {
        uniqueidentifier DocumentId PK
        uniqueidentifier InternshipId FK
        nvarchar FilePath
        bigint FileSize
    }

    Notifications {
        uniqueidentifier NotificationId PK
        uniqueidentifier UserId FK
        nvarchar Title
        bit IsRead
    }

    Users ||--o| Lecturers : links
    Users ||--o| Students : links
    Users ||--o{ PasswordResetTokens : has
    Users ||--o{ Notifications : receives
    Lecturers ||--o{ Internships : supervises
    Students ||--|| Internships : has
    Companies ||--o{ Internships : hosts
    Internships ||--o{ WeeklyReports : contains
    Internships ||--o{ Submissions : contains
    Internships ||--o{ Documents : contains
    Internships ||--o| Evaluations : graded_by
    Submissions ||--o{ Feedbacks : receives
    Lecturers ||--o{ Feedbacks : writes
```

## Cardinality notes

- **Student : Internship** = 1:1 (một SV một hồ sơ thực tập trong đợt).
- **Internship : Evaluation** = 1:0..1 (một hồ sơ tối đa một bản chấm cuối kỳ).
- **User : PasswordResetToken** = 1:N (nhiều token theo thời gian; chỉ token chưa dùng + chưa hết hạn hợp lệ).
