import { useState, useEffect } from "react";
import {
  Award,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
} from "lucide-react";
import { Toast } from "../../../components/common/Toast";
import { Panel } from "../../../components/common/Panel";
import { rubricService } from "../../../services/rubric.service";
import { evaluationService } from "../../../services/evaluation.service";
import type {
  EvaluationRubricDto,
  EvaluationCriterionScoreDto,
} from "../../../types/evaluation";

interface EvaluationDetailViewProps {
  internshipId?: string;
  semesterId?: string;
  studentName?: string;
  studentCode?: string;
  onShowToast?: (msg: string) => void;
}

export const EvaluationDetailView = ({
  internshipId,
  semesterId,
  studentName,
  studentCode,
}: EvaluationDetailViewProps) => {
  const [rubric, setRubric] = useState<EvaluationRubricDto | null>(null);
  const [criteriaScores, setCriteriaScores] = useState<EvaluationCriterionScoreDto[]>([]);
  const [finalGrade, setFinalGrade] = useState<number | null>(null);
  const [isFinalized, setIsFinalized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (!internshipId || !semesterId) {
      setIsLoading(false);
      return;
    }

    (async () => {
      setIsLoading(true);
      try {
        // Load rubric
        const rubricData = await rubricService.getApproved(semesterId);
        if (rubricData) {
          setRubric(rubricData);
        }

        // Load evaluation scores if exists
        try {
          const evalDetail = await evaluationService.getByInternship(internshipId);
          if (evalDetail) {
            setIsFinalized(evalDetail.isFinalized);
            setFinalGrade(evalDetail.finalGrade);

            // Try to load criteria scores
            if (evalDetail.id) {
              try {
                const scores = await rubricService.getScores(evalDetail.id);
                if (scores.criteriaScores && scores.criteriaScores.length > 0) {
                  setCriteriaScores(scores.criteriaScores);
                  setFinalGrade(scores.finalGrade);
                }
              } catch {
                // No criteria scores yet
              }
            }
          }
        } catch {
          // No evaluation yet
        }
      } catch {
        showToast("Lỗi khi tải dữ liệu đánh giá.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [internshipId, semesterId]);

  const getClassification = (score: number) => {
    if (score >= 9)
      return { label: "Xuất sắc", color: "bg-emerald-100 text-emerald-800 border-emerald-300", desc: "Đạt chuẩn xuất sắc toàn diện" };
    if (score >= 8)
      return { label: "Giỏi", color: "bg-blue-100 text-blue-800 border-blue-300", desc: "Hoàn thành tốt yêu cầu thực tập" };
    if (score >= 6.5)
      return { label: "Khá", color: "bg-sky-100 text-sky-800 border-sky-300", desc: "Đạt yêu cầu thực tập" };
    if (score >= 5)
      return { label: "Trung bình", color: "bg-amber-100 text-amber-800 border-amber-300", desc: "Đủ điều kiện qua môn" };
    return { label: "Không đạt", color: "bg-rose-100 text-rose-800 border-rose-300", desc: "Chưa hoàn thành yêu cầu" };
  };

  const pillarColors = [
    { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", light: "text-emerald-900" },
    { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", light: "text-blue-900" },
    { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", light: "text-purple-900" },
    { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", light: "text-indigo-900" },
    { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", light: "text-rose-900" },
    { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", light: "text-amber-900" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <p className="text-xs text-slate-500">Đang tải kết quả đánh giá...</p>
      </div>
    );
  }

  // No rubric or no evaluation
  if (!rubric) {
    return (
      <div className="space-y-5 max-w-[900px] mx-auto pb-16">
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        <Panel className="text-center py-12 space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">Chưa có kết quả đánh giá</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Kỳ thực tập hiện tại chưa có rubric được phê duyệt hoặc giảng viên chưa đánh giá.
            Vui lòng quay lại sau.
          </p>
        </Panel>
      </div>
    );
  }

  if (!isFinalized) {
    return (
      <div className="space-y-5 max-w-[900px] mx-auto pb-16">
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        <Panel className="text-center py-12 space-y-3">
          <Clock className="w-8 h-8 text-blue-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">Giảng viên đang chấm điểm</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Kết quả đánh giá thực tập của bạn đang được giảng viên xử lý.
            Bạn sẽ nhận được thông báo khi đánh giá hoàn tất.
          </p>
        </Panel>
      </div>
    );
  }

  const classification = finalGrade != null ? getClassification(finalGrade) : null;

  return (
    <div className="space-y-5 max-w-[900px] mx-auto pb-16 animate-in fade-in duration-200">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <Panel className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 text-white rounded-lg shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Kết quả Đánh giá Thực tập
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {rubric.name} · {rubric.criteria.length} tiêu chí
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-700">Đã hoàn thành</span>
          </div>
        </div>
      </Panel>

      {/* Final Score Card */}
      {finalGrade != null && classification && (
        <div className="bg-white p-6 rounded-lg border-2 border-blue-500/80 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                Điểm tổng kết thực tập
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-slate-900 font-mono">
                  {finalGrade}
                </span>
                <span className="text-sm text-slate-500 font-bold">/ 10.0</span>
                <span className={`px-3 py-1 font-bold text-xs rounded-md border ${classification.color}`}>
                  {classification.label}
                </span>
              </div>
              <p className="text-xs text-slate-500">{classification.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Criteria Breakdown */}
      {criteriaScores.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Chi tiết theo tiêu chí
          </h2>

          {criteriaScores.map((cs, idx) => {
            const color = pillarColors[idx % pillarColors.length];
            const percentage = cs.maxScore > 0
              ? Number((cs.score / cs.maxScore * 100).toFixed(1))
              : 0;
            const normalizedScore = cs.maxScore > 0
              ? Number((cs.score / cs.maxScore * 10).toFixed(2))
              : 0;

            return (
              <div key={idx} className={`bg-white p-4 rounded-lg border ${color.border} shadow-xs space-y-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full ${color.bg} ${color.text} font-bold text-xs flex items-center justify-center`}>
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {cs.criterionName}
                      </h3>
                      {cs.criterionDescription && (
                        <p className="text-[11px] text-slate-500">{cs.criterionDescription}</p>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 ${color.bg} ${color.text} font-bold text-[10px] rounded-md border ${color.border}`}>
                      {cs.weight}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold font-mono ${color.text}`}>
                      {cs.score}/{cs.maxScore}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500`}
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: `var(--tw-${color.text.replace("text-", "")})`,
                    }}
                  />
                </div>

                {cs.comment && (
                  <div className="p-2 bg-slate-50 rounded text-xs text-slate-600">
                    <span className="font-bold text-slate-700">Nhận xét:</span> {cs.comment}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* No criteria scores but have final grade */}
      {criteriaScores.length === 0 && finalGrade != null && (
        <Panel className="text-center py-8 space-y-2">
          <p className="text-xs text-slate-500">
            Đánh giá theo rubric 4 tiêu chí truyền thống.
          </p>
          <p className="text-xs text-slate-400">
            Chi tiết từng tiêu chí sẽ được hiển thị sau khi hệ thống được nâng cấp.
          </p>
        </Panel>
      )}
    </div>
  );
};
