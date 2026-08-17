import { downloadCsv } from "./exportCsv";

export interface NotificationExportRow {
  title: string;
  content: string;
  audienceLabel: string;
  recipientCount: number;
  readCount: number;
  sentAt: string;
  status: string;
}

export function exportNotificationsHistoryCsv(rows: NotificationExportRow[]): void {
  const date = new Date().toISOString().slice(0, 10);
  downloadCsv(
    `lich-su-thong-bao-${date}.csv`,
    [
      "Tiêu đề",
      "Nội dung",
      "Đối tượng",
      "Số người nhận",
      "Đã đọc",
      "Thời gian gửi",
      "Trạng thái",
    ],
    rows.map((n) => [
      n.title,
      n.content,
      n.audienceLabel,
      n.recipientCount,
      n.readCount,
      n.sentAt,
      n.status,
    ]),
  );
}
