using System;
using System.Threading.Tasks;
using InternLink.Application.DTOs;
using InternLink.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternLink.API.Controllers;

/// <summary>
/// Admin system & faculty settings management.
/// </summary>
[ApiController]
[Route("api/Admin/settings")]
[Authorize(Policy = "RequireAdmin")]
public class AdminSettingsController : ControllerBase
{
    private static AdminSettingsDto _currentSettings = new AdminSettingsDto();
    private static readonly object _lock = new object();

    [HttpGet]
    public IActionResult GetSettings()
    {
        lock (_lock)
        {
            return Ok(ApiResponse<AdminSettingsDto>.Ok(_currentSettings));
        }
    }

    [HttpPut]
    public IActionResult UpdateSettings([FromBody] UpdateAdminSettingsRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.DepartmentName))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Tên Khoa / Đơn vị quản lý không được để trống" }));

        if (string.IsNullOrWhiteSpace(request.SupportEmail))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Email hỗ trợ không được để trống" }));

        lock (_lock)
        {
            _currentSettings = new AdminSettingsDto
            {
                DepartmentName = request.DepartmentName.Trim(),
                SupportEmail = request.SupportEmail.Trim(),
                Phone = request.Phone?.Trim() ?? string.Empty,
                Address = request.Address?.Trim() ?? string.Empty,
                MaxStudentsPerLecturer = request.MaxStudentsPerLecturer > 0 ? request.MaxStudentsPerLecturer : 30,
                DefaultReportDeadlineDay = string.IsNullOrWhiteSpace(request.DefaultReportDeadlineDay) ? "Chủ Nhật (23:59)" : request.DefaultReportDeadlineDay.Trim(),
                MaxFileSizeMb = request.MaxFileSizeMb > 0 ? request.MaxFileSizeMb : 25,
                AllowLateSubmission = request.AllowLateSubmission,
                AutoLockSemesterEnd = request.AutoLockSemesterEnd,
                LastUpdatedAt = DateTime.UtcNow
            };

            return Ok(ApiResponse<AdminSettingsDto>.Ok(_currentSettings));
        }
    }

    [HttpPost("reset")]
    public IActionResult ResetSettings()
    {
        lock (_lock)
        {
            _currentSettings = new AdminSettingsDto();
            return Ok(ApiResponse<AdminSettingsDto>.Ok(_currentSettings));
        }
    }
}
