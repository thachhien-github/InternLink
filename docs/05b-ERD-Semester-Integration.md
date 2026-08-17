# InternLink Data Model — Semester Integration ERD

**Version:** 2.0 — Supplement  
**Date:** August 2026  
**Scope:** Show current state + target state after Semester workflow implementation

---

# 1. Current State (As-Is) — August 14, 2026

```mermaid
erDiagram
    USER ||--o{ STUDENT : "1:N"
    USER ||--o{ LECTURER : "1:N"
    USER ||--o{ PASSWORD_RESET_TOKEN : "1:N"
    
    STUDENT ||--o| INTERNSHIP : "1:1 (ISSUE!)"
    LECTURER ||--o{ INTERNSHIP : "1:N"
    COMPANY ||--o{ INTERNSHIP : "1:N"
    SEMESTER ||--o{ INTERNSHIP : "1:N"
    
    INTERNSHIP ||--o{ SUBMISSION : "1:N"
    INTERNSHIP ||--o{ WEEKLY_REPORT : "1:N"
    INTERNSHIP ||--o{ DOCUMENT : "1:N"
    INTERNSHIP ||--o{ EVALUATION : "1:1"
    
    SUBMISSION ||--o{ FEEDBACK : "1:N"
    LECTURER ||--o{ FEEDBACK : "1:N"
    LECTURER ||--o{ DOCUMENT : "1:N (upload)"
    
    NOTIFICATION ||--o| STUDENT : "N:1"
    NOTIFICATION ||--o| LECTURER : "N:1"

    USER : Guid Id
    USER : string Username (unique)
    USER : string PasswordHash
    USER : string Email
    USER : string FullName
    USER : bool IsActive
    USER : bool MustChangePassword
    USER : Role (enum)
    USER : DateTime CreatedAt

    STUDENT : Guid Id
    STUDENT : Guid UserId (FK)
    STUDENT : string StudentCode (unique)
    STUDENT : string FullName
    STUDENT : string Class
    STUDENT : string Major
    STUDENT : string Email
    STUDENT : string Phone
    STUDENT : Internship? Internship "❌ ISSUE: 1:1 should be 1:N"

    LECTURER : Guid Id
    LECTURER : Guid UserId (FK)
    LECTURER : string StaffCode (unique)
    LECTURER : string FullName
    LECTURER : string Department
    LECTURER : string Email
    LECTURER : string Phone
    LECTURER : ICollection~Internship~ Internships

    COMPANY : Guid Id
    COMPANY : string CompanyName
    COMPANY : string Address
    COMPANY : string Website
    COMPANY : string Industry
    COMPANY : string ContactPerson
    COMPANY : string ContactEmail
    COMPANY : string ContactPhone
    COMPANY : bool IsActive

    SEMESTER : Guid Id
    SEMESTER : string Name
    SEMESTER : string Term (e.g., "Học kỳ I")
    SEMESTER : string AcademicYear (e.g., "2025-2026")
    SEMESTER : DateTime StartDate
    SEMESTER : DateTime EndDate
    SEMESTER : SemesterStatus Status "✅ Upcoming/Active/Completed/Draft"
    SEMESTER : string Description
    SEMESTER : int MaxStudentsPerLecturer
    SEMESTER : ICollection~Internship~ Internships

    INTERNSHIP : Guid Id
    INTERNSHIP : Guid StudentId (FK)
    INTERNSHIP : Guid CompanyId (FK) "❌ ISSUE: should be nullable"
    INTERNSHIP : Guid LecturerId (FK, nullable)
    INTERNSHIP : Guid SemesterId (FK, nullable) "✅ Added"
    INTERNSHIP : DateTime StartDate
    INTERNSHIP : DateTime EndDate
    INTERNSHIP : InternshipStatus Status
    INTERNSHIP : string Position
    INTERNSHIP : string SupervisorName
    INTERNSHIP : string Notes
    INTERNSHIP : "❌ NO unique constraint on (StudentId, SemesterId)"

    SUBMISSION : Guid Id
    SUBMISSION : Guid InternshipId (FK)
    SUBMISSION : SubmissionType Type
    SUBMISSION : SubmissionStatus Status
    SUBMISSION : string Title
    SUBMISSION : string Description
    SUBMISSION : string FileName
    SUBMISSION : string FileUrl
    SUBMISSION : DateTime SubmittedAt

    FEEDBACK : Guid Id
    FEEDBACK : Guid SubmissionId (FK)
    FEEDBACK : Guid LecturerId (FK)
    FEEDBACK : string Comment
    FEEDBACK : bool IsPublic
    FEEDBACK : DateTime CreatedAt

    DOCUMENT : Guid Id
    DOCUMENT : Guid InternshipId (FK)
    DOCUMENT : Guid UploadedById (FK, nullable)
    DOCUMENT : string Title
    DOCUMENT : string Description
    DOCUMENT : string FileName
    DOCUMENT : string FilePath
    DOCUMENT : long FileSize
    DOCUMENT : string MimeType
    DOCUMENT : "❌ MISSING: Category (for CV filter)"

    WEEKLY_REPORT : Guid Id
    WEEKLY_REPORT : Guid InternshipId (FK)
    WEEKLY_REPORT : int WeekNumber
    WEEKLY_REPORT : string Title
    WEEKLY_REPORT : string Content
    WEEKLY_REPORT : WeeklyReportStatus Status
    WEEKLY_REPORT : DateTime SubmittedAt

    EVALUATION : Guid Id
    EVALUATION : Guid InternshipId (FK)
    EVALUATION : decimal TechnicalScore
    EVALUATION : decimal CommunicationScore
    EVALUATION : decimal TeamworkScore
    EVALUATION : decimal InitiativeScore
    EVALUATION : decimal FinalGrade
    EVALUATION : string Comment
    EVALUATION : bool IsFinalized

    NOTIFICATION : Guid Id
    NOTIFICATION : Guid StudentId (FK, nullable)
    NOTIFICATION : Guid LecturerId (FK, nullable)
    NOTIFICATION : string Message
    NOTIFICATION : bool IsRead
    NOTIFICATION : DateTime CreatedAt

    PASSWORD_RESET_TOKEN : Guid Id
    PASSWORD_RESET_TOKEN : Guid UserId (FK)
    PASSWORD_RESET_TOKEN : string Token (hash)
    PASSWORD_RESET_TOKEN : DateTime ExpiryAt
    PASSWORD_RESET_TOKEN : DateTime UsedAt (nullable)
```

