using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class SemesterService : ISemesterService
{
    private readonly AppDbContext _context;

    public SemesterService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SemesterDto>> GetAllSemestersAsync()
    {
        var semesters = await _context.Semesters
            .Where(s => !s.IsDeleted)
            .Include(s => s.Internships)
            .Include(s => s.SemesterLecturers)
            .OrderByDescending(s => s.Status == SemesterStatus.Active)
            .ThenByDescending(s => s.CreatedAt)
            .ToListAsync();

        return semesters.Select(MapToDto);
    }

    public async Task<SemesterDto?> GetActiveSemesterAsync()
    {
        var semester = await _context.Semesters
            .Where(s => !s.IsDeleted && s.Status == SemesterStatus.Active)
            .Include(s => s.Internships)
            .Include(s => s.SemesterLecturers)
            .OrderByDescending(s => s.UpdatedAt ?? s.CreatedAt)
            .FirstOrDefaultAsync();

        if (semester == null)
            return null;

        var pendingInternships = await _context.Internships
            .Where(i => !i.IsDeleted && i.SemesterId == semester.Id && i.Status == InternshipStatus.NotStarted)
            .ToListAsync();

        foreach (var internship in pendingInternships)
        {
            internship.Status = InternshipStatus.InProgress;
            internship.StartDate ??= semester.StartDate;
            internship.EndDate ??= semester.EndDate;
            internship.UpdatedAt = DateTime.UtcNow;
        }

        if (pendingInternships.Count > 0)
            await _context.SaveChangesAsync();

        return MapToDto(semester);
    }

    public async Task<SemesterDto?> GetSemesterByIdAsync(Guid id)
    {
        var semester = await _context.Semesters
            .Where(s => s.Id == id && !s.IsDeleted)
            .Include(s => s.Internships)
            .Include(s => s.SemesterLecturers)
            .FirstOrDefaultAsync();

        return semester == null ? null : MapToDto(semester);
    }

    public async Task<SemesterDto> CreateSemesterAsync(CreateSemesterDto dto)
    {
        var semester = new Semester
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Term = dto.Term,
            AcademicYear = dto.AcademicYear,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = dto.Status,
            Description = dto.Description,
            MaxStudentsPerLecturer = dto.MaxStudentsPerLecturer,
            CreatedAt = DateTime.UtcNow
        };

        _context.Semesters.Add(semester);
        await _context.SaveChangesAsync();

        return MapToDto(semester);
    }

    public async Task<SemesterDto?> UpdateSemesterAsync(Guid id, UpdateSemesterDto dto)
    {
        var semester = await _context.Semesters
            .Where(s => s.Id == id && !s.IsDeleted)
            .Include(s => s.Internships)
            .Include(s => s.SemesterLecturers)
            .FirstOrDefaultAsync();

        if (semester == null)
            return null;

        if (dto.Name != null) semester.Name = dto.Name;
        if (dto.Term != null) semester.Term = dto.Term;
        if (dto.AcademicYear != null) semester.AcademicYear = dto.AcademicYear;
        if (dto.StartDate.HasValue) semester.StartDate = dto.StartDate.Value;
        if (dto.EndDate.HasValue) semester.EndDate = dto.EndDate.Value;
        if (dto.Status.HasValue) semester.Status = dto.Status.Value;
        if (dto.Description != null) semester.Description = dto.Description;
        if (dto.MaxStudentsPerLecturer.HasValue) semester.MaxStudentsPerLecturer = dto.MaxStudentsPerLecturer.Value;

        semester.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return MapToDto(semester);
    }

    public async Task<SemesterDto?> StartSemesterAsync(Guid id)
    {
        var semester = await _context.Semesters
            .Where(s => s.Id == id && !s.IsDeleted)
            .Include(s => s.Internships)
            .Include(s => s.SemesterLecturers)
            .FirstOrDefaultAsync();

        if (semester == null)
            return null;

        if (semester.Status == SemesterStatus.Completed)
            throw new InvalidOperationException("A completed semester cannot be started again.");

        var anotherActiveSemesterExists = await _context.Semesters
            .AnyAsync(s => s.Id != id && !s.IsDeleted && s.Status == SemesterStatus.Active);
        if (anotherActiveSemesterExists)
            throw new InvalidOperationException("Another semester is already active. Close it before starting this semester.");

        semester.Status = SemesterStatus.Active;

        var internships = await _context.Internships
            .Where(i => !i.IsDeleted && i.SemesterId == id)
            .ToListAsync();
        foreach (var internship in internships)
        {
            if (internship.Status == InternshipStatus.NotStarted)
                internship.Status = InternshipStatus.InProgress;
            internship.StartDate ??= semester.StartDate;
            internship.EndDate ??= semester.EndDate;
            internship.UpdatedAt = DateTime.UtcNow;
        }

        var lecturerIds = await _context.SemesterLecturers
            .Where(link => link.SemesterId == id && !link.IsDeleted)
            .Select(link => link.LecturerId)
            .Distinct()
            .ToListAsync();
        var internshipLecturerIds = internships
            .Where(i => i.LecturerId.HasValue)
            .Select(i => i.LecturerId!.Value)
            .Distinct()
            .ToList();
        lecturerIds.AddRange(internshipLecturerIds);
        var studentIds = internships.Select(i => i.StudentId).Distinct().ToList();
        var userIds = await _context.Lecturers
            .Where(lecturer => lecturerIds.Contains(lecturer.Id) && lecturer.UserId.HasValue)
            .Select(lecturer => lecturer.UserId!.Value)
            .ToListAsync();
        userIds.AddRange(
            await _context.Students
                .Where(student => studentIds.Contains(student.Id) && student.UserId.HasValue)
                .Select(student => student.UserId!.Value)
                .ToListAsync());
        userIds = userIds.Distinct().ToList();
        var users = await _context.Users
            .Where(user => userIds.Contains(user.Id) && !user.IsDeleted)
            .ToListAsync();
        foreach (var user in users)
        {
            user.IsActive = true;
            user.UpdatedAt = DateTime.UtcNow;
        }

        semester.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return MapToDto(semester);
    }

    public async Task<bool> CloseSemesterAsync(Guid id)
    {
        var semester = await _context.Semesters
            .Where(s => s.Id == id && !s.IsDeleted)
            .FirstOrDefaultAsync();

        if (semester == null)
            return false;

        semester.Status = SemesterStatus.Completed;
        semester.UpdatedAt = DateTime.UtcNow;

        // Optionally lock student user accounts belonging to this semester
        var studentUserIds = await _context.Internships
            .Where(i => i.SemesterId == id && !i.IsDeleted && i.Student.UserId != null)
            .Select(i => i.Student.UserId!.Value)
            .Distinct()
            .ToListAsync();

        if (studentUserIds.Count > 0)
        {
            var users = await _context.Users
                .Where(u => studentUserIds.Contains(u.Id) && !u.IsDeleted)
                .ToListAsync();

            foreach (var u in users)
            {
                u.IsActive = false; // Closed term students are deactivated
                u.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteSemesterAsync(Guid id)
    {
        var semester = await _context.Semesters
            .Where(s => s.Id == id && !s.IsDeleted)
            .FirstOrDefaultAsync();

        if (semester == null)
            return false;

        semester.IsDeleted = true;
        semester.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    private static SemesterDto MapToDto(Semester semester)
    {
        var validInternships = semester.Internships.Where(i => !i.IsDeleted).ToList();
        var studentsCount = validInternships.Count;

        // Lecturers = assigned via internships OR imported/registered via SemesterLecturers.
        var lecturerIds = validInternships
            .Where(i => i.LecturerId != null)
            .Select(i => i.LecturerId!.Value);
        if (semester.SemesterLecturers != null)
        {
            lecturerIds = lecturerIds.Concat(
                semester.SemesterLecturers.Where(sl => !sl.IsDeleted).Select(sl => sl.LecturerId));
        }
        var lecturersCount = lecturerIds.Distinct().Count();

        var companiesCount = validInternships.Select(i => i.CompanyId).Distinct().Count();
        var placedStudents = validInternships.Count(i => i.Status == InternshipStatus.InProgress || i.Status == InternshipStatus.Completed);

        var progressPercent = semester.Status switch
        {
            SemesterStatus.Completed => 100,
            SemesterStatus.Active => 66,
            SemesterStatus.Upcoming => 10,
            _ => 0
        };

        var currentPhase = semester.Status switch
        {
            SemesterStatus.Completed => "Đã hoàn thành & Khóa dữ liệu",
            SemesterStatus.Active => "Thực tập & Nộp báo cáo giữa kỳ",
            SemesterStatus.Upcoming => "Tiếp nhận hồ sơ & Phân công",
            _ => "Chuẩn bị danh sách"
        };

        return new SemesterDto
        {
            Id = semester.Id,
            Name = semester.Name,
            Term = semester.Term,
            AcademicYear = semester.AcademicYear,
            StartDate = semester.StartDate,
            EndDate = semester.EndDate,
            Status = semester.Status,
            Description = semester.Description,
            MaxStudentsPerLecturer = semester.MaxStudentsPerLecturer,
            StudentsCount = studentsCount,
            LecturersCount = lecturersCount,
            PlacedStudents = placedStudents,
            CompaniesCount = companiesCount,
            ProgressPercent = progressPercent,
            CurrentPhase = currentPhase,
            CreatedAt = semester.CreatedAt
        };
    }
}
