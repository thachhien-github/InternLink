using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternLink.API.Extensions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;

namespace InternLink.API.Controllers;

/// <summary>
/// Centralized portal API for Lecturers.
/// All lecturer interactions (profile, students, companies, internships, weekly reports, evaluations, documents, exports)
/// are routed through this controller.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireLecturerOrAdmin")]
public class LecturerController : ControllerBase
{
    private readonly ILecturerService _lecturerService;
    private readonly IEvaluationService _evaluationService;
    private readonly IWeeklyReportService _weeklyReportService;
    private readonly IDocumentService _documentService;
    private readonly ILecturerAccessService _lecturerAccessService;
    private readonly IPdfExportService _pdfExportService;
    private readonly ILogger<LecturerController> _logger;

    public LecturerController(
        ILecturerService lecturerService,
        IEvaluationService evaluationService,
        IWeeklyReportService weeklyReportService,
        IDocumentService documentService,
        ILecturerAccessService lecturerAccessService,
        IPdfExportService pdfExportService,
        ILogger<LecturerController> logger)
    {
        _lecturerService = lecturerService;
        _evaluationService = evaluationService;
        _weeklyReportService = weeklyReportService;
        _documentService = documentService;
        _lecturerAccessService = lecturerAccessService;
        _pdfExportService = pdfExportService;
        _logger = logger;
    }

    private async Task<(bool isLecturer, Guid? lecturerId)> ResolveLecturerScopeAsync()
    {
        if (User.IsSuperAdmin())
            return (false, null);

        var userId = User.GetUserId();
        if (userId == null)
            return (true, Guid.Empty);

        var lecturerId = await _lecturerAccessService.ResolveLecturerIdAsync(userId.Value);
        return (true, lecturerId ?? Guid.Empty);
    }

    // ==========================================
    // 1. PROFILE & DASHBOARD
    // ==========================================

    /// <summary>
    /// Get current lecturer profile and assigned overview
    /// </summary>
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var me = await _lecturerService.GetMeAsync(userId.Value);
        if (me == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Lecturer profile not found" }));

        return Ok(ApiResponse<LecturerOverviewDto>.Ok(me));
    }

    /// <summary>
    /// Get dashboard statistics for current lecturer
    /// </summary>
    [HttpGet("dashboard")]
    [HttpGet("stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var stats = await _lecturerService.GetDashboardStatsAsync(userId.Value);
        return Ok(ApiResponse<LecturerDashboardStatsDto>.Ok(stats));
    }

    // ==========================================
    // 2. ASSIGNED STUDENTS & COMPANIES
    // ==========================================

    /// <summary>
    /// Get all students assigned to the current lecturer
    /// </summary>
    [HttpGet("students")]
    public async Task<IActionResult> GetStudents([FromQuery] string? search = null, [FromQuery] string? status = null)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var students = await _lecturerService.GetAssignedStudentsAsync(userId.Value, search, status);
        return Ok(ApiResponse<IEnumerable<LecturerStudentListItemDto>>.Ok(students));
    }

