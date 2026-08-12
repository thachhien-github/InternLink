using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class AssignmentService : IAssignmentService
{
    /// <summary>
    /// Placeholder company for internships awaiting company assignment by lecturer.
    /// </summary>
    public const string UnassignedCompanyName = "Chưa phân công doanh nghiệp";

    private readonly AppDbContext _db;

    public AssignmentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<BulkAssignResultDto> BulkAssignAsync(BulkAssignRequest request)
    {
        var lecturerExists = await _db.Lecturers.AnyAsync(l => l.Id == request.LecturerId && !l.IsDeleted);
        if (!lecturerExists)
            throw new InvalidOperationException($"Lecturer with ID {request.LecturerId} not found");

        var result = new BulkAssignResultDto();
        var errors = new List<AssignmentErrorDto>();
        var unassignedCompany = await EnsureUnassignedCompanyAsync();

        foreach (var studentId in request.StudentIds.Distinct())
        {
            var student = await _db.Students.FirstOrDefaultAsync(s => s.Id == studentId && !s.IsDeleted);
            if (student == null)
            {
                errors.Add(new AssignmentErrorDto
                {
                    StudentId = studentId,
                    Message = $"Student with ID {studentId} not found"
                });
                continue;
            }

            var internship = await _db.Internships
                .FirstOrDefaultAsync(i => i.StudentId == studentId && !i.IsDeleted);

            if (internship == null)
            {
                internship = new Internship
                {
                    Id = Guid.NewGuid(),
                    StudentId = studentId,
                    CompanyId = unassignedCompany.Id,
                    LecturerId = request.LecturerId,
                    Status = InternshipStatus.NotStarted,
                    Notes = "Phân công giảng viên — chờ gán doanh nghiệp",
                    CreatedAt = DateTime.UtcNow
                };
                await _db.Internships.AddAsync(internship);
                result.CreatedCount++;
            }
            else
            {
                internship.LecturerId = request.LecturerId;
                internship.UpdatedAt = DateTime.UtcNow;
                result.UpdatedCount++;
            }

            result.AssignedCount++;
        }

        if (result.AssignedCount > 0)
            await _db.SaveChangesAsync();

        result.FailedCount = errors.Count;
        result.Errors = errors;
        return result;
    }

    public async Task<IReadOnlyList<LecturerAssignmentItemDto>> GetByLecturerAsync(Guid lecturerId)
    {
        var lecturerExists = await _db.Lecturers.AnyAsync(l => l.Id == lecturerId && !l.IsDeleted);
        if (!lecturerExists)
            throw new InvalidOperationException($"Lecturer with ID {lecturerId} not found");

        var internships = await _db.Internships
            .Where(i => !i.IsDeleted && i.LecturerId == lecturerId)
            .Include(i => i.Student)
            .Include(i => i.Company)
            .OrderBy(i => i.Student!.FullName)
            .ToListAsync();

        return internships.Select(MapAssignmentItem).ToList();
    }

    public async Task<bool> UnassignAsync(UnassignRequest request)
    {
        var internship = await _db.Internships
            .FirstOrDefaultAsync(i =>
                !i.IsDeleted &&
                i.LecturerId == request.LecturerId &&
                i.StudentId == request.StudentId);

        if (internship == null)
            return false;

        internship.LecturerId = null;
        internship.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    private async Task<Company> EnsureUnassignedCompanyAsync()
    {
        var company = await _db.Companies
            .FirstOrDefaultAsync(c => c.CompanyName == UnassignedCompanyName && !c.IsDeleted);

        if (company != null)
            return company;

        company = new Company
        {
            Id = Guid.NewGuid(),
            CompanyName = UnassignedCompanyName,
            Industry = "Hệ thống",
            ContactPerson = "Ban Quản lý Thực tập",
            IsActive = false,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Companies.AddAsync(company);
        await _db.SaveChangesAsync();
        return company;
    }

    private static LecturerAssignmentItemDto MapAssignmentItem(Internship internship)
    {
        var companyAssigned = internship.Company?.CompanyName != UnassignedCompanyName;

        return new LecturerAssignmentItemDto
        {
            InternshipId = internship.Id,
            StudentId = internship.StudentId,
            StudentCode = internship.Student?.StudentCode ?? string.Empty,
            StudentName = internship.Student?.FullName ?? string.Empty,
            Class = internship.Student?.Class,
            Major = internship.Student?.Major,
            Status = internship.Status.ToString(),
            CompanyId = internship.CompanyId,
            CompanyName = internship.Company?.CompanyName,
            CompanyAssigned = companyAssigned,
            StartDate = internship.StartDate,
            EndDate = internship.EndDate,
            CreatedAt = internship.CreatedAt
        };
    }
}
