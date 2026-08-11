using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternLink.API.Extensions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;

namespace InternLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireLecturer")]
public class LecturerController : ControllerBase
{
    private readonly ILecturerService _lecturerService;

    public LecturerController(ILecturerService lecturerService)
    {
        _lecturerService = lecturerService;
    }

    [HttpGet("internships")]
    public async Task<IActionResult> GetInternships()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var internships = await _lecturerService.GetInternshipsAsync(userId.Value);
        return Ok(ApiResponse<IEnumerable<InternshipDto>>.Ok(internships));
    }

    [HttpGet("internships/{id}")]
    public async Task<IActionResult> GetInternship(Guid id)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var internship = await _lecturerService.GetInternshipAsync(id, userId.Value);
        if (internship == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Internship not found" }));

        return Ok(ApiResponse<InternshipDetailDto>.Ok(internship));
    }

    [HttpGet("internships/{id}/submissions")]
    public async Task<IActionResult> GetSubmissions(Guid id)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var submissions = await _lecturerService.GetSubmissionsByInternshipAsync(id, userId.Value);
        return Ok(ApiResponse<IEnumerable<SubmissionDto>>.Ok(submissions));
    }

    [HttpPost("submissions/{id}/feedback")]
    public async Task<IActionResult> AddFeedback(Guid id, [FromBody] CreateFeedbackRequest request)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var feedback = await _lecturerService.AddFeedbackAsync(id, userId.Value, request);
        if (feedback == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Submission not found" }));

        return Ok(ApiResponse<FeedbackDto>.Ok(feedback));
    }

    /// <summary>
    /// Export end-of-term summary for all internships assigned to the current lecturer.
    /// </summary>
    [HttpGet("export/end-of-term")]
    public async Task<IActionResult> ExportEndOfTerm()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var bytes = await _lecturerService.ExportEndOfTermExcelAsync(userId.Value);
        var fileName = $"tong-ket-cuoi-ky-{DateTime.UtcNow:yyyyMMdd-HHmmss}.xlsx";
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }
}
