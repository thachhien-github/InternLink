using Microsoft.EntityFrameworkCore;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;

namespace InternLink.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Student> Students { get; set; } = null!;
    public DbSet<Lecturer> Lecturers { get; set; } = null!;
    public DbSet<Company> Companies { get; set; } = null!;
    public DbSet<Internship> Internships { get; set; } = null!;
    public DbSet<Submission> Submissions { get; set; } = null!;
    public DbSet<Feedback> Feedbacks { get; set; } = null!;
    public DbSet<Document> Documents { get; set; } = null!;
    public DbSet<Evaluation> Evaluations { get; set; } = null!;
    public DbSet<WeeklyReport> WeeklyReports { get; set; } = null!;
    public DbSet<Notification> Notifications { get; set; } = null!;
    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(b =>
        {
            b.ToTable("Users");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasColumnName("UserId");
            b.Property(x => x.Username).IsRequired().HasMaxLength(100);
            b.Property(x => x.PasswordHash).IsRequired();
            b.Property(x => x.Email).HasMaxLength(200);
            b.Property(x => x.FullName).HasMaxLength(200);
            b.Property(x => x.IsActive).HasDefaultValue(true);
            b.Property(x => x.MustChangePassword).HasDefaultValue(false);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<Student>(b =>
        {
            b.ToTable("Students");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasColumnName("StudentId");
            b.Property(x => x.StudentCode).IsRequired().HasMaxLength(50);
            b.Property(x => x.FullName).IsRequired().HasMaxLength(200);
            b.Property(x => x.Class).HasMaxLength(100);
            b.Property(x => x.Major).HasMaxLength(150);
            b.Property(x => x.Email).HasMaxLength(200);
            b.Property(x => x.Phone).HasMaxLength(50);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            b.HasOne(x => x.Internship).WithOne(x => x.Student).HasForeignKey<Internship>(x => x.StudentId);
            b.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.SetNull);
            b.HasIndex(x => x.UserId).IsUnique().HasFilter("[UserId] IS NOT NULL");
        });

        modelBuilder.Entity<Lecturer>(b =>
        {
            b.ToTable("Lecturers");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasColumnName("LecturerId");
            b.Property(x => x.StaffCode).IsRequired().HasMaxLength(50);
            b.Property(x => x.FullName).IsRequired().HasMaxLength(200);
            b.Property(x => x.Email).HasMaxLength(200);
            b.Property(x => x.Phone).HasMaxLength(50);
            b.Property(x => x.Department).HasMaxLength(150);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            b.HasIndex(x => x.StaffCode).IsUnique();
            b.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.SetNull);
            b.HasIndex(x => x.UserId).IsUnique().HasFilter("[UserId] IS NOT NULL");
        });

        modelBuilder.Entity<Company>(b =>
        {
            b.ToTable("Companies");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasColumnName("CompanyId");
            b.Property(x => x.CompanyName).IsRequired().HasMaxLength(250);
            b.Property(x => x.Address).HasMaxLength(500);
            b.Property(x => x.Website).HasMaxLength(250);
            b.Property(x => x.Industry).HasMaxLength(150);
            b.Property(x => x.ContactPerson).HasMaxLength(200);
            b.Property(x => x.ContactEmail).HasMaxLength(200);
            b.Property(x => x.ContactPhone).HasMaxLength(50);
            b.Property(x => x.IsActive).HasDefaultValue(true);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<Internship>(b =>
        {
            b.ToTable("Internships");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasColumnName("InternshipId");
            b.Property(x => x.Position).HasMaxLength(200);
            b.Property(x => x.SupervisorName).HasMaxLength(200);
            b.Property(x => x.Status).HasDefaultValue(InternshipStatus.NotStarted);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            b.HasOne(x => x.Student).WithOne(x => x.Internship).HasForeignKey<Internship>(x => x.StudentId);
            b.HasOne(x => x.Company).WithMany(x => x.Internships).HasForeignKey(x => x.CompanyId);
            b.HasOne(x => x.Lecturer).WithMany(x => x.Internships).HasForeignKey(x => x.LecturerId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Submission>(b =>
        {
            b.ToTable("Submissions");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasColumnName("SubmissionId");
            b.Property(x => x.Type).HasDefaultValue(SubmissionType.WeeklyReport);
            b.Property(x => x.Status).HasDefaultValue(SubmissionStatus.Submitted);
            b.Property(x => x.Title).HasMaxLength(250);
            b.Property(x => x.Description).HasMaxLength(1000);
            b.Property(x => x.FileName).HasMaxLength(250);
            b.Property(x => x.FileUrl).HasMaxLength(1000);
            b.Property(x => x.SubmittedAt).HasDefaultValueSql("GETUTCDATE()");
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            b.HasOne(x => x.Internship).WithMany(x => x.Submissions).HasForeignKey(x => x.InternshipId);
        });

        modelBuilder.Entity<Feedback>(b =>
        {
            b.ToTable("Feedbacks");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasColumnName("FeedbackId");
            b.Property(x => x.Comment).IsRequired().HasMaxLength(2000);
            b.Property(x => x.IsPublic).HasDefaultValue(true);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            b.HasOne(x => x.Submission).WithMany(x => x.Feedbacks).HasForeignKey(x => x.SubmissionId);
            b.HasOne(x => x.Lecturer).WithMany().HasForeignKey(x => x.LecturerId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Document>(b =>
        {
            b.ToTable("Documents");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasColumnName("DocumentId");
            b.Property(x => x.Title).IsRequired().HasMaxLength(300);
            b.Property(x => x.Description).HasMaxLength(2000);
            b.Property(x => x.FileName).IsRequired().HasMaxLength(250);
            b.Property(x => x.FilePath).IsRequired().HasMaxLength(500);
            b.Property(x => x.MimeType).IsRequired().HasMaxLength(100);
            b.Property(x => x.UploadedAt).HasDefaultValueSql("GETUTCDATE()");
            b.Property(x => x.IsRequired).HasDefaultValue(false);
            b.Property(x => x.Category).HasMaxLength(100);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            b.HasOne(x => x.Internship).WithMany().HasForeignKey(x => x.InternshipId);
            b.HasOne(x => x.UploadedBy).WithMany().HasForeignKey(x => x.UploadedById).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Evaluation>(b =>
        {
            b.ToTable("Evaluations");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasColumnName("EvaluationId");
            b.Property(x => x.TechnicalScore).IsRequired();
            b.Property(x => x.CommunicationScore).IsRequired();
            b.Property(x => x.TeamworkScore).IsRequired();
            b.Property(x => x.InitiativeScore).IsRequired();
            b.Property(x => x.FinalGrade).IsRequired().HasPrecision(5, 2);
            b.Property(x => x.Comments).HasMaxLength(3000);
            b.Property(x => x.Strengths).HasMaxLength(2000);
            b.Property(x => x.AreasForImprovement).HasMaxLength(2000);
            b.Property(x => x.EvaluatedAt).HasDefaultValueSql("GETUTCDATE()");
            b.Property(x => x.IsFinalized).HasDefaultValue(false);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            b.HasOne(x => x.Internship).WithOne().HasForeignKey<Evaluation>(x => x.InternshipId);
            b.HasOne(x => x.EvaluatedBy).WithMany().HasForeignKey(x => x.EvaluatedById).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<WeeklyReport>(b =>
        {
            b.ToTable("WeeklyReports");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasColumnName("WeeklyReportId");
            b.Property(x => x.Title).IsRequired().HasMaxLength(250);
            b.Property(x => x.Content).IsRequired().HasMaxLength(8000);
            b.Property(x => x.Status).HasDefaultValue(WeeklyReportStatus.Draft);
            b.Property(x => x.LecturerComment).HasMaxLength(2000);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            b.HasOne(x => x.Internship).WithMany(x => x.WeeklyReports).HasForeignKey(x => x.InternshipId);
            b.HasIndex(x => new { x.InternshipId, x.WeekNumber });
        });

        modelBuilder.Entity<Notification>(b =>
        {
            b.ToTable("Notifications");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasColumnName("NotificationId");
            b.Property(x => x.Title).IsRequired().HasMaxLength(200);
            b.Property(x => x.Content).IsRequired().HasMaxLength(2000);
            b.Property(x => x.Link).HasMaxLength(500);
            b.Property(x => x.IsRead).HasDefaultValue(false);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            b.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            b.HasIndex(x => new { x.UserId, x.IsRead });
        });

        modelBuilder.Entity<PasswordResetToken>(b =>
        {
            b.ToTable("PasswordResetTokens");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasColumnName("PasswordResetTokenId");
            b.Property(x => x.TokenHash).IsRequired().HasMaxLength(64);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            b.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            b.HasIndex(x => x.TokenHash).IsUnique();
            b.HasIndex(x => new { x.UserId, x.UsedAt });
        });
    }
}
