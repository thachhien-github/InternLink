namespace InternLink.Domain.Entities;

public class Lecturer : BaseEntity
{
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    public string StaffCode { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Department { get; set; }

    public ICollection<Internship> Internships { get; set; } = new List<Internship>();
}
