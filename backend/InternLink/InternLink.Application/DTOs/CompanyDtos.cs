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
