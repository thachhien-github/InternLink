namespace InternLink.Application.DTOs;

public sealed class CreateSubmissionRequest
{
    public Guid InternshipId { get; set; }
    public string Type { get; set; } = null!;
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? FileName { get; set; }
    public string? FileUrl { get; set; }
}

public sealed class UpdateSubmissionStatusRequest
{
    public string Status { get; set; } = null!;
}

public sealed class ResubmitRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? FileName { get; set; }
    public string? FileUrl { get; set; }
}

public sealed class UpdateFeedbackRequest
{
    public string Comment { get; set; } = null!;
}
