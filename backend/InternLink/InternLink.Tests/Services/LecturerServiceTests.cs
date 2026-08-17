using AutoMapper;
using FluentAssertions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Application.Mappings;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using InternLink.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace InternLink.Tests.Services;

public class LecturerServiceTests
{
    private readonly IMapper _mapper;

    public LecturerServiceTests()
    {
        var config = new MapperConfiguration(cfg =>
        {
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

    [Fact]
    public async Task GetInternshipsAsync_ValidLecturer_ShouldReturnInternshipsInActiveSemester()
    {
        var db = GetDb();
        var lecturerUser = new User { Id = Guid.NewGuid(), Username = "lecturer", PasswordHash = "hash", Role = Role.Lecturer, CreatedAt = DateTime.UtcNow };
        var lecturer = new Lecturer { Id = Guid.NewGuid(), UserId = lecturerUser.Id, StaffCode = "GV001", FullName = "Lecturer 1", CreatedAt = DateTime.UtcNow };

        var semester = new Semester { Id = Guid.NewGuid(), Name = "Fall 2026", Term = "Học kỳ I", AcademicYear = "2026 - 2027", Status = SemesterStatus.Active, CreatedAt = DateTime.UtcNow };
        var student = new Student { Id = Guid.NewGuid(), StudentCode = "SV001", FullName = "Student 1", CreatedAt = DateTime.UtcNow };
        var internship = new Internship
        {
            Id = Guid.NewGuid(),
            StudentId = student.Id,
            Student = student,
            LecturerId = lecturer.Id,
            Lecturer = lecturer,
            SemesterId = semester.Id,
            Semester = semester,
            Status = InternshipStatus.InProgress,
            CreatedAt = DateTime.UtcNow
        };

        await db.Users.AddAsync(lecturerUser);
        await db.Lecturers.AddAsync(lecturer);
        await db.Semesters.AddAsync(semester);
        await db.Students.AddAsync(student);
        await db.Internships.AddAsync(internship);
        await db.SaveChangesAsync();

        var service = new LecturerService(db, _mapper, Mock.Of<INotificationService>());

        var result = await service.GetInternshipsAsync(lecturerUser.Id);

        result.Should().ContainSingle();
        result.First().Id.Should().Be(internship.Id);
    }

    [Fact]
    public async Task GetInternshipAsync_WrongLecturer_ShouldReturnNull()
    {
        var db = GetDb();
        var otherUser = new User { Id = Guid.NewGuid(), Username = "other", PasswordHash = "hash", Role = Role.Lecturer, CreatedAt = DateTime.UtcNow };
        await db.Users.AddAsync(otherUser);
        await db.SaveChangesAsync();

        var service = new LecturerService(db, _mapper, Mock.Of<INotificationService>());

        var result = await service.GetInternshipAsync(Guid.NewGuid(), otherUser.Id);

        result.Should().BeNull();
    }
}
