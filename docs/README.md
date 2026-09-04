# InternLink — Danh Mục Tài Liệu Kỹ Thuật

**Phiên bản:** 4.0  
**Ngày cập nhật:** Tháng 9/2026  
**Trạng thái:** v1.0 Release — 18 entities, 25 controllers, 34 routes

---

## 📑 Danh Sách Tài Liệu

| # | File | Nội dung | Phiên bản |
|:---:|:---|:---|:---:|
| 01 | [`01-Vision-Scope.md`](01-Vision-Scope.md) | Tầm nhìn & Phạm vi dự án | 4.0 |
| 02 | [`02-Software-Requirements-Specification.md`](02-Software-Requirements-Specification.md) | Đặc tả Yêu cầu Phần mềm (SRS) | 4.0 |
| 03 | [`03-Business-Workflow.md`](03-Business-Workflow.md) | Quy trình Nghiệp vụ 5 giai đoạn | 4.0 |
| 04 | [`04-Use-Case-Specification.md`](04-Use-Case-Specification.md) | Đặc tả Use Cases (37 UC) | 4.0 |
| 05 | [`05a-Domain-Model.md`](05a-Domain-Model.md) | Mô hình Miền (18 Entities) | 4.0 |
| 06 | [`05b-Entity-Relationship-Diagram.md`](05b-Entity-Relationship-Diagram.md) | Sơ đồ ERD (18 Bảng) | 4.0 |
| 07 | [`05c-Data-Dictionary.md`](05c-Data-Dictionary.md) | Từ điển Dữ liệu chi tiết | 4.0 |
| 08 | [`05d-Database-Design.md`](05d-Database-Design.md) | Thiết kế CSDL SQL Server | 4.0 |
| 09 | [`06-System-Architecture.md`](06-System-Architecture.md) | Kiến trúc Clean Architecture | 4.0 |
| 10 | [`07a-Information-Architecture.md`](07a-Information-Architecture.md) | Sitemap 34 Routes | 4.0 |
| 11 | [`07b-Application-Flow.md`](07b-Application-Flow.md) | Luồng Hoạt động Ứng dụng | 4.0 |
| 12 | [`08-API-Specification.md`](08-API-Specification.md) | Đặc tả RESTful API (25 Controllers) | 4.0 |
| 13 | [`09-System-DevOps-Guide.md`](09-System-DevOps-Guide.md) | Hướng dẫn Vận hành & Docker | 4.0 |
| 14 | [`Demo-UI-Script.md`](Demo-UI-Script.md) | Kịch bản Demo 15 phút | 4.0 |
| 15 | [`Email-Setup-Gmail.md`](Email-Setup-Gmail.md) | Cấu hình SMTP Gmail | 3.0 |
| 16 | [`ONBOARDING.md`](ONBOARDING.md) | Hướng dẫn Nhập môn Dev | 4.0 |

---

## 🏗️ Kiến Trúc Hệ Thống

| Thành phần | Công nghệ | Phiên bản |
|:---|:---|:---|
| Frontend | React + TypeScript + Vite | React 19 |
| CSS | Tailwind CSS | v4 |
| Backend | ASP.NET Core Web API | .NET 10 |
| ORM | Entity Framework Core | 10.x |
| Database | Microsoft SQL Server | 2022 |
| Auth | JWT Bearer + Refresh Token | — |
| Real-time | SignalR Core | — |
| Container | Docker + Docker Compose | — |

---

## 📊 Thống kê Hệ thống

| Metric | Giá trị |
|:---|:---:|
| API Controllers | 25 |
| Bảng dữ liệu | 18 |
| Frontend Routes | 34 |
| Service Files | 31 |
| Use Cases | 37 |
| TypeScript Errors | 0 |
| C# Build Errors | 0 |

---

## 🎯 Phân Quyền

- **SuperAdmin**: Quản lý học kỳ, users, assignments, notifications, settings
- **Lecturer**: Dashboard, students, reports, evaluations, export
- **Student**: Dashboard, internship, weekly reports, submissions, feedback
