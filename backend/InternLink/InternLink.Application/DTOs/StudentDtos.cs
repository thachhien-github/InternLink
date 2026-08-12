namespace InternLink.Application.DTOs;

public class CreateStudentRequest
{
    public string StudentCode { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string? Class { get; set; }
    public string? Major { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public Guid? UserId { get; set; }
    /// <summary>
    /// Optional login username. When set, creates a Student user account (default password).
    /// </summary>
    public string? Username { get; set; }
}

public class UpdateStudentRequest
{
    public string FullName { get; set; } = null!;
    public string? Class { get; set; }
    public string? Major { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public Guid? UserId { get; set; }
}

public class StudentDto
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public string StudentCode { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string? Class { get; set; }
    public string? Major { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Result of importing students from an Excel file.
/// </summary>
public class StudentImportResultDto
{
    public int TotalRows { get; set; }
    public int SuccessCount { get; set; }
    public int FailedCount { get; set; }
    public int SkippedDuplicateCount { get; set; }
    public int EmailSentCount { get; set; }
    public int EmailFailedCount { get; set; }
    public string DefaultPassword { get; set; } = null!;
    public IReadOnlyList<StudentDto> CreatedStudents { get; set; } = Array.Empty<StudentDto>();
    public IReadOnlyList<StudentImportErrorDto> Errors { get; set; } = Array.Empty<StudentImportErrorDto>();
    public IReadOnlyList<StudentImportErrorDto> EmailErrors { get; set; } = Array.Empty<StudentImportErrorDto>();
}

public class StudentImportErrorDto
{
    public int RowNumber { get; set; }
    public string? StudentCode { get; set; }
    public string? Username { get; set; }
    public string Message { get; set; } = null!;
}
