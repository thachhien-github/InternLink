using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternLink.API.Controllers;

/// <summary>
/// Admin student master-data management (import, create accounts, invitation email).
/// </summary>
[ApiController]
[Route("api/Admin/students")]
[Authorize(Policy = "RequireAdmin")]
public class AdminStudentsController : ControllerBase
{
    private readonly IStudentService _studentService;

    public AdminStudentsController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        if (skip < 0)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Skip must be greater than or equal to 0" }));
        if (take < 1 || take > 1000)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Take must be between 1 and 1000" }));

        var students = await _studentService.GetAllStudentsAsync(skip, take);
        return Ok(ApiResponse<IEnumerable<StudentDto>>.Ok(students));
    }

    [HttpPost("search")]
    public async Task<IActionResult> Search([FromBody] StudentFilterRequest request)
    {
        if (request.Skip < 0)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Skip must be greater than or equal to 0" }));
        if (request.Take < 1 || request.Take > 1000)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Take must be between 1 and 1000" }));

        var result = await _studentService.GetStudentsWithFilterAsync(request);
        return Ok(ApiResponse<PaginatedResponse<StudentDto>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var student = await _studentService.GetStudentByIdAsync(id);
        if (student == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Student not found" }));

        return Ok(ApiResponse<StudentDto>.Ok(student));
    }

    [HttpGet("by-number/{studentCode}")]
    public async Task<IActionResult> GetByCode(string studentCode)
    {
        if (string.IsNullOrWhiteSpace(studentCode))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Student number is required" }));

        var student = await _studentService.GetStudentByCodeAsync(studentCode);
        if (student == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Student not found" }));

        return Ok(ApiResponse<StudentDto>.Ok(student));
    }

    [HttpGet("check/{studentCode}")]
    public async Task<IActionResult> CheckExists(string studentCode)
    {
        if (string.IsNullOrWhiteSpace(studentCode))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Student number is required" }));

        var exists = await _studentService.StudentCodeExistsAsync(studentCode);
        return Ok(ApiResponse<bool>.Ok(exists));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStudentRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

            var student = await _studentService.CreateStudentAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = student.Id }, ApiResponse<StudentDto>.Ok(student));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateStudentRequest request)
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
        catch (InvalidOperationException ex)
        {
            return Conflict(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var ok = await _studentService.DeleteStudentAsync(id);
            if (!ok)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Student not found" }));

            return Ok(ApiResponse<object>.Ok(null));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpGet("import/template")]
    public IActionResult DownloadImportTemplate()
    {
        var bytes = _studentService.GetStudentImportTemplate();
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "student-import-template.xlsx");
    }

    [HttpPost("import")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> Import(IFormFile file, [FromQuery] Guid? semesterId = null)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Excel file is required" }));

            if (!string.Equals(Path.GetExtension(file.FileName), ".xlsx", StringComparison.OrdinalIgnoreCase))
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Only .xlsx files are supported" }));

            await using var stream = file.OpenReadStream();
            var result = await _studentService.ImportStudentsFromExcelAsync(stream, semesterId);
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
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] Guid? semesterId = null)
    {
        var bytes = await _studentService.ExportStudentsExcelAsync(semesterId);
        var fileName = $"danh-sach-sinh-vien-{DateTime.UtcNow:yyyyMMdd-HHmmss}.xlsx";
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }
}
