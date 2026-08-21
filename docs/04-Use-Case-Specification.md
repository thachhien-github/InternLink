# InternLink — Đặc Tả Use Cases Chi Tiết (Use Case Specification)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0  
**Ngày cập nhật:** Tháng 8/2026

---

## 1. Sơ Đồ Tổng Quan Use Case (Use Case Overview)

Hệ thống bao gồm 3 Tác nhân chính (Actors) với các nhóm Use Case tương ứng:

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 HỆ THỐNG INTERNLINK                    │
                  ├────────────────────────────────────────────────────────┤
                  │ [UC-ADM-01] Quản lý Học kỳ thực tập                    │
                  │ [UC-ADM-02] Quản lý Người dùng & Phân quyền            │
   [ SuperAdmin ] ┤ [UC-ADM-03] Import Excel Sinh viên / Giảng viên        │
                  │ [UC-ADM-04] Phân công GVHD cho Sinh viên               │
                  │ [UC-ADM-05] Gửi Email Kích hoạt tài khoản hàng loạt    │
                  │ [UC-ADM-06] Phát Thông báo Toàn hệ thống (Broadcast)   │
                  ├────────────────────────────────────────────────────────┤
                  │ [UC-LEC-01] Quản lý & Lọc danh sách SV phụ trách       │
                  │ [UC-LEC-02] Duyệt & Nhận xét Báo cáo tuần (12 tuần)    │
   [ Lecturer ] ──┤ [UC-LEC-03] Đánh giá Đồ án / Báo cáo cuối kỳ           │
                  │ [UC-LEC-04] Chấm điểm Rubric 4 tiêu chí & Chốt điểm    │
                  │ [UC-LEC-05] Xuất Báo cáo tổng hợp Excel & PDF          │
                  ├────────────────────────────────────────────────────────┤
                  │ [UC-STU-01] Cập nhật Thông tin Doanh nghiệp thực tập   │
                  │ [UC-STU-02] Nộp Báo cáo Nhật ký hàng tuần (Tuần 1-12)  │
   [ Student ] ───┤ [UC-STU-03] Nộp Báo cáo / Đồ án tốt nghiệp             │
                  │ [UC-STU-04] Xem Nhận xét, Điểm số & Xếp loại           │
                  │ [UC-STU-05] Tải Biểu mẫu & Tài liệu hướng dẫn          │
                  └────────────────────────────────────────────────────────┘
