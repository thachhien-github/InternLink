namespace InternLink.Domain.Entities;

public class Student : BaseEntity
{
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    public string StudentCode { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string? Class { get; set; }
    public string? Major { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }

    public Internship? Internship { get; set; }
}
