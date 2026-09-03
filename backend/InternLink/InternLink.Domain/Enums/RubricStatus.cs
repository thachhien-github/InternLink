namespace InternLink.Domain.Enums;

/// <summary>
/// Lifecycle status of an evaluation rubric.
/// </summary>
public enum RubricStatus
{
    Draft = 0,
    PendingApproval = 1,
    Approved = 2,
    Rejected = 3,
    Locked = 4
}
