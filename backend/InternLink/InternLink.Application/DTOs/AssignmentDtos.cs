namespace InternLink.Application.DTOs;

public class BulkAssignRequest
{
    public Guid LecturerId { get; set; }
    public IList<Guid> StudentIds { get; set; } = Array.Empty<Guid>();
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
    public Guid CompanyId { get; set; }
    public string? CompanyName { get; set; }
    public bool CompanyAssigned { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime CreatedAt { get; set; }
}
