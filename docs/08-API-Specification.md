# InternLink — Đặc Tả RESTful API & SignalR (API Specification)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0  
**Ngày cập nhật:** Tháng 8/2026

---

## 1. Quy Chuẩn API Chung (General API Standards)

- **Base URL**: `http://localhost:7109` (Production: HTTPS)
- **Định dạng dữ liệu**: `application/json` (trừ các endpoint Upload `multipart/form-data` và Export File nhị phân).
- **Xác thực**: Bearer Token trong Header: `Authorization: Bearer <access_token>`.
- **Cấu trúc Response Chuẩn**:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2026-08-18T10:30:00Z"
}
```

---

## 2. Nhóm API Xác Thực & Người Dùng (`/api/Auth`)

| Method | Endpoint | Quyền hạn | Mô tả |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/Auth/login` | Public | Đăng nhập tài khoản, nhận AccessToken & RefreshToken. |
| `POST` | `/api/Auth/refresh-token` | Public | Làm mới AccessToken khi hết hạn bằng RefreshToken. |
| `POST` | `/api/Auth/logout` | Authenticated | Đăng xuất, hủy phiên RefreshToken. |
| `POST` | `/api/Auth/change-password` | Authenticated | Đổi mật khẩu mới (hoặc đổi lần đầu). |
| `POST` | `/api/Auth/forgot-password` | Public | Yêu cầu mã đặt lại mật khẩu qua email. |
| `POST` | `/api/Auth/reset-password` | Public | Đặt lại mật khẩu mới bằng reset token. |
| `GET` | `/api/Auth/me` | Authenticated | Lấy thông tin tài khoản hiện đang đăng nhập. |

---

## 3. Nhóm API Quản Lý Học Kỳ (`/api/Semester`)

| Method | Endpoint | Quyền hạn | Mô tả |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/Semester` | Authenticated | Lấy danh sách toàn bộ học kỳ thực tập. |
| `GET` | `/api/Semester/current` | Authenticated | Lấy thông tin học kỳ hiện tại đang hoạt động (`IsCurrent = true`). |
| `GET` | `/api/Semester/{id}` | Authenticated | Lấy thông tin chi tiết một học kỳ. |
| `POST` | `/api/Semester` | SuperAdmin | Tạo mới một học kỳ thực tập. |
| `PUT` | `/api/Semester/{id}` | SuperAdmin | Cập nhật thông tin học kỳ. |
| `DELETE` | `/api/Semester/{id}` | SuperAdmin | Xóa học kỳ (Soft delete). |
| `POST` | `/api/Semester/{id}/set-current` | SuperAdmin | Đặt học kỳ được chọn làm học kỳ hiện tại duy nhất. |

---

## 4. Nhóm API Quản Trị Khoa (`/api/Admin`)

| Method | Endpoint | Quyền hạn | Mô tả |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/Admin/users` | SuperAdmin | Danh sách người dùng hệ thống (có phân trang & lọc). |
| `POST` | `/api/Admin/users` | SuperAdmin | Tạo tài khoản người dùng mới thủ công. |
| `PUT` | `/api/Admin/users/{id}` | SuperAdmin | Cập nhật thông tin người dùng. |
| `DELETE` | `/api/Admin/users/{id}` | SuperAdmin | Khóa / Xóa tài khoản người dùng. |
| `POST` | `/api/Admin/users/{id}/reset-password` | SuperAdmin | Đặt lại mật khẩu người dùng về mật khẩu mặc định. |
| `GET` | `/api/Admin/students` | SuperAdmin | Danh sách sinh viên thực tập trong kỳ. |
| `POST` | `/api/Admin/students/import` | SuperAdmin | Import danh sách sinh viên hàng loạt từ file Excel. |
| `GET` | `/api/Admin/lecturers` | SuperAdmin | Danh sách giảng viên hướng dẫn. |
| `POST` | `/api/Admin/lecturers/import` | SuperAdmin | Import danh sách giảng viên từ file Excel. |
| `GET` | `/api/Admin/companies` | SuperAdmin | Danh mục doanh nghiệp đối tác. |
| `POST` | `/api/Admin/companies` | SuperAdmin | Thêm doanh nghiệp mới. |
| `PUT` | `/api/Admin/companies/{id}` | SuperAdmin | Cập nhật thông tin doanh nghiệp. |
| `DELETE` | `/api/Admin/companies/{id}` | SuperAdmin | Xóa doanh nghiệp khỏi danh mục. |
| `GET` | `/api/Admin/assignments` | SuperAdmin | Danh sách phân công GVHD - Sinh viên theo kỳ. |
| `POST` | `/api/Admin/assignments` | SuperAdmin | Phân công sinh viên cho GVHD. |
| `POST` | `/api/Admin/assignments/bulk` | SuperAdmin | Phân công hàng loạt sinh viên cho GVHD. |
| `DELETE` | `/api/Admin/assignments/{id}` | SuperAdmin | Hủy phân công thực tập. |
| `POST` | `/api/Admin/email/send-invitations` | SuperAdmin | Gửi email kích hoạt tài khoản hàng loạt qua SMTP. |
| `POST` | `/api/Admin/notifications/broadcast` | SuperAdmin | Phát thông báo Broadcast tức thời đến toàn hệ thống. |
| `GET` | `/api/Admin/settings` | SuperAdmin | Lấy cấu hình hệ thống hiện tại. |
| `PUT` | `/api/Admin/settings` | SuperAdmin | Cập nhật cấu hình hệ thống. |

