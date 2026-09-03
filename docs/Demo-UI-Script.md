# InternLink — Kịch Bản Demo & Thuyết Trình Báo Cáo (Demo UI Script)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 4.0  
**Thời lượng báo cáo:** 15 – 20 phút  
**Frontend:** `http://localhost:5173` (React 19 + Vite)  
**Backend API:** `http://localhost:7109` (ASP.NET Core 8)  
**Swagger:** `http://localhost:7109/swagger`

---

## 🔑 Tài Khoản Demo

| Portal | Username | Password | Vai trò |
|:---|:---|:---|:---|
| **Admin** | `admin` | `Admin123!` | Quản lý học kỳ, import, phân công |
| **Lecturer** | `gv001` | `Password123!` | Duyệt báo cáo, chấm điểm, xuất PDF |
| **Student** | `sv001` | `Password123!` | Nộp báo cáo, xem điểm, tải PDF |

---

## 🎬 Kịch Bản Demo 4 Hồi

### MỞ ĐẦU (1 phút): Giới thiệu

> *"InternLink là nền tảng số hóa 100% quy trình thực tập tốt nghiệp, Backend ASP.NET Core 8 Clean Architecture, Frontend React 19 + Tailwind 4, CSDL SQL Server 2022. Hệ thống có 25 API Controllers, 18 bảng dữ liệu, phân quyền JWT chuẩn RBAC."*

---

### HỒI 1: Admin Portal — 4 phút

**Login:** `admin` / `Admin123!`

1. **Dashboard** (`/admin/dashboard`): Thống kê KPI, Charts, Action items
2. **Quản lý Học kỳ** (`/admin/semesters`): Tạo học kỳ, xem rubric editor
3. **Account Requests** (`/admin/account-requests`): Duyệt yêu cầu tài khoản, cấp phát tự động
4. **Phân công** (`/admin/assignments`): Auto-assign, Bulk assign
5. **Notifications** (`/admin/notifications`): Broadcast thông báo toàn hệ thống
6. **Logout**

---

### HỒI 2: Student Portal — 4 phút

**Login:** `sv001` / `Password123!`

1. **Dashboard** (`/student/dashboard`): Tiến độ, Tasks, Feedback mới
2. **Kỳ thực tập** (`/student/internship`): Timeline, Weekly Plan, thông tin DN/GV
3. **Báo cáo tuần** (`/student/weekly-reports`): Nộp báo cáo Tuần 3
4. **Bài nộp** (`/student/submissions`): Nộp đồ án v1.0
5. **Phản hồi** (`/student/feedback`): Reply feedback từ GV (Student Reply)
6. **Tải PDF** (`/student/internship`): Bấm "Xuất phiếu" → Tải PDF chứng nhận
7. **Logout**

---

### HỒI 3: Lecturer Portal — 5 phút

**Login:** `gv001` / `Password123!`

1. **Dashboard** (`/lecturer/dashboard`): KPI, Action items, Weekly trends
2. **Students** (`/lecturer/students`):
   - Lưu ghi chú SV (Notes API)
   - Bulk Notify SV (Lecturer-scoped notification)
   - Bulk Export Excel
3. **Reports** (`/lecturer/reports`): Duyệt báo cáo tuần + Comment
4. **Evaluations** (`/lecturer/evaluations`): Chấm điểm Rubric → Finalize
5. **Export** (`/lecturer/export`): Xuất Excel + PDF
6. **Logout**

---

### HỒI 4: Student Xem Kết Quả — 1 phút

**Login:** `sv001` / `Password123!`

1. **Đánh giá** (`/student/evaluation`): Xem điểm 4 tiêu chí, xếp loại Xuất sắc
2. **Thông báo** (`/student/notifications`): Real-time notification qua SignalR

---

### KẾT LUẬN (2 phút)

Nhấn mạnh:
- 100% dữ liệu lưu DB thật, không có "toast ảo"
- Build sạch: 0 TypeScript errors, 0 C# errors
- Docker deployment sẵn sàng
- Local Storage miễn phí (0đ Cloud)
