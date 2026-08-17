using AutoMapper;
using FluentAssertions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Application.Mappings;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using InternLink.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Xunit;

namespace InternLink.Tests.Services;

public class StudentServiceTests
{
    private readonly IMapper _mapper;

    public StudentServiceTests()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<StudentProfile>();
        });
        _mapper = config.CreateMapper();
    }

    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private StudentService CreateService(AppDbContext db, IEmailService? email = null)
    {
        return new StudentService(
            db,
            _mapper,
            new PasswordHasher<User>(),
            email ?? Mock.Of<IEmailService>(),
            NullLogger<StudentService>.Instance);
    }

    [Fact]
    public async Task CreateStudentAsync_WithValidData_ShouldCreateStudent()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);
        var request = new CreateStudentRequest
        {
            StudentCode = "SV001",
            FullName = "Nguyen Van A",
            Class = "K65",
            Major = "Computer Science",
            Email = "nguyenvana@example.com",
            Phone = "0123456789"
        };

        var result = await service.CreateStudentAsync(request);

        result.Should().NotBeNull();
        result.StudentCode.Should().Be("SV001");
        result.FullName.Should().Be("Nguyen Van A");
        result.Email.Should().Be("nguyenvana@example.com");
        result.Id.Should().NotBeEmpty();
    }

    [Fact]
    public async Task CreateStudentAsync_WithUsernameAndEmail_ShouldCreateUserAndSendInvitation()
    {
        var db = GetInMemoryDbContext();
        var email = new Mock<IEmailService>();
        email.Setup(e => e.SendInvitationAsync(It.IsAny<InvitationEmailRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(SendEmailResult.Ok("sv@example.com"));

        var service = CreateService(db, email.Object);
        var result = await service.CreateStudentAsync(new CreateStudentRequest
        {
            StudentCode = "SV100",
            FullName = "Student Account",
            Email = "sv@example.com",
            Username = "sv100"
        });

        result.UserId.Should().NotBeNull();
        (await db.Users.CountAsync(u => u.Username == "sv100" && u.Role == Role.Student)).Should().Be(1);
        var user = await db.Users.FirstAsync(u => u.Username == "sv100");
        user.MustChangePassword.Should().BeTrue();
        email.Verify(e => e.SendInvitationAsync(
            It.Is<InvitationEmailRequest>(r =>
                r.ToEmail == "sv@example.com" &&
                r.Username == "sv100" &&
                r.Role == InvitationRole.Student &&
                r.TemporaryPassword.Length == 8),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateStudentAsync_WithDuplicateStudentCode_ShouldThrowException()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);

        var request1 = new CreateStudentRequest
        {
            StudentCode = "SV001",
            FullName = "Student One"
        };

        var request2 = new CreateStudentRequest
        {
            StudentCode = "SV001",
            FullName = "Student Two"
        };

        await service.CreateStudentAsync(request1);
        var act = async () => await service.CreateStudentAsync(request2);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*already exists*");
    }

    [Fact]
    public async Task GetStudentByIdAsync_WithValidId_ShouldReturnStudent()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);
        var student = new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "SV001",
            FullName = "Test Student",
            CreatedAt = DateTime.UtcNow
        };
        db.Students.Add(student);
        await db.SaveChangesAsync();

        var result = await service.GetStudentByIdAsync(student.Id);

        result.Should().NotBeNull();
        result!.Id.Should().Be(student.Id);
        result.StudentCode.Should().Be("SV001");
    }

    [Fact]
    public async Task GetStudentByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);

        var result = await service.GetStudentByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task GetStudentByCodeAsync_WithValidNumber_ShouldReturnStudent()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);
        var student = new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "SV001",
            FullName = "Test Student",
            CreatedAt = DateTime.UtcNow
        };
        db.Students.Add(student);
        await db.SaveChangesAsync();

        var result = await service.GetStudentByCodeAsync("SV001");

        result.Should().NotBeNull();
        result!.StudentCode.Should().Be("SV001");
    }

    [Fact]
    public async Task UpdateStudentAsync_WithValidData_ShouldUpdateStudent()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);
        var student = new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "SV001",
            FullName = "Original Name",
            Email = "old@example.com",
            CreatedAt = DateTime.UtcNow
        };
        db.Students.Add(student);
        await db.SaveChangesAsync();

        var updateRequest = new UpdateStudentRequest
        {
            FullName = "Updated Name",
            Email = "new@example.com"
        };

        var result = await service.UpdateStudentAsync(student.Id, updateRequest);

        result.Should().NotBeNull();
        result!.FullName.Should().Be("Updated Name");
        result.Email.Should().Be("new@example.com");
    }

    [Fact]
    public async Task DeleteStudentAsync_WithValidId_ShouldDeleteStudent()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);
        var student = new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "SV001",
            FullName = "Test Student",
            CreatedAt = DateTime.UtcNow
        };
        db.Students.Add(student);
        await db.SaveChangesAsync();

        var result = await service.DeleteStudentAsync(student.Id);

        result.Should().BeTrue();
        var deletedStudent = await db.Students.FindAsync(student.Id);
        deletedStudent.Should().NotBeNull();
        deletedStudent!.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public async Task DeleteStudentAsync_WithNonExistentId_ShouldReturnFalse()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);

        var result = await service.DeleteStudentAsync(Guid.NewGuid());

        result.Should().BeFalse();
    }

    [Fact]
    public async Task StudentCodeExistsAsync_WithExistingNumber_ShouldReturnTrue()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);
        var student = new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "SV001",
            FullName = "Test Student",
            CreatedAt = DateTime.UtcNow
        };
        db.Students.Add(student);
        await db.SaveChangesAsync();

        var result = await service.StudentCodeExistsAsync("SV001");

        result.Should().BeTrue();
    }

    [Fact]
    public async Task StudentCodeExistsAsync_WithNonExistentNumber_ShouldReturnFalse()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);

        var result = await service.StudentCodeExistsAsync("SV999");

        result.Should().BeFalse();
    }

    [Fact]
    public async Task GetAllStudentsAsync_ShouldReturnPaginatedResults()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);

        for (int i = 1; i <= 5; i++)
        {
            db.Students.Add(new Student
            {
                Id = Guid.NewGuid(),
                StudentCode = $"SV{i:D3}",
                FullName = $"Student {i}",
                CreatedAt = DateTime.UtcNow
            });
        }
        await db.SaveChangesAsync();

        var result = await service.GetAllStudentsAsync(skip: 0, take: 3);

        result.Should().HaveCount(3);
    }

    [Fact]
    public async Task GetStudentsWithFilterAsync_ShouldFilterBySearchTerm()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);

        db.Students.AddRange(new[]
        {
            new Student { Id = Guid.NewGuid(), StudentCode = "SV001", FullName = "Nguyen Van A", CreatedAt = DateTime.UtcNow },
            new Student { Id = Guid.NewGuid(), StudentCode = "SV002", FullName = "Tran Van B", CreatedAt = DateTime.UtcNow },
            new Student { Id = Guid.NewGuid(), StudentCode = "SV003", FullName = "Le Van C", CreatedAt = DateTime.UtcNow }
        });
        await db.SaveChangesAsync();

        var filter = new StudentFilterRequest
        {
            SearchTerm = "Nguyen"
        };

        var result = await service.GetStudentsWithFilterAsync(filter);

        result.Items.Should().HaveCount(1);
        result.Items.First().FullName.Should().Contain("Nguyen");
    }

    [Fact]
    public async Task GetStudentsWithFilterAsync_ShouldFilterByMajor()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);

        db.Students.AddRange(new[]
        {
            new Student { Id = Guid.NewGuid(), StudentCode = "SV001", FullName = "Student 1", Major = "CS", CreatedAt = DateTime.UtcNow },
            new Student { Id = Guid.NewGuid(), StudentCode = "SV002", FullName = "Student 2", Major = "IT", CreatedAt = DateTime.UtcNow },
            new Student { Id = Guid.NewGuid(), StudentCode = "SV003", FullName = "Student 3", Major = "CS", CreatedAt = DateTime.UtcNow }
        });
        await db.SaveChangesAsync();

        var filter = new StudentFilterRequest
        {
            Major = "CS"
        };

        var result = await service.GetStudentsWithFilterAsync(filter);

        result.Items.Should().HaveCount(2);
        result.Total.Should().Be(2);
    }

    [Fact]
    public async Task ImportStudentsFromExcelAsync_WithValidRows_ShouldCreateStudents()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);

        using var stream = CreateStudentExcel(
            ("2421160052", "Nguyen Van A", "DH24TIN06", "CNTT", "a@test.com", "0901111111", null),
            ("2421160053", "Tran Van B", "DH24TIN06", "CNTT", "b@test.com", "0902222222", null));

        var result = await service.ImportStudentsFromExcelAsync(stream);

        result.SuccessCount.Should().Be(2);
        result.FailedCount.Should().Be(0);
        result.CreatedStudents.Should().Contain(s => s.StudentCode == "2421160052");
        (await db.Students.CountAsync(s => !s.IsDeleted)).Should().Be(2);
    }

    [Fact]
    public async Task ImportStudentsFromExcelAsync_WithUsernameAndEmail_ShouldCreateUserAndSendEmail()
    {
        var db = GetInMemoryDbContext();
        var email = new Mock<IEmailService>();
        email.Setup(e => e.SendInvitationAsync(It.IsAny<InvitationEmailRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((InvitationEmailRequest r, CancellationToken _) => SendEmailResult.Ok(r.ToEmail));

        var service = CreateService(db, email.Object);

        using var stream = CreateStudentExcel(
            ("2421160099", "Import User", "DH24TIN06", "CNTT", "import@test.com", "0903333333", "sv.import99"));

        var result = await service.ImportStudentsFromExcelAsync(stream);

        result.SuccessCount.Should().Be(1);
        result.EmailSentCount.Should().Be(1);
        result.EmailFailedCount.Should().Be(0);
        result.DefaultPassword.Should().Be(StudentService.TemporaryPasswordPolicyDescription);
        (await db.Users.CountAsync(u => u.Username == "sv.import99" && u.Role == Role.Student)).Should().Be(1);
        var user = await db.Users.FirstAsync(u => u.Username == "sv.import99");
        user.MustChangePassword.Should().BeTrue();
        email.Verify(e => e.SendInvitationAsync(
            It.Is<InvitationEmailRequest>(r => r.TemporaryPassword.Length == 8),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ImportStudentsFromExcelAsync_WithUsernameButNoEmail_ShouldWarnAndSkipEmail()
    {
        var db = GetInMemoryDbContext();
        var email = new Mock<IEmailService>();
        var service = CreateService(db, email.Object);

        using var stream = CreateStudentExcel(
            ("2421160088", "No Mail Student", "DH24TIN06", "CNTT", null, null, "sv.nomail"));

        var result = await service.ImportStudentsFromExcelAsync(stream);

        result.SuccessCount.Should().Be(1);
        result.EmailSentCount.Should().Be(0);
        result.EmailFailedCount.Should().Be(1);
        result.EmailErrors.Should().ContainSingle(e => e.Message.Contains("no email", StringComparison.OrdinalIgnoreCase));
        email.Verify(e => e.SendInvitationAsync(It.IsAny<InvitationEmailRequest>(), It.IsAny<CancellationToken>()), Times.Never);
        var user = await db.Users.FirstAsync(u => u.Username == "sv.nomail");
        user.MustChangePassword.Should().BeTrue();
        (await db.Users.CountAsync(u => u.Username == "sv.nomail")).Should().Be(1);
    }

    [Fact]
    public async Task ImportStudentsFromExcelAsync_WithEmailOnly_ShouldDefaultUsernameToMssv()
    {
        var db = GetInMemoryDbContext();
        var email = new Mock<IEmailService>();
        email.Setup(e => e.SendInvitationAsync(It.IsAny<InvitationEmailRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((InvitationEmailRequest r, CancellationToken _) => SendEmailResult.Ok(r.ToEmail));

        var service = CreateService(db, email.Object);

        using var stream = CreateStudentExcel(
            ("2421160077", "Email Only", "DH24TIN06", "CNTT", "only@test.com", "0904444444", null));

        var result = await service.ImportStudentsFromExcelAsync(stream);

        result.SuccessCount.Should().Be(1);
        result.EmailSentCount.Should().Be(1);
        (await db.Users.CountAsync(u => u.Username == "2421160077" && u.Role == Role.Student)).Should().Be(1);
        email.Verify(e => e.SendInvitationAsync(
            It.Is<InvitationEmailRequest>(r => r.Username == "2421160077"),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ImportStudentsFromExcelAsync_WithDuplicateMssvInFile_ShouldReportError()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);

        using var stream = CreateStudentExcel(
            ("2421160052", "Nguyen Van A", "DH24TIN06", "CNTT", null, null, null),
            ("2421160052", "Nguyen Van A 2", "DH24TIN06", "CNTT", null, null, null));

        var result = await service.ImportStudentsFromExcelAsync(stream);

        result.SuccessCount.Should().Be(1);
        result.Errors.Should().Contain(e => e.StudentCode == "2421160052" && e.Message.Contains("Duplicate MSSV in file"));
    }

    [Fact]
    public async Task ImportStudentsFromExcelAsync_WithExistingStudent_ShouldUpdateAndEnrollInNewSemester()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);

        var oldSemester = new Semester { Id = Guid.NewGuid(), Name = "Old Semester", Term = "Học kỳ I", AcademicYear = "2025 - 2026", Status = SemesterStatus.Completed, CreatedAt = DateTime.UtcNow.AddMonths(-6) };
        var newSemester = new Semester { Id = Guid.NewGuid(), Name = "New Semester", Term = "Học kỳ II", AcademicYear = "2025 - 2026", Status = SemesterStatus.Active, CreatedAt = DateTime.UtcNow };

        var existingStudent = new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "2421160052",
            FullName = "Nguyen Van A (Old)",
            Class = "DH23TIN01",
            CreatedAt = DateTime.UtcNow.AddMonths(-6)
        };

        var oldInternship = new Internship
        {
            Id = Guid.NewGuid(),
            StudentId = existingStudent.Id,
            SemesterId = oldSemester.Id,
            Status = InternshipStatus.Completed,
            CreatedAt = DateTime.UtcNow.AddMonths(-6)
        };

        db.Semesters.AddRange(oldSemester, newSemester);
        db.Students.Add(existingStudent);
        db.Internships.Add(oldInternship);
        await db.SaveChangesAsync();

        using var stream = CreateStudentExcel(
            ("2421160052", "Nguyen Van A", "DH24TIN06", "CNTT", "vana@student.edu.vn", "0901234567", null));

        var result = await service.ImportStudentsFromExcelAsync(stream, newSemester.Id);

        result.SuccessCount.Should().Be(1);
        result.Errors.Should().BeEmpty();

        var updatedStudent = await db.Students.FindAsync(existingStudent.Id);
        updatedStudent!.FullName.Should().Be("Nguyen Van A");
        updatedStudent.Class.Should().Be("DH24TIN06");

        var studentInternships = await db.Internships.Where(i => i.StudentId == existingStudent.Id).ToListAsync();
        studentInternships.Should().HaveCount(2);
        studentInternships.Should().Contain(i => i.SemesterId == oldSemester.Id && i.Status == InternshipStatus.Completed);
        studentInternships.Should().Contain(i => i.SemesterId == newSemester.Id && i.Status == InternshipStatus.NotStarted);
    }

    [Fact]
    public void GetStudentImportTemplate_ShouldReturnXlsxBytes()
    {
        var db = GetInMemoryDbContext();
        var service = CreateService(db);

        var bytes = service.GetStudentImportTemplate();

        bytes.Should().NotBeEmpty();
        bytes[0].Should().Be(0x50);
        bytes[1].Should().Be(0x4B);
    }

    private static MemoryStream CreateStudentExcel(
        params (string Mssv, string Name, string? Class, string? Major, string? Email, string? Phone, string? Username)[] rows)
    {
        using var workbook = new ClosedXML.Excel.XLWorkbook();
        var sheet = workbook.Worksheets.Add("Students");
        sheet.Cell(1, 1).Value = "MSSV";
        sheet.Cell(1, 2).Value = "HoTen";
        sheet.Cell(1, 3).Value = "Lop";
        sheet.Cell(1, 4).Value = "Nganh";
        sheet.Cell(1, 5).Value = "Email";
        sheet.Cell(1, 6).Value = "SDT";
        sheet.Cell(1, 7).Value = "Username";

        for (var i = 0; i < rows.Length; i++)
        {
            var row = rows[i];
            var excelRow = i + 2;
            sheet.Cell(excelRow, 1).Value = row.Mssv;
            sheet.Cell(excelRow, 2).Value = row.Name;
            if (row.Class != null) sheet.Cell(excelRow, 3).Value = row.Class;
            if (row.Major != null) sheet.Cell(excelRow, 4).Value = row.Major;
            if (row.Email != null) sheet.Cell(excelRow, 5).Value = row.Email;
            if (row.Phone != null) sheet.Cell(excelRow, 6).Value = row.Phone;
            if (row.Username != null) sheet.Cell(excelRow, 7).Value = row.Username;
        }

        var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;
        return stream;
    }
}
