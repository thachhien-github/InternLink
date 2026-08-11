using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface IWeeklyReportService
{
    Task<WeeklyReportDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<WeeklyReportDto>> GetMineAsync(Guid userId);
    Task<IEnumerable<WeeklyReportDto>> GetByInternshipAsync(Guid internshipId);
    Task<WeeklyReportDto> CreateDraftAsync(Guid userId, CreateWeeklyReportRequest request);
    Task<WeeklyReportDto?> UpdateDraftAsync(Guid id, Guid userId, UpdateWeeklyReportRequest request);
    Task<WeeklyReportDto?> SubmitAsync(Guid id, Guid userId);
    Task<WeeklyReportDto?> ReviewAsync(Guid id, ReviewWeeklyReportRequest request);
    Task<bool> SoftDeleteAsync(Guid id, Guid userId);
}
