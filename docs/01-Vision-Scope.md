# InternLink — Tầm Nhìn & Phạm Vi Dự Án (Vision & Scope)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0 (Chuẩn Đồ Án Tốt Nghiệp / Nghiệm Thu)  
**Ngày cập nhật:** Tháng 8/2026  
**Trạng thái:** Hoàn thiện 100% (Production-Ready)

---

## 1. Giới thiệu Tổng quan (Executive Summary)

**InternLink** là nền tảng quản lý và giám sát thực tập tốt nghiệp toàn diện dành cho Khoa Công nghệ Thông tin, số hóa 100% quy trình kết nối giữa 3 chủ thể:
1. **Ban Quản trị Khoa / Quản trị viên (SuperAdmin)**: Quản lý học kỳ, danh mục công ty, import hàng loạt danh sách sinh viên & giảng viên bằng Excel, tự động phân công hướng dẫn và gửi email thư mời kích hoạt tài khoản.
2. **Giảng viên hướng dẫn (Lecturer)**: Theo dõi tiến độ sinh viên được phân công, duyệt báo cáo tuần (12 tuần), phản hồi đồ án/sản phẩm, chấm điểm theo chuẩn Rubric 4 tiêu chí và xuất báo cáo tổng hợp cuối kỳ (Excel & PDF Server-side).
3. **Sinh viên thực tập (Student)**: Cập nhật thông tin doanh nghiệp, nộp nhật ký tiến độ tuần kèm minh chứng, nộp đồ án tốt nghiệp nhiều phiên bản, tải biểu mẫu chuẩn và theo dõi kết quả đánh giá.

---

## 2. Bối cảnh & Vấn đề Thực tế (Problem Statement)

Trước khi có hệ thống InternLink, công tác tổ chức và quản lý thực tập tốt nghiệp tại các trường đại học gặp nhiều bất cập:

| Vấn đề thực tế (Pain Points) | Hậu quả | Giải pháp của InternLink |
| :--- | :--- | :--- |
| **P1. Dữ liệu phân tán** | Danh sách SV lưu trên Excel, nộp bài qua Email/Zalo, lưu trữ trên Google Drive cá nhân. | Tập trung toàn bộ Master Data, hồ sơ SV, GVHD và Doanh nghiệp vào CSDL SQL Server duy nhất. |
| **P2. Khó theo dõi tiến độ tuần** | GVHD không nắm được sinh viên nào đang thực tập đúng hạn, sinh viên nào nợ báo cáo. | Cung cấp cổng Dashboard tuần: SV nộp nhật ký 12 tuần, GVHD nhận thông báo real-time và phản hồi ngay. |
| **P3. Quản lý phiên bản nộp bài** | SV gửi nhiều file bài qua email gây thất lạc, khó phân biệt bản nháp và bản hoàn chỉnh. | Tích hợp hệ thống quản lý bài nộp (Submissions) đa phiên bản (v1, v2, v3), lưu trữ an toàn trên Local Volume. |
| **P4. Tổng hợp điểm cuối kỳ thủ công** | Mất từ 1-2 tuần để Khoa tổng hợp điểm từ phiếu giấy và file Excel của từng giảng viên. | Tự động tính điểm tổng kết theo trọng số Rubric và cung cấp chức năng xuất file Excel/PDF chuẩn Bộ GD&ĐT chỉ với 1 click. |
| **P5. Khởi tạo tài khoản & phân công nặng nề** | Nhập liệu thủ công hàng trăm tài khoản mỗi học kỳ rất dễ sai sót. | Hỗ trợ Import file Excel danh sách SV/GV, tự động tạo tài khoản, sinh mật khẩu ngẫu nhiên và gửi email kích hoạt tự động. |

---

## 3. Mục tiêu của Hệ thống (System Goals & Objectives)

- **G1. Tự động hóa 90% quy trình hành chính**: Giảm thiểu tối đa việc nhập liệu thủ công thông qua tính năng Import/Export Excel.
- **G2. Tăng cường tính tương tác 2 chiều (GVHD - Sinh viên)**: Tích hợp thông báo thời gian thực qua SignalR và Email thông báo khi có phản hồi mới.
- **G3. Đảm bảo tính minh bạch và chuẩn mực học thuật**: Toàn bộ điểm số được cấu trúc theo 4 tiêu chí Rubric rõ ràng (Chuyên môn, Thái độ, Kỹ năng mềm, Báo cáo cuối kỳ).
- **G4. Bảo mật dữ liệu & Độc lập chi phí (0đ Cloud)**: Hệ thống sử dụng Local Storage gắn Docker Volume, không phát sinh chi phí duy trì dịch vụ lưu trữ đám mây bên ngoài.

