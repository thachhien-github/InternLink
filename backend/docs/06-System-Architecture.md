# System Architecture

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.0

**Status:** Draft

---

# 1. Overview

InternLink được thiết kế theo mô hình Client–Server nhằm hỗ trợ giảng viên và sinh viên quản lý quá trình thực tập trên một nền tảng tập trung.

Hệ thống bao gồm ba thành phần chính:

- Frontend
- Backend
- Database

Kiến trúc này giúp dễ bảo trì, dễ mở rộng và phù hợp với các ứng dụng Web hiện đại.

---

# 2. High-Level Architecture

```text
+-----------------------------------------------------+
|                     Client Layer                    |
|-----------------------------------------------------|
| ReactJS + TypeScript + TailwindCSS + Vite           |
+-------------------------▲---------------------------+
                          │ HTTPS + JSON
                          ▼
+-----------------------------------------------------+
|                  ASP.NET Core Web API              |
|-----------------------------------------------------|
| Authentication (JWT)                               |
| Controllers                                        |
| Services                                           |
| Repositories                                       |
| Entity Framework Core                              |
+-------------------------▲---------------------------+
                          │
                          ▼
+-----------------------------------------------------+
|                  Microsoft SQL Server              |
|-----------------------------------------------------|
| Internship Database                                |
+-----------------------------------------------------+
```

---

# 3. Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | ReactJS |
| Build Tool | Vite |
| Language | TypeScript |
| UI | Tailwind CSS |
| Backend | ASP.NET Core Web API (.NET 9) |
| ORM | Entity Framework Core |
| Database | SQL Server |
| Authentication | JWT |
| API Documentation | Swagger |
| Testing | Postman |

---

# 4. Frontend Architecture

Frontend được tổ chức theo Page-Based Architecture.

```text
src/
│
├── assets/
├── components/
├── contexts/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

### Responsibilities

- Hiển thị giao diện.
- Gửi HTTP Request.
- Xử lý trạng thái giao diện.
- Quản lý Authentication.
- Hiển thị Dashboard.

---

# 5. Backend Architecture

Backend áp dụng mô hình 4-Layer Architecture.

```text
InternLink.API
        │
        ▼
InternLink.Application
        │
        ▼
InternLink.Domain
        │
        ▼
InternLink.Infrastructure
```

---

## API Layer

Chịu trách nhiệm:

- Routing
- Authentication
- Authorization
- Validation
- HTTP Response

---

## Application Layer

Chứa:

- DTO
- Services
- Interfaces
- Business Logic

---

## Domain Layer

Chứa:

- Entities
- Enums
- Domain Models

Không phụ thuộc Framework.

---

## Infrastructure Layer

Chứa:

- DbContext
- Repository
- EF Core Configuration
- Database Access

---

# 6. Database Architecture

SQL Server lưu toàn bộ dữ liệu nghiệp vụ.

Entity Framework Core chịu trách nhiệm:

- Migration
- CRUD
- LINQ
- Mapping

---

# 7. Authentication Architecture

InternLink sử dụng JWT Authentication.

Quy trình:

1. User Login
2. API xác thực
3. Tạo JWT Token
4. Client lưu Token
5. Client gửi Token trong Authorization Header
6. API xác thực Token
7. Trả dữ liệu

---

# 8. Request Flow

```text
React Page

↓

API Service

↓

Controller

↓

Application Service

↓

Repository

↓

DbContext

↓

SQL Server
```

Response

```text
SQL Server

↓

DbContext

↓

Repository

↓

Application Service

↓

Controller

↓

React UI
```

---

# 9. Security

Hệ thống áp dụng:

- JWT Authentication
- Role-based Authorization
- Password Hashing
- HTTPS
- Input Validation

---

# 10. File Storage

InternLink không lưu file trực tiếp trong SQL Server.

Database chỉ lưu:

- FileName
- FileUrl
- FileSize
- ContentType

Các tệp được lưu trong thư mục lưu trữ của hệ thống.

---

# 11. Deployment Architecture

Development

```text
React Dev Server

↓

ASP.NET Web API

↓

SQL Server Local
```

Production

```text
Browser

↓

React Build

↓

ASP.NET Core

↓

SQL Server
```

---

# 12. Future Architecture

Trong các phiên bản tiếp theo có thể mở rộng:

- AI Recommendation Service
- AI Report Analysis
- Email Service
- Notification Service
- Docker Deployment
- Cloud Storage
- Logging & Monitoring

Kiến trúc hiện tại được thiết kế để hỗ trợ việc bổ sung các dịch vụ trên mà không cần thay đổi lớn.

---

# 13. Architecture Principles

InternLink được xây dựng dựa trên các nguyên tắc:

- Separation of Concerns
- Single Responsibility Principle
- Layered Architecture
- RESTful API
- Reusability
- Scalability
- Maintainability

---

# 14. Summary

InternLink áp dụng kiến trúc Client–Server kết hợp với mô hình 4-Layer cho Backend.

Kiến trúc này đảm bảo:

- Dễ phát triển.
- Dễ bảo trì.
- Dễ mở rộng.
- Phù hợp với quy mô MVP.
- Sẵn sàng tích hợp AI trong các phiên bản tiếp theo.