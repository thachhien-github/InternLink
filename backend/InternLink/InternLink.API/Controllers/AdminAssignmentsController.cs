using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternLink.API.Controllers;

/// <summary>
/// Admin bulk assignment of students to lecturers.
/// </summary>
[ApiController]
[Route("api/Admin/assignments")]
[Authorize(Policy = "RequireAdmin")]
public class AdminAssignmentsController : ControllerBase
{
    private readonly IAssignmentService _assignmentService;

    public AdminAssignmentsController(IAssignmentService assignmentService)
    {
        _assignmentService = assignmentService;
    }

    [HttpPost]
    public async Task<IActionResult> BulkAssign([FromBody] BulkAssignRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

            var result = await _assignmentService.BulkAssignAsync(request);
            return Ok(ApiResponse<BulkAssignResultDto>.Ok(result));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpGet("by-lecturer/{lecturerId:guid}")]
    public async Task<IActionResult> GetByLecturer(Guid lecturerId)
    {
        try
        {
            var items = await _assignmentService.GetByLecturerAsync(lecturerId);
            return Ok(ApiResponse<IReadOnlyList<LecturerAssignmentItemDto>>.Ok(items));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpDelete]
    public async Task<IActionResult> Unassign([FromBody] UnassignRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

        var ok = await _assignmentService.UnassignAsync(request);
        if (!ok)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Assignment not found" }));

        return Ok(ApiResponse<object>.Ok(null));
    }
}
