# Software Requirements Specification (SRS)

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.0

**Status:** Draft

---

# 1. Introduction

## 1.1 Purpose

Tài liệu này mô tả các yêu cầu chức năng và phi chức năng của hệ thống InternLink.

Đây là cơ sở để phân tích, thiết kế, phát triển và kiểm thử hệ thống.

---

## 1.2 Scope

InternLink là nền tảng web hỗ trợ giảng viên quản lý và tương tác với sinh viên trong quá trình hướng dẫn thực tập.

Phiên bản MVP tập trung vào ba bài toán chính:

- Quản lý tiến độ thực tập
- Quản lý nộp bài và phản hồi
- Quản lý doanh nghiệp

---

## 1.3 Intended Users

- Giảng viên hướng dẫn
- Sinh viên

---

# 2. Functional Requirements

## FR-01 Authentication

### FR-01.1

Người dùng đăng nhập bằng tài khoản được cấp.

### FR-01.2

Hệ thống phân quyền theo vai trò.

- Lecturer
- Student

---

## FR-02 Student Management

### FR-02.1

Giảng viên xem danh sách sinh viên được phân công.

### FR-02.2

Xem hồ sơ sinh viên.

Bao gồm

- MSSV
- Họ tên
- Lớp
- Ngành
- Email
- SĐT

### FR-02.3

Xem trạng thái thực tập của từng sinh viên.

---

## FR-03 Internship Progress

### FR-03.1

Giảng viên theo dõi tiến độ của từng sinh viên.

### FR-03.2

Sinh viên cập nhật nhật ký thực tập.

### FR-03.3

Sinh viên gửi báo cáo tiến độ theo tuần.

### FR-03.4

Hệ thống hiển thị trạng thái.

- Chưa bắt đầu
- Đang thực hiện
- Chậm tiến độ
- Chờ phản hồi
- Cần chỉnh sửa
- Hoàn thành
- Đã chấm điểm

---

## FR-04 Submission Management

### FR-04.1

Sinh viên nộp báo cáo.

### FR-04.2

Sinh viên nộp sản phẩm.

### FR-04.3

Hệ thống lưu lịch sử các lần nộp.

### FR-04.4

Giảng viên xem từng phiên bản.

---

## FR-05 Feedback

### FR-05.1

Giảng viên nhận xét từng lần nộp.

### FR-05.2

Sinh viên xem phản hồi.

### FR-05.3

Sinh viên nộp lại sau khi chỉnh sửa.

---

## FR-06 Company Management

### FR-06.1

Giảng viên quản lý doanh nghiệp.

### FR-06.2

Lưu thông tin doanh nghiệp.

- Tên
- Địa chỉ
- Website
- Lĩnh vực
- Người liên hệ
- Email
- Điện thoại

### FR-06.3

Lưu các vị trí thực tập.

### FR-06.4

Lưu ngành phù hợp.

### FR-06.5

Lưu số lượng tiếp nhận.

### FR-06.6

Theo dõi lịch sử sinh viên đã thực tập.

### FR-06.7

Đánh giá mức độ hợp tác.

---

## FR-07 Document Library

### FR-07.1

Giảng viên upload biểu mẫu.

### FR-07.2

Sinh viên tải biểu mẫu.

### FR-07.3

Phân loại tài liệu.

Ví dụ

- Nhật ký
- Báo cáo
- Quy định
- Biểu mẫu

---

## FR-08 Evaluation

### FR-08.1

Giảng viên nhập điểm.

### FR-08.2

Lưu nhận xét.

### FR-08.3

Lưu đánh giá doanh nghiệp.

### FR-08.4

Tổng hợp điểm cuối kỳ.

---

## FR-09 Dashboard

### FR-09.1

Hiển thị tổng số sinh viên.

### FR-09.2

Hiển thị số sinh viên đang thực tập.

### FR-09.3

Hiển thị sinh viên chậm tiến độ.

### FR-09.4

Hiển thị deadline sắp tới.

---

## FR-10 Notification

### FR-10.1

Thông báo khi có phản hồi mới.

### FR-10.2

Thông báo khi gần đến hạn.

### FR-10.3

Thông báo khi quá hạn.

---

# 3. Non-Functional Requirements

## NFR-01 Performance

Thời gian phản hồi dưới 3 giây với các thao tác thông thường.

---

## NFR-02 Security

- JWT Authentication
- Role-based Authorization
- Mã hóa mật khẩu

---

## NFR-03 Availability

Hệ thống hoạt động ổn định trong thời gian thực tập.

---

## NFR-04 Usability

Giao diện đơn giản, dễ sử dụng đối với giảng viên và sinh viên.

---

## NFR-05 Maintainability

Mã nguồn được tổ chức theo kiến trúc nhiều lớp và dễ mở rộng.

---

# 4. Business Rules

## BR-01

Một sinh viên chỉ thuộc một giảng viên hướng dẫn trong một đợt thực tập.

---

## BR-02

Một doanh nghiệp có thể tiếp nhận nhiều sinh viên.

---

## BR-03

Một sinh viên có nhiều lần nộp báo cáo.

---

## BR-04

Mỗi lần nộp có thể nhận nhiều phản hồi.

---

## BR-05

Chỉ giảng viên mới được chấm điểm.

---

## BR-06

Sinh viên chỉ xem được dữ liệu của chính mình.

---

## BR-07

Biểu mẫu do giảng viên công bố sẽ hiển thị cho toàn bộ sinh viên thuộc đợt thực tập.

---

# 5. Assumptions

- Tài khoản được nhà trường hoặc giảng viên cấp.
- Sinh viên đã có doanh nghiệp thực tập.
- Hệ thống không thay thế hệ thống quản lý đào tạo của nhà trường.

---

# 6. Constraints

- Phát triển dưới dạng Web Application.
- Backend sử dụng ASP.NET Core Web API.
- Frontend sử dụng ReactJS.
- Database sử dụng Microsoft SQL Server.
- Áp dụng JWT Authentication.

---

# 7. Future Enhancements

Các chức năng ngoài phạm vi MVP:

- AI gợi ý doanh nghiệp phù hợp.
- AI phân tích tiến độ thực tập.
- AI hỗ trợ đánh giá báo cáo.
- Dashboard phân tích dữ liệu nâng cao.
- Tích hợp Email và Zalo.
- Đồng bộ hệ thống quản lý đào tạo.