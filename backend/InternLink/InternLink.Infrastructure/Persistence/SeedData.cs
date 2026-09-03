using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Persistence;

public static class SeedData
{
    /// <summary>
    /// Demo credentials for admin: Password123!
    /// </summary>
    public const string DefaultPassword = "Password123!";

    public static async Task InitializeAsync(AppDbContext context)
    {
        var hasher = new PasswordHasher<User>();

        await EnsureAdminUserAsync(context, hasher);
    }

    private static async Task EnsureAdminUserAsync(AppDbContext context, PasswordHasher<User> hasher)
    {
        var adminUsername = "admin";
        var user = await context.Users.FirstOrDefaultAsync(u => u.Username == adminUsername);

        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                Username = adminUsername,
                FullName = "Admin",
                Email = "admin@internlink.test",
                Role = Role.SuperAdmin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            user.PasswordHash = hasher.HashPassword(user, DefaultPassword);
            await context.Users.AddAsync(user);
        }
        else
        {
            // Only ensure account is active and correct role — do NOT reset password
            user.IsActive = true;
            user.IsDeleted = false;
            user.FullName = "Admin";
            user.Role = Role.SuperAdmin;
            user.UpdatedAt = DateTime.UtcNow;
        }

        await context.SaveChangesAsync();
    }

    private static async Task EnsureSemestersAsync(AppDbContext context)
    {
        if (await context.Semesters.AnyAsync())
            return;

        var activeSem = new Semester
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Name = "Thực tập Tốt nghiệp K20 (2025 - 2026)",
            Term = "Học kỳ I",
            AcademicYear = "2025 - 2026",
            StartDate = DateTime.UtcNow.AddMonths(-2),
            EndDate = DateTime.UtcNow.AddMonths(2),
            Status = SemesterStatus.Active,
            Description = "Đợt thực tập chính thức cho sinh viên Khóa 2020 ngành Công nghệ Thông tin, Kỹ thuật Phần mềm và Mạng máy tính.",
            MaxStudentsPerLecturer = 30,
            CreatedAt = DateTime.UtcNow
        };

        var upcomingSem = new Semester
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Name = "Thực tập Doanh nghiệp K20 (2025 - 2026)",
            Term = "Học kỳ II",
            AcademicYear = "2025 - 2026",
            StartDate = DateTime.UtcNow.AddMonths(3),
            EndDate = DateTime.UtcNow.AddMonths(7),
            Status = SemesterStatus.Upcoming,
            Description = "Đợt thực tập Học kỳ II dành cho sinh viên giai đoạn 2 và sinh viên đăng ký bổ sung.",
            MaxStudentsPerLecturer = 30,
            CreatedAt = DateTime.UtcNow
        };

        var completedSem = new Semester
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            Name = "Thực tập Tốt nghiệp K19 (2024 - 2025)",
            Term = "Học kỳ I",
            AcademicYear = "2024 - 2025",
            StartDate = DateTime.UtcNow.AddYears(-1),
            EndDate = DateTime.UtcNow.AddYears(-1).AddMonths(4),
            Status = SemesterStatus.Completed,
            Description = "Khóa thực tập đã hoàn tất bảo vệ, chấm điểm và tổng kết dữ liệu Khoa CNTT.",
            MaxStudentsPerLecturer = 30,
            CreatedAt = DateTime.UtcNow
        };

        context.Semesters.AddRange(activeSem, upcomingSem, completedSem);
        await context.SaveChangesAsync();
    }
}
