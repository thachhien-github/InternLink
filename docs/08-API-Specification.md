# API Specification

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 2.0

**Status:** Active — overview synced with implementation

> **Canonical OpenAPI:** [`api/swagger.json`](../api/swagger.json)  
> **Postman:** [`api/postman_collection.json`](../api/postman_collection.json)  
> **Live Swagger UI:** `http://localhost:7109/swagger`

Tài liệu này là **overview + policy map**. Chi tiết request/response schema lấy từ Swagger.

---

# 1. Overview

| Item | Value |
|------|--------|
| Style | REST + JSON |
| Backend | ASP.NET Core Web API |
| Auth | JWT Bearer |
| Wrapper | `ApiResponse<T>` `{ success, data, error }` |
| Dev Base URL | `http://localhost:7109/api` |

---

# 2. Conventions

| Method | Use |
|--------|-----|
| GET | Read |
| POST | Create / search / actions |
| PUT | Update / assign |
| PATCH | Partial (e.g. status) |
| DELETE | Soft delete / unassign |

**Auth header:** `Authorization: Bearer {token}`

---

# 3. Authorization Policies

| Policy | Role | Typical routes |
|--------|------|----------------|
| Anonymous | — | `/api/Auth/login`, `forgot-password`, `reset-password` |
| `RequireAdmin` | SuperAdmin | `/api/Admin/*` |
| `RequireLecturer` | Lecturer only | `/api/Lecturer/*`, Internship write, Evaluation, … |
| `RequireStudent` | Student | WeeklyReport / Submission (student ops) |
| Authenticated | Any logged-in | `/api/Auth/me`, Notifications, Documents (scoped) |

Lecturer **không** gọi được `/api/Admin/*` (403).

---

# 4. Auth API

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/api/Auth/login` | — | Returns `token`, `role`, `mustChangePassword`, `expiresAt` |
| POST | `/api/Auth/logout` | JWT | Stateless |
| GET | `/api/Auth/me` | JWT | Current user |
| POST | `/api/Auth/change-password` | JWT | Clears `MustChangePassword` |
| POST | `/api/Auth/forgot-password` | — | Body `{ email }` — always 200 |
| POST | `/api/Auth/reset-password` | — | Body `{ token, newPassword }` |

---

# 5. Admin API (`RequireAdmin`)

## Students — `/api/Admin/students`

| Method | Path | Notes |
|--------|------|-------|
| GET | `/` | List paginated |
| POST | `/search` | Filter |
| GET | `/{id}` | Detail |
| POST | `/` | Create (+ optional user/email) |
| PUT | `/{id}` | Update |
| DELETE | `/{id}` | Soft delete |
| POST | `/import` | Excel |
| GET | `/import/template` | Template file |

## Companies — `/api/Admin/companies`

CRUD + search + import (same pattern as students).

## Users — `/api/Admin/users`

| Method | Path | Notes |
|--------|------|-------|
| GET | `/` | Filter role/active/search |
| GET | `/{id}` | Detail |
| POST | `/` | Create Student/Lecturer + invitation |
| PUT | `/{id}` | FullName, Email, IsActive |
| DELETE | `/{id}` | Soft delete |
| POST | `/{id}/reset-password` | Temp password emailed; **not** in JSON |

## Assignments — `/api/Admin/assignments`

| Method | Path | Body / notes |
|--------|------|----------------|
| POST | `/` | `{ lecturerId, studentIds[] }` bulk assign |
| GET | `/by-lecturer/{lecturerId}` | List assignments |
| DELETE | `/` | `{ lecturerId, studentId }` unassign |

## Email

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/Admin/email/test` | Send test invitation |

## Lecturers (profile write)

| Method | Path | Notes |
|--------|------|-------|
| * | `/api/LecturerProfile` | SuperAdmin write / import; Lecturer may read overview |

---

# 6. Lecturer / shared (selected)

| Area | Base | Policy | Notes |
|------|------|--------|-------|
| Workflow | `/api/Lecturer/internships` | Lecturer | Assigned only |
| Feedback | `/api/Lecturer/submissions/{id}/feedback` | Lecturer | |
| Export | `/api/Lecturer/export/end-of-term` | Lecturer | Excel |
| Internship | `/api/Internship` | Lecturer | **No LecturerId write** — use Admin assign |
| Assign DN | `PUT /api/Internship/{id}/company` | Lecturer | |
| Evaluation | `/api/Evaluation` | Lecturer | + `/{id}/finalize` |
| Students read | `/api/Student` | Lecturer | Read-only |
| Companies read | `/api/Company` | SuperAdmin, Lecturer | Read-only on CompanyController |

---

# 7. Student / progress (selected)

| Area | Base | Notes |
|------|------|-------|
| WeeklyReport | `/api/WeeklyReport` | Student submit; Lecturer review |
| Submission | `/api/Submission` | Versioning / resubmit |
| Feedback | `/api/Feedback/{id}` | |
| Documents | `/api/Document` | Upload/download scoped |
| Notifications | `/api/Notification/mine` | mark-read |

---

# 8. Error model

```json
{
  "success": false,
  "data": null,
  "error": { "title": "…", "detail": "…" }
}
```

Typical codes: `400` validation, `401` auth, `403` policy, `404` not found, `409` conflict.

---

# 9. Seed credentials (dev)

| User | Password | Role |
|------|----------|------|
| `superadmin` | `Password123!` | SuperAdmin |
| `lecturer1` | `Password123!` | Lecturer |
| `student1` | `Password123!` | Student |

---

# 10. How to refresh this doc

1. Run API → download `/swagger/v1/swagger.json` → `api/swagger.json`
2. Update this overview only when routes/policies change
3. Prefer Swagger for field-level schemas

---

# 11. Revision

| Ver | Date | Notes |
|-----|------|-------|
| 1.0 | 2026-07 | Draft, incomplete paths |
| 2.0 | 2026-08-12 | Admin + Auth reset; points to swagger.json |
