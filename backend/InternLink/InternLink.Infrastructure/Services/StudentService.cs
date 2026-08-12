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
using Microsoft.Extensions.Logging;

namespace InternLink.Infrastructure.Services;

public class StudentService : IStudentService
{
    public const string DefaultPassword = SeedData.DefaultPassword;

    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly PasswordHasher<User> _hasher;
    private readonly IEmailService _emailService;
    private readonly ILogger<StudentService> _logger;

    private static readonly string[] StudentCodeHeaders = ["mssv", "studentCode", "student number", "studentcode", "ma sv", "masv"];
    private static readonly string[] FullNameHeaders = ["hoten", "ho ten", "fullname", "full name", "student name", "ten sinh vien"];
    private static readonly string[] ClassHeaders = ["lop", "class"];
    private static readonly string[] MajorHeaders = ["nganh", "ngành", "chuyen nganh", "chuyên ngành", "major"];
    private static readonly string[] EmailHeaders = ["email", "e-mail"];
    private static readonly string[] PhoneHeaders = ["phone", "sdt", "sđt", "dien thoai", "điện thoại", "so dien thoai", "số điện thoại"];
    private static readonly string[] UsernameHeaders = ["username", "tendangnhap", "ten dang nhap"];

    public StudentService(
        AppDbContext db,
        IMapper mapper,
        PasswordHasher<User> hasher,
        IEmailService emailService,
        ILogger<StudentService> logger)
    {
        _db = db;
        _mapper = mapper;
        _hasher = hasher;
        _emailService = emailService;
        _logger = logger;
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

        Guid? userId = request.UserId;
        var createdNewUser = false;
        string? createdUsername = null;

        if (!string.IsNullOrWhiteSpace(request.Username))
        {
            createdUsername = request.Username.Trim();
            var ensure = await EnsureStudentUserAsync(createdUsername, request.FullName, request.Email);
            userId = ensure.UserId;
            createdNewUser = ensure.CreatedNew;
        }
        else if (userId.HasValue)
        {
            var userTaken = await _db.Students.AnyAsync(s => s.UserId == userId && !s.IsDeleted);
            if (userTaken)
                throw new InvalidOperationException("User is already linked to another student profile");
        }

        var student = new Student
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            StudentCode = request.StudentCode.Trim(),
            FullName = request.FullName.Trim(),
            Class = NullIfWhiteSpace(request.Class),
            Major = NullIfWhiteSpace(request.Major),
            Email = NullIfWhiteSpace(request.Email),
            Phone = NullIfWhiteSpace(request.Phone),
            CreatedAt = DateTime.UtcNow
        };

        await _db.Students.AddAsync(student);
        await _db.SaveChangesAsync();

        if (createdNewUser && createdUsername != null)
        {
            await TrySendInvitationAsync(
                student.Email,
                student.FullName,
                createdUsername,
                student.StudentCode,
                rowNumber: null);
        }

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

        student.FullName = request.FullName.Trim();
        student.Class = NullIfWhiteSpace(request.Class);
        student.Major = NullIfWhiteSpace(request.Major);
        student.Email = NullIfWhiteSpace(request.Email);
        student.Phone = NullIfWhiteSpace(request.Phone);
        student.UpdatedAt = DateTime.UtcNow;

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
        var emailErrors = new List<StudentImportErrorDto>();
        var created = new List<Student>();
        var pendingInvitations = new List<PendingInvitation>();
        var seenInFile = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var seenUsernames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var totalRows = 0;
        var skippedDuplicates = 0;
        var emailSentCount = 0;
        var emailFailedCount = 0;

