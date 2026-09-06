import { EvaluationDashboard } from "../components/EvaluationDashboard";
import { StudentWorkspace } from "../components/StudentWorkspace";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

/**
 * EvaluationsView shows either the dashboard list or the StudentWorkspace at the evaluation tab
 * depending on whether an internshipId is provided via URL params.
 */
export const EvaluationsView = ({ onShowToast }: { onShowToast?: (msg: string) => void }) => {
  const { internshipId } = useParams<{ internshipId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // If we have an internshipId in the URL, show the student workspace at evaluation tab
  if (internshipId) {
    return (
      <StudentWorkspace
        internshipId={internshipId}
        initialTab="evaluation"
        onShowToast={onShowToast}
      />
    );
  }

  return (
    <div className="animate-in fade-in duration-200">
      <EvaluationDashboard />
    </div>
  );
};
