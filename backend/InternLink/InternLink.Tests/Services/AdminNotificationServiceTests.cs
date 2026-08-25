using FluentAssertions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using InternLink.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace InternLink.Tests.Services;

public class AdminNotificationServiceTests
{
    private static AppDbContext GetDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private static AdminNotificationService CreateService(AppDbContext db) =>
        new AdminNotificationService(db, Mock.Of<IRealtimeNotificationService>());

    [Fact]
    public async Task BroadcastAsync_AllAudience_ShouldSendToAllUsers()
    {
        var db = GetDb();
        var user1 = new User { Id = Guid.NewGuid(), Username = "user1", PasswordHash = "hash", Role = Role.Student, CreatedAt = DateTime.UtcNow };
        var user2 = new User { Id = Guid.NewGuid(), Username = "user2", PasswordHash = "hash", Role = Role.Lecturer, CreatedAt = DateTime.UtcNow };

        await db.Users.AddRangeAsync(user1, user2);
        await db.SaveChangesAsync();

        var service = CreateService(db);
        var request = new AdminBroadcastNotificationRequest
        {
            Title = "System Maintenance",
            Content = "System will be down for 1 hour.",
            Audience = "All"
        };

        var result = await service.BroadcastAsync(request);

        result.Should().NotBeNull();
        result.RecipientCount.Should().Be(2);

        var notifications = await db.Notifications.ToListAsync();
        notifications.Should().HaveCount(2);
    }

    [Fact]
    public async Task BroadcastAsync_EmptyTitle_ShouldThrowInvalidOperationException()
    {
        var db = GetDb();
        var service = CreateService(db);
        var request = new AdminBroadcastNotificationRequest
        {
            Title = "",
            Content = "Valid content",
            Audience = "All"
        };

        var act = async () => await service.BroadcastAsync(request);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Title is required*");
    }

    [Fact]
    public async Task GetCampaignsAsync_ShouldReturnGroupedCampaigns()
    {
        var db = GetDb();
        var user1 = new User { Id = Guid.NewGuid(), Username = "user1", PasswordHash = "hash", Role = Role.Student, CreatedAt = DateTime.UtcNow };
        var user2 = new User { Id = Guid.NewGuid(), Username = "user2", PasswordHash = "hash", Role = Role.Student, CreatedAt = DateTime.UtcNow };

        var sentTime = DateTime.UtcNow;
        var notif1 = new Notification { Id = Guid.NewGuid(), UserId = user1.Id, User = user1, Title = "Alert", Content = "Alert Body", CreatedAt = sentTime };
        var notif2 = new Notification { Id = Guid.NewGuid(), UserId = user2.Id, User = user2, Title = "Alert", Content = "Alert Body", CreatedAt = sentTime };

        await db.Users.AddRangeAsync(user1, user2);
        await db.Notifications.AddRangeAsync(notif1, notif2);
        await db.SaveChangesAsync();

        var service = CreateService(db);

        var campaigns = await service.GetCampaignsAsync();

        campaigns.Should().ContainSingle();
        campaigns.First().Title.Should().Be("Alert");
        campaigns.First().RecipientCount.Should().Be(2);
    }
}
