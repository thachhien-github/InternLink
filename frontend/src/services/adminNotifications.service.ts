import { apiRequest } from "../lib/apiClient";

export interface AdminNotificationCampaignDto {
  title: string;
  content: string;
  audience: string;
  recipientCount: number;
  readCount: number;
  sentAt: string;
}

export interface AdminBroadcastResultDto {
  recipientCount: number;
  sentAt: string;
}

export const adminNotificationsService = {
  getCampaigns(take = 100): Promise<AdminNotificationCampaignDto[]> {
    return apiRequest<AdminNotificationCampaignDto[]>(
      `/api/Admin/notifications?take=${take}`,
    );
  },

  broadcast(body: {
    title: string;
    content: string;
    link?: string;
    audience: "all" | "student" | "lecturer";
  }): Promise<AdminBroadcastResultDto> {
    return apiRequest<AdminBroadcastResultDto>(
      "/api/Admin/notifications/broadcast",
      { method: "POST", body },
    );
  },

  deleteCampaign(body: {
    title: string;
    content: string;
    sentAt: string;
  }): Promise<void> {
    return apiRequest<void>("/api/Admin/notifications/campaign", {
      method: "DELETE",
      body,
    });
  },
};
