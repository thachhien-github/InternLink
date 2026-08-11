using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;

namespace InternLink.API.Controllers;

/// <summary>
/// API endpoints for student management (Lecturer access only)
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
    /// Get all students with pagination
    /// </summary>
    /// <param name="skip">Number of records to skip (default: 0)</param>
    /// <param name="take">Number of records to take (default: 100, max: 1000)</param>
    /// <returns>List of students</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllStudents([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            // Validate pagination parameters
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
    /// Get students with filtering
    /// </summary>
    /// <param name="request">Filter request with search, class, major, pagination</param>
    /// <returns>Paginated list of students</returns>
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
    /// Get a specific student by ID
    /// </summary>
    /// <param name="id">Student ID</param>
    /// <returns>Student details</returns>
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
    /// Get a student by student number
    /// </summary>
    /// <param name="studentCode">Student number</param>
    /// <returns>Student details</returns>
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
    /// Create a new student
    /// </summary>
    /// <param name="request">Student creation request</param>
    /// <returns>Created student</returns>
    [HttpPost]
    public async Task<IActionResult> CreateStudent([FromBody] CreateStudentRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

            var student = await _studentService.CreateStudentAsync(request);
            return CreatedAtAction(nameof(GetStudentById), new { id = student.Id }, ApiResponse<StudentDto>.Ok(student));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Update an existing student
    /// </summary>
    /// <param name="id">Student ID</param>
    /// <param name="request">Student update request</param>
    /// <returns>Updated student</returns>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(Guid id, [FromBody] UpdateStudentRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

            var student = await _studentService.UpdateStudentAsync(id, request);
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
    /// Delete a student
    /// </summary>
    /// <param name="id">Student ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(Guid id)
    {
        try
        {
            var result = await _studentService.DeleteStudentAsync(id);
            if (!result)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Student not found" }));

            return Ok(ApiResponse<object>.Ok(null));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Check if a student number already exists
    /// </summary>
    /// <param name="studentCode">Student number to check</param>
    /// <returns>Boolean indicating if student number exists</returns>
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

    /// <summary>
    /// Download Excel template for student import (MSSV, HoTen, Lop, Nganh, Email, SDT).
    /// </summary>
    [HttpGet("import/template")]
    public IActionResult DownloadImportTemplate()
    {
        var bytes = _studentService.GetStudentImportTemplate();
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "student-import-template.xlsx");
    }

    /// <summary>
    /// Import students from an Excel (.xlsx) file. Row 1 must be headers.
    /// Required columns: MSSV (or studentCode), HoTen (or FullName).
    /// Optional: Lop/Class, Nganh/Major, Email, SDT/Phone.
    /// </summary>
    [HttpPost("import")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> ImportStudents(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Excel file is required" }));

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (extension is not ".xlsx")
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Only .xlsx files are supported" }));

            await using var stream = file.OpenReadStream();
            var result = await _studentService.ImportStudentsFromExcelAsync(stream);
            return Ok(ApiResponse<StudentImportResultDto>.Ok(result));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }
}
