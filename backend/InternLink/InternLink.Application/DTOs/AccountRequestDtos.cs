namespace InternLink.Application.DTOs;

public class AccountRequestDto
{
    public Guid Id { get; set; }
    public string RequesterCode { get; set; } = null!;
    public string RequesterName { get; set; } = null!;
    public string? RequesterEmail { get; set; }
    public string? RequesterPhone { get; set; }
    public string RequesterRole { get; set; } = null!;
    public string? DepartmentOrClass { get; set; }
    public string RequestType { get; set; } = null!;
    public string? Description { get; set; }
    public string Priority { get; set; } = "medium";
    public string Status { get; set; } = "Pending";
    public string? ProcessorName { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public string? AdminNote { get; set; }
    public string? AttachmentName { get; set; }
    public List<RequestedChangeDto>? RequestedChanges { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class RequestedChangeDto
{
    public string Field { get; set; } = null!;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
}

public class CreateAccountRequestRequest
{
    public string RequesterCode { get; set; } = null!;
    public string RequesterName { get; set; } = null!;
    public string? RequesterEmail { get; set; }
    public string? RequesterPhone { get; set; }
    public string RequesterRole { get; set; } = "Student";
    public string? DepartmentOrClass { get; set; }
    public string RequestType { get; set; } = null!;
    public string? Description { get; set; }
    public string Priority { get; set; } = "medium";
    public List<RequestedChangeDto>? RequestedChanges { get; set; }
}

public class ProcessAccountRequestRequest
{
    public string Status { get; set; } = null!; // approved, rejected, need_info
    public string? AdminNote { get; set; }
    public string? ProcessorName { get; set; }
}
