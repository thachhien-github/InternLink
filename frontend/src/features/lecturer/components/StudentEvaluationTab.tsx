import { useState } from "react";
import { AlertTriangle, CalendarDays, CheckCircle2, RefreshCw, Save, Sliders, Star } from "lucide-react";
import { Panel } from "../../../components/common/Panel";
import { DynamicRubricEvaluation } from "./DynamicRubricEvaluation";
import { evaluationService } from "../../../services/evaluation.service";
import { rubricService } from "../../../services/rubric.service";
import { getApiErrorMessage } from "../../../lib/apiClient";
import type { EvaluationDetailDto } from "../../../types/api";
import type { EvaluationRubricDto } from "../../../types/evaluation";

interface StudentEvaluationTabProps {
  internshipId: string;
  evaluation: EvaluationDetailDto | null;
  rubric: EvaluationRubricDto | null;
  student: {
    name: string;
    mssv: string;
    class: string;
    major: string;
    company: string;
    supervisor: string;
    internshipId: string;
    evaluationId?: string;
    semesterId?: string;
  };
  isFinalized: boolean;
  onRefresh: () => Promise<void>;
  onShowToast?: (msg: string) => void;
  error?: string | null;
}

export function StudentEvaluationTab({
  internshipId,
  evaluation,
  rubric,
  student,
  isFinalized,
  onRefresh,
  onShowToast,
  error,
}: StudentEvaluationTabProps) {
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [defenseDate, setDefenseDate] = useState(evaluation?.defenseDate?.slice(0, 10) ?? "");
  const [defenseStatus, setDefenseStatus] = useState<EvaluationDetailDto["defenseStatus"]>(evaluation?.defenseStatus ?? "NotScheduled");
  const [defenseCouncilName, setDefenseCouncilName] = useState(evaluation?.defenseCouncilName ?? "");
  const [defenseExaminerName, setDefenseExaminerName] = useState(evaluation?.defenseExaminerName ?? "");
  const [isSavingDefense, setIsSavingDefense] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");

  const saveDefense = async () => {
    setIsSavingDefense(true);
    try {
      if (evaluation) {
        await evaluationService.updateDefense(evaluation.id, {
          defenseDate: defenseDate || null,
          defenseStatus,
          defenseCouncilName: defenseCouncilName.trim() || null,
          defenseExaminerName: defenseExaminerName.trim() || null,
        });
      } else {
        await evaluationService.scheduleDefense(internshipId, {
          defenseDate: defenseDate || null,
          defenseStatus,
          defenseCouncilName: defenseCouncilName.trim() || null,
          defenseExaminerName: defenseExaminerName.trim() || null,
        });
      }
      await onRefresh();
      onShowToast?.("Đã cập nhật lịch bảo vệ.");
    } catch (err) {
      onShowToast?.(getApiErrorMessage(err));
    } finally {
      setIsSavingDefense(false);
    }
  };

  const handleSave = async (data: {
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
    finalize: boolean;
  }) => {
    setIsSaving(true);
    try {
      await rubricService.saveScores(
        data.evaluationId,
        data.criteriaScores,
        data.comments,
        internshipId,
        data.finalize,
      );
      await onRefresh();
      setEditing(false);
      onShowToast?.(data.finalize ? "Đã lưu và chốt đánh giá." : "Đã lưu bản nháp đánh giá.");
    } catch (err) {
      onShowToast?.(getApiErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  // No rubric available
  if (!rubric) {
    return (
      <Panel className="py-16 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">{error ? "Không thể tải rubric" : "Chưa có rubric phê duyệt"}</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {error ?? "Kỳ thực tập hiện tại chưa có rubric đã được phê duyệt. Vui lòng liên hệ Admin để thiết lập tiêu chí chấm điểm."}
        </p>
        {error && <button type="button" onClick={() => void onRefresh()} className="text-xs font-bold text-blue-600 underline">Thử lại</button>}
      </Panel>
    );
  }

  // Edit mode — render DynamicRubricEvaluation
  if (mode === "edit" && !isFinalized) {
    return (
      <DynamicRubricEvaluation
        student={{
          ...student,
          evaluationId: evaluation?.id,
        }}
        onBack={() => setMode("view")}
        onSave={handleSave}
      />
    );
  }

  // View mode — show existing evaluation summary
  return (
    <div className="space-y-5">
      <Panel className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Kết quả đánh giá</h3>
            {isFinalized && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Đã chốt
              </span>
            )}
          </div>
          {!isFinalized && (
            <button
              onClick={() => setMode("edit")}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              Chỉnh sửa
            </button>
          )}
        </div>

        {evaluation ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <ScoreSummary label="Điểm doanh nghiệp" value={evaluation.communicationScore} />
              <ScoreSummary label="Điểm giảng viên" value={evaluation.technicalScore} />
              <ScoreSummary label="Điểm bảo vệ" value={evaluation.initiativeScore} />
            </div>
            {(evaluation.defenseDate || evaluation.defenseCouncilName || evaluation.defenseExaminerName) && (
              <div className="rounded-md border border-indigo-200 bg-indigo-50/60 px-3 py-3 text-xs">
                <p className="font-bold text-indigo-900">Thông tin bảo vệ</p>
                <p className="mt-1 text-indigo-800">
                  {evaluation.defenseStatus === "Completed" ? "Đã bảo vệ" : evaluation.defenseStatus === "Scheduled" ? "Đã xếp lịch" : "Chưa xếp lịch"}
                  {evaluation.defenseDate ? ` · ${new Date(evaluation.defenseDate).toLocaleDateString("vi-VN")}` : ""}
                  {evaluation.defenseCouncilName ? ` · ${evaluation.defenseCouncilName}` : ""}
                  {evaluation.defenseExaminerName ? ` · Phản biện: ${evaluation.defenseExaminerName}` : ""}
                </p>
              </div>
            )}
            <div className="rounded-md border border-indigo-200 bg-white px-4 py-4">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-indigo-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Lịch bảo vệ</h4>
                    <p className="text-[11px] text-slate-500">Cập nhật thông tin hội đồng và người phản biện.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={saveDefense}
                  disabled={isSavingDefense || isFinalized}
                  className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  {isSavingDefense ? "Đang lưu..." : "Lưu lịch"}
                </button>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2 text-xs">
                <label className="font-bold text-slate-700">
                  Trạng thái
                  <select value={defenseStatus} onChange={(event) => setDefenseStatus(event.target.value as EvaluationDetailDto["defenseStatus"])} disabled={isFinalized} className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-medium outline-none focus:border-indigo-500 disabled:opacity-60">
                    <option value="NotScheduled">Chưa xếp lịch</option>
                    <option value="Scheduled">Đã xếp lịch</option>
                    <option value="Completed">Đã bảo vệ</option>
                  </select>
                </label>
                <label className="font-bold text-slate-700">
                  Ngày bảo vệ
                  <input type="date" value={defenseDate} onChange={(event) => setDefenseDate(event.target.value)} disabled={isFinalized} className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-medium outline-none focus:border-indigo-500 disabled:opacity-60" />
                </label>
                <label className="font-bold text-slate-700">
                  Hội đồng
                  <input value={defenseCouncilName} onChange={(event) => setDefenseCouncilName(event.target.value)} disabled={isFinalized} placeholder="Ví dụ: Hội đồng CNTT 01" className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-medium outline-none focus:border-indigo-500 disabled:opacity-60" />
                </label>
                <label className="font-bold text-slate-700">
                  Người phản biện
                  <input value={defenseExaminerName} onChange={(event) => setDefenseExaminerName(event.target.value)} disabled={isFinalized} placeholder="Tên giảng viên phản biện" className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-medium outline-none focus:border-indigo-500 disabled:opacity-60" />
                </label>
              </div>
              {isFinalized && <p className="mt-3 text-[11px] font-medium text-amber-700">Đánh giá đã chốt nên thông tin bảo vệ đang ở chế độ chỉ đọc.</p>}
            </div>
            {/* Final grade */}
            <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 rounded-lg border border-blue-200/80 text-center">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-2">
                Điểm tổng kết
              </span>
              <span className="text-4xl font-black text-slate-900 font-mono">
                {evaluation.finalGrade ?? "—"}
              </span>
              <span className="text-sm text-slate-500 font-bold"> / 10</span>
              <p className="text-xs text-slate-600 mt-2">
                {evaluation.finalGrade != null
                  ? evaluation.finalGrade >= 8
                    ? "Giỏi"
                    : evaluation.finalGrade >= 6.5
                      ? "Khá"
                      : evaluation.finalGrade >= 5
                        ? "Trung bình"
                        : "Không đạt"
                  : "Chưa có điểm"}
              </p>
            </div>

            {/* Rubric scores if available */}
            {evaluation.criteriaScores && evaluation.criteriaScores.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Điểm theo tiêu chí
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {evaluation.criteriaScores.map((cs) => {
                    const pct = cs.maxScore > 0 ? (cs.score / cs.maxScore) * 100 : 0;
                    return (
                      <div key={cs.criterionId ?? cs.criterionName} className="p-3 bg-slate-50 border border-slate-200/70 rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800">{cs.criterionName}</span>
                          <span className="text-xs font-bold text-blue-700 font-mono">
                            {cs.score}/{cs.maxScore}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        {cs.comment && (
                          <p className="text-[11px] text-slate-500 mt-1">{cs.comment}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Sliders className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-slate-500">Chưa có đánh giá cho sinh viên này</p>
          </div>
        )}
      </Panel>
    </div>
  );
}

function ScoreSummary({ label, value }: { label: string; value?: number | null }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
      <strong className="mt-1 block font-mono text-lg text-slate-900">{value ?? "—"}<span className="ml-1 text-xs font-sans font-medium text-slate-400">/ 10</span></strong>
    </div>
  );
}