**Issues marked with ❌:**
1. **Student 1:1 Internship** — blocks multi-semester enrollment
2. **Internship.CompanyId required** — should be nullable (assigned later)
3. **No unique(StudentId, SemesterId)** — allows duplicate enrollment
4. **Document.Category missing** — can't filter CV documents

---

# 2. Target State (To-Be) — After Implementation

```mermaid
erDiagram
    USER ||--o{ STUDENT : "1:N"
    USER ||--o{ LECTURER : "1:N"
    USER ||--o{ PASSWORD_RESET_TOKEN : "1:N"
    
    STUDENT ||--o{ INTERNSHIP : "1:N ✅ FIXED"
    LECTURER ||--o{ INTERNSHIP : "1:N"
    COMPANY ||--o{ INTERNSHIP : "1:N"
    SEMESTER ||--o{ INTERNSHIP : "1:N"
    
    INTERNSHIP ||--o{ SUBMISSION : "1:N"
    INTERNSHIP ||--o{ WEEKLY_REPORT : "1:N"
    INTERNSHIP ||--o{ DOCUMENT : "1:N"
    INTERNSHIP ||--o{ EVALUATION : "1:1"
    
    SUBMISSION ||--o{ FEEDBACK : "1:N"
    LECTURER ||--o{ FEEDBACK : "1:N"
    LECTURER ||--o{ DOCUMENT : "1:N (upload)"
    
    NOTIFICATION ||--o| STUDENT : "N:1"
    NOTIFICATION ||--o| LECTURER : "N:1"

    USER : Guid Id
    USER : string Username (unique)
    USER : string PasswordHash
    USER : string Email
    USER : string FullName
    USER : bool IsActive
    USER : bool MustChangePassword
    USER : Role (enum)
    USER : DateTime CreatedAt

    STUDENT : Guid Id
    STUDENT : Guid UserId (FK)
    STUDENT : string StudentCode (unique)
    STUDENT : string FullName
    STUDENT : string Class
    STUDENT : string Major
    STUDENT : string Email
    STUDENT : string Phone
    STUDENT : "✅ ICollection~Internship~ Internships"

    LECTURER : Guid Id
    LECTURER : Guid UserId (FK)
    LECTURER : string StaffCode (unique)
    LECTURER : string FullName
    LECTURER : string Department
    LECTURER : string Email
    LECTURER : string Phone
    LECTURER : ICollection~Internship~ Internships

    COMPANY : Guid Id
    COMPANY : string CompanyName
    COMPANY : string Address
    COMPANY : string Website
    COMPANY : string Industry
    COMPANY : string ContactPerson
    COMPANY : string ContactEmail
    COMPANY : string ContactPhone
    COMPANY : bool IsActive

    SEMESTER : Guid Id
    SEMESTER : string Name
    SEMESTER : string Term (e.g., "Học kỳ I")
    SEMESTER : string AcademicYear (e.g., "2025-2026")
    SEMESTER : DateTime StartDate
    SEMESTER : DateTime EndDate
    SEMESTER : SemesterStatus Status "✅ Upcoming/Active/Completed/Draft"
    SEMESTER : string Description
    SEMESTER : int MaxStudentsPerLecturer
    SEMESTER : ICollection~Internship~ Internships

    INTERNSHIP : Guid Id
    INTERNSHIP : Guid StudentId (FK)
    INTERNSHIP : "✅ Guid CompanyId (FK, nullable)"
    INTERNSHIP : Guid LecturerId (FK, nullable)
    INTERNSHIP : Guid SemesterId (FK, nullable)
    INTERNSHIP : DateTime StartDate
    INTERNSHIP : DateTime EndDate
    INTERNSHIP : InternshipStatus Status
    INTERNSHIP : string Position
    INTERNSHIP : string SupervisorName
    INTERNSHIP : string Notes
    INTERNSHIP : "✅ UNIQUE(StudentId, SemesterId)"

    SUBMISSION : Guid Id
    SUBMISSION : Guid InternshipId (FK)
    SUBMISSION : SubmissionType Type
    SUBMISSION : SubmissionStatus Status
    SUBMISSION : string Title
    SUBMISSION : string Description
    SUBMISSION : string FileName
    SUBMISSION : string FileUrl
    SUBMISSION : DateTime SubmittedAt

    FEEDBACK : Guid Id
    FEEDBACK : Guid SubmissionId (FK)
    FEEDBACK : Guid LecturerId (FK)
    FEEDBACK : string Comment
    FEEDBACK : bool IsPublic
    FEEDBACK : DateTime CreatedAt

    DOCUMENT : Guid Id
    DOCUMENT : Guid InternshipId (FK)
    DOCUMENT : "✅ string Category (e.g., CV, Form)"
    DOCUMENT : Guid UploadedById (FK, nullable)
    DOCUMENT : string Title
    DOCUMENT : string Description
    DOCUMENT : string FileName
    DOCUMENT : string FilePath
    DOCUMENT : long FileSize
    DOCUMENT : string MimeType

    WEEKLY_REPORT : Guid Id
    WEEKLY_REPORT : Guid InternshipId (FK)
    WEEKLY_REPORT : int WeekNumber
    WEEKLY_REPORT : string Title
    WEEKLY_REPORT : string Content
    WEEKLY_REPORT : WeeklyReportStatus Status
    WEEKLY_REPORT : DateTime SubmittedAt

    EVALUATION : Guid Id
    EVALUATION : Guid InternshipId (FK)
    EVALUATION : decimal TechnicalScore
    EVALUATION : decimal CommunicationScore
    EVALUATION : decimal TeamworkScore
    EVALUATION : decimal InitiativeScore
    EVALUATION : decimal FinalGrade
    EVALUATION : string Comment
    EVALUATION : bool IsFinalized

    NOTIFICATION : Guid Id
    NOTIFICATION : Guid StudentId (FK, nullable)
    NOTIFICATION : Guid LecturerId (FK, nullable)
    NOTIFICATION : string Message
    NOTIFICATION : bool IsRead
    NOTIFICATION : DateTime CreatedAt

    PASSWORD_RESET_TOKEN : Guid Id
    PASSWORD_RESET_TOKEN : Guid UserId (FK)
    PASSWORD_RESET_TOKEN : string Token (hash)
    PASSWORD_RESET_TOKEN : DateTime ExpiryAt
    PASSWORD_RESET_TOKEN : DateTime UsedAt (nullable)
```

