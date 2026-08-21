import { useCallback, useEffect, useState } from "react";
import { USE_MOCK } from "../config/env";
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

export const DEFAULT_MOCK_NOTIFICATIONS: AdminNotificationItem[] = [
  {
    id: "TB-2026-089",
    title: "Khẩn: Yêu cầu sinh viên hoàn tất nộp Báo cáo Thực tập Tuần 6",
    content:
      "Tất cả sinh viên K20 đang tham gia thực tập tại doanh nghiệp bắt buộc hoàn tất việc nộp báo cáo tiến độ tuần 6 lên hệ thống InternLink để Giảng viên hướng dẫn chấm điểm đúng thời hạn quy định.",
    type: "Học tập",
    priority: "urgent",
    audienceType: "student",
    audienceLabel: "Sinh viên",
    recipientCount: 1280,
    sentAt: "15/08/2026 08:30",
    createdAt: "15/08/2026 08:15",
    createdBy: "Super Admin (Ban Đào tạo)",
    status: "sent",
    attachmentName: "Quy_Dinh_Nop_Bao_Cao_T6.pdf",
    attachmentSize: "1.2 MB",
  },
  {
    id: "TB-2026-088",
    title: "Lịch họp Hội đồng Đánh giá & Rà soát Kết quả Thực tập HK I",
    content:
      "Kính gửi Quý Thầy/Cô Giảng viên hướng dẫn, Ban Chủ nhiệm Khoa CNTT trân trọng kính mời Thầy/Cô tham dự buổi họp rà soát tiến độ và đánh giá kết quả thực tập tốt nghiệp đợt 1 vào lúc 14:00 Thứ Sáu.",
    type: "Lịch trình",
    priority: "high",
    audienceType: "lecturer",
    audienceLabel: "Giảng viên",
    recipientCount: 42,
    sentAt: "12/08/2026 14:00",
    createdAt: "12/08/2026 11:20",
    createdBy: "Văn phòng Khoa CNTT",
    status: "sent",
    attachmentName: "Lich_Hop_Hoi_Dong_Khoa.pdf",
    attachmentSize: "850 KB",
  },
  {
    id: "TB-2026-086",
    title: "Cập nhật Quy chế Đánh giá Điểm Thực tập Tốt nghiệp",
    content:
      "Ban Giám hiệu ban hành quy chế cập nhật cơ cấu điểm học phần Thực tập tốt nghiệp: 40% Điểm Doanh nghiệp tiếp nhận, 30% Điểm Giảng viên hướng dẫn, 30% Điểm Hội đồng phản biện.",
    type: "Quy chế",
    priority: "medium",
    audienceType: "all",
    audienceLabel: "Toàn bộ hệ thống",
    recipientCount: 1322,
    sentAt: "08/08/2026 09:00",
    createdAt: "08/08/2026 08:40",
    createdBy: "Super Admin (Phòng Đào tạo)",
    status: "sent",
  },
];

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
    USE_MOCK ? DEFAULT_MOCK_NOTIFICATIONS : [],
  );
  const [loading, setLoading] = useState<boolean>(!USE_MOCK);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaigns = useCallback(async () => {
    if (USE_MOCK) {
      setNotifications(DEFAULT_MOCK_NOTIFICATIONS);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const campaigns = await adminNotificationsService.getCampaigns(100);
      setNotifications(campaigns.map(mapCampaignToAdminRow));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(getApiErrorMessage(err)));
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
    if (USE_MOCK) {
      const mockResult: AdminBroadcastResultDto = {
        recipientCount: payload.audience === "all" ? 1322 : payload.audience === "student" ? 1280 : 42,
        sentAt: new Date().toISOString(),
      };
      const newNotif: AdminNotificationItem = {
        id: `TB-${Date.now()}`,
        title: payload.title,
        content: payload.content,
        type: "Học tập",
        priority: "medium",
        audienceType: payload.audience,
        audienceLabel:
          payload.audience === "all"
            ? "Toàn bộ hệ thống"
            : payload.audience === "student"
              ? "Sinh viên"
              : "Giảng viên",
        recipientCount: mockResult.recipientCount,
        sentAt: "Vừa xong",
        createdAt: "Vừa xong",
        createdBy: "Super Admin",
        status: "sent",
      };
      setNotifications((prev) => [newNotif, ...prev]);
      return mockResult;
    }

    const res = await adminNotificationsService.broadcast(payload);
    await fetchCampaigns();
    return res;
  };

  const deleteCampaign = async (target: {
    title: string;
    content: string;
    sentAt: string;
  }): Promise<void> => {
    if (!USE_MOCK) {
      await adminNotificationsService.deleteCampaign(target);
    }
    setNotifications((prev) =>
      prev.filter(
        (n) =>
          !(
            n.title === target.title &&
            n.content === target.content &&
            (n.campaignSentAt === target.sentAt || n.sentAt === target.sentAt)
          ),
      ),
    );
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
