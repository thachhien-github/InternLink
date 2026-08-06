namespace InternLink.Application.DTOs;

public sealed class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;
}
