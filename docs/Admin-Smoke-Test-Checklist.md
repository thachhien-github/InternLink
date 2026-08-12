# Admin Module — Smoke Test Checklist

**Project:** InternLink  
**Ngày:** 2026-08-12  
**Môi trường:** Development (`http://localhost:7109/swagger`)

## Chuẩn bị

- [ ] `dotnet ef database update --project InternLink.Infrastructure --startup-project InternLink.API`
- [ ] API chạy: `dotnet run --project InternLink.API`
- [ ] Seed users: `superadmin` / `lecturer1` / `student1` — password `Password123!`

---

## 1. Auth & Password

| # | Scenario | Expected |
|---|----------|----------|
| 1.1 | `POST /api/Auth/login` superadmin | 200, JWT, role SuperAdmin |
| 1.2 | `POST /api/Auth/forgot-password` `{ "email": "student1@internlink.test" }` | 200; log email có reset link (`Email:Enabled=false`) |
| 1.3 | Copy token từ log → `POST /api/Auth/reset-password` `{ "token", "newPassword" }` | 200 |
| 1.4 | Login student1 với mật khẩu mới | 200 |
| 1.5 | `POST /api/Auth/change-password` (authorized) | 200, `MustChangePassword=false` |

---

## 2. Admin — Students

| # | Scenario | Expected |
|---|----------|----------|
| 2.1 | Login superadmin → `GET /api/Admin/students` | 200, danh sách SV |
| 2.2 | `POST /api/Admin/students` tạo SV + email | 201, invitation logged |
| 2.3 | `POST /api/Admin/students/import` (Excel) | Result có EmailSentCount |

---

## 3. Admin — Companies

| # | Scenario | Expected |
|---|----------|----------|
| 3.1 | `GET /api/Admin/companies` | 200 |
| 3.2 | `POST /api/Admin/companies/import` | Import result OK |

---

## 4. Admin — Users

| # | Scenario | Expected |
|---|----------|----------|
| 4.1 | `GET /api/Admin/users` | 200 |
| 4.2 | `POST /api/Admin/users` (Lecturer + email) | 201, invitation email |
| 4.3 | `POST /api/Admin/users/{id}/reset-password` | 200, không trả password trong response |

---

## 5. Admin — Assignments

| # | Scenario | Expected |
|---|----------|----------|
| 5.1 | `POST /api/Admin/assignments` gán 2–3 SV cho lecturer1 | AssignedCount > 0 |
| 5.2 | Login lecturer1 → `GET /api/Lecturer/internships` | Thấy SV vừa gán |
| 5.3 | Re-assign 1 SV sang GV khác | Lecturer cũ không còn thấy SV |
| 5.4 | Login lecturer1 → `POST /api/Admin/assignments` | **403 Forbidden** |

---

## 6. Lecturer read-only master data

| # | Scenario | Expected |
|---|----------|----------|
| 6.1 | Login lecturer1 → `GET /api/Student` | 200 (read-only) |
| 6.2 | Login lecturer1 → `POST /api/Admin/students` | **403** |
| 6.3 | Login lecturer1 → `PUT /api/Internship/{id}` (no LecturerId change) | Company assign OK |

---

## 7. Regression

```bash
cd backend/InternLink
dotnet build
dotnet test
```

- [ ] Build: 0 errors
- [ ] Tests: all pass (75)

---

## Ghi chú

- Dev email: `Email:Enabled=false` → xem nội dung mail trong log file `InternLink.API/Logs/`
- Production: bật SMTP + `Email:Enabled=true`
- Reset link format: `{PortalUrl}/reset-password?token=...`
