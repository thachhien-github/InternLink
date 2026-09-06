import { useEffect, useState } from "react";
import { ArrowLeft, Download, Edit3, FileCheck, RefreshCw } from "lucide-react";
import { Toast } from "../../../components/common/Toast";
import { evaluationService } from "../../../services/evaluation.service";
import { rubricService } from "../../../services/rubric.service";
import { lecturerExportService } from "../../../services/lecturerExport.service";

type DetailStudent = {
  id: string;
  name: string;
  mssv: string;
  class?: string;
  major?: string;
  company?: string;
  supervisor?: string;
  internshipId: string;
  evaluatedAt?: string | null;
  hasEvaluation: boolean;
  isEvaluationFinalized: boolean;
  weeklyReportCount: number | string;
  finalGrade?: number | null;
};

export const EvaluationDetail = ({ student, onBack, onEdit }: { student: DetailStudent; onBack?: () => void; onEdit?: (student: DetailStudent) => void }) => {
  const [evaluation, setEvaluation] = useState<any>(null);
  const [criteriaScores, setCriteriaScores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const detail = await evaluationService.getByInternship(student.internshipId);
        let scores = detail?.criteriaScores ?? [];
        if (detail?.id && scores.length === 0) {
          try { scores = (await rubricService.getScores(detail.id)).criteriaScores; } catch { scores = []; }
        }
        if (!cancelled) { setEvaluation(detail); setCriteriaScores(scores); }
      } catch { if (!cancelled) setEvaluation(null); }
      finally { if (!cancelled) setIsLoading(false); }
    };
    void load();
    return () => { cancelled = true; };
  }, [student.internshipId]);

  const showToast = (message: string) => { setToastMessage(message); window.setTimeout(() => setToastMessage(null), 3000); };
  const exportPdf = async () => {
    try {
      const { blob, filename } = await lecturerExportService.downloadStudentEvaluationPdf(student.internshipId);
      const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
    } catch { showToast("Không thể xuất PDF đánh giá."); }
  };
  const finalGrade = evaluation?.finalGrade ?? student.finalGrade ?? null;
  const isFinalized = evaluation?.isFinalized ?? student.isEvaluationFinalized;

  return <div className="mx-auto max-w-[1200px] space-y-5 pb-16">
    <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-3">{onBack && <button onClick={onBack} className="rounded-md border border-slate-200 bg-slate-100 p-2 text-slate-700" title="Quay lại"><ArrowLeft className="h-5 w-5" /></button>}<div><div className="flex items-center gap-2"><FileCheck className="h-5 w-5 text-blue-600" /><h1 className="text-lg font-bold text-slate-900">Chi tiết đánh giá</h1></div><p className="text-xs text-slate-500">{student.name} · {student.mssv} · {student.company ?? "Chưa có doanh nghiệp"}</p></div></div>
      <div className="flex gap-2"><button onClick={() => void exportPdf()} className="flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700"><Download className="h-4 w-4" />Xuất PDF</button>{onEdit && !isFinalized && <button onClick={() => onEdit(student)} className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white"><Edit3 className="h-4 w-4" />Chấm điểm</button>}</div>
    </header>
    {isLoading ? <div className="flex justify-center py-16"><RefreshCw className="h-6 w-6 animate-spin text-blue-600" /></div> : <>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-lg border border-slate-200 bg-white p-4"><span className="text-[10px] font-bold uppercase text-slate-500">Sinh viên</span><strong className="mt-1 block text-sm text-slate-900">{student.name}</strong><span className="text-xs text-slate-500">{student.class ?? "—"} · {student.major ?? "—"}</span></div><div className="rounded-lg border border-slate-200 bg-white p-4"><span className="text-[10px] font-bold uppercase text-slate-500">Doanh nghiệp</span><strong className="mt-1 block text-sm text-slate-900">{student.company ?? "—"}</strong><span className="text-xs text-slate-500">Mentor: {student.supervisor ?? "—"}</span></div><div className="rounded-lg border border-slate-200 bg-white p-4"><span className="text-[10px] font-bold uppercase text-slate-500">Báo cáo tuần</span><strong className="mt-1 block text-2xl text-emerald-700">{student.weeklyReportCount}</strong></div><div className="rounded-lg border border-slate-200 bg-white p-4"><span className="text-[10px] font-bold uppercase text-slate-500">Điểm cuối</span><strong className="mt-1 block text-2xl text-blue-700">{finalGrade ?? "—"}<small className="ml-1 text-xs">/10</small></strong><span className="text-xs text-slate-500">{isFinalized ? "Đã chốt" : evaluation ? "Bản nháp" : "Chưa chấm"}</span></div></section>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs"><div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3"><h2 className="text-sm font-bold text-slate-900">Điểm theo rubric đã áp dụng</h2><span className="text-xs text-slate-500">{evaluation?.evaluatedAt ? new Date(evaluation.evaluatedAt).toLocaleString("vi-VN") : "Chưa có thời điểm chấm"}</span></div>{criteriaScores.length === 0 ? <p className="py-8 text-center text-xs text-slate-500">Chưa có điểm theo tiêu chí.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="border-b border-slate-200 text-[10px] uppercase text-slate-500"><th className="p-3">Tiêu chí</th><th className="p-3 text-center">Trọng số</th><th className="p-3 text-center">Điểm</th><th className="p-3">Nhận xét</th></tr></thead><tbody className="divide-y divide-slate-100">{criteriaScores.map((score, index) => <tr key={score.criterionId ?? index}><td className="p-3 font-bold text-slate-900">{score.criterionName}</td><td className="p-3 text-center">{score.weight}%</td><td className="p-3 text-center font-bold text-blue-700">{score.score}/{score.maxScore}</td><td className="p-3 text-slate-600">{score.comment || "—"}</td></tr>)}</tbody></table></div>}</section>
      <section className="grid gap-4 lg:grid-cols-2"><div className="rounded-lg border border-slate-200 bg-white p-5"><h2 className="mb-2 text-sm font-bold text-slate-900">Nhận xét giảng viên</h2><p className="whitespace-pre-wrap text-sm text-slate-700">{evaluation?.comments || "Chưa có nhận xét."}</p></div><div className="rounded-lg border border-slate-200 bg-white p-5"><h2 className="mb-2 text-sm font-bold text-slate-900">Cải thiện đề xuất</h2><p className="whitespace-pre-wrap text-sm text-slate-700">{evaluation?.areasForImprovement || "Chưa có nội dung."}</p></div></section>
    </>}
  </div>;
};
