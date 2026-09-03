# Sitemap — InternLink (v4.0)

**Phiên bản:** 4.0  
**Tổng số routes:** 34 (Admin 12, Lecturer 10, Student 9, Auth 4)

---

## Public Routes — `/auth`

```text
/login                        — Đăng nhập (JWT)
/forgot-password              — Quên mật khẩu (Gửi email reset)
/reset-password              — Đặt lại mật khẩu (Token)
/change-password             — Đổi mật khẩu (Bắt buộc lần đầu)
```

## SuperAdmin Routes — `/admin` (12 trang)

```text
/admin/dashboard              — Dashboard thống kê tổng quan
/admin/semesters              — Quản lý Học kỳ (CRUD, Set Current, Close, Duplicate, Rubric Editor)
/admin/assignments            — Phân công Hướng dẫn (Manual, Auto, Bulk, Import/Export, History)
/admin/students               — Quản lý Sinh viên (CRUD, Import Excel, Search, Filter)
/admin/lecturers              — Quản lý Giảng viên (CRUD, Import/Export Excel)
/admin/companies              — Quản lý Doanh nghiệp (CRUD, Import/Export)
/admin/users                  — Quản lý Người dùng (CRUD, Reset Password, Lock/Unlock)
/admin/account-requests       — Duyệt yêu cầu cấp tài khoản (Process, Reject, Auto Provision)
/admin/rubrics                — Duyệt Rubric mẫu (View, Approve, Reject)
/admin/notifications          — Gửi thông báo Broadcast & Campaign (Delete, History)
/admin/settings               — Cấu hình hệ thống (Faculty Settings, CRUD, Reset)
/admin/account                — Thông tin cá nhân Admin
```

## Lecturer Routes — `/lecturer` (10 trang)

```text
/lecturer/dashboard           — Dashboard tiến độ SV phụ trách
/lecturer/students            — Danh sách SV (Filter, Ghi chú, Bulk Notify, Bulk Export)
/lecturer/enterprises         — Thông tin Doanh nghiệp (Read-only)
/lecturer/templates           — Biểu mẫu & Tài liệu (Upload, Download, Archive)
/lecturer/evaluations         — Đánh giá Rubric (Grade, Score, Finalize, PDF)
/lecturer/export              — Xuất báo cáo (Excel + PDF End-of-Term)
/lecturer/reports             — Duyệt Báo cáo tuần & Đánh giá Submission
/lecturer/analytics           — Thống kê & Biểu đồ tiến độ
/lecturer/notifications       — Thông báo cá nhân (Real-time SignalR)
/lecturer/account             — Thông tin cá nhân & Đổi mật khẩu
```

## Student Routes — `/student` (9 trang)

```text
/student/dashboard            — Dashboard tiến độ & Nhiệm vụ
/student/internship           — Thông tin thực tập & Tải PDF chứng nhận
/student/weekly-reports       — Nhật ký tuần (CRUD, Submit, View Review)
/student/submissions          — Nộp Đồ án (Upload, Resubmit, Student Reply, Feedback)
/student/feedback             — Phản hồi & Nhận xét (View, Reply)
/student/evaluation           — Kết quả Đánh giá & Xếp loại
/student/documents            — Biểu mẫu & Tài liệu (Download)
/student/notifications        — Thông báo cá nhân (Real-time SignalR)
/student/account              — Thông tin cá nhân & Đổi mật khẩu
```

---

## 📌 Bảng Tổng Hợp Routes

| Vai trò | Số trang | Prefix | Ví dụ route |
|:---|:---:|:---|:---|
| Public (Auth) | 4 | `/` | `/login`, `/forgot-password` |
| SuperAdmin | 12 | `/admin` | `/admin/dashboard`, `/admin/semesters` |
| Lecturer | 10 | `/lecturer` | `/lecturer/dashboard`, `/lecturer/students` |
| Student | 9 | `/student` | `/student/dashboard`, `/student/internship` |
| **Tổng cộng** | **34** | - | - |

---

## 📌 Cấu Trúc Điều Hướng (Navigation Structure)

### Admin Sidebar
```text
📊 Dashboard
📅 Học kỳ
📋 Phân công
👨‍🎓 Sinh viên
👨‍🏫 Giảng viên
🏢 Doanh nghiệp
👥 Người dùng
📝 Yêu cầu tài khoản
⭐ Duyệt Rubric
🔔 Thông báo
⚙️ Cấu hình
👤 Tài khoản
```

### Lecturer Sidebar
```text
📊 Dashboard
👨‍🎓 Sinh viên
🏢 Doanh nghiệp
📄 Biểu mẫu
⭐ Đánh giá
📤 Xuất báo cáo
📋 Báo cáo tuần
📈 Thống kê
🔔 Thông báo
👤 Tài khoản
```

### Student Sidebar
```text
📊 Dashboard
🏢 Thực tập
📝 Báo cáo tuần
📤 Bài nộp
💬 Phản hồi
⭐ Đánh giá
📄 Tài liệu
🔔 Thông báo
👤 Tài khoản
```
