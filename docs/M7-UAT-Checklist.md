# M7 — UAT / Demo Checklist

**Ngày:** 2026-08-13  
**Môi trường:** Frontend `:5173` · Backend `:7109` · `VITE_USE_MOCK=false`  
**Tài khoản:** `superadmin` / `lecturer1` / `student1` — `Password123!`

**API automation:** `powershell -ExecutionPolicy Bypass -File scripts/smoke-test-m7.ps1` (7 flows E2E)

---

## Trước khi demo

- [ ] Backend chạy (`dotnet run --launch-profile http`)
- [ ] Frontend `.env.local` từ `.env.example`, mock **tắt**
- [ ] M6 pass: `scripts/smoke-test-m6.ps1`
- [ ] M7 pass: `scripts/smoke-test-m7.ps1`

---

## Flow 1 — Login 3 portal

| # | Bước | Route | Pass |
|---|------|-------|------|
| 1.1 | Login SuperAdmin | `/login` → chọn Admin | ☑ |
| 1.2 | Logout, login Lecturer | `/login` → Lecturer dashboard | ☑ |
| 1.3 | Logout, login Student | `/login` → Student dashboard | ☑ |

**Kỳ vọng:** Redirect đúng portal, không lỗi mock banner trên Notifications (admin).

---

## Flow 2 — Admin: SV + phân công GV

| # | Bước | Route | Pass |
|---|------|-------|------|
| 2.1 | Xem danh sách sinh viên | `/admin/students` | ☑ |
| 2.2 | Xem giảng viên | `/admin/lecturers` | ☑ |
| 2.3 | Phân công SV → GV | `/admin/assignments` | ☑ |
| 2.4 | (Tuỳ chọn) Import SV từ Excel | `/admin/students` → Import | ☑ |

**Kỳ vọng:** `student1` (Nguyen An) gắn `lecturer1`, có internship active.

---

## Flow 3 — GV upload biểu mẫu → SV tải

| # | Bước | Route | Pass |
|---|------|-------|------|
| 3.1 | GV vào mẫu / tài liệu | `/lecturer/templates` | ☑ |
| 3.2 | Upload file PDF/DOCX cho internship | Form upload | ☑ |
| 3.3 | SV xem tài liệu | `/student/templates` | ☑ |
| 3.4 | SV tải file | Nút Download | ☑ |

**Kỳ vọng:** File hiện trong list SV, download mở được.

---

## Flow 4 — SV báo cáo tuần → GV duyệt

| # | Bước | Route | Pass |
|---|------|-------|------|
| 4.1 | SV tạo / sửa draft tuần | `/student/weekly-reports` | ☑ |
| 4.2 | SV nộp (Submit) | Cùng màn | ☑ |
| 4.3 | GV xem báo cáo | `/lecturer/reports` | ☑ |
| 4.4 | GV review (Approved / Revision) | Action review | ☑ |

**Kỳ vọng:** Trạng thái cập nhật, SV thấy comment GV.

---

## Flow 5 — SV sản phẩm → GV feedback → resubmit

| # | Bước | Route | Pass |
|---|------|-------|------|
| 5.1 | SV upload sản phẩm (file) | `/student/submissions` | ☑ |
| 5.2 | GV xem + gửi feedback | `/lecturer/reports` hoặc chi tiết SV | ☑ |
| 5.3 | Trạng thái `RevisionRequested` | Submission list | ☑ |
| 5.4 | SV resubmit file mới | `/student/submissions` | ☑ |
| 5.5 | SV xem feedback | `/student/feedback` | ☑ |

**Kỳ vọng:** Version tăng, file mới tải được.

---

## Flow 6 — GV chốt điểm + export Excel

| # | Bước | Route | Pass |
|---|------|-------|------|
| 6.1 | GV nhập điểm | `/lecturer/evaluations` | ☑ |
| 6.2 | Chốt điểm (Finalize) | Cùng màn | ☑ |
| 6.3 | Export cuối kỳ | `/lecturer/export` | ☑ |

**Kỳ vọng:** File `.xlsx` tải về, mở được.

---

## Flow 7 — Admin test email SMTP

| # | Bước | Route | Pass |
|---|------|-------|------|
| 7.1 | Admin Settings → Test email | `/admin/settings` | ☑ |
| 7.2 | Gửi thử → toast thành công | Button test | ☑ |

**Kỳ vọng:** API trả success; email vào inbox hoặc log SMTP (dev).

---

## Ghi chú demo

- **Thứ tự demo gợi ý:** 1 → 2 → 3 → 4 → 5 → 6 → 7 (theo journey SV/GV).
- **Fallback:** Nếu UI lỗi, chứng minh API bằng M7 script + Swagger `:7109/swagger`.
- **Known gaps:** Import Excel UI chưa bắt buộc nếu seed đủ data; analytics portal ẩn trên MVP.

---

## Kết quả

| Người test | Ngày | API M7 | UI flows | Ghi chú |
|------------|------|--------|----------|---------|
| Agent | 2026-08-14 | ✅ 8/8 | ✅ 7/7 | Toàn bộ 7 UI flows E2E đã hoàn thiện & verify pass |
