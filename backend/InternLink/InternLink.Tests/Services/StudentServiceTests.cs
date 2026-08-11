using AutoMapper;
using FluentAssertions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Application.Mappings;
using InternLink.Domain.Entities;
using InternLink.Infrastructure.Persistence;
using InternLink.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
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

    [Fact]
    public async Task CreateStudentAsync_WithValidData_ShouldCreateStudent()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);
        var request = new CreateStudentRequest
        {
            StudentCode = "SV001",
            FullName = "Nguyen Van A",
            Class = "K65",
            Major = "Computer Science",
            Email = "nguyenvana@example.com",
            Phone = "0123456789"
        };

        // Act
        var result = await service.CreateStudentAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.StudentCode.Should().Be("SV001");
        result.FullName.Should().Be("Nguyen Van A");
        result.Email.Should().Be("nguyenvana@example.com");
        result.Id.Should().NotBeEmpty();
    }

    [Fact]
    public async Task CreateStudentAsync_WithDuplicateStudentCode_ShouldThrowException()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);

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

        // Act
        await service.CreateStudentAsync(request1);
        var act = async () => await service.CreateStudentAsync(request2);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*already exists*");
    }

    [Fact]
    public async Task GetStudentByIdAsync_WithValidId_ShouldReturnStudent()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);
        var student = new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "SV001",
            FullName = "Test Student",
            CreatedAt = DateTime.UtcNow
        };
        db.Students.Add(student);
        await db.SaveChangesAsync();

        // Act
        var result = await service.GetStudentByIdAsync(student.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(student.Id);
        result.StudentCode.Should().Be("SV001");
    }

    [Fact]
    public async Task GetStudentByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);

        // Act
        var result = await service.GetStudentByIdAsync(Guid.NewGuid());

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetStudentByCodeAsync_WithValidNumber_ShouldReturnStudent()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);
        var student = new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "SV001",
            FullName = "Test Student",
            CreatedAt = DateTime.UtcNow
        };
        db.Students.Add(student);
        await db.SaveChangesAsync();

        // Act
        var result = await service.GetStudentByCodeAsync("SV001");

        // Assert
        result.Should().NotBeNull();
        result!.StudentCode.Should().Be("SV001");
    }

    [Fact]
    public async Task UpdateStudentAsync_WithValidData_ShouldUpdateStudent()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);
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

        // Act
        var result = await service.UpdateStudentAsync(student.Id, updateRequest);

        // Assert
        result.Should().NotBeNull();
        result!.FullName.Should().Be("Updated Name");
        result.Email.Should().Be("new@example.com");
    }

    [Fact]
    public async Task DeleteStudentAsync_WithValidId_ShouldDeleteStudent()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);
        var student = new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "SV001",
            FullName = "Test Student",
            CreatedAt = DateTime.UtcNow
        };
        db.Students.Add(student);
        await db.SaveChangesAsync();

        // Act
        var result = await service.DeleteStudentAsync(student.Id);

        // Assert
        result.Should().BeTrue();
        var deletedStudent = await db.Students.FindAsync(student.Id);
        deletedStudent.Should().NotBeNull();
        deletedStudent!.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public async Task DeleteStudentAsync_WithNonExistentId_ShouldReturnFalse()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);

        // Act
        var result = await service.DeleteStudentAsync(Guid.NewGuid());

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task StudentCodeExistsAsync_WithExistingNumber_ShouldReturnTrue()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);
        var student = new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "SV001",
            FullName = "Test Student",
            CreatedAt = DateTime.UtcNow
        };
        db.Students.Add(student);
        await db.SaveChangesAsync();

        // Act
        var result = await service.StudentCodeExistsAsync("SV001");

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task StudentCodeExistsAsync_WithNonExistentNumber_ShouldReturnFalse()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);

        // Act
        var result = await service.StudentCodeExistsAsync("SV999");

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task GetAllStudentsAsync_ShouldReturnPaginatedResults()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);

        // Add multiple students
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

        // Act
        var result = await service.GetAllStudentsAsync(skip: 0, take: 3);

        // Assert
        result.Should().HaveCount(3);
    }

    [Fact]
    public async Task GetStudentsWithFilterAsync_ShouldFilterBySearchTerm()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);

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

        // Act
        var result = await service.GetStudentsWithFilterAsync(filter);

        // Assert
        result.Items.Should().HaveCount(1);
        result.Items.First().FullName.Should().Contain("Nguyen");
    }

    [Fact]
    public async Task GetStudentsWithFilterAsync_ShouldFilterByMajor()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);

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

        // Act
        var result = await service.GetStudentsWithFilterAsync(filter);

        // Assert
        result.Items.Should().HaveCount(2);
        result.Total.Should().Be(2);
    }

    [Fact]
    public async Task ImportStudentsFromExcelAsync_WithValidRows_ShouldCreateStudents()
    {
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);

        using var stream = CreateStudentExcel(
            ("2421160052", "Nguyen Van A", "DH24TIN06", "CNTT", "a@test.com", "0901111111"),
            ("2421160053", "Tran Van B", "DH24TIN06", "CNTT", "b@test.com", "0902222222"));

        var result = await service.ImportStudentsFromExcelAsync(stream);

        result.SuccessCount.Should().Be(2);
        result.FailedCount.Should().Be(0);
        result.CreatedStudents.Should().Contain(s => s.StudentCode == "2421160052");
        (await db.Students.CountAsync(s => !s.IsDeleted)).Should().Be(2);
    }

    [Fact]
    public async Task ImportStudentsFromExcelAsync_WithDuplicateMssv_ShouldReportError()
    {
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);
        db.Students.Add(new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "2421160052",
            FullName = "Existing",
            CreatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        using var stream = CreateStudentExcel(
            ("2421160052", "Nguyen Van A", "DH24TIN06", "CNTT", null, null));

        var result = await service.ImportStudentsFromExcelAsync(stream);

        result.SuccessCount.Should().Be(0);
        result.SkippedDuplicateCount.Should().Be(1);
        result.Errors.Should().Contain(e => e.StudentCode == "2421160052");
    }

    [Fact]
    public void GetStudentImportTemplate_ShouldReturnXlsxBytes()
    {
        var db = GetInMemoryDbContext();
        var service = new StudentService(db, _mapper);

        var bytes = service.GetStudentImportTemplate();

        bytes.Should().NotBeEmpty();
        // XLSX files start with PK zip signature
        bytes[0].Should().Be(0x50);
        bytes[1].Should().Be(0x4B);
    }

    private static MemoryStream CreateStudentExcel(params (string Mssv, string Name, string? Class, string? Major, string? Email, string? Phone)[] rows)
    {
        using var workbook = new ClosedXML.Excel.XLWorkbook();
        var sheet = workbook.Worksheets.Add("Students");
        sheet.Cell(1, 1).Value = "MSSV";
        sheet.Cell(1, 2).Value = "HoTen";
        sheet.Cell(1, 3).Value = "Lop";
        sheet.Cell(1, 4).Value = "Nganh";
        sheet.Cell(1, 5).Value = "Email";
        sheet.Cell(1, 6).Value = "SDT";

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
        }

        var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;
        return stream;
    }
}
