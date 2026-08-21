# Backend Clean Architecture — InternLink

**Dự án:** InternLink — Nền tảng Quản lý & Giám sát Thực tập  
**Kiến trúc:** Clean Architecture 5 Phân Tầng (.NET 10 Web API)  
**Phiên bản:** 3.0

---

```mermaid
flowchart TB
    subgraph Client["Tầng Giao Diện (Presentation)"]
        UI[React 18 SPA + Vite]
        SWAGGER[Swagger / OpenAPI UI]
    end

    subgraph API["1. InternLink.API (Presentation / Entry Point)"]
        direction TB
        CTRL[RESTful API Controllers<br/>Auth, Admin, Lecturer, Student, Semester]
        MW[Middlewares<br/>JwtAuth, GlobalExceptionHandler, RequestLogging]
        HUB[SignalR Core Hubs<br/>/hubs/notifications]
        CFG[Dependency Injection & Startup Configuration]
    end

    subgraph App["2. InternLink.Application (Business Core)"]
        direction TB
        DTO[Data Transfer Objects - DTOs & ViewModels]
        ISVC[Service Interfaces<br/>IAuthService, IAdminService, ILecturerService...]
        SVC[Business Application Services<br/>Workflow Logic, Rubric Calculator, Excel Processing]
        VAL[FluentValidation Rules]
        MAP[AutoMapper Profiles]
    end

    subgraph Domain["3. InternLink.Domain (Enterprise Entities)"]
        direction TB
        ENT[Core Domain Entities<br/>User, Student, Lecturer, Semester, Internship,<br/>WeeklyReport, Submission, Evaluation, Document...]
        ENUM[Domain Enums<br/>UserRole, InternshipStatus, ReportStatus...]
        BASE[BaseEntity & Domain Rules]
    end

    subgraph Infra["4. InternLink.Infrastructure (External Adapters)"]
        direction TB
        DBCONTEXT[AppDbContext & EF Core 10 Mappings]
        MIGRATION[Code-First Migrations & Query Filters]
        SMTP[MailKit SMTP Client Service]
        PDF[Server-side Binary PDF Engine]
        EXCEL[ClosedXML Excel Import / Export Service]
        STORAGE[Local Volume Storage Provider]
    end

    subgraph Shared["5. InternLink.Shared (Cross-Cutting)"]
        RESP[ApiResponse&lt;T&gt; Standard Envelope]
        ERR[ErrorCode Constants &amp; Custom Exceptions]
        HELP[Security &amp; Hashing Helpers (PBKDF2)]
    end

    subgraph Storage["Persistence & External Services"]
        SQL[(Microsoft SQL Server 2022)]
        VOL[(Docker Volume: /app/uploads)]
        GMAIL[Gmail SMTP Server]
    end

    UI -->|HTTPS / REST API| MW
    SWAGGER -->|Test Endpoints| MW
    UI -.->|WebSocket / WSS| HUB
    MW --> CTRL
    CTRL --> ISVC
    ISVC --> SVC
    SVC --> DTO
    SVC --> VAL
    SVC --> MAP
    SVC --> ENT
    ENT --> BASE

    SVC --> DBCONTEXT
    SVC --> SMTP
    SVC --> PDF
    SVC --> EXCEL
    SVC --> STORAGE

    DBCONTEXT --> SQL
    STORAGE --> VOL
    SMTP --> GMAIL

    API -.-> Shared
    App -.-> Shared
    Infra -.-> Shared
```

---

## 📌 Nguyên Tắc Phụ Thuộc (Dependency Rule)

- **Domain**: Độc lập tuyệt đối, không phụ thuộc vào bất kỳ thư viện bên ngoài hay cơ sở dữ liệu nào.
- **Application**: Chỉ phụ thuộc vào Domain và Shared. Chứa toàn bộ nghiệp vụ lõi (Business Logic).
- **Infrastructure**: Triển khai các Adapter kỹ thuật (EF Core, Email, PDF, File System).
- **API**: Phụ thuộc vào Application và Infrastructure để kích hoạt Dependency Injection và tiếp nhận HTTP Request.
