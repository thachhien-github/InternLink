# InternLink — Hướng Dẫn Nhập Môn (Onboarding)

**Phiên bản:** 4.0  
**Ngày cập nhật:** Tháng 9/2026

---

## 1. Yêu cầu Hệ thống

| Thành phần | Phiên bản |
|:---|:---|
| .NET SDK | 8.x |
| Node.js | 20.x |
| SQL Server | 2022 Express/Developer |
| Docker Desktop | 4.x (tùy chọn) |

---

## 2. Clone & Setup

```bash
# Clone repository
git clone <repo-url>
cd internlink

# Backend setup
cd backend/InternLink
dotnet restore
dotnet ef database update --project InternLink.Infrastructure --startup-project InternLink.API
dotnet run --project InternLink.API

# Frontend setup (terminal mới)
cd frontend
npm install
npm run dev
```

---

## 3. Access Points

| Service | URL |
|:---|:---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:7109 |
| Swagger | http://localhost:7109/swagger |

---

## 4. Tài khoản Demo

| Username | Password | Role |
|:---|:---|:---|
| `admin` | `Admin123!` | SuperAdmin |
| `gv001` | `Password123!` | Lecturer |
| `sv001` | `Password123!` | Student |

---

## 5. Thứ Tự Đọc Tài Liệu

1. `01-Vision-Scope.md` — Tổng quan dự án
2. `06-System-Architecture.md` — Kiến trúc hệ thống
3. `05a-Domain-Model.md` — Mô hình miền
4. `08-API-Specification.md` — Đặc tả API
5. `09-System-DevOps-Guide.md` — Hướng dẫn vận hành

---

## 6. Smoke Test Nhanh

```bash
# 1. Login Admin
curl -X POST http://localhost:7109/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'

# 2. Lấy JWT token từ response, rồi gọi:
curl http://localhost:7109/api/Admin/students \
  -H "Authorization: Bearer <token>"

# 3. Login Lecturer
curl -X POST http://localhost:7109/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"gv001","password":"Password123!"}'

# 4. Gọi API giảng viên
curl http://localhost:7109/api/Lecturer/internships \
  -H "Authorization: Bearer <token>"
```

---

## 7. Cấu Hình Email (Tùy chọn)

- Mặc định: `Email:Enabled=false` (log ra console)
- Bật Gmail SMTP: Xem `Email-Setup-Gmail.md`
