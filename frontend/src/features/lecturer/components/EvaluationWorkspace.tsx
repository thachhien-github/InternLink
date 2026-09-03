import { useState } from "react";
import { Toast } from "../../../components/common/Toast";
import { useSemester } from "../../../contexts/SemesterContext";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  FileText,
  Building2,
  Calendar,
  Award,
  FileCheck,
  Download,
  Eye,
  Bold,
  Italic,
  List,
  History,
  Sparkles,
  Calculator,
  ExternalLink,
  Code2,
  AlertCircle,
} from "lucide-react";

export const EvaluationWorkspace = ({
  student,
  onBack,
  onSave,
}: {
  student: any;
  onBack?: () => void;
  onSave: (updatedStudent: any) => void;
}) => {
  const { selectedSemester } = useSemester();
  const [activeLeftTab, setActiveLeftTab] = useState("tiendo");

  // Điểm 4 Trụ cột Thực tế
  // 1. Quá trình & Báo cáo tuần (20%)
  const [weeklyScore, setWeeklyScore] = useState(
    student.weeklyReportCount === "12/12"
      ? 10.0
      : student.lecturerScore
        ? Number((student.lecturerScore * 0.95).toFixed(1))
        : 9.0,
  );

  // 2. Doanh nghiệp (30%)
  const [enterpriseScore, setEnterpriseScore] = useState(
    student.enterpriseScore || 9.2,
  );

  // 3. Báo cáo cuối kỳ & Sản phẩm thực tế (30%)
  const [reportAndProductScore, setReportAndProductScore] = useState(
    student.lecturerScore || 9.0,
  );

  // 4. Đánh giá chuyên môn GV & Vấn đáp (20%)
  const [hasPresentation, setHasPresentation] = useState(true);
  const [lecturerDefenseScore, setLecturerDefenseScore] = useState(
    student.presentationScore || 9.2,
  );

  const [commentText, setCommentText] = useState(
    student.lecturerComments ||
      "Sinh viên có thái độ học tập nghiêm túc, hoàn thành đầy đủ 12 tuần nhật ký thực tập. Báo cáo cuối kỳ trình bày khoa học, sản phẩm phần mềm chạy tốt và đáp ứng đúng yêu cầu thực tiễn từ phía doanh nghiệp.",
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Tính điểm tổng kết theo 4 trụ cột
  const calculateFinalScore = () => {
    if (hasPresentation) {
      const total =
        weeklyScore * 0.2 +
        enterpriseScore * 0.3 +
        reportAndProductScore * 0.3 +
        lecturerDefenseScore * 0.2;
      return parseFloat(total.toFixed(1));
    } else {
      // Khi không có vấn đáp: 25% Báo cáo tuần - 35% DN - 40% Báo cáo & SP
      const total =
        weeklyScore * 0.25 +
        enterpriseScore * 0.35 +
        reportAndProductScore * 0.4;
      return parseFloat(total.toFixed(1));
    }
  };

  const finalScore = calculateFinalScore();

  const getGradeBadge = (score: number) => {
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

  const gradeInfo = getGradeBadge(finalScore);

  // Tự động tính điểm quá trình từ số tuần
  const handleAutoCalcWeekly = () => {
    const parts = (student.weeklyReportCount || "12/12").split("/");
    const submitted = parseInt(parts[0]) || 12;
    const total = parseInt(parts[1]) || 12;
    const score = parseFloat(Math.min(10, (submitted / total) * 10).toFixed(1));
    setWeeklyScore(score);
    showToast(
      `Đã tính tự động điểm quá trình: ${score}/10 dựa trên ${submitted}/${total} tuần báo cáo!`,
    );
  };

  // Đồng bộ điểm Doanh nghiệp
  const handleSyncEnterprise = () => {
    const eScore = student.enterpriseScore || 9.2;
    setEnterpriseScore(eScore);
    showToast(`Đã đồng bộ điểm Doanh nghiệp: ${eScore}/10 từ phiếu Mentor!`);
  };

  const handleSaveDraft = () => {
    const updated = {
      ...student,
      enterpriseScore,
      lecturerScore: reportAndProductScore,
      presentationScore: hasPresentation ? lecturerDefenseScore : undefined,
      totalScore: finalScore,
      status: "Đang chấm",
      lecturerComments: commentText,
      gradeClassification: gradeInfo.label,
    };
    onSave(updated);
    showToast(
      `Đã lưu nháp kết quả chấm điểm cho ${student.name} (${finalScore} điểm)`,
    );
  };

  const handleComplete = () => {
    const updated = {
      ...student,
      enterpriseScore,
      lecturerScore: reportAndProductScore,
      presentationScore: hasPresentation ? lecturerDefenseScore : undefined,
      totalScore: finalScore,
      status: "Hoàn thành",
      lecturerComments: commentText,
      gradeClassification: gradeInfo.label,
    };
    onSave(updated);
    showToast(
      `Đã hoàn thành & chính thức công bố điểm cho ${student.name} (${finalScore} điểm - ${gradeInfo.label})`,
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16 font-sans">
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* WORKSPACE PAGE HEADER */}
      <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors border border-slate-200"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Không Gian Chấm Điểm Thực Tập Chuẩn Hóa
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Đánh giá khách quan theo 4 trụ cột: Báo cáo tuần (20%) • Doanh nghiệp (30%) • Báo cáo &amp; Sản phẩm (30%) • Đánh giá GV &amp; Vấn đáp (20%).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors border border-slate-200 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Lưu nháp</span>
          </button>

          <button
            onClick={handleComplete}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Hoàn thành &amp; Công bố điểm</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (5 cols on lg) - STUDENT INFO, TABS, TIMELINE */}
        <div className="lg:col-span-5 space-y-6">
          {/* STUDENT INFORMATION CARD */}
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  student.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                }
                alt={student.name}
                className="w-16 h-16 rounded-lg object-cover border-2 border-blue-500 shadow-sm shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-900 text-base">
                    {student.name}
                  </h2>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-md border border-blue-200">
                    {student.class}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <span>
                    MSSV:{" "}
                    <strong className="text-slate-800">{student.mssv}</strong>
                  </span>
                  <span>•</span>
                  <span>{student.major}</span>
                </p>

                <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 pt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-bold text-slate-800">
                    {student.company}
                  </span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Thời gian thực tập
                </span>
                <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-blue-600" />
                  12 tuần ({selectedSemester?.name || "Chưa chọn kỳ"})
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Mentor hướng dẫn
                </span>
                <span className="font-bold text-slate-800 text-[11px] truncate block mt-0.5">
                  {student.supervisor}
                </span>
              </div>
            </div>
          </div>

          {/* LEFT TABS & EVIDENCE ARTIFACTS */}
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-slate-200 bg-slate-50/80 p-1 text-xs font-bold">
              {[
                { id: "tiendo", label: "Tiến độ tuần" },
                { id: "bainop", label: "Minh chứng bài nộp" },
                { id: "nhanxet", label: "Đánh giá DN" },
                { id: "diem", label: "Lịch sử điểm" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveLeftTab(tab.id)}
                  className={`flex-1 py-2 text-center rounded-md transition-all ${
                    activeLeftTab === tab.id
                      ? "bg-white text-blue-600 font-bold shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Body Content */}
            <div className="p-4 text-xs font-sans space-y-4">
              {activeLeftTab === "tiendo" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">
                      Tổng tiến độ nộp báo cáo:
                    </span>
                    <span className="font-bold text-blue-700 text-sm">
                      {student.weeklyReportCount || "12/12"} tuần ({student.progress}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200 text-emerald-900 space-y-1">
                      <div className="flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Nhật ký hàng tuần</span>
                      </div>
                      <p className="text-[11px] font-bold">
                        {student.weeklyReportCount || "12/12"} bài đã nộp
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-md border border-blue-200 text-blue-900 space-y-1">
                      <div className="flex items-center gap-1 font-bold">
                        <FileCheck className="w-4 h-4 text-blue-600" />
                        <span>Báo cáo cuối kỳ</span>
                      </div>
                      <p className="text-[11px] font-bold">Đã hoàn thành</p>
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === "bainop" && (
                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">
                          Bao_Cao_Thuc_Tap_Final.docx
                        </p>
                        <p className="text-[10px] text-slate-400">
                          1.8 MB • Nộp đúng hạn • Quyển báo cáo 68 trang
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast("Đang tải file Bao_Cao_Thuc_Tap_Final.docx...")}
                      className="p-1.5 hover:bg-slate-200 rounded text-blue-600"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">
                          Phieu_Danh_Gia_Doanh_Nghiep.pdf
                        </p>
                        <p className="text-[10px] text-slate-400">
                          420 KB • Mentor đã ký tên, đóng dấu ({student.enterpriseScore || 9.2}đ)
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast("Đang mở xem Phiếu đánh giá Doanh nghiệp...")}
                      className="p-1.5 hover:bg-slate-200 rounded text-emerald-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">
                          Source_Code_Github_Repository
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Link demo &amp; commit lịch sử dự án
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast("Đang mở liên kết kho mã nguồn dự án...")}
                      className="p-1.5 hover:bg-slate-200 rounded text-purple-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {activeLeftTab === "nhanxet" && (
                <div className="space-y-2.5">
                  <div className="p-3 bg-blue-50/60 rounded-md border border-blue-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-blue-900 text-xs">
                        Nhận xét từ Mentor {student.supervisor}:
                      </p>
                      <span className="font-bold text-blue-700 font-mono text-xs">{student.enterpriseScore || 9.2}/10</span>
                    </div>
                    <p className="text-slate-700 italic text-[11px] leading-relaxed">
                      "Sinh viên có thái độ làm việc rất chuyên nghiệp, chủ động tìm tòi công nghệ mới và đóng góp hiệu quả vào module quản lý đơn hàng của công ty. Đánh giá hoàn thành xuất sắc."
                    </p>
                  </div>
                </div>
              )}

              {activeLeftTab === "diem" && (
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="font-medium text-slate-600">
                      Báo cáo tuần (20%):
                    </span>
                    <strong className="text-emerald-700 font-mono">
                      {weeklyScore}
                    </strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="font-medium text-slate-600">
                      Điểm Doanh nghiệp (30%):
                    </span>
                    <strong className="text-blue-700 font-mono">
                      {enterpriseScore}
                    </strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="font-medium text-slate-600">
                      Báo cáo &amp; Sản phẩm (30%):
                    </span>
                    <strong className="text-purple-700 font-mono">
                      {reportAndProductScore}
                    </strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded">
                    <span className="font-medium text-slate-600">
                      Đánh giá GV &amp; Vấn đáp (20%):
                    </span>
                    <strong className="text-indigo-700 font-mono">
                      {hasPresentation ? lecturerDefenseScore : "Không tính"}
                    </strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-blue-50 border border-blue-200 rounded">
                    <span className="font-bold text-blue-900">
                      Điểm Tổng kết:
                    </span>
                    <strong className="text-blue-900 font-bold font-mono text-sm">
                      {finalScore} / 10.0
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TIMELINE */}
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <History className="w-4 h-4 text-blue-600" />
              <span>Tiến trình hoàn thành &amp; kiểm tra đối soát</span>
            </h3>

            <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
              <div className="relative space-y-0.5">
                <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                <p className="font-bold text-slate-900">
                  Nộp đầy đủ {student.weeklyReportCount || "12/12"} báo cáo tuần
                </p>
                <p className="text-[10px] text-slate-400">
                  Hệ thống tự động ghi nhận tỷ lệ hoàn thành 100%
                </p>
              </div>

              <div className="relative space-y-0.5">
                <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                <p className="font-bold text-slate-900">
                  Nộp Báo cáo thực tập &amp; Sản phẩm hoàn thiện
                </p>
                <p className="text-[10px] text-slate-400">
                  Đã tải file DOCX/PDF và Link source code
                </p>
              </div>

              <div className="relative space-y-0.5">
                <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                <p className="font-bold text-slate-900">
                  Tiếp nhận Phiếu đánh giá Doanh nghiệp
                </p>
                <p className="text-[10px] text-slate-400">
                  Điểm đánh giá: {student.enterpriseScore || 9.2}/10
                </p>
              </div>

              <div className="relative space-y-0.5">
                <div className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white" />
                <p className="font-bold text-blue-700">
                  Giảng viên tổng hợp &amp; chốt điểm thực tập
                </p>
                <p className="text-[10px] text-slate-400">
                  Đang thực hiện trên bảng tiêu chí chuẩn hóa
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (7 cols on lg) - 4-PILLAR OBJECTIVE FORM */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span>Bảng Đánh Giá 4 Trụ Cột Khách Quan</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-500">
                Chuẩn Khoa Công Nghệ Thông Tin
              </span>
            </div>

            <div className="space-y-5 text-xs font-sans">
              {/* PILLAR 1: QUÁ TRÌNH & BÁO CÁO TUẦN */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <label className="font-bold text-slate-900 text-xs">
                      Quá trình &amp; Báo cáo hàng tuần ({hasPresentation ? "Trọng số 20%" : "Trọng số 25%"})
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAutoCalcWeekly}
                      className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded border border-emerald-200 flex items-center gap-1 transition-colors"
                      title="Tính tự động dựa trên số tuần đã nộp"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Tính tự động ({student.weeklyReportCount || "12/12"} tuần)</span>
                    </button>
                    <span className="font-bold text-emerald-700 font-mono text-base">
                      {weeklyScore}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pl-7">
                  Dựa trên số lượng tuần nộp bài đúng hạn ({student.weeklyReportCount || "12/12"} tuần), tính đều đặn và chất lượng nhật ký công việc.
                </p>
                <div className="pl-7">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={weeklyScore}
                    onChange={(e) => setWeeklyScore(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-0.5">
                    <span>0 (Không nộp)</span>
                    <span>5 (Nộp trễ nhiều)</span>
                    <span>10 (Nộp đủ 12 tuần đúng hạn)</span>
                  </div>
                </div>
              </div>

              {/* PILLAR 2: DOANH NGHIỆP ĐÁNH GIÁ */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <label className="font-bold text-slate-900 text-xs">
                      Đánh giá từ Doanh nghiệp &amp; Mentor ({hasPresentation ? "Trọng số 30%" : "Trọng số 35%"})
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSyncEnterprise}
                      className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[10px] rounded border border-blue-200 flex items-center gap-1 transition-colors"
                      title="Đồng bộ điểm từ phiếu nhận xét của Mentor"
                    >
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>Lấy từ Phiếu DN</span>
                    </button>
                    <span className="font-bold text-blue-700 font-mono text-base">
                      {enterpriseScore}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pl-7">
                  Căn cứ Phiếu đánh giá của Mentor {student.supervisor} tại {student.company} (Kỷ luật lao động, năng lực chuyên môn tại dự án).
                </p>
                <div className="pl-7">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={enterpriseScore}
                    onChange={(e) => setEnterpriseScore(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-0.5">
                    <span>0 (Kém)</span>
                    <span>5 (Đạt chuẩn)</span>
                    <span>10 (Doanh nghiệp đánh giá xuất sắc)</span>
                  </div>
                </div>
              </div>

              {/* PILLAR 3: BÁO CÁO CUỐI KỲ & SẢN PHẨM HOÀN THÀNH */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <label className="font-bold text-slate-900 text-xs">
                      Báo cáo Tổng kết &amp; Sản phẩm / Source Code ({hasPresentation ? "Trọng số 30%" : "Trọng số 40%"})
                    </label>
                  </div>
                  <span className="font-bold text-purple-700 font-mono text-base">
                    {reportAndProductScore}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 pl-7">
                  Đánh giá độ sâu học thuật, phân tích kiến trúc trong quyển báo cáo và mức độ hoàn thiện, tính chạy được của sản phẩm thực tế.
                </p>
                <div className="pl-7">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={reportAndProductScore}
                    onChange={(e) =>
                      setReportAndProductScore(parseFloat(e.target.value))
                    }
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-0.5">
                    <span>0 (Sơ sài, lỗi)</span>
                    <span>5 (Đạt yêu cầu)</span>
                    <span>10 (Báo cáo chuẩn mực, sản phẩm mượt mà)</span>
                  </div>
                </div>
              </div>

              {/* PILLAR 4: ĐÁNH GIÁ GV & VẤN ĐÁP / BẢO VỆ */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0">
                      4
                    </span>
                    <input
                      type="checkbox"
                      id="hasPresPillar"
                      checked={hasPresentation}
                      onChange={(e) => setHasPresentation(e.target.checked)}
                      className="accent-indigo-600 w-4 h-4 rounded"
                    />
                    <label
                      htmlFor="hasPresPillar"
                      className="font-bold text-slate-900 text-xs cursor-pointer"
                    >
                      Đánh giá Chuyên môn GV &amp; Vấn đáp / Bảo vệ (Trọng số 20%)
                    </label>
                  </div>

                  {hasPresentation ? (
                    <span className="font-bold text-indigo-700 font-mono text-base">
                      {lecturerDefenseScore}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      Đã chia đều tỷ lệ cho các cột khác
                    </span>
                  )}
                </div>

                {hasPresentation && (
                  <div className="pl-7 space-y-1.5">
                    <p className="text-[11px] text-slate-500">
                      Đánh giá mức độ hiểu bài, năng lực tư duy độc lập và khả năng phản biện của sinh viên trước Giảng viên/Hội đồng chấm.
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={lecturerDefenseScore}
                      onChange={(e) =>
                        setLecturerDefenseScore(parseFloat(e.target.value))
                      }
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                      <span>0 (Không nắm kiến thức)</span>
                      <span>5 (Trả lời đạt)</span>
                      <span>10 (Phản biện xuất sắc)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* FINAL SCORE SUMMARY BANNER */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                    Điểm tổng kết minh bạch (Calculated Grade):
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-blue-900 font-mono">
                      {finalScore}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      / 10.0
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {hasPresentation
                      ? "=(Tuần×0.2) + (DN×0.3) + (BC/SP×0.3) + (GV×0.2)"
                      : "=(Tuần×0.25) + (DN×0.35) + (BC/SP×0.4)"}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">
                    Xếp loại đạt được:
                  </span>
                  <span
                    className={`px-3 py-1 font-bold text-xs rounded-md border ${gradeInfo.color}`}
                  >
                    {gradeInfo.label}
                  </span>
                </div>
              </div>

              {/* COMMENT: RICH TEXT EDITOR SIMULATION */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-900 text-xs">
                  Nhận xét toàn diện của Giảng viên (Đánh giá học thuật &amp; Kết quả thực tập)
                </label>

                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-blue-500 transition-colors">
                  <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => showToast("Đã định dạng In đậm")}
                      className="p-1.5 hover:bg-slate-200 rounded text-slate-700 font-bold"
                      title="In đậm"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => showToast("Đã định dạng In nghiêng")}
                      className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                      title="In nghiêng"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-4 w-px bg-slate-300 mx-1" />

                    <button
                      type="button"
                      onClick={() => showToast("Thêm danh sách")}
                      className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                      title="Danh sách"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCommentText(
                          "Sinh viên hoàn thành xuất sắc đợt thực tập tốt nghiệp. Chuyên cần đầy đủ 12 tuần, được Mentor doanh nghiệp khen ngợi về tinh thần trách nhiệm. Sản phẩm phần mềm hoàn thiện tốt, đáp ứng chuẩn kỹ thuật.",
                        );
                        showToast("Đã chèn mẫu nhận xét Xuất sắc!");
                      }}
                      className="px-2 py-1 bg-white hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded border border-slate-200 ml-auto"
                    >
                      + Chèn mẫu nhận xét chuẩn
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Nhập nhận xét đánh giá chi tiết dành cho sinh viên..."
                    className="w-full p-3 text-xs outline-none font-medium text-slate-800 leading-relaxed resize-none"
                  />
                </div>
              </div>

              {/* BOTTOM ACTIONS */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors border border-slate-200 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-slate-500" />
                  <span>Lưu nháp</span>
                </button>

                <button
                  type="button"
                  onClick={handleComplete}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hoàn tất &amp; Công bố điểm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
