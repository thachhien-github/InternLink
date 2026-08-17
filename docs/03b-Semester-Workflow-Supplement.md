# Semester Workflow Supplement

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 2.0 — Supplement

**Date:** August 2026

**Purpose:** Document the **additive** Semester/Đợt layer; clarify relationship to original MVP (2-page limit — delta only, not full rewrite)

**Status:** Ready for implementation (3 decisions confirmed)

---

# 1. Context

Original [03-Business-Workflow.md](03-Business-Workflow.md) and [04-Use-Case-Specification.md](04-Use-Case-Specification.md) describe a single **active internship cohort**. Vision §9 mentions "Multi-faculty / batch management" as future, but MVP was designed as 1:1 Student ↔ Internship (implied "within a semester").

**This supplement** makes the semester context **explicit** and **operational**:

- Add Semester entity (container for vận hành per cohort)
- Change Internship from 1:1 to 1:N per Student (per semester)
- Define enrollment + lifecycle (Upcoming → Active → Completed)
- Confirm CV, import, and close-semester behaviors

**NOT a system overhaul** — Lecturer/Student workflows (Modules B–E) remain unchanged; Admin ops (Module A) gains semester context.

---

# 2. Relationships

## Original MVP Structure (unchanged)

```
User (global account, one per person)
├── Student (MSSV, global profile)
│   └── Internship (1 : 1 in MVP → NOW 1 : N per Semester)
│       ├── WeeklyReport
│       ├── Submission (+ Feedback loop)
│       └── Evaluation
├── Lecturer (global profile)
│   └── teaches many Internships (UC-L01)
└── Company (global master data)
    └── assigned to many Internships (UC-L04)
```

## NEW: Semester Container

```
Semester (NEW entity)
├── Name (e.g., "HK1-2025")
├── Status (Upcoming, Active, Completed)
└── contains many Internships (filtered by SemesterId)
    └── each Internship now has (StudentId, SemesterId) unique key
```

**Key change:**
```
OLD:  Student 1:1 Internship
NEW:  Student 1:N Internship (each Internship ← (StudentId, SemesterId))
```

---

# 3. Four Decisions Confirmed

### 3.1 CV Upload

**Business:**
- Student uploads CV as PDF
- Lecturer (assigned to internship) can download

**Technical:**
- Entity: `Document { InternshipId, Category = "CV", UploadedBy = Student, FileUrl }`
- No approval workflow (unlike Submission, which has Feedback loop)
- Allow re-upload (overwrite or version; MVP = 1 file latest)
- Validate: .pdf only, size limit per settings

**Workflow:**
```
SV upload PDF CV
  ↓
GV (SV được phân công) download qua Internship detail page
  ↓
(không duyệt, không feedback, không revision)
```

**Position in flow:** After GV assigned (UC-A08), before or parallel GV assigns company (UC-L04).

---

### 3.2 Import + Enrollment (Two Layers)

**Business:**
- Import happens in context of **active Semester** (admin must select/create semester before import)
- Result: **two layers** (lưu lịch sử + ghi danh đợt hiện tại)

**Technical:**

| Layer | Entity | Scope | Purpose |
|-------|--------|-------|---------|
| Master | Student (MSSV unique) | Global | Lịch sử toàn khoa; tra cứu SV từng có |
| Enrollment | Internship | Per Semester (SemesterId = Active) | Phân công, CV, DN, báo cáo trong đợt |

**Enrollment Logic (UC-A01 revised):**

```
Admin selects Semester (Active) + imports Excel

For each row in Excel:
  ├─ MSSV new      → Create Student + create Internship(SemesterId=Active, NotStarted)
  ├─ MSSV exists   → Update Student profile + create NEW Internship(SemesterId=Active) if not already enrolled
  └─ Already enrolled in Active → Skip or allow re-sync (TBD per khoa policy)

Cấp TK (if email provided):
  ├─ User exists   → No change (reuse account)
  └─ User new      → Create User, set MustChangePassword=true, send invitation
```

**Admin UI (Phase 1 revised):**
```
1. Choose Semester (dropdown: Upcoming/Active/Completed)
2. Upload Excel (or bulk update from student list)
3. Review: "Sẽ ghi danh 50 SV vào HK1-2025"
4. Confirm → import completes
5. Dashboard shows: total 50, new 5, re-enroll 45
```

**Consequence:**
- Same MSSV can appear in multiple semesters (1:N Internship per Student)
- Account (User) is global and reused
- Lecturer filter (UC-L01): "Show Internships where SemesterId = [current active]"

---

### 3.3 Close Semester + SV Rớt → Đợt Sau

**Business:**
- Admin closes Semester (status → Completed)
- SV login → see message "Đợt thực tập [name] đã kết thúc"
- SV can still **view** internship (read-only; xem feedback, tải tài liệu cũ)
- SV **cannot** submit new reports/files in closed semester
- If SV rớt or needs re-enrollment: **no artificial "Failed" status**
  - Instead: Admin can re-import SV into next semester → new Internship entry
  - Same User account, new internship context

**Technical:**

```csharp
// Semester entity
public enum SemesterStatus
{
  Upcoming = 0,
  Active = 1,
  Completed = 2
}

// Internship remains unchanged (add SemesterId foreign key)
// Unique: (StudentId, SemesterId)
```

**Login + Portal Resolution (SV):**

```
SV logs in
  ↓
Portal queries: SELECT Internship WHERE StudentId=X AND Semester.Status IN (Active, Upcoming)
  ├─ Found Active   → Normal flow (nộp CV, báo cáo, submit…)
  ├─ Found Upcoming → Message "Đợt thực tập sắp bắt đầu" (preview only)
  └─ None           → Message "Bạn chưa được ghi danh đợt thực tập hiện tại"

If SV has Internship in Completed semester (old internship):
  ├─ Show read-only view (xem feedback, tải file)
  └─ Cannot submit/upload new
```

**Re-enrollment (SV rớt → đợt sau):**

```
Timeline:
  Semester 1 (HK1-2025)          Semester 2 (HK2-2026)
  ├─ Internship #1               ├─ Internship #2 (mới)
  │  StudentId: A                │  StudentId: A (cùng student)
  │  Status: Completed           │  Status: NotStarted
  │  Outcome: any (không mark)   │  Semester: HK2-2026
  │  SemesterId: HK1-2025        │  SemesterId: HK2-2026
  └─ (closed)                    └─ (admin imports, re-enroll)

Process:
  1. Semester 1 ends → Admin closes Semester 1 (status=Completed)
  2. Admin creates Semester 2, sets Active
  3. Admin imports / adds SV from previous list to Semester 2
  4. System creates Internship #2 (new record, same Student, different Semester)
  5. SV logs in → sees Internship #2 (Active), flow continues
```

**Key design points:**
- No deactivation of User account when semester closes
- No "Failed" / "Passed" status on Internship (too much business logic)
  - Policy decision left to khoa: re-enroll all? only those not finalized? only failed?
  - System supports multi-enrollment by design
- Admin's re-import action (UC-A01 repeat) is the mechanism: "enroll SV into new semester"

---

# 4. Workflow Comparison

## Original TO-BE (03-Business-Workflow.md)

| Phase | Ai | Việc |
|-------|------|------|
| **0** | Admin | Import SV / GV / DN |
| | Admin | Tạo TK + Invitation email |
| | Admin | Phân công SV → GV |
| **1** | GV/SV | Login → đổi MK |
| **2** | GV | Xem SV được phân công; gán DN |
| **3** | SV | Nộp báo cáo / sản phẩm |
| | GV | Duyệt / feedback / chấm |
| **4** | GV | Finalize + Export Excel |

## NEW TO-BE (with Semester)

| Phase | Ai | Việc | Bổ sung / Thay |
|-------|------|------|-----------------|
| **−1** | Admin | **Tạo Semester** (HK1-2025) | **NEW** |
| | Admin | **Chọn Semester Active** (dropdown) | **NEW** |
| **0** | Admin | Import SV / GV / DN (trong Semester Active) | **context: SemesterId** |
| | Admin | Ghi danh SV vào Semester (upsert Student + create Internship) | **Revised UC-A01** |
| | Admin | Tạo TK SV/GV + email (nếu new) | Không đổi |
| | Admin | Phân công SV → GV (trong Semester Active) | Filter by SemesterId |
| **1** | GV/SV | Login → đổi MK | Không đổi |
| | **SV** | **Upload CV (PDF)** | **NEW step** |
| **2** | GV | Xem SV được phân công (Semester Active); gán DN | Filter by SemesterId |
| **3** | SV | Nộp báo cáo / sản phẩm | Không đổi (inherit SemesterId via Internship) |
| | GV | Duyệt / feedback / chấm | Không đổi |
| **4** | GV | Finalize + Export Excel | Không đổi |
| **5** | Admin | **Đóng Semester** (status → Completed) | **NEW** |
| | SV/GV | Login → **thông báo "đã kết thúc"** | **NEW message** |
| | SV (rớt) | **Được admin ghi danh Semester mới** (repeat phase 0) | **Multi-term support** |

---

# 5. Implementation Priority

**Level 1 (Phải có để demo Semester workflow):**

1. Semester CRUD API + entity
2. Semester.Status workflow (Upcoming → Active → Completed)
3. Admin "Choose Semester" dropdown (in import/assign UIs)
4. Internship.SemesterId + unique key (StudentId, SemesterId)
5. Portal: resolve active internship by Semester
6. Login message: "Đợt đã kết thúc" (if only Completed internship)

**Level 2 (Nên có trước demo cho stakeholder):**

7. CV upload/download (Document category = "CV")
8. Import enroll logic (upsert Student + create Internship)
9. Read-only mode for Completed semester (Lecturer/Student UI)
10. Enroll UI: "Add SV to Semester" from student list (not just import)

**Level 3 (Can defer after MVP demo):**

11. Duplicate Semester (UX for khoa copy settings from previous semester)
12. Advanced dashboard: stats per semester (multi-term analytics)
13. InternshipStatus refinement (enum: NotStarted, InProgress, Submitted, …; vs current simple string)

---

# 6. Entity & API Changes Summary

### Semester (NEW)

```csharp
public class Semester
{
  public int Id { get; set; }
  public string Name { get; set; }          // e.g., "HK1-2025", "Đợt 1 - HK1/2025"
  public int AcademicYear { get; set; }     // e.g., 2025
  public int? SemesterNumber { get; set; }  // 1 or 2 (optional, for organization)
  public SemesterStatus Status { get; set; } // Upcoming, Active, Completed
  public DateTime StartDate { get; set; }
  public DateTime EndDate { get; set; }
  
  public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }
  public bool IsDeleted { get; set; } = false;
}

public enum SemesterStatus { Upcoming = 0, Active = 1, Completed = 2 }
```

### Internship (CHANGED)

```csharp
// ADD:
public int SemesterId { get; set; }
public Semester Semester { get; set; }

// Add unique constraint in DB migration:
// UNIQUE(StudentId, SemesterId) — ensure 1 internship per student per semester

// Status remains (can add more enums later, e.g., NotStarted, InProgress, Completed, Failed):
public string Status { get; set; }
```

### New Endpoints

```
GET    /api/Admin/semesters
POST   /api/Admin/semesters
PUT    /api/Admin/semesters/{id}
DELETE /api/Admin/semesters/{id}
PATCH  /api/Admin/semesters/{id}/activate
PATCH  /api/Admin/semesters/{id}/close

// Existing, now with SemesterId context:
POST   /api/Admin/students/import (include SemesterId in request)
GET    /api/Admin/students (add ?semesterId filter)
POST   /api/Admin/assignments (include SemesterId in request)

// Lecturer sees filtered internships:
GET    /api/Lecturer/internships (auto-filter by active semester)

// Document (new or extended):
POST   /api/Internship/{internshipId}/documents/upload
GET    /api/Internship/{internshipId}/documents?category=CV
```

---

# 7. Questions for Confirmation

### Q1. Multi-semester SV (beyond MVP scope?)

**Scenario:** SV đạt HK1-2025, có nên tham gia HK2-2026 không?

**Current design:** Hỗ trợ sẵn (1:N Internship). Admin quyết định (re-import hoặc không).

**Recommendation:** Để cho khoa quy định; hệ thống không cần "rớt/đạt" status.

---

### Q2. Closed Semester UI

**When Semester.Status = Completed:**
- Admin: thấy (read-only hoặc ẩn tùy preference)
- Lecturer: thấy read-only list nếu có SV, hoặc tùy chọn
- Student: thấy old internship as read-only; cannot navigate to nộp bài

**Recommendation:** Implement Level 1 (login message), then refine UI per feedback.

---

### Q3. CV as Submission or Document?

**Decision confirmed:** Document (Category = "CV"), not Submission (which has feedback).

**Validate:** Chỉ .pdf, không duyệt, GV tải về.

---

# 8. Summary

| Aspect | Approach | Impact |
|--------|----------|--------|
| **MVP Modules B–E** | No changes | Lecturer workflow unchanged |
| **Admin Module A** | Add semester context | Import/assign now scoped to semester |
| **Data model** | Student 1:N Internship | Support multi-term enrollment |
| **CV** | Document upload, no review | New file upload UI for Student |
| **Closed semester** | Read-only + login message | SV aware internship ended |
| **Re-enrollment** | Re-import into new semester | Support SV retake if needed |
| **Account lifecycle** | User stays, Internship changes | Reuse account across semesters |

---

# References

- [01-Vision-Scope.md](01-Vision-Scope.md) — Vision §9 mentions multi-batch as future
- [03-Business-Workflow.md](03-Business-Workflow.md) — 4 khối TO-BE (unchanged by semester layer)
- [04-Use-Case-Specification.md](04-Use-Case-Specification.md) — UC-A01/A08 gain semester context
- [05c-Data-Dictionary.md](05c-Data-Dictionary.md) — Review Internship table definition
- [06-System-Architecture.md](06-System-Architecture.md) — Ensure API/DB design accommodates SemesterId

---

**Next step:** Approve 3 decisions above (CV, Import, Close) + assign implementation priority (Level 1–3) before coding Phase 0–5.
