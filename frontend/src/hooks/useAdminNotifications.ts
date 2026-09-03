import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../lib/apiClient";
import { mapCampaignToAdminRow } from "../lib/adminNotificationMappers";
import {
  adminNotificationsService,
  type AdminBroadcastResultDto,
} from "../services/adminNotifications.service";

export interface AdminNotificationItem {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: "low" | "medium" | "high" | "urgent";
  audienceType: "all" | "student" | "lecturer";
  audienceLabel: string;
  recipientCount: number;
  sentAt: string;
  createdAt: string;
  createdBy: string;
  status: "sent" | "draft";
  attachmentName?: string;
  attachmentSize?: string;
  campaignSentAt?: string;
}


const CAMPAIGNS_STORAGE_KEY = "internlink_admin_campaigns_cache";

function getCachedCampaigns(): AdminNotificationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

function saveCachedCampaigns(items: AdminNotificationItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("internlink_notification_updated"));
  } catch {}
}

export interface UseAdminNotificationsState {
  notifications: AdminNotificationItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  broadcast: (payload: {
    title: string;
    content: string;
    audience: "all" | "student" | "lecturer";
    link?: string;
  }) => Promise<AdminBroadcastResultDto>;
  deleteCampaign: (target: {
    title: string;
    content: string;
    sentAt: string;
  }) => Promise<void>;
}

export const useAdminNotifications = (): UseAdminNotificationsState => {
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>(
    () => getCachedCampaigns(),
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaigns = useCallback(async () => {

    setLoading(true);
    setError(null);
    try {
      const campaigns = await adminNotificationsService.getCampaigns(100);
      const mapped = campaigns.map(mapCampaignToAdminRow);
      setNotifications(mapped);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(getApiErrorMessage(err)));
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const broadcast = async (payload: {
    title: string;
    content: string;
    audience: "all" | "student" | "lecturer";
    link?: string;
  }): Promise<AdminBroadcastResultDto> => {


    const res = await adminNotificationsService.broadcast(payload);
    await fetchCampaigns();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("internlink_notification_updated"));
    }
    return res;
  };

  const deleteCampaign = async (target: {
    title: string;
    content: string;
    sentAt: string;
  }): Promise<void> => {

    await adminNotificationsService.deleteCampaign(target);

    setNotifications((prev) => {
      const updated = prev.filter(
        (n) =>
          !(
            n.title === target.title &&
            n.content === target.content &&
            (n.campaignSentAt === target.sentAt || n.sentAt === target.sentAt)
          ),
      );
      saveCachedCampaigns(updated);
      return updated;
    });
  };

  return {
    notifications,
    loading,
    error,
    refetch: fetchCampaigns,
    broadcast,
    deleteCampaign,
  };
};
