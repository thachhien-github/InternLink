namespace InternLink.Domain.Entities;

public class Company : BaseEntity
{
    public string CompanyName { get; set; } = null!;
    public string? Address { get; set; }
    public string? Website { get; set; }
    public string? Industry { get; set; }
    public string? ContactPerson { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public int? Capacity { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Internship> Internships { get; set; } = new List<Internship>();
}
