using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternLink.API.Controllers;

/// <summary>
/// Dedicated controller for exporting production Excel and summary reports.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireLecturerOrAdmin")]
public class ExportController : ControllerBase
{
    private readonly IExcelExportService _excelExportService;
    private readonly IInternshipReportService _reportService;
    private readonly ILogger<ExportController> _logger;

    public ExportController(
        IExcelExportService excelExportService,
        IInternshipReportService reportService,
        ILogger<ExportController> logger)
    {
        _excelExportService = excelExportService;
        _reportService = reportService;
        _logger = logger;
    }

    /// <summary>
    /// Exports the full multi-sheet internship Excel report based on the institutional C23 template
    /// (Sheets: DANH SÁCH THỰC TẬP, DANH SÁCH DOANH NGHIỆP, DANH SÁCH GIẢNG VIÊN PHÂN CÔNG).
    /// </summary>
    [HttpGet("internship-excel")]
    public async Task<IActionResult> ExportInternshipExcel([FromQuery] Guid? semesterId = null, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Admin/Lecturer initiated Excel export for semester: {SemesterId}", semesterId);
            var fileBytes = await _excelExportService.GenerateInternshipExportExcelAsync(semesterId, cancellationToken);
            var fileName = $"Danh-sach-thuc-tap-{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate Excel export");
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError
            {
                Title = "Lỗi khi xuất file Excel",
                Detail = ex.Message
            }));
        }
    }

    /// <summary>
    /// Exports the official academic summary report (C22A template) for the faculty.
    /// </summary>
    [HttpGet("summary-report")]
    public async Task<IActionResult> ExportSummaryReport([FromQuery] Guid? semesterId = null)
    {
        try
        {
            _logger.LogInformation("Admin initiated summary report export for semester: {SemesterId}", semesterId);
            var fileBytes = await _reportService.ExportC22ASummaryReportAsync(semesterId);
            var fileName = $"Bao-cao-tong-ket-thuc-tap-{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate summary report");
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError
            {
                Title = "Lỗi khi xuất báo cáo tổng kết",
                Detail = ex.Message
            }));
        }
    }

    /// <summary>
    /// Exports the official academic summary report as a Word (.docx) file
    /// based on the C22A template with dynamic data from the database.
    /// </summary>
    [HttpGet("summary-report/word")]
    public async Task<IActionResult> ExportSummaryReportWord([FromQuery] Guid? semesterId = null)
    {
        try
        {
            _logger.LogInformation("Admin initiated Word summary report export for semester: {SemesterId}", semesterId);
            var fileBytes = await _reportService.ExportC22AWordReportAsync(semesterId);
            var fileName = $"Bao-cao-tong-ket-thuc-tap-{DateTime.Now:yyyyMMdd_HHmmss}.docx";

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                fileName);
        }
        catch (FileNotFoundException ex)
        {
            _logger.LogError(ex, "Word template not found");
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError
            {
                Title = "Không tìm thấy mẫu Word",
                Detail = ex.Message
            }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate Word summary report");
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError
            {
                Title = "Lỗi khi xuất báo cáo tổng kết Word",
                Detail = ex.Message
            }));
        }
    }
}
