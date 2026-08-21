using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class AssignmentService : IAssignmentService
{
    /// <summary>
    /// Placeholder company for internships awaiting company assignment by lecturer.
    /// </summary>
    public const string UnassignedCompanyName = "Chưa phân công doanh nghiệp";
    public const string AutoAssignNotePrefix = "Phân công tự động";
    public const int DefaultMaxCapacity = 40;

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

        // Validate or fallback semester
        Guid targetSemesterId;
        if (request.SemesterId.HasValue && request.SemesterId.Value != Guid.Empty)
        {
            var semesterExists = await _db.Semesters.AnyAsync(s => s.Id == request.SemesterId.Value && !s.IsDeleted);
            if (!semesterExists)
                throw new InvalidOperationException($"Semester with ID {request.SemesterId.Value} not found");
            targetSemesterId = request.SemesterId.Value;
        }
        else
        {
            var activeSemester = await _db.Semesters
                .FirstOrDefaultAsync(s => s.Status == SemesterStatus.Active && !s.IsDeleted)
                ?? await _db.Semesters.FirstOrDefaultAsync(s => !s.IsDeleted);

            if (activeSemester == null)
                throw new InvalidOperationException("No active semester found for assignment");

            targetSemesterId = activeSemester.Id;
        }

        var result = new BulkAssignResultDto();
        var errors = new List<AssignmentErrorDto>();

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

            // Check for internship in specific semester
            var internship = await _db.Internships
                .FirstOrDefaultAsync(i => 
                    i.StudentId == studentId && 
                    i.SemesterId == targetSemesterId && 
                    !i.IsDeleted);

            if (internship == null)
            {
                internship = new Internship
                {
                    Id = Guid.NewGuid(),
                    StudentId = studentId,
                    SemesterId = targetSemesterId,
                    CompanyId = null,
                    LecturerId = request.LecturerId,
                    Status = InternshipStatus.NotStarted,
                    Notes = request.Note ?? "Phân công giảng viên — chờ gán doanh nghiệp",
                    CreatedAt = DateTime.UtcNow
                };
                await _db.Internships.AddAsync(internship);
                result.CreatedCount++;
            }
            else
            {
                internship.LecturerId = request.LecturerId;
                if (!string.IsNullOrWhiteSpace(request.Note))
                    internship.Notes = request.Note;
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

    public async Task<IReadOnlyList<AssignmentHistoryItemDto>> GetHistoryAsync(int limit = 50)
    {
        var internships = await _db.Internships
            .AsNoTracking()
            .Where(i => !i.IsDeleted && i.LecturerId != null)
            .Include(i => i.Lecturer)
            .Include(i => i.Student)
            .OrderByDescending(i => i.UpdatedAt ?? i.CreatedAt)
            .Take(Math.Min(limit * 20, 1000))
            .ToListAsync();

        return internships
            .GroupBy(i => new
            {
                i.LecturerId,
                LecturerName = i.Lecturer!.FullName,
                Bucket = (i.UpdatedAt ?? i.CreatedAt).ToString("yyyy-MM-dd HH:mm"),
            })
            .OrderByDescending(g => g.Max(x => x.UpdatedAt ?? x.CreatedAt))
            .Take(limit)
            .Select(g =>
            {
                var isAuto = g.Any(x =>
                    x.Notes != null &&
                    x.Notes.Contains(AutoAssignNotePrefix, StringComparison.Ordinal));
                return new AssignmentHistoryItemDto
                {
                    Id = $"{g.Key.LecturerId}-{g.Key.Bucket}",
                    LecturerName = g.Key.LecturerName,
                    StudentCount = g.Count(),
                    Timestamp = g.Max(x => x.UpdatedAt ?? x.CreatedAt),
                    ClassGroups = g
                        .Select(x => x.Student?.Class)
                        .Where(c => !string.IsNullOrWhiteSpace(c))
                        .Distinct()
                        .Cast<string>()
                        .ToList(),
                    AssignedBy = isAuto ? "Hệ thống Smart Balance" : "Ban quản lý thực tập",
                };
            })
            .ToList();
    }

    public async Task<byte[]> ExportExcelAsync()
    {
        var students = await _db.Students
            .AsNoTracking()
            .Where(s => !s.IsDeleted)
            .OrderBy(s => s.StudentCode)
            .ToListAsync();

        var internships = await _db.Internships
            .AsNoTracking()
            .Where(i => !i.IsDeleted && i.LecturerId != null)
            .Include(i => i.Lecturer)
            .Include(i => i.Company)
            .ToListAsync();

        var byStudent = internships.ToDictionary(i => i.StudentId);

        using var workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("PhanCong");

        sheet.Cell(1, 1).Value = "InternLink - Báo cáo phân công hướng dẫn thực tập";
        sheet.Cell(2, 1).Value = "Ngày xuất:";
        sheet.Cell(2, 2).Value = DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm") + " UTC";

        var headerRow = 4;
        var headers = new[]
        {
            "MSSV", "Họ tên", "Lớp", "Ngành", "Giảng viên", "MSGV",
            "Doanh nghiệp", "Ngày phân công", "Trạng thái"
        };
        for (var col = 0; col < headers.Length; col++)
            sheet.Cell(headerRow, col + 1).Value = headers[col];

        var row = headerRow + 1;
        foreach (var student in students)
        {
            byStudent.TryGetValue(student.Id, out var internship);
            sheet.Cell(row, 1).Value = student.StudentCode;
            sheet.Cell(row, 2).Value = student.FullName;
            sheet.Cell(row, 3).Value = student.Class ?? "";
            sheet.Cell(row, 4).Value = student.Major ?? "";
            sheet.Cell(row, 5).Value = internship?.Lecturer?.FullName ?? "";
            sheet.Cell(row, 6).Value = internship?.Lecturer?.StaffCode ?? "";
            sheet.Cell(row, 7).Value =
                internship?.Company?.CompanyName == UnassignedCompanyName
                    ? "Chưa có DN"
                    : internship?.Company?.CompanyName ?? "";
            sheet.Cell(row, 8).Value = internship == null
                ? ""
                : (internship.UpdatedAt ?? internship.CreatedAt).ToString("dd/MM/yyyy");
            sheet.Cell(row, 9).Value = internship == null
                ? "Chưa phân công"
                : internship.Status.ToString();
            row++;
        }

        sheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    public async Task<AutoAssignResultDto> AutoAssignAsync(AutoAssignRequest request)
    {
        var strategy = (request.Strategy ?? "even").Trim().ToLowerInvariant();
        if (strategy is not ("department" or "even"))
            throw new InvalidOperationException("Strategy must be 'department' or 'even'");

        var lecturers = await _db.Lecturers
            .AsNoTracking()
            .Where(l => !l.IsDeleted)
            .OrderBy(l => l.FullName)
            .ToListAsync();

        if (lecturers.Count == 0)
            return new AutoAssignResultDto();

        var students = await _db.Students
            .AsNoTracking()
            .Where(s => !s.IsDeleted)
            .OrderBy(s => s.StudentCode)
            .ToListAsync();

        var internships = await _db.Internships
            .Where(i => !i.IsDeleted)
            .ToListAsync();

        var assignedStudentIds = internships
            .Where(i => i.LecturerId != null)
            .Select(i => i.StudentId)
            .ToHashSet();

        var lecturerCounts = internships
            .Where(i => i.LecturerId != null)
            .GroupBy(i => i.LecturerId!.Value)
            .ToDictionary(g => g.Key, g => g.Count());

        var unassigned = students.Where(s => !assignedStudentIds.Contains(s.Id)).ToList();
        if (unassigned.Count == 0)
            return new AutoAssignResultDto();

        var batches = new Dictionary<Guid, List<Guid>>();
        var note = strategy == "department"
            ? $"{AutoAssignNotePrefix} — ghép theo bộ môn"
            : $"{AutoAssignNotePrefix} — chia đều";

        foreach (var student in unassigned)
        {
            var lecturerId = strategy == "department"
                ? PickLecturerByDepartment(student, lecturers, lecturerCounts)
                : null;
            lecturerId ??= PickLecturerEven(lecturers, lecturerCounts);
            if (lecturerId == null)
                break;

            if (!batches.TryGetValue(lecturerId.Value, out var list))
            {
                list = new List<Guid>();
                batches[lecturerId.Value] = list;
            }

            list.Add(student.Id);
            lecturerCounts[lecturerId.Value] = lecturerCounts.GetValueOrDefault(lecturerId.Value) + 1;
        }

        var activeSemester = await _db.Semesters
            .FirstOrDefaultAsync(s => s.Status == SemesterStatus.Active && !s.IsDeleted)
            ?? await _db.Semesters.FirstOrDefaultAsync(s => !s.IsDeleted);

        if (activeSemester == null)
            throw new InvalidOperationException("No active semester found for auto assignment");

        var result = new AutoAssignResultDto { LecturersUsed = batches.Count };
        foreach (var (lecturerId, studentIds) in batches)
        {
            var bulk = await BulkAssignAsync(new BulkAssignRequest
            {
                LecturerId = lecturerId,
                SemesterId = activeSemester.Id,
                StudentIds = studentIds,
                Note = note,
            });
            result.TotalAssigned += bulk.AssignedCount;
            result.TotalFailed += bulk.FailedCount;
        }

        return result;
    }

    private static Guid? PickLecturerEven(
        IReadOnlyList<Lecturer> lecturers,
        Dictionary<Guid, int> lecturerCounts)
    {
        return lecturers
            .Select(l => new { l.Id, Count = lecturerCounts.GetValueOrDefault(l.Id) })
            .Where(x => x.Count < DefaultMaxCapacity)
            .OrderBy(x => x.Count)
            .ThenBy(x => x.Id)
            .Select(x => (Guid?)x.Id)
            .FirstOrDefault();
    }

    private static Guid? PickLecturerByDepartment(
        Student student,
        IReadOnlyList<Lecturer> lecturers,
        Dictionary<Guid, int> lecturerCounts)
    {
        var major = student.Major?.Trim();
        if (string.IsNullOrWhiteSpace(major))
            return null;

        var match = lecturers
            .Where(l =>
            {
                var dept = l.Department?.Trim();
                if (string.IsNullOrWhiteSpace(dept))
                    return false;
                return major.Contains(dept, StringComparison.OrdinalIgnoreCase)
                    || dept.Contains(major, StringComparison.OrdinalIgnoreCase);
            })
            .Select(l => new { l.Id, Count = lecturerCounts.GetValueOrDefault(l.Id) })
            .Where(x => x.Count < DefaultMaxCapacity)
            .OrderBy(x => x.Count)
            .Select(x => (Guid?)x.Id)
            .FirstOrDefault();

        return match;
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
