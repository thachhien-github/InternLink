# Sequence — Invitation Email (create account)

**Use cases:** UC-A02 / UC-A04 / UC-A06  
**Actors:** SuperAdmin → API → DB → Email

```mermaid
sequenceDiagram
  autonumber
  actor Admin as SuperAdmin
  participant API as InternLink API
  participant Svc as Profile/User Service
  participant DB as SQL Server
  participant Mail as EmailService<br/>(SMTP / Logging)

  Admin->>API: POST /api/Admin/students<br/>(or LecturerProfile / Admin/users)
  Note over Admin,API: Username + Email + profile fields
  API->>API: Authorize RequireAdmin
  API->>Svc: Create profile + EnsureUser
  Svc->>DB: INSERT Students/Lecturers (if needed)
  Svc->>DB: INSERT Users<br/>MustChangePassword=true
  DB-->>Svc: OK
  Svc->>Mail: SendInvitationAsync<br/>(username + temp password + PortalUrl)
  alt Email:Enabled=true
    Mail-->>Svc: SMTP sent
  else Email:Enabled=false
    Mail-->>Svc: Logged to Serilog
  end
  Svc-->>API: DTO (no password in response)
  API-->>Admin: 201 Created

  Note over Mail: Recipient receives invitation email
```

## Kết quả

- User mới login bằng username + MK tạm.
- Client thấy `MustChangePassword=true` → bắt đổi MK (UC-02).
