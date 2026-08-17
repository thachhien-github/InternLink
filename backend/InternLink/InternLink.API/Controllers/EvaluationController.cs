using InternLink.API.Extensions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InternLink.API.Controllers;

/// <summary>
/// Controller for managing student evaluations and grading
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EvaluationController : ControllerBase
{
    private readonly IEvaluationService _evaluationService;
    private readonly ILogger<EvaluationController> _logger;

    public EvaluationController(IEvaluationService evaluationService, ILogger<EvaluationController> logger)
    {
        _evaluationService = evaluationService;
        _logger = logger;
    }

    /// <summary>
    /// Get all evaluations with pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<EvaluationListItemDto>), StatusCodes.Status200OK)]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<ActionResult<IEnumerable<EvaluationListItemDto>>> GetAllEvaluations([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            var evaluations = await _evaluationService.GetAllEvaluationsAsync(skip, take);
            return Ok(evaluations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving evaluations");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving evaluations" });
        }
    }

    /// <summary>
    /// Get evaluations with filtering and sorting
    /// </summary>
    [HttpPost("filter")]
    [ProducesResponseType(typeof(PaginatedResponse<EvaluationListItemDto>), StatusCodes.Status200OK)]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<ActionResult<PaginatedResponse<EvaluationListItemDto>>> GetEvaluationsWithFilter([FromBody] EvaluationFilterRequest filter)
    {
        try
        {
            var result = await _evaluationService.GetEvaluationsWithFilterAsync(filter);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error filtering evaluations");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error filtering evaluations" });
        }
    }

    /// <summary>
    /// Get evaluation details by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(EvaluationDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EvaluationDetailDto>> GetEvaluationById(Guid id)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "Unauthorized" });

            var isLecturerOrAdmin = User.IsInRole("Lecturer") || User.IsInRole("SuperAdmin");
            var evaluation = await _evaluationService.GetEvaluationByIdAsync(id, userId.Value, isLecturerOrAdmin);
            if (evaluation == null)
                return NotFound(new { message = "Evaluation not found" });

            return Ok(evaluation);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving evaluation {EvaluationId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving evaluation" });
        }
    }

    /// <summary>
    /// Get evaluation for a specific internship
    /// </summary>
    [HttpGet("internship/{internshipId}")]
    [ProducesResponseType(typeof(EvaluationDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<EvaluationDetailDto>> GetEvaluationByInternship(Guid internshipId)
    {
        try
        {
            var evaluation = await _evaluationService.GetEvaluationByInternshipAsync(internshipId);
            if (evaluation == null)
                return NotFound(new { message = "Evaluation not found for this internship" });

            return Ok(evaluation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving evaluation for internship {InternshipId}", internshipId);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving evaluation" });
        }
    }

    /// <summary>
    /// Get evaluations for a specific student
    /// </summary>
    [HttpGet("student/{studentId}")]
    [ProducesResponseType(typeof(IEnumerable<EvaluationListItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<EvaluationListItemDto>>> GetEvaluationsByStudent(Guid studentId, [FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            var evaluations = await _evaluationService.GetEvaluationsByStudentAsync(studentId, skip, take);
            return Ok(evaluations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving evaluations for student {StudentId}", studentId);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving evaluations" });
        }
    }

    /// <summary>
    /// Get evaluations for a specific company
    /// </summary>
    [HttpGet("company/{companyId}")]
    [ProducesResponseType(typeof(IEnumerable<EvaluationListItemDto>), StatusCodes.Status200OK)]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<ActionResult<IEnumerable<EvaluationListItemDto>>> GetEvaluationsByCompany(Guid companyId, [FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            var evaluations = await _evaluationService.GetEvaluationsByCompanyAsync(companyId, skip, take);
            return Ok(evaluations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving evaluations for company {CompanyId}", companyId);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error retrieving evaluations" });
        }
    }

    /// <summary>
    /// Create a new evaluation
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(EvaluationDetailDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<ActionResult<EvaluationDetailDto>> CreateEvaluation([FromBody] CreateEvaluationRequest request)
    {
        try
        {
            // Get current user ID
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User ID not found in token" });

            var evaluation = await _evaluationService.CreateEvaluationAsync(request, Guid.Parse(userId));
            return CreatedAtAction(nameof(GetEvaluationById), new { id = evaluation.Id }, evaluation);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation during evaluation creation");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating evaluation");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error creating evaluation" });
        }
    }

    /// <summary>
    /// Update an evaluation (only for draft evaluations)
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(EvaluationDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<ActionResult<EvaluationDetailDto>> UpdateEvaluation(Guid id, [FromBody] UpdateEvaluationRequest request)
    {
        try
        {
            var evaluation = await _evaluationService.UpdateEvaluationAsync(id, request);
            if (evaluation == null)
                return NotFound(new { message = "Evaluation not found" });

            return Ok(evaluation);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation during evaluation update");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating evaluation {EvaluationId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error updating evaluation" });
        }
    }

    /// <summary>
    /// Finalize an evaluation (marks it as complete)
    /// </summary>
    [HttpPost("{id}/finalize")]
    [ProducesResponseType(typeof(EvaluationDetailDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<ActionResult<EvaluationDetailDto>> FinalizeEvaluation(Guid id)
    {
        try
        {
            var evaluation = await _evaluationService.FinalizeEvaluationAsync(id);
            if (evaluation == null)
                return NotFound(new { message = "Evaluation not found" });

            return Ok(evaluation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error finalizing evaluation {EvaluationId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error finalizing evaluation" });
        }
    }

    /// <summary>
    /// Delete an evaluation (only for draft evaluations)
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<IActionResult> DeleteEvaluation(Guid id)
    {
        try
        {
            var result = await _evaluationService.DeleteEvaluationAsync(id);
            if (!result)
                return NotFound(new { message = "Evaluation not found" });

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation during evaluation deletion");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting evaluation {EvaluationId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error deleting evaluation" });
        }
    }

    /// <summary>
    /// Get average grade for a company
    /// </summary>
    [HttpGet("company/{companyId}/average-grade")]
    [ProducesResponseType(typeof(decimal), StatusCodes.Status200OK)]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<ActionResult<decimal>> GetAverageGradeByCompany(Guid companyId)
    {
        try
        {
            var average = await _evaluationService.GetAverageGradeByCompanyAsync(companyId);
            return Ok(average);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting average grade for company {CompanyId}", companyId);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error getting average grade" });
        }
    }

    /// <summary>
    /// Check if evaluation exists for an internship
    /// </summary>
    [HttpGet("internship/{internshipId}/exists")]
    [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
    public async Task<ActionResult<bool>> HasEvaluation(Guid internshipId)
    {
        try
        {
            var hasEvaluation = await _evaluationService.HasEvaluationAsync(internshipId);
            return Ok(hasEvaluation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking evaluation for internship {InternshipId}", internshipId);
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error checking evaluation" });
        }
    }

    /// <summary>
    /// Get evaluation statistics (finalized count, draft count, distribution)
    /// </summary>
    [HttpGet("statistics/summary")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<ActionResult<object>> GetEvaluationStatistics()
    {
        try
        {
            var finalizedCount = await _evaluationService.GetFinalizedEvaluationCountAsync();
            var draftCount = await _evaluationService.GetDraftEvaluationCountAsync();
            var distribution = await _evaluationService.GetEvaluationDistributionAsync();

            return Ok(new
            {
                FinalizedCount = finalizedCount,
                DraftCount = draftCount,
                TotalCount = finalizedCount + draftCount,
                Distribution = distribution
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting evaluation statistics");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error getting statistics" });
        }
    }
}
