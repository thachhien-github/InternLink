# InternLink - Product Scope and Requirements Status

**Verified:** 2026-09-08

## Implemented scope

InternLink supports three authenticated portals for the internship lifecycle:

- **SuperAdmin:** users, students, lecturers, companies, semesters, assignments, account requests, notification campaigns, settings, rubrics, exports and operational statistics.
- **Lecturer:** assigned students/internships, enterprise views, weekly report review, submission feedback, evaluations, defense details, documents, analytics, reminders and exports.
- **Student:** own profile, internship information, weekly reports, submissions/assets, feedback, templates, evaluation result and notifications.

Cross-cutting capabilities include JWT authentication, refresh-token sessions, password reset, avatar upload, soft deletion, SignalR notifications, document/file uploads, Excel/PDF/Word exports and database migrations.

## Partial or operationally dependent scope

- Email invitations and password reset depend on SMTP configuration and are disabled by default in `appsettings.json`.
- Lecturer/student demo workflows require imported or explicitly created profiles; the default seed creates only the admin user.
- File persistence is local filesystem storage backed by a Docker volume. It is not object storage and is only as reliable as the volume backup policy.
- AI comment generation is an API capability exposed by the lecturer controller; provider configuration and availability must be verified in the runtime environment.
- Analytics quality depends on the data populated for the selected semester.

## Not claimed by current implementation

- No separate worker service or scheduler is present.
- No automatic refresh-token cleanup job is documented as active.
- No cloud object-storage integration is present in the inspected source.
- No guarantee of pre-populated demo students, lecturers, companies, semesters or internships.

## Acceptance mapping

| Capability | Current implementation evidence |
|:--|:--|
| Role-based portals | `frontend/src/routes/AppRoutes.tsx`, API authorization attributes |
| Account and profile management | Auth, AdminUsers, StudentPortal and LecturerProfile controllers |
| Semester and assignment management | AdminSemesters and AdminAssignments controllers |
| Weekly report workflow | WeeklyReportController and WeeklyReportService |
| Submission workflow | SubmissionController and SubmissionService |
| Evaluation/rubric workflow | EvaluationController and rubric controllers/services |
| Document management | DocumentController and DocumentService |
| Notification workflow | NotificationController and AdminNotificationsController |
| Export workflow | ExportController and lecturer export endpoints |
| Health and operations | Program startup, health extensions and Compose healthchecks |

The acceptance status should be revisited when a feature is only represented by mock data or when a controller contract changes.
