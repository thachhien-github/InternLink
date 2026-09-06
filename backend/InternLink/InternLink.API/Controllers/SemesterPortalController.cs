using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternLink.API.Controllers;

[ApiController]
[Route("api/Semesters")]
[Authorize]
public class SemesterPortalController : ControllerBase
{
    private readonly ISemesterService _semesterService;

    public SemesterPortalController(ISemesterService semesterService)
    {
        _semesterService = semesterService;
    }

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrent()
    {
        var semester = await _semesterService.GetActiveSemesterAsync();
        return semester == null
            ? NotFound(ApiResponse<object>.Fail(new ApiError { Title = "No active semester" }))
            : Ok(ApiResponse<SemesterDto>.Ok(semester));
    }
}