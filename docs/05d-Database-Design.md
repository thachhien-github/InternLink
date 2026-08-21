# InternLink — Thiết Kế Cơ Sở Dữ Liệu SQL Server (Database Design)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0  
**Ngày cập nhật:** Tháng 8/2026

---

## 1. Công Nghệ & Chiến Lược CSDL (DBMS & Technology Stack)

- **Hệ quản trị CSDL**: Microsoft SQL Server 2022.
- **ORM / Data Access**: Entity Framework Core 10 (Code-First Migrations).
- **Quy ước đặt tên**:
  - Bảng: Tên tiếng Anh số nhiều, PascalCase (`Users`, `Semesters`, `Internships`, `WeeklyReports`).
  - Khóa chính (PK): `Id` kiểu `uniqueidentifier` (GUID v4) giúp chống lộ ID tuần tự và tối ưu khi mở rộng phân tán.
  - Khóa ngoại (FK): `{Entity}Id` (VD: `UserId`, `SemesterId`, `InternshipId`).
  - Cột thời gian: `CreatedAt`, `UpdatedAt`, `DeletedAt` sử dụng chuẩn `datetime2` và múi giờ UTC.

---

## 2. Chiến Lược Đánh Chỉ Mục (Indexing Strategy)

Nhằm tối ưu hóa tốc độ truy vấn cho các tác vụ tìm kiếm, lọc theo học kỳ và tổng hợp báo cáo:

| Bảng | Tên Index | Loại Index | Cột Được Index | Mục Đích Tối Ưu |
| :--- | :--- | :---: | :--- | :--- |
| `Users` | `IX_Users_Username` | Unique | `Username` | Đăng nhập tốc độ cao ($O(1)$). |
| `Semesters` | `IX_Semesters_Code` | Unique | `Code` | Tìm kiếm học kỳ theo mã. |
| `Semesters` | `IX_Semesters_IsCurrent` | Non-Clustered | `IsCurrent` | Truy vấn học kỳ hiện tại đang chạy. |
| `Students` | `IX_Students_StudentCode` | Unique | `StudentCode` | Tra cứu hồ sơ theo MSSV. |
| `Lecturers` | `IX_Lecturers_StaffCode` | Unique | `StaffCode` | Tra cứu hồ sơ theo Mã GV. |
| `Internships`| `IX_Internships_Semester_Student` | Unique | `(SemesterId, StudentId)` | Bảo đảm 1 SV chỉ có 1 đợt thực tập/kỳ. |
| `Internships`| `IX_Internships_LecturerId` | Non-Clustered | `LecturerId` | Lọc danh sách SV theo GVHD. |
| `WeeklyReports`| `IX_WeeklyReports_Internship_Week` | Unique | `(InternshipId, WeekNumber)` | Bảo đảm 1 SV chỉ nộp 1 báo cáo/tuần. |
| `Evaluations`| `IX_Evaluations_InternshipId` | Unique | `InternshipId` | Quan hệ 1:1 giữa thực tập và điểm số. |

---

## 3. Cơ Chế Xóa Mềm & Toàn Vẹn Lịch Sử (Soft Delete)

1. **Global Query Filter trong EF Core**:
   Tất cả các câu lệnh LINQ tự động áp dụng bộ lọc `Where(e => !e.IsDeleted)` trong `AppDbContext.cs`:
   ```csharp
   modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);
   modelBuilder.Entity<Semester>().HasQueryFilter(s => !s.IsDeleted);
   modelBuilder.Entity<Internship>().HasQueryFilter(i => !i.IsDeleted);
   modelBuilder.Entity<WeeklyReport>().HasQueryFilter(w => !w.IsDeleted);
   modelBuilder.Entity<Evaluation>().HasQueryFilter(e => !e.IsDeleted);
   ```
2. **Lợi ích**:
   - Không làm mất lịch sử thực tập của các khóa trước khi xóa tài khoản sinh viên/học kỳ cũ.
   - Cho phép khôi phục dữ liệu nhanh chóng khi có thao tác nhầm lẫn từ phía người dùng.

---

## 4. Phân Vùng Dữ Liệu Theo Học Kỳ (Semester Scoping)

- Mọi thực thể tiến độ (`WeeklyReport`, `Submission`, `Evaluation`, `Document`) đều liên kết chặt chẽ với `Internship`.
- `Internship` bắt buộc gắn với `SemesterId`.
- Nhờ cấu trúc này, khi bước sang học kỳ mới, hệ thống tự động lọc và hiển thị đúng dữ liệu của học kỳ đang kích hoạt (`IsCurrent = true`) mà không làm xáo trộn dữ liệu của các kỳ trước.
