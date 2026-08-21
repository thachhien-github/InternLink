# InternLink — Kiến Trúc Hệ Thống (System Architecture)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0  
**Ngày cập nhật:** Tháng 8/2026

---

## 1. Sơ Đồ Kiến Trúc Tổng Thể (High-Level Architecture)

Hệ thống được thiết kế theo mô hình **Client - Server Phân Tầng Hiện Đại (SPA + RESTful API)** kết hợp giao tiếp thời gian thực:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PRESENTATION LAYER                     │
│               React 18 + TypeScript + Vite + Tailwind CSS               │
├────────────────────────────────────────────────────────────────────────┤
│  [ SuperAdmin Portal ]   │   [ Lecturer Portal ]   │ [ Student Portal ]│
│  - Quản lý Học kỳ & User │   - Duyệt Báo cáo 12 Tuần│ - Nhật ký tuần   │
│  - Import/Export Excel   │   - Chấm điểm Rubric    │ - Nộp đồ án       │
│  - Phân công & Gửi Mail  │   - Xuất PDF / Excel    │ - Tra cứu điểm    │
└───────────────────▲──────────────────────────────────────▲─────────────┘
                    │ HTTPS / RESTful API (JSON)           │ WSS / SignalR
┌───────────────────▼──────────────────────────────────────▼─────────────┐
│                         BACKEND APPLICATION LAYER                       │
│                         ASP.NET Core 10 Web API                         │
├────────────────────────────────────────────────────────────────────────┤
│  [ Controllers / API Layer ]                                           │
│  - Auth, Semesters, Users, Lecturers, Students, Assignments            │
│  - WeeklyReports, Submissions, Evaluations, Documents, Exports         │
├────────────────────────────────────────────────────────────────────────┤
│  [ Application Core / Business Logic ]                                 │
│  - Services, DTOs, AutoMapper, FluentValidation, Exceptions            │
├────────────────────────────────────────────────────────────────────────┤
│  [ Infrastructure Layer ]                                              │
│  - EF Core 10 DbContext & Repositories                                 │
│  - Server-side PDF Binary Generator Engine                             │
│  - ClosedXML Excel Processing Engine                                   │
│  - MailKit SMTP Client (Gmail Email Dispatcher)                        │
│  - SignalR Hubs (`/hubs/notifications`)                                │
│  - Local Server File Storage Provider (`uploads/documents`)            │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                          DATA PERSISTENCE LAYER                        │
├────────────────────────────────────────────────────────────────────────┤
│  [ Microsoft SQL Server 2022 ]      │  [ Docker Persistent Storage ]  │
│  - 14 Bảng dữ liệu quan hệ          │  - Volume: `internlink_uploads`  │
│  - Soft Delete & Indexing           │  - Báo cáo, Minh chứng, Đồ án    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Kiến Trúc Backend: Clean Architecture 5 Phân Tầng

Mã nguồn Backend được tổ chức nghiêm ngặt theo mô hình Clean Architecture trong `backend/InternLink/`:

```
InternLink.slnx
├── InternLink.Domain/         # Thực thể cốt lõi (Entities), Enums, BaseEntity
├── InternLink.Application/    # DTOs, Service Interfaces, Mappings
├── InternLink.Infrastructure/ # Persistence (DbContext), EF Configurations, Email, PDF, Excel, Storage
├── InternLink.API/            # Controllers, Middlewares, Extensions, Hubs, Startup config
├── InternLink.Shared/         # Standard API Response wrapper (ApiResponse<T>), Error codes
└── InternLink.Tests/          # Unit Tests & Integration Tests
```

---

## 3. Kiến Trúc Bảo Mật & Xác Thực (Security & Authentication)

1. **JWT Authentication & Token Lifecycle**:
   - Khi đăng nhập thành công, Server phát hành cặp Token:
     - `AccessToken`: Thời hạn 60 phút, chứa Claims (`sub`, `name`, `role`, `userId`).
     - `RefreshToken`: Thời hạn 7 ngày, lưu trong CSDL để cấp lại AccessToken mà không cần đăng nhập lại.
2. **Role-Based Access Control (RBAC)**:
   - Các API Endpoint được bảo vệ bằng Policy:
     - `[Authorize(Policy = "RequireAdmin")]`
     - `[Authorize(Policy = "RequireLecturerOrAdmin")]`
     - `[Authorize(Policy = "RequireStudent")]`
3. **Mã Hóa Mật Khẩu**:
   - Sử dụng giải thuật băm mật khẩu chuẩn công nghiệp **PBKDF2** với 100.000 vòng lặp và khóa muối 128-bit.

---

## 4. Kiến Trúc Giao Tiếp Thời Gian Thực (SignalR Real-time Hubs)

- **Endpoint Hub**: `/hubs/notifications`
- **Cơ chế**: Khi Giảng viên phê duyệt báo cáo tuần hoặc Admin phát thông báo Broadcast, Backend sẽ bắn sự kiện `ReceiveNotification` trực tiếp đến WebSocket client của sinh viên mục tiêu mà không cần người dùng phải tải lại trang.

---

## 5. Kiến Trúc Lưu Trữ & Sinh Báo Cáo (Storage & Reporting)

1. **Local Server Storage Engine**:
   - Lưu trữ trực tiếp trên file system của container tại `/app/uploads`.
   - Mount với Docker Named Volume `internlink_uploads_data` đảm bảo dữ liệu không bị mất khi container restart.
2. **Server-side Binary PDF Engine**:
   - Tự động sinh file PDF nhị phân (PDF 1.4 specification) trực tiếp trên memory stream, không phụ thuộc vào thư viện ngoài, tối ưu 100% khi chạy trong container Linux.
