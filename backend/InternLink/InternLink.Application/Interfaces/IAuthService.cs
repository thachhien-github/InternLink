using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task LogoutAsync(Guid userId);
    Task<CurrentUserResponse?> GetCurrentUserAsync(Guid userId);
    Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
    Task ForgotPasswordAsync(string email);
    Task ResetPasswordAsync(string token, string newPassword);
}