```

---

## 2. Đặc Tả Chi Tiết Các Use Cases Trọng Tâm

### 2.1. UC-ADM-03: Import Sinh Viên & Giảng Viên Bằng Excel

- **Tác nhân chính**: SuperAdmin
- **Mục đích**: Nhập danh sách hàng trăm sinh viên/giảng viên cùng lúc từ file Excel của Phòng Đào tạo vào CSDL.
- **Tiền điều kiện**: Admin đã đăng nhập với quyền `SuperAdmin` và có file Excel theo đúng cấu trúc mẫu.
- **Luồng sự kiện chính (Main Flow)**:
  1. Admin chọn mục "Quản lý Sinh viên" hoặc "Quản lý Giảng viên".
  2. Bấm "Tải file mẫu Excel" nếu chưa có template chuẩn.
  3. Chọn file Excel từ máy tính và bấm "Tải lên & Xử lý".
  4. Backend (sử dụng ClosedXML) đọc dữ liệu, kiểm tra tính hợp lệ của từng dòng:
     - Kiểm tra MSSV / Mã GV bắt buộc.
     - Kiểm tra định dạng Email.
     - Kiểm tra trùng lặp với CSDL hiện có.
  5. Hệ thống tạo tài khoản User tương ứng với mật khẩu ngẫu nhiên an toàn.
  6. Trả về kết quả: Tổng số dòng import thành công, danh sách các dòng bị lỗi (nếu có).
- **Luồng phụ / Ngoại lệ (Alternative Flow)**:
  - Nếu file sai định dạng hoặc không có dữ liệu: Hệ thống báo lỗi và giữ nguyên CSDL.

---

### 2.2. UC-ADM-05: Gửi Email Thư Mời & Kích Hoạt Tài Khoản Hàng Loạt

- **Tác nhân chính**: SuperAdmin
- **Mục đích**: Gửi thư mời tham gia hệ thống kèm tài khoản, mật khẩu khởi tạo cho toàn bộ người dùng mới.
- **Tiền điều kiện**: Đã cấu hình thông tin SMTP Email trong hệ thống.
- **Luồng sự kiện chính (Main Flow)**:
  1. Admin bấm nút "Gửi Email Kích hoạt".
  2. Hệ thống lọc danh sách người dùng mới được tạo chưa kích hoạt.
  3. Với mỗi người dùng:
     - Tạo nội dung email cá nhân hóa (xưng hô theo vai trò: Thầy/Cô hoặc Bạn sinh viên).
     - Đính kèm URL hệ thống, Tên đăng nhập và Mật khẩu tạm thời.
     - Gửi email qua SMTP Service.
  4. Hệ thống cập nhật trạng thái đã gửi thư mời và hiển thị thông báo thành công cho Admin.

---

### 2.3. UC-LEC-02: Duyệt & Nhận Xét Báo Cáo Tuần (Weekly Reports)

- **Tác nhân chính**: Lecturer (GVHD)
- **Mục đích**: Kiểm tra tiến độ thực tập hàng tuần của sinh viên và đưa ra phản hồi kịp thời.
- **Tiền điều kiện**: GVHD đã đăng nhập và được phân công sinh viên trong học kỳ hiện tại.
- **Luồng sự kiện chính (Main Flow)**:
  1. GVHD chọn sinh viên từ danh sách hướng dẫn.
  2. Xem danh sách 12 tuần: tuần nào đã nộp, tuần nào đang chờ duyệt, tuần nào quá hạn.
  3. Chọn tuần cần duyệt: xem nội dung công việc, kế hoạch và tải file minh chứng.
  4. Nhập nhận xét góp ý và chọn hành động:
     - **Duyệt (`Approved`)**: Đánh dấu hoàn thành tuần, nhập điểm tuần nếu cần.
     - **Yêu cầu sửa (`Rejected`)**: Yêu cầu sinh viên bổ sung tài liệu.
  5. Hệ thống lưu kết quả và gửi thông báo Real-time cho sinh viên qua SignalR.

---

### 2.4. UC-LEC-04: Chấm Điểm Rubric 4 Tiêu Chí & Chốt Điểm

- **Tác nhân chính**: Lecturer (GVHD)
- **Mục đích**: Đánh giá kết quả toàn diện của sinh viên theo chuẩn đầu ra của Khoa.
- **Tiền điều kiện**: Sinh viên đã hoàn thành đợt thực tập và nộp báo cáo cuối kỳ.
- **Luồng sự kiện chính (Main Flow)**:
  1. GVHD mở giao diện "Đánh giá & Chấm điểm".
  2. Nhập điểm theo thang điểm 10 cho 4 tiêu chí:
     - Kiến thức chuyên môn (40%).
     - Thái độ & Kỷ luật (20%).
     - Kỹ năng mềm & Giao tiếp (20%).
     - Báo cáo cuối kỳ (20%).
  3. Hệ thống tự động tính điểm trung bình tổng kết và tự động quy đổi xếp loại:
     - `≥ 9.0`: Xuất sắc
     - `8.0 - 8.9`: Giỏi
     - `6.5 - 7.9`: Khá
     - `5.0 - 6.4`: Trung bình
     - `< 5.0`: Không đạt
  4. GVHD nhập nhận xét tổng kết và nhấn "Lưu & Chốt điểm" (`Finalize`).
  5. Hệ thống khóa bản ghi điểm, cập nhật trạng thái thực tập sang `Completed`.

---

### 2.5. UC-LEC-05: Xuất Báo Cáo Tổng Hợp Excel & PDF Server-Side

- **Tác nhân chính**: Lecturer (GVHD)
- **Mục đích**: Xuất bảng điểm chính thức và phiếu đánh giá phục vụ lưu trữ học vụ và nộp về Khoa.
- **Tiền điều kiện**: Đã có dữ liệu đánh giá sinh viên.
- **Luồng sự kiện chính (Main Flow)**:
  1. GVHD vào màn hình "Export cuối kỳ".
  2. Tùy chọn định dạng xuất:
     - **Xuất Bảng Điểm (.xlsx)**: Gọi `GET /api/Lecturer/export/end-of-term` tải về bảng tổng hợp điểm 15 cột.
     - **Xuất Báo Cáo PDF Server-Side**: Gọi `GET /api/Lecturer/export/end-of-term/pdf` tải về bảng tổng hợp A4 có Quốc hiệu và khung chữ ký.
     - **Xuất Phiếu Đánh Giá Cá Nhân PDF**: Gọi `GET /api/Lecturer/export/evaluation/{internshipId}/pdf` tải phiếu Rubric cá nhân của từng sinh viên.
  3. Tệp tin được tải trực tiếp về máy tính người dùng.
