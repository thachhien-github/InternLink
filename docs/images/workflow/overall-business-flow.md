# Quy Trình Nghiệp Vụ Tổng Thể (Overall Business Workflow) — InternLink

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0  
**Giai đoạn:** 5 Giai đoạn khép kín từ Khởi tạo đến Tổng kết cuối kỳ

---

```mermaid
flowchart TD
    subgraph Phase1["GIAI ĐOẠN 1: KHỞI TẠO & PHÂN CÔNG (Khoa / SuperAdmin)"]
        A1["1.1. Tạo học kỳ mới<br/>(Đặt IsCurrent = true)"] --> A2["1.2. Import file Excel<br/>(Danh sách SV & GVHD)"]
        A2 --> A3["1.3. Phân công Hướng dẫn<br/>(Gán SV cho GVHD theo kỳ)"]
        A3 --> A4["1.4. Gửi Email Thư mời<br/>(Cấp tài khoản & MK ngẫu nhiên)"]
    end

    subgraph Phase2["GIAI ĐOẠN 2: KHAI BÁO NƠI THỰC TẬP (Sinh Viên)"]
        B1["2.1. Đăng nhập lần đầu<br/>& Bắt buộc đổi MK"] --> B2["2.2. Khai báo Doanh nghiệp<br/>(Tên công ty, Vị trí, Mentor)"]
        B2 --> B3["2.3. Trạng thái chuyển sang<br/>'InProgress' (Đang thực tập)"]
    end

    subgraph Phase3["GIAI ĐOẠN 3: GIÁM SÁT TIẾN ĐỘ 12 TUẦN (SV & GVHD)"]
        C1["3.1. SV nộp nhật ký hàng tuần<br/>(Tuần 1 - 12 kèm file minh chứng)"] --> C2["3.2. GVHD nhận thông báo<br/>& Xem xét nội dung"]
        C2 --> C3{"3.3. GVHD duyệt tuần?"}
        C3 -- "Yêu cầu sửa" --> C4["3.4. SV nhận phản hồi & bổ sung"]
        C4 --> C1
        C3 -- "Phê duyệt" --> C5["3.5. Đánh dấu hoàn thành tuần"]
    end

    subgraph Phase4["GIAI ĐOẠN 4: ĐỒ ÁN CUỐI KỲ & CHẤM RUBRIC (SV & GVHD)"]
        D1["4.1. SV nộp Đồ án / Báo cáo cuối kỳ<br/>(Quản lý phiên bản v1, v2, v3)"] --> D2["4.2. GVHD nhận xét đồ án<br/>& Phản hồi chỉnh sửa (Feedback)"]
        D2 --> D3["4.3. GVHD chấm điểm Rubric 4 tiêu chí<br/>(Chuyên môn, Thái độ, Kỹ năng, Báo cáo)"]
        D3 --> D4["4.4. Hệ thống tự động tính điểm & Xếp loại"]
        D4 --> D5["4.5. GVHD Khóa điểm (Finalize)"]
    end

    subgraph Phase5["GIAI ĐOẠN 5: TỔNG KẾT & XUẤT BÁO CÁO (GVHD & Khoa)"]
        E1["5.1. Xuất Bảng điểm Excel (.xlsx)<br/>(15 cột chuẩn nhập điểm P.ĐT)"]
        E2["5.2. Xuất Báo cáo PDF Server-Side<br/>(Bảng tổng kết & Phiếu Rubric A4)"]
        E3["5.3. Lưu trữ hồ sơ bền vững<br/>(Database & Docker Volume)"]
    end

    Phase1 --> Phase2
    Phase2 --> Phase3
    Phase3 --> Phase4
    Phase4 --> Phase5
```

---

## 📌 Lợi Ích Của Quy Trình Số Hóa

1. **Rút ngắn 90% thời gian xử lý hành chính**: Tự động hóa hoàn toàn các khâu gửi email, phân công và tổng hợp điểm số.
2. **Minh bạch và chuẩn hóa**: Sinh viên nắm rõ tiến độ từng tuần và tiêu chí đánh giá chuẩn đầu ra.
3. **Truy vết lịch sử rõ ràng**: Mọi lần nộp bài, phản hồi và sửa đổi đều được lưu vết thời gian và phiên bản chính xác.
