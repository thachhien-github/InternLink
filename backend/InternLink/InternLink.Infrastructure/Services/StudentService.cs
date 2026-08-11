using AutoMapper;
using ClosedXML.Excel;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace InternLink.Infrastructure.Services;

public class StudentService : IStudentService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    private static readonly string[] StudentCodeHeaders = ["mssv", "studentCode", "student number", "studentcode", "ma sv", "masv"];
    private static readonly string[] FullNameHeaders = ["hoten", "ho ten", "fullname", "full name", "student name", "ten sinh vien"];
    private static readonly string[] ClassHeaders = ["lop", "class"];
    private static readonly string[] MajorHeaders = ["nganh", "ngành", "chuyen nganh", "chuyên ngành", "major"];
    private static readonly string[] EmailHeaders = ["email", "e-mail"];
    private static readonly string[] PhoneHeaders = ["phone", "sdt", "sđt", "dien thoai", "điện thoại", "so dien thoai", "số điện thoại"];

    public StudentService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<IEnumerable<StudentDto>> GetAllStudentsAsync(int skip = 0, int take = 100)
    {
        var students = await _db.Students
            .Where(s => !s.IsDeleted)
            .OrderBy(s => s.FullName)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return _mapper.Map<List<StudentDto>>(students);
    }

    public async Task<PaginatedResponse<StudentDto>> GetStudentsWithFilterAsync(StudentFilterRequest filter)
    {
        var query = _db.Students.Where(s => !s.IsDeleted);

        if (!string.IsNullOrWhiteSpace(filter.Class))
            query = query.Where(s => s.Class == filter.Class);

        if (!string.IsNullOrWhiteSpace(filter.Major))
            query = query.Where(s => s.Major == filter.Major);

        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            var searchLower = filter.SearchTerm.ToLower();
            query = query.Where(s =>
                s.FullName.ToLower().Contains(searchLower) ||
                s.StudentCode.ToLower().Contains(searchLower)
            );
        }

        var total = await query.CountAsync();

        var students = await query
            .OrderBy(s => s.FullName)
            .Skip(filter.Skip)
            .Take(filter.Take)
            .ToListAsync();

        return new PaginatedResponse<StudentDto>
        {
            Items = _mapper.Map<List<StudentDto>>(students),
            Total = total,
            Skip = filter.Skip,
            Take = filter.Take
        };
    }

    public async Task<StudentDto?> GetStudentByIdAsync(Guid id)
    {
        var student = await _db.Students
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        return student == null ? null : _mapper.Map<StudentDto>(student);
    }

    public async Task<StudentDto?> GetStudentByCodeAsync(string studentCode)
    {
        var student = await _db.Students
            .FirstOrDefaultAsync(s => s.StudentCode == studentCode && !s.IsDeleted);

        return student == null ? null : _mapper.Map<StudentDto>(student);
    }

    public async Task<StudentDto?> GetStudentByUserIdAsync(Guid userId)
    {
        var student = await _db.Students
            .FirstOrDefaultAsync(s => s.UserId == userId && !s.IsDeleted);

        return student == null ? null : _mapper.Map<StudentDto>(student);
    }

    public async Task<StudentDto> CreateStudentAsync(CreateStudentRequest request)
    {
        var existingStudent = await _db.Students
            .FirstOrDefaultAsync(s => s.StudentCode == request.StudentCode && !s.IsDeleted);

        if (existingStudent != null)
            throw new InvalidOperationException($"Student number '{request.StudentCode}' already exists");

        if (request.UserId.HasValue)
        {
            var userTaken = await _db.Students.AnyAsync(s => s.UserId == request.UserId && !s.IsDeleted);
            if (userTaken)
                throw new InvalidOperationException("User is already linked to another student profile");
        }

        var student = new Student
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            StudentCode = request.StudentCode,
            FullName = request.FullName,
            Class = request.Class,
            Major = request.Major,
            Email = request.Email,
            Phone = request.Phone,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Students.AddAsync(student);
        await _db.SaveChangesAsync();

        return _mapper.Map<StudentDto>(student);
    }

    public async Task<StudentDto?> UpdateStudentAsync(Guid id, UpdateStudentRequest request)
    {
        var student = await _db.Students
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (student == null)
            return null;

        if (request.UserId.HasValue && request.UserId != student.UserId)
        {
            var userTaken = await _db.Students.AnyAsync(s => s.UserId == request.UserId && s.Id != id && !s.IsDeleted);
            if (userTaken)
                throw new InvalidOperationException("User is already linked to another student profile");
            student.UserId = request.UserId;
        }

        student.FullName = request.FullName;
        student.Class = request.Class;
        student.Major = request.Major;
        student.Email = request.Email;
        student.Phone = request.Phone;
        student.UpdatedAt = DateTime.UtcNow;

        _db.Students.Update(student);
        await _db.SaveChangesAsync();

        return _mapper.Map<StudentDto>(student);
    }

    public async Task<bool> DeleteStudentAsync(Guid id)
    {
        var student = await _db.Students
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);

        if (student == null)
            return false;

        var hasInternships = await _db.Internships
            .AnyAsync(i => i.StudentId == id && !i.IsDeleted);

        if (hasInternships)
            throw new InvalidOperationException("Cannot delete student with existing internships");

        student.IsDeleted = true;
        student.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> StudentCodeExistsAsync(string studentCode, Guid? excludeId = null)
    {
        var query = _db.Students.Where(s => s.StudentCode == studentCode && !s.IsDeleted);

        if (excludeId.HasValue)
            query = query.Where(s => s.Id != excludeId.Value);

        return await query.AnyAsync();
    }

    public async Task<StudentImportResultDto> ImportStudentsFromExcelAsync(Stream excelStream)
    {
        if (excelStream == null || !excelStream.CanRead)
            throw new ArgumentException("Excel file stream is required");

        using var workbook = new XLWorkbook(excelStream);
        var worksheet = workbook.Worksheets.FirstOrDefault()
            ?? throw new InvalidOperationException("Excel file has no worksheet");

        var usedRange = worksheet.RangeUsed();
        if (usedRange == null)
            throw new InvalidOperationException("Excel file is empty");

        var headerRow = usedRange.FirstRow();
        var columnMap = BuildColumnMap(headerRow);

        if (!columnMap.ContainsKey(StudentColumn.StudentCode) || !columnMap.ContainsKey(StudentColumn.FullName))
            throw new InvalidOperationException("Excel must include MSSV and HoTen (or studentCode and FullName) columns");

        var errors = new List<StudentImportErrorDto>();
        var created = new List<Student>();
        var seenInFile = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var totalRows = 0;
        var skippedDuplicates = 0;

        foreach (var row in usedRange.RowsUsed().Skip(1))
        {
            var rowNumber = row.RowNumber();
            var studentCode = GetCell(row, columnMap, StudentColumn.StudentCode);
            var fullName = GetCell(row, columnMap, StudentColumn.FullName);
            var className = GetCell(row, columnMap, StudentColumn.Class);
            var major = GetCell(row, columnMap, StudentColumn.Major);
            var email = GetCell(row, columnMap, StudentColumn.Email);
            var phone = GetCell(row, columnMap, StudentColumn.Phone);

            if (IsBlankRow(studentCode, fullName, className, major, email, phone))
                continue;

            totalRows++;

            if (string.IsNullOrWhiteSpace(studentCode))
            {
                errors.Add(new StudentImportErrorDto { RowNumber = rowNumber, Message = "MSSV is required" });
                continue;
            }

            if (string.IsNullOrWhiteSpace(fullName))
            {
                errors.Add(new StudentImportErrorDto { RowNumber = rowNumber, StudentCode = studentCode, Message = "Full name is required" });
                continue;
            }

            if (studentCode.Length > 50)
            {
                errors.Add(new StudentImportErrorDto { RowNumber = rowNumber, StudentCode = studentCode, Message = "MSSV must not exceed 50 characters" });
                continue;
            }

            if (fullName.Length > 200)
            {
                errors.Add(new StudentImportErrorDto { RowNumber = rowNumber, StudentCode = studentCode, Message = "Full name must not exceed 200 characters" });
                continue;
            }

            if (!string.IsNullOrWhiteSpace(email) && !IsValidEmail(email))
            {
                errors.Add(new StudentImportErrorDto { RowNumber = rowNumber, StudentCode = studentCode, Message = "Invalid email format" });
                continue;
            }

            if (!seenInFile.Add(studentCode))
            {
                errors.Add(new StudentImportErrorDto { RowNumber = rowNumber, StudentCode = studentCode, Message = "Duplicate MSSV in file" });
                continue;
            }

            if (await StudentCodeExistsAsync(studentCode))
            {
                skippedDuplicates++;
                errors.Add(new StudentImportErrorDto { RowNumber = rowNumber, StudentCode = studentCode, Message = "MSSV already exists in system" });
                continue;
            }

            created.Add(new Student
            {
                Id = Guid.NewGuid(),
                StudentCode = studentCode.Trim(),
                FullName = fullName.Trim(),
                Class = NullIfWhiteSpace(className),
                Major = NullIfWhiteSpace(major),
                Email = NullIfWhiteSpace(email),
                Phone = NullIfWhiteSpace(phone),
                CreatedAt = DateTime.UtcNow
            });
        }

        if (created.Count > 0)
        {
            await _db.Students.AddRangeAsync(created);
            await _db.SaveChangesAsync();
        }

        return new StudentImportResultDto
        {
            TotalRows = totalRows,
            SuccessCount = created.Count,
            FailedCount = errors.Count,
            SkippedDuplicateCount = skippedDuplicates,
            CreatedStudents = _mapper.Map<List<StudentDto>>(created),
            Errors = errors
        };
    }

    public byte[] GetStudentImportTemplate()
    {
        using var workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("Students");

        sheet.Cell(1, 1).Value = "MSSV";
        sheet.Cell(1, 2).Value = "HoTen";
        sheet.Cell(1, 3).Value = "Lop";
        sheet.Cell(1, 4).Value = "Nganh";
        sheet.Cell(1, 5).Value = "Email";
        sheet.Cell(1, 6).Value = "SDT";

        sheet.Cell(2, 1).Value = "2421160052";
        sheet.Cell(2, 2).Value = "Nguyen Van A";
        sheet.Cell(2, 3).Value = "DH24TIN06";
        sheet.Cell(2, 4).Value = "Cong nghe thong tin";
        sheet.Cell(2, 5).Value = "vana@student.edu.vn";
        sheet.Cell(2, 6).Value = "0901234567";

        sheet.Row(1).Style.Font.Bold = true;
        sheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    private enum StudentColumn
    {
        StudentCode,
        FullName,
        Class,
        Major,
        Email,
        Phone
    }

    private static Dictionary<StudentColumn, int> BuildColumnMap(IXLRangeRow headerRow)
    {
        var map = new Dictionary<StudentColumn, int>();

        foreach (var cell in headerRow.CellsUsed())
        {
            var header = NormalizeHeader(cell.GetString());
            if (string.IsNullOrEmpty(header))
                continue;

            if (!map.ContainsKey(StudentColumn.StudentCode) && StudentCodeHeaders.Contains(header))
                map[StudentColumn.StudentCode] = cell.Address.ColumnNumber;
            else if (!map.ContainsKey(StudentColumn.FullName) && FullNameHeaders.Contains(header))
                map[StudentColumn.FullName] = cell.Address.ColumnNumber;
            else if (!map.ContainsKey(StudentColumn.Class) && ClassHeaders.Contains(header))
                map[StudentColumn.Class] = cell.Address.ColumnNumber;
            else if (!map.ContainsKey(StudentColumn.Major) && MajorHeaders.Contains(header))
                map[StudentColumn.Major] = cell.Address.ColumnNumber;
            else if (!map.ContainsKey(StudentColumn.Email) && EmailHeaders.Contains(header))
                map[StudentColumn.Email] = cell.Address.ColumnNumber;
            else if (!map.ContainsKey(StudentColumn.Phone) && PhoneHeaders.Contains(header))
                map[StudentColumn.Phone] = cell.Address.ColumnNumber;
        }

        return map;
    }

    private static string NormalizeHeader(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        var normalized = value.Trim().ToLowerInvariant();
        normalized = RemoveDiacritics(normalized);
        normalized = Regex.Replace(normalized, @"\s+", " ");
        return normalized;
    }

    private static string RemoveDiacritics(string text)
    {
        var formD = text.Normalize(System.Text.NormalizationForm.FormD);
        var sb = new System.Text.StringBuilder(formD.Length);
        foreach (var ch in formD)
        {
            var category = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(ch);
            if (category != System.Globalization.UnicodeCategory.NonSpacingMark)
                sb.Append(ch);
        }

        return sb.ToString()
            .Normalize(System.Text.NormalizationForm.FormC)
            .Replace('đ', 'd')
            .Replace('Đ', 'D');
    }

    private static string? GetCell(IXLRangeRow row, Dictionary<StudentColumn, int> map, StudentColumn column)
    {
        if (!map.TryGetValue(column, out var colIndex))
            return null;

        var cell = row.Cell(colIndex);
        if (cell.DataType == XLDataType.Number)
            return cell.GetDouble().ToString("0");

        var text = cell.GetString();
        return string.IsNullOrWhiteSpace(text) ? null : text.Trim();
    }

    private static bool IsBlankRow(params string?[] values) =>
        values.All(string.IsNullOrWhiteSpace);

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static bool IsValidEmail(string email) =>
        Regex.IsMatch(email.Trim(), @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
}
