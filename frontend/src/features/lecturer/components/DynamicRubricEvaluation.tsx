import { useState, useEffect } from "react";
import { Toast } from "../../../components/common/Toast";
import {
  Save,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Calculator,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { rubricService } from "../../../services/rubric.service";
import type {
  EvaluationRubricDto,
  EvaluationRubricCriterionDto,
} from "../../../types/evaluation";

interface CriterionScoreDraft {
  criterionId: string;
  criterionName: string;
  criterionDescription: string;
  weight: number;
  maxScore: number;
  score: number;
  comment: string;
}

interface DynamicRubricEvaluationProps {
  student: {
    id?: string;
    name: string;
    mssv: string;
    avatar?: string;
    class?: string;
    major?: string;
    company?: string;
    supervisor?: string;
    internshipId?: string;
    evaluationId?: string;
    semesterId?: string;
    hasEvaluation?: boolean;
    [key: string]: any;
  };
  onBack?: () => void;
  onSave?: (data: {
    evaluationId?: string;
    criteriaScores: {
      criterionId: string;
      criterionName: string;
      weight: number;
      maxScore: number;
      score: number;
      comment?: string;
    }[];
    comments: string;
    finalScore: number;
  }) => void;
}

export const DynamicRubricEvaluation = ({
  student,
  onBack,
  onSave,
}: DynamicRubricEvaluationProps) => {
  const [rubric, setRubric] = useState<EvaluationRubricDto | null>(null);
  const [scores, setScores] = useState<CriterionScoreDraft[]>([]);
  const [comments, setComments] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [evaluationId, setEvaluationId] = useState<string | undefined>(
    student.evaluationId,
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load rubric + existing evaluation scores
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const semesterId =
          student.semesterId ||
          "00000000-0000-0000-0000-000000000000";

        // 1. Load rubric
        const rubricData = await rubricService.getApproved(semesterId);
        if (!rubricData) {
          setIsLoading(false);
          return;
        }
        setRubric(rubricData);

        // 2. Try to load existing evaluation scores
        let existingScores: CriterionScoreDraft[] | null = null;
        if (student.evaluationId) {
          try {
            const existing = await rubricService.getScores(student.evaluationId);
            if (existing.criteriaScores && existing.criteriaScores.length > 0) {
              existingScores = existing.criteriaScores.map((cs) => ({
                criterionId: cs.criterionId ?? "",
                criterionName: cs.criterionName,
                criterionDescription: "",
                weight: cs.weight,
                maxScore: cs.maxScore,
                score: cs.score,
                comment: cs.comment ?? "",
              }));
              setComments(""); // existing comments are per-criterion
              setEvaluationId(student.evaluationId);
            }
          } catch {
            // No existing scores
          }
        }

        // 3. Set scores — either from existing or defaults
        if (existingScores) {
          setScores(existingScores);
        } else {
          setScores(
            rubricData.criteria.map((c) => ({
              criterionId: c.id,
              criterionName: c.name,
              criterionDescription: c.description ?? "",
              weight: c.weight,
              maxScore: c.maxScore,
              score: Math.round(c.maxScore * 0.8), // default 80%
              comment: "",
            })),
          );
        }
      } catch {
        // No rubric found
      } finally {
        setIsLoading(false);
      }
    })();
  }, [student.semesterId, student.evaluationId]);

  // Calculate weighted grade
  const calculateFinalGrade = () => {
    if (scores.length === 0) return 0;
    const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);
    if (totalWeight <= 0) return 0;
    const weightedSum = scores.reduce((sum, s) => {
      const normalized = s.maxScore > 0 ? s.score / s.maxScore : 0;
      return sum + normalized * s.weight;
    }, 0);
    return Number(((weightedSum / totalWeight) * 10).toFixed(2));
  };

  const updateScore = (
    criterionId: string,
    field: keyof CriterionScoreDraft,
    value: string | number,
  ) => {
    setScores((prev) =>
      prev.map((s) =>
        s.criterionId === criterionId ? { ...s, [field]: value } : s,
      ),
    );
  };

  const getClassification = (score: number) => {
    if (score >= 9)
      return {
        label: "Xuất sắc",
        color: "bg-emerald-100 text-emerald-800 border-emerald-300",
      };
    if (score >= 8)
      return {
        label: "Giỏi",
        color: "bg-blue-100 text-blue-800 border-blue-300",
      };
    if (score >= 6.5)
      return {
        label: "Khá",
        color: "bg-sky-100 text-sky-800 border-sky-300",
      };
    if (score >= 5)
      return {
        label: "Trung bình",
        color: "bg-amber-100 text-amber-800 border-amber-300",
      };
    return {
      label: "Không đạt",
      color: "bg-rose-100 text-rose-800 border-rose-300",
    };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({
          evaluationId,
          criteriaScores: scores.map((s) => ({
            criterionId: s.criterionId,
            criterionName: s.criterionName,
            weight: s.weight,
            maxScore: s.maxScore,
            score: s.score,
            comment: s.comment || undefined,
          })),
          comments,
          finalScore: calculateFinalGrade(),
        });
      }
      showToast(`Đã lưu đánh giá cho ${student.name}`);
    } catch (err: any) {
      showToast(err?.message || "Lỗi khi lưu đánh giá.");
    } finally {
      setIsSaving(false);
    }
  };

  const finalScore = calculateFinalGrade();
  const classification = getClassification(finalScore);
  const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <p className="text-xs text-slate-500">Đang tải rubric...</p>
      </div>
    );
  }

  if (!rubric) {
    return (
      <div className="space-y-4">
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        <div className="bg-white p-6 rounded-lg border border-slate-200 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">
            Chưa có rubric phê duyệt
          </h3>
          <p className="text-xs text-slate-500">
            Kỳ thực tập hiện tại chưa có rubric đã được phê duyệt. Vui lòng
            liên hệ Admin để thiết lập tiêu chí chấm điểm.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md"
            >
              Quay lại
            </button>
          )}
        </div>
      </div>
    );
  }

  // Pillar color palette
  const pillarColors = [
    { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", accent: "accent-emerald-600", num: "bg-emerald-100 text-emerald-800" },
    { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", accent: "accent-blue-600", num: "bg-blue-100 text-blue-800" },
    { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", accent: "accent-purple-600", num: "bg-purple-100 text-purple-800" },
    { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", accent: "accent-indigo-600", num: "bg-indigo-100 text-indigo-800" },
    { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", accent: "accent-rose-600", num: "bg-rose-100 text-rose-800" },
    { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", accent: "accent-amber-600", num: "bg-amber-100 text-amber-800" },
    { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", accent: "accent-cyan-600", num: "bg-cyan-100 text-cyan-800" },
    { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", accent: "accent-teal-600", num: "bg-teal-100 text-teal-800" },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200 pb-16 font-sans max-w-[1200px] mx-auto">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors border border-slate-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Đánh giá thực tập
              </h1>
              <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[10px] rounded-full border border-indigo-200">
                {rubric.name}
              </span>
              {evaluationId && (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200">
                  Đã có điểm — chỉnh sửa
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {rubric.criteria.length} tiêu chí · Tổng trọng số: {totalWeight}%
              {rubric.applicationMode === "LecturerCustom"
                ? " · Chế độ tùy chỉnh"
                : " · Bắt buộc"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Đang lưu..." : "Lưu & Chốt Điểm"}
        </button>
      </div>

      {/* Student Info */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
          {student.name.split(" ").pop()?.charAt(0) ?? "S"}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-900 text-sm">{student.name}</h2>
            <span className="text-xs text-slate-400 font-mono">
              ({student.mssv})
            </span>
          </div>
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            {student.company || "Chưa có DN"} · Mentor: {student.supervisor || "—"}
          </p>
        </div>
      </div>

      {/* Formula Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 rounded-lg border border-blue-200/80">
        <div className="flex items-center gap-2.5">
          <Calculator className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <span className="font-bold text-blue-900 text-xs">
              Công thức tính điểm:
            </span>
            <p className="text-slate-600 text-[11px] mt-0.5">
              {scores
                .map((s) => `${s.criterionName} × ${s.weight}%`)
                .join(" + ")}{" "}
              → Tổng trọng số: {totalWeight}%
            </p>
          </div>
        </div>
      </div>

      {/* Criteria Scoring Cards */}
      <div className="space-y-4">
        {scores.map((score, idx) => {
          const color = pillarColors[idx % pillarColors.length];
          const pillarScore =
            score.maxScore > 0
              ? Number(((score.score / score.maxScore) * 10).toFixed(2))
              : 0;

          return (
            <div
              key={score.criterionId}
              className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full ${color.num} font-bold text-xs flex items-center justify-center shrink-0`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {score.criterionName}
                    </h3>
                    {score.criterionDescription && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {score.criterionDescription}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 ${color.bg} ${color.text} font-bold text-[10px] rounded-md border ${color.border}`}
                  >
                    Trọng số: {score.weight}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">
                    Điểm / {score.maxScore}
                  </span>
                  <span className={`text-lg font-bold ${color.text}`}>
                    {pillarScore}/10
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Điểm số ({score.maxScore} điểm tối đa)
                  </label>
                  <span className={`font-bold font-mono text-sm ${color.text}`}>
                    {score.score}/{score.maxScore}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={score.maxScore}
                  step={1}
                  value={score.score}
                  onChange={(e) =>
                    updateScore(
                      score.criterionId,
                      "score",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className={`w-full ${color.accent} cursor-pointer`}
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0</span>
                  <span>{score.maxScore / 2}</span>
                  <span>{score.maxScore}</span>
                </div>

                <input
                  type="text"
                  value={score.comment}
                  onChange={(e) =>
                    updateScore(score.criterionId, "comment", e.target.value)
                  }
                  placeholder={`Nhận xét về ${score.criterionName.toLowerCase()}...`}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded outline-none focus:bg-white text-slate-800 font-medium"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Comments */}
      <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs space-y-2">
        <label className="text-xs font-bold text-slate-800">
          Nhận xét chung về sinh viên
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Nhận xét tổng quát về quá trình thực tập, thái độ, và kết quả..."
          rows={3}
          className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded outline-none focus:bg-white text-slate-800 font-medium"
        />
      </div>

      {/* Final Score Summary */}
      <div className="bg-white p-6 rounded-lg border-2 border-blue-500/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
            Kết quả Tổng kết:
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-slate-900 font-mono">
              {finalScore}
            </span>
            <span className="text-sm text-slate-500 font-bold">/ 10.0</span>
            <span
              className={`px-3 py-1 font-bold text-xs rounded-md border ${classification.color}`}
            >
              {classification.label}
            </span>
          </div>
        </div>

        {/* Per-criterion breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs w-full md:w-auto">
          {scores.map((s, idx) => {
            const color = pillarColors[idx % pillarColors.length];
            const ps =
              s.maxScore > 0
                ? Number(((s.score / s.maxScore) * 10).toFixed(2))
                : 0;
            return (
              <div
                key={s.criterionId}
                className={`p-2.5 ${color.bg} rounded-md border ${color.border}`}
              >
                <span className={`text-[10px] ${color.text} block font-bold`}>
                  {s.criterionName} ({s.weight}%)
                </span>
                <span
                  className={`font-bold font-mono text-sm ${color.text.replace("-700", "-900")}`}
                >
                  {ps}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" />
          Lưu & Hoàn tất Đánh giá
        </button>
      </div>
    </div>
  );
};
