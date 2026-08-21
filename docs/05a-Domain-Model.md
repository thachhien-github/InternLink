# InternLink — Mô Hình Miền Nghiệp Vụ (Domain Model)

**Dự án:** InternLink — Nền tảng Quản lý và Giám sát Thực tập Tốt nghiệp  
**Phiên bản:** 3.0  
**Ngày cập nhật:** Tháng 8/2026

---

## 1. Danh Sách 14 Thực Thể Nghiệp Vụ Cốt Lõi (Domain Entities)

Hệ thống được thiết kế theo mô hình Clean Architecture (DDD-lite) với **14 thực thể miền**:

| STT | Thực Thể (Entity) | Ý Nghĩa Nghiệp Vụ & Vai Trò |
| :---: | :--- | :--- |
| **01** | `User` | Tài khoản xác thực trung tâm (Username, PasswordHash, Role, Email, MustChangePassword, IsActive). |
| **02** | `RefreshToken` | Quản lý token làm mới phiên đăng nhập JWT của người dùng. |
| **03** | `PasswordResetToken` | Mã xác thực đặt lại mật khẩu khi người dùng quên mật khẩu. |
| **04** | `Semester` | Học kỳ thực tập (Code, Name, StartDate, EndDate, IsCurrent). Là ngữ cảnh phân chia dữ liệu toàn hệ thống. |
| **05** | `Student` | Hồ sơ sinh viên (StudentCode - MSSV, FullName, Class, Major, Phone, GPA, UserId). |
| **06** | `Lecturer` | Hồ sơ giảng viên hướng dẫn (StaffCode, FullName, Department, Title, AcademicRank, Phone, UserId). |
| **07** | `Company` | Doanh nghiệp tiếp nhận thực tập (CompanyName, Address, Industry, ContactPerson, ContactEmail, ContactPhone). |
| **08** | `Internship` | Bản ghi đợt thực tập liên kết giữa `Student`, `Lecturer`, `Company` và `Semester` (Status, Position, StartDate, EndDate). |
| **09** | `WeeklyReport` | Nhật ký báo cáo tiến độ tuần (WeekNumber 1-12, Content, PlanNextWeek, Obstacles, Attachments, Status, ReviewNotes). |
| **10** | `Submission` | Bài nộp đồ án / báo cáo cuối kỳ (Title, Type, Version, FileUrl, FileSize, Status, SubmittedAt). |
| **11** | `Feedback` | Nhận xét, góp ý của GVHD dành cho bài nộp `Submission` của sinh viên. |
| **12** | `Evaluation` | Bảng điểm đánh giá Rubric (TechnicalScore, AttitudeScore, SoftSkillsScore, FinalReportScore, TotalScore, FinalGrade, Comments, IsFinalized). |
| **13** | `Document` | Tài liệu biểu mẫu của Khoa hoặc tài liệu đính kèm do sinh viên/GVHD tải lên (Title, Category, FilePath, MimeType, FileSize). |
| **14** | `Notification` | Thông báo hệ thống và tin nhắn Broadcast thời gian thực (Title, Message, Type, IsRead, UserId). |

---

## 2. Mối Quan Hệ Giữa Các Thực Thể (Entity Relationships)

```
[ Semester ] ─── (1:N) ───► [ Internship ]
                                │
   ┌────────────────────────────┼────────────────────────────┐
   │ (N:1)                      │ (N:1)                      │ (N:1)
[ Student ]                  [ Lecturer ]                 [ Company ]
   │                            │
   │ (1:1)                      │ (1:1)
[ User ]                     [ User ]
   ▲
   │ (1:N)
[ Notification ]

[ Internship ] ─── (1:N) ───► [ WeeklyReport ]
[ Internship ] ─── (1:N) ───► [ Submission ] ─── (1:N) ───► [ Feedback ]
[ Internship ] ─── (1:1) ───► [ Evaluation ]
[ Internship ] ─── (1:N) ───► [ Document ]
```

---

## 3. Các Quy Tắc Nghiệp Vụ Bất Biến (Domain Invariants)

1. **Một sinh viên chỉ có 1 đợt thực tập hoạt động trong 1 học kỳ**: Cặp `(StudentId, SemesterId)` là duy nhất.
2. **Khóa điểm bất biến**: Khi `Evaluation.IsFinalized = true`, điểm số không thể bị thay đổi trừ khi SuperAdmin mở khóa.
3. **Tuần báo cáo hợp lệ**: `WeeklyReport.WeekNumber` nhận giá trị từ `1` đến `12`.
4. **Trọng số tính điểm tổng kết**:
   $$\text{TotalScore} = (\text{Technical} \times 0.4) + (\text{Attitude} \times 0.2) + (\text{SoftSkills} \times 0.2) + (\text{FinalReport} \times 0.2)$$
5. **Soft Delete chuẩn hóa**: Tất cả các thực thể đều kế thừa `BaseEntity` với cờ `IsDeleted`, `CreatedAt`, `UpdatedAt` để bảo đảm truy vết lịch sử.
