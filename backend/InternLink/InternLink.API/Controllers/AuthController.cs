using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InternLink.Application.Interfaces;
using InternLink.Application.DTOs;
using InternLink.Shared.Responses;

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
        var token = await _auth.LoginAsync(request);
        return Ok(ApiResponse<LoginResponse>.Ok(token));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        // get user id from claim
        var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst("nameid")?.Value;
        if (userIdClaim == null) return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));
        var userId = Guid.Parse(userIdClaim);
        await _auth.LogoutAsync(userId);
        return Ok(ApiResponse<object>.Ok(null));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst("nameid")?.Value;
        if (userIdClaim == null) return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));
        var userId = Guid.Parse(userIdClaim);
        var user = await _auth.GetCurrentUserAsync(userId);
        if (user == null) return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "User not found" }));
        return Ok(ApiResponse<CurrentUserResponse>.Ok(user));
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst("nameid")?.Value;
        if (userIdClaim == null) return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));
        var userId = Guid.Parse(userIdClaim);
        await _auth.ChangePasswordAsync(userId, request);
        return Ok(ApiResponse<object>.Ok(null));
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword([FromBody] Dictionary<string, string> payload)
    {
        if (!payload.TryGetValue("email", out var email)) return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Email required" }));
        await _auth.ForgotPasswordAsync(email);
        return Ok(ApiResponse<object>.Ok(null));
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword([FromBody] Dictionary<string, string> payload)
    {
        if (!payload.TryGetValue("token", out var token) || !payload.TryGetValue("newPassword", out var newPassword))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "token and newPassword required" }));
        await _auth.ResetPasswordAsync(token, newPassword);
        return Ok(ApiResponse<object>.Ok(null));
    }
}
