using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using AutoMapper;
using ClosedXML.Excel;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class LecturerProfileService : ILecturerProfileService
{
    public const string DefaultPassword = SeedData.DefaultPassword;

    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly PasswordHasher<User> _hasher;

    private static readonly string[] StaffCodeHeaders = ["magv", "ma gv", "staffcode", "staff code", "code"];
    private static readonly string[] FullNameHeaders = ["hoten", "ho ten", "fullname", "full name", "tengiangvien", "ten giang vien"];
    private static readonly string[] EmailHeaders = ["email", "e-mail"];
    private static readonly string[] PhoneHeaders = ["phone", "sdt", "sđt", "dien thoai", "điện thoại"];
    private static readonly string[] DepartmentHeaders = ["bomon", "bo mon", "department", "khoa"];
    private static readonly string[] UsernameHeaders = ["username", "tendangnhap", "ten dang nhap"];

    public LecturerProfileService(AppDbContext db, IMapper mapper, PasswordHasher<User> hasher)
    {
        _db = db;
        _mapper = mapper;
        _hasher = hasher;
    }

    public async Task<IEnumerable<LecturerDto>> GetAllAsync(int skip = 0, int take = 100)
    {
        var items = await _db.Lecturers
            .Where(l => !l.IsDeleted)
            .OrderBy(l => l.FullName)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return _mapper.Map<List<LecturerDto>>(items);
    }

    public async Task<LecturerDto?> GetByIdAsync(Guid id)
    {
        var lecturer = await _db.Lecturers.FirstOrDefaultAsync(l => l.Id == id && !l.IsDeleted);
        return lecturer == null ? null : _mapper.Map<LecturerDto>(lecturer);
    }

    public async Task<LecturerDto?> GetByUserIdAsync(Guid userId)
    {
        var lecturer = await _db.Lecturers.FirstOrDefaultAsync(l => l.UserId == userId && !l.IsDeleted);
        return lecturer == null ? null : _mapper.Map<LecturerDto>(lecturer);
    }

    public async Task<LecturerDto> CreateAsync(CreateLecturerRequest request)
    {
        if (await _db.Lecturers.AnyAsync(l => l.StaffCode == request.StaffCode && !l.IsDeleted))
            throw new InvalidOperationException($"Staff code '{request.StaffCode}' already exists");

        Guid? userId = request.UserId;
        if (!string.IsNullOrWhiteSpace(request.Username))
        {
            userId = await EnsureLecturerUserAsync(request.Username.Trim(), request.FullName, request.Email);
        }
        else if (userId.HasValue)
        {
            var userTaken = await _db.Lecturers.AnyAsync(l => l.UserId == userId && !l.IsDeleted);
            if (userTaken)
                throw new InvalidOperationException("User is already linked to another lecturer profile");
        }

        var lecturer = new Lecturer
        {
            Id = Guid.NewGuid(),
            StaffCode = request.StaffCode.Trim(),
            FullName = request.FullName.Trim(),
            Email = NullIfWhiteSpace(request.Email),
            Phone = NullIfWhiteSpace(request.Phone),
            Department = NullIfWhiteSpace(request.Department),
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Lecturers.AddAsync(lecturer);
        await _db.SaveChangesAsync();
        return _mapper.Map<LecturerDto>(lecturer);
    }

    public async Task<LecturerDto?> UpdateAsync(Guid id, UpdateLecturerRequest request)
    {
        var lecturer = await _db.Lecturers.FirstOrDefaultAsync(l => l.Id == id && !l.IsDeleted);
        if (lecturer == null)
            return null;

        if (request.UserId.HasValue && request.UserId != lecturer.UserId)
        {
            var userTaken = await _db.Lecturers.AnyAsync(l => l.UserId == request.UserId && l.Id != id && !l.IsDeleted);
            if (userTaken)
                throw new InvalidOperationException("User is already linked to another lecturer profile");
            lecturer.UserId = request.UserId;
        }

        lecturer.FullName = request.FullName.Trim();
        lecturer.Email = NullIfWhiteSpace(request.Email);
        lecturer.Phone = NullIfWhiteSpace(request.Phone);
        lecturer.Department = NullIfWhiteSpace(request.Department);
        lecturer.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return _mapper.Map<LecturerDto>(lecturer);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var lecturer = await _db.Lecturers.FirstOrDefaultAsync(l => l.Id == id && !l.IsDeleted);
        if (lecturer == null)
            return false;

        var hasInternships = await _db.Internships.AnyAsync(i => i.LecturerId == id && !i.IsDeleted);
        if (hasInternships)
            throw new InvalidOperationException("Cannot delete lecturer with assigned internships");

        lecturer.IsDeleted = true;
        lecturer.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<LecturerOverviewDto?> GetOverviewAsync(Guid lecturerId)
    {
        var lecturer = await _db.Lecturers.FirstOrDefaultAsync(l => l.Id == lecturerId && !l.IsDeleted);
        if (lecturer == null)
            return null;

        var internships = await _db.Internships
            .Where(i => i.LecturerId == lecturerId && !i.IsDeleted)
            .Include(i => i.Student)
            .Include(i => i.Company)
            .Include(i => i.Submissions)
            .Include(i => i.WeeklyReports)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

        var summaries = internships.Select(i => new LecturerInternshipSummaryDto
        {
            InternshipId = i.Id,
            StudentId = i.StudentId,
            StudentCode = i.Student?.StudentCode ?? string.Empty,
            StudentName = i.Student?.FullName ?? string.Empty,
            CompanyName = i.Company?.CompanyName,
            Status = i.Status.ToString(),
            SubmissionCount = i.Submissions?.Count(s => !s.IsDeleted) ?? 0,
            WeeklyReportCount = i.WeeklyReports?.Count(w => !w.IsDeleted) ?? 0,
            StartDate = i.StartDate,
            EndDate = i.EndDate
        }).ToList();

        var statusCounts = summaries
            .GroupBy(s => s.Status)
            .ToDictionary(g => g.Key, g => g.Count());

        return new LecturerOverviewDto
        {
            Lecturer = _mapper.Map<LecturerDto>(lecturer),
            TotalInternships = summaries.Count,
            StatusCounts = statusCounts,
            Internships = summaries
        };
    }

    public async Task<LecturerImportResultDto> ImportFromExcelAsync(Stream excelStream)
    {
        if (excelStream == null || !excelStream.CanRead)
            throw new ArgumentException("Excel file stream is required");

        using var workbook = new XLWorkbook(excelStream);
        var worksheet = workbook.Worksheets.FirstOrDefault()
            ?? throw new InvalidOperationException("Excel file has no worksheet");

        var usedRange = worksheet.RangeUsed();
        if (usedRange == null)
            throw new InvalidOperationException("Excel file is empty");

        var columnMap = BuildColumnMap(usedRange.FirstRow());
        if (!columnMap.ContainsKey(Col.StaffCode) || !columnMap.ContainsKey(Col.FullName))
            throw new InvalidOperationException("Excel must include MaGV (StaffCode) and HoTen (FullName) columns");

        var errors = new List<LecturerImportErrorDto>();
        var created = new List<Lecturer>();
        var seenCodes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var seenUsernames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var totalRows = 0;
        var skippedDuplicates = 0;

        foreach (var row in usedRange.RowsUsed().Skip(1))
        {
            var rowNumber = row.RowNumber();
            var staffCode = GetCell(row, columnMap, Col.StaffCode);
            var fullName = GetCell(row, columnMap, Col.FullName);
            var email = GetCell(row, columnMap, Col.Email);
            var phone = GetCell(row, columnMap, Col.Phone);
            var department = GetCell(row, columnMap, Col.Department);
            var username = GetCell(row, columnMap, Col.Username);

            if (IsBlankRow(staffCode, fullName, email, phone, department, username))
                continue;

            totalRows++;

            if (string.IsNullOrWhiteSpace(staffCode))
            {
                errors.Add(new LecturerImportErrorDto { RowNumber = rowNumber, Message = "Staff code (MaGV) is required" });
                continue;
            }

            if (string.IsNullOrWhiteSpace(fullName))
            {
                errors.Add(new LecturerImportErrorDto { RowNumber = rowNumber, StaffCode = staffCode, Message = "Full name is required" });
                continue;
            }

            staffCode = staffCode.Trim();
            fullName = fullName.Trim();

            if (!seenCodes.Add(staffCode))
            {
                errors.Add(new LecturerImportErrorDto { RowNumber = rowNumber, StaffCode = staffCode, Message = "Duplicate MaGV in file" });
                continue;
            }

            if (await _db.Lecturers.AnyAsync(l => l.StaffCode == staffCode && !l.IsDeleted))
            {
                skippedDuplicates++;
                errors.Add(new LecturerImportErrorDto { RowNumber = rowNumber, StaffCode = staffCode, Message = "MaGV already exists in system" });
                continue;
            }

            if (string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(email) && email.Contains('@'))
                username = email.Split('@')[0];

            Guid? userId = null;
            if (!string.IsNullOrWhiteSpace(username))
            {
                username = username.Trim();
                if (!seenUsernames.Add(username))
                {
                    errors.Add(new LecturerImportErrorDto { RowNumber = rowNumber, StaffCode = staffCode, Username = username, Message = "Duplicate username in file" });
                    continue;
                }

                try
                {
                    userId = await EnsureLecturerUserAsync(username, fullName, email);
                }
                catch (InvalidOperationException ex)
                {
                    errors.Add(new LecturerImportErrorDto { RowNumber = rowNumber, StaffCode = staffCode, Username = username, Message = ex.Message });
                    continue;
                }
            }

            created.Add(new Lecturer
            {
                Id = Guid.NewGuid(),
                StaffCode = staffCode,
                FullName = fullName,
                Email = NullIfWhiteSpace(email),
                Phone = NullIfWhiteSpace(phone),
                Department = NullIfWhiteSpace(department),
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            });
        }

        if (created.Count > 0)
        {
            await _db.Lecturers.AddRangeAsync(created);
            await _db.SaveChangesAsync();
        }

        return new LecturerImportResultDto
        {
            TotalRows = totalRows,
            SuccessCount = created.Count,
            FailedCount = errors.Count,
            SkippedDuplicateCount = skippedDuplicates,
            DefaultPassword = DefaultPassword,
            CreatedLecturers = _mapper.Map<List<LecturerDto>>(created),
            Errors = errors
        };
    }

    public byte[] GetImportTemplate()
    {
        using var workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("Lecturers");

        sheet.Cell(1, 1).Value = "MaGV";
        sheet.Cell(1, 2).Value = "HoTen";
        sheet.Cell(1, 3).Value = "Email";
        sheet.Cell(1, 4).Value = "SDT";
        sheet.Cell(1, 5).Value = "BoMon";
        sheet.Cell(1, 6).Value = "Username";

        sheet.Cell(2, 1).Value = "GV001";
        sheet.Cell(2, 2).Value = "Nguyen Van A";
        sheet.Cell(2, 3).Value = "nguyenvana@university.edu.vn";
        sheet.Cell(2, 4).Value = "0901234567";
        sheet.Cell(2, 5).Value = "CNTT";
        sheet.Cell(2, 6).Value = "gv.nguyenvana";

        sheet.Cell(4, 1).Value = "Ghi chu:";
        sheet.Cell(4, 2).Value = $"Neu co Username thi tao tai khoan login, mat khau mac dinh: {DefaultPassword}";

        sheet.Row(1).Style.Font.Bold = true;
        sheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    private async Task<Guid> EnsureLecturerUserAsync(string username, string fullName, string? email)
    {
        var existing = await _db.Users.FirstOrDefaultAsync(u => u.Username == username && !u.IsDeleted);
        if (existing != null)
        {
            if (existing.Role != Role.Lecturer)
                throw new InvalidOperationException($"Username '{username}' exists but is not a Lecturer account");

            var linked = await _db.Lecturers.AnyAsync(l => l.UserId == existing.Id && !l.IsDeleted);
            if (linked)
                throw new InvalidOperationException($"Username '{username}' is already linked to a lecturer profile");

            return existing.Id;
        }

        if (!string.IsNullOrWhiteSpace(email))
        {
            var emailTaken = await _db.Users.AnyAsync(u => u.Email == email && !u.IsDeleted);
            if (emailTaken)
                throw new InvalidOperationException($"Email '{email}' already exists in system");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = username,
            FullName = fullName,
            Email = NullIfWhiteSpace(email),
            Role = Role.Lecturer,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        user.PasswordHash = _hasher.HashPassword(user, DefaultPassword);
        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();
        return user.Id;
    }

    private enum Col { StaffCode, FullName, Email, Phone, Department, Username }

    private static Dictionary<Col, int> BuildColumnMap(IXLRangeRow headerRow)
    {
        var map = new Dictionary<Col, int>();
        foreach (var cell in headerRow.CellsUsed())
        {
            var header = NormalizeHeader(cell.GetString());
            if (string.IsNullOrEmpty(header)) continue;

            if (!map.ContainsKey(Col.StaffCode) && StaffCodeHeaders.Contains(header))
                map[Col.StaffCode] = cell.Address.ColumnNumber;
            else if (!map.ContainsKey(Col.FullName) && FullNameHeaders.Contains(header))
                map[Col.FullName] = cell.Address.ColumnNumber;
            else if (!map.ContainsKey(Col.Email) && EmailHeaders.Contains(header))
                map[Col.Email] = cell.Address.ColumnNumber;
            else if (!map.ContainsKey(Col.Phone) && PhoneHeaders.Contains(header))
                map[Col.Phone] = cell.Address.ColumnNumber;
            else if (!map.ContainsKey(Col.Department) && DepartmentHeaders.Contains(header))
                map[Col.Department] = cell.Address.ColumnNumber;
            else if (!map.ContainsKey(Col.Username) && UsernameHeaders.Contains(header))
                map[Col.Username] = cell.Address.ColumnNumber;
        }
        return map;
    }

    private static string NormalizeHeader(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return string.Empty;
        var normalized = RemoveDiacritics(value.Trim().ToLowerInvariant());
        return Regex.Replace(normalized, @"\s+", " ");
    }

    private static string RemoveDiacritics(string text)
    {
        var formD = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(formD.Length);
        foreach (var ch in formD)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(ch) != UnicodeCategory.NonSpacingMark)
                sb.Append(ch);
        }
        return sb.ToString().Normalize(NormalizationForm.FormC).Replace('đ', 'd').Replace('Đ', 'D');
    }

    private static string? GetCell(IXLRangeRow row, Dictionary<Col, int> map, Col column)
    {
        if (!map.TryGetValue(column, out var colIndex)) return null;
        var cell = row.Cell(colIndex);
        if (cell.DataType == XLDataType.Number)
            return cell.GetDouble().ToString("0");
        var text = cell.GetString();
        return string.IsNullOrWhiteSpace(text) ? null : text.Trim();
    }

    private static bool IsBlankRow(params string?[] values) => values.All(string.IsNullOrWhiteSpace);
    private static string? NullIfWhiteSpace(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
