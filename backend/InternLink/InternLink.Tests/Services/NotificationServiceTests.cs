using AutoMapper;
using FluentAssertions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Application.Mappings;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using InternLink.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace InternLink.Tests.Services;

public class NotificationServiceTests
{
    private readonly IMapper _mapper;

    public NotificationServiceTests()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<NotificationProfile>();
        });
        _mapper = config.CreateMapper();
    }

    private static AppDbContext GetDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateAsync_ValidRequest_ShouldCreateNotification()
    {
        var db = GetDb();
        var user = new User { Id = Guid.NewGuid(), Username = "testuser", PasswordHash = "hash", Role = Role.Student, CreatedAt = DateTime.UtcNow };
        await db.Users.AddAsync(user);
        await db.SaveChangesAsync();

        var service = new NotificationService(db, _mapper, Mock.Of<IRealtimeNotificationService>());
        var request = new CreateNotificationRequest
        {
            UserId = user.Id,
            Title = "New Submission Feedback",
            Content = "You received feedback on your submission.",
            Link = "/submissions/1"
        };

        var result = await service.CreateAsync(request);

        result.Should().NotBeNull();
        result.Title.Should().Be("New Submission Feedback");
        result.IsRead.Should().BeFalse();
    }

    [Fact]
    public async Task GetMineAsync_ShouldReturnUserNotifications()
    {
        var db = GetDb();
        var user = new User { Id = Guid.NewGuid(), Username = "testuser", PasswordHash = "hash", Role = Role.Student, CreatedAt = DateTime.UtcNow };
        var otherUser = new User { Id = Guid.NewGuid(), Username = "otheruser", PasswordHash = "hash", Role = Role.Student, CreatedAt = DateTime.UtcNow };

        var notif1 = new Notification { Id = Guid.NewGuid(), UserId = user.Id, Title = "Notif 1", Content = "Content 1", CreatedAt = DateTime.UtcNow };
        var notif2 = new Notification { Id = Guid.NewGuid(), UserId = otherUser.Id, Title = "Notif 2", Content = "Content 2", CreatedAt = DateTime.UtcNow };

        await db.Users.AddRangeAsync(user, otherUser);
        await db.Notifications.AddRangeAsync(notif1, notif2);
        await db.SaveChangesAsync();

        var service = new NotificationService(db, _mapper, Mock.Of<IRealtimeNotificationService>());

        var result = await service.GetMineAsync(user.Id);

        result.Should().HaveCount(1);
        result.First().Title.Should().Be("Notif 1");
    }

    [Fact]
    public async Task MarkAsReadAsync_ShouldUpdateIsRead()
    {
        var db = GetDb();
        var user = new User { Id = Guid.NewGuid(), Username = "testuser", PasswordHash = "hash", Role = Role.Student, CreatedAt = DateTime.UtcNow };
        var notif = new Notification { Id = Guid.NewGuid(), UserId = user.Id, Title = "Notif 1", Content = "Content 1", IsRead = false, CreatedAt = DateTime.UtcNow };

        await db.Users.AddAsync(user);
        await db.Notifications.AddAsync(notif);
        await db.SaveChangesAsync();

        var service = new NotificationService(db, _mapper, Mock.Of<IRealtimeNotificationService>());

        var result = await service.MarkReadAsync(notif.Id, user.Id);

        result.Should().BeTrue();
        var updated = await db.Notifications.FindAsync(notif.Id);
        updated!.IsRead.Should().BeTrue();
    }
}
