namespace InternLink.Application.DTOs;

public sealed class RefreshTokenRequest
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}

public sealed class RevokeTokenRequest
{
    public string RefreshToken { get; set; } = null!;
}
