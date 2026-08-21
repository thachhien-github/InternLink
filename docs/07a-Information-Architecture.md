# InternLink — Kiến Trúc Thông Tin & Điều Hướng (Information Architecture - IA)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0  
**Ngày cập nhật:** Tháng 8/2026

---

## 1. Sơ Đồ Cấu Trúc Menu & Điều Hướng (Site Map)

Toàn bộ ứng dụng được tổ chức theo 3 Portal độc lập và các tuyến đường công khai:

```
INTERNLINK SYSTEM
│
├── [ KHU VỰC CÔNG KHAI / XÁC THỰC ]
│   ├── /login                     (Đăng nhập tài khoản)
│   ├── /forgot-password           (Yêu cầu cấp lại mật khẩu)
│   └── /reset-password            (Đặt lại mật khẩu mới)
│
├── [ CỔNG QUẢN TRỊ KHOA - /admin ]
│   ├── /admin/dashboard           (Tổng quan KPI, tiến độ học kỳ)
│   ├── /admin/semesters           (Quản lý học kỳ, kích hoạt học kỳ hiện tại)
│   ├── /admin/users               (Quản lý tài khoản người dùng, đổi mật khẩu)
│   ├── /admin/students            (Quản lý sinh viên, Import Excel danh sách)
│   ├── /admin/lecturers           (Quản lý GVHD, Import Excel danh sách)
│   ├── /admin/companies           (Danh mục doanh nghiệp thực tập đối tác)
│   ├── /admin/assignments         (Phân công hướng dẫn GVHD - Sinh viên)
│   ├── /admin/email               (Gửi email thư mời kích hoạt tài khoản)
│   ├── /admin/notifications       (Phát thông báo Broadcast toàn hệ thống)
│   └── /admin/settings            (Cấu hình hệ thống, thông tin Khoa)
│
├── [ CỔNG GIẢNG VIÊN HƯỚNG DẪN - /lecturer ]
│   ├── /lecturer/dashboard        (KPI sinh viên phụ trách, việc cần xử lý)
│   ├── /lecturer/students         (Danh sách sinh viên hướng dẫn, lọc theo lớp)
│   ├── /lecturer/reports          (Duyệt nhật ký 12 tuần & đồ án cuối kỳ)
│   ├── /lecturer/evaluations      (Chấm điểm Rubric 4 tiêu chí & chốt điểm)
│   ├── /lecturer/templates        (Quản lý & đăng tải biểu mẫu hướng dẫn)
│   ├── /lecturer/companies        (Xem danh bạ doanh nghiệp & mentor)
│   └── /lecturer/export           (Xuất bảng điểm Excel & Báo cáo PDF Server-side)
│
└── [ CỔNG SINH VIÊN THỰC TẬP - /student ]
    ├── /student/dashboard         (Tiến độ thực tập, mốc thời gian, thông báo)
    ├── /student/internship        (Thông tin GVHD, khai báo doanh nghiệp & mentor)
    ├── /student/weekly-reports    (Nộp nhật ký thực tập hàng tuần 1-12)
    ├── /student/submissions       (Nộp báo cáo cuối kỳ, đồ án tốt nghiệp)
    ├── /student/evaluation        (Xem kết quả đánh giá, bảng điểm Rubric)
    └── /student/templates         (Tải biểu mẫu, phiếu tiếp nhận, bìa báo cáo)
```

---

## 2. Nguyên Tắc Điều Hướng & Bảo Vệ Tuyến Đường (Route Guards)

1. **Role-Based Redirection**:
   - Khi đăng nhập thành công, hệ thống tự động nhận diện `Role` của người dùng để điều hướng:
     - `SuperAdmin` $\rightarrow$ `/admin/dashboard`
     - `Lecturer` $\rightarrow$ `/lecturer/dashboard`
     - `Student` $\rightarrow$ `/student/dashboard`
2. **First-Login Password Change Guard**:
   - Nếu tài khoản có cờ `MustChangePassword = true`, hệ thống sẽ chặn tất cả các route khác và hiển thị Modal bắt buộc đổi mật khẩu mới.
3. **Route Guards**:
   - Bất kỳ truy cập trái quyền (VD: Sinh viên cố tình vào `/admin/*`) đều bị chuyển hướng về trang `/unauthorized` hoặc trang chủ của vai trò đó.
