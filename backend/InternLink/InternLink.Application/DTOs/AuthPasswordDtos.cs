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

public sealed class AuthSessionDto
{
    public string Id { get; set; } = null!;
    public string Device { get; set; } = "Trình duyệt web";
    public string Browser { get; set; } = "Không xác định";
    public string? Ip { get; set; }
    public string Location { get; set; } = "Không xác định";
    public DateTime LastActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsCurrent { get; set; }
}

public sealed class AuthActivityDto
{
    public string Id { get; set; } = null!;
    public string Module { get; set; } = "Tài khoản";
    public string Action { get; set; } = null!;
    public string? Ip { get; set; }
    public DateTime Time { get; set; }
}
