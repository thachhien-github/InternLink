# Use Case Specification

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.0

**Status:** Draft

---

# 1. Overview

Tài liệu này mô tả các chức năng mà người dùng có thể thực hiện trên hệ thống InternLink.

Phiên bản MVP có hai tác nhân chính:

- Lecturer (Giảng viên hướng dẫn)
- Student (Sinh viên)

---

# 2. Actors

## Lecturer

Giảng viên hướng dẫn thực tập.

Responsibilities:

- Quản lý sinh viên
- Quản lý doanh nghiệp
- Theo dõi tiến độ
- Quản lý biểu mẫu
- Phản hồi
- Chấm điểm

---

## Student

Sinh viên thực tập.

Responsibilities:

- Xem biểu mẫu
- Cập nhật tiến độ
- Nộp báo cáo
- Nộp sản phẩm
- Xem phản hồi

---

# 3. Use Case List

| ID | Use Case | Actor |
|-----|----------|--------|
| UC-01 | Login | Lecturer, Student |
| UC-02 | View Dashboard | Lecturer |
| UC-03 | Manage Students | Lecturer |
| UC-04 | View Student Profile | Lecturer |
| UC-05 | Manage Companies | Lecturer |
| UC-06 | Assign Company | Lecturer |
| UC-07 | Publish Documents | Lecturer |
| UC-08 | Download Documents | Student |
| UC-09 | Submit Weekly Report | Student |
| UC-10 | Submit Internship Log | Student |
| UC-11 | Upload Final Report | Student |
| UC-12 | Upload Product | Student |
| UC-13 | Review Submission | Lecturer |
| UC-14 | Send Feedback | Lecturer |
| UC-15 | View Feedback | Student |
| UC-16 | Resubmit Report | Student |
| UC-17 | Đánh giá sinh viên | Lecturer |
| UC-18 | Chấm điểm | Lecturer |
| UC-19 | Quản lý Rubric | Lecturer |
| UC-20 | Xuất bảng điểm | Lecturer |
| UC-21 | Xem Dashboard thống kê | Lecturer, Student |
| UC-22 | Xuất báo cáo | Lecturer |
| UC-23 | Phân tích dữ liệu | Lecturer |

---

# 4. Use Case Specifications

## UC-01 Login

### Actor

- Lecturer
- Student

### Description

Đăng nhập hệ thống.

### Preconditions

Người dùng có tài khoản hợp lệ.

### Main Flow

1. Nhập tài khoản.
2. Nhập mật khẩu.
3. Hệ thống xác thực.
4. Chuyển đến Dashboard.

### Alternative Flow

- Sai tài khoản hoặc mật khẩu.

---

## UC-05 Manage Companies

### Actor

Lecturer

### Description

Quản lý danh sách doanh nghiệp thực tập.

### Main Flow

1. Xem danh sách doanh nghiệp.
2. Thêm doanh nghiệp mới.
3. Chỉnh sửa thông tin.
4. Xóa doanh nghiệp.
5. Tìm kiếm doanh nghiệp.

### Postconditions

Thông tin doanh nghiệp được cập nhật.

---

## UC-09 Submit Weekly Report

### Actor

Student

### Description

Sinh viên nộp báo cáo tiến độ.

### Preconditions

Đã được phân công thực tập.

### Main Flow

1. Chọn tuần.
2. Upload báo cáo.
3. Gửi.
4. Hệ thống lưu phiên bản.

### Postconditions

Giảng viên nhận được báo cáo.

---

## UC-13 Review Submission

### Actor

Lecturer

### Description

Kiểm tra báo cáo sinh viên.

### Main Flow

1. Chọn sinh viên.
2. Mở báo cáo.
3. Xem lịch sử phiên bản.
4. Gửi nhận xét.

---

## UC-17 Đánh giá sinh viên

### Actor

- Lecturer

### Description

Đánh giá hiệu suất và chất lượng thực tập của sinh viên.

### Main Flow

1. Chọn sinh viên cần đánh giá.
2. Xem thông tin thực tập và báo cáo.
3. Nhập nhận xét đánh giá.
4. Lưu kết quả đánh giá.

---

## UC-18 Chấm điểm

### Actor

- Lecturer

### Description

Chấm điểm các báo cáo, sản phẩm và hoạt động thực tập.

### Main Flow

1. Chọn mục cần chấm.
2. Nhập điểm theo thang điểm.
3. Xem tổng kết điểm.
4. Lưu kết quả.

---

## UC-19 Quản lý Rubric

### Actor

- Lecturer

### Description

Quản lý tiêu chí đánh giá cho các hoạt động thực tập.

### Main Flow

1. Xem danh sách rubric.
2. Tạo rubric mới.
3. Sửa rubric hiện tại.
4. Lưu thay đổi.

---

## UC-20 Xuất bảng điểm

### Actor

- Lecturer

### Description

Xuất bảng điểm dưới dạng file để báo cáo hoặc lưu trữ.

### Main Flow

1. Chọn khoảng thời gian hoặc lớp.
2. Chọn định dạng xuất.
3. Tạo file bảng điểm.
4. Tải xuống.

---

## UC-21 Xem Dashboard thống kê

### Actor

- Lecturer
- Student

### Description

Xem dashboard thống kê tổng quan về tiến độ, điểm số và hoạt động.

### Main Flow

1. Mở trang Dashboard.
2. Xem các chỉ số KPI và biểu đồ.
3. Lọc và phân tích dữ liệu.

---

## UC-22 Xuất báo cáo

### Actor

- Lecturer

### Description

Xuất báo cáo chi tiết về sinh viên, doanh nghiệp và kết quả thực tập.

### Main Flow

1. Chọn loại báo cáo.
2. Chọn phạm vi dữ liệu.
3. Tạo báo cáo.
4. Tải xuống.

---

## UC-23 Phân tích dữ liệu

### Actor

- Lecturer

### Description

Phân tích dữ liệu hoạt động để hỗ trợ ra quyết định.

### Main Flow

1. Mở phần Analytics.
2. Chọn số liệu cần phân tích.
3. Xem biểu đồ và kết quả phân tích.
4. Lưu hoặc xuất báo cáo.

---

# 5. Relationships

## Include

- Review Submission → View Student Profile
- Send Feedback → Review Submission
- Evaluate Internship → View Progress

---

## Extend

- Resubmit Report → View Feedback
- Upload Product → Submit Weekly Report

---

# 6. Summary

InternLink cung cấp 23 Use Case chính cho hai nhóm người dùng.

Các Use Case tập trung vào ba quy trình cốt lõi:

- Quản lý tiến độ thực tập.
- Quản lý nộp bài và phản hồi.
- Quản lý doanh nghiệp.