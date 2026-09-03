using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface IAccountRequestService
{
    Task<IReadOnlyList<AccountRequestDto>> GetAllAsync(string? status = null, string? role = null, int skip = 0, int take = 100);
    Task<AccountRequestDto?> GetByIdAsync(Guid id);
    Task<AccountRequestDto> CreateAsync(CreateAccountRequestRequest request);
    Task<AccountRequestDto?> ProcessAsync(Guid id, ProcessAccountRequestRequest request);
    Task<int> GetPendingCountAsync();
}
