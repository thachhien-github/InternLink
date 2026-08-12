# Sequence — Bulk Assign Students → Lecturer

**Use case:** UC-A08  
**Actors:** SuperAdmin → API → AssignmentService → DB → Lecturer workflow

```mermaid
sequenceDiagram
  autonumber
  actor Admin as SuperAdmin
  participant API as AdminAssignmentsController
  participant Svc as AssignmentService
  participant DB as SQL Server
  actor Lect as Lecturer

  Admin->>API: POST /api/Admin/assignments<br/>{ lecturerId, studentIds[] }
  API->>API: Authorize RequireAdmin
  API->>Svc: BulkAssignAsync

  Svc->>DB: Validate Lecturer exists
  Svc->>DB: Ensure placeholder Company<br/>"Chưa phân công doanh nghiệp"

  loop Each studentId
    Svc->>DB: Load Student
    alt Student not found
      Svc-->>Svc: Add to Errors[]
    else No Internship yet
      Svc->>DB: INSERT Internship<br/>Status=NotStarted, LecturerId, CompanyId=placeholder
    else Internship exists
      Svc->>DB: UPDATE Internship.LecturerId<br/>(re-assign)
    end
  end

  Svc->>DB: SaveChanges
  Svc-->>API: BulkAssignResultDto<br/>(Assigned/Created/Updated/Failed)
  API-->>Admin: 200 OK

  Lect->>API: GET /api/Lecturer/internships
  Note over Lect,API: Authorize RequireLecturer (JWT)
  API->>DB: WHERE LecturerId = resolved lecturer
  DB-->>API: Internships of this lecturer
  API-->>Lect: 200 list

  Note over Admin,Lect: Lecturer cũ không còn thấy SV đã re-assign
```

## Boundary

| Ai | Được làm |
|----|----------|
| SuperAdmin | Set / clear `LecturerId` |
| Lecturer | Set `CompanyId` only (`PUT /api/Internship/{id}/company`) |
| Lecturer gọi `/api/Admin/assignments` | **403 Forbidden** |
