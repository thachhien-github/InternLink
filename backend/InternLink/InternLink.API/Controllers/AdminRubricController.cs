using InternLink.API.Extensions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternLink.API.Controllers;

/// <summary>
/// Admin controller for managing evaluation rubrics per semester.
/// Includes CRUD, submit for approval, approve/reject workflow.
/// </summary>
[ApiController]
[Route("api/Admin/semesters/{semesterId}/rubric")]
[Authorize(Policy = "RequireAdmin")]
public class AdminRubricController : ControllerBase
{
    private readonly IRubricService _rubricService;
    private readonly ILogger<AdminRubricController> _logger;

    public AdminRubricController(
        IRubricService rubricService,
        ILogger<AdminRubricController> logger)
    {
        _rubricService = rubricService;
        _logger = logger;
    }

    /// <summary>
    /// Get rubric for a semester
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(RubricDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RubricDto>> GetRubric(Guid semesterId)
    {
        try
        {
            var rubric = await _rubricService.GetBySemesterAsync(semesterId);
            if (rubric == null)
                return NotFound(new { message = "Chưa có rubric cho kỳ thực tập này." });

            return Ok(rubric);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving rubric for semester {SemesterId}", semesterId);
            return StatusCode(500, new { message = "Lỗi khi lấy rubric." });
        }
    }

    /// <summary>
    /// Create a new rubric for a semester
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(RubricDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RubricDto>> CreateRubric(Guid semesterId, [FromBody] CreateRubricRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "User ID not found in token." });

            var rubric = await _rubricService.CreateAsync(semesterId, request, userId.Value);
            return CreatedAtAction(nameof(GetRubric), new { semesterId }, rubric);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating rubric for semester {SemesterId}", semesterId);
            return StatusCode(500, new { message = "Lỗi khi tạo rubric." });
        }
    }

    /// <summary>
    /// Update rubric (only Draft or Rejected status)
    /// </summary>
    [HttpPut]
    [ProducesResponseType(typeof(RubricDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RubricDto>> UpdateRubric(Guid semesterId, [FromBody] UpdateRubricRequest request)
    {
        try
        {
            var existing = await _rubricService.GetBySemesterAsync(semesterId);
            if (existing == null)
                return NotFound(new { message = "Không tìm thấy rubric." });

            var rubric = await _rubricService.UpdateAsync(existing.Id, request);
            if (rubric == null)
                return NotFound(new { message = "Không tìm thấy rubric." });

            return Ok(rubric);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating rubric for semester {SemesterId}", semesterId);
            return StatusCode(500, new { message = "Lỗi khi cập nhật rubric." });
        }
    }

    /// <summary>
    /// Delete rubric (only Draft or Rejected status)
    /// </summary>
    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteRubric(Guid semesterId)
    {
        try
        {
            var existing = await _rubricService.GetBySemesterAsync(semesterId);
            if (existing == null)
                return NotFound(new { message = "Không tìm thấy rubric." });

            await _rubricService.DeleteAsync(existing.Id);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting rubric for semester {SemesterId}", semesterId);
            return StatusCode(500, new { message = "Lỗi khi xóa rubric." });
        }
    }

    /// <summary>
    /// Submit rubric for approval (Draft → PendingApproval)
    /// </summary>
    [HttpPost("submit")]
    [ProducesResponseType(typeof(RubricDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RubricDto>> SubmitForApproval(Guid semesterId, [FromBody] SubmitRubricRequest? request)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "User ID not found in token." });

            var existing = await _rubricService.GetBySemesterAsync(semesterId);
            if (existing == null)
                return NotFound(new { message = "Không tìm thấy rubric." });

            var rubric = await _rubricService.SubmitForApprovalAsync(existing.Id, userId.Value, request?.Note);
            if (rubric == null)
                return NotFound(new { message = "Không tìm thấy rubric." });

            return Ok(rubric);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting rubric for approval {SemesterId}", semesterId);
            return StatusCode(500, new { message = "Lỗi khi gửi duyệt rubric." });
        }
    }

    /// <summary>
    /// Approve rubric (PendingApproval → Approved). SuperAdmin acts as DepartmentHead.
    /// </summary>
    [HttpPost("approve")]
    [ProducesResponseType(typeof(RubricDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RubricDto>> ApproveRubric(Guid semesterId, [FromBody] ApproveRubricRequest? request)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "User ID not found in token." });

            var existing = await _rubricService.GetBySemesterAsync(semesterId);
            if (existing == null)
                return NotFound(new { message = "Không tìm thấy rubric." });

            var rubric = await _rubricService.ApproveAsync(existing.Id, userId.Value, request?.Note);
            if (rubric == null)
                return NotFound(new { message = "Không tìm thấy rubric." });

            return Ok(rubric);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error approving rubric {SemesterId}", semesterId);
            return StatusCode(500, new { message = "Lỗi khi phê duyệt rubric." });
        }
    }

    /// <summary>
    /// Reject rubric (PendingApproval → Rejected)
    /// </summary>
    [HttpPost("reject")]
    [ProducesResponseType(typeof(RubricDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RubricDto>> RejectRubric(Guid semesterId, [FromBody] RejectRubricRequest request)
    {
        try
        {
            var existing = await _rubricService.GetBySemesterAsync(semesterId);
            if (existing == null)
                return NotFound(new { message = "Không tìm thấy rubric." });

            var rubric = await _rubricService.RejectAsync(existing.Id, request.RejectionReason);
            if (rubric == null)
                return NotFound(new { message = "Không tìm thấy rubric." });

            return Ok(rubric);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error rejecting rubric {SemesterId}", semesterId);
            return StatusCode(500, new { message = "Lỗi khi từ chối rubric." });
        }
    }
}
