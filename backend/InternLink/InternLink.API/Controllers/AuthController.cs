using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InternLink.Application.Interfaces;
using InternLink.Application.DTOs;
using InternLink.API.Extensions;
using InternLink.Shared.Responses;
using Microsoft.AspNetCore.StaticFiles;

namespace InternLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var token = await _auth.LoginAsync(request, ipAddress);
        return Ok(ApiResponse<LoginResponse>.Ok(token));
    }

    [HttpPost("refresh-token")]
    [AllowAnonymous]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.AccessToken) || string.IsNullOrWhiteSpace(request.RefreshToken))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "AccessToken and RefreshToken are required" }));

        try
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var response = await _auth.RefreshTokenAsync(request, ipAddress);
            return Ok(ApiResponse<LoginResponse>.Ok(response));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpPost("revoke-token")]
    [Authorize]
    public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "RefreshToken is required" }));

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var result = await _auth.RevokeTokenAsync(request.RefreshToken, ipAddress);
        if (!result)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Token not found or already revoked" }));

        return Ok(ApiResponse<object>.Ok(new { message = "Token successfully revoked" }));
    }

    [HttpPost("revoke-all")]
    [Authorize]
    public async Task<IActionResult> RevokeAll()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        await _auth.RevokeAllTokensForUserAsync(userId.Value, ipAddress);
        return Ok(ApiResponse<object>.Ok(new { message = "All active sessions revoked" }));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));
        await _auth.LogoutAsync(userId.Value);
        return Ok(ApiResponse<object>.Ok(null));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));
        var user = await _auth.GetCurrentUserAsync(userId.Value);
        if (user == null) return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "User not found" }));
        return Ok(ApiResponse<CurrentUserResponse>.Ok(user));
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));
        await _auth.ChangePasswordAsync(userId.Value, request);
        return Ok(ApiResponse<object>.Ok(null));
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

        await _auth.ForgotPasswordAsync(request.Email);
        return Ok(ApiResponse<object>.Ok(null));
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

        await _auth.ResetPasswordAsync(request.Token, request.NewPassword);
        return Ok(ApiResponse<object>.Ok(null));
    }

    [HttpPost("avatar")]
    [Authorize]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        var userId = User.GetUserId();
        if (userId == null) return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));
        if (file == null || file.Length == 0)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Image file is required" }));

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext is not (".jpg" or ".jpeg" or ".png" or ".webp"))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Only .jpg, .png, .webp files are supported" }));

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
        Directory.CreateDirectory(uploadsDir);
        var fileName = $"{userId}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);
        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        var avatarUrl = $"/uploads/avatars/{fileName}";
        await _auth.UpdateAvatarAsync(userId.Value, avatarUrl);
        return Ok(ApiResponse<object>.Ok(new { avatarUrl }));
    }
}
