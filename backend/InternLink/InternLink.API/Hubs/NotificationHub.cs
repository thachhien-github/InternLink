using System.Security.Claims;
using InternLink.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace InternLink.API.Hubs;

/// <summary>
/// SignalR Hub for real-time bi-directional notification streaming.
/// </summary>
[Authorize]
public class NotificationHub : Hub<INotificationClient>
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? Context.User?.FindFirst("sub")?.Value
                     ?? Context.User?.FindFirst("userId")?.Value;

        var role = Context.User?.FindFirst(ClaimTypes.Role)?.Value
                   ?? Context.User?.FindFirst("role")?.Value;

        if (!string.IsNullOrEmpty(userId))
        {
            // Join user-specific group: user_{userId}
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            Log.Information("SignalR: User {UserId} connected with ConnectionId {ConnectionId}", userId, Context.ConnectionId);
        }

        if (!string.IsNullOrEmpty(role))
        {
            // Join role-specific group: role_{role}
            await Groups.AddToGroupAsync(Context.ConnectionId, $"role_{role}");
            Log.Information("SignalR: Connection {ConnectionId} joined group role_{Role}", Context.ConnectionId, role);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                     ?? Context.User?.FindFirst("sub")?.Value
                     ?? Context.User?.FindFirst("userId")?.Value;

        if (!string.IsNullOrEmpty(userId))
        {
            Log.Information("SignalR: User {UserId} disconnected (ConnectionId: {ConnectionId})", userId, Context.ConnectionId);
        }

        await base.OnDisconnectedAsync(exception);
    }
}
