using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class RubricService : IRubricService
{
    private readonly AppDbContext _context;

    public RubricService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RubricDto?> GetBySemesterAsync(Guid semesterId)
    {
        var rubric = await _context.Set<EvaluationRubric>()
            .Where(r => r.SemesterId == semesterId && !r.IsDeleted)
            .Include(r => r.Criteria.OrderBy(c => c.OrderIndex))
            .Include(r => r.SubmittedBy)
            .Include(r => r.ApprovedBy)
            .FirstOrDefaultAsync();

        return rubric == null ? null : MapToDto(rubric);
    }

    public async Task<RubricDto> CreateAsync(Guid semesterId, CreateRubricRequest request, Guid createdByUserId)
    {
        // Validate semester exists
        var semester = await _context.Semesters
            .FirstOrDefaultAsync(s => s.Id == semesterId && !s.IsDeleted);
        if (semester == null)
            throw new InvalidOperationException("Kỳ thực tập không tồn tại.");

        // Check if rubric already exists for this semester
        var existing = await _context.Set<EvaluationRubric>()
            .AnyAsync(r => r.SemesterId == semesterId && !r.IsDeleted);
        if (existing)
            throw new InvalidOperationException("Kỳ thực tập này đã có rubric. Vui lòng chỉnh sửa thay vì tạo mới.");

        // Validate criteria weights sum to 100
        var totalWeight = request.Criteria.Sum(c => c.Weight);
        if (Math.Abs(totalWeight - 100) > 0.01m)
            throw new InvalidOperationException($"Tổng trọng số phải bằng 100%. Hiện tại: {totalWeight}%");

        // Validate no duplicate names
        if (request.Criteria.GroupBy(c => c.Name.Trim().ToLower()).Any(g => g.Count() > 1))
            throw new InvalidOperationException("Không được có tiêu chí trùng tên.");

        var rubric = new EvaluationRubric
        {
            Id = Guid.NewGuid(),
            SemesterId = semesterId,
            Name = request.Name,
            ApplicationMode = request.ApplicationMode == "LecturerCustom"
                ? RubricApplicationMode.LecturerCustom
                : RubricApplicationMode.Required,
            Status = RubricStatus.Draft,
            CreatedAt = DateTime.UtcNow,
            Criteria = request.Criteria.Select((c, idx) => new EvaluationRubricCriterion
            {
                Id = Guid.NewGuid(),
                Name = c.Name,
                Description = c.Description,
                Weight = c.Weight,
                MaxScore = c.MaxScore,
                OrderIndex = c.OrderIndex > 0 ? c.OrderIndex : idx + 1,
                CreatedAt = DateTime.UtcNow
            }).ToList()
        };

        _context.Set<EvaluationRubric>().Add(rubric);
        await _context.SaveChangesAsync();

        // Reload with includes for proper DTO mapping
        return await GetBySemesterAsync(semesterId) ?? MapToDto(rubric);
    }

    public async Task<RubricDto?> UpdateAsync(Guid rubricId, UpdateRubricRequest request)
    {
        var rubric = await _context.Set<EvaluationRubric>()
            .Where(r => r.Id == rubricId && !r.IsDeleted)
            .Include(r => r.Criteria)
            .FirstOrDefaultAsync();

        if (rubric == null) return null;
        if (rubric.Status != RubricStatus.Draft && rubric.Status != RubricStatus.Rejected)
            throw new InvalidOperationException("Chỉ có thể chỉnh sửa rubric ở trạng thái Nháp hoặc Bị từ chối.");

        if (request.Name != null) rubric.Name = request.Name;
        if (request.ApplicationMode != null)
        {
            rubric.ApplicationMode = request.ApplicationMode == "LecturerCustom"
                ? RubricApplicationMode.LecturerCustom
                : RubricApplicationMode.Required;
        }

        // Replace criteria if provided
        if (request.Criteria != null)
        {
            var totalWeight = request.Criteria.Sum(c => c.Weight ?? 0);
            if (Math.Abs(totalWeight - 100) > 0.01m)
                throw new InvalidOperationException($"Tổng trọng số phải bằng 100%. Hiện tại: {totalWeight}%");

            // Remove existing criteria
            _context.Set<EvaluationRubricCriterion>().RemoveRange(rubric.Criteria);

            // Add new criteria
            rubric.Criteria = request.Criteria.Select((c, idx) => new EvaluationRubricCriterion
            {
                Id = Guid.NewGuid(),
                RubricId = rubricId,
                Name = c.Name ?? "Untitled",
                Description = c.Description,
                Weight = c.Weight ?? 0,
                MaxScore = c.MaxScore ?? 10,
                OrderIndex = (c.OrderIndex ?? 0) > 0 ? c.OrderIndex!.Value : idx + 1,
                CreatedAt = DateTime.UtcNow
            }).ToList();
        }

        rubric.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return await GetBySemesterAsync(rubric.SemesterId);
    }

    public async Task<bool> DeleteAsync(Guid rubricId)
    {
        var rubric = await _context.Set<EvaluationRubric>()
            .FirstOrDefaultAsync(r => r.Id == rubricId && !r.IsDeleted);

        if (rubric == null) return false;
        if (rubric.Status != RubricStatus.Draft && rubric.Status != RubricStatus.Rejected)
            throw new InvalidOperationException("Chỉ có thể xóa rubric ở trạng thái Nháp hoặc Bị từ chối.");

        rubric.IsDeleted = true;
        rubric.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<RubricDto?> SubmitForApprovalAsync(Guid rubricId, Guid submittedByUserId, string? note)
    {
        var rubric = await _context.Set<EvaluationRubric>()
            .Where(r => r.Id == rubricId && !r.IsDeleted)
            .Include(r => r.Criteria)
            .FirstOrDefaultAsync();

        if (rubric == null) return null;
        if (rubric.Status != RubricStatus.Draft && rubric.Status != RubricStatus.Rejected)
            throw new InvalidOperationException("Rubric phải ở trạng thái Nháp hoặc Bị từ chối để gửi duyệt.");

        // Validate total weight
        var totalWeight = rubric.Criteria.Sum(c => c.Weight);
        if (Math.Abs(totalWeight - 100) > 0.01m)
            throw new InvalidOperationException($"Tổng trọng số phải bằng 100%. Hiện tại: {totalWeight}%");

        rubric.Status = RubricStatus.PendingApproval;
        rubric.SubmittedById = submittedByUserId;
        rubric.SubmittedAt = DateTime.UtcNow;
        rubric.RejectionReason = null;
        rubric.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetBySemesterAsync(rubric.SemesterId);
    }

    public async Task<RubricDto?> ApproveAsync(Guid rubricId, Guid approvedByUserId, string? note)
    {
        var rubric = await _context.Set<EvaluationRubric>()
            .Where(r => r.Id == rubricId && !r.IsDeleted)
            .Include(r => r.Criteria)
            .Include(r => r.SubmittedBy)
            .FirstOrDefaultAsync();

        if (rubric == null) return null;
        if (rubric.Status != RubricStatus.PendingApproval)
            throw new InvalidOperationException("Chỉ có thể duyệt rubric đang chờ phê duyệt.");

        rubric.Status = RubricStatus.Approved;
        rubric.ApprovedById = approvedByUserId;
        rubric.ApprovedAt = DateTime.UtcNow;
        rubric.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetBySemesterAsync(rubric.SemesterId);
    }

    public async Task<RubricDto?> RejectAsync(Guid rubricId, string rejectionReason)
    {
        var rubric = await _context.Set<EvaluationRubric>()
            .Where(r => r.Id == rubricId && !r.IsDeleted)
            .Include(r => r.Criteria)
            .FirstOrDefaultAsync();

        if (rubric == null) return null;
        if (rubric.Status != RubricStatus.PendingApproval)
            throw new InvalidOperationException("Chỉ có thể từ chối rubric đang chờ phê duyệt.");

        rubric.Status = RubricStatus.Rejected;
        rubric.RejectionReason = rejectionReason;
        rubric.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetBySemesterAsync(rubric.SemesterId);
    }

    public async Task<RubricDto?> LockAsync(Guid rubricId)
    {
        var rubric = await _context.Set<EvaluationRubric>()
            .Where(r => r.Id == rubricId && !r.IsDeleted)
            .Include(r => r.Criteria)
            .FirstOrDefaultAsync();

        if (rubric == null) return null;
        if (rubric.Status != RubricStatus.Approved)
            throw new InvalidOperationException("Chỉ có thể khóa rubric đã được phê duyệt.");

        rubric.Status = RubricStatus.Locked;
        rubric.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return await GetBySemesterAsync(rubric.SemesterId);
    }

    public async Task<RubricDto?> GetApprovedRubricAsync(Guid semesterId)
    {
        var rubric = await _context.Set<EvaluationRubric>()
            .Where(r => r.SemesterId == semesterId && !r.IsDeleted
                && (r.Status == RubricStatus.Approved || r.Status == RubricStatus.Locked))
            .Include(r => r.Criteria.OrderBy(c => c.OrderIndex))
            .FirstOrDefaultAsync();

        return rubric == null ? null : MapToDto(rubric);
    }

    private static RubricDto MapToDto(EvaluationRubric rubric)
    {
        return new RubricDto
        {
            Id = rubric.Id,
            SemesterId = rubric.SemesterId,
            Name = rubric.Name,
            ApplicationMode = rubric.ApplicationMode.ToString(),
            Status = rubric.Status.ToString(),
            Criteria = rubric.Criteria
                .OrderBy(c => c.OrderIndex)
                .Select(c => new RubricCriterionDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Weight = c.Weight,
                    MaxScore = c.MaxScore,
                    OrderIndex = c.OrderIndex
                }).ToList(),
            RejectionReason = rubric.RejectionReason,
            SubmittedByName = rubric.SubmittedBy?.FullName,
            SubmittedAt = rubric.SubmittedAt,
            ApprovedByName = rubric.ApprovedBy?.FullName,
            ApprovedAt = rubric.ApprovedAt,
            CreatedAt = rubric.CreatedAt,
            UpdatedAt = rubric.UpdatedAt
        };
    }
}
