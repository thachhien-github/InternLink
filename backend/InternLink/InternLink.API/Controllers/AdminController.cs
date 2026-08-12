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

    public AdminController(IEmailService emailService)
    {
        _emailService = emailService;
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
