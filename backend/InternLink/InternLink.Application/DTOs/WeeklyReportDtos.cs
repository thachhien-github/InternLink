namespace InternLink.Application.DTOs;

public sealed class WeeklyReportDto
{
    public Guid Id { get; set; }
    public Guid InternshipId { get; set; }
    public int WeekNumber { get; set; }
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime? SubmittedAt { get; set; }
    public string? LecturerComment { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public sealed class CreateWeeklyReportRequest
{
    public Guid InternshipId { get; set; }
    public int WeekNumber { get; set; }
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
}

public sealed class UpdateWeeklyReportRequest
{
    public string? Title { get; set; }
    public string? Content { get; set; }
}

public sealed class ReviewWeeklyReportRequest
{
    public string Status { get; set; } = null!;
    public string? LecturerComment { get; set; }
}
