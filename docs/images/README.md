# InternLink — Danh Mục Sơ Đồ Kỹ Thuật (Architecture & Flow Diagrams)

Thư mục này chứa toàn bộ mã nguồn sơ đồ chuẩn hóa bằng **Mermaid Markdown** và hình ảnh thiết kế phục vụ công tác báo cáo đồ án, thuyết trình và nghiệm thu kỹ thuật.

---

## 📑 Danh Mục Sơ Đồ Theo Phân Loại

### 1. Kiến Trúc Hệ Thống (`/docs/images/architecture/`)
| Tên Sơ Đồ | File Nguồn | Mô Tả Nội Dung |
| :--- | :--- | :--- |
| **Tổng quan Kiến trúc** | [`overall-architecture.md`](architecture/overall-architecture.md) | Sơ đồ tương tác giữa 3 tác nhân, Frontend React, Backend .NET Core và SQL Server. |
| **Phân tầng Backend** | [`backend-layer.md`](architecture/backend-layer.md) | Kiến trúc Clean Architecture phân tầng (API, Application, Domain, Infrastructure). |
| **Vòng đời Request** | [`request-lifecycle.md`](architecture/request-lifecycle.md) | Luồng xử lý một HTTP Request từ Middleware, JWT Auth, Handler đến Database. |
| **Kiến trúc Triển khai** | [`deployment-architecture.md`](architecture/deployment-architecture.md) | Sơ đồ triển khai Docker Container, Nginx Reverse Proxy, Volume Storage. |

---

### 2. Sơ Đồ Use Case (`/docs/images/usecase/`)
| Tên Sơ Đồ | File Nguồn | Mô Tả Nội Dung |
| :--- | :--- | :--- |
| **Sơ đồ Use Case Toàn hệ thống** | [`usecase-diagram.md`](usecase/usecase-diagram.md) | Sơ đồ Use Case tổng hợp cho SuperAdmin, Lecturer và Student kèm quan hệ include/extend. |

---

### 3. Quy Trình Nghiệp Vụ (`/docs/images/workflow/`)
| Tên Sơ Đồ | File Nguồn | Mô Tả Nội Dung |
| :--- | :--- | :--- |
| **Luồng Nghiệp vụ Tổng thể** | [`overall-business-flow.md`](workflow/overall-business-flow.md) | Luồng trao đổi dữ liệu 5 giai đoạn thực tập. |
| **Quy trình Hiện trạng (As-Is)** | [`as-is-workflow.md`](workflow/as-is-workflow.md) | Quy trình thủ công cũ qua Email, Zalo, giấy tờ. |
| **Quy trình Đề xuất (To-Be)** | [`to-be-workflow.md`](workflow/to-be-workflow.md) | Quy trình số hóa 100% trên nền tảng InternLink. |
| **So sánh As-Is vs To-Be** | [`workflow-comparison.md`](workflow/workflow-comparison.md) | Bảng phân tích tối ưu thời gian và chi phí vận hành. |

---

### 4. Sơ Đồ Trình Tự (`/docs/images/sequence/`)
| Tên Sơ Đồ | File Nguồn | Mô Tả Nội Dung |
| :--- | :--- | :--- |
| **Gửi Email Thư mời** | [`invitation-email.md`](sequence/invitation-email.md) | Trình tự Admin import Excel $\rightarrow$ Sinh mật khẩu $\rightarrow$ Gửi thư mời SMTP. |
| **Phân công Hướng dẫn Hàng loạt** | [`bulk-assign.md`](sequence/bulk-assign.md) | Trình tự gán danh sách sinh viên cho GVHD theo học kỳ. |
| **Quên & Đặt lại Mật khẩu** | [`forgot-password.md`](sequence/forgot-password.md) | Trình tự sinh reset token, gửi email xác thực và cập nhật mật khẩu mới. |

---

### 5. Kiến Trúc Thông Tin & Điều Hướng (`/docs/images/information-architecture/`)
| Tên Sơ Đồ | File Nguồn | Mô Tả Nội Dung |
| :--- | :--- | :--- |
| **Cây Sơ Đồ Trang (Sitemap)** | [`sitemap.md`](information-architecture/sitemap.md) | Cây điều hướng phân cấp các trang trong toàn hệ thống. |
| **Phân cấp Màn hình** | [`screen-hierarchy.md`](information-architecture/screen-hierarchy.md) | Cấu trúc phân cấp giao diện cho 3 vai trò. |
| **Điều hướng Giảng viên** | [`lecturer-navigation.md`](information-architecture/lecturer-navigation.md) | Sơ đồ điều hướng các chức năng của Giảng viên. |
| **Luồng Người dùng Giảng viên** | [`lecturer-user-flow.md`](information-architecture/lecturer-user-flow.md) | Luồng thao tác duyệt bài và chấm điểm của GVHD. |
| **Điều hướng Sinh viên** | [`student-navigation.md`](information-architecture/student-navigation.md) | Sơ đồ điều hướng Cổng thông tin Sinh viên. |
| **Luồng Người dùng Sinh viên** | [`student-user-flow.md`](information-architecture/student-user-flow.md) | Luồng nộp nhật ký 12 tuần và đồ án tốt nghiệp. |

---

### 6. Luồng Ứng Dụng Chi Tiết (`/docs/images/application-flow/`)
Tập hợp 16 kịch bản luồng thao tác màn hình cụ thể:
- **Admin**: [`admin-import-invite.md`](application-flow/admin-import-invite.md), [`admin-bulk-assign.md`](application-flow/admin-bulk-assign.md)...
- **Lecturer**: [`lecturer-login.md`](application-flow/lecturer-login.md), [`lecturer-manage-students.md`](application-flow/lecturer-manage-students.md), [`lecturer-review-report.md`](application-flow/lecturer-review-report.md), [`lecturer-review-submission.md`](application-flow/lecturer-review-submission.md), [`lecturer-evaluation.md`](application-flow/lecturer-evaluation.md), [`lecturer-manage-company.md`](application-flow/lecturer-manage-company.md), [`lecturer-upload-document.md`](application-flow/lecturer-upload-document.md)...
- **Student**: [`student-login.md`](application-flow/student-login.md), [`student-weekly-report.md`](application-flow/student-weekly-report.md), [`student-submission.md`](application-flow/student-submission.md), [`student-resubmission.md`](application-flow/student-resubmission.md), [`student-feedback.md`](application-flow/student-feedback.md), [`student-download-document.md`](application-flow/student-download-document.md)...
- **Auth**: [`forgot-password.md`](application-flow/forgot-password.md).

---

## 🛠️ Hướng Dẫn Xem & Xuất Sơ Đồ Ra Ảnh (PNG/SVG)

1. **Xem trực tiếp trên GitHub / Markdown Preview**:
   - Tất cả các sơ đồ đều được viết bằng chuẩn cú pháp `mermaid`. Trình duyệt hoặc VSCode Markdown Preview sẽ tự động render trực tiếp thành hình ảnh vector sắc nét.
2. **Xuất thành file PNG / SVG chất lượng cao để chèn vào Word / Slide**:
   - Truy cập **[Mermaid Live Editor](https://mermaid.live)**.
   - Copy nội dung block code trong các file `.md` và dán vào.
   - Chọn **Download PNG** hoặc **Download SVG** (khuyên dùng để chèn vào Word/PDF báo cáo không bị vỡ nét).
