# Use Case Diagram — InternLink

**Version:** 2.0 — SuperAdmin + Lecturer + Student

```mermaid
flowchart TB
  subgraph Actors
    SA([SuperAdmin])
    L([Lecturer])
    S([Student])
  end

  subgraph Auth
    UC01((Login))
    UC02((Change Password))
    UC03((Forgot / Reset Password))
  end

  subgraph Admin["SuperAdmin module"]
    UA1((Manage Students))
    UA2((Manage Lecturers))
    UA3((Manage Companies))
    UA4((Manage Users))
    UA5((Invitation Email))
    UA6((Bulk Assign SV→GV))
    UA7((Admin Reset Password))
  end

  subgraph LecturerWorkflow["Lecturer workflow"]
    UL1((View Assigned Internships))
    UL2((Assign Company))
    UL3((Review Submission))
    UL4((Send Feedback))
    UL5((Evaluate / Grade))
    UL6((Export Excel))
    UL7((Documents))
  end

  subgraph StudentFlow["Student"]
    US1((Submit Weekly Report))
    US2((Upload Final / Product))
    US3((View Feedback))
    US4((Resubmit))
    US5((Notifications))
  end

  SA --> UC01
  SA --> UC02
  SA --> UC03
  SA --> UA1
  SA --> UA2
  SA --> UA3
  SA --> UA4
  SA --> UA5
  SA --> UA6
  SA --> UA7

  L --> UC01
  L --> UC02
  L --> UC03
  L --> UL1
  L --> UL2
  L --> UL3
  L --> UL4
  L --> UL5
  L --> UL6
  L --> UL7

  S --> UC01
  S --> UC02
  S --> UC03
  S --> US1
  S --> US2
  S --> US3
  S --> US4
  S --> US5

  UA5 -.->|include| UA1
  UA5 -.->|include| UA2
  UA5 -.->|include| UA4
  UL4 -.->|include| UL3
  US4 -.->|extend| US3
```

## Notes

- SuperAdmin **không** dùng `RequireLecturer` endpoints để duyệt/chấm.
- Lecturer **không** gọi `/api/Admin/*` (403).
- Phân công GV (`LecturerId`) = SuperAdmin; gán DN (`CompanyId`) = Lecturer.
