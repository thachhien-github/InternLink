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
using AutoMapper;
using Moq;

namespace InternLink.Tests.Services;

public class LecturerProfileServiceTests
{
    private readonly IMapper _mapper;

    public LecturerProfileServiceTests()
    {
        _mapper = new MapperConfiguration(cfg => cfg.AddProfile<LecturerProfile>()).CreateMapper();
    }

    private static AppDbContext GetDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private LecturerProfileService CreateService(AppDbContext db, IEmailService? email = null)
    {
        return new LecturerProfileService(
            db,
            _mapper,
            new PasswordHasher<User>(),
            email ?? Mock.Of<IEmailService>(),
            NullLogger<LecturerProfileService>.Instance);
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateLecturerProfile()
    {
        var db = GetDb();
        var service = CreateService(db);

        var result = await service.CreateAsync(new CreateLecturerRequest
        {
            StaffCode = "GV001",
            FullName = "Nguyen Van A",
            Email = "a@uni.edu.vn",
            Department = "CNTT"
        });

        result.StaffCode.Should().Be("GV001");
        (await db.Lecturers.CountAsync()).Should().Be(1);
    }

    [Fact]
    public async Task CreateAsync_WithUsernameAndEmail_ShouldSendInvitation()
    {
        var db = GetDb();
        var email = new Mock<IEmailService>();
        email.Setup(e => e.SendInvitationAsync(It.IsAny<InvitationEmailRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(SendEmailResult.Ok("c@uni.edu.vn"));

        var service = CreateService(db, email.Object);
        await service.CreateAsync(new CreateLecturerRequest
        {
            StaffCode = "GV010",
            FullName = "Le Van C",
            Email = "c@uni.edu.vn",
            Username = "gv.levanc"
        });

        email.Verify(e => e.SendInvitationAsync(
            It.Is<InvitationEmailRequest>(r =>
                r.ToEmail == "c@uni.edu.vn" &&
                r.Username == "gv.levanc" &&
                r.Role == InvitationRole.Lecturer &&
                r.TemporaryPassword == SeedData.DefaultPassword),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_WithUsernameButNoEmail_ShouldNotSendInvitation()
    {
        var db = GetDb();
        var email = new Mock<IEmailService>();
        var service = CreateService(db, email.Object);

        await service.CreateAsync(new CreateLecturerRequest
        {
            StaffCode = "GV011",
            FullName = "No Email",
            Username = "gv.noemail"
        });

        email.Verify(e => e.SendInvitationAsync(It.IsAny<InvitationEmailRequest>(), It.IsAny<CancellationToken>()), Times.Never);
        (await db.Users.CountAsync(u => u.Username == "gv.noemail")).Should().Be(1);
    }

    [Fact]
    public async Task ImportFromExcelAsync_WithUsername_ShouldCreateLecturerAndUser()
    {
        var db = GetDb();
        var email = new Mock<IEmailService>();
        email.Setup(e => e.SendInvitationAsync(It.IsAny<InvitationEmailRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((InvitationEmailRequest r, CancellationToken _) => SendEmailResult.Ok(r.ToEmail));

        var service = CreateService(db, email.Object);

        using var stream = CreateExcel(("GV002", "Tran Van B", "b@uni.edu.vn", "0901", "CNTT", "gv.tranvanb"));
        var result = await service.ImportFromExcelAsync(stream);

        result.SuccessCount.Should().Be(1);
        result.EmailSentCount.Should().Be(1);
        result.EmailFailedCount.Should().Be(0);
        result.DefaultPassword.Should().Be(SeedData.DefaultPassword);
        var lecturer = await db.Lecturers.FirstAsync();
        lecturer.UserId.Should().NotBeNull();
        (await db.Users.CountAsync(u => u.Role == Role.Lecturer)).Should().Be(1);
        email.Verify(e => e.SendInvitationAsync(It.IsAny<InvitationEmailRequest>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ImportFromExcelAsync_WithUsernameButNoEmail_ShouldWarnAndSkipEmail()
    {
        var db = GetDb();
        var email = new Mock<IEmailService>();
        var service = CreateService(db, email.Object);

        using var stream = CreateExcel(("GV020", "No Mail Lecturer", "", "0901", "CNTT", "gv.nomail"));
        var result = await service.ImportFromExcelAsync(stream);

        result.SuccessCount.Should().Be(1);
        result.EmailSentCount.Should().Be(0);
        result.EmailFailedCount.Should().Be(1);
        result.EmailErrors.Should().ContainSingle(e => e.Message.Contains("no email", StringComparison.OrdinalIgnoreCase));
        email.Verify(e => e.SendInvitationAsync(It.IsAny<InvitationEmailRequest>(), It.IsAny<CancellationToken>()), Times.Never);
        (await db.Users.CountAsync(u => u.Username == "gv.nomail")).Should().Be(1);
    }

    [Fact]
    public async Task GetOverviewAsync_ShouldReturnAssignedInternships()
    {
        var db = GetDb();
        var lecturer = new Lecturer
        {
            Id = Guid.NewGuid(),
            StaffCode = "GV003",
            FullName = "Lecturer C",
            CreatedAt = DateTime.UtcNow
        };
        var student = new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "2421160052",
            FullName = "Student A",
            CreatedAt = DateTime.UtcNow
        };
        var company = new Company
        {
            Id = Guid.NewGuid(),
            CompanyName = "FPT",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        db.Lecturers.Add(lecturer);
        db.Students.Add(student);
        db.Companies.Add(company);
        db.Internships.Add(new Internship
        {
            Id = Guid.NewGuid(),
            StudentId = student.Id,
            CompanyId = company.Id,
            LecturerId = lecturer.Id,
            Status = InternshipStatus.InProgress,
            CreatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        var service = CreateService(db);
        var overview = await service.GetOverviewAsync(lecturer.Id);

        overview.Should().NotBeNull();
        overview!.TotalInternships.Should().Be(1);
        overview.Internships.First().StudentCode.Should().Be("2421160052");
        overview.StatusCounts["InProgress"].Should().Be(1);
    }

    [Fact]
    public async Task DeleteAsync_WithInternships_ShouldThrow()
    {
        var db = GetDb();
        var lecturer = new Lecturer
        {
            Id = Guid.NewGuid(),
            StaffCode = "GV004",
            FullName = "Lecturer D",
            CreatedAt = DateTime.UtcNow
        };
        var student = new Student
        {
            Id = Guid.NewGuid(),
            StudentCode = "2421160099",
            FullName = "Student B",
            CreatedAt = DateTime.UtcNow
        };
        var company = new Company
        {
            Id = Guid.NewGuid(),
            CompanyName = "Viettel",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        db.AddRange(lecturer, student, company);
        db.Internships.Add(new Internship
        {
            Id = Guid.NewGuid(),
            StudentId = student.Id,
            CompanyId = company.Id,
            LecturerId = lecturer.Id,
            CreatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        var service = CreateService(db);
        var act = async () => await service.DeleteAsync(lecturer.Id);
        await act.Should().ThrowAsync<InvalidOperationException>();
    }

    private static MemoryStream CreateExcel(params (string Code, string Name, string Email, string Phone, string Dept, string Username)[] rows)
    {
        using var workbook = new ClosedXML.Excel.XLWorkbook();
        var sheet = workbook.Worksheets.Add("Lecturers");
        sheet.Cell(1, 1).Value = "MaGV";
        sheet.Cell(1, 2).Value = "HoTen";
        sheet.Cell(1, 3).Value = "Email";
        sheet.Cell(1, 4).Value = "SDT";
        sheet.Cell(1, 5).Value = "BoMon";
        sheet.Cell(1, 6).Value = "Username";

        for (var i = 0; i < rows.Length; i++)
        {
            var r = rows[i];
            var row = i + 2;
            sheet.Cell(row, 1).Value = r.Code;
            sheet.Cell(row, 2).Value = r.Name;
            sheet.Cell(row, 3).Value = r.Email;
            sheet.Cell(row, 4).Value = r.Phone;
            sheet.Cell(row, 5).Value = r.Dept;
            sheet.Cell(row, 6).Value = r.Username;
        }

        var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;
        return stream;
    }
}
