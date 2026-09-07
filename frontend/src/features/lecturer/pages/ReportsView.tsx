import { SubmissionsHub } from "../components/SubmissionsHub";
import { WeeklyReportsReviewPanel } from "../components/WeeklyReportsReviewPanel";
import type { Submission } from "../../../types/submission";
import type { WeeklyReportDto } from "../../../types/api";

interface ReportsViewProps {
  submissions?: Submission[];
  weeklyReports?: WeeklyReportDto[];
  onUpdateSubmissionStatus?: (
    id: string,
    status: string,
    note?: string,
  ) => void;
  onReviewWeeklyReport?: (
    id: string,
    status: string,
    comment?: string,
  ) => void | Promise<void>;
  showToast?: (msg: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => Promise<void>;
}

export const ReportsView = ({
  submissions = [],
  weeklyReports = [],
  onUpdateSubmissionStatus,
  onReviewWeeklyReport,
  showToast,
  isLoading = false,
  error = null,
  onRetry,
}: ReportsViewProps) => {
  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Đang tải danh sách báo cáo…</div>;
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg border border-rose-200 bg-rose-50 text-sm text-rose-800 space-y-3">
        <p className="font-semibold">Không thể tải danh sách báo cáo: {error}</p>
        {onRetry && <button type="button" onClick={() => void onRetry()} className="il-btn il-btn-secondary text-xs">Thử lại</button>}
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <WeeklyReportsReviewPanel
        reports={weeklyReports}
        onReview={onReviewWeeklyReport ?? (() => {})}
      />
      <SubmissionsHub
        submissions={submissions}
        onUpdateSubmissionStatus={onUpdateSubmissionStatus}
        onToast={showToast}
      />
    </div>
  );
};
