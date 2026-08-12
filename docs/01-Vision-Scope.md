# InternLink - Vision & Scope

**Version:** 2.0  
**Date:** August 2026  
**Status:** Active — aligned with MVP + SuperAdmin module

---

# 1. Introduction

## 1.1 Project Name

**InternLink – Internship Management & Collaboration Platform**

---

## 1.2 Project Overview

InternLink là nền tảng web hỗ trợ **quản trị khoa/phòng**, **giảng viên hướng dẫn** và **sinh viên** trong suốt quá trình thực tập.

Hệ thống số hóa quy trình đang phân tán trên Excel, Zalo, Google Drive và Email: tập trung master data, tài khoản, phân công hướng dẫn, tiến độ, nộp bài, phản hồi và đánh giá cuối kỳ trên một nền tảng thống nhất.

---

# 2. Background

Qua khảo sát thực tế với giảng viên hướng dẫn thực tập, quy trình hiện nay chủ yếu dùng nhiều công cụ rời rạc:

- Microsoft Excel, Zalo, Google Drive, Email, Microsoft Word

Hệ quả:

- Thông tin phân tán; khó theo dõi tiến độ
- Khó quản lý phiên bản báo cáo
- Tốn thời gian tổng hợp cuối kỳ
- Chưa có DB doanh nghiệp và quy trình cấp tài khoản / phân công GV tập trung

---

# 3. Problem Statement

## P1. Fragmented Information

Thông tin SV, DN, báo cáo, phản hồi nằm trên nhiều nền tảng.

## P2. Internship Progress Tracking

Giảng viên thiếu công cụ theo dõi trạng thái / hạn nộp theo thời gian thực.

## P3. Submission Management

Nhiều phiên bản báo cáo; khó xác định bản mới nhất và lịch sử.

## P4. Company Management

Thông tin DN rải rác; khó tìm kiếm và kế thừa giữa các đợt.

## P5. Final Evaluation

Tổng hợp nhật ký, báo cáo, điểm, nhận xét thủ công.

## P6. Account & Assignment Operations *(MVP mở rộng)*

Cấp tài khoản SV/GV, gửi thông tin đăng nhập, phân công SV→GV còn thủ công qua Excel/email — dễ sai và khó kiểm soát.

---

# 4. Objectives

1. Tập trung quy trình hướng dẫn thực tập trên một nền tảng.
2. Giúp giảng viên theo dõi và phản hồi SV được phân công hiệu quả hơn.
3. Xây dựng cơ sở dữ liệu doanh nghiệp phục vụ lâu dài.
4. Chuẩn hóa vận hành Admin: import dữ liệu, cấp TK, email mời, phân công hướng dẫn.

---

# 5. Target Users

## SuperAdmin (Ban quản lý / khoa)

- Import / quản lý master data SV, GV, DN
- Cấp và quản lý tài khoản; gửi email mời; reset mật khẩu
- Phân công sinh viên cho giảng viên hướng dẫn

## Lecturer

- Xem SV được phân công; gán doanh nghiệp cho hồ sơ thực tập
- Duyệt submission / weekly report; gửi feedback; chấm điểm; export cuối kỳ
- Upload tài liệu biểu mẫu

## Student

- Nộp báo cáo tuần / sản phẩm; xem phản hồi; nộp lại
- Tải tài liệu; xem thông báo
- Đổi mật khẩu / quên mật khẩu (self-service)

---

# 6. MVP Scope (implemented)

## Module A — Admin & Accounts

- CRUD / import Students, Lecturers, Companies
- User management (create, deactivate, admin reset password)
- Invitation email + forgot/reset password
- Bulk assign Students → Lecturer

## Module B — Internship Progress

- Internship status workflow
- Weekly Report
- Notifications (in-app)

## Module C — Submission & Feedback

- Submission upload + versioning
- Lecturer feedback; student resubmit

## Module D — Company (master + assign)

- Company master data (Admin write; Lecturer read)
- Lecturer assigns company to internship

## Module E — Evaluation & Export

- 4-criteria evaluation + finalize
- End-of-term Excel export

## Supporting

- JWT Authentication & role policies (`RequireAdmin` / `RequireLecturer` / `RequireStudent`)
- Document library
- Soft delete + audit fields

Chi tiết UC: [`04-Use-Case-Specification.md`](04-Use-Case-Specification.md)  
Backend: [`Backend-Plan.md`](Backend-Plan.md)

---

# 7. Out of Scope (MVP)

| Item | Ghi chú |
|------|---------|
| InternshipLog entity + API | Planned |
| Configurable Rubric UI | Deferred |
| Advanced Analytics Dashboard | Deferred |
| AI matching / AI report review | Future |
| Mobile app, realtime chat | Future |
| Zalo / LMS integration | Future |
| Hangfire / background mail queue | Future (bulk mail hiện sync) |

**Đã đưa vào MVP (khác Vision v1.0):** Email invitation / password reset (SMTP hoặc logging stub).

---

# 8. Expected Benefits

| Stakeholder | Lợi ích |
|-------------|---------|
| SuperAdmin | Import tập trung, cấp TK + email, phân công GV rõ ràng |
| Lecturer | Workflow SV được giao; phản hồi / chấm / export nhanh |
| Student | Nộp bài một nơi; nhận feedback; tự reset MK |
| Faculty | Company DB + dữ liệu kế thừa qua các đợt |

---

# 9. Future Vision

- AI company matching / progress analysis
- Multi-faculty / batch management
- School SMS integration
- Rich analytics

---

# 10. Conclusion

InternLink MVP giải quyết:

1. Vận hành Admin (dữ liệu + tài khoản + phân công)
2. Tiến độ & nộp bài / phản hồi
3. Doanh nghiệp & đánh giá cuối kỳ

Nền tảng sẵn sàng tích hợp frontend và mở rộng các module Planned.
