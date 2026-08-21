# Vòng Đời Xử Lý HTTP Request (Request Lifecycle) — InternLink

**Dự án:** InternLink — Nền tảng Quản lý & Giám sát Thực tập  
**Phiên bản:** 3.0

---

```mermaid
sequenceDiagram
    autonumber
    actor User as Người Dùng (Browser)
    participant React as React 18 SPA (Vite)
    participant Nginx as Nginx Reverse Proxy
    participant MW as ASP.NET Core Middlewares<br/>(CORS / Logging / Exception)
    participant Auth as JWT Authentication Handler
    participant Ctrl as API Controller
    participant Svc as Application Service
    participant EF as EF Core 10 DbContext
    participant SQL as SQL Server 2022
    participant Hub as SignalR Notification Hub

    User->>React: Tương tác trên giao diện (Click / Submit)
    React->>Nginx: HTTP Request + Bearer JWT Token
    Nginx->>MW: Proxy pass đến Kestrel (:7109)
    
    MW->>MW: Request Logging & CORS check
    MW->>Auth: Xác thực JWT Token & Claims (Role, UserId)
    
    alt Token không hợp lệ / Hết hạn
        Auth-->>React: 401 Unauthorized
        React-->>User: Điều hướng trang /login hoặc refresh token
    else Token hợp lệ
        Auth->>Ctrl: Gán ClaimsPrincipal & chuyển tiếp
        Ctrl->>Svc: Gọi hàm nghiệp vụ (DTO payload)
        Svc->>Svc: Validate dữ liệu (FluentValidation)
        Svc->>EF: Thực thi truy vấn LINQ / Thay đổi thực thể
        EF->>SQL: Sinh mã T-SQL (áp dụng Global Query Filter: !IsDeleted)
        SQL-->>EF: Trả về tập kết quả dữ liệu
        EF-->>Svc: Mapping Domain Entity sang DTO
        
        opt Có sự kiện cần báo tức thời (Duyệt bài / Broadcast)
            Svc->>Hub: Bắn event SendAsync("ReceiveNotification")
            Hub-->>React: Push WebSocket Notification
        end
        
        Svc-->>Ctrl: Trả về kết quả nghiệp vụ (Result)
        Ctrl-->>MW: Đóng gói ApiResponse<T>
        MW-->>Nginx: 200 OK / 201 Created (JSON Header)
        Nginx-->>React: Response Payload
        React-->>User: Cập nhật State & Re-render UI
    end
```

---

## 📌 Các Lớp Bảo Vệ & Xử Lý Ngoại Lệ (Cross-Cutting Concerns)

1. **Global Exception Handling Middleware**: Bắt mọi lỗi chưa được xử lý (`Unhandled Exception`), tự động ghi log và trả về mã phản hồi JSON đồng nhất (`success: false, error: { code, message }`) thay vì làm lộ StackTrace ra ngoài client.
2. **Global Query Filters**: Đảm bảo 100% truy vấn dữ liệu tự động loại bỏ các bản ghi đã xóa mềm (`IsDeleted = true`).
