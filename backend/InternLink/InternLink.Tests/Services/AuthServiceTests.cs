using FluentAssertions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Application.Mappings;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Email;
using InternLink.Infrastructure.Identity;
using InternLink.Infrastructure.Persistence;
using InternLink.Infrastructure.Services;
using InternLink.Shared.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using AutoMapper;
using Moq;

namespace InternLink.Tests.Services;

public class AuthServiceTests
{
    private readonly IMapper _mapper;

    public AuthServiceTests()
    {
        _mapper = new MapperConfiguration(cfg => cfg.AddProfile<AuthProfile>()).CreateMapper();
    }

    private static AppDbContext GetDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private AuthService CreateService(AppDbContext db, IEmailService? email = null)
    {
        var jwt = new Mock<IJwtService>();
        jwt.Setup(j => j.CreateToken(It.IsAny<string>(), It.IsAny<IEnumerable<string>>()))
            .Returns("test-jwt");

        var emailSettings = Options.Create(new EmailSettings
        {
            PortalUrl = "http://localhost:5173",
            PasswordResetPath = "/reset-password",
            PasswordResetTokenExpiryHours = 24,
            InstitutionName = "Demo"
        });

        return new AuthService(
            db,
            jwt.Object,
            _mapper,
            new PasswordHasher<User>(),
            email ?? Mock.Of<IEmailService>(),
            emailSettings,
            NullLogger<AuthService>.Instance,
            Options.Create(new JwtSettings { ExpiresInMinutes = 60 }));
    }

    [Fact]
    public async Task ForgotPasswordAsync_WithValidEmail_ShouldCreateTokenAndSendEmail()
    {
        var db = GetDb();
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = "student1",
            Email = "student1@internlink.test",
            FullName = "Student An",
            PasswordHash = "hash",
            Role = Role.Student,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        await db.Users.AddAsync(user);
        await db.SaveChangesAsync();

        var email = new Mock<IEmailService>();
        email.Setup(e => e.SendForgotPasswordAsync(It.IsAny<ForgotPasswordEmailRequest>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(SendEmailResult.Ok("student1@internlink.test"));

        var service = CreateService(db, email.Object);
        await service.ForgotPasswordAsync("student1@internlink.test");

        var tokens = await db.PasswordResetTokens.Where(t => t.UserId == user.Id).ToListAsync();
        tokens.Should().ContainSingle();
        tokens[0].UsedAt.Should().BeNull();
        tokens[0].ExpiresAt.Should().BeAfter(DateTime.UtcNow);

        email.Verify(e => e.SendForgotPasswordAsync(
            It.Is<ForgotPasswordEmailRequest>(r =>
                r.ToEmail == "student1@internlink.test" &&
                r.ResetLink.Contains("token=")),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ForgotPasswordAsync_UnknownEmail_ShouldNotThrowOrSendEmail()
    {
        var db = GetDb();
        var email = new Mock<IEmailService>();
        var service = CreateService(db, email.Object);

        await service.Invoking(s => s.ForgotPasswordAsync("unknown@test.com"))
            .Should().NotThrowAsync();

        email.Verify(e => e.SendForgotPasswordAsync(It.IsAny<ForgotPasswordEmailRequest>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task ResetPasswordAsync_WithValidToken_ShouldUpdatePassword()
    {
        var db = GetDb();
        var hasher = new PasswordHasher<User>();
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = "reset.user",
            Email = "reset@test.com",
            PasswordHash = hasher.HashPassword(null!, "OldPass123!"),
            Role = Role.Student,
            MustChangePassword = true,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        await db.Users.AddAsync(user);

        var rawToken = ResetTokenGenerator.GenerateToken();
        await db.PasswordResetTokens.AddAsync(new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = ResetTokenGenerator.HashToken(rawToken),
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            CreatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        var service = CreateService(db);
        await service.ResetPasswordAsync(rawToken, "NewPass456!");

        var updated = await db.Users.FindAsync(user.Id);
        updated!.MustChangePassword.Should().BeFalse();

        var verification = hasher.VerifyHashedPassword(updated, updated.PasswordHash, "NewPass456!");
        verification.Should().NotBe(PasswordVerificationResult.Failed);

        var usedToken = await db.PasswordResetTokens.FirstAsync();
        usedToken.UsedAt.Should().NotBeNull();
    }

    [Fact]
    public async Task ResetPasswordAsync_WithExpiredToken_ShouldThrow()
    {
        var db = GetDb();
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = "expired",
            PasswordHash = "hash",
            Role = Role.Student,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        await db.Users.AddAsync(user);

        var rawToken = ResetTokenGenerator.GenerateToken();
        await db.PasswordResetTokens.AddAsync(new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = ResetTokenGenerator.HashToken(rawToken),
            ExpiresAt = DateTime.UtcNow.AddHours(-1),
            CreatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        var service = CreateService(db);
        var act = () => service.ResetPasswordAsync(rawToken, "NewPass456!");

        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }
}
