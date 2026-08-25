namespace InternLink.Application.DTOs.Export;

/// <summary>
/// DTO representing lecturer assignment and student-company mapping in Sheet 3 (DATABASE / DANH SÁCH GIẢNG VIÊN PHÂN CÔNG).
/// </summary>
public class LecturerAssignmentExportDto
{
    public int Stt { get; set; }
    public string StudentFullName { get; set; } = string.Empty;
    public string StudentClass { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string LecturerName { get; set; } = string.Empty;
    public string LecturerDepartment { get; set; } = string.Empty;
}
