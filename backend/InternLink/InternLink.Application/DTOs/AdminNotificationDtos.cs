namespace InternLink.Application.DTOs;

public sealed class AdminBroadcastNotificationRequest
{
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string? Link { get; set; }
    /// <summary>all | student | lecturer</summary>
    public string Audience { get; set; } = "all";
}

public sealed class AdminBroadcastNotificationResultDto
{
    public int RecipientCount { get; set; }
    public DateTime SentAt { get; set; }
}

public sealed class AdminNotificationCampaignDto
{
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public int RecipientCount { get; set; }
    public int ReadCount { get; set; }
    public DateTime SentAt { get; set; }
}

public sealed class AdminDeleteNotificationCampaignRequest
{
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public DateTime SentAt { get; set; }
}
