using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternLink.API.Extensions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;

namespace InternLink.API.Controllers;

/// <summary>
/// API endpoints for internship management (Lecturer access only)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireLecturer")]
public class InternshipController : ControllerBase
{
    private readonly IInternshipService _internshipService;

    public InternshipController(IInternshipService internshipService)
    {
        _internshipService = internshipService;
    }

    /// <summary>
    /// Get all internships with pagination
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllInternships([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            if (skip < 0 || take < 1 || take > 1000)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid pagination parameters" }));

            var internships = await _internshipService.GetAllInternshipsAsync(skip, take);
            return Ok(ApiResponse<IEnumerable<InternshipListItemDto>>.Ok(internships));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Search internships with advanced filtering and sorting
    /// </summary>
    [HttpPost("search")]
    public async Task<IActionResult> SearchInternships([FromBody] InternshipFilterRequest request)
    {
        try
        {
            if (request.Skip < 0 || request.Take < 1 || request.Take > 1000)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid pagination parameters" }));

            var result = await _internshipService.GetInternshipsWithFilterAsync(request);
            return Ok(ApiResponse<PaginatedResponse<InternshipListItemDto>>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Get internship by ID with all details
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetInternshipById(Guid id)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

            var isLecturerOrAdmin = User.IsInRole("Lecturer") || User.IsInRole("SuperAdmin");
            var internship = await _internshipService.GetInternshipByIdAsync(id, userId.Value, isLecturerOrAdmin);
            if (internship == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Internship not found" }));

            return Ok(ApiResponse<InternshipDetailFullDto>.Ok(internship));
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

    /// <summary>
    /// Get internships by student
    /// </summary>
    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetInternshipsByStudent(Guid studentId, [FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            if (skip < 0 || take < 1 || take > 1000)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid pagination parameters" }));

            var internships = await _internshipService.GetInternshipsByStudentAsync(studentId, skip, take);
            return Ok(ApiResponse<IEnumerable<InternshipListItemDto>>.Ok(internships));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Get internships by company
    /// </summary>
    [HttpGet("company/{companyId}")]
    public async Task<IActionResult> GetInternshipsByCompany(Guid companyId, [FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            if (skip < 0 || take < 1 || take > 1000)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid pagination parameters" }));

            var internships = await _internshipService.GetInternshipsByCompanyAsync(companyId, skip, take);
            return Ok(ApiResponse<IEnumerable<InternshipListItemDto>>.Ok(internships));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Get internships by status
    /// </summary>
    [HttpGet("status/{status}")]
    public async Task<IActionResult> GetInternshipsByStatus(string status, [FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            if (skip < 0 || take < 1 || take > 1000)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid pagination parameters" }));

            var internships = await _internshipService.GetInternshipsByStatusAsync(status, skip, take);
            return Ok(ApiResponse<IEnumerable<InternshipListItemDto>>.Ok(internships));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Create a new internship
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateInternship([FromBody] CreateInternshipRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

            var internship = await _internshipService.CreateInternshipAsync(request);
            return CreatedAtAction(nameof(GetInternshipById), new { id = internship.Id }, ApiResponse<InternshipDetailFullDto>.Ok(internship));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Update an internship
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInternship(Guid id, [FromBody] UpdateInternshipRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

            var internship = await _internshipService.UpdateInternshipAsync(id, request);
            if (internship == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Internship not found" }));

            return Ok(ApiResponse<InternshipDetailFullDto>.Ok(internship));
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

    /// <summary>
    /// Update internship status
    /// </summary>
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateInternshipStatus(Guid id, [FromBody] UpdateInternshipStatusRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

            var internship = await _internshipService.UpdateInternshipStatusAsync(id, request);
            if (internship == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Internship not found" }));

            return Ok(ApiResponse<InternshipDetailFullDto>.Ok(internship));
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

    /// <summary>
    /// Assign or change company for an internship
    /// </summary>
    [HttpPut("{id}/company")]
    public async Task<IActionResult> AssignCompany(Guid id, [FromBody] AssignCompanyRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

            var internship = await _internshipService.AssignCompanyAsync(id, request);
            if (internship == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Internship not found" }));

            return Ok(ApiResponse<InternshipDetailFullDto>.Ok(internship));
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

    /// <summary>
    /// Delete an internship
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInternship(Guid id)
    {
        try
        {
            var result = await _internshipService.DeleteInternshipAsync(id);
            if (!result)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Internship not found" }));

            return Ok(ApiResponse<object>.Ok(null));
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

    /// <summary>
    /// Get internship statistics
    /// </summary>
    [HttpGet("stats/overview")]
    public async Task<IActionResult> GetInternshipStats()
    {
        try
        {
            var stats = await _internshipService.GetInternshipStatsAsync();
            return Ok(ApiResponse<InternshipStatsDto>.Ok(stats));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Check if student has active internship
    /// </summary>
    [HttpGet("student/{studentId}/has-active")]
    public async Task<IActionResult> HasActiveInternship(Guid studentId)
    {
        try
        {
            var hasActive = await _internshipService.StudentHasActiveInternshipAsync(studentId);
            return Ok(ApiResponse<bool>.Ok(hasActive));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }
}
