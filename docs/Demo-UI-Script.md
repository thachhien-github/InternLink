# InternLink — Kịch Bản Demo & Thuyết Trình Báo Cáo (Demo UI Script)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Thời lượng báo cáo:** 15 – 20 phút  
**Giao diện Web:** `http://localhost:5173`  
**RESTful API Backend:** `http://localhost:7109` (Swagger UI: `http://localhost:7109/swagger`)

---

## 🔑 Bảng Tài Khoản Kiểm Thử (Seed Accounts)

| Phân Hệ (Portal) | Tên Đăng Nhập | Mật Khẩu Khởi Tạo | Vai Trò Demo |
| :--- | :--- | :--- | :--- |
| **Quản trị Khoa (SuperAdmin)** | `admin` | `Admin123!` | Quản lý học kỳ, import Excel, phân công, gửi mail |
| **Giảng viên (Lecturer)** | `gv001` | `Password123!` | Duyệt báo cáo tuần, chấm điểm Rubric, xuất PDF |
| **Sinh viên (Student)** | `sv001` | `Password123!` | Cập nhật công ty, nộp nhật ký 12 tuần, xem điểm |

---

## 🎬 Kịch Bản Demo 4 Hồi Chi Tiết

### MỞ ĐẦU (1 phút): Giới thiệu Vấn đề & Mục tiêu Dự án
> *"Kính thưa Hội đồng, InternLink là nền tảng số hóa 100% quy trình thực tập tốt nghiệp của Khoa CNTT, giải quyết triệt để sự phân tán dữ liệu giữa Excel, Email và Zalo. Hôm nay nhóm xin phép demo hệ thống chạy thực tế với Backend ASP.NET Core 10, CSDL SQL Server và Frontend React SPA."*

---

### HỒI 1: Quản trị Khoa (SuperAdmin Portal) — 4 phút
**Đăng nhập tài khoản:** `admin` / `Admin123!`

1. **Dashboard Quản trị (`/admin/dashboard`)**:
   - Thuyết minh: Tổng quan số lượng sinh viên, giảng viên hướng dẫn, doanh nghiệp đối tác và tiến độ theo học kỳ.
2. **Quản lý Học kỳ (`/admin/semesters`)**:
   - Xem danh sách học kỳ, bật học kỳ hiện tại (`IsCurrent = true`).
3. **Import Dữ liệu từ Excel (`/admin/students` & `/admin/lecturers`)**:
   - Tải file Excel mẫu. Tải file danh sách sinh viên lên hệ thống.
   - Hệ thống tự động tạo tài khoản và sinh mật khẩu ngẫu nhiên an toàn.
4. **Phân công Hướng dẫn (`/admin/assignments`)**:
   - Gán danh sách sinh viên cho Giảng viên hướng dẫn `gv001`.
5. **Gửi Email Thư mời Tự động (`/admin/email`)**:
   - Bấm nút "Gửi Email Kích hoạt". Hệ thống gửi email tài khoản cho sinh viên qua SMTP.
6. **Đăng xuất (Logout).**

---

### HỒI 2: Sinh viên Thực tập (Student Portal) — 4 phút
**Đăng nhập tài khoản:** `sv001` / `Password123!`

1. **Thông tin Thực tập (`/student/internship`)**:
   - Sinh viên xem thông tin GVHD được Khoa phân công (`ThS. Nguyễn Văn Phước`).
   - Cập nhật thông tin công ty thực tập (VD: `FPT Software`, vị trí `Frontend Developer Intern`, thông tin Mentor).
2. **Nhật ký 12 Tuần (`/student/weekly-reports`)**:
   - Nộp báo cáo tiến độ Tuần 3: Nhập công việc đã làm, kế hoạch tuần tới, đính kèm file tài liệu.
3. **Nộp Báo cáo / Đồ án Cuối kỳ (`/student/submissions`)**:
   - Nộp file Báo cáo thực tập tốt nghiệp phiên bản `v1.0`.
4. **Biểu mẫu & Hướng dẫn (`/student/templates`)**:
   - Tải các mẫu đơn, phiếu tiếp nhận do Khoa ban hành.
5. **Đăng xuất (Logout).**

---

### HỒI 3: Giảng viên Hướng dẫn (Lecturer Portal) — 5 phút
**Đăng nhập tài khoản:** `gv001` / `Password123!`

1. **Dashboard GVHD (`/lecturer/dashboard`)**:
   - Xem tổng quan các đầu việc cần xử lý: số báo cáo tuần mới nộp, số sinh viên cần chấm điểm.
2. **Duyệt Báo cáo Tuần (`/lecturer/reports`)**:
   - Xem nội dung báo cáo Tuần 3 của sinh viên `sv001`.
   - Viết nhận xét và bấm **"Phê duyệt (Approved)"**.
3. **Chấm điểm theo Rubric 4 Tiêu chí (`/lecturer/evaluations`)**:
   - Mở phiếu chấm điểm của sinh viên `sv001`.
   - Nhập điểm: Chuyên môn (9.0), Thái độ (9.5), Kỹ năng mềm (9.0), Báo cáo (9.0).
   - Hệ thống tự động tính điểm tổng kết **9.1 (Xuất sắc)**.
   - Nhập nhận xét tổng kết và bấm **"Lưu & Chốt điểm"**.
4. **Xuất Báo cáo & Bảng điểm (`/lecturer/export`)**:
   - **Xuất Bảng Điểm Excel (.xlsx)**: Bấm tải về bảng điểm 15 cột phục vụ nhập điểm vào hệ thống Đào tạo.
   - **Xuất Báo Cáo PDF Server-side**: Bấm tải file PDF Bảng tổng hợp cuối kỳ chuẩn Bộ GD&ĐT (được sinh trực tiếp từ Backend).
5. **Đăng xuất (Logout).**

---

### HỒI 4: Sinh viên Xem Kết Quả (Student Portal) — 1 phút
**Đăng nhập lại tài khoản:** `sv001` / `Password123!`

1. **Xem Kết quả Đánh giá (`/student/evaluation`)**:
   - Sinh viên nhận thông báo Real-time điểm số đã được chốt.
   - Xem chi tiết điểm 4 tiêu chí Rubric, xếp loại **Xuất sắc** và lời nhận xét của Giảng viên.

---

### KẾT LUẬN & TRẢ LỜI CÂU HỎI HỘI ĐỒNG (2 phút)
- Nhấn mạnh tính toàn vẹn của hệ thống: 100% dữ liệu đồng bộ REST API, lưu trữ Local Docker an toàn (0đ chi phí Cloud), sinh PDF Server-side chuẩn mực và sẵn sàng triển khai thực tế.
