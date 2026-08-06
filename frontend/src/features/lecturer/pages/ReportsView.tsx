import { SubmissionsHub } from '../components/SubmissionsHub';
import type { Submission } from '../../../types/submission';

interface ReportsViewProps {
  submissions?: Submission[];
  onUpdateSubmissionStatus?: (id: string, status: string, note?: string) => void;
  showToast?: (msg: string) => void;
}

export const ReportsView = ({
  submissions = [],
  onUpdateSubmissionStatus,
  showToast
}: ReportsViewProps) => {
  return (
    <div className="animate-in fade-in duration-200">
      <SubmissionsHub
        submissions={submissions}
        onUpdateSubmissionStatus={onUpdateSubmissionStatus}
        onToast={showToast}
      />
    </div>
  );
};
