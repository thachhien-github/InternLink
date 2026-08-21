using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly IRealtimeNotificationService _realtimeService;

    public NotificationService(AppDbContext db, IMapper mapper, IRealtimeNotificationService realtimeService)
    {
        _db = db;
        _mapper = mapper;
        _realtimeService = realtimeService;
    }

    public async Task<IEnumerable<NotificationDto>> GetMineAsync(Guid userId)
    {
        var notifications = await _db.Notifications
            .Where(n => n.UserId == userId && !n.IsDeleted)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        return _mapper.Map<List<NotificationDto>>(notifications);
    }

    public async Task<NotificationDto> CreateAsync(CreateNotificationRequest request)
    {
        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            Title = request.Title,
            Content = request.Content,
            Link = request.Link,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _db.Notifications.Add(notification);
        await _db.SaveChangesAsync();

        var dto = _mapper.Map<NotificationDto>(notification);

        // Dispatch real-time push to the user
        await _realtimeService.SendToUserAsync(dto.UserId, dto);

        return dto;
    }

    public async Task<bool> MarkReadAsync(Guid id, Guid userId)
    {
        var notification = await _db.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId && !n.IsDeleted);

        if (notification == null)
            return false;

        if (!notification.IsRead)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
            notification.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        return true;
    }

    public async Task<int> MarkAllReadAsync(Guid userId)
    {
        var unread = await _db.Notifications
            .Where(n => n.UserId == userId && !n.IsDeleted && !n.IsRead)
            .ToListAsync();

        if (unread.Count == 0)
            return 0;

        var now = DateTime.UtcNow;
        foreach (var notification in unread)
        {
            notification.IsRead = true;
            notification.ReadAt = now;
            notification.UpdatedAt = now;
        }

        await _db.SaveChangesAsync();
        return unread.Count;
    }
}
