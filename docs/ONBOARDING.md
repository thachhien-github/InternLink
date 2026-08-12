# InternLink — Onboarding (15 phút)

Chạy backend + đọc docs đủ để demo API.

## 1. Chạy API

```bash
cd backend/InternLink
dotnet ef database update --project InternLink.Infrastructure --startup-project InternLink.API
dotnet run --project InternLink.API
```

Swagger: http://localhost:7109/swagger

## 2. Tài khoản demo

| User | Password | Role |
|------|----------|------|
| `superadmin` | `Password123!` | SuperAdmin |
| `lecturer1` | `Password123!` | Lecturer |
| `student1` | `Password123!` | Student |

## 3. Thứ tự đọc docs (nếu cần context)

1. [`01-Vision-Scope.md`](01-Vision-Scope.md) → [`02-Software-Requirements-Specification.md`](02-Software-Requirements-Specification.md)  
2. [`04-Use-Case-Specification.md`](04-Use-Case-Specification.md)  
3. [`database/README.md`](../database/README.md)  
4. [`Backend-Plan.md`](Backend-Plan.md) + [`08-API-Specification.md`](08-API-Specification.md)  
5. Sequences: [`images/sequence/`](images/sequence/)

**Status matrix:** [`DOCS-STATUS.md`](DOCS-STATUS.md)

## 4. Smoke nhanh (SuperAdmin)

1. Login `superadmin` → copy JWT  
2. `GET /api/Admin/students`  
3. `POST /api/Admin/assignments` (gán SV → lecturer)  
4. Login `lecturer1` → `GET /api/Lecturer/internships`

Checklist đầy đủ: [`Admin-Smoke-Test-Checklist.md`](Admin-Smoke-Test-Checklist.md)

## 5. Email ở Dev

`Email:Enabled=false` → nội dung mail ghi vào Serilog (`InternLink.API/Logs/`).

Bật Gmail thật: [`Email-Setup-Gmail.md`](Email-Setup-Gmail.md) (`internlink.cntt@gmail.com` + App Password + user-secrets).
