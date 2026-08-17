import type { AdminNotificationCampaignDto } from "../services/adminNotifications.service";

function formatViDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso;
  }
}

const AUDIENCE_LABEL: Record<string, string> = {
  all: "Toàn bộ hệ thống",
  student: "Sinh viên",
  lecturer: "Giảng viên",
};

export function mapCampaignToAdminRow(
  c: AdminNotificationCampaignDto,
  index: number,
) {
  const sentLabel = formatViDate(c.sentAt);
  return {
    id: `TB-${c.sentAt}-${index}`,
    title: c.title,
    content: c.content,
    type: "Thông báo",
    priority: "medium",
    audienceType: c.audience,
    audienceLabel: AUDIENCE_LABEL[c.audience] ?? c.audience,
    recipientCount: c.recipientCount,
    sentAt: sentLabel,
    createdAt: sentLabel,
    createdBy: "Super Admin",
    status: "sent",
    readCount: c.readCount,
    totalRecipients: c.recipientCount,
    campaignSentAt: c.sentAt,
  };
}
