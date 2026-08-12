using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InternLink.Application.Interfaces;
using InternLink.Application.DTOs;
using InternLink.API.Extensions;
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
}
