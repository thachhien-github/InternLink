using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternLink.API.Controllers;

/// <summary>
/// Admin module endpoints (SuperAdmin only). Extended in later phases.
/// </summary>
[ApiController]
[Route("api/Admin")]
[Authorize(Policy = "RequireAdmin")]
public class AdminController : ControllerBase
{
    private readonly IEmailService _emailService;
    private readonly IInternshipService _internshipService;

    public AdminController(IEmailService emailService, IInternshipService internshipService)
    {
        _emailService = emailService;
        _internshipService = internshipService;
    }

    /// <summary>
    /// Internship status counts for admin dashboard KPIs and charts.
    /// </summary>
    [HttpGet("internship-stats")]
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
    /// Send a sample invitation email (for SMTP / LoggingEmailService verification).
    /// </summary>
    [HttpPost("email/test")]
    public async Task<IActionResult> TestEmail([FromBody] TestEmailRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

        var invitation = new InvitationEmailRequest
        {
            ToEmail = request.ToEmail.Trim(),
            FullName = string.IsNullOrWhiteSpace(request.FullName) ? "Người nhận thử" : request.FullName.Trim(),
            Role = request.Role,
            Username = "demo.user",
            TemporaryPassword = "TempPass123!"
        };

        var result = await _emailService.SendInvitationAsync(invitation, cancellationToken);
        if (!result.Success)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = result.Message ?? "Failed to send email" }));

        return Ok(ApiResponse<SendEmailResult>.Ok(result));
    }
}
