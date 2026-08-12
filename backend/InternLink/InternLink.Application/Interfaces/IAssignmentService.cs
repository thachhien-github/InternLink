using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface IAssignmentService
{
    Task<BulkAssignResultDto> BulkAssignAsync(BulkAssignRequest request);
    Task<IReadOnlyList<LecturerAssignmentItemDto>> GetByLecturerAsync(Guid lecturerId);
    Task<bool> UnassignAsync(UnassignRequest request);
}