**All issues fixed with ✅:**
1. **Student 1:N Internship** — supports multi-semester enrollment
2. **Internship.CompanyId nullable** — can be NULL at enrollment (assigned later)
3. **UNIQUE(StudentId, SemesterId)** — enforces one internship per student per semester
4. **Document.Category** — filter CV vs other documents

---

# 3. Key Changes Summary

| Entity | Field | Change | Reason |
|--------|-------|--------|--------|
| Student | Internship → Internships | Change to ICollection | Support multi-semester (1:N) |
| Internship | CompanyId | Make nullable | Company assigned later by Lecturer |
| Internship | (StudentId, SemesterId) | Add unique constraint | Prevent duplicate enrollment per semester |
| Document | Add Category | New field (string) | Filter CV docs (Category = "CV") |

---

# 4. Data Flow Examples

## Example 1: Multi-Semester SV

```
Timeline:
  Semester 1 (HK1-2025)           Semester 2 (HK2-2026)
  │                                 │
  ├─ Internship #1                  ├─ Internship #2
  │  StudentId: A                   │  StudentId: A (same)
  │  CompanyId: 123 (assigned)      │  CompanyId: NULL (pending assignment)
  │  LecturerId: B                  │  LecturerId: C (may be different GV)
  │  SemesterId: sem-1              │  SemesterId: sem-2
  │  Status: Completed              │  Status: NotStarted
  │                                 │
  └─ (Semester completed)           └─ (Active / Upcoming)

Same User, Same Student, Different Internship per Semester
```

