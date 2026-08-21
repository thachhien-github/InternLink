using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternLink.API.Extensions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;

namespace InternLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WeeklyReportController : ControllerBase
{
    private readonly IWeeklyReportService _weeklyReportService;

    public WeeklyReportController(IWeeklyReportService weeklyReportService)
    {
        _weeklyReportService = weeklyReportService;
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

            var isLecturerOrAdmin = User.IsInRole("Lecturer") || User.IsInRole("SuperAdmin");
            var report = await _weeklyReportService.GetByIdAsync(id, userId.Value, isLecturerOrAdmin);
            if (report == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Weekly report not found" }));

            return Ok(ApiResponse<WeeklyReportDto>.Ok(report));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("mine")]
    [Authorize(Policy = "RequireStudent")]
    public async Task<IActionResult> GetMine()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var reports = await _weeklyReportService.GetMineAsync(userId.Value);
        return Ok(ApiResponse<IEnumerable<WeeklyReportDto>>.Ok(reports));
    }

    [HttpGet("internship/{internshipId:guid}")]
    [Authorize(Policy = "RequireLecturerOrAdmin")]
    public async Task<IActionResult> GetByInternship(Guid internshipId)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

            var isLecturerOrAdmin = User.IsInRole("Lecturer") || User.IsInRole("SuperAdmin");
            var reports = await _weeklyReportService.GetByInternshipAsync(internshipId, userId.Value, isLecturerOrAdmin);
            return Ok(ApiResponse<IEnumerable<WeeklyReportDto>>.Ok(reports));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    [HttpPost]
    [Authorize(Policy = "RequireStudent")]
    public async Task<IActionResult> CreateDraft([FromBody] CreateWeeklyReportRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

            var report = await _weeklyReportService.CreateDraftAsync(userId.Value, request);
            return CreatedAtAction(nameof(GetById), new { id = report.Id }, ApiResponse<WeeklyReportDto>.Ok(report));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "RequireStudent")]
    public async Task<IActionResult> UpdateDraft(Guid id, [FromBody] UpdateWeeklyReportRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

            var report = await _weeklyReportService.UpdateDraftAsync(id, userId.Value, request);
            if (report == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Weekly report not found" }));

            return Ok(ApiResponse<WeeklyReportDto>.Ok(report));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpPost("{id:guid}/submit")]
    [Authorize(Policy = "RequireStudent")]
    public async Task<IActionResult> Submit(Guid id)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

            var report = await _weeklyReportService.SubmitAsync(id, userId.Value);
            if (report == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Weekly report not found" }));

            return Ok(ApiResponse<WeeklyReportDto>.Ok(report));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpPost("{id:guid}/review")]
    [Authorize(Policy = "RequireLecturerOrAdmin")]
    public async Task<IActionResult> Review(Guid id, [FromBody] ReviewWeeklyReportRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

            var report = await _weeklyReportService.ReviewAsync(id, userId.Value, request);
            if (report == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Weekly report not found" }));

            return Ok(ApiResponse<WeeklyReportDto>.Ok(report));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "RequireStudent")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

            var deleted = await _weeklyReportService.SoftDeleteAsync(id, userId.Value);
            if (!deleted)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Weekly report not found" }));

            return Ok(ApiResponse<object>.Ok(null));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }
}
