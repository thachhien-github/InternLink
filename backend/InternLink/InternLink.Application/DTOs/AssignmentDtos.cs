namespace InternLink.Application.DTOs;

public class BulkAssignRequest
{
    public Guid LecturerId { get; set; }
    public Guid SemesterId { get; set; } // Added: semester context for assignment
    public IList<Guid> StudentIds { get; set; } = Array.Empty<Guid>();
    public string? Note { get; set; }
}

public class UnassignRequest
{
    public Guid LecturerId { get; set; }
    public Guid StudentId { get; set; }
}

public class BulkAssignResultDto
{
    public int AssignedCount { get; set; }
    public int CreatedCount { get; set; }
    public int UpdatedCount { get; set; }
    public int FailedCount { get; set; }
    public IList<AssignmentErrorDto> Errors { get; set; } = Array.Empty<AssignmentErrorDto>();
}

public class AssignmentErrorDto
{
    public Guid StudentId { get; set; }
    public string Message { get; set; } = null!;
}

public class LecturerAssignmentItemDto
{
    public Guid InternshipId { get; set; }
    public Guid StudentId { get; set; }
    public string StudentCode { get; set; } = null!;
    public string StudentName { get; set; } = null!;
    public string? Class { get; set; }
    public string? Major { get; set; }
    public string Status { get; set; } = null!;
    public Guid? CompanyId { get; set; } // Changed: nullable because company assigned later
    public string? CompanyName { get; set; }
    public bool CompanyAssigned { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AutoAssignRequest
{
    /// <summary>"department" or "even".</summary>
    public string Strategy { get; set; } = "even";
}

public class AutoAssignResultDto
{
    public int TotalAssigned { get; set; }
    public int TotalFailed { get; set; }
    public int LecturersUsed { get; set; }
}

public class AssignmentHistoryItemDto
{
    public string Id { get; set; } = null!;
    public string LecturerName { get; set; } = null!;
    public int StudentCount { get; set; }
    public DateTime Timestamp { get; set; }
    public IList<string> ClassGroups { get; set; } = Array.Empty<string>();
    public string AssignedBy { get; set; } = null!;
}
