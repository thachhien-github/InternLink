using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

/// <summary>
/// Service interface for Student management operations
/// </summary>
public interface IStudentService
{
    /// <summary>
    /// Get all students with optional pagination
    /// </summary>
    Task<IEnumerable<StudentDto>> GetAllStudentsAsync(int skip = 0, int take = 100, Guid? lecturerId = null);

    /// <summary>
    /// Get students with filtering and pagination
    /// </summary>
    Task<PaginatedResponse<StudentDto>> GetStudentsWithFilterAsync(StudentFilterRequest filter, Guid? lecturerId = null);

    /// <summary>
    /// Get a student by ID
    /// </summary>
    Task<StudentDto?> GetStudentByIdAsync(Guid id, Guid? lecturerId = null);

    /// <summary>
    /// Get a student by student number
    /// </summary>
    Task<StudentDto?> GetStudentByCodeAsync(string studentCode, Guid? lecturerId = null);

    /// <summary>
    /// Get a student profile linked to a login user
    /// </summary>
    Task<StudentDto?> GetStudentByUserIdAsync(Guid userId);

    /// <summary>
    /// Student portal: profile + active internship for the logged-in student.
    /// </summary>
    Task<StudentPortalProfileDto?> GetPortalProfileByUserIdAsync(Guid userId);

    /// <summary>
    /// Create a new student
    /// </summary>
    Task<StudentDto> CreateStudentAsync(CreateStudentRequest request);

    /// <summary>
    /// Update an existing student
    /// </summary>
    Task<StudentDto?> UpdateStudentAsync(Guid id, UpdateStudentRequest request);

    /// <summary>
    /// Delete a student by ID
    /// </summary>
    Task<bool> DeleteStudentAsync(Guid id);

    /// <summary>
    /// Check if student number already exists
    /// </summary>
    Task<bool> StudentCodeExistsAsync(string studentCode, Guid? excludeId = null);

    /// <summary>
    /// Import students from an Excel (.xlsx) stream. Row 1 = headers.
    /// </summary>
    Task<StudentImportResultDto> ImportStudentsFromExcelAsync(Stream excelStream, Guid? semesterId = null);

    /// <summary>
    /// Build a blank Excel template for student import.
    /// </summary>
    byte[] GetStudentImportTemplate();
}
