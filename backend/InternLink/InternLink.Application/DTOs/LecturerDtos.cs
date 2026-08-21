namespace InternLink.Application.DTOs;



public sealed class StudentSummaryDto

{

    public Guid Id { get; set; }

    public string StudentCode { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string? Class { get; set; }

    public string? Major { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

}



public sealed class CompanySummaryDto

{

    public Guid Id { get; set; }

    public string CompanyName { get; set; } = null!;

    public string? Industry { get; set; }

    public string? ContactPerson { get; set; }

    public string? ContactEmail { get; set; }

    public string? ContactPhone { get; set; }

}



public sealed class FeedbackDto

{

    public Guid Id { get; set; }

    public Guid SubmissionId { get; set; }

    public Guid? LecturerId { get; set; }

    public string? LecturerName { get; set; }

    public string Comment { get; set; } = null!;

    public bool IsPublic { get; set; }

    public DateTime CreatedAt { get; set; }

}



public sealed class SubmissionDto

{

    public Guid Id { get; set; }

    public Guid InternshipId { get; set; }

    public string Type { get; set; } = null!;

    public string Status { get; set; } = null!;

    public int Version { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public string? FileName { get; set; }

    public string? FileUrl { get; set; }

    public DateTime SubmittedAt { get; set; }

    public IEnumerable<FeedbackDto> Feedbacks { get; set; } = Array.Empty<FeedbackDto>();

}



public class InternshipDto

{

    public Guid Id { get; set; }

    public Guid StudentId { get; set; }

    public Guid? CompanyId { get; set; } // Changed: nullable because company assigned later

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string Status { get; set; } = null!;

    public string? Position { get; set; }

    public string? SupervisorName { get; set; }

    public string? Notes { get; set; }

    public StudentSummaryDto? Student { get; set; }

    public CompanySummaryDto? Company { get; set; }

}



public sealed class InternshipDetailDto : InternshipDto

{

    public IEnumerable<SubmissionDto> Submissions { get; set; } = Array.Empty<SubmissionDto>();

}



public sealed class CreateFeedbackRequest
{
    public string Comment { get; set; } = null!;
    public bool IsPublic { get; set; } = true;
    /// <summary>
    /// Optional submission status to apply after feedback (e.g. Reviewed, RevisionRequested, Approved).
    /// Defaults to RevisionRequested when omitted.
    /// </summary>
    public string? NewStatus { get; set; }
}

public sealed class LecturerStudentListItemDto
{
    public Guid StudentId { get; set; }
    public Guid InternshipId { get; set; }
    public string StudentCode { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Class { get; set; }
    public string? Major { get; set; }
    public Guid? CompanyId { get; set; }
    public string? CompanyName { get; set; }
    public string? Position { get; set; }
    public string InternshipStatus { get; set; } = null!;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int WeeklyReportCount { get; set; }
    public int PendingReportCount { get; set; }
    public int SubmissionCount { get; set; }
    public decimal? FinalGrade { get; set; }
    public bool HasEvaluation { get; set; }
    public bool IsEvaluationFinalized { get; set; }
    public int ProgressPercent { get; set; }
}

public sealed class LecturerCompanySummaryDto
{
    public Guid Id { get; set; }
    public string CompanyName { get; set; } = null!;
    public string? Industry { get; set; }
    public string? ContactPerson { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
    public string? Address { get; set; }
    public int AssignedStudentsCount { get; set; }
}

public sealed class LecturerDashboardStatsDto
{
    public int TotalStudents { get; set; }
    public int InterningCount { get; set; }
    public int PendingReviewsCount { get; set; }
    public int CompletedCount { get; set; }
    public int OverdueReportsCount { get; set; }
    public decimal AverageGrade { get; set; }
    public int EvaluatedCount { get; set; }
    public Dictionary<string, int> StatusDistribution { get; set; } = new();
}


