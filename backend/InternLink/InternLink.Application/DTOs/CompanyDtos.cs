namespace InternLink.Application.DTOs;

/// <summary>
/// DTO for creating a new company
/// </summary>
public class CreateCompanyRequest
{
    public string? CompanyCode { get; set; }
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
    public string? CompanyCode { get; set; }
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
    public string? CompanyCode { get; set; }
    public string CompanyName { get; set; } = null!;
    public string? Address { get; set; }
    public string? Website { get; set; }
    public string? Industry { get; set; }
    public string? ContactPerson { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public int? Capacity { get; set; }
    public bool IsActive { get; set; }
    /// <summary>Number of internships hosted by the company (optionally scoped to the selected semester).</summary>
    public int StudentCount { get; set; }
    /// <summary>
    /// Link status for the requested semester. Null when no semester context.
    /// False = "ngưng liên kết" for that term (hidden from new assignments).
    /// </summary>
    public bool? IsSemesterLinked { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>Request body for linking/unlinking a company in a semester.</summary>
public class SetSemesterLinkRequest
{
    public bool IsLinked { get; set; }
}

/// <summary>
/// Admin company detail (master data + internships hosted).
/// </summary>
public class AdminCompanyDetailDto
{
    public CompanyDto Company { get; set; } = null!;
    public IEnumerable<InternshipListItemDto> Internships { get; set; } = Array.Empty<InternshipListItemDto>();
}

/// <summary>
/// Result of importing companies from an Excel file.
/// </summary>
public class CompanyImportResultDto
{
    public int TotalRows { get; set; }
    public int SuccessCount { get; set; }
    public int CreatedCount { get; set; }
    public int UpdatedCount { get; set; }
    public int FailedCount { get; set; }
    public int SkippedDuplicateCount { get; set; }
    public IReadOnlyList<CompanyDto> CreatedCompanies { get; set; } = Array.Empty<CompanyDto>();
    public IReadOnlyList<CompanyDto> UpdatedCompanies { get; set; } = Array.Empty<CompanyDto>();
    public IReadOnlyList<CompanyImportErrorDto> Errors { get; set; } = Array.Empty<CompanyImportErrorDto>();
}

public class CompanyImportErrorDto
{
    public int RowNumber { get; set; }
    public string? CompanyCode { get; set; }
    public string? CompanyName { get; set; }
    public string Message { get; set; } = null!;
}
