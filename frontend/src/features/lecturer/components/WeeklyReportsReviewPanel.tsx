import { useState } from "react";
import { FileCheck2, Check, RotateCcw } from "lucide-react";
import { Panel } from "../../../components/common/Panel";
import {
  mapWeeklyReportStatusToUi,
} from "../../../lib/portalMappers";
import type { WeeklyReportDto } from "../../../types/api";

type WeeklyReportsReviewPanelProps = {
  reports: WeeklyReportDto[];
  onReview: (
    id: string,
    uiStatus: string,
    comment?: string,
  ) => void | Promise<void>;
};

export function WeeklyReportsReviewPanel({
  reports,
  onReview,
}: WeeklyReportsReviewPanelProps) {
  const [commentById, setCommentById] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const pending = reports.filter((r) => r.status === "Submitted");

  if (pending.length === 0) return null;

  const handleReview = async (id: string, uiStatus: string) => {
    setBusyId(id);
    try {
      await onReview(id, uiStatus, commentById[id]);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Panel className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-blue-600" />
          Báo cáo tuần chờ duyệt
        </h2>
        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
          {pending.length} bài
        </span>
      </div>

      <ul className="divide-y divide-slate-100">
        {pending.map((r) => (
          <li key={r.id} className="py-3 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Tuần {r.weekNumber} — {r.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                  {r.content}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Trạng thái: {mapWeeklyReportStatusToUi(r.status)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => handleReview(r.id, "Yêu cầu sửa")}
                  className="il-btn il-btn-secondary text-[11px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Yêu cầu sửa
                </button>
                <button
                  type="button"
                  disabled={busyId === r.id}
                  onClick={() => handleReview(r.id, "Đã duyệt")}
                  className="il-btn il-btn-primary text-[11px]"
                >
                  <Check className="w-3.5 h-3.5" />
                  Duyệt
                </button>
              </div>
            </div>
            <textarea
              rows={2}
              placeholder="Nhận xét gửi sinh viên (tuỳ chọn)…"
              value={commentById[r.id] ?? ""}
              onChange={(e) =>
                setCommentById((prev) => ({ ...prev, [r.id]: e.target.value }))
              }
              className="w-full text-xs border border-slate-200 rounded-md p-2 outline-none focus:border-blue-500"
            />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
