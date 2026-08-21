using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

/// <summary>
/// Service interface for dispatching real-time notification events via SignalR.
/// </summary>
public interface IRealtimeNotificationService
{
    /// <summary>
    /// Send a notification directly to a specific user by their UserId.
    /// </summary>
    Task SendToUserAsync(Guid userId, NotificationDto notification, CancellationToken cancellationToken = default);

    /// <summary>
    /// Send a notification to all users belonging to a specific role (e.g. Student, Lecturer, Admin).
    /// </summary>
    Task SendToRoleAsync(string role, NotificationDto notification, CancellationToken cancellationToken = default);

    /// <summary>
    /// Broadcast a notification to all connected users.
    /// </summary>
    Task SendToAllAsync(NotificationDto notification, CancellationToken cancellationToken = default);

    /// <summary>
    /// Update the unread count for a specific user.
    /// </summary>
    Task SendUnreadCountAsync(Guid userId, int unreadCount, CancellationToken cancellationToken = default);

    /// <summary>
    /// Notify a specific user that their report status has been updated.
    /// </summary>
    Task NotifyReportStatusChangedAsync(Guid userId, Guid reportId, string status, string message, CancellationToken cancellationToken = default);

    /// <summary>
    /// Notify a user that an evaluation has been updated.
    /// </summary>
    Task NotifyEvaluationUpdatedAsync(Guid userId, Guid evaluationId, string studentName, double score, CancellationToken cancellationToken = default);
}
