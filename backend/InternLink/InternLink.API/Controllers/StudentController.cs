using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;

namespace InternLink.API.Controllers;

/// <summary>
/// Read-only student lookup for Lecturers.
/// Master-data write/import moved to <see cref="AdminStudentsController"/> (/api/Admin/students).
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireLecturer")]
public class StudentController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    /// <summary>
    /// Get all students with pagination (read-only for Lecturer).
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllStudents([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            if (skip < 0)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Skip must be greater than or equal to 0" }));

            if (take < 1 || take > 1000)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Take must be between 1 and 1000" }));

            var students = await _studentService.GetAllStudentsAsync(skip, take);
            return Ok(ApiResponse<IEnumerable<StudentDto>>.Ok(students));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Get students with filtering (read-only for Lecturer).
    /// </summary>
    [HttpPost("search")]
    public async Task<IActionResult> SearchStudents([FromBody] StudentFilterRequest request)
    {
        try
        {
            if (request.Skip < 0)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Skip must be greater than or equal to 0" }));

            if (request.Take < 1 || request.Take > 1000)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Take must be between 1 and 1000" }));

            var result = await _studentService.GetStudentsWithFilterAsync(request);
            return Ok(ApiResponse<PaginatedResponse<StudentDto>>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Get a specific student by ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetStudentById(Guid id)
    {
        try
        {
            var student = await _studentService.GetStudentByIdAsync(id);
            if (student == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Student not found" }));

            return Ok(ApiResponse<StudentDto>.Ok(student));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Get a student by student code (MSSV).
    /// </summary>
    [HttpGet("by-number/{studentCode}")]
    public async Task<IActionResult> GetStudentByNumber(string studentCode)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(studentCode))
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Student number is required" }));

            var student = await _studentService.GetStudentByCodeAsync(studentCode);
            if (student == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Student not found" }));

            return Ok(ApiResponse<StudentDto>.Ok(student));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Check if a student number already exists.
    /// </summary>
    [HttpGet("check/{studentCode}")]
    public async Task<IActionResult> CheckStudentNumberExists(string studentCode)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(studentCode))
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Student number is required" }));

            var exists = await _studentService.StudentCodeExistsAsync(studentCode);
            return Ok(ApiResponse<bool>.Ok(exists));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }
}
