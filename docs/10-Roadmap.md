# Development Roadmap

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 2.0

**Status:** Active — reflects MVP backend + Admin complete

---

# 1. Overview

Roadmap theo hướng **MVP-first**: backend + Admin module xong → frontend portals → soft enhancements.

---

# 2. Status at a glance

| Workstream | Status |
|------------|--------|
| Analysis & design docs | ✅ D0–D5 complete |
| Database (12 tables) | ✅ |
| Backend MVP (Lecturer + Student APIs) | ✅ |
| SuperAdmin module (Phases 0–7) | ✅ |
| OpenAPI / Postman | ✅ |
| Frontend Admin / Lecturer / Student | ✅ MVP wired |
| Integration & UAT | ✅ M6 + M7 API |
| Future (AI, InternshipLog, Hangfire) | Backlog |

---

# 3. Completed — Backend & Admin

1. Auth JWT + change / forgot / reset password  
2. Admin: students, companies, users, assignments, email  
3. Lecturer workflow: review, feedback, evaluation, export Excel  
4. Student: weekly report, submission, feedback loop  
5. Documents + notifications  
6. Docs: Domain/DB/UC/Workflow/Architecture/IA  

Chi tiết: [`Backend-Plan.md`](Backend-Plan.md) · [`Admin-Implementation-Plan.md`](Admin-Implementation-Plan.md)

---

# 4. Official product structure (target UI)

## SuperAdmin portal

01 Dashboard · 02 Students · 03 Lecturers · 04 Companies · 05 Users · 06 Assignments · 07 Account

## Lecturer portal

01 Dashboard · 02 Internships · 03 Documents · 04 Evaluation · 05 Export · 06 Notifications · 07 Account  
(+ read-only Students/Companies)

## Student portal

01 Dashboard · 02 Internship · 03 Weekly Report · 04 Submission · 05 Feedback · 06 Documents · 07 Profile

IA: [`07a-Information-Architecture.md`](07a-Information-Architecture.md)

---

# 5. Next milestones

| ID | Milestone | Deliverable | Status |
|----|-----------|-------------|--------|
| M1 | Analysis complete | Vision, SRS, UC | ✅ |
| M2 | Database complete | EF migrations + docs | ✅ |
| M3 | Backend API ready | Swagger + Admin | ✅ |
| M4 | Docs polish | Docs plan D0–D5 | ✅ |
| M5 | Frontend ready | 3 portals + API wire | ✅ |
| M6 | Integration smoke | `smoke-test-m6.ps1` | ✅ |
| M7 | MVP demo | UAT + `smoke-test-m7.ps1` | ✅ |

---

# 6. Frontend sprint suggestion

1. Auth shell (login, must-change-password, forgot/reset)  
2. Admin: students + assignments  
3. Lecturer: internships + feedback  
4. Student: weekly report + feedback view  
5. Polish notifications + documents  

---

# 7. Backlog (post-MVP)

| Item | Priority |
|------|----------|
| InternshipLog entity + API | Medium |
| Hangfire / queued email for bulk import | Medium |
| Advanced analytics dashboard | Low |
| Configurable rubric UI | Low |
| AI matching / report assist | Future |
| Docker / cloud deploy | Future |
| AutoMapper upgrade (NU1903) | Tech debt |

**Already done (was “future” in v1):** Email notification, Excel export.

---

# 8. Success criteria (MVP)

- [x] SuperAdmin import + cấp TK + phân công SV→GV  
- [x] Lecturer quản lý workflow SV được giao + chấm + export  
- [x] Student nộp báo cáo / xem feedback  
- [x] Frontend 3 portals usable in demo (`docs/Demo-UI-Script.md`)  
- [ ] Ổn định trên môi trường thử nghiệm khoa  

---

# 9. Risks

| Risk | Mitigation |
|------|------------|
| Frontend drift vs API | Bind to swagger.json |
| SMTP chưa sẵn | LoggingEmailService + checklist |
| Scope creep (AI) | Giữ backlog; không chặn M5 |

---

# 10. Summary

**Backend MVP + Admin + Frontend MVP = Done.**  
Demo: [`Demo-UI-Script.md`](Demo-UI-Script.md) · UAT: [`M7-UAT-Checklist.md`](M7-UAT-Checklist.md) · FE plan: [`Frontend-UI-Plan.md`](Frontend-UI-Plan.md).
