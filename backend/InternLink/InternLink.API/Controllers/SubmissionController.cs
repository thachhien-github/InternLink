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
public class SubmissionController : ControllerBase
{
    private readonly ISubmissionService _submissionService;

    public SubmissionController(ISubmissionService submissionService)
    {
        _submissionService = submissionService;
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var submission = await _submissionService.GetByIdAsync(id);
        if (submission == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Submission not found" }));

        return Ok(ApiResponse<SubmissionDto>.Ok(submission));
    }

    [HttpGet("internship/{internshipId:guid}")]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<IActionResult> GetByInternship(Guid internshipId)
    {
        var submissions = await _submissionService.GetByInternshipAsync(internshipId);
        return Ok(ApiResponse<IEnumerable<SubmissionDto>>.Ok(submissions));
    }

    [HttpGet("mine")]
    [Authorize(Policy = "RequireStudent")]
    public async Task<IActionResult> GetMine()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var submissions = await _submissionService.GetMineAsync(userId.Value);
        return Ok(ApiResponse<IEnumerable<SubmissionDto>>.Ok(submissions));
    }

    [HttpPost]
    [Authorize(Policy = "RequireStudent")]
    public async Task<IActionResult> Create([FromBody] CreateSubmissionRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

            var submission = await _submissionService.CreateAsync(userId.Value, request);
            return CreatedAtAction(nameof(GetById), new { id = submission.Id }, ApiResponse<SubmissionDto>.Ok(submission));
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

    [HttpPost("{id:guid}/resubmit")]
    [Authorize(Policy = "RequireStudent")]
    public async Task<IActionResult> Resubmit(Guid id, [FromBody] ResubmitRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

            var submission = await _submissionService.ResubmitAsync(id, userId.Value, request);
            if (submission == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Submission not found" }));

            return Ok(ApiResponse<SubmissionDto>.Ok(submission));
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

    [HttpPatch("{id:guid}/status")]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateSubmissionStatusRequest request)
    {
        try
        {
            var submission = await _submissionService.UpdateStatusAsync(id, request);
            if (submission == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Submission not found" }));

            return Ok(ApiResponse<SubmissionDto>.Ok(submission));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _submissionService.SoftDeleteAsync(id);
        if (!deleted)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Submission not found" }));

        return Ok(ApiResponse<object>.Ok(null));
    }

    [HttpGet("{id:guid}/feedbacks")]
    public async Task<IActionResult> GetFeedbacks(Guid id)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

            var isLecturer = User.IsInRole("Lecturer") || User.IsInRole("SuperAdmin");
            var feedbacks = await _submissionService.GetFeedbacksAsync(id, userId.Value, isLecturer);
            return Ok(ApiResponse<IEnumerable<FeedbackDto>>.Ok(feedbacks));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpPost("{id:guid}/feedback")]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<IActionResult> AddFeedback(Guid id, [FromBody] CreateFeedbackRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

            var feedback = await _submissionService.AddFeedbackAsync(id, userId.Value, request);
            if (feedback == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Submission not found" }));

            return Ok(ApiResponse<FeedbackDto>.Ok(feedback));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }
}
