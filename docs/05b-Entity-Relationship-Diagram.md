# InternLink — Sơ Đồ Thực Thể Quan Hệ (Entity Relationship Diagram - ERD)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0  
**Ngày cập nhật:** Tháng 8/2026

---

## 1. Sơ Đồ ERD Chi Tiết (Mermaid Diagram)

```mermaid
erDiagram
    Users ||--o| Students : "has profile"
    Users ||--o| Lecturers : "has profile"
    Users ||--o{ RefreshTokens : "owns"
    Users ||--o{ PasswordResetTokens : "requests"
    Users ||--o{ Notifications : "receives"

    Semesters ||--o{ Internships : "contains"
    Students ||--o{ Internships : "participates in"
    Lecturers ||--o{ Internships : "supervises"
    Companies ||--o{ Internships : "hosts"

    Internships ||--o{ WeeklyReports : "has 12 weeks"
    Internships ||--o{ Submissions : "has final reports"
    Internships ||--o| Evaluations : "evaluated by rubric"
    Internships ||--o{ Documents : "contains attachments"

    Submissions ||--o{ Feedbacks : "reviewed by"

    Users {
        uuid Id PK
        string Username UK
        string PasswordHash
        string Email
        string FullName
        int Role
        bool MustChangePassword
        bool IsActive
        datetime LastLoginAt
        bool IsDeleted
        datetime CreatedAt
    }

    Semesters {
        uuid Id PK
        string Code UK
        string Name
        datetime StartDate
        datetime EndDate
        bool IsCurrent
        bool IsDeleted
    }

    Students {
        uuid Id PK
        uuid UserId FK
        string StudentCode UK
        string FullName
        string Class
        string Major
        string Phone
        string Email
        decimal GPA
        bool IsDeleted
    }

    Lecturers {
        uuid Id PK
        uuid UserId FK
        string StaffCode UK
        string FullName
        string Department
        string AcademicRank
        string Title
        string Phone
        string Email
        bool IsDeleted
    }

    Companies {
        uuid Id PK
        string CompanyName
        string TaxCode
        string Address
        string Industry
        string ContactPerson
        string ContactEmail
        string ContactPhone
        int Capacity
        bool IsActive
        bool IsDeleted
    }

    Internships {
        uuid Id PK
        uuid SemesterId FK
        uuid StudentId FK
        uuid LecturerId FK
        uuid CompanyId FK
        string Position
        string TopicTitle
        datetime StartDate
        datetime EndDate
        int Status
        bool IsDeleted
    }

    WeeklyReports {
        uuid Id PK
        uuid InternshipId FK
        int WeekNumber
        string Content
        string PlanNextWeek
        string Obstacles
        string Attachments
        int Status
        string ReviewNotes
        decimal Score
        datetime SubmittedAt
        bool IsDeleted
    }

    Submissions {
        uuid Id PK
        uuid InternshipId FK
        string Title
        string Description
        int Type
        int Version
        string FileUrl
        string MimeType
        long FileSize
        int Status
        datetime SubmittedAt
        bool IsDeleted
    }

    Feedbacks {
        uuid Id PK
        uuid SubmissionId FK
        uuid LecturerId FK
        string Content
        int Rating
        datetime CreatedAt
    }

    Evaluations {
        uuid Id PK
        uuid InternshipId FK
        uuid LecturerId FK
        decimal TechnicalScore
        decimal AttitudeScore
        decimal SoftSkillsScore
        decimal FinalReportScore
        decimal TotalScore
        string FinalGrade
        string LecturerComments
        string EnterpriseComments
        bool IsFinalized
        datetime FinalizedAt
        bool IsDeleted
    }

    Documents {
        uuid Id PK
        uuid InternshipId FK
        uuid UploadedById FK
        string Title
        string Category
        string FileName
        string FilePath
        string MimeType
        long FileSize
        bool IsRequired
        datetime UploadedAt
        bool IsDeleted
    }

    Notifications {
        uuid Id PK
        uuid UserId FK
        string Title
        string Message
        int Type
        bool IsRead
        datetime CreatedAt
    }
```

---

## 2. Ràng Buộc Khóa Ngoại & Tính Toàn Vẹn Tham Chiếu (Foreign Key Constraints)

1. **`Internships`**:
   - `FK_Internships_Semesters`: `SemesterId` $\rightarrow$ `Semesters(Id)` (Restricted Delete).
   - `FK_Internships_Students`: `StudentId` $\rightarrow$ `Students(Id)` (Restricted Delete).
   - `FK_Internships_Lecturers`: `LecturerId` $\rightarrow$ `Lecturers(Id)` (Null on Delete).
   - `FK_Internships_Companies`: `CompanyId` $\rightarrow$ `Companies(Id)` (Null on Delete).
2. **`WeeklyReports`**:
   - `FK_WeeklyReports_Internships`: `InternshipId` $\rightarrow$ `Internships(Id)` (Cascade Delete / Soft Delete).
   - Index duy nhất: `(InternshipId, WeekNumber)` để bảo đảm mỗi sinh viên chỉ có 1 báo cáo cho mỗi tuần.
3. **`Evaluations`**:
   - `FK_Evaluations_Internships`: `InternshipId` $\rightarrow$ `Internships(Id)` (Unique 1:1).