        foreach (var row in usedRange.RowsUsed().Skip(1))
        {
            var rowNumber = row.RowNumber();
            var studentCode = GetCell(row, columnMap, StudentColumn.StudentCode);
            var fullName = GetCell(row, columnMap, StudentColumn.FullName);
            var className = GetCell(row, columnMap, StudentColumn.Class);
            var major = GetCell(row, columnMap, StudentColumn.Major);
            var email = GetCell(row, columnMap, StudentColumn.Email);
            var phone = GetCell(row, columnMap, StudentColumn.Phone);
            var username = GetCell(row, columnMap, StudentColumn.Username);

            if (IsBlankRow(studentCode, fullName, className, major, email, phone, username))
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

            studentCode = studentCode.Trim();
            fullName = fullName.Trim();

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

            if (string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(email) && email.Contains('@'))
                username = email.Split('@')[0];

            Guid? userId = null;
            if (!string.IsNullOrWhiteSpace(username))
            {
                username = username.Trim();
                if (!seenUsernames.Add(username))
                {
                    errors.Add(new StudentImportErrorDto
                    {
                        RowNumber = rowNumber,
                        StudentCode = studentCode,
                        Username = username,
                        Message = "Duplicate username in file"
                    });
                    continue;
                }

                try
                {
                    var ensure = await EnsureStudentUserAsync(username, fullName, email);
                    userId = ensure.UserId;
                    if (ensure.CreatedNew)
                    {
                        pendingInvitations.Add(new PendingInvitation(
                            rowNumber, studentCode, username, fullName, NullIfWhiteSpace(email)));
                    }
                }
                catch (InvalidOperationException ex)
                {
                    errors.Add(new StudentImportErrorDto
                    {
                        RowNumber = rowNumber,
                        StudentCode = studentCode,
                        Username = username,
                        Message = ex.Message
                    });
                    continue;
                }
            }

            created.Add(new Student
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                StudentCode = studentCode,
                FullName = fullName,
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

        foreach (var invite in pendingInvitations)
        {
            var send = await TrySendInvitationAsync(
                invite.Email,
                invite.FullName,
                invite.Username,
                invite.StudentCode,
                invite.RowNumber);

            if (send.Status == InvitationSendStatus.Sent)
                emailSentCount++;
            else
            {
                emailFailedCount++;
                emailErrors.Add(send.Error!);
            }
        }

        return new StudentImportResultDto
        {
            TotalRows = totalRows,
            SuccessCount = created.Count,
            FailedCount = errors.Count,
            SkippedDuplicateCount = skippedDuplicates,
            EmailSentCount = emailSentCount,
            EmailFailedCount = emailFailedCount,
            DefaultPassword = DefaultPassword,
            CreatedStudents = _mapper.Map<List<StudentDto>>(created),
            Errors = errors,
            EmailErrors = emailErrors
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
        sheet.Cell(1, 7).Value = "Username";

        sheet.Cell(2, 1).Value = "2421160052";
        sheet.Cell(2, 2).Value = "Nguyen Van A";
        sheet.Cell(2, 3).Value = "DH24TIN06";
        sheet.Cell(2, 4).Value = "Cong nghe thong tin";
        sheet.Cell(2, 5).Value = "vana@student.edu.vn";
        sheet.Cell(2, 6).Value = "0901234567";
        sheet.Cell(2, 7).Value = "2421160052";

        sheet.Cell(4, 1).Value = "Ghi chu:";
        sheet.Cell(4, 2).Value =
            $"Neu co Username thi tao tai khoan login (mat khau mac dinh: {DefaultPassword}). " +
            "Neu co Email thi he thong gui thu moi tham gia (link + username + mat khau).";

        sheet.Row(1).Style.Font.Bold = true;
        sheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    private async Task<(Guid UserId, bool CreatedNew)> EnsureStudentUserAsync(string username, string fullName, string? email)
    {
        var existing = await _db.Users.FirstOrDefaultAsync(u => u.Username == username && !u.IsDeleted);
        if (existing != null)
        {
            if (existing.Role != Role.Student)
                throw new InvalidOperationException($"Username '{username}' exists but is not a Student account");

            var linked = await _db.Students.AnyAsync(s => s.UserId == existing.Id && !s.IsDeleted);
            if (linked)
                throw new InvalidOperationException($"Username '{username}' is already linked to a student profile");

            return (existing.Id, CreatedNew: false);
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
            Role = Role.Student,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        user.PasswordHash = _hasher.HashPassword(user, DefaultPassword);
        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();
        return (user.Id, CreatedNew: true);
    }

    private async Task<InvitationSendOutcome> TrySendInvitationAsync(
        string? email,
        string fullName,
        string username,
        string? studentCode,
        int? rowNumber)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            _logger.LogWarning(
                "Skipped invitation email for student {StudentCode} (username={Username}): no email address",
                studentCode,
                username);

            return InvitationSendOutcome.Skipped(
                new StudentImportErrorDto
                {
                    RowNumber = rowNumber ?? 0,
                    StudentCode = studentCode,
                    Username = username,
                    Message = "Account created but invitation email skipped: no email address"
                });
        }

        try
        {
            var result = await _emailService.SendInvitationAsync(new InvitationEmailRequest
            {
                ToEmail = email.Trim(),
                FullName = fullName,
                Role = InvitationRole.Student,
                Username = username,
                TemporaryPassword = DefaultPassword
            });

            if (!result.Success)
            {
                _logger.LogWarning(
                    "Failed to send invitation email to student {StudentCode} (username={Username}): {Message}",
                    studentCode,
                    username,
                    result.Message);

                return InvitationSendOutcome.Failed(
                    new StudentImportErrorDto
                    {
                        RowNumber = rowNumber ?? 0,
                        StudentCode = studentCode,
                        Username = username,
                        Message = result.Message ?? "Failed to send invitation email"
                    });
            }

            _logger.LogInformation(
                "Invitation email sent for student {StudentCode} (username={Username}) to {Email}",
                studentCode,
                username,
                email);

            return InvitationSendOutcome.Sent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Exception while sending invitation email for student {StudentCode} (username={Username})",
                studentCode,
                username);

            return InvitationSendOutcome.Failed(
                new StudentImportErrorDto
                {
                    RowNumber = rowNumber ?? 0,
                    StudentCode = studentCode,
                    Username = username,
                    Message = $"Failed to send invitation email: {ex.Message}"
                });
        }
    }

    private enum StudentColumn
    {
        StudentCode,
        FullName,
        Class,
        Major,
        Email,
        Phone,
        Username
    }

    private enum InvitationSendStatus { Sent, Failed, SkippedNoEmail }

    private sealed record PendingInvitation(int RowNumber, string StudentCode, string Username, string FullName, string? Email);

    private sealed record InvitationSendOutcome(InvitationSendStatus Status, StudentImportErrorDto? Error)
    {
        public static InvitationSendOutcome Sent() => new(InvitationSendStatus.Sent, null);
        public static InvitationSendOutcome Failed(StudentImportErrorDto error) => new(InvitationSendStatus.Failed, error);
        public static InvitationSendOutcome Skipped(StudentImportErrorDto error) => new(InvitationSendStatus.SkippedNoEmail, error);
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
            else if (!map.ContainsKey(StudentColumn.Username) && UsernameHeaders.Contains(header))
                map[StudentColumn.Username] = cell.Address.ColumnNumber;
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
        var formD = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(formD.Length);
        foreach (var ch in formD)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(ch);
            if (category != UnicodeCategory.NonSpacingMark)
                sb.Append(ch);
        }

        return sb.ToString()
            .Normalize(NormalizationForm.FormC)
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