    /// <summary>
    /// Get companies of assigned students
    /// </summary>
    [HttpGet("companies")]
    public async Task<IActionResult> GetCompanies()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var companies = await _lecturerService.GetAssignedCompaniesAsync(userId.Value);
        return Ok(ApiResponse<IEnumerable<LecturerCompanySummaryDto>>.Ok(companies));
    }

    // ==========================================
    // 3. INTERNSHIPS & SUBMISSIONS
    // ==========================================

    /// <summary>
    /// Get all active internships assigned to current lecturer
    /// </summary>
    [HttpGet("internships")]
    public async Task<IActionResult> GetInternships()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var internships = await _lecturerService.GetInternshipsAsync(userId.Value);
        return Ok(ApiResponse<IEnumerable<InternshipDto>>.Ok(internships));
    }

    /// <summary>
    /// Get specific internship detail
    /// </summary>
    [HttpGet("internships/{id:guid}")]
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

    /// <summary>
    /// Get submissions for an assigned internship
    /// </summary>
    [HttpGet("internships/{id:guid}/submissions")]
    public async Task<IActionResult> GetSubmissions(Guid id)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var submissions = await _lecturerService.GetSubmissionsByInternshipAsync(id, userId.Value);
        return Ok(ApiResponse<IEnumerable<SubmissionDto>>.Ok(submissions));
    }

    /// <summary>
    /// Give feedback on a submission
    /// </summary>
    [HttpPost("submissions/{id:guid}/feedback")]
    public async Task<IActionResult> AddFeedback(Guid id, [FromBody] CreateFeedbackRequest request)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var feedback = await _lecturerService.AddFeedbackAsync(id, userId.Value, request);
            if (feedback == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Submission not found" }));

            return Ok(ApiResponse<FeedbackDto>.Ok(feedback));
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

    // ==========================================
    // 4. WEEKLY REPORTS
    // ==========================================

    /// <summary>
    /// Get weekly reports for assigned internship
    /// </summary>
    [HttpGet("weekly-reports")]
    public async Task<IActionResult> GetWeeklyReports([FromQuery] Guid? internshipId = null)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        if (internshipId.HasValue)
        {
            try
            {
                var reports = await _weeklyReportService.GetByInternshipAsync(internshipId.Value, userId.Value, isLecturerOrAdmin: true);
                return Ok(ApiResponse<IEnumerable<WeeklyReportDto>>.Ok(reports));
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        // Return empty or fetch for all assigned internships
        return Ok(ApiResponse<IEnumerable<WeeklyReportDto>>.Ok(Array.Empty<WeeklyReportDto>()));
    }

    /// <summary>
    /// Get weekly report detail
    /// </summary>
    [HttpGet("weekly-reports/{id:guid}")]
    public async Task<IActionResult> GetWeeklyReportById(Guid id)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var report = await _weeklyReportService.GetByIdAsync(id, userId.Value, isLecturerOrAdmin: true);
            if (report == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Weekly report not found" }));

            return Ok(ApiResponse<WeeklyReportDto>.Ok(report));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    /// <summary>
    /// Review weekly report
    /// </summary>
    [HttpPost("weekly-reports/{id:guid}/review")]
    public async Task<IActionResult> ReviewWeeklyReport(Guid id, [FromBody] ReviewWeeklyReportRequest request)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
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
    }

    // ==========================================
    // 5. EVALUATIONS
    // ==========================================

    /// <summary>
    /// Get evaluations of assigned students
    /// </summary>
    [HttpGet("evaluations")]
    public async Task<IActionResult> GetEvaluations([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        var (isLecturer, lecturerId) = await ResolveLecturerScopeAsync();
        if (isLecturer && lecturerId == Guid.Empty)
            return Ok(ApiResponse<IEnumerable<EvaluationListItemDto>>.Ok(Array.Empty<EvaluationListItemDto>()));

        var evaluations = await _evaluationService.GetAllEvaluationsAsync(skip, take, lecturerId);
        return Ok(ApiResponse<IEnumerable<EvaluationListItemDto>>.Ok(evaluations));
    }

    /// <summary>
    /// Get evaluation by internship ID
    /// </summary>
    [HttpGet("evaluations/internship/{internshipId:guid}")]
    public async Task<IActionResult> GetEvaluationByInternship(Guid internshipId)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var eval = await _evaluationService.GetEvaluationByInternshipAsync(internshipId, userId.Value, isLecturerOrAdmin: true);
            if (eval == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Evaluation not found" }));

            return Ok(ApiResponse<EvaluationDetailDto>.Ok(eval));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    /// <summary>
    /// Create evaluation for assigned student
    /// </summary>
    [HttpPost("evaluations")]
    public async Task<IActionResult> CreateEvaluation([FromBody] CreateEvaluationRequest request)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var evaluation = await _evaluationService.CreateEvaluationAsync(request, userId.Value);
            return Ok(ApiResponse<EvaluationDetailDto>.Ok(evaluation));
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

    /// <summary>
    /// Update evaluation for assigned student
    /// </summary>
    [HttpPut("evaluations/{id:guid}")]
    public async Task<IActionResult> UpdateEvaluation(Guid id, [FromBody] UpdateEvaluationRequest request)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var evaluation = await _evaluationService.UpdateEvaluationAsync(id, request, userId.Value);
            if (evaluation == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Evaluation not found" }));

            return Ok(ApiResponse<EvaluationDetailDto>.Ok(evaluation));
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

    /// <summary>
    /// Finalize evaluation
    /// </summary>
    [HttpPost("evaluations/{id:guid}/finalize")]
    public async Task<IActionResult> FinalizeEvaluation(Guid id)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var evaluation = await _evaluationService.FinalizeEvaluationAsync(id, userId.Value);
            if (evaluation == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Evaluation not found" }));

            return Ok(ApiResponse<EvaluationDetailDto>.Ok(evaluation));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    // ==========================================
    // 6. DOCUMENTS
    // ==========================================

    /// <summary>
    /// Get documents for assigned internships
    /// </summary>
    [HttpGet("documents")]
    public async Task<IActionResult> GetDocuments([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var documents = await _documentService.GetAllDocumentsAsync(skip, take, userId.Value, isLecturerOrAdmin: true);
        return Ok(ApiResponse<IEnumerable<DocumentListItemDto>>.Ok(documents));
    }

    /// <summary>
    /// Upload document for assigned internship
    /// </summary>
    [HttpPost("documents/upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadDocument([FromForm] UploadDocumentFormRequest form)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        if (form.File == null || form.File.Length == 0)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "File is required" }));

        var createRequest = new CreateDocumentRequest
        {
            InternshipId = form.InternshipId,
            Title = form.Title,
            Description = form.Description,
            Category = form.Category,
            IsRequired = form.IsRequired
        };

        try
        {
            await using var stream = form.File.OpenReadStream();
            var document = await _documentService.UploadDocumentAsync(createRequest, stream, form.File.FileName, userId.Value);
            return Ok(ApiResponse<DocumentDetailDto>.Ok(document));
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

    /// <summary>
    /// Download document
    /// </summary>
    [HttpGet("documents/{id:guid}/download")]
    public async Task<IActionResult> DownloadDocument(Guid id)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var document = await _documentService.DownloadDocumentAsync(id, userId.Value, isLecturerOrAdmin: true);
            if (document == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

            return File(document.FileContent, document.MimeType, document.FileName);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    // ==========================================
    // 7. EXPORT
    // ==========================================

    /// <summary>
    /// Export end-of-term summary for all internships assigned to the current lecturer (Excel format).
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

    /// <summary>
    /// Export end-of-term summary for all internships assigned to the current lecturer (Server-side PDF format).
    /// </summary>
    [HttpGet("export/end-of-term/pdf")]
    public async Task<IActionResult> ExportEndOfTermPdf()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var pdfBytes = await _pdfExportService.GenerateLecturerSummaryPdfAsync(userId.Value);
            var fileName = $"bang-tong-hop-cuoi-ky-{DateTime.UtcNow:yyyyMMdd-HHmmss}.pdf";
            return File(pdfBytes, "application/pdf", fileName);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    /// <summary>
    /// Export official internship evaluation sheet PDF for an individual student.
    /// </summary>
    [HttpGet("export/evaluation/{internshipId:guid}/pdf")]
    public async Task<IActionResult> ExportStudentEvaluationPdf(Guid internshipId)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var pdfBytes = await _pdfExportService.GenerateStudentEvaluationPdfAsync(internshipId, userId.Value);
            var fileName = $"phieu-danh-gia-thuc-tap-{internshipId.ToString()[..8]}.pdf";
            return File(pdfBytes, "application/pdf", fileName);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }
}

