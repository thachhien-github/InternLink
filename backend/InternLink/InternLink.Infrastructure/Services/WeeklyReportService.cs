using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class WeeklyReportService : IWeeklyReportService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly INotificationService _notificationService;

    public WeeklyReportService(AppDbContext db, IMapper mapper, INotificationService notificationService)
    {
        _db = db;
        _mapper = mapper;
        _notificationService = notificationService;
    }

    public async Task<WeeklyReportDto?> GetByIdAsync(Guid id)
    {
        var report = await _db.WeeklyReports
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);

        return report == null ? null : _mapper.Map<WeeklyReportDto>(report);
    }

    public async Task<WeeklyReportDto?> GetByIdAsync(Guid id, Guid userId, bool isLecturerOrAdmin)
    {
        var report = await _db.WeeklyReports
            .Include(r => r.Internship)
                .ThenInclude(i => i.Student)
            .Include(r => r.Internship)
                .ThenInclude(i => i.Lecturer)
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);

        if (report == null)
            return null;

        var ownsInternship = report.Internship?.Student?.UserId == userId;
        var isAssignedLecturer = report.Internship?.Lecturer?.UserId == userId;

        if (!isLecturerOrAdmin && !ownsInternship)
            throw new UnauthorizedAccessException("You do not have access to this weekly report");

        if (isLecturerOrAdmin && !isAssignedLecturer && !ownsInternship)
        {
            var isSuperAdmin = await _db.Users
                .AnyAsync(u => u.Id == userId && u.Role == Role.SuperAdmin && !u.IsDeleted);
            if (!isSuperAdmin)
                throw new UnauthorizedAccessException("You do not have access to this weekly report");
        }

        return _mapper.Map<WeeklyReportDto>(report);
    }

    public async Task<IEnumerable<WeeklyReportDto>> GetMineAsync(Guid userId)
    {
        var internship = await GetStudentInternshipAsync(userId);
        if (internship == null)
            return Array.Empty<WeeklyReportDto>();

        var reports = await _db.WeeklyReports
            .Where(r => r.InternshipId == internship.Id && !r.IsDeleted)
            .OrderByDescending(r => r.WeekNumber)
            .ToListAsync();

        return _mapper.Map<List<WeeklyReportDto>>(reports);
    }

    public async Task<IEnumerable<WeeklyReportDto>> GetByInternshipAsync(Guid internshipId)
    {
        return await GetByInternshipAsync(internshipId, Guid.Empty, isLecturerOrAdmin: true);
    }

    public async Task<IEnumerable<WeeklyReportDto>> GetByInternshipAsync(Guid internshipId, Guid userId, bool isLecturerOrAdmin)
    {
        if (userId != Guid.Empty)
            await EnsureInternshipAccessAsync(internshipId, userId, isLecturerOrAdmin);

        var reports = await _db.WeeklyReports
            .Where(r => r.InternshipId == internshipId && !r.IsDeleted)
            .OrderByDescending(r => r.WeekNumber)
            .ToListAsync();

        return _mapper.Map<List<WeeklyReportDto>>(reports);
    }

    public async Task<WeeklyReportDto> CreateDraftAsync(Guid userId, CreateWeeklyReportRequest request)
    {
        var internship = await _db.Internships
            .Include(i => i.Student)
            .FirstOrDefaultAsync(i => i.Id == request.InternshipId && !i.IsDeleted);

        if (internship == null)
            throw new InvalidOperationException("Internship not found");

        if (internship.Student?.UserId != userId)
            throw new UnauthorizedAccessException("Internship does not belong to the current student");

        var duplicate = await _db.WeeklyReports
            .AnyAsync(r => r.InternshipId == request.InternshipId
                           && r.WeekNumber == request.WeekNumber
                           && !r.IsDeleted);

        if (duplicate)
            throw new InvalidOperationException($"A weekly report for week {request.WeekNumber} already exists");

        var report = new WeeklyReport
        {
            Id = Guid.NewGuid(),
            InternshipId = request.InternshipId,
            WeekNumber = request.WeekNumber,
            Title = request.Title,
            Content = request.Content,
            Status = WeeklyReportStatus.Draft,
            CreatedAt = DateTime.UtcNow
        };

        _db.WeeklyReports.Add(report);
        await _db.SaveChangesAsync();

        return _mapper.Map<WeeklyReportDto>(report);
    }

    public async Task<WeeklyReportDto?> UpdateDraftAsync(Guid id, Guid userId, UpdateWeeklyReportRequest request)
    {
        var report = await LoadOwnedReportAsync(id, userId);
        if (report == null)
            return null;

        if (report.Status != WeeklyReportStatus.Draft && report.Status != WeeklyReportStatus.RevisionRequested)
            throw new InvalidOperationException("Only draft or revision-requested reports can be updated");

        if (!string.IsNullOrWhiteSpace(request.Title))
            report.Title = request.Title;

        if (!string.IsNullOrWhiteSpace(request.Content))
            report.Content = request.Content;

        report.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return _mapper.Map<WeeklyReportDto>(report);
    }

    public async Task<WeeklyReportDto?> SubmitAsync(Guid id, Guid userId)
    {
        var report = await _db.WeeklyReports
            .Include(r => r.Internship)
                .ThenInclude(i => i.Student)
            .Include(r => r.Internship)
                .ThenInclude(i => i.Lecturer)
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);

        if (report == null)
            return null;

        // Verify ownership
        if (report.Internship?.Student?.UserId != userId)
            throw new UnauthorizedAccessException("Internship does not belong to the current student");

        if (report.Status != WeeklyReportStatus.Draft && report.Status != WeeklyReportStatus.RevisionRequested)
            throw new InvalidOperationException("Only draft or revision-requested reports can be submitted");

        report.Status = WeeklyReportStatus.Submitted;
        report.SubmittedAt = DateTime.UtcNow;
        report.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        // Notify the assigned lecturer
        var lecturerUserId = report.Internship?.Lecturer?.UserId;
        var studentName = report.Internship?.Student?.FullName ?? "Sinh viên";
        if (lecturerUserId.HasValue)
        {
            await _notificationService.CreateAsync(new CreateNotificationRequest
            {
                UserId = lecturerUserId.Value,
                Title = $"Sinh viên {studentName} đã nộp Báo cáo tuần {report.WeekNumber}",
                Content = $"Sinh viên {studentName} vừa nộp báo cáo tuần {report.WeekNumber}. Vui lòng xem xét và đánh giá.",
                Link = $"/weekly-reports/{report.Id}"
            });
        }

        return _mapper.Map<WeeklyReportDto>(report);
    }

    public async Task<WeeklyReportDto?> ReviewAsync(Guid id, ReviewWeeklyReportRequest request)
    {
        return await ReviewAsync(id, Guid.Empty, request);
    }

    public async Task<WeeklyReportDto?> ReviewAsync(Guid id, Guid userId, ReviewWeeklyReportRequest request)
    {
        var report = await _db.WeeklyReports
            .Include(r => r.Internship)
                .ThenInclude(i => i.Student)
            .Include(r => r.Internship)
                .ThenInclude(i => i.Lecturer)
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);

        if (report == null)
            return null;

        if (userId != Guid.Empty)
        {
            var isAssigned = report.Internship?.Lecturer?.UserId == userId;
            if (!isAssigned)
            {
                var isSuperAdmin = await _db.Users
                    .AnyAsync(u => u.Id == userId && u.Role == Role.SuperAdmin && !u.IsDeleted);
                if (!isSuperAdmin)
                    throw new UnauthorizedAccessException("You do not have access to this weekly report");
            }
        }

        if (!Enum.TryParse<WeeklyReportStatus>(request.Status, true, out var status))
            throw new InvalidOperationException($"Invalid status: {request.Status}");

        if (status is not (WeeklyReportStatus.Reviewed or WeeklyReportStatus.RevisionRequested or WeeklyReportStatus.Approved))
            throw new InvalidOperationException("Review status must be Reviewed, RevisionRequested, or Approved");

        report.Status = status;
        report.LecturerComment = request.LecturerComment;
        report.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var studentUserId = report.Internship.Student?.UserId;
        if (studentUserId.HasValue)
        {
            var lecturerName = report.Internship.Lecturer?.FullName ?? "Giảng viên";
            var statusText = status switch
            {
                WeeklyReportStatus.Approved => "đã được duyệt",
                WeeklyReportStatus.RevisionRequested => "cần chỉnh sửa lại",
                _ => "đã được nhận xét"
            };
            await _notificationService.CreateAsync(new CreateNotificationRequest
            {
                UserId = studentUserId.Value,
                Title = $"Báo cáo tuần {report.WeekNumber} {statusText}",
                Content = $"Giảng viên {lecturerName} đã đánh giá báo cáo tuần {report.WeekNumber} của bạn: {statusText}.",
                Link = $"/weekly-reports/{report.Id}"
            });
        }

        return _mapper.Map<WeeklyReportDto>(report);
    }

    public async Task<bool> SoftDeleteAsync(Guid id, Guid userId)
    {
        var report = await LoadOwnedReportAsync(id, userId);
        if (report == null)
            return false;

        if (report.Status != WeeklyReportStatus.Draft)
            throw new InvalidOperationException("Only draft reports can be deleted");

        report.IsDeleted = true;
        report.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    private async Task<WeeklyReport?> LoadOwnedReportAsync(Guid id, Guid userId)
    {
        var report = await _db.WeeklyReports
            .Include(r => r.Internship)
                .ThenInclude(i => i.Student)
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);

        if (report == null)
            return null;

        if (report.Internship.Student?.UserId != userId)
            throw new UnauthorizedAccessException("Weekly report does not belong to the current student");

        return report;
    }

    private async Task EnsureInternshipAccessAsync(Guid internshipId, Guid userId, bool isLecturerOrAdmin)
    {
        var internship = await _db.Internships
            .Include(i => i.Student)
            .Include(i => i.Lecturer)
            .FirstOrDefaultAsync(i => i.Id == internshipId && !i.IsDeleted);

        if (internship == null)
            throw new UnauthorizedAccessException("You do not have access to this weekly report");

        var ownsInternship = internship.Student?.UserId == userId;
        var isAssignedLecturer = internship.Lecturer?.UserId == userId;

        if (!isLecturerOrAdmin && !ownsInternship)
            throw new UnauthorizedAccessException("You do not have access to this weekly report");

        if (isLecturerOrAdmin && !isAssignedLecturer && !ownsInternship)
        {
            var isSuperAdmin = await _db.Users
                .AnyAsync(u => u.Id == userId && u.Role == Role.SuperAdmin && !u.IsDeleted);
            if (!isSuperAdmin)
                throw new UnauthorizedAccessException("You do not have access to this weekly report");
        }
    }

    private async Task<Internship?> GetStudentInternshipAsync(Guid userId)
    {
        return await _db.Internships
            .Include(i => i.Student)
            .FirstOrDefaultAsync(i => !i.IsDeleted && i.Student != null && i.Student.UserId == userId);
    }
}
