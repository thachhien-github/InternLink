using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternLink.API.Controllers;

/// <summary>
/// Admin semester management (terms, lifecycle, closing/archiving).
/// </summary>
[ApiController]
[Route("api/Admin/semesters")]
[Authorize(Policy = "RequireAdmin")]
public class AdminSemestersController : ControllerBase
{
    private readonly ISemesterService _semesterService;

    public AdminSemestersController(ISemesterService semesterService)
    {
        _semesterService = semesterService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var semesters = await _semesterService.GetAllSemestersAsync();
        return Ok(ApiResponse<IEnumerable<SemesterDto>>.Ok(semesters));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var semester = await _semesterService.GetSemesterByIdAsync(id);
        if (semester == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Semester not found" }));

        return Ok(ApiResponse<SemesterDto>.Ok(semester));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSemesterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Name is required" }));

        if (string.IsNullOrWhiteSpace(dto.Term))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Term is required" }));

        if (string.IsNullOrWhiteSpace(dto.AcademicYear))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "AcademicYear is required" }));

        var created = await _semesterService.CreateSemesterAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, ApiResponse<SemesterDto>.Ok(created));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSemesterDto dto)
    {
        var updated = await _semesterService.UpdateSemesterAsync(id, dto);
        if (updated == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Semester not found" }));

        return Ok(ApiResponse<SemesterDto>.Ok(updated));
    }

    [HttpPost("{id:guid}/close")]
    public async Task<IActionResult> Close(Guid id)
    {
        var success = await _semesterService.CloseSemesterAsync(id);
        if (!success)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Semester not found" }));

        return Ok(ApiResponse<object>.Ok(new { message = "Semester closed and student accounts archived successfully" }));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _semesterService.DeleteSemesterAsync(id);
        if (!success)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Semester not found" }));

        return Ok(ApiResponse<object>.Ok(new { message = "Semester deleted successfully" }));
    }
}
