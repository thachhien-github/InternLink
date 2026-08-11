using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface INotificationService
{
    Task<IEnumerable<NotificationDto>> GetMineAsync(Guid userId);
    Task<NotificationDto> CreateAsync(CreateNotificationRequest request);
    Task<bool> MarkReadAsync(Guid id, Guid userId);
    Task<int> MarkAllReadAsync(Guid userId);
}
