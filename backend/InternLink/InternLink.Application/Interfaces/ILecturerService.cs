using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface ILecturerService
{
    Task<IEnumerable<InternshipDto>> GetInternshipsAsync(Guid userId);
    Task<InternshipDetailDto?> GetInternshipAsync(Guid internshipId, Guid userId);
    Task<IEnumerable<SubmissionDto>> GetSubmissionsByInternshipAsync(Guid internshipId, Guid userId);
    Task<FeedbackDto?> AddFeedbackAsync(Guid submissionId, Guid authorId, CreateFeedbackRequest request);
    Task<byte[]> ExportEndOfTermExcelAsync(Guid userId);
}
