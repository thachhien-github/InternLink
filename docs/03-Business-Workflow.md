# InternLink — Quy Trình Nghiệp Vụ Thực Tập (Business Workflow)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0  
**Ngày cập nhật:** Tháng 8/2026

---

## 1. Tổng Quan Quy Trình 5 Giai Đoạn (End-to-End Workflow)

Toàn bộ quá trình thực tập tốt nghiệp được số hóa thành **5 giai đoạn tuần tự**:

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  GIAI ĐOẠN 1    │     │   GIAI ĐOẠN 2    │     │   GIAI ĐOẠN 3     │     │   GIAI ĐOẠN 4    │     │  GIAI ĐOẠN 5    │
│ Khởi tạo Học kỳ ├────►│ Đăng ký Địa điểm ├────►│  Giám sát Tiến độ ├────►│ Chấm điểm Rubric ├────►│ Tổng kết & Xuất │
│ & Phân công GV  │     │ Thực tập (DN)    │     │  Nhật ký 12 Tuần  │     │ & Phản hồi Đồ án │     │ Báo cáo Excel/PDF│
└─────────────────┘     └──────────────────┘     └───────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## 2. Chi Tiết Từng Giai Đoạn Nghiệp Vụ

### 2.1. Giai Đoạn 1: Khởi Tạo Học Kỳ & Phân Công Giảng Viên (SuperAdmin)

1. **Khởi tạo Học kỳ**:
   - SuperAdmin tạo học kỳ mới (VD: `HK I 2025-2026`), thiết lập ngày bắt đầu, ngày kết thúc và đặt làm học kỳ hoạt động (`IsCurrent = true`).
2. **Import Danh sách Sinh viên & Giảng viên**:
   - Admin tải file Excel mẫu, điền danh sách SV và GVHD, sau đó tải lên hệ thống.
   - Hệ thống tự động kiểm tra trùng lặp MSSV / Mã GV, sinh mã định danh và tạo tài khoản mặc định.
3. **Phân công Hướng dẫn (Assignments)**:
   - Admin chọn danh sách SV và gán cho GVHD phụ trách.
   - Hệ thống tự động tạo các bản ghi `Internship` tương ứng trong CSDL.
4. **Gửi Email Thư mời Tự động (Invitation Emails)**:
   - Admin bấm nút "Gửi Email Kích hoạt".
   - Hệ thống kích hoạt dịch vụ Email SMTP gửi tài khoản, mật khẩu tạm thời và link đăng nhập đến từng sinh viên và giảng viên.

---

### 2.2. Giai Đoạn 2: Đăng Nhập Lần Đầu & Khai Báo Doanh Nghiệp (Sinh Viên)

1. **Đăng nhập & Đổi mật khẩu**:
   - Sinh viên nhận thông tin đăng nhập qua Email, truy cập hệ thống tại `http://localhost:5173`.
   - Hệ thống nhận diện `MustChangePassword = true` và bắt buộc sinh viên đổi mật khẩu mới để bảo mật tài khoản.
2. **Khai báo Thông tin Nơi Thực tập**:
   - Sinh viên vào mục "Thông tin Thực tập" trên Cổng Sinh viên.
   - Chọn Doanh nghiệp từ danh mục có sẵn hoặc nhập thông tin doanh nghiệp mới (Tên công ty, Địa chỉ, Vị trí thực tập, Thông tin Mentor).
   - Hệ thống cập nhật trạng thái thực tập sang `InProgress` (Đang thực tập).

---

### 2.3. Giai Đoạn 3: Nhật Ký 12 Tuần & Giám Sát Tiến Độ (Sinh Viên - GVHD)

1. **Nộp Báo cáo Tuần (Sinh viên)**:
   - Mỗi tuần (từ Tuần 1 đến Tuần 12), sinh viên vào hệ thống ghi chép:
     - Công việc đã hoàn thành trong tuần.
     - Kế hoạch tuần kế tiếp.
     - Khó khăn gặp phải & đề xuất.
     - Đính kèm file minh chứng (ảnh sản phẩm, tài liệu phân tích, phiếu xác nhận).
   - Nhấn "Nộp báo cáo tuần".
2. **Duyệt & Phản hồi Báo cáo Tuần (GVHD)**:
   - GVHD nhận thông báo trên Dashboard về các báo cáo tuần mới nộp.
   - Xem chi tiết nội dung và tải file minh chứng.
   - Chọn **Duyệt (`Approved`)** hoặc **Yêu cầu sửa đổi (`Rejected`)** kèm lời nhắc nhở.

---

### 2.4. Giai Đoạn 4: Nộp Báo Cáo Cuối Kỳ & Đánh Giá Rubric (Sinh Viên - GVHD)

1. **Nộp Đồ án / Báo cáo Tổng kết (Sinh viên)**:
   - Khi kết thúc 12 tuần, sinh viên nộp báo cáo hoàn chỉnh (Đồ án, Source Code link, Slide báo cáo).
   - Hệ thống đánh dấu phiên bản `v1.0`. Nếu GVHD yêu cầu chỉnh sửa, sinh viên có thể nộp phiên bản `v2.0`, `v3.0`.
2. **Chấm điểm theo Rubric 4 Tiêu chí (GVHD)**:
   - GVHD mở bảng chấm điểm chi tiết của từng sinh viên:
     - **Tiêu chí 1: Kiến thức Chuyên môn & Sản phẩm (Trọng số 40%)**
     - **Tiêu chí 2: Tính Kỷ luật & Chuyên cần (Trọng số 20%)**
     - **Tiêu chí 3: Kỹ năng Mềm & Giao tiếp Doanh nghiệp (Trọng số 20%)**
     - **Tiêu chí 4: Chất lượng Báo cáo & Thuyết trình (Trọng số 20%)**
   - Hệ thống tự động tính điểm tổng kết thang 10 và quy đổi sang thang điểm 4 cùng xếp loại học lực (Xuất sắc, Giỏi, Khá, Trung bình, Không đạt).
3. **Chốt Điểm (Finalize Evaluation)**:
   - GVHD ghi nhận xét tổng quan và bấm "Lưu & Chốt điểm". Bản ghi đánh giá được khóa lại để bảo đảm tính pháp lý.

---

### 2.5. Giai Đoạn 5: Xuất Báo Cáo, Bảng Điểm & Lưu Trữ (GVHD & Khoa)

1. **Xuất Bảng Điểm Excel Tổng hợp**:
   - GVHD xuất file `tong-ket-cuoi-ky.xlsx` chứa đầy đủ điểm thành phần của toàn bộ sinh viên phụ trách để gửi về cho Giáo vụ Khoa nhập điểm.
2. **Xuất Phiếu Đánh Giá & Báo Cáo PDF Chuẩn Bộ GD&ĐT**:
   - GVHD xuất file PDF Bảng tổng hợp hoặc Phiếu đánh giá cá nhân của từng sinh viên trực tiếp từ Server (có Quốc hiệu, Bảng Rubric, ô chữ ký của Doanh nghiệp, GVHD và Trưởng khoa).
3. **Lưu trữ Bền vững**:
   - Toàn bộ hồ sơ báo cáo, tài liệu và điểm số được lưu trữ an toàn trong Database và Docker Volume của Khoa.