---

## 4. Phạm vi Sản phẩm (Product Scope)

### 4.1. Phân hệ SuperAdmin (Quản trị Khoa)
- **Quản lý Học kỳ (Semesters)**: Thiết lập học kỳ hiện tại (`IsCurrent`), quản lý ngày bắt đầu/kết thúc, xem thống kê theo từng đợt thực tập.
- **Quản lý Người dùng & Tài khoản (Users)**: CRUD tài khoản, kích hoạt/vô hiệu hóa, đặt lại mật khẩu, gửi email kích hoạt.
- **Import/Export Danh sách (Excel Engine)**: Tải file mẫu, import danh sách hàng trăm sinh viên/giảng viên, xử lý dữ liệu trùng lặp.
- **Phân công Hướng dẫn (Assignments)**: Phân công SV cho GVHD theo từng học kỳ, tự động tạo bản ghi Internship.
- **Quản lý Doanh nghiệp (Companies)**: Hồ sơ doanh nghiệp liên kết, lĩnh vực hoạt động, người liên hệ.
- **Thông báo Toàn hệ thống (Broadcast Notifications)**: Gửi thông báo đến toàn bộ SV hoặc GVHD qua SignalR.

### 4.2. Phân hệ Lecturer (Giảng viên hướng dẫn)
- **Tổng quan & Danh sách SV phụ trách**: Bộ lọc theo lớp, trạng thái thực tập, tiến độ nộp báo cáo.
- **Duyệt Báo cáo Tuần (Weekly Reports)**: Xem nhật ký công việc 12 tuần của SV, phê duyệt hoặc yêu cầu chỉnh sửa, chấm điểm tuần.
- **Đánh giá & Phản hồi Bài nộp (Submissions & Feedbacks)**: Nhận xét đồ án tốt nghiệp, yêu cầu nộp lại phiên bản mới.
- **Chấm điểm Rubric & Tổng kết**: Chấm điểm theo 4 tiêu chí chuẩn, chốt điểm cuối kỳ (`Finalize Evaluation`).
- **Xuất Báo cáo & Bảng điểm**: Xuất bảng tổng hợp Excel (.xlsx) và xuất Phiếu đánh giá / Báo cáo tổng hợp PDF Server-side.

### 4.3. Phân hệ Student (Sinh viên thực tập)
- **Cổng Thông tin Thực tập Cá nhân**: Xem thông tin GVHD được phân công, thông tin học kỳ và trạng thái thực tập.
- **Cập nhật Nơi thực tập**: Đăng ký thông tin công ty, vị trí thực tập, người hướng dẫn tại doanh nghiệp (Mentor).
- **Nhật ký Thực tập 12 Tuần**: Nộp báo cáo công việc hàng tuần, đính kèm file minh chứng.
- **Nộp Đồ án / Báo cáo Cuối kỳ**: Nộp tài liệu nhiều phiên bản, xem lịch sử nhận xét của giảng viên.
- **Tài liệu & Biểu mẫu**: Tải các mẫu đơn xin thực tập, phiếu tiếp nhận, hướng dẫn viết báo cáo do Khoa ban hành.

---

## 5. Giới hạn & Định hướng Phát triển Sau này (Future Roadmap)

- **Giai đoạn hiện tại (Hoàn thành)**: Toàn bộ nghiệp vụ lõi cho 50 - 500 sinh viên, lưu trữ Local Docker Volume an toàn 100% miễn phí.
- **Giai đoạn tiếp theo (Mở rộng quy mô toàn trường > 2.000 SV)**:
  - Tích hợp Cổng Doanh nghiệp (Enterprise Portal) để Mentor trực tiếp chấm điểm trên hệ thống.
  - Tích hợp Cloudflare R2 Storage (Zero Egress Fee) khi lưu trữ dữ liệu dung lượng lớn (> 100 GB).
  - Tích hợp Single Sign-On (SSO) với hệ thống Cổng thông tin Đào tạo của Nhà trường (OAuth2 / SAML).
