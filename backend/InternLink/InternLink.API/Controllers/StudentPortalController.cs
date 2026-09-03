using InternLink.API.Extensions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireStudent")]
public class StudentPortalController : ControllerBase
{
    private readonly IStudentService _studentService;
    private readonly IPdfExportService _pdfExportService;

    public StudentPortalController(IStudentService studentService, IPdfExportService pdfExportService)
    {
        _studentService = studentService;
        _pdfExportService = pdfExportService;
    }

    /// <summary>
    /// Current student's profile and active internship.
    /// </summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var profile = await _studentService.GetPortalProfileByUserIdAsync(userId.Value);
        if (profile == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Student profile not found" }));

        return Ok(ApiResponse<StudentPortalProfileDto>.Ok(profile));
    }

    /// <summary>
    /// Download internship certificate/evaluation sheet as PDF.
    /// </summary>
    [HttpGet("internship-certificate")]
    public async Task<IActionResult> DownloadCertificate()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var profile = await _studentService.GetPortalProfileByUserIdAsync(userId.Value);
        if (profile?.Internship == null)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Ch\u00F4ng c\xF3 th\xF4ng tin th\u1EF1c t\u1EADp." }));

        try
        {
            var pdfBytes = await _pdfExportService.GenerateStudentEvaluationPdfAsync(
                profile.Internship.Id, userId.Value);
            var fileName = $"Phieu-Thuc-Tap-{profile.Student.StudentCode}.pdf";
            return File(pdfBytes, "application/pdf", fileName);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }
}
