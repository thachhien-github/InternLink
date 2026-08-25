import { apiRequest } from "../lib/apiClient";
import type { NotificationDto } from "../types/api";

export const notificationService = {
  getMine(): Promise<NotificationDto[]> {
    return apiRequest<NotificationDto[]>("/api/Notification/mine");
  },

  markRead(id: string): Promise<void> {
    return apiRequest<void>(`/api/Notification/mark-read/${id}`, {
      method: "POST",
    });
  },

  markAsRead(id: string): Promise<void> {
    return this.markRead(id);
  },

  markAllRead(): Promise<number> {
    return apiRequest<number>("/api/Notification/mark-all-read", {
      method: "POST",
    });
  },
};