---

## 5. Nhóm API Cổng Giảng Viên (`/api/Lecturer`)

| Method | Endpoint | Quyền hạn | Mô tả |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/Lecturer/profile` | Lecturer | Thông tin hồ sơ giảng viên hiện tại. |
| `GET` | `/api/Lecturer/dashboard` | Lecturer | Số liệu thống kê sinh viên, tiến độ báo cáo tuần. |
| `GET` | `/api/Lecturer/students` | Lecturer | Danh sách sinh viên được phân công cho GVHD. |
| `GET` | `/api/Lecturer/students/{id}` | Lecturer | Chi tiết hồ sơ thực tập của sinh viên. |
| `GET` | `/api/Lecturer/weekly-reports` | Lecturer | Danh sách báo cáo tuần của nhóm sinh viên phụ trách. |
| `GET` | `/api/Lecturer/weekly-reports/{id}`| Lecturer | Chi tiết 1 báo cáo tuần. |
| `POST` | `/api/Lecturer/weekly-reports/{id}/review` | Lecturer | Phê duyệt (`Approved`) hoặc từ chối (`Rejected`) báo cáo tuần. |
| `GET` | `/api/Lecturer/evaluations` | Lecturer | Danh sách bảng điểm đánh giá của toàn bộ SV phụ trách. |
| `GET` | `/api/Lecturer/evaluations/{internshipId}` | Lecturer | Chi tiết bảng điểm Rubric của 1 sinh viên. |
| `POST` | `/api/Lecturer/evaluations` | Lecturer | Lưu điểm tạm thời hoặc chấm điểm Rubric 4 tiêu chí. |
| `POST` | `/api/Lecturer/evaluations/{id}/finalize` | Lecturer | Khóa điểm chính thức (`IsFinalized = true`). |
| `GET` | `/api/Lecturer/export/end-of-term` | Lecturer | **Xuất file Excel (.xlsx)** bảng điểm tổng hợp cuối kỳ. |
| `GET` | `/api/Lecturer/export/end-of-term/pdf` | Lecturer | **Xuất file PDF** Báo cáo tổng hợp cuối kỳ chuẩn Bộ GD&ĐT. |
| `GET` | `/api/Lecturer/export/evaluation/{internshipId}/pdf` | Lecturer | **Xuất file PDF** Phiếu đánh giá cá nhân của sinh viên. |

---

## 6. Nhóm API Cổng Sinh Viên (`/api/StudentPortal`)

| Method | Endpoint | Quyền hạn | Mô tả |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/StudentPortal/me` | Student | Thông tin cá nhân của sinh viên. |
| `GET` | `/api/StudentPortal/internship` | Student | Thông tin đợt thực tập, GVHD phụ trách và doanh nghiệp. |
| `PUT` | `/api/StudentPortal/internship/company` | Student | Cập nhật thông tin doanh nghiệp & Mentor thực tập. |
| `GET` | `/api/StudentPortal/weekly-reports` | Student | Danh sách nhật ký 12 tuần của chính sinh viên. |
| `POST` | `/api/StudentPortal/weekly-reports` | Student | Nộp báo cáo tuần mới kèm tệp minh chứng. |
| `PUT` | `/api/StudentPortal/weekly-reports/{id}` | Student | Chỉnh sửa nội dung báo cáo tuần khi GVHD yêu cầu sửa. |
| `GET` | `/api/StudentPortal/submissions` | Student | Danh sách các phiên bản bài nộp đồ án cuối kỳ. |
| `POST` | `/api/StudentPortal/submissions` | Student | Nộp phiên bản đồ án / báo cáo tốt nghiệp mới. |
| `GET` | `/api/StudentPortal/evaluation` | Student | Xem kết quả đánh giá, điểm số và nhận xét từ GVHD. |
| `GET` | `/api/StudentPortal/documents` | Student | Tải danh mục biểu mẫu và hướng dẫn thực tập. |

---

## 7. Nhóm API Quản Lý Tài Liệu (`/api/Document`)

| Method | Endpoint | Quyền hạn | Mô tả |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/Document` | Authenticated | Danh sách tài liệu biểu mẫu. |
| `GET` | `/api/Document/{id}/download` | Authenticated | Tải file nhị phân đính kèm. |
| `POST` | `/api/Document/upload` | Authenticated | Upload tài liệu đính kèm (multipart/form-data). |
| `DELETE` | `/api/Document/{id}` | Authenticated | Xóa tài liệu do mình tải lên. |

---

## 8. Kết Nối Real-Time SignalR Hub (`/hubs/notifications`)

- **URL Hub**: `ws://localhost:7109/hubs/notifications` (kèm `access_token` query string).
- **Client Listeners**:
  - `ReceiveNotification(NotificationDto notification)`: Nhận thông báo tức thời khi có báo cáo tuần được duyệt hoặc có thông báo Broadcast từ Khoa.
