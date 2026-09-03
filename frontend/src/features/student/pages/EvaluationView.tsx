import { useStudentPortal } from "../../../contexts/StudentPortalContext";
import { useSemester } from "../../../contexts/SemesterContext";
import { EvaluationDetailView } from "../components/EvaluationDetailView";

export const EvaluationView = ({
  onShowToast,
}: {
  onShowToast: (msg: string) => void;
}) => {
  const { internshipId, profile } = useStudentPortal();
  const { selectedSemesterId } = useSemester();

  return (
    <div className="animate-in fade-in duration-200">
      <EvaluationDetailView
        internshipId={internshipId ?? undefined}
        semesterId={selectedSemesterId || undefined}
        studentName={profile.name}
        studentCode={profile.mssv}
        onShowToast={onShowToast}
      />
    </div>
  );
};
