using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface ISubmissionService
{
    Task<SubmissionDto?> GetByIdAsync(Guid id);
    Task<SubmissionDto?> GetByIdAsync(Guid id, Guid userId, bool isLecturerOrAdmin);
    Task<IEnumerable<SubmissionDto>> GetByInternshipAsync(Guid internshipId);
    Task<IEnumerable<SubmissionDto>> GetByInternshipAsync(Guid internshipId, Guid userId, bool isLecturerOrAdmin);
    Task<IEnumerable<SubmissionDto>> GetMineAsync(Guid userId);
    Task<SubmissionDto> CreateAsync(Guid userId, CreateSubmissionRequest request);
    Task<SubmissionDto> CreateWithFileAsync(Guid userId, CreateSubmissionRequest request, Stream fileStream, string originalFileName);
    Task<SubmissionDto?> ResubmitAsync(Guid id, Guid userId, ResubmitRequest request);
    Task<SubmissionDto?> ResubmitWithFileAsync(Guid id, Guid userId, ResubmitRequest request, Stream fileStream, string originalFileName);
    Task<SubmissionFileDownloadDto?> DownloadFileAsync(Guid submissionId, Guid userId, bool isLecturerOrAdmin);
    Task<SubmissionDto?> UpdateStatusAsync(Guid id, UpdateSubmissionStatusRequest request, Guid? actorUserId = null);
    Task<bool> SoftDeleteAsync(Guid id, Guid? actorUserId = null);

    Task<IEnumerable<FeedbackDto>> GetFeedbacksAsync(Guid submissionId, Guid userId, bool isLecturer);
    Task<FeedbackDto?> AddFeedbackAsync(Guid submissionId, Guid authorId, CreateFeedbackRequest request);
    Task<FeedbackDto?> UpdateFeedbackAsync(Guid feedbackId, Guid authorId, UpdateFeedbackRequest request);
}
