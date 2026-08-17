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
}

export const ReportsView = ({
  submissions = [],
  weeklyReports = [],
  onUpdateSubmissionStatus,
  onReviewWeeklyReport,
  showToast,
}: ReportsViewProps) => {
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
