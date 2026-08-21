# InternLink — Từ Điển Dữ Liệu (Data Dictionary)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0  
**Ngày cập nhật:** Tháng 8/2026

---

## 1. Bảng `Users` (Người dùng hệ thống)

| Tên Cột | Kiểu Dữ Liệu | Nullable | Mô Tả / Ràng Buộc |
| :--- | :--- | :---: | :--- |
| `Id` | `uniqueidentifier` | No | Khóa chính (PK), GUID tự sinh. |
| `Username` | `nvarchar(50)` | No | Tên đăng nhập (MSSV / Mã GV / `admin`), Unique Index. |
| `PasswordHash` | `nvarchar(500)` | No | Chuỗi mã hóa mật khẩu theo chuẩn PBKDF2. |
| `Email` | `nvarchar(150)` | No | Email liên hệ chính của người dùng. |
| `FullName` | `nvarchar(150)` | No | Họ và tên đầy đủ. |
| `Role` | `int` | No | Vai trò: `0 = Student`, `1 = Lecturer`, `2 = SuperAdmin`. |
| `MustChangePassword` | `bit` | No | Cờ bắt buộc đổi mật khẩu khi đăng nhập lần đầu (`1 = True`). |
| `IsActive` | `bit` | No | Trạng thái kích hoạt tài khoản (`1 = Active`, `0 = Locked`). |
| `LastLoginAt` | `datetime2` | Yes | Thời điểm đăng nhập gần nhất. |
| `IsDeleted` | `bit` | No | Cờ xóa mềm (`0 = Active`, `1 = Deleted`). |
| `CreatedAt` | `datetime2` | No | Thời điểm tạo bản ghi (UTC). |

---

## 2. Bảng `Semesters` (Học kỳ thực tập)

| Tên Cột | Kiểu Dữ Liệu | Nullable | Mô Tả / Ràng Buộc |
| :--- | :--- | :---: | :--- |
| `Id` | `uniqueidentifier` | No | Khóa chính (PK). |
| `Code` | `nvarchar(20)` | No | Mã học kỳ (VD: `2025_2026_HK1`), Unique Index. |
| `Name` | `nvarchar(100)` | No | Tên hiển thị (VD: `Học kỳ 1 - Năm học 2025-2026`). |
| `StartDate` | `datetime2` | No | Ngày bắt đầu học kỳ thực tập. |
| `EndDate` | `datetime2` | No | Ngày kết thúc học kỳ thực tập. |
| `IsCurrent` | `bit` | No | Đánh dấu học kỳ hiện tại đang hoạt động (`1 = True`). |
| `IsDeleted` | `bit` | No | Cờ xóa mềm. |

---

## 3. Bảng `Students` (Hồ sơ Sinh viên)

| Tên Cột | Kiểu Dữ Liệu | Nullable | Mô Tả / Ràng Buộc |
| :--- | :--- | :---: | :--- |
| `Id` | `uniqueidentifier` | No | Khóa chính (PK). |
| `UserId` | `uniqueidentifier` | No | Khóa ngoại tham chiếu `Users(Id)`. |
| `StudentCode` | `nvarchar(20)` | No | Mã số sinh viên (MSSV), Unique Index. |
| `FullName` | `nvarchar(150)` | No | Họ và tên sinh viên. |
| `Class` | `nvarchar(50)` | Yes | Lớp sinh hoạt (VD: `CNTT-K15A`). |
| `Major` | `nvarchar(100)` | Yes | Chuyên ngành đào tạo (VD: `Kỹ thuật phần mềm`). |
| `Phone` | `nvarchar(20)` | Yes | Số điện thoại liên lạc. |
| `GPA` | `decimal(4,2)` | Yes | Điểm trung bình tích lũy hiện tại. |
| `IsDeleted` | `bit` | No | Cờ xóa mềm. |

---

## 4. Bảng `Lecturers` (Hồ sơ Giảng viên)

| Tên Cột | Kiểu Dữ Liệu | Nullable | Mô Tả / Ràng Buộc |
| :--- | :--- | :---: | :--- |
| `Id` | `uniqueidentifier` | No | Khóa chính (PK). |
| `UserId` | `uniqueidentifier` | No | Khóa ngoại tham chiếu `Users(Id)`. |
| `StaffCode` | `nvarchar(20)` | No | Mã cán bộ / Giảng viên (VD: `gv001`), Unique Index. |
| `FullName` | `nvarchar(150)` | No | Họ và tên giảng viên. |
| `Department` | `nvarchar(100)` | Yes | Bộ môn / Khoa trực thuộc. |
| `AcademicRank` | `nvarchar(50)` | Yes | Học hàm, học vị (VD: `Thạc sĩ`, `Tiến sĩ`). |
| `Title` | `nvarchar(50)` | Yes | Chức vụ trong Khoa. |
| `Phone` | `nvarchar(20)` | Yes | Số điện thoại liên hệ. |
| `IsDeleted` | `bit` | No | Cờ xóa mềm. |

---

## 5. Bảng `Internships` (Đợt Thực tập)

