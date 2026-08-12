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

### Lecturer

- Dashboard
- Student Management
- Internship Progress Tracking
- Weekly Reports
- Internship Logs
- Submission Review
- Feedback Management
- Evaluation
- Company Management
- Public Documents
- Notifications

---

### Student

- Internship Dashboard
- Weekly Reports
- Internship Logs
- Report Submission
- Feedback
- Documents
- Notifications

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
├── 01-Vision-Scope.md
├── 02-Software-Requirements-Specification.md
├── 04-Use-Case-Specification.md      ← actors + UC list (v2, SuperAdmin)
├── 05a-Domain-Model.md
├── 05b-Entity-Relationship-Diagram.md
├── 05c-Data-Dictionary.md
├── 05d-Database-Design.md
├── 06-System-Architecture.md
├── Backend-Plan.md
├── Admin-Implementation-Plan.md
├── Admin-Smoke-Test-Checklist.md
├── 10-Roadmap.md
└── images/
    ├── usecase/usecase-diagram.md
    ├── sequence/                     ← invitation, bulk-assign, forgot-password
    ├── architecture/
    ├── application-flow/
    ├── information-architecture/
    └── workflow/

database/
├── README.md
├── MIGRATIONS.md
├── diagrams/erd.md
└── scripts/verify-schema.sql
```

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
| Requirements Analysis | ✅ |
| Database Design | ✅ |
| System Architecture | ✅ |
| Information Architecture | ✅ |
| API Design | ✅ |
| UI/UX Guidelines | ✅ |
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