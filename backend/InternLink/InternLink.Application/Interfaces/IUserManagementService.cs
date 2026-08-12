using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface IUserManagementService
{
    Task<PaginatedResponse<UserDto>> GetUsersAsync(UserFilterRequest filter);
    Task<UserDto?> GetUserByIdAsync(Guid id);
    Task<UserDto> CreateUserAsync(CreateUserRequest request);
    Task<UserDto?> UpdateUserAsync(Guid id, UpdateUserRequest request);
    Task<ResetPasswordResultDto?> ResetPasswordAsync(Guid id);
    Task<bool> DeleteUserAsync(Guid id);
}
