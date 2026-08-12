# SQL Scripts

**Lưu ý:** Schema chính thức được quản lý bởi **EF Core migrations** — không chỉnh schema thủ công trừ khi có lý do đặc biệt.

## Khi nào dùng script ở đây

| Script | Mục đích |
|--------|----------|
| `verify-schema.sql` | Sau `dotnet ef database update`, kiểm tra bảng/cột/index tồn tại |

## Không dùng script để

- Tạo bảng thay migration (sẽ lệch với EF snapshot).
- Seed production (dùng API seed / tool riêng).

## LocalDB (Development)

Database name mặc định: `InternLink`  
Connection: `(localdb)\mssqllocaldb`

EF tự tạo DB khi chạy `database update` hoặc khi API start (nếu đã migrate).
