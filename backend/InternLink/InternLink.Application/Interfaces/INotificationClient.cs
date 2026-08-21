using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

/// <summary>
/// Strongly typed SignalR Client Interface for real-time notification events.
/// </summary>
public interface INotificationClient
{
    /// <summary>
    /// Triggered when a new notification is sent to the client.
    /// </summary>
    Task ReceiveNotification(NotificationDto notification);

    /// <summary>
    /// Triggered when the unread notification badge count changes.
    /// </summary>
    Task UpdateUnreadCount(int unreadCount);

    /// <summary>
    /// Triggered when a weekly report status changes (Approved, RevisionRequested, Submitted).
    /// </summary>
    Task ReceiveReportStatusChanged(Guid reportId, string status, string message);

    /// <summary>
    /// Triggered when evaluation scores are updated or finalized.
    /// </summary>
    Task ReceiveEvaluationUpdated(Guid evaluationId, string studentName, double score);
}
