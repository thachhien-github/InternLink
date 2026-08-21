# InternLink — Đặc Tả Yêu Cầu Phần Mềm (Software Requirements Specification - SRS)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0  
**Ngày cập nhật:** Tháng 8/2026

---

## 1. Giới thiệu (Introduction)

Tài liệu này đặc tả chi tiết toàn bộ các yêu cầu chức năng (Functional Requirements) và phi chức năng (Non-Functional Requirements) của hệ thống InternLink, phục vụ công tác phát triển, kiểm thử, đánh giá nghiệm thu và báo cáo đồ án tốt nghiệp.

---

## 2. Các Tác nhân Trong Hệ Thống (Actors)

1. **SuperAdmin (Quản trị viên Khoa / Ban Đào tạo)**: Người có quyền cao nhất, quản trị toàn bộ học kỳ, danh mục người dùng, phân công giảng viên - sinh viên và cài đặt hệ thống.
2. **Lecturer (Giảng viên hướng dẫn - GVHD)**: Người trực tiếp quản lý, hướng dẫn, duyệt báo cáo tuần, chấm điểm và đánh giá kết quả thực tập của nhóm sinh viên được phân công.
3. **Student (Sinh viên thực tập)**: Người tham gia đợt thực tập, đăng ký thông tin doanh nghiệp, nộp nhật ký 12 tuần, nộp báo cáo tốt nghiệp và theo dõi phản hồi.
4. **System (Hệ thống ngầm)**: Các service nền xử lý gửi Email tự động (SMTP), phát tín hiệu thông báo thời gian thực (SignalR), tính toán điểm số và tạo file PDF nhị phân.

---

## 3. Yêu Cầu Chức Năng (Functional Requirements - FR)

### 3.1. Phân hệ Quản trị & Xác thực Chung (Authentication & Profile)

| Mã YC | Tên Chức Năng | Mô Tả Chi Tiết |
| :--- | :--- | :--- |
| **FR-AUTH-01** | Đăng nhập hệ thống | Xác thực tài khoản qua Username/Password, trả về JWT Access Token (hạn 60 phút) và Refresh Token. |
| **FR-AUTH-02** | Phân quyền vai trò (RBAC) | Phân quyền truy cập tài nguyên nghiêm ngặt: `SuperAdmin`, `Lecturer`, `Student`. |
| **FR-AUTH-03** | Đổi mật khẩu lần đầu | Bắt buộc đổi mật khẩu khi đăng nhập lần đầu với tài khoản mới được Admin cấp (`MustChangePassword = true`). |
| **FR-AUTH-04** | Quên mật khẩu & Reset Token | Tạo token khôi phục mật khẩu có thời hạn (15 phút), gửi liên kết xác nhận qua Email. |
| **FR-AUTH-05** | Thông tin cá nhân (Profile) | Xem và cập nhật số điện thoại, email liên hệ, ảnh đại diện và thông tin học vấn/chuyên môn. |

---

### 3.2. Phân hệ Quản trị Khoa (SuperAdmin Module)

| Mã YC | Tên Chức Năng | Mô Tả Chi Tiết |
| :--- | :--- | :--- |
| **FR-ADM-01** | Quản lý Học kỳ (Semesters) | Thêm, sửa, đóng học kỳ, thiết lập 1 học kỳ làm hiện tại (`IsCurrent`), xem thống kê sinh viên từng kỳ. |
| **FR-ADM-02** | Quản lý Tài khoản (User Management) | Danh sách người dùng, kích hoạt/khóa tài khoản, đặt lại mật khẩu về mặc định, cấp quyền Admin. |
| **FR-ADM-03** | Import Sinh viên & GV từ Excel | Tải file Excel mẫu, import danh sách hàng loạt, tự động sinh mã định danh và tài khoản đăng nhập. |
| **FR-ADM-04** | Phân công Hướng dẫn (Assignments) | Phân công 1 hoặc nhiều sinh viên cho GVHD theo học kỳ, tự động khởi tạo bản ghi `Internship`. |
| **FR-ADM-05** | Gửi Email Kích hoạt Hàng loạt | Gửi thư mời chứa tài khoản và mật khẩu khởi tạo cho toàn bộ SV/GV mới được import qua Gmail SMTP. |
| **FR-ADM-06** | Quản lý Doanh nghiệp (Companies) | Quản lý danh mục đối tác thực tập, lĩnh vực hoạt động, người liên hệ và sức chứa tiếp nhận SV. |
| **FR-ADM-07** | Phát Thông báo Toàn hệ thống | Tạo và phát thông báo Broadcast tức thời đến toàn bộ người dùng qua SignalR Core Hub. |
| **FR-ADM-08** | Cấu hình Hệ thống (Settings) | Cấu hình thông tin trường, khoa, email SMTP, thời lượng thực tập tiêu chuẩn (12 tuần). |

---

### 3.3. Phân hệ Giảng viên Hướng dẫn (Lecturer Portal)

