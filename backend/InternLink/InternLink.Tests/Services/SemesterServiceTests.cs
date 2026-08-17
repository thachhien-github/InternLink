using FluentAssertions;
using InternLink.Application.DTOs;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using InternLink.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace InternLink.Tests.Services;

public class SemesterServiceTests
{
    private static AppDbContext GetDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetAllSemestersAsync_ShouldReturnActiveSemestersFirst()
    {
        var db = GetDb();
        var semester1 = new Semester { Id = Guid.NewGuid(), Name = "Semester 1", Term = "Học kỳ I", AcademicYear = "2025 - 2026", Status = SemesterStatus.Completed, CreatedAt = DateTime.UtcNow.AddDays(-10) };
        var semester2 = new Semester { Id = Guid.NewGuid(), Name = "Semester 2", Term = "Học kỳ II", AcademicYear = "2025 - 2026", Status = SemesterStatus.Active, CreatedAt = DateTime.UtcNow.AddDays(-5) };

        await db.Semesters.AddRangeAsync(semester1, semester2);
        await db.SaveChangesAsync();

        var service = new SemesterService(db);

        var semesters = (await service.GetAllSemestersAsync()).ToList();

        semesters.Should().HaveCount(2);
        semesters.First().Status.Should().Be(SemesterStatus.Active);
    }

    [Fact]
    public async Task GetSemesterByIdAsync_ValidId_ShouldReturnSemester()
    {
        var db = GetDb();
        var semester = new Semester { Id = Guid.NewGuid(), Name = "Fall 2026", Term = "Học kỳ I", AcademicYear = "2026 - 2027", Status = SemesterStatus.Active, CreatedAt = DateTime.UtcNow };
        await db.Semesters.AddAsync(semester);
        await db.SaveChangesAsync();

        var service = new SemesterService(db);

        var result = await service.GetSemesterByIdAsync(semester.Id);

        result.Should().NotBeNull();
        result!.Name.Should().Be("Fall 2026");
    }

    [Fact]
    public async Task CreateSemesterAsync_Valid_ShouldCreateAndReturn()
    {
        var db = GetDb();
        var service = new SemesterService(db);

        var dto = new CreateSemesterDto
        {
            Name = "Spring 2027",
            Term = "Spring",
            AcademicYear = "2026-2027",
            Status = SemesterStatus.Upcoming,
            MaxStudentsPerLecturer = 25
        };

        var result = await service.CreateSemesterAsync(dto);

        result.Should().NotBeNull();
        result.Name.Should().Be("Spring 2027");

        var created = await db.Semesters.FindAsync(result.Id);
        created.Should().NotBeNull();
        created!.MaxStudentsPerLecturer.Should().Be(25);
    }
}
