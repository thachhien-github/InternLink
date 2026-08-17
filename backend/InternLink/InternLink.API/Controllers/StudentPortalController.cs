using InternLink.API.Extensions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireStudent")]
public class StudentPortalController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentPortalController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    /// <summary>
    /// Current student's profile and active internship.
    /// </summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var profile = await _studentService.GetPortalProfileByUserIdAsync(userId.Value);
        if (profile == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Student profile not found" }));

        return Ok(ApiResponse<StudentPortalProfileDto>.Ok(profile));
    }
}
