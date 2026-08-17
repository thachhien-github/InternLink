namespace InternLink.Application.Interfaces;

/// <summary>
/// Resolves the lecturer profile for a login user and checks internship assignment.
/// </summary>
public interface ILecturerAccessService
{
    Task<Guid?> ResolveLecturerIdAsync(Guid userId);

    /// <summary>
    /// True when the user is the assigned lecturer, the student owner, or SuperAdmin.
    /// </summary>
    Task<bool> CanAccessInternshipAsync(Guid internshipId, Guid userId, bool allowStudentOwner = true);

    /// <summary>Throws UnauthorizedAccessException when the lecturer is not assigned.</summary>
    Task EnsureAssignedLecturerAsync(Guid internshipId, Guid userId);
}
