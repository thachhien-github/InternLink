using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface IAdminNotificationService
{
    Task<IReadOnlyList<AdminNotificationCampaignDto>> GetCampaignsAsync(int take = 100);
    Task<AdminBroadcastNotificationResultDto> BroadcastAsync(AdminBroadcastNotificationRequest request);
    Task<int> DeleteCampaignAsync(AdminDeleteNotificationCampaignRequest request);
}
