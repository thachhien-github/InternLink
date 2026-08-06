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
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IJwtService _jwt;
    private readonly IMapper _mapper;
    private readonly PasswordHasher<User> _hasher;
    private readonly ILogger<AuthService> _logger;
    private readonly JwtSettings _jwtSettings;

    public AuthService(AppDbContext db, IJwtService jwt, IMapper mapper, PasswordHasher<User> hasher, ILogger<AuthService> logger, IOptions<JwtSettings> jwtOptions)
    {
        _db = db;
        _jwt = jwt;
        _mapper = mapper;
        _hasher = hasher;
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
        return new LoginResponse { Token = token, ExpiresAt = expires };
    }

    public async Task LogoutAsync(Guid userId)
    {
        // Stateless JWT - logout can be implemented by a token blacklist or client side disposal.
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
        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        _logger.LogInformation("User {UserId} changed password", userId);
    }

    public async Task ForgotPasswordAsync(string email)
    {
        // Placeholder: implement email token generation and send flow
        _logger.LogInformation("ForgotPassword requested for {Email}", email);
        await Task.CompletedTask;
    }

    public async Task ResetPasswordAsync(string token, string newPassword)
    {
        // Placeholder: validate token and reset password
        _logger.LogInformation("ResetPassword requested");
        await Task.CompletedTask;
    }
}
