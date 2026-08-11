using InternLink.Domain.Enums;

namespace InternLink.Domain.Entities;

public class WeeklyReport : BaseEntity
{
    public Guid InternshipId { get; set; }
    public Internship Internship { get; set; } = null!;

    public int WeekNumber { get; set; }
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public WeeklyReportStatus Status { get; set; } = WeeklyReportStatus.Draft;
    public DateTime? SubmittedAt { get; set; }
    public string? LecturerComment { get; set; }
}
