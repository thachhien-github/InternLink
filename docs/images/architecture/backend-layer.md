# Backend Clean Architecture — InternLink

**Dự án:** InternLink — Nền tảng Quản lý & Giám sát Thực tập  
**Kiến trúc:** Clean Architecture 5 Phân Tầng (.NET 8 Web API)  
**Phiên bản:** 4.0

---

```mermaid
flowchart TB
    subgraph Client["Tầng Giao Diện (Presentation)"]
        UI["React 19 SPA + Vite + Tailwind 4"]
        SWAGGER["Swagger / OpenAPI UI"]
    end

    subgraph API["1. InternLink.API (Presentation / Entry Point)"]
        direction TB
        CTRL["25 RESTful API Controllers<br/>Auth, Admin*, Lecturer*, StudentPortal,<br/>Submission, WeeklyReport, Evaluation,<br/>Export, Document, Notification..."]
        MW["Middlewares<br/>JwtAuth, GlobalExceptionHandler,<br/>RequestLogging"]
        HUB["SignalR Core Hubs<br/>/hubs/notifications"]
        CFG["Dependency Injection<br/>& Startup Configuration"]
    end

    subgraph App["2. InternLink.Application (Business Core)"]
        direction TB
        DTO["Data Transfer Objects - DTOs<br/>Auth, Semester, Assignment, Rubric,<br/>Lecturer, Submission, Evaluation,<br/>Notification, User, AccountRequest"]
        ISVC["Service Interfaces<br/>IAuthService, ISemesterService,<br/>IAssignmentService, ILecturerService,<br/>ISubmissionService, IWeeklyReportService,<br/>IEvaluationService, INotificationService,<br/>IPdfExportService, IExcelExportService..."]
        SVC["Business Application Services<br/>Workflow Engine, Rubric Calculator,<br/>Excel Processing, PDF Generation"]
        VAL["FluentValidation Rules"]
        MAP["AutoMapper Profiles"]
    end

    subgraph Domain["3. InternLink.Domain (Enterprise Entities)"]
        direction TB
        ENT["18 Core Domain Entities<br/>User, Student, Lecturer, Semester,<br/>Internship, Company, WeeklyReport,<br/>Submission, Feedback, Evaluation,<br/>EvaluationRubric, EvaluationRubricCriterion,<br/>Document, Notification, AccountRequest,<br/>SystemSetting, AdminNotification,<br/>AdminNotificationCampaign"]
        ENUM["Domain Enums<br/>UserRole, InternshipStatus, SubmissionStatus,<br/>AccountRequestStatus, RubricStatus,<br/>RubricApplicationMode"]
        BASE["BaseEntity &amp; Domain Rules<br/>(Soft Delete, Audit Fields)"]
    end

    subgraph Infra["4. InternLink.Infrastructure (External Adapters)"]
        direction TB
        DBCONTEXT["AppDbContext<br/>& EF Core 8 Mappings<br/>(18 DbSets)"]
        MIGRATION["Code-First Migrations<br/>& Query Filters<br/>(Global Soft Delete)"]
        SMTP["MailKit SMTP Client<br/>Service"]
        PDF["Server-side Binary<br/>PDF Engine<br/>(Student Evaluation,<br/>Internship Certificate)"]
        EXCEL["ClosedXML Excel<br/>Import / Export<br/>Service"]
        STORAGE["Local Volume<br/>Storage Provider"]
    end

    subgraph Shared["5. InternLink.Shared (Cross-Cutting)"]
        RESP["ApiResponse&lt;T&gt;<br/>Standard Envelope"]
        ERR["ErrorCode Constants<br/>& Custom Exceptions"]
        HELP["Security &amp; Hashing<br/>Helpers (BCrypt)"]
    end

    subgraph Storage["Persistence & External Services"]
        SQL[("Microsoft SQL Server 2022<br/>18 Tables")]
        VOL[("Docker Volume: /app/uploads")]
        GMAIL["Gmail SMTP Server"]
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

- **Domain**: Độc lập tuyệt đối — chứa 18 thực thể, enum và rule nghiệp vụ, không phụ thuộc thư viện ngoài.
- **Application**: Chỉ phụ thuộc Domain + Shared. Chứa toàn bộ Business Logic qua 15+ Service Interface.
- **Infrastructure**: Triển khai Adapter kỹ thuật — EF Core 8 (18 DbSet), Email, PDF, Excel, File Storage.
- **API**: Nhập DI Container, kích hoạt 25 Controllers phục vụ HTTP Request từ Frontend.

---

## 📌 Danh Sách 15 Service Interfaces

| Interface | Mô tả |
|:---|:---|
| `IAuthService` | Đăng nhập, JWT, Refresh Token, Forgot/Reset Password |
| `ISemesterService` | CRUD Học kỳ, Set Current, Close, Duplicate |
| `IAssignmentService` | Phân công GVHD, Auto-assign, Import/Export ma trận |
| `IAdminService` | Dashboard thống kê, CRUD Companies, Settings |
| `ILecturerService` | Dashboard, Students, Feedback, Notes, Bulk Notify |
| `ISubmissionService` | CRUD Submission, Feedback, Student Reply |
| `IWeeklyReportService` | CRUD Báo cáo tuần, Submit, Review |
| `IEvaluationService` | CRUD Đánh giá, Tính điểm, Finalize |
| `IRubricService` | CRUD Rubric, Submit, Approve, Reject |
| `INotificationService` | CRUD Thông báo, Mark Read |
| `IPdfExportService` | Xuất PDF: Bảng tổng hợp, Phiếu thực tập |
| `IExcelExportService` | Xuất Excel: Danh sách, Bảng điểm |
| `IAccountRequestService` | Duyệt/Từ chối yêu cầu tài khoản |
| `ISettingsService` | CRUD System Settings |
| `IStudentPortalService` | Profile sinh viên, Certificate PDF |
