```mermaid
flowchart LR

GV[Giảng viên]

SV[Sinh viên]

DN[Doanh nghiệp]

SYS[(InternLink)]

GV -->|Quản lý sinh viên| SYS

GV -->|Quản lý doanh nghiệp| SYS

GV -->|Phản hồi & Chấm điểm| SYS

SV -->|Nộp báo cáo| SYS

SV -->|Cập nhật tiến độ| SYS

SV -->|Xem biểu mẫu| SYS

DN -->|Nhận xét sinh viên| SYS
```