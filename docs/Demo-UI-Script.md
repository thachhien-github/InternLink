# InternLink — Demo UI Script (Stakeholder)

**Thời lượng:** ~15–20 phút  
**URL:** http://localhost:5173  
**API:** http://localhost:7109  
**Mock:** tắt (`frontend/.env.local`)

| Portal | Username | Password |
|--------|----------|----------|
| Admin | `superadmin` | `Password123!` |
| Lecturer | `lecturer1` | `Password123!` |
| Student | `student1` | `Password123!` |

**Trước demo:** backend + frontend chạy · `scripts/smoke-test-m7.ps1` pass.

---

## Mở đầu (1 phút)

> InternLink quản lý thực tập end-to-end: Admin phân công, GV hướng dẫn/chấm, SV nộp báo cáo và sản phẩm. Hôm nay demo trên data seed + API thật.

---

## Act 1 — Admin (3 phút)

**Login:** http://localhost:5173/login → `superadmin`

| Bước | URL | Nói gì |
|------|-----|--------|
| Dashboard KPI | `/admin/dashboard` | Tổng quan SV, DN, phân công |
| Danh sách SV | `/admin/students` | Quản lý hồ sơ, import Excel (tuỳ chọn) |
| Phân công | `/admin/assignments` | Gán SV → GV — Nguyen An ↔ lecturer1 |
| Test email | `/admin/settings` | Gửi email thử SMTP → toast OK |

**Logout** (menu account góc phải).

---

## Act 2 — Lecturer (6 phút)

**Login:** `lecturer1`

| Bước | URL | Hành động |
|------|-----|-----------|
| Dashboard | `/lecturer/dashboard` | Action items, SV được giao |
| Biểu mẫu | `/lecturer/templates` | Upload PDF/DOCX cho internship |
| Báo cáo tuần | `/lecturer/reports` | Tab weekly — duyệt báo cáo SV |
| Sản phẩm | `/lecturer/reports` | Tab submissions — feedback, yêu cầu sửa |
| Chấm điểm | `/lecturer/evaluations` | Nhập rubric → **Finalize** |
| Export | `/lecturer/export` | Tải Excel cuối kỳ |

**Logout.**

---

## Act 3 — Student (5 phút)

**Login:** `student1`

| Bước | URL | Hành động |
|------|-----|-----------|
| Dashboard | `/student/dashboard` | Trạng thái internship |
| Thực tập | `/student/internship` | DN, GV, timeline |
| Tài liệu | `/student/templates` | Tải biểu mẫu GV upload |
| Báo cáo tuần | `/student/weekly-reports` | Tạo draft → **Nộp** |
| Sản phẩm | `/student/submissions` | Upload file → resubmit nếu bị yêu cầu sửa |
| Feedback | `/student/feedback` | Xem nhận xét GV |

**Logout.**

---

## Kết (1 phút)

> MVP đã cover: auth 3 role, phân công, tài liệu, báo cáo tuần, sản phẩm + feedback loop, chấm điểm, export, email. Backlog: analytics nâng cao, AI assist, InternshipLog.

---

## Fallback khi demo live lỗi

1. Chạy lại `scripts/smoke-test-m7.ps1` — chứng minh API E2E.
2. Swagger: http://localhost:7109/swagger
3. Bỏ qua Import Excel nếu seed đủ data.

---

## Checklist tick sau demo

Cập nhật `docs/M7-UAT-Checklist.md` — cột **UI flows**.
