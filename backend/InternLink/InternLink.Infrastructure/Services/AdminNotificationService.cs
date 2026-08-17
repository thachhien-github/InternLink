using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class AdminNotificationService : IAdminNotificationService
{
    private readonly AppDbContext _db;

    public AdminNotificationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<AdminNotificationCampaignDto>> GetCampaignsAsync(int take = 100)
    {
        take = Math.Clamp(take, 1, 500);

        var notifications = await _db.Notifications
            .AsNoTracking()
            .Where(n => !n.IsDeleted)
            .OrderByDescending(n => n.CreatedAt)
            .Take(take * 20)
            .Include(n => n.User)
            .ToListAsync();

        var campaigns = notifications
            .GroupBy(n => new { n.Title, n.Content, n.CreatedAt })
            .Select(g =>
            {
                var roles = g.Select(x => x.User?.Role).Where(r => r.HasValue).Select(r => r!.Value).Distinct().ToList();
                var audience = InferAudience(roles);
                return new AdminNotificationCampaignDto
                {
                    Title = g.Key.Title,
                    Content = g.Key.Content,
                    Audience = audience,
                    RecipientCount = g.Count(),
                    ReadCount = g.Count(x => x.IsRead),
                    SentAt = g.Key.CreatedAt,
                };
            })
            .OrderByDescending(c => c.SentAt)
            .Take(take)
            .ToList();

        return campaigns;
    }

    public async Task<AdminBroadcastNotificationResultDto> BroadcastAsync(AdminBroadcastNotificationRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            throw new InvalidOperationException("Title is required");
        if (string.IsNullOrWhiteSpace(request.Content))
            throw new InvalidOperationException("Content is required");

        var audience = (request.Audience ?? "all").Trim().ToLowerInvariant();
        var query = _db.Users.Where(u => !u.IsDeleted && u.IsActive);

        query = audience switch
        {
            "student" => query.Where(u => u.Role == Role.Student),
            "lecturer" => query.Where(u => u.Role == Role.Lecturer),
            "all" => query.Where(u => u.Role == Role.Student || u.Role == Role.Lecturer),
            _ => throw new InvalidOperationException("Audience must be all, student, or lecturer")
        };

        var userIds = await query.Select(u => u.Id).ToListAsync();
        if (userIds.Count == 0)
            throw new InvalidOperationException("No recipients found for the selected audience");

        var sentAt = DateTime.UtcNow;
        var title = request.Title.Trim();
        var content = request.Content.Trim();
        var link = string.IsNullOrWhiteSpace(request.Link) ? null : request.Link.Trim();

        var batch = userIds.Select(userId => new Notification
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = title,
            Content = content,
            Link = link,
            IsRead = false,
            CreatedAt = sentAt,
        }).ToList();

        await _db.Notifications.AddRangeAsync(batch);
        await _db.SaveChangesAsync();

        return new AdminBroadcastNotificationResultDto
        {
            RecipientCount = batch.Count,
            SentAt = sentAt,
        };
    }

    public async Task<int> DeleteCampaignAsync(AdminDeleteNotificationCampaignRequest request)
    {
        var sentAt = request.SentAt.ToUniversalTime();
        var title = request.Title.Trim();
        var content = request.Content.Trim();

        var items = await _db.Notifications
            .Where(n =>
                !n.IsDeleted &&
                n.Title == title &&
                n.Content == content &&
                n.CreatedAt == sentAt)
            .ToListAsync();

        if (items.Count == 0)
            return 0;

        var now = DateTime.UtcNow;
        foreach (var item in items)
        {
            item.IsDeleted = true;
            item.UpdatedAt = now;
        }

        await _db.SaveChangesAsync();
        return items.Count;
    }

    private static string InferAudience(IReadOnlyList<Role> roles)
    {
        var hasStudent = roles.Contains(Role.Student);
        var hasLecturer = roles.Contains(Role.Lecturer);
        if (hasStudent && hasLecturer) return "all";
        if (hasStudent) return "student";
        if (hasLecturer) return "lecturer";
        return "all";
    }
}