## Example 2: CV Upload & Download

```
Flow:
  SV uploads CV
    → Document { InternshipId: X, Category: "CV", FileName: "CV_2025.pdf", ... }
  
  GV retrieves CV
    → GET /api/Internship/{internshipId}/documents?category=CV
    → Returns only Document with Category = "CV"
    → GV downloads PDF

Lecturer cannot see other internship's CV (filtered by InternshipId)
```

## Example 3: Import → Enroll → Assign

```
Workflow:
  1. Admin creates Semester (Name="HK1-2025", Status=Upcoming)
  2. Admin sets Semester status=Active (UI dropdown)
  3. Admin imports Excel → for each SV:
       - Upsert Student (global, by StudentCode)
       - Create Internship { StudentId=A, SemesterId=Active, CompanyId=NULL, LecturerId=NULL }
  4. Admin bulk assign:
       - Update Internship { StudentId=A, SemesterId=Active } set LecturerId=B
  5. Lecturer gv.Internships (filtered SemesterId=Active) shows assigned SV
  6. Lecturer assigns company:
       - Update Internship { ..., CompanyId=123 }
  7. SV uploads CV → Document { InternshipId=..., Category="CV" }
```

---

# 5. Database Constraints (SQL)

```sql
-- NEW unique constraint for 1 internship per student per semester
ALTER TABLE Internships
ADD CONSTRAINT UQ_StudentSemester UNIQUE(StudentId, SemesterId);

-- CompanyId now nullable (was required)
ALTER TABLE Internships
ALTER COLUMN CompanyId UNIQUEIDENTIFIER NULL;

-- Add Category column to Documents
ALTER TABLE Documents
ADD Category NVARCHAR(50) NULL;
-- Populate existing docs (if any) with default category
UPDATE Documents SET Category = 'Form' WHERE Category IS NULL;
-- Make required for new inserts
ALTER TABLE Documents
ALTER COLUMN Category NVARCHAR(50) NOT NULL;
```

---

# 6. Implementation Checklist

## Entity Changes (C# Domain Model)

- [ ] Student.cs: Change `Internship?` → `ICollection<Internship>`
- [ ] Internship.cs: Verify SemesterId FK (already exists)
- [ ] Document.cs: Add `public string Category { get; set; }`
- [ ] Company.cs: Verify (no changes)
- [ ] Semester.cs: Verify (already exists)

## DbContext Configuration

- [ ] Update `Student` modelBuilder: `WithMany()` instead of `WithOne()`
- [ ] Update `Internship` modelBuilder: Add unique index on (StudentId, SemesterId)
- [ ] Update `Internship.CompanyId`: Remove required constraint
- [ ] Verify `Semester` relationship: `WithMany()` on both sides

## Database Migration

- [ ] Create migration: "UpdateInternshipMultiSemester"
  - Drop existing 1:1 FK Student.Internship → Internship.StudentId
  - Add new 1:N FK Student.Internships ← Internship.StudentId
  - Make CompanyId nullable
  - Add unique constraint (StudentId, SemesterId)
  - Add Category column to Documents
- [ ] Apply migration

## API Updates (not in this phase)

- [ ] Admin import: Include SemesterId parameter
- [ ] Admin assign: Filter by SemesterId context
- [ ] Lecturer internships list: Filter by active semester
- [ ] Student upload CV: Set Document.Category = "CV"
- [ ] Document GET: Support ?category filter

---

# 7. References

- [03b-Semester-Workflow-Supplement.md](03b-Semester-Workflow-Supplement.md) — Workflow details
- [05c-Data-Dictionary.md](05c-Data-Dictionary.md) — Entity field descriptions
- Backend domain: `InternLink.Domain.Entities.*`
- DbContext: `InternLink.Infrastructure.Persistence.AppDbContext`
