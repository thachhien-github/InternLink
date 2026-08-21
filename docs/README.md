# InternLink — Danh Mục Tài Liệu Kỹ Thuật & Phân Tích Thiết Kế

Thư mục này chứa đầy đủ tài liệu chuẩn của dự án **Hệ thống Quản lý Thực tập InternLink** phục vụ công tác báo cáo đồ án / nghiệm thu kỹ thuật.

---

## 📑 Danh Sách Tài Liệu Theo Quy Chuẩn Công Nghệ Phần Mềm

| STT | Mã Tài Liệu | Tên Tài Liệu | Nội Dung Chính |
| :---: | :--- | :--- | :--- |
| **01** | [`01-Vision-Scope.md`](01-Vision-Scope.md) | **Tầm nhìn & Phạm vi Dự án** | Bối cảnh, vấn đề thực tế, mục tiêu dự án, đối tượng sử dụng và phạm vi triển khai. |
| **02** | [`02-Software-Requirements-Specification.md`](02-Software-Requirements-Specification.md) | **Đặc tả Yêu cầu Phần mềm (SRS)** | Yêu cầu chức năng (FR) và phi chức năng (NFR) cho từng vai trò Admin, GVHD, Sinh viên. |
| **03** | [`03-Business-Workflow.md`](03-Business-Workflow.md) | **Quy trình Nghiệp vụ (Workflows)** | Sơ đồ luồng xử lý từ lúc tạo học kỳ, phân công, nộp báo cáo tuần đến chấm điểm và xuất file. |
| **04** | [`04-Use-Case-Specification.md`](04-Use-Case-Specification.md) | **Đặc tả Use Cases Chi tiết** | Danh sách sơ đồ Use Case, tác nhân và kịch bản tương tác chính/phụ (Main/Alternative flows). |
| **05** | [`05a-Domain-Model.md`](05a-Domain-Model.md) | **Mô hình Miền (Domain Model)** | Mô tả các khái niệm nghiệp vụ: User, Student, Lecturer, Internship, Evaluation, Document... |
| **06** | [`05b-Entity-Relationship-Diagram.md`](05b-Entity-Relationship-Diagram.md) | **Sơ đồ Thực thể Quan hệ (ERD)** | Sơ đồ Mermaid ERD chi tiết các bảng, khóa chính (PK), khóa ngoại (FK) và quan hệ 1-N. |
| **07** | [`05c-Data-Dictionary.md`](05c-Data-Dictionary.md) | **Từ điển Dữ liệu (Data Dictionary)** | Chi tiết kiểu dữ liệu, ràng buộc (Null/NotNull), mô tả ý nghĩa từng cột trong CSDL. |
| **08** | [`05d-Database-Design.md`](05d-Database-Design.md) | **Thiết kế Cơ sở Dữ liệu SQL Server** | Chiến lược Indexing, Soft Delete, Audit Fields và phân vùng dữ liệu theo học kỳ. |
| **09** | [`06-System-Architecture.md`](06-System-Architecture.md) | **Kiến trúc Hệ thống (System Architecture)** | Mô hình Clean Architecture phân tầng Backend, kiến trúc SPA React và bảo mật JWT. |
| **10** | [`07a-Information-Architecture.md`](07a-Information-Architecture.md) | **Kiến trúc Thông tin (IA)** | Cây phân cấp menu, điều hướng màn hình và cấu trúc trải nghiệm người dùng. |
| **11** | [`07b-Application-Flow.md`](07b-Application-Flow.md) | **Luồng Hoạt động Ứng dụng (App Flow)** | Sơ đồ luồng tương tác thực tế giữa Frontend và REST API qua từng màn hình. |
| **12** | [`08-API-Specification.md`](08-API-Specification.md) | **Đặc tả RESTful API & SignalR** | Chi tiết các endpoint, tham số đầu vào (Request), cấu trúc trả về (Response) và mã lỗi. |
| **13** | [`Email-Setup-Gmail.md`](Email-Setup-Gmail.md) | **Hướng dẫn Cấu hình SMTP Email** | Cách cấu hình tài khoản Google App Password và thiết lập gửi email thư mời tự động. |
| **14** | [`ONBOARDING.md`](ONBOARDING.md) | **Hướng dẫn Dành cho Nhà phát triển** | Thiết lập môi trường lập trình cục bộ (Local Development Environment). |

---

## 🎯 Phân Quyền & Vai Trò Trong Hệ Thống

Hệ thống được thiết kế theo 3 vai trò phân quyền độc lập:
- **SuperAdmin (Khoa / Ban Quản trị)**: Quản lý học kỳ, import danh sách sinh viên & giảng viên, phân công hướng dẫn và gửi email kích hoạt hàng loạt.
- **Lecturer (Giảng viên hướng dẫn)**: Giám sát sinh viên được phân công, duyệt báo cáo tuần, phản hồi đồ án, chấm điểm theo Rubric và xuất bảng điểm Excel/PDF.
- **Student (Sinh viên thực tập)**: Đăng ký thông tin công ty, nộp nhật ký 12 tuần, nộp báo cáo cuối kỳ và theo dõi điểm số đánh giá.
