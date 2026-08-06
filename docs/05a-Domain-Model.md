# Domain Model and ERD

This document describes the key entities and relationships for the platform data model.
# Domain Model

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.0

**Status:** Draft

---

# 1. Overview

Domain Model mô tả các đối tượng nghiệp vụ (Business Entities) của hệ thống và mối quan hệ giữa chúng.

Khác với ERD, Domain Model tập trung vào nghiệp vụ thay vì thiết kế cơ sở dữ liệu.

---

# 2. Core Domains

## User

Đại diện cho tài khoản đăng nhập hệ thống.

Vai trò:

- Lecturer
- Student

---

## Lecturer

Đại diện cho giảng viên hướng dẫn thực tập.

Responsibilities:

- Quản lý sinh viên
- Quản lý doanh nghiệp
- Theo dõi tiến độ
- Nhận xét
- Chấm điểm
- Công bố biểu mẫu

---

## Student

Đại diện cho sinh viên thực tập.

Responsibilities:

- Cập nhật tiến độ
- Nộp báo cáo
- Nộp sản phẩm
- Xem phản hồi
- Theo dõi trạng thái

---

## Company

Đại diện cho doanh nghiệp tiếp nhận thực tập.

Lưu trữ:

- Thông tin doanh nghiệp
- Người liên hệ
- Vị trí tuyển thực tập
- Lịch sử hợp tác

---

## Internship

Đại diện cho hồ sơ thực tập của một sinh viên.

Bao gồm:

- Doanh nghiệp
- Thời gian thực tập
- Giảng viên hướng dẫn
- Trạng thái

---

# 3. Progress Domains

## Weekly Report

Báo cáo tiến độ theo tuần.

---

## Internship Log

Nhật ký công việc.

---

## Submission

Lần nộp báo cáo hoặc sản phẩm.

Có thể có nhiều phiên bản.

---

## Feedback

Nhận xét của giảng viên.

Một Submission có thể có nhiều Feedback.

---

## Evaluation

Kết quả đánh giá cuối kỳ.

Bao gồm:

- Điểm
- Nhận xét
- Đánh giá doanh nghiệp

---

# 4. Supporting Domains

## Document

Biểu mẫu và tài liệu công bố.

---

## Notification

Thông báo hệ thống.

---

# 5. Domain Relationships

User
│
├── Lecturer
└── Student

Lecturer
│
├── Internship
├── Company
└── Document

Student
│
└── Internship

Internship
│
├── Weekly Report
├── Internship Log
├── Submission
├── Feedback
└── Evaluation

Company
│
└── Internship

---

# 6. Summary

InternLink bao gồm 11 miền nghiệp vụ chính:

- User
- Lecturer
- Student
- Company
- Internship
- Weekly Report
- Internship Log
- Submission
- Feedback
- Evaluation
- Document
- Notification