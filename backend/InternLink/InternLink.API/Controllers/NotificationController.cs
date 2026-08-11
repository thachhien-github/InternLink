using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternLink.API.Extensions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;

namespace InternLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet("mine")]
    public async Task<IActionResult> GetMine()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var notifications = await _notificationService.GetMineAsync(userId.Value);
        return Ok(ApiResponse<IEnumerable<NotificationDto>>.Ok(notifications));
    }

    [HttpPost("mark-read/{id:guid}")]
    public async Task<IActionResult> MarkRead(Guid id)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var ok = await _notificationService.MarkReadAsync(id, userId.Value);
        if (!ok)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Notification not found" }));

        return Ok(ApiResponse<object>.Ok(null));
    }

    [HttpPost("mark-all-read")]
    public async Task<IActionResult> MarkAllRead()
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var count = await _notificationService.MarkAllReadAsync(userId.Value);
        return Ok(ApiResponse<int>.Ok(count));
    }
}
