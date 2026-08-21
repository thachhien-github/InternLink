# InternLink — Hệ Thống Quản Lý Thực Tập Tốt Nghiệp

> **InternLink** là nền tảng quản lý và giám sát thực tập tốt nghiệp toàn diện dành cho Khoa Công nghệ Thông tin, số hóa 100% quy trình kết nối giữa **Khoa / Quản trị viên (SuperAdmin)**, **Giảng viên hướng dẫn (Lecturer)** và **Sinh viên thực tập (Student)**.

---

## 🎯 Giới thiệu & Mục tiêu Dự án

Trước đây, công tác quản lý thực tập tốt nghiệp tại các trường đại học thường phân tán qua nhiều công cụ thủ công (file Excel gửi qua email, nhóm Zalo nộp bài, Google Drive lưu trữ rời rạc). Điều này dẫn đến khó khăn trong việc theo dõi tiến độ tuần, mất mát minh chứng và tốn nhiều thời gian tổng hợp điểm số.

**InternLink** giải quyết triệt để các vấn đề trên bằng cách tập trung hóa toàn bộ vòng đời thực tập:
- **Quản lý học kỳ & Phân công**: Khởi tạo học kỳ, import danh sách sinh viên/giảng viên bằng Excel, tự động phân công và kích hoạt tài khoản kèm gửi email thư mời.
- **Theo dõi tiến độ thực tế**: Sinh viên cập nhật địa điểm thực tập (doanh nghiệp), nộp nhật ký 12 tuần và đồ án/sản phẩm cuối kỳ trực tiếp trên cổng thông tin.
- **Đánh giá & Chấm điểm chuẩn Rubric**: Giảng viên duyệt báo cáo tuần, phản hồi đồ án, chấm điểm theo 4 tiêu chí chuẩn đầu ra và xuất phiếu đánh giá PDF / bảng điểm Excel.
- **Lưu trữ bảo mật (Local Storage / Docker Volume)**: Toàn bộ báo cáo và tài liệu được lưu trữ an toàn, phân quyền chặt chẽ theo mã thực tập.

---

## 🏗️ Kiến trúc & Công nghệ Sử dụng

### 1. Backend (ASP.NET Core 10 Web API)
- **Kiến trúc**: Phân tầng Clean Architecture (`Domain`, `Application`, `Infrastructure`, `API`, `Shared`).
- **Xác thực & Phân quyền**: JWT Token-based Authentication, Role-based Authorization (`SuperAdmin`, `Lecturer`, `Student`), Password Hashing (PBKDF2).
- **Cơ sở dữ liệu**: Microsoft SQL Server 2022, Entity Framework Core 10 (Code-First Migrations).
- **Email Service**: Tích hợp MailKit SMTP (`internlink.cntt@gmail.com`) với cơ chế fallback Logging.
- **Xử lý tài liệu & Xuất báo cáo**:
  - **Excel**: ClosedXML (Import danh sách, xuất bảng điểm).
  - **PDF Export**: Engine tạo mã nhị phân PDF chuẩn hóa Server-side (Bảng tổng hợp cuối kỳ & Phiếu đánh giá sinh viên).
- **Real-time Communication**: SignalR Core Hubs (`/hubs/notifications`).

### 2. Frontend (React 18 + TypeScript + Vite)
- **Công nghệ**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Giao diện**: Phân hệ chuyên biệt theo vai trò:
  - `Admin Portal`: Quản lý người dùng, học kỳ, doanh nghiệp, phân công GVHD - SV, broadcast thông báo.
  - `Lecturer Portal`: Danh sách sinh viên hướng dẫn, duyệt báo cáo tuần, chấm điểm Rubric, xuất báo cáo PDF/Excel.
  - `Student Portal`: Thông tin thực tập cá nhân, nộp báo cáo tuần, tải biểu mẫu hướng dẫn, xem kết quả đánh giá.

---

## 📁 Cấu trúc Thư mục Dự án

```
InternLink/
├── backend/                  # Mã nguồn Backend ASP.NET Core
│   └── InternLink/
│       ├── InternLink.API/           # REST API Controllers & Configurations
│       ├── InternLink.Application/   # DTOs, Interfaces, Business Logic
│       ├── InternLink.Domain/        # Entities, Enums
│       ├── InternLink.Infrastructure/# DbContext, Repositories, Services, Email, PDF
│       ├── InternLink.Shared/        # Responses, Helpers, Constants
│       └── Dockerfile                # Multi-stage Dockerfile cho Backend
├── frontend/                 # Mã nguồn Frontend React SPA
│   ├── src/
│   │   ├── components/       # UI Components dùng chung
│   │   ├── features/         # Các phân hệ theo vai trò (admin, lecturer, student)
│   │   ├── services/         # Tầng gọi API Backend (Axios/Fetch)
│   │   └── types/            # TypeScript interfaces & DTO mappings
├── docs/                     # Toàn bộ tài liệu phân tích thiết kế & đặc tả
│   ├── 01-Vision-Scope.md
│   ├── 02-Software-Requirements-Specification.md
│   ├── 03-Business-Workflow.md
│   ├── 04-Use-Case-Specification.md
│   ├── 05a-Domain-Model.md
│   ├── 05b-Entity-Relationship-Diagram.md
│   ├── 05c-Data-Dictionary.md
│   ├── 05d-Database-Design.md
│   ├── 06-System-Architecture.md
│   ├── 07a-Information-Architecture.md
│   ├── 07b-Application-Flow.md
│   ├── 08-API-Specification.md
│   ├── Email-Setup-Gmail.md
│   └── README.md
├── docker-compose.yml        # File khởi chạy toàn bộ hệ thống bằng Docker
└── README.md                 # Hướng dẫn tổng quan dự án
```

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy

