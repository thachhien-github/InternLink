using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface IAssignmentService
{
    Task<BulkAssignResultDto> BulkAssignAsync(BulkAssignRequest request);
    Task<IReadOnlyList<LecturerAssignmentItemDto>> GetByLecturerAsync(Guid lecturerId);
    Task<bool> UnassignAsync(UnassignRequest request);
    Task<IReadOnlyList<AssignmentHistoryItemDto>> GetHistoryAsync(int limit = 50);
    Task<byte[]> ExportExcelAsync();
    Task<AutoAssignResultDto> AutoAssignAsync(AutoAssignRequest request);
}
