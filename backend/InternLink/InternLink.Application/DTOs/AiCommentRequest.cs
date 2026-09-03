namespace InternLink.Application.DTOs;

public sealed class AiCommentRequest
{
    public string StudentName { get; set; } = null!;
    public string StudentCode { get; set; } = null!;
    public string? CompanyName { get; set; }
    public int ProgressPercent { get; set; }
    public int WeeksReported { get; set; }
    public double? Gpa { get; set; }
    public string? LastReportTitle { get; set; }
}
