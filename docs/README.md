# InternLink

> **InternLink** is a web-based internship management and collaboration platform that helps lecturers manage, monitor and interact with students throughout the internship process.

---

## Overview

InternLink is developed to digitize the internship supervision workflow between lecturers and students.

Instead of relying on Excel, Zalo, Email and Google Drive separately, InternLink centralizes the entire internship process into a single platform.

The system focuses on solving real problems faced by lecturers during internship supervision.

---

## Problem Statement

Current internship management is fragmented across multiple tools.

Common challenges include:

- Difficult to monitor student progress.
- Report files scattered across Zalo, Email and Google Drive.
- No centralized feedback history.
- Manual reminder for deadlines.
- Manual evaluation and score aggregation.
- Company information stored in Excel.
- Difficult to review internship history.

---

## Objectives

InternLink aims to:

- Digitize internship supervision.
- Centralize communication.
- Improve progress tracking.
- Simplify document management.
- Build a reusable internship company database.
- Reduce administrative workload for lecturers.

---

## Core Features

### SuperAdmin

- Import / CRUD Students, Lecturers, Companies
- User accounts + invitation email
- Bulk assign Students → Lecturers
- Admin password reset

### Lecturer

- Assigned internship workflow
- Assign company to internship
- Weekly report / submission review & feedback
- Evaluation + end-of-term Excel export
- Documents & notifications

### Student

- Weekly reports & submissions
- View feedback / resubmit
- Documents & notifications
- Change / forgot password

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- TanStack Query
- React Hook Form
- Zod
- Lucide React

---

### Backend

- ASP.NET Core Web API
- Entity Framework Core
- JWT Authentication
- Swagger

---

### Database

- Microsoft SQL Server

---

## Project Structure

```text
InternLink/
│
├── frontend/
│
├── backend/
│
├── database/          ← README, MIGRATIONS, diagrams/erd, scripts/verify-schema
│
├── docs/
│
└── README.md
```

---

## Documentation

```text
docs/
├── Docs-Completion-Plan.md           ← D0–D5 DONE
├── ONBOARDING.md                     ← 15 phút chạy API
├── 01-Vision-Scope.md                ✅ Active v2
├── 02-Software-Requirements-Specification.md  ✅ Active v2
├── 03-Business-Workflow.md           ✅ Active v2
├── 04-Use-Case-Specification.md      ✅ Active v2
├── 05a–05d (Domain / ERD / Dictionary / DB Design) ✅
├── 06-System-Architecture.md         ✅ Active v2
├── 07a / 07b (IA / App Flow)         ✅ Active v2
├── 08-API-Specification.md           ✅ Active v2
├── 10-Roadmap.md                     ✅ Active v2
├── Backend-Plan.md / Admin-*         ✅
└── images/ (usecase, sequence, …)
```

**Status matrix:** [`DOCS-STATUS.md`](DOCS-STATUS.md)  
**Completion plan:** [`Docs-Completion-Plan.md`](Docs-Completion-Plan.md) *(D0–D5 complete)*  
**Quick start:** [`ONBOARDING.md`](ONBOARDING.md)

### Key diagrams (ưu tiên đọc)

| Diagram | Path |
|---------|------|
| Use Case | [`images/usecase/usecase-diagram.md`](images/usecase/usecase-diagram.md) |
| Sequence — Invitation | [`images/sequence/invitation-email.md`](images/sequence/invitation-email.md) |
| Sequence — Bulk assign | [`images/sequence/bulk-assign.md`](images/sequence/bulk-assign.md) |
| Sequence — Forgot password | [`images/sequence/forgot-password.md`](images/sequence/forgot-password.md) |
| ERD | [`../database/diagrams/erd.md`](../database/diagrams/erd.md) |

---

## Development Status

| Module | Status |
|----------|--------|
| Requirements Analysis | ✅ Vision + SRS v2 |
| Database Design | ✅ |
| Use Cases / Sequences | ✅ |
| System Architecture | ✅ v2 |
| Information Architecture | ✅ v2 |
| API Design (markdown) | ✅ v2 (Swagger canonical) |
| Backend Development | ✅ MVP + Admin module |
| Frontend Development | 🚧 |
| Integration Testing | ⏳ |
| MVP Release | ⏳ |

---

## MVP Scope

The first release includes:

- Authentication
- Dashboard
- Student Management
- Company Management
- Internship Tracking
- Weekly Reports
- Internship Logs
- Report Submission
- Feedback
- Evaluation
- Public Documents
- Notifications

---

## Future Enhancements

Future versions may include:

- AI-powered internship recommendations.
- AI-assisted progress analysis.
- AI-assisted report evaluation.
- Advanced analytics dashboard.
- Email notifications.
- Excel/PDF export.
- Cloud deployment.
- Mobile optimization.

---

## Contributors

**Developer**

- Thach Hien

---

## License

This project is developed for educational and research purposes.