namespace InternLink.Application.DTOs;

/// <summary>
/// DTO for creating a new company
/// </summary>
public class CreateCompanyRequest
{
    public string CompanyName { get; set; } = null!;
    public string? Address { get; set; }
    public string? Website { get; set; }
    public string? Industry { get; set; }
    public string? ContactPerson { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public int? Capacity { get; set; }
}

/// <summary>
/// DTO for updating an existing company
/// </summary>
public class UpdateCompanyRequest
{
    public string CompanyName { get; set; } = null!;
    public string? Address { get; set; }
    public string? Website { get; set; }
    public string? Industry { get; set; }
    public string? ContactPerson { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public int? Capacity { get; set; }
    public bool? IsActive { get; set; }
}

/// <summary>
/// DTO for retrieving company details (with full information)
/// </summary>
public class CompanyDto
{
    public Guid Id { get; set; }
    public string CompanyName { get; set; } = null!;
    public string? Address { get; set; }
    public string? Website { get; set; }
    public string? Industry { get; set; }
    public string? ContactPerson { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public int? Capacity { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// Result of importing companies from an Excel file.
/// </summary>
public class CompanyImportResultDto
{
    public int TotalRows { get; set; }
    public int SuccessCount { get; set; }
    public int FailedCount { get; set; }
    public int SkippedDuplicateCount { get; set; }
    public IReadOnlyList<CompanyDto> CreatedCompanies { get; set; } = Array.Empty<CompanyDto>();
    public IReadOnlyList<CompanyImportErrorDto> Errors { get; set; } = Array.Empty<CompanyImportErrorDto>();
}

public class CompanyImportErrorDto
{
    public int RowNumber { get; set; }
    public string? CompanyName { get; set; }
    public string Message { get; set; } = null!;
}
