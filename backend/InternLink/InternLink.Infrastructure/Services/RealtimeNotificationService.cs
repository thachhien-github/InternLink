using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace InternLink.Infrastructure.Services;

/// <summary>
/// Infrastructure service implementation for dispatching SignalR notifications.
/// Generic on THub so it can be registered with any concrete Hub type from API layer.
/// </summary>
public class RealtimeNotificationService<THub> : IRealtimeNotificationService where THub : Hub<INotificationClient>
{
    private readonly IHubContext<THub, INotificationClient> _hubContext;
    private readonly ILogger<RealtimeNotificationService<THub>> _logger;

    public RealtimeNotificationService(
        IHubContext<THub, INotificationClient> hubContext,
        ILogger<RealtimeNotificationService<THub>> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task SendToUserAsync(Guid userId, NotificationDto notification, CancellationToken cancellationToken = default)
    {
        try
        {
            var userGroup = $"user_{userId}";
            await _hubContext.Clients.Group(userGroup).ReceiveNotification(notification);
            _logger.LogDebug("Dispatched SignalR notification to user group {Group}: {Title}", userGroup, notification.Title);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send SignalR notification to user {UserId}", userId);
        }
    }

    public async Task SendToRoleAsync(string role, NotificationDto notification, CancellationToken cancellationToken = default)
    {
        try
        {
            var roleGroup = $"role_{role}";
            await _hubContext.Clients.Group(roleGroup).ReceiveNotification(notification);
            _logger.LogDebug("Dispatched SignalR notification to role group {Group}: {Title}", roleGroup, notification.Title);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send SignalR notification to role {Role}", role);
        }
    }

    public async Task SendToAllAsync(NotificationDto notification, CancellationToken cancellationToken = default)
    {
        try
        {
            await _hubContext.Clients.All.ReceiveNotification(notification);
            _logger.LogDebug("Broadcasted SignalR notification to all connected clients: {Title}", notification.Title);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to broadcast SignalR notification");
        }
    }

    public async Task SendUnreadCountAsync(Guid userId, int unreadCount, CancellationToken cancellationToken = default)
    {
        try
        {
            var userGroup = $"user_{userId}";
            await _hubContext.Clients.Group(userGroup).UpdateUnreadCount(unreadCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send unread count via SignalR to user {UserId}", userId);
        }
    }

    public async Task NotifyReportStatusChangedAsync(Guid userId, Guid reportId, string status, string message, CancellationToken cancellationToken = default)
    {
        try
        {
            var userGroup = $"user_{userId}";
            await _hubContext.Clients.Group(userGroup).ReceiveReportStatusChanged(reportId, status, message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to notify report status changed via SignalR to user {UserId}", userId);
        }
    }

    public async Task NotifyEvaluationUpdatedAsync(Guid userId, Guid evaluationId, string studentName, double score, CancellationToken cancellationToken = default)
    {
        try
        {
            var userGroup = $"user_{userId}";
            await _hubContext.Clients.Group(userGroup).ReceiveEvaluationUpdated(evaluationId, studentName, score);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to notify evaluation updated via SignalR to user {UserId}", userId);
        }
    }
}
