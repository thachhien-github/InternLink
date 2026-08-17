import { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Users,
  Award,
  Building2,
  Loader2,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Panel } from "../../../components/common/Panel";
import { USE_MOCK } from "../../../config/env";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { lecturerExportService } from "../../../services/lecturerExport.service";

export const ExportView = ({
  onShowToast,
  studentCount = 28,
}: {
  onShowToast: (msg: string) => void;
  studentCount?: number;
}) => {
  const [includeGrades, setIncludeGrades] = useState(true);
  const [includeEnterpriseFeedback, setIncludeEnterpriseFeedback] =
    useState(true);
  const [includeWeeklySummary, setIncludeWeeklySummary] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (USE_MOCK) {
      onShowToast(
        `Đang xuất báo cáo cuối kỳ (${studentCount} SV) — mock Excel/PDF`,
      );
      return;
    }
    setIsExporting(true);
    try {
      const { blob, filename } = await lecturerExportService.downloadEndOfTerm();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast(`Đã tải xuống ${filename}`);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-[900px] mx-auto">
      <PageHeader
        icon={FileSpreadsheet}
        title="Export cuối kỳ"
        subtitle="Xuất bảng điểm, nhận xét DN và tổng hợp kết quả thực tập"
        actions={[
          {
            label: isExporting ? "Đang xuất…" : "Xuất Excel (.xlsx)",
            icon: isExporting ? Loader2 : Download,
            onClick: () => {
              if (!isExporting) void handleExport();
            },
            variant: "primary",
          },
        ]}
      />

      <Panel className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            Tùy chọn xuất báo cáo
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chỉ sinh viên được phân công cho giảng viên hiện tại
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <Users className="w-4 h-4 text-blue-600 mb-1.5" />
            <p className="font-bold text-slate-900">{studentCount} sinh viên</p>
            <p className="text-slate-500">Đợt HK I 2025-2026</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <Award className="w-4 h-4 text-emerald-600 mb-1.5" />
            <p className="font-bold text-slate-900">Điểm & xếp loại</p>
            <p className="text-slate-500">GVHD + DN + báo cáo</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
            <Building2 className="w-4 h-4 text-sky-600 mb-1.5" />
            <p className="font-bold text-slate-900">Doanh nghiệp</p>
            <p className="text-slate-500">Mentor & phản hồi cuối kỳ</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={includeGrades}
              onChange={(e) => setIncludeGrades(e.target.checked)}
              className="rounded border-slate-300"
            />
            Bảng điểm tổng hợp & xếp loại
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEnterpriseFeedback}
              onChange={(e) => setIncludeEnterpriseFeedback(e.target.checked)}
              className="rounded border-slate-300"
            />
            Phản hồi doanh nghiệp (mentor)
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={includeWeeklySummary}
              onChange={(e) => setIncludeWeeklySummary(e.target.checked)}
              className="rounded border-slate-300"
            />
            Tóm tắt báo cáo tuần (tùy chọn)
          </label>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          API: `GET /api/Lecturer/export/end-of-term`
        </div>
      </Panel>
    </div>
  );
};

export { ExportView as LecturerExportView };
