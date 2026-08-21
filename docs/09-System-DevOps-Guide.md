# InternLink — System Architecture & DevOps Deployment Guide

Tài liệu chi tiết về kiến trúc hạ tầng, containerization (Docker), mạng nội bộ (Networking), Reverse Proxy (Nginx), giám sát sức khỏe (Health Checks), và cẩm nang xử lý sự cố (Troubleshooting Guide).

---

## 1. Sơ đồ Kiến trúc Hệ thống & Luồng Mạng (Networking Topology)

```
[ Client / Web Browser ]
         │
         ├─── Port 3000 (HTTP) ────────► [ Frontend Container (Nginx Alpine) ]
         │                                       │ (Reverse Proxy)
         │                                       ├──► Static SPA (/index.html)
         │                                       ├──► /api/* ──┐
         │                                       └──► /hubs/* ─┤
         │                                                     │ (internlink_network)
         └─── Port 7109 (Direct API/Swagger) ──────────────────┴─► [ Backend Container (.NET 10) ]
                                                                             │
                                                                             │ (host.docker.internal:1433)
                                                                             ▼
                                                                 [ Host Machine / SQL Server ]
```

### Chi tiết ánh xạ Port & Giao tiếp Mạng:
* **Frontend Web & Proxy (Container `internlink_frontend`):**
  * **Port ngoài:** `3000` $\rightarrow$ **Port trong:** `80` (Nginx).
  * Nginx đóng vai trò vừa phục vụ file tĩnh của React SPA, vừa làm Reverse Proxy chuyển tiếp request `/api/` và SignalR WebSocket `/hubs/` về container backend.
* **Backend API (Container `internlink_api`):**
  * **Port ngoài:** `7109` $\rightarrow$ **Port trong:** `8080` (ASP.NET Core Kestrel).
  * Sử dụng mạng nội bộ `internlink_network` kết nối trực tiếp với Frontend.
  * Sử dụng `extra_hosts: ["host.docker.internal:host-gateway"]` để giao tiếp với Microsoft SQL Server (Port `1433`) đang chạy trên máy Host.

---

## 2. Docker Multi-Stage Build Architecture

Cả Frontend và Backend đều áp dụng mô hình **Multi-Stage Build** nhằm tối ưu hóa dung lượng image, tăng tốc độ build và tăng cường bảo mật:

### A. Backend (.NET 10)
* **Stage 1 (`build`):** Sử dụng image `mcr.microsoft.com/dotnet/sdk:10.0` chứa đầy đủ bộ SDK, công cụ biên dịch để restore dependencies và publish mã nguồn sang thư mục `/app/publish`.
* **Stage 2 (`final`):** Sử dụng image siêu nhẹ `mcr.microsoft.com/dotnet/aspnet:10.0` (chỉ chứa .NET Runtime cần thiết), cài đặt `curl` phục vụ container healthcheck.
* **Hiệu quả:** Giảm kích thước image từ **> 800MB xuống còn ~250MB**, loại bỏ toàn bộ mã nguồn thô và SDK thừa thãi khỏi container chạy thực tế.

### B. Frontend (React + Vite + Nginx)
* **Stage 1 (`build`):** Sử dụng `node:20-alpine`, cài đặt `npm install` và thực hiện `npm run build` để sinh ra thư mục `/app/dist`.
* **Stage 2 (`final`):** Sử dụng `nginx:alpine` siêu gọn nhẹ (~25MB), copy file từ `/app/dist` sang `/usr/share/nginx/html` và nạp cấu hình `nginx.conf`.
* **Hiệu quả:** Không để lộ source code, Nginx xử lý phục vụ static files với hiệu năng cao kèm nén Gzip.

---

## 3. Hệ thống Giám sát Sức khỏe (Health Checks & Monitoring)

Backend tích hợp sẵn chuẩn **ASP.NET Core Health Checks** với các endpoint chuyên biệt:

| Endpoint | Mục đích | Tiêu chuẩn đánh giá |
| :--- | :--- | :--- |
| **`/health`** | Tổng quan toàn bộ hệ thống | Trả về JSON trạng thái tổng quan + chi tiết từng thành phần. |
| **`/health/live`** | Liveness Probe (Docker/K8s) | Kiểm tra tiến trình Backend API có đang sống và phản hồi hay không. |
| **`/health/ready`** | Readiness Probe (SQL Server) | Thực hiện kiểm tra kết nối thực tế tới SQL Server Database (`CanConnectAsync`). |

### Cấu hình Docker Healthcheck trong `docker-compose.yml`:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health/ready"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 20s
```

Frontend được cấu hình `depends_on: backend (condition: service_healthy)` để đảm bảo Nginx chỉ nhận request khi Backend và SQL Server đã sẵn sàng 100%.

---

## 4. Hướng dẫn Vận hành Hệ thống

### Khởi động toàn bộ dịch vụ:
```bash
# Build và chạy ngầm các container
docker compose up -d --build

# Xem trạng thái các container và health check
docker compose ps

# Theo dõi log thời gian thực của backend
docker logs -f internlink_api
```

### Chạy công cụ Chẩn đoán Tự động (Troubleshooting Toolkit):
```powershell
# Chạy script chẩn đoán toàn diện hệ thống
.\scripts\troubleshoot.ps1
```

---

## 5. Cẩm nang Xử lý Sự cố Thường Gặp (Troubleshooting Runbook)

### Tình huống 1: Container Backend báo `Unhealthy` hoặc không kết nối được SQL Server
* **Triệu chứng:** Khi chạy `docker compose ps`, container `internlink_api` hiển thị `(unhealthy)`, gọi `/health/ready` trả về lỗi hoặc HTTP 503.
* **Nguyên nhân:**
  1. Service SQL Server trên máy host chưa được bật.
  2. SQL Server không cho phép xác thực SQL Server Authentication (`sa`).
  3. TCP/IP port 1433 bị tắt trong SQL Server Configuration Manager.
* **Cách khắc phục:**
  1. Mở `services.msc`, kiểm tra service `SQL Server (MSSQLSERVER)` hoặc `SQL Server (SQLEXPRESS)` có trạng thái `Running`.
  2. Mở `SQL Server Configuration Manager` $\rightarrow$ `SQL Server Network Configuration` $\rightarrow$ `Protocols for MSSQLSERVER` $\rightarrow$ Bật `TCP/IP` (Enabled) và kiểm tra TCP Port là `1433`.
  3. Chạy `.\scripts\troubleshoot.ps1` để kiểm tra lại kết nối TCP.

### Tình huống 2: Lỗi CORS khi gọi REST API từ Frontend
* **Triệu chứng:** Browser Console báo lỗi `Access-Control-Allow-Origin header is missing on the requested resource`.
* **Cách khắc phục:**
  1. Trong `docker-compose.yml`, kiểm tra danh sách `Cors__AllowedOrigins` đã bao gồm URL của Frontend (ví dụ: `http://localhost:3000`).
  2. Hoặc sử dụng Nginx Reverse Proxy (gọi qua `/api/` cùng origin với frontend `http://localhost:3000/api/...` để triệt tiêu hoàn toàn vấn đề CORS).

### Tình huống 3: Lỗi 404 khi tải lại trang (F5) trong React SPA
* **Triệu chứng:** Truy cập `http://localhost:3000/students` trực tiếp hoặc nhấn F5 bị báo lỗi 404 Not Found từ Nginx.
* **Cách khắc phục:** Đã được xử lý triệt để trong `frontend/nginx.conf` với chỉ thị:
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```
