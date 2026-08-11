using InternLink.Domain.Enums;

namespace InternLink.Domain.Entities;

public class Internship : BaseEntity
{
    public Guid StudentId { get; set; }
    public Student Student { get; set; } = null!;

    public Guid CompanyId { get; set; }
    public Company Company { get; set; } = null!;

    public Guid? LecturerId { get; set; }
    public Lecturer? Lecturer { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public InternshipStatus Status { get; set; } = InternshipStatus.NotStarted;
    public string? Position { get; set; }
    public string? SupervisorName { get; set; }
    public string? Notes { get; set; }

    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    public ICollection<WeeklyReport> WeeklyReports { get; set; } = new List<WeeklyReport>();
}