### Cách 1: Chạy Full-Stack bằng Docker Compose (Khuyên dùng - Chuẩn Production)

Hệ thống được đóng gói hoàn chỉnh bằng Docker Multi-stage và Reverse Proxy Nginx:

```bash
# 1. Khởi chạy toàn bộ hệ thống (Frontend Nginx + Backend .NET API)
docker compose up -d --build

# 2. Kiểm tra trạng thái và health check của các container
docker compose ps

# 3. Chạy công cụ chẩn đoán hệ thống tự động
.\scripts\troubleshoot.ps1
```
- **Frontend Web & Reverse Proxy**: `http://localhost:3000`
- **Backend API Direct**: `http://localhost:7109` (Swagger UI: `http://localhost:7109/swagger`)
- **Health Check Endpoints**:
  - `http://localhost:7109/health` (Tổng quan hệ thống)
  - `http://localhost:7109/health/live` (Liveness probe)
  - `http://localhost:7109/health/ready` (Readiness probe - SQL Server connection)

---

### Cách 2: Chạy cục bộ từng phần (Local Development)

#### 1. Khởi chạy Backend (.NET 10 Web API)
```bash
cd backend/InternLink/InternLink.API
dotnet restore
dotnet ef database update --project ../InternLink.Infrastructure
dotnet run --launch-profile http
```

#### 2. Khởi chạy Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Tài khoản Mặc định để Kiểm thử (Default Seed Accounts)

| Vai trò (Role) | Tên đăng nhập (Username) | Mật khẩu (Password) | Quyền hạn chính |
| :--- | :--- | :--- | :--- |
| **SuperAdmin** | `admin` | `Admin123!` | Toàn quyền quản trị hệ thống, import dữ liệu, phân công |
| **Lecturer (GVHD)** | `gv001` (hoặc `gv002`) | `Password123!` | Quản lý SV hướng dẫn, chấm điểm, xuất báo cáo |
| **Student (SV)** | `sv001` (hoặc `sv002`) | `Password123!` | Nộp báo cáo tuần, nộp đồ án, xem phản hồi |

---

## 📚 Danh mục Tài liệu Báo cáo & Hạ tầng (`/docs`)

Toàn bộ tài liệu phân tích thiết kế phần mềm và hướng dẫn vận hành hệ thống được lưu trữ chuẩn hóa tại thư mục `/docs`:

1. [`docs/01-Vision-Scope.md`](docs/01-Vision-Scope.md): Tầm nhìn, phạm vi và mục tiêu nghiệp vụ.
2. [`docs/02-Software-Requirements-Specification.md`](docs/02-Software-Requirements-Specification.md): Đặc tả yêu cầu phần mềm (SRS).
3. [`docs/03-Business-Workflow.md`](docs/03-Business-Workflow.md): Quy trình nghiệp vụ thực tập tốt nghiệp.
4. [`docs/04-Use-Case-Specification.md`](docs/04-Use-Case-Specification.md): Đặc tả các Use Case chi tiết.
5. [`docs/05a-Domain-Model.md`](docs/05a-Domain-Model.md) & [`docs/05b-Entity-Relationship-Diagram.md`](docs/05b-Entity-Relationship-Diagram.md): Mô hình thực thể & Sơ đồ quan hệ CSDL (ERD).
6. [`docs/05c-Data-Dictionary.md`](docs/05c-Data-Dictionary.md) & [`docs/05d-Database-Design.md`](docs/05d-Database-Design.md): Từ điển dữ liệu và thiết kế bảng CSDL.
7. [`docs/06-System-Architecture.md`](docs/06-System-Architecture.md): Thiết kế kiến trúc hệ thống và luồng dữ liệu.
8. [`docs/08-API-Specification.md`](docs/08-API-Specification.md): Đặc tả chi tiết các RESTful API & SignalR.
9. [`docs/09-System-DevOps-Guide.md`](docs/09-System-DevOps-Guide.md): **[MỚI] Kiến trúc Hạ tầng, Docker Multi-Stage, Nginx Gateway & Troubleshooting Runbook**.
10. [`docs/Email-Setup-Gmail.md`](docs/Email-Setup-Gmail.md): Hướng dẫn cấu hình gửi email thông báo qua Gmail SMTP.
