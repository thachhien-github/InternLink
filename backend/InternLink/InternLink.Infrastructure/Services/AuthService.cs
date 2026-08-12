using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Infrastructure.Persistence;
using InternLink.Domain.Entities;
using InternLink.Shared.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using InternLink.Infrastructure.Identity;
using InternLink.Infrastructure.Email;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IJwtService _jwt;
    private readonly IMapper _mapper;
    private readonly PasswordHasher<User> _hasher;
    private readonly IEmailService _emailService;
    private readonly EmailSettings _emailSettings;
    private readonly ILogger<AuthService> _logger;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        AppDbContext db,
        IJwtService jwt,
        IMapper mapper,
        PasswordHasher<User> hasher,
        IEmailService emailService,
        IOptions<EmailSettings> emailOptions,
        ILogger<AuthService> logger,
        IOptions<JwtSettings> jwtOptions)
    {
        _db = db;
        _jwt = jwt;
        _mapper = mapper;
        _hasher = hasher;
        _emailService = emailService;
        _emailSettings = emailOptions.Value;
        _logger = logger;
        _jwtSettings = jwtOptions.Value;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username && !u.IsDeleted);
        if (user == null || !user.IsActive)
        {
            _logger.LogWarning("Failed login attempt for user {Username}", request.Username);
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        var verification = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verification == PasswordVerificationResult.Failed)
        {
            _logger.LogWarning("Failed login attempt for user {Username} - wrong password", request.Username);
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var token = _jwt.CreateToken(user.Id.ToString(), new[] { user.Role.ToString() });
        _logger.LogInformation("User {Username} logged in successfully", request.Username);
        var expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresInMinutes > 0 ? _jwtSettings.ExpiresInMinutes : 60);
        return new LoginResponse
        {
            Token = token,
            ExpiresAt = expires,
            Role = user.Role.ToString(),
            MustChangePassword = user.MustChangePassword
        };
    }

    public async Task LogoutAsync(Guid userId)
    {
        _logger.LogInformation("User {UserId} logged out", userId);
        await Task.CompletedTask;
    }

    public async Task<CurrentUserResponse?> GetCurrentUserAsync(Guid userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);
        if (user == null) return null;
        return _mapper.Map<CurrentUserResponse>(user);
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId && !u.IsDeleted);
        if (user == null) throw new KeyNotFoundException("User not found");

        var verification = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.CurrentPassword);
        if (verification == PasswordVerificationResult.Failed)
        {
            _logger.LogWarning("User {UserId} attempted password change with invalid current password", userId);
            throw new UnauthorizedAccessException("Current password is invalid");
        }

        user.PasswordHash = _hasher.HashPassword(user, request.NewPassword);
        user.MustChangePassword = false;
        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        _logger.LogInformation("User {UserId} changed password", userId);
    }

    public async Task ForgotPasswordAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return;

        var normalizedEmail = email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u =>
            u.Email != null &&
            u.Email.ToLower() == normalizedEmail &&
            !u.IsDeleted &&
            u.IsActive);

        if (user == null)
        {
            _logger.LogInformation("ForgotPassword requested for unknown or inactive email {Email}", email);
            return;
        }

        var rawToken = ResetTokenGenerator.GenerateToken();
        var tokenHash = ResetTokenGenerator.HashToken(rawToken);
        var expiresAt = DateTime.UtcNow.AddHours(_emailSettings.PasswordResetTokenExpiryHours);

        var activeTokens = await _db.PasswordResetTokens
            .Where(t => t.UserId == user.Id && t.UsedAt == null && !t.IsDeleted)
            .ToListAsync();

        foreach (var existing in activeTokens)
        {
            existing.IsDeleted = true;
            existing.UpdatedAt = DateTime.UtcNow;
        }

        await _db.PasswordResetTokens.AddAsync(new PasswordResetToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresAt = expiresAt,
            CreatedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();

        var resetLink = BuildResetLink(rawToken);
        var emailResult = await _emailService.SendForgotPasswordAsync(new ForgotPasswordEmailRequest
        {
            ToEmail = user.Email!,
            FullName = user.FullName ?? user.Username,
            ResetLink = resetLink
        });

        if (!emailResult.Success)
            _logger.LogWarning("ForgotPassword email failed for {Email}: {Message}", user.Email, emailResult.Message);
        else
            _logger.LogInformation("ForgotPassword email sent for user {UserId}", user.Id);
    }

    public async Task ResetPasswordAsync(string token, string newPassword)
    {
        if (string.IsNullOrWhiteSpace(token))
            throw new UnauthorizedAccessException("Invalid or expired reset token");

        var tokenHash = ResetTokenGenerator.HashToken(token);
        var resetToken = await _db.PasswordResetTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t =>
                t.TokenHash == tokenHash &&
                !t.IsDeleted &&
                t.UsedAt == null &&
                t.ExpiresAt > DateTime.UtcNow);

        if (resetToken?.User == null || resetToken.User.IsDeleted || !resetToken.User.IsActive)
            throw new UnauthorizedAccessException("Invalid or expired reset token");

        var user = resetToken.User;
        user.PasswordHash = _hasher.HashPassword(user, newPassword);
        user.MustChangePassword = false;
        user.UpdatedAt = DateTime.UtcNow;

        resetToken.UsedAt = DateTime.UtcNow;
        resetToken.UpdatedAt = DateTime.UtcNow;

        var otherTokens = await _db.PasswordResetTokens
            .Where(t => t.UserId == user.Id && t.Id != resetToken.Id && t.UsedAt == null && !t.IsDeleted)
            .ToListAsync();

        foreach (var other in otherTokens)
        {
            other.IsDeleted = true;
            other.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        _logger.LogInformation("User {UserId} reset password via email token", user.Id);
    }

    private string BuildResetLink(string rawToken)
    {
        var baseUrl = _emailSettings.PortalUrl.TrimEnd('/');
        var path = _emailSettings.PasswordResetPath.TrimStart('/');
        return $"{baseUrl}/{path}?token={Uri.EscapeDataString(rawToken)}";
    }
}
