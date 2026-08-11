using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface ISubmissionService
{
    Task<SubmissionDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<SubmissionDto>> GetByInternshipAsync(Guid internshipId);
    Task<IEnumerable<SubmissionDto>> GetMineAsync(Guid userId);
    Task<SubmissionDto> CreateAsync(Guid userId, CreateSubmissionRequest request);
    Task<SubmissionDto?> ResubmitAsync(Guid id, Guid userId, ResubmitRequest request);
    Task<SubmissionDto?> UpdateStatusAsync(Guid id, UpdateSubmissionStatusRequest request);
    Task<bool> SoftDeleteAsync(Guid id);

    Task<IEnumerable<FeedbackDto>> GetFeedbacksAsync(Guid submissionId, Guid userId, bool isLecturer);
    Task<FeedbackDto?> AddFeedbackAsync(Guid submissionId, Guid authorId, CreateFeedbackRequest request);
    Task<FeedbackDto?> UpdateFeedbackAsync(Guid feedbackId, Guid authorId, UpdateFeedbackRequest request);
}
