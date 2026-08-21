# Sơ Đồ Kiến Trúc Tổng Thể (Overall System Architecture)

**Dự án:** InternLink — Nền tảng Quản lý & Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0  
**Kiến trúc:** Client-Server SPA & Web API Phân Tầng

---

```mermaid
flowchart TB
    subgraph Users["Các Tác Nhân Người Dùng (Actors)"]
        SA["SuperAdmin<br/>(Quản trị viên Khoa)"]
        L["Lecturer<br/>(Giảng viên hướng dẫn)"]
        S["Student<br/>(Sinh viên thực tập)"]
    end

    subgraph Frontend["Tầng Trình Diễn (Frontend Layer - Port 5173 / 3000)"]
        direction TB
        F_ADMIN["Admin Portal<br/>- Quản lý Học kỳ & User<br/>- Import Excel & Phân công<br/>- Gửi Email kích hoạt"]
        F_LEC["Lecturer Portal<br/>- Duyệt nhật ký 12 tuần<br/>- Chấm điểm Rubric 4 tiêu chí<br/>- Xuất PDF & Excel"]
        F_STU["Student Portal<br/>- Đăng ký Doanh nghiệp<br/>- Nộp báo cáo tuần & Đồ án<br/>- Xem điểm số & Nhận xét"]
        F_CORE["Core Engine<br/>React 18 + TypeScript + Tailwind CSS + Vite"]
    end

    subgraph Gateway["Cổng Kết Nối & Bảo Mật (API Gateway / Proxy)"]
        REV_PROXY["Nginx Reverse Proxy / HTTPS"]
        JWT_GUARD["JWT Bearer Token Guard<br/>(HMAC-SHA256 & RBAC Policy)"]
    end

    subgraph Backend["Tầng Xử Lý Nghiệp Vụ (Backend Web API - Port 7109)"]
        direction TB
        API_CTRL["RESTful API Controllers<br/>Auth, Semesters, Users, Lecturers, Students, WeeklyReports, Evaluations..."]
        APP_SVC["Application Business Services<br/>Workflow Engine, Rubric Calculator, Validation"]
        SIG_HUB["SignalR Core Real-time Hub<br/>/hubs/notifications"]
        
        subgraph Engines["Bộ Xử Lý Chuyên Biệt (Specialized Engines)"]
            PDF_GEN["Server-side Binary PDF Engine<br/>(Bảng tổng hợp & Phiếu Rubric A4)"]
            XLSX_GEN["ClosedXML Excel Engine<br/>(Import danh sách & Xuất 15 cột)"]
            MAIL_SVC["MailKit SMTP Dispatcher<br/>(Gmail App Password)"]
        end
    end

    subgraph Data["Tầng Lưu Trữ Bền Vững (Data Persistence Layer)"]
        direction TB
        DB_SQL[("Microsoft SQL Server 2022<br/>14 Bảng Thực Thể, EF Core 10,<br/>Soft Delete & Indexing")]
        STORAGE_VOL[("Docker Persistent Volume<br/>/app/uploads/documents<br/>(Báo cáo, Minh chứng, Đồ án)")]
    end

    SA --> F_ADMIN
    L --> F_LEC
    S --> F_STU

    F_ADMIN --> F_CORE
    F_LEC --> F_CORE
    F_STU --> F_CORE

    F_CORE -->|HTTP/RESTful API + JWT| REV_PROXY
    F_CORE -.->|WebSocket / WSS Connection| SIG_HUB

    REV_PROXY --> JWT_GUARD
    JWT_GUARD --> API_CTRL

    API_CTRL --> APP_SVC
    APP_SVC --> PDF_GEN
    APP_SVC --> XLSX_GEN
    APP_SVC --> MAIL_SVC
    APP_SVC -.->|Push Notifications| SIG_HUB

    APP_SVC --> DB_SQL
    APP_SVC --> STORAGE_VOL
    MAIL_SVC -->|SMTP Port 587| GMAIL_EXT["Google SMTP Server<br/>(internlink.cntt@gmail.com)"]
```

---

## 📌 Đặc Điểm Nổi Bật Của Kiến Trúc

1. **Phân quyền độc lập 3 vai trò**: Tách biệt hoàn toàn luồng giao diện và quyền hạn API thông qua các Policy JWT chặt chẽ.
2. **Xử lý tài liệu và báo cáo Server-side**: Toàn bộ file Excel (.xlsx) và tài liệu PDF được tạo trực tiếp từ Backend, đảm bảo đúng định dạng chuẩn mực của Bộ GD&ĐT.
3. **Chi phí vận hành tối ưu (0đ Cloud)**: Hệ thống sử dụng Docker Volume gắn trên máy chủ/VPS cục bộ, không tốn chi phí thuê ngoài các dịch vụ S3 hay Firebase.
