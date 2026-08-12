namespace InternLink.Application.DTOs;

public sealed class ForgotPasswordRequest
{
    public string Email { get; set; } = null!;
}

public sealed class ResetPasswordRequest
{
    public string Token { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}
