using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface IWeeklyReportService
{
    Task<WeeklyReportDto?> GetByIdAsync(Guid id);
    Task<WeeklyReportDto?> GetByIdAsync(Guid id, Guid userId, bool isLecturerOrAdmin);
    Task<IEnumerable<WeeklyReportDto>> GetMineAsync(Guid userId);
    Task<IEnumerable<WeeklyReportDto>> GetByInternshipAsync(Guid internshipId);
    Task<IEnumerable<WeeklyReportDto>> GetByInternshipAsync(Guid internshipId, Guid userId, bool isLecturerOrAdmin);
    Task<WeeklyReportDto> CreateDraftAsync(Guid userId, CreateWeeklyReportRequest request);
    Task<WeeklyReportDto> CreateDraftWithFileAsync(Guid userId, CreateWeeklyReportRequest request, Stream fileStream, string originalFileName, long fileSize, string mimeType);
    Task<WeeklyReportDto?> UpdateDraftAsync(Guid id, Guid userId, UpdateWeeklyReportRequest request);
    Task<WeeklyReportDto?> UpdateDraftWithFileAsync(Guid id, Guid userId, UpdateWeeklyReportRequest request, Stream fileStream, string originalFileName, long fileSize, string mimeType);
    Task<WeeklyReportDto?> SubmitAsync(Guid id, Guid userId);
    Task<WeeklyReportFileDownloadDto?> DownloadFileAsync(Guid id, Guid userId, bool isLecturerOrAdmin);
    Task<WeeklyReportDto?> ReviewAsync(Guid id, ReviewWeeklyReportRequest request);
    Task<WeeklyReportDto?> ReviewAsync(Guid id, Guid userId, ReviewWeeklyReportRequest request);
    Task<bool> SoftDeleteAsync(Guid id, Guid userId);
}

public sealed class WeeklyReportFileDownloadDto
{
    public byte[] FileContent { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public string MimeType { get; set; } = "application/octet-stream";
}
