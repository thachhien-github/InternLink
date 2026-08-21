using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface ILecturerService
{
    Task<LecturerOverviewDto?> GetMeAsync(Guid userId);
    Task<LecturerDashboardStatsDto> GetDashboardStatsAsync(Guid userId);
    Task<IEnumerable<LecturerStudentListItemDto>> GetAssignedStudentsAsync(Guid userId, string? search = null, string? status = null);
    Task<IEnumerable<LecturerCompanySummaryDto>> GetAssignedCompaniesAsync(Guid userId);
    Task<IEnumerable<InternshipDto>> GetInternshipsAsync(Guid userId);
    Task<InternshipDetailDto?> GetInternshipAsync(Guid internshipId, Guid userId);
    Task<IEnumerable<SubmissionDto>> GetSubmissionsByInternshipAsync(Guid internshipId, Guid userId);
    Task<FeedbackDto?> AddFeedbackAsync(Guid submissionId, Guid authorId, CreateFeedbackRequest request);
    Task<byte[]> ExportEndOfTermExcelAsync(Guid userId);
}