| Mã YC | Tên Chức Năng | Mô Tả Chi Tiết |
| :--- | :--- | :--- |
| **FR-LEC-01** | Dashboard Tổng quan GVHD | Thống kê số lượng SV phụ trách, tỷ lệ hoàn thành báo cáo, số báo cáo tuần chờ duyệt. |
| **FR-LEC-02** | Danh sách Sinh viên Hướng dẫn | Lọc theo lớp, ngành, trạng thái thực tập, tìm kiếm theo MSSV hoặc họ tên. |
| **FR-LEC-03** | Duyệt Nhật ký Thực tập Tuần | Xem báo cáo 12 tuần của sinh viên, xem file minh chứng, phê duyệt (`Approved`) hoặc yêu cầu sửa (`Rejected`). |
| **FR-LEC-04** | Đánh giá & Phản hồi Bài nộp | Xem đồ án cuối kỳ của sinh viên, viết nhận xét phản hồi (Feedback) và cập nhật trạng thái bài nộp. |
| **FR-LEC-05** | Chấm điểm Rubric Chuẩn 4 Tiêu chí | Chấm điểm theo trọng số: Kỹ thuật (40%), Thái độ (20%), Kỹ năng mềm (20%), Báo cáo cuối kỳ (20%). |
| **FR-LEC-06** | Chốt Điểm Cuối kỳ (Finalize) | Khóa điểm chính thức để ngăn chặn chỉnh sửa sau khi đã nộp điểm về Khoa. |
| **FR-LEC-07** | Xuất Bảng điểm Tổng hợp Excel | Xuất file `.xlsx` chứa đầy đủ 15 trường thông tin phục vụ nhập điểm vào hệ thống Đào tạo trường. |
| **FR-LEC-08** | Xuất Báo cáo PDF Server-Side | Xuất PDF Bảng tổng hợp đợt thực tập và Phiếu đánh giá cá nhân chuẩn mẫu Bộ GD&ĐT. |

---

### 3.4. Phân hệ Sinh viên Thực tập (Student Portal)

| Mã YC | Tên Chức Năng | Mô Tả Chi Tiết |
| :--- | :--- | :--- |
| **FR-STU-01** | Cổng Thông tin Thực tập Cá nhân | Xem thông tin học kỳ, GVHD phụ trách, hạn nộp các mốc thời gian quan trọng. |
| **FR-STU-02** | Đăng ký & Cập nhật Doanh nghiệp | Cập nhật thông tin công ty thực tập, địa chỉ, vị trí thực tập, tên và số điện thoại Mentor. |
| **FR-STU-03** | Nộp Nhật ký Tuần (Weekly Reports) | Nộp báo cáo công việc hàng tuần (Tuần 1 đến 12), đính kèm tệp minh chứng (.pdf, .docx, .png...). |
| **FR-STU-04** | Nộp Báo cáo Tốt nghiệp / Đồ án | Nộp bài báo cáo cuối kỳ, hỗ trợ cập nhật phiên bản mới khi GVHD yêu cầu chỉnh sửa. |
| **FR-STU-05** | Xem Nhận xét & Kết quả Đánh giá | Xem phản hồi của GVHD, xem bảng điểm Rubric chi tiết và xếp loại học lực khi GVHD chốt điểm. |
| **FR-STU-06** | Kho Tài liệu & Biểu mẫu Chuẩn | Tải các mẫu đơn đăng ký, phiếu nhận xét doanh nghiệp, mẫu bìa báo cáo do Khoa ban hành. |

---

## 4. Yêu Cầu Phi Chức Năng (Non-Functional Requirements - NFR)

### 4.1. Hiệu năng & Khả năng Đáp ứng (Performance)
- **NFR-PERF-01**: Thời gian phản hồi API trung bình dưới **300ms** cho các tác vụ truy vấn thông thường.
- **NFR-PERF-02**: Tác vụ xuất file Excel và sinh mã nhị phân PDF hoàn thành trong dưới **1.5 giây** cho danh sách 100 sinh viên.
- **NFR-PERF-03**: Hệ thống hỗ trợ xử lý mượt mà tối thiểu **200 người dùng đồng thời (Concurrent Users)**.

### 4.2. Bảo mật & Toàn vẹn Dữ liệu (Security)
- **NFR-SEC-01**: Mật khẩu người dùng được băm an toàn bằng giải thuật **PBKDF2** kèm muối ngẫu nhiên (Salt).
- **NFR-SEC-02**: Xác thực API qua **JWT Token** với chữ ký HMAC-SHA256 bí mật, tự động thu hồi khi Token hết hạn.
- **NFR-SEC-03**: Phân quyền truy cập tài liệu: Sinh viên chỉ được xem và tải file của chính mình; GVHD chỉ xem file của sinh viên mình phụ trách.
- **NFR-SEC-04**: Cơ chế **Soft Delete** (`IsDeleted`) bảo vệ dữ liệu lịch sử, không bao giờ xóa vật lý khỏi CSDL.

### 4.3. Độ tin cậy & Tính sẵn sàng (Reliability & Availability)
- **NFR-REL-01**: Độ sẵn sàng hệ thống đạt **99.5%**.
- **NFR-REL-02**: Tự động ghi log chi tiết các lỗi hệ thống (Logging Middleware) để phục vụ giám sát và khắc phục sự cố.
- **NFR-REL-03**: Dữ liệu tài liệu sinh viên được mount vào **Docker Persistent Named Volume**, đảm bảo không mất mát dữ liệu khi container khởi động lại.

### 4.4. Tính Tương thích & Giao diện (Usability & Compatibility)
- **NFR-UI-01**: Giao diện chuẩn **Responsive Design**, tương thích hoàn hảo trên Máy tính để bàn, Laptop và Máy tính bảng.
- **NFR-UI-02**: Hỗ trợ 100% tiếng Việt có dấu với bảng mã UTF-8 chuẩn.
