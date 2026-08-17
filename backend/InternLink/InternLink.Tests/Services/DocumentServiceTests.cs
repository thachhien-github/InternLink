using AutoMapper;
using FluentAssertions;
using InternLink.Application.DTOs;
using InternLink.Application.Mappings;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using InternLink.Infrastructure.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace InternLink.Tests.Services;

public class DocumentServiceTests
{
    private readonly IMapper _mapper;

    public DocumentServiceTests()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<DocumentProfile>();
            cfg.AddProfile<LecturerProfile>();
        });
        _mapper = config.CreateMapper();
    }

    private static AppDbContext GetDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private DocumentService CreateService(AppDbContext db)
    {
        var envMock = new Mock<IWebHostEnvironment>();
        envMock.Setup(e => e.ContentRootPath).Returns(AppDomain.CurrentDomain.BaseDirectory);

        return new DocumentService(db, _mapper, envMock.Object);
    }

    private static async Task<(User StudentUser, User LecturerUser, User StrangerUser, User AdminUser, Internship Internship, Document DocWithInternship)> SeedDataAsync(AppDbContext db)
    {
        var studentUser = new User { Id = Guid.NewGuid(), Username = "student", PasswordHash = "hash", Email = "student@test.com", Role = Role.Student, FullName = "Student 1", CreatedAt = DateTime.UtcNow };
        var lecturerUser = new User { Id = Guid.NewGuid(), Username = "lecturer", PasswordHash = "hash", Email = "lecturer@test.com", Role = Role.Lecturer, FullName = "Lecturer 1", CreatedAt = DateTime.UtcNow };
        var strangerUser = new User { Id = Guid.NewGuid(), Username = "stranger", PasswordHash = "hash", Email = "stranger@test.com", Role = Role.Student, FullName = "Stranger", CreatedAt = DateTime.UtcNow };
        var adminUser = new User { Id = Guid.NewGuid(), Username = "admin", PasswordHash = "hash", Email = "admin@test.com", Role = Role.SuperAdmin, FullName = "Admin", CreatedAt = DateTime.UtcNow };

        var student = new Student { Id = Guid.NewGuid(), UserId = studentUser.Id, StudentCode = "SV001", FullName = "Student 1", CreatedAt = DateTime.UtcNow };
        var lecturer = new Lecturer { Id = Guid.NewGuid(), UserId = lecturerUser.Id, StaffCode = "GV001", FullName = "Lecturer 1", CreatedAt = DateTime.UtcNow };

        var internship = new Internship
        {
            Id = Guid.NewGuid(),
            StudentId = student.Id,
            Student = student,
            LecturerId = lecturer.Id,
            Lecturer = lecturer,
            Status = InternshipStatus.InProgress,
            CreatedAt = DateTime.UtcNow
        };

        var docWithInternship = new Document
        {
            Id = Guid.NewGuid(),
            InternshipId = internship.Id,
            Internship = internship,
            Title = "Internship Spec",
            FileName = "spec.pdf",
            FilePath = "uploads/documents/spec.pdf",
            MimeType = "application/pdf",
            UploadedById = lecturer.Id,
            UploadedBy = lecturer,
            CreatedAt = DateTime.UtcNow
        };

        await db.Users.AddRangeAsync(studentUser, lecturerUser, strangerUser, adminUser);
        await db.Students.AddAsync(student);
        await db.Lecturers.AddAsync(lecturer);
        await db.Internships.AddAsync(internship);
        await db.Documents.AddAsync(docWithInternship);
        await db.SaveChangesAsync();

        return (studentUser, lecturerUser, strangerUser, adminUser, internship, docWithInternship);
    }

    [Fact]
    public async Task GetDocumentByIdAsync_InternshipDoc_StudentOwner_ShouldReturnDocument()
    {
        var db = GetDb();
        var (studentUser, _, _, _, _, docWithInternship) = await SeedDataAsync(db);
        var service = CreateService(db);

        var result = await service.GetDocumentByIdAsync(docWithInternship.Id, studentUser.Id, isLecturerOrAdmin: false);

        result.Should().NotBeNull();
        result!.Id.Should().Be(docWithInternship.Id);
        result.Title.Should().Be("Internship Spec");
    }

    [Fact]
    public async Task GetDocumentByIdAsync_InternshipDoc_AssignedLecturer_ShouldReturnDocument()
    {
        var db = GetDb();
        var (_, lecturerUser, _, _, _, docWithInternship) = await SeedDataAsync(db);
        var service = CreateService(db);

        var result = await service.GetDocumentByIdAsync(docWithInternship.Id, lecturerUser.Id, isLecturerOrAdmin: true);

        result.Should().NotBeNull();
        result!.Id.Should().Be(docWithInternship.Id);
    }

    [Fact]
    public async Task GetDocumentByIdAsync_InternshipDoc_SuperAdmin_ShouldReturnDocument()
    {
        var db = GetDb();
        var (_, _, _, adminUser, _, docWithInternship) = await SeedDataAsync(db);
        var service = CreateService(db);

        var result = await service.GetDocumentByIdAsync(docWithInternship.Id, adminUser.Id, isLecturerOrAdmin: true);

        result.Should().NotBeNull();
        result!.Id.Should().Be(docWithInternship.Id);
    }

    [Fact]
    public async Task GetDocumentByIdAsync_InternshipDoc_StrangerStudent_ShouldThrowUnauthorizedAccessException()
    {
        var db = GetDb();
        var (_, _, strangerUser, _, _, docWithInternship) = await SeedDataAsync(db);
        var service = CreateService(db);

        var act = async () => await service.GetDocumentByIdAsync(docWithInternship.Id, strangerUser.Id, isLecturerOrAdmin: false);

        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("*access*");
    }

    [Fact]
    public async Task GetDocumentByIdAsync_InternshipDoc_UnassignedLecturer_ShouldThrowUnauthorizedAccessException()
    {
        var db = GetDb();
        var (_, _, _, _, _, docWithInternship) = await SeedDataAsync(db);

        var otherLecturer = new User
        {
            Id = Guid.NewGuid(),
            Username = "other_lecturer",
            PasswordHash = "hash",
            Role = Role.Lecturer,
            CreatedAt = DateTime.UtcNow
        };
        await db.Users.AddAsync(otherLecturer);
        await db.SaveChangesAsync();

        var service = CreateService(db);

        var act = async () => await service.GetDocumentByIdAsync(docWithInternship.Id, otherLecturer.Id, isLecturerOrAdmin: true);

        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("*access*");
    }

    [Fact]
    public async Task GetDocumentByIdAsync_NonExistent_ShouldReturnNull()
    {
        var db = GetDb();
        var (studentUser, _, _, _, _, _) = await SeedDataAsync(db);
        var service = CreateService(db);

        var result = await service.GetDocumentByIdAsync(Guid.NewGuid(), studentUser.Id, isLecturerOrAdmin: false);

        result.Should().BeNull();
    }

    [Fact]
    public async Task GetDocumentsByInternshipAsync_ShouldReturnItems()
    {
        var db = GetDb();
        var (_, _, _, _, internship, _) = await SeedDataAsync(db);
        var service = CreateService(db);

        var items = await service.GetDocumentsByInternshipAsync(internship.Id);

        items.Should().ContainSingle();
        items.First().Title.Should().Be("Internship Spec");
    }
}
