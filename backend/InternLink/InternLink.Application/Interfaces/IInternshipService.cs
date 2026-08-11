using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

/// <summary>
/// Service interface for Internship management operations
/// </summary>
public interface IInternshipService
{
    /// <summary>
    /// Get all internships with pagination
    /// </summary>
    Task<IEnumerable<InternshipListItemDto>> GetAllInternshipsAsync(int skip = 0, int take = 100);

    /// <summary>
    /// Get internships with filtering, sorting, and pagination
    /// </summary>
    Task<PaginatedResponse<InternshipListItemDto>> GetInternshipsWithFilterAsync(InternshipFilterRequest filter);

    /// <summary>
    /// Get a specific internship by ID with full details and submissions
    /// </summary>
    Task<InternshipDetailFullDto?> GetInternshipByIdAsync(Guid id);

    /// <summary>
    /// Get internships for a specific student
    /// </summary>
    Task<IEnumerable<InternshipListItemDto>> GetInternshipsByStudentAsync(Guid studentId, int skip = 0, int take = 100);

    /// <summary>
    /// Get internships for a specific company
    /// </summary>
    Task<IEnumerable<InternshipListItemDto>> GetInternshipsByCompanyAsync(Guid companyId, int skip = 0, int take = 100);

    /// <summary>
    /// Create a new internship
    /// </summary>
    Task<InternshipDetailFullDto> CreateInternshipAsync(CreateInternshipRequest request);

    /// <summary>
    /// Update an existing internship
    /// </summary>
    Task<InternshipDetailFullDto?> UpdateInternshipAsync(Guid id, UpdateInternshipRequest request);

    /// <summary>
    /// Update internship status only
    /// </summary>
    Task<InternshipDetailFullDto?> UpdateInternshipStatusAsync(Guid id, UpdateInternshipStatusRequest request);

    /// <summary>
    /// Assign or change company for an internship
    /// </summary>
    Task<InternshipDetailFullDto?> AssignCompanyAsync(Guid id, AssignCompanyRequest request);

    /// <summary>
    /// Delete an internship
    /// </summary>
    Task<bool> DeleteInternshipAsync(Guid id);

    /// <summary>
    /// Get internship statistics (count by status)
    /// </summary>
    Task<InternshipStatsDto> GetInternshipStatsAsync();

    /// <summary>
    /// Check if a student already has an internship assigned
    /// </summary>
    Task<bool> StudentHasActiveInternshipAsync(Guid studentId);

    /// <summary>
    /// Get internships by status
    /// </summary>
    Task<IEnumerable<InternshipListItemDto>> GetInternshipsByStatusAsync(string status, int skip = 0, int take = 100);
}
