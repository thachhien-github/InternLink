# Information Architecture

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.0

**Status:** Draft

---

# 1. Overview

Information Architecture (IA) mô tả cách tổ chức thông tin, điều hướng và luồng di chuyển của người dùng trong hệ thống InternLink.

Mục tiêu:

- Dễ tìm kiếm thông tin.
- Giảm số lần thao tác.
- Điều hướng trực quan.
- Phân tách rõ quyền của Giảng viên và Sinh viên.

---

# 2. User Roles

Hệ thống có hai nhóm người dùng chính:

- Lecturer
- Student

Mỗi nhóm chỉ nhìn thấy những chức năng phù hợp với vai trò của mình.

---

# 3. Site Map

## Public

```text
Login
```

---

## Lecturer

```text
Giảng viên
│
├── Tổng quan
│
├── Sinh viên
│   ├── Danh sách sinh viên
│   ├── Hồ sơ sinh viên
│   ├── Tiến độ thực tập
│   └── Lịch sử nộp bài
│
├── Thực tập
│   ├── Đợt thực tập
│   ├── Kế hoạch
│   ├── Báo cáo tuần
│   ├── Phản hồi
│   └── Tiến độ
│
├── Doanh nghiệp
│   ├── Danh sách doanh nghiệp
│   ├── Hồ sơ doanh nghiệp
│   └── Tiếp nhận sinh viên
│
├── Biểu mẫu
│   ├── Upload
│   └── Download
│
├── Đánh giá & Chấm điểm
│   ├── Danh sách cần chấm
│   ├── Rubric
│   ├── Phiếu đánh giá
│   ├── Chấm điểm
│   ├── AI gợi ý
│   └── Xuất bảng điểm
│
├── Thống kê & Báo cáo
│   ├── KPI
│   ├── Dashboard
│   ├── Biểu đồ
│   ├── Báo cáo doanh nghiệp
│   ├── Báo cáo sinh viên
│   ├── Phân bố điểm
│   └── Export Excel/PDF
│
├── Thông báo
│
└── Tài khoản
```

---

## Student

```text
Dashboard
│
├── Internship
│      ├── Progress
│      ├── Weekly Reports
│      ├── Internship Logs
│      ├── Submissions
│      └── Feedback
│
├── Documents
│
├── Notifications
│
└── Profile
```

---

# 4. Navigation Structure

## Lecturer Navigation

Dashboard

↓

Internship Students

↓

Student Detail

↓

Submission

↓

Feedback

↓

Evaluation

---

Dashboard

↓

Companies

↓

Company Detail

↓

Internship History

---

Dashboard

↓

Documents

↓

Upload

---

## Student Navigation

Dashboard

↓

Internship

↓

Weekly Report

↓

Submit

---

Dashboard

↓

Feedback

↓

Revision

↓

Resubmit

---

Dashboard

↓

Documents

↓

Download

---

# 5. User Flow

## Lecturer

Login

↓

Dashboard

↓

Select Student

↓

View Progress

↓

Review Submission

↓

Send Feedback

↓

Evaluate

---

## Student

Login

↓

Dashboard

↓

View Deadline

↓

Upload Report

↓

Receive Feedback

↓

Resubmit

↓

Completed

---

# 6. Screen Hierarchy

## Lecturer

Dashboard

├── Student List

│      └── Student Detail

│              ├── Weekly Report

│              ├── Submission

│              ├── Feedback

│              └── Evaluation

├── Company

├── Documents

├── Notification

└── Profile

---

## Student

Dashboard

├── Internship

│      ├── Weekly Report

│      ├── Internship Log

│      ├── Submission

│      └── Feedback

├── Documents

├── Notification

└── Profile

---

# 7. Information Organization

## Dashboard

Hiển thị:

- Tổng số sinh viên
- Sinh viên chậm tiến độ
- Deadline sắp tới
- Thông báo mới

---

## Student Detail

Hiển thị:

- Thông tin sinh viên
- Doanh nghiệp
- Tiến độ
- Báo cáo
- Sản phẩm
- Lịch sử phản hồi
- Điểm

---

## Company

Hiển thị:

- Thông tin doanh nghiệp
- Người liên hệ
- Vị trí tuyển
- Lịch sử thực tập
- Đánh giá

---

## Documents

Hiển thị:

- Biểu mẫu
- Quy định
- Báo cáo mẫu
- Hướng dẫn

---

# 8. Design Principles

Information Architecture được xây dựng theo các nguyên tắc:

- Navigation nhất quán.
- Tối đa 3 lần nhấp để đến chức năng chính.
- Thông tin quan trọng hiển thị trên Dashboard.
- Hạn chế màn hình dư thừa.
- Ưu tiên quy trình hướng dẫn thực tập.

---

# 9. Summary

Information Architecture của InternLink tập trung vào ba nhóm chức năng chính:

- Quản lý tiến độ thực tập.
- Quản lý doanh nghiệp.
- Quản lý tài liệu và phản hồi.

Kiến trúc thông tin này là cơ sở để thiết kế Wireframe, UI và điều hướng trong các bước tiếp theo.