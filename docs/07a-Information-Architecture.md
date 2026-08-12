# Information Architecture

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 2.0

**Status:** Active — aligned with MVP + SuperAdmin module

**Diagrams:** [`images/information-architecture/`](images/information-architecture/)

---

# 1. Overview

IA mô tả tổ chức thông tin, điều hướng và luồng di chuyển theo **ba portal**:

- SuperAdmin
- Lecturer
- Student

Mục tiêu: tìm nhanh, ít thao tác, phân quyền rõ (Admin ≠ Lecturer).

---

# 2. User Roles & Portal Visibility

| Role | Portal | Ghi chú |
|------|--------|---------|
| SuperAdmin | `/admin/*` | Master data, users, assignments |
| Lecturer | `/lecturer/*` | Workflow SV được giao |
| Student | `/student/*` | Nộp bài, feedback |

Sau login, route theo `Role` (+ redirect đổi MK nếu `MustChangePassword`).

---

# 3. Site Map

## Public

```text
/login
/forgot-password
/reset-password?token=...
```

---

## SuperAdmin

```text
/admin
├── Dashboard (ops overview)
├── Students          ← CRUD + import + tạo TK
├── Lecturers         ← CRUD + import + tạo TK
├── Companies         ← CRUD + import
├── Users             ← list / create / deactivate / reset password
├── Assignments       ← bulk assign SV→GV, list by lecturer
├── Email test        ← (dev/ops)
└── Account
```

---

## Lecturer

```text
/lecturer
├── Dashboard
├── Internships       ← SV được phân công
│   ├── Detail
│   ├── Assign company
│   ├── Weekly reports (review)
│   ├── Submissions (review + feedback)
│   └── Evaluation
├── Students          ← read-only browse (master)
├── Companies         ← read-only browse (master)
├── Documents
├── Export end-of-term
├── Notifications
└── Account
```

**Không còn:** Lecturer CRUD Students/Companies như quyền chính (đã chuyển Admin).

---

## Student

```text
/student
├── Dashboard
├── Internship
│   ├── Progress / status
│   ├── Weekly reports
│   ├── Submissions
│   └── Feedback
├── Documents
├── Notifications
└── Account (change password)
```

Canonical tree: [`images/information-architecture/sitemap.md`](images/information-architecture/sitemap.md)

---

# 4. Navigation Principles

1. **Role-based shell** — mỗi portal một layout/nav riêng.
2. **Primary nav ≤ 7 mục** — tránh overload.
3. **Admin = data & access**; Lecturer = coaching workflow.
4. Deep links từ Notification → đúng entity (submission, report…).
5. Empty states rõ (vd. chưa được assign).

---

# 5. Screen Permission Matrix (MVP UI)

| Screen / Area | SuperAdmin | Lecturer | Student |
|---------------|:----------:|:--------:|:-------:|
| Admin Students/Companies/Users | ✅ | — | — |
| Admin Assignments | ✅ | — | — |
| Lecturer Internships workflow | — | ✅ | — |
| Assign company | — | ✅ | — |
| Review / Feedback / Grade | — | ✅ | — |
| Export Excel | — | ✅ | — |
| Student master (read) | ✅ | ✅ | — |
| Company master (read) | ✅ | ✅ | — |
| Submit weekly / product | — | — | ✅ |
| View own feedback | — | — | ✅ |
| Forgot / reset password | ✅ | ✅ | ✅ |

---

# 6. Key User Flows (IA level)

| Flow | Entry | Docs |
|------|-------|------|
| Admin import + invite | Admin → Students | [`application-flow/admin-import-invite.md`](images/application-flow/admin-import-invite.md) |
| Admin bulk assign | Admin → Assignments | [`application-flow/admin-bulk-assign.md`](images/application-flow/admin-bulk-assign.md) |
| Forgot password | Public | [`application-flow/forgot-password.md`](images/application-flow/forgot-password.md) |
| Lecturer review | Lecturer → Internships | existing `lecturer-review-*.md` |
| Student submit | Student → Weekly/Submission | existing `student-*.md` |

Sequence (API-level): [`images/sequence/`](images/sequence/)

---

# 7. Content Priority

### SuperAdmin first viewport after login

1. Assignments / Students cần xử lý  
2. Shortcut Import  
3. Users gần đây  

### Lecturer

1. Internships cần review / chậm tiến độ  
2. Deadlines  

### Student

1. Trạng thái thực tập  
2. Báo cáo tuần tới hạn  
3. Feedback chưa đọc  

---

# 8. Out of IA Scope (MVP UI)

- Advanced Analytics / Rubric builder screens
- Internship Log daily UI (entity Planned)
- Multi-faculty switcher

---

# 9. Summary

IA v2 tách **ba portal** rõ ràng; Lecturer không còn là “super lecturer” quản trị master data. Frontend có thể wireframe theo sitemap trên + permission matrix.