| Tên Cột | Kiểu Dữ Liệu | Nullable | Mô Tả / Ràng Buộc |
| :--- | :--- | :---: | :--- |
| `Id` | `uniqueidentifier` | No | Khóa chính (PK). |
| `SemesterId` | `uniqueidentifier` | No | Khóa ngoại `Semesters(Id)`. |
| `StudentId` | `uniqueidentifier` | No | Khóa ngoại `Students(Id)`. |
| `LecturerId` | `uniqueidentifier` | Yes | Khóa ngoại `Lecturers(Id)`. |
| `CompanyId` | `uniqueidentifier` | Yes | Khóa ngoại `Companies(Id)`. |
| `Position` | `nvarchar(100)` | Yes | Vị trí thực tập (VD: `Backend Developer Intern`). |
| `TopicTitle` | `nvarchar(255)` | Yes | Tên đề tài đồ án thực tập. |
| `StartDate` | `datetime2` | Yes | Ngày bắt đầu thực tập tại doanh nghiệp. |
| `EndDate` | `datetime2` | Yes | Ngày kết thúc thực tập. |
| `Status` | `int` | No | Trạng thái: `0 = Assigned`, `1 = InProgress`, `2 = Completed`, `3 = Suspended`. |
| `IsDeleted` | `bit` | No | Cờ xóa mềm. |

---

## 6. Bảng `WeeklyReports` (Nhật ký 12 Tuần)

| Tên Cột | Kiểu Dữ Liệu | Nullable | Mô Tả / Ràng Buộc |
| :--- | :--- | :---: | :--- |
| `Id` | `uniqueidentifier` | No | Khóa chính (PK). |
| `InternshipId` | `uniqueidentifier` | No | Khóa ngoại `Internships(Id)`. |
| `WeekNumber` | `int` | No | Số thứ tự tuần (từ `1` đến `12`). |
| `Content` | `nvarchar(max)` | No | Nội dung công việc đã làm trong tuần. |
| `PlanNextWeek` | `nvarchar(max)` | Yes | Kế hoạch tuần tiếp theo. |
| `Obstacles` | `nvarchar(max)` | Yes | Khó khăn, vướng mắc cần hỗ trợ. |
| `Attachments` | `nvarchar(max)` | Yes | Danh sách link/tên tệp minh chứng đính kèm. |
| `Status` | `int` | No | Trạng thái duyệt: `0 = Draft`, `1 = Submitted`, `2 = Approved`, `3 = Rejected`. |
| `ReviewNotes` | `nvarchar(max)` | Yes | Nhận xét góp ý của GVHD. |
| `Score` | `decimal(4,2)` | Yes | Điểm tuần (thang điểm 10). |
| `SubmittedAt` | `datetime2` | Yes | Thời điểm nộp báo cáo. |
| `IsDeleted` | `bit` | No | Cờ xóa mềm. |

---

## 7. Bảng `Evaluations` (Đánh giá Rubric & Tổng kết)

| Tên Cột | Kiểu Dữ Liệu | Nullable | Mô Tả / Ràng Buộc |
| :--- | :--- | :---: | :--- |
| `Id` | `uniqueidentifier` | No | Khóa chính (PK). |
| `InternshipId` | `uniqueidentifier` | No | Khóa ngoại `Internships(Id)`, Unique Index (1:1). |
| `LecturerId` | `uniqueidentifier` | No | Khóa ngoại `Lecturers(Id)`. |
| `TechnicalScore` | `decimal(4,2)` | No | Điểm Chuyên môn & Kỹ thuật (Trọng số 40%). |
| `AttitudeScore` | `decimal(4,2)` | No | Điểm Thái độ & Kỷ luật (Trọng số 20%). |
| `SoftSkillsScore` | `decimal(4,2)` | No | Điểm Kỹ năng mềm & Giao tiếp (Trọng số 20%). |
| `FinalReportScore`| `decimal(4,2)` | No | Điểm Báo cáo & Thuyết trình cuối kỳ (Trọng số 20%). |
| `TotalScore` | `decimal(4,2)` | No | Điểm tổng kết hệ 10 = $\sum(\text{Điểm} \times \text{Trọng số})$. |
| `FinalGrade` | `nvarchar(20)` | No | Xếp loại học lực: `Xuất sắc`, `Giỏi`, `Khá`, `Trung bình`, `Không đạt`. |
| `LecturerComments`| `nvarchar(max)`| Yes | Nhận xét chi tiết của GVHD. |
| `IsFinalized` | `bit` | No | Trạng thái chốt điểm (`1 = Đã khóa điểm`). |
| `FinalizedAt` | `datetime2` | Yes | Thời điểm khóa điểm chính thức. |
| `IsDeleted` | `bit` | No | Cờ xóa mềm. |

---

## 8. Bảng `Documents` (Tài liệu & Biểu mẫu)

| Tên Cột | Kiểu Dữ Liệu | Nullable | Mô Tả / Ràng Buộc |
| :--- | :--- | :---: | :--- |
| `Id` | `uniqueidentifier` | No | Khóa chính (PK). |
| `InternshipId` | `uniqueidentifier` | Yes | Khóa ngoại `Internships(Id)` (Null nếu là tài liệu chung của Khoa). |
| `UploadedById` | `uniqueidentifier` | Yes | Khóa ngoại người tải lên (`Lecturers` hoặc `Students`). |
| `Title` | `nvarchar(255)` | No | Tên tài liệu. |
| `Category` | `nvarchar(50)` | No | Danh mục: `Template`, `Report`, `Contract`, `Evidence`. |
| `FileName` | `nvarchar(255)` | No | Tên file gốc người dùng tải lên. |
| `FilePath` | `nvarchar(500)` | No | Đường dẫn lưu trữ vật lý trên server (`uploads/documents/...`). |
| `MimeType` | `nvarchar(100)` | No | Định dạng MIME (`application/pdf`, `image/png`...). |
| `FileSize` | `bigint` | No | Dung lượng file tính bằng Bytes. |
| `IsRequired` | `bit` | No | Cờ đánh dấu tài liệu bắt buộc nộp. |
| `IsDeleted` | `bit` | No | Cờ xóa mềm. |
