using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Persistence;

public static class SeedData
{
    /// <summary>
    /// Demo credentials (all roles): Password123!
    /// Users: superadmin / lecturer1 / student1
    /// </summary>
    public const string DefaultPassword = "Password123!";

    public static async Task InitializeAsync(AppDbContext context)
    {
        var hasher = new PasswordHasher<User>();

        await EnsureUsersAsync(context, hasher);
        await EnsureSemestersAsync(context);
        await EnsureLecturerProfilesAsync(context);
        await EnsureStudentUserLinksAsync(context);
        await EnsureInternshipLecturerLinksAsync(context);
        await EnsureDemoInternshipsAsync(context);

        if (await context.Companies.AnyAsync() || await context.Students.AnyAsync())
            return;

        var users = await context.Users.OrderBy(u => u.Username).ToListAsync();
        var lecturerUser = users.First(u => u.Role == Role.Lecturer);
        var studentUser = users.First(u => u.Role == Role.Student);
        var lecturerProfile = await context.Lecturers.FirstAsync(l => l.UserId == lecturerUser.Id && !l.IsDeleted);

        var companies = new List<Company>
        {
            new Company
            {
                Id = Guid.NewGuid(),
                CompanyName = "FPT Software",
                Address = "Phu My Hung, District 7, HCMC",
                Website = "https://fptsoftware.com",
                Industry = "Software Development",
                ContactPerson = "Ms. Linh Tran",
                ContactEmail = "linh.tran@fptsoftware.com",
                ContactPhone = "0909 123 456",
                Capacity = 12,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new Company
            {
                Id = Guid.NewGuid(),
                CompanyName = "Viettel Digital",
                Address = "Tan Binh, HCMC",
                Website = "https://viettel.vn",
                Industry = "Telecommunications",
                ContactPerson = "Mr. Hoang Le",
                ContactEmail = "hoang.le@viettel.vn",
                ContactPhone = "0912 345 678",
                Capacity = 8,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        var students = new List<Student>
        {
            new Student
            {
                Id = Guid.NewGuid(),
                UserId = studentUser.Id,
                StudentCode = "2421160052",
                FullName = "Nguyen An",
                Class = "K15CNTT",
                Major = "Software Engineering",
                Email = "annguyen@student.internlink.test",
                Phone = "0987 654 321",
                CreatedAt = DateTime.UtcNow
            },
            new Student
            {
                Id = Guid.NewGuid(),
                StudentCode = "2421160053",
                FullName = "Le Binh",
                Class = "K15CNTT",
                Major = "Information Systems",
                Email = "binhle@student.internlink.test",
                Phone = "0978 123 456",
                CreatedAt = DateTime.UtcNow
            }
        };

        var internships = new List<Internship>
        {
            new Internship
            {
                Id = Guid.NewGuid(),
                StudentId = students[0].Id,
                CompanyId = companies[0].Id,
                LecturerId = lecturerProfile.Id,
                StartDate = DateTime.UtcNow.Date,
                EndDate = DateTime.UtcNow.Date.AddMonths(3),
                Status = InternshipStatus.InProgress,
                Position = "Junior .NET Developer",
                SupervisorName = "Ms. Linh Tran",
                Notes = "Internship program for full-stack .NET developer.",
                CreatedAt = DateTime.UtcNow
            },
            new Internship
            {
                Id = Guid.NewGuid(),
                StudentId = students[1].Id,
                CompanyId = companies[1].Id,
                LecturerId = lecturerProfile.Id,
                StartDate = DateTime.UtcNow.Date.AddDays(7),
                EndDate = DateTime.UtcNow.Date.AddMonths(3).AddDays(7),
                Status = InternshipStatus.NotStarted,
                Position = "Business Analyst Intern",
                SupervisorName = "Mr. Hoang Le",
                Notes = "Data analysis and requirements gathering.",
                CreatedAt = DateTime.UtcNow
            }
        };

        var submissions = new List<Submission>
        {
            new Submission
            {
                Id = Guid.NewGuid(),
                InternshipId = internships[0].Id,
                Type = SubmissionType.WeeklyReport,
                Status = SubmissionStatus.Submitted,
                Version = 1,
                Title = "Week 1 Progress",
                Description = "Completed onboarding and started feature development.",
                FileName = "week1-report.pdf",
                FileUrl = "https://example.com/reports/week1-report.pdf",
                SubmittedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            }
        };

        var feedbacks = new List<Feedback>
        {
            new Feedback
            {
                Id = Guid.NewGuid(),
                SubmissionId = submissions[0].Id,
                LecturerId = lecturerProfile.Id,
                Comment = "Good progress. Please complete unit tests next week.",
                IsPublic = true,
                CreatedAt = DateTime.UtcNow
            }
        };

        var weeklyReports = new List<WeeklyReport>
        {
            new WeeklyReport
            {
                Id = Guid.NewGuid(),
                InternshipId = internships[0].Id,
                WeekNumber = 1,
                Title = "Week 1 Summary",
                Content = "Onboarding completed. Set up local environment.",
                Status = WeeklyReportStatus.Submitted,
                SubmittedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Companies.AddRangeAsync(companies);
        await context.Students.AddRangeAsync(students);
        await context.Internships.AddRangeAsync(internships);
        await context.Submissions.AddRangeAsync(submissions);
        await context.Feedbacks.AddRangeAsync(feedbacks);
        await context.WeeklyReports.AddRangeAsync(weeklyReports);

        await context.SaveChangesAsync();
    }

    private static async Task EnsureUsersAsync(AppDbContext context, PasswordHasher<User> hasher)
    {
        var demos = new[]
        {
            new { Username = "superadmin", FullName = "Super Admin", Email = "superadmin@internlink.test", Role = Role.SuperAdmin },
            new { Username = "lecturer1", FullName = "Lecturer Nguyen", Email = "lecturer1@internlink.test", Role = Role.Lecturer },
            new { Username = "student1", FullName = "Student An", Email = "student1@internlink.test", Role = Role.Student }
        };

        foreach (var demo in demos)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == demo.Username);
            if (user == null)
            {
                user = new User
                {
                    Id = Guid.NewGuid(),
                    Username = demo.Username,
                    FullName = demo.FullName,
                    Email = demo.Email,
                    Role = demo.Role,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };
                user.PasswordHash = hasher.HashPassword(user, DefaultPassword);
                await context.Users.AddAsync(user);
            }
            else
            {
                user.PasswordHash = hasher.HashPassword(user, DefaultPassword);
                user.IsActive = true;
                user.IsDeleted = false;
                user.UpdatedAt = DateTime.UtcNow;
            }
        }

        await context.SaveChangesAsync();
    }

    private static async Task EnsureLecturerProfilesAsync(AppDbContext context)
    {
        var lecturerUsers = await context.Users
            .Where(u => u.Role == Role.Lecturer && !u.IsDeleted)
            .ToListAsync();

        foreach (var user in lecturerUsers)
        {
            var exists = await context.Lecturers.AnyAsync(l => l.UserId == user.Id && !l.IsDeleted);
            if (exists)
                continue;

            var staffCode = $"GV-{user.Username}";
            if (await context.Lecturers.AnyAsync(l => l.StaffCode == staffCode))
                staffCode = $"GV-{user.Id.ToString()[..8]}";

            await context.Lecturers.AddAsync(new Lecturer
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                StaffCode = staffCode,
                FullName = user.FullName ?? user.Username,
                Email = user.Email,
                Department = "CNTT",
                CreatedAt = DateTime.UtcNow
            });
        }

        await context.SaveChangesAsync();
    }

    private static async Task EnsureStudentUserLinksAsync(AppDbContext context)
    {
        var studentUsers = await context.Users
            .Where(u => u.Role == Role.Student && !u.IsDeleted)
            .OrderBy(u => u.Username)
            .ToListAsync();

        var unlinkedStudents = await context.Students
            .Where(s => !s.IsDeleted && s.UserId == null)
            .OrderBy(s => s.CreatedAt)
            .ToListAsync();

        var unlinkedIndex = 0;
        foreach (var user in studentUsers)
        {
            var alreadyLinked = await context.Students
                .AnyAsync(s => s.UserId == user.Id && !s.IsDeleted);
            if (alreadyLinked)
                continue;

            if (unlinkedIndex < unlinkedStudents.Count)
            {
                var student = unlinkedStudents[unlinkedIndex++];
                student.UserId = user.Id;
                student.UpdatedAt = DateTime.UtcNow;
                continue;
            }

            var studentCode = $"DEMO-{user.Username.ToUpperInvariant()}";
            if (await context.Students.AnyAsync(s => s.StudentCode == studentCode && !s.IsDeleted))
                studentCode = $"DEMO-{user.Id.ToString()[..8]}";

            await context.Students.AddAsync(new Student
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                StudentCode = studentCode,
                FullName = user.FullName ?? user.Username,
                Email = user.Email,
                Class = "K15CNTT",
                Major = "Software Engineering",
                CreatedAt = DateTime.UtcNow
            });
        }

        await context.SaveChangesAsync();
    }

    private static async Task EnsureDemoInternshipsAsync(AppDbContext context)
    {
        var demoStudentUser = await context.Users
            .FirstOrDefaultAsync(u => u.Username == "student1" && u.Role == Role.Student && !u.IsDeleted);
        if (demoStudentUser == null)
            return;

        var student = await context.Students
            .FirstOrDefaultAsync(s => s.UserId == demoStudentUser.Id && !s.IsDeleted);
        if (student == null)
            return;

        var hasInternship = await context.Internships
            .AnyAsync(i => !i.IsDeleted && i.StudentId == student.Id);
        if (hasInternship)
            return;

        var company = await context.Companies
            .Where(c => !c.IsDeleted && c.IsActive)
            .OrderBy(c => c.CreatedAt)
            .FirstOrDefaultAsync();
        var lecturer = await context.Lecturers
            .Where(l => !l.IsDeleted)
            .OrderBy(l => l.CreatedAt)
            .FirstOrDefaultAsync();

        if (company == null || lecturer == null)
            return;

        await context.Internships.AddAsync(new Internship
        {
            Id = Guid.NewGuid(),
            StudentId = student.Id,
            CompanyId = company.Id,
            LecturerId = lecturer.Id,
            StartDate = DateTime.UtcNow.Date,
            EndDate = DateTime.UtcNow.Date.AddMonths(3),
            Status = InternshipStatus.InProgress,
            Position = "Intern",
            CreatedAt = DateTime.UtcNow
        });

        await context.SaveChangesAsync();
    }

    private static async Task EnsureInternshipLecturerLinksAsync(AppDbContext context)
    {
        var defaultLecturer = await context.Lecturers
            .Where(l => !l.IsDeleted)
            .OrderBy(l => l.CreatedAt)
            .FirstOrDefaultAsync();

        if (defaultLecturer == null)
            return;

        var orphanInternships = await context.Internships
            .Where(i => !i.IsDeleted && i.LecturerId == null)
            .ToListAsync();

        foreach (var internship in orphanInternships)
        {
            internship.LecturerId = defaultLecturer.Id;
            internship.UpdatedAt = DateTime.UtcNow;
        }

        if (orphanInternships.Count > 0)
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

        var internships = await context.Internships.Where(i => i.SemesterId == null).ToListAsync();
        foreach (var i in internships)
        {
            i.SemesterId = activeSem.Id;
        }
        if (internships.Count > 0)
        {
            await context.SaveChangesAsync();
        }
    }
}
