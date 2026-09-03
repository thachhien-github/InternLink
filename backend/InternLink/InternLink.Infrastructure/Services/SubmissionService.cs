using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class SubmissionService : ISubmissionService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly INotificationService _notificationService;
    private readonly IWebHostEnvironment _env;

    private const string UploadFolder = "uploads/submissions";
    private static readonly string[] AllowedExtensions =
    {
        ".zip", ".rar", ".pdf", ".pptx", ".ppt", ".mp4", ".mov", ".sql", ".docx", ".doc",
    };

    public SubmissionService(
        AppDbContext db,
        IMapper mapper,
        INotificationService notificationService,
        IWebHostEnvironment env)
    {
        _db = db;
        _mapper = mapper;
        _notificationService = notificationService;
        _env = env;
    }

    public async Task<SubmissionDto?> GetByIdAsync(Guid id)
    {
        var submission = await _db.Submissions
            .Include(s => s.Feedbacks.Where(f => !f.IsDeleted))
                .ThenInclude(f => f.Lecturer)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        return submission == null ? null : _mapper.Map<SubmissionDto>(submission);
    }

    public async Task<SubmissionDto?> GetByIdAsync(Guid id, Guid userId, bool isLecturerOrAdmin)
    {
        var submission = await _db.Submissions
            .Include(s => s.Internship)
                .ThenInclude(i => i.Student)
            .Include(s => s.Internship)
                .ThenInclude(i => i.Lecturer)
            .Include(s => s.Feedbacks.Where(f => !f.IsDeleted))
                .ThenInclude(f => f.Lecturer)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (submission == null)
            return null;

        var ownsInternship = submission.Internship.Student?.UserId == userId;
        var isAssignedLecturer = submission.Internship.Lecturer?.UserId == userId;

        if (!isLecturerOrAdmin && !ownsInternship)
            throw new UnauthorizedAccessException("You do not have access to this submission");

        if (isLecturerOrAdmin && !isAssignedLecturer && !ownsInternship)
        {
            var isSuperAdmin = await _db.Users
                .AnyAsync(u => u.Id == userId && u.Role == Role.SuperAdmin && !u.IsDeleted);
            if (!isSuperAdmin)
                throw new UnauthorizedAccessException("You do not have access to this submission");
        }

        return _mapper.Map<SubmissionDto>(submission);
    }

    public async Task<IEnumerable<SubmissionDto>> GetByInternshipAsync(Guid internshipId)
    {
        return await GetByInternshipAsync(internshipId, Guid.Empty, isLecturerOrAdmin: true);
    }

    public async Task<IEnumerable<SubmissionDto>> GetByInternshipAsync(Guid internshipId, Guid userId, bool isLecturerOrAdmin)
    {
        if (userId != Guid.Empty)
            await EnsureInternshipAccessAsync(internshipId, userId, isLecturerOrAdmin);

        var submissions = await _db.Submissions
            .Where(s => s.InternshipId == internshipId && !s.IsDeleted)
            .Include(s => s.Feedbacks.Where(f => !f.IsDeleted))
                .ThenInclude(f => f.Lecturer)
            .OrderByDescending(s => s.SubmittedAt)
            .ToListAsync();

        return _mapper.Map<List<SubmissionDto>>(submissions);
    }

    public async Task<IEnumerable<SubmissionDto>> GetMineAsync(Guid userId)
    {
        var internship = await GetStudentInternshipAsync(userId);
        if (internship == null)
            return Array.Empty<SubmissionDto>();

        return await GetByInternshipAsync(internship.Id);
    }

    public async Task<SubmissionDto> CreateAsync(Guid userId, CreateSubmissionRequest request)
    {
        var internship = await _db.Internships
            .Include(i => i.Student)
            .FirstOrDefaultAsync(i => i.Id == request.InternshipId && !i.IsDeleted);

        if (internship == null)
            throw new InvalidOperationException("Internship not found");

        if (internship.Student?.UserId != userId)
            throw new UnauthorizedAccessException("Internship does not belong to the current student");

        if (!Enum.TryParse<SubmissionType>(request.Type, true, out var type))
            throw new InvalidOperationException($"Invalid submission type: {request.Type}");

        var submission = new Submission
        {
            Id = Guid.NewGuid(),
            InternshipId = request.InternshipId,
            Type = type,
            Status = SubmissionStatus.Submitted,
            Version = 1,
            Title = request.Title,
            Description = request.Description,
            FileName = request.FileName,
            FileUrl = request.FileUrl,
            SubmittedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        _db.Submissions.Add(submission);
        await _db.SaveChangesAsync();

        return (await GetByIdAsync(submission.Id))!;
    }

    public async Task<SubmissionDto> CreateWithFileAsync(
        Guid userId,
        CreateSubmissionRequest request,
        Stream fileStream,
        string originalFileName)
    {
        var (relativePath, savedFileName) = await SaveSubmissionFileAsync(
            fileStream,
            originalFileName,
            request.InternshipId);

        request.FileName = savedFileName;
        request.FileUrl = relativePath;
        return await CreateAsync(userId, request);
    }

    public async Task<SubmissionDto?> ResubmitAsync(Guid id, Guid userId, ResubmitRequest request)
    {
        var existing = await _db.Submissions
            .Include(s => s.Internship)
                .ThenInclude(i => i.Student)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (existing == null)
            return null;

        if (existing.Internship.Student?.UserId != userId)
            throw new UnauthorizedAccessException("Submission does not belong to the current student");

        if (existing.Status != SubmissionStatus.RevisionRequested)
            throw new InvalidOperationException("Resubmit is only allowed when status is RevisionRequested");

        var maxVersion = await _db.Submissions
            .Where(s => s.InternshipId == existing.InternshipId
                        && s.Type == existing.Type
                        && !s.IsDeleted)
            .MaxAsync(s => (int?)s.Version) ?? existing.Version;

        var resubmission = new Submission
        {
            Id = Guid.NewGuid(),
            InternshipId = existing.InternshipId,
            Type = existing.Type,
            Status = SubmissionStatus.Submitted,
            Version = maxVersion + 1,
            Title = request.Title ?? existing.Title,
            Description = request.Description ?? existing.Description,
            FileName = request.FileName ?? existing.FileName,
            FileUrl = request.FileUrl ?? existing.FileUrl,
            SubmittedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        _db.Submissions.Add(resubmission);
        await _db.SaveChangesAsync();

        return await GetByIdAsync(resubmission.Id);
    }

    public async Task<SubmissionDto?> ResubmitWithFileAsync(
        Guid id,
        Guid userId,
        ResubmitRequest request,
        Stream fileStream,
        string originalFileName)
    {
        var existing = await _db.Submissions
            .Include(s => s.Internship)
                .ThenInclude(i => i.Student)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (existing == null)
            return null;

        var (relativePath, savedFileName) = await SaveSubmissionFileAsync(
            fileStream,
            originalFileName,
            existing.InternshipId);

        request.FileName = savedFileName;
        request.FileUrl = relativePath;
        return await ResubmitAsync(id, userId, request);
    }

    public async Task<SubmissionFileDownloadDto?> DownloadFileAsync(
        Guid submissionId,
        Guid userId,
        bool isLecturerOrAdmin)
    {
        var submission = await _db.Submissions
            .Include(s => s.Internship)
                .ThenInclude(i => i.Student)
            .Include(s => s.Internship)
                .ThenInclude(i => i.Lecturer)
            .FirstOrDefaultAsync(s => s.Id == submissionId && !s.IsDeleted);

        if (submission == null || string.IsNullOrWhiteSpace(submission.FileUrl))
            return null;

        var ownsInternship = submission.Internship.Student?.UserId == userId;
        var isAssignedLecturer = submission.Internship.Lecturer?.UserId == userId;

        if (!isLecturerOrAdmin && !ownsInternship)
            throw new UnauthorizedAccessException("You do not have access to this file");

        if (isLecturerOrAdmin && !isAssignedLecturer && !ownsInternship)
        {
            // SuperAdmin may download any submission file
            var isSuperAdmin = await _db.Users
                .AnyAsync(u => u.Id == userId && u.Role == Role.SuperAdmin && !u.IsDeleted);
            if (!isSuperAdmin)
                throw new UnauthorizedAccessException("You do not have access to this file");
        }

        var fullPath = Path.Combine(GetUploadRoot(), submission.FileUrl.Replace("/", Path.DirectorySeparatorChar.ToString()));
        if (!File.Exists(fullPath))
            return null;

        var extension = Path.GetExtension(submission.FileName ?? fullPath).ToLowerInvariant();
        return new SubmissionFileDownloadDto
        {
            FileContent = await File.ReadAllBytesAsync(fullPath),
            FileName = submission.FileName ?? Path.GetFileName(fullPath),
            MimeType = GetMimeType(extension),
        };
    }

    public async Task<SubmissionDto?> UpdateStatusAsync(Guid id, UpdateSubmissionStatusRequest request, Guid? actorUserId = null)
    {
        var submission = await _db.Submissions
            .Include(s => s.Internship)
                .ThenInclude(i => i.Student)
            .Include(s => s.Internship)
                .ThenInclude(i => i.Lecturer)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (submission == null)
            return null;

        if (actorUserId.HasValue)
            await EnsureSubmissionActorAccessAsync(submission, actorUserId.Value);

        if (!Enum.TryParse<SubmissionStatus>(request.Status, true, out var status))
            throw new InvalidOperationException($"Invalid status: {request.Status}");

        submission.Status = status;
        submission.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<bool> SoftDeleteAsync(Guid id, Guid? actorUserId = null)
    {
        var submission = await _db.Submissions
            .Include(s => s.Internship)
                .ThenInclude(i => i.Student)
            .Include(s => s.Internship)
                .ThenInclude(i => i.Lecturer)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (submission == null)
            return false;

        if (actorUserId.HasValue)
            await EnsureSubmissionActorAccessAsync(submission, actorUserId.Value);

        submission.IsDeleted = true;
        submission.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<FeedbackDto>> GetFeedbacksAsync(Guid submissionId, Guid userId, bool isLecturer)
    {
        var submission = await _db.Submissions
            .Include(s => s.Internship)
                .ThenInclude(i => i.Student)
            .Include(s => s.Feedbacks.Where(f => !f.IsDeleted))
                .ThenInclude(f => f.Lecturer)
            .FirstOrDefaultAsync(s => s.Id == submissionId && !s.IsDeleted);

        if (submission == null)
            return Array.Empty<FeedbackDto>();

        IEnumerable<Feedback> feedbacks = submission.Feedbacks;

        if (!isLecturer)
        {
            var ownsInternship = submission.Internship.Student?.UserId == userId;
            if (!ownsInternship)
                throw new UnauthorizedAccessException("You do not have access to this submission's feedback");

            feedbacks = feedbacks.Where(f => f.IsPublic);
        }

        return _mapper.Map<List<FeedbackDto>>(feedbacks.OrderByDescending(f => f.CreatedAt));
    }

    public async Task<FeedbackDto?> AddFeedbackAsync(Guid submissionId, Guid userId, CreateFeedbackRequest request)
    {
        var lecturerId = await ResolveLecturerIdAsync(userId)
            ?? throw new UnauthorizedAccessException("Lecturer profile not found for current user");

        var submission = await _db.Submissions
            .Include(s => s.Internship)
                .ThenInclude(i => i.Student)
            .FirstOrDefaultAsync(s => s.Id == submissionId && !s.IsDeleted);

        if (submission == null)
            return null;

        var newStatus = ResolveFeedbackStatus(request.NewStatus);
        submission.Status = newStatus;
        submission.UpdatedAt = DateTime.UtcNow;

        var feedback = new Feedback
        {
            Id = Guid.NewGuid(),
            SubmissionId = submissionId,
            LecturerId = lecturerId,
            Comment = request.Comment,
            IsPublic = request.IsPublic,
            CreatedAt = DateTime.UtcNow
        };

        _db.Feedbacks.Add(feedback);
        await _db.SaveChangesAsync();

        var studentUserId = submission.Internship.Student?.UserId;
        if (studentUserId.HasValue)
        {
            await _notificationService.CreateAsync(new CreateNotificationRequest
            {
                UserId = studentUserId.Value,
                Title = "New feedback on your submission",
                Content = $"Your submission \"{submission.Title ?? submission.Type.ToString()}\" received feedback.",
                Link = $"/submissions/{submission.Id}"
            });
        }

        await _db.Entry(feedback).Reference(f => f.Lecturer).LoadAsync();
        return _mapper.Map<FeedbackDto>(feedback);
    }

    public async Task<FeedbackDto?> UpdateFeedbackAsync(Guid feedbackId, Guid userId, UpdateFeedbackRequest request)
    {
        var feedback = await _db.Feedbacks
            .Include(f => f.Lecturer)
            .FirstOrDefaultAsync(f => f.Id == feedbackId && !f.IsDeleted);

        if (feedback == null)
            return null;

        if (feedback.Lecturer?.UserId != userId)
            throw new UnauthorizedAccessException("You can only update your own feedback");

        feedback.Comment = request.Comment;
        feedback.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return _mapper.Map<FeedbackDto>(feedback);
    }

    private async Task EnsureInternshipAccessAsync(Guid internshipId, Guid userId, bool isLecturerOrAdmin)
    {
        var internship = await _db.Internships
            .Include(i => i.Student)
            .Include(i => i.Lecturer)
            .FirstOrDefaultAsync(i => i.Id == internshipId && !i.IsDeleted);

        if (internship == null)
            throw new UnauthorizedAccessException("You do not have access to submissions for this internship");

        await EnsureInternshipActorAccessAsync(internship, userId, isLecturerOrAdmin);
    }

    private async Task EnsureSubmissionActorAccessAsync(Submission submission, Guid userId)
    {
        await EnsureInternshipActorAccessAsync(submission.Internship, userId, isLecturerOrAdmin: true);
    }

    private async Task EnsureInternshipActorAccessAsync(Internship internship, Guid userId, bool isLecturerOrAdmin)
    {
        var ownsInternship = internship.Student?.UserId == userId;
        var isAssignedLecturer = internship.Lecturer?.UserId == userId;

        if (!isLecturerOrAdmin && !ownsInternship)
            throw new UnauthorizedAccessException("You do not have access to this submission");

        if (isLecturerOrAdmin && !isAssignedLecturer && !ownsInternship)
        {
            var isSuperAdmin = await _db.Users
                .AnyAsync(u => u.Id == userId && u.Role == Role.SuperAdmin && !u.IsDeleted);
            if (!isSuperAdmin)
                throw new UnauthorizedAccessException("You do not have access to this submission");
        }
    }

    private async Task<Guid?> ResolveLecturerIdAsync(Guid userId)
    {
        return await _db.Lecturers
            .Where(l => l.UserId == userId && !l.IsDeleted)
            .Select(l => (Guid?)l.Id)
            .FirstOrDefaultAsync();
    }

    private async Task<Internship?> GetStudentInternshipAsync(Guid userId)
    {
        return await _db.Internships
            .Include(i => i.Student)
            .FirstOrDefaultAsync(i => !i.IsDeleted && i.Student != null && i.Student.UserId == userId);
    }

    private static SubmissionStatus ResolveFeedbackStatus(string? newStatus)
    {
        if (string.IsNullOrWhiteSpace(newStatus))
            return SubmissionStatus.RevisionRequested;

        if (!Enum.TryParse<SubmissionStatus>(newStatus, true, out var status))
            throw new InvalidOperationException($"Invalid status: {newStatus}");

        return status;
    }

    private async Task<(string RelativePath, string SavedFileName)> SaveSubmissionFileAsync(
        Stream fileStream,
        string originalFileName,
        Guid internshipId)
    {
        if (fileStream == null || fileStream.Length == 0)
            throw new ArgumentException("File is required and must not be empty");

        var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new InvalidOperationException($"File type '{extension}' is not allowed");

        var uploadPath = Path.Combine(GetUploadRoot(), UploadFolder, internshipId.ToString());
        Directory.CreateDirectory(uploadPath);

        var safeBase = Path.GetFileNameWithoutExtension(originalFileName);
        var uniqueFileName = $"{Guid.NewGuid()}_{safeBase}{extension}";
        var fullPath = Path.Combine(uploadPath, uniqueFileName);
        var relativePath = Path.Combine(UploadFolder, internshipId.ToString(), uniqueFileName)
            .Replace("\\", "/");

        await using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream);
        }

        return (relativePath, uniqueFileName);
    }

    private string GetUploadRoot() =>
        string.IsNullOrEmpty(_env.WebRootPath) ? _env.ContentRootPath : _env.WebRootPath;

    private static string GetMimeType(string extension) => extension switch
    {
        ".pdf" => "application/pdf",
        ".doc" => "application/msword",
        ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".ppt" => "application/vnd.ms-powerpoint",
        ".zip" => "application/zip",
        ".rar" => "application/vnd.rar",
        ".mp4" => "video/mp4",
        ".mov" => "video/quicktime",
        ".sql" => "application/sql",
        _ => "application/octet-stream",
    };

    public async Task<FeedbackDto?> AddStudentReplyAsync(Guid submissionId, Guid studentUserId, string comment)
    {
        var submission = await _db.Submissions
            .Include(s => s.Internship)
                .ThenInclude(i => i.Student)
            .Include(s => s.Internship)
                .ThenInclude(i => i.Lecturer)
            .FirstOrDefaultAsync(s => s.Id == submissionId && !s.IsDeleted);

        if (submission == null)
            return null;

        // Verify the student owns this submission
        if (submission.Internship?.Student?.UserId != studentUserId)
            throw new UnauthorizedAccessException("You can only reply to your own submissions");

        var feedback = new Feedback
        {
            Id = Guid.NewGuid(),
            SubmissionId = submissionId,
            LecturerId = null,
            Comment = comment,
            IsPublic = true,
            CreatedAt = DateTime.UtcNow
        };

        _db.Feedbacks.Add(feedback);
        await _db.SaveChangesAsync();

        // Notify the lecturer
        var lecturerUserId = submission.Internship?.Lecturer?.UserId;
        if (lecturerUserId.HasValue)
        {
            var studentName = submission.Internship?.Student?.FullName ?? "Sinh viên";
            await _notificationService.CreateAsync(new CreateNotificationRequest
            {
                UserId = lecturerUserId.Value,
                Title = "Sinh viên phản hồi về bài nộp",
                Content = $"{studentName} vừa gửi phản hồi về bài nộp \"{submission.Title ?? submission.Type.ToString()}\".",
                Link = $"/submissions/{submission.Id}"
            });
        }

        return _mapper.Map<FeedbackDto>(feedback);
    }
}
