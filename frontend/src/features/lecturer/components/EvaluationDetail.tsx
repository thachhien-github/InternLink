import { useState } from "react";
import { Toast } from "../../../components/common/Toast";
import { lecturerExportService } from "../../../services/lecturerExport.service";
import {
  ArrowLeft,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Edit3,
  Award,
  Building2,
  User,
  Download,
  History,
  Sliders,
  Check,
  FileCheck,
  GraduationCap,
} from "lucide-react";
const DEFAULT_STUDENT: Record<string, any> = {
  id: "eval-1",
  name: "Nguy\u1EC5n V\u0103n An",
  mssv: "20210001",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  class: "CNTT-K15A",
  major: "K\u1EF9 thu\u1EADt Ph\u1EA7n m\u1EC1m",
  company: "FPT Software Co., Ltd",
  supervisor: "Nguy\u1EC5n V\u0103n H\u1EA3i (Tech Lead / Mentor)",
  progress: 100,
  enterpriseScore: 9.2,
  lecturerScore: 9,
  presentationScore: 9.5,
  totalScore: 9.2,
  status: "Ho\xE0n th\xE0nh",
  weeklyReportCount: "12/12",
  internshipId: undefined,
  finalReportSubmitted: true,
  enterpriseFeedbackSubmitted: true,
  lecturerComments:
    "Sinh vi\xEAn n\u1EAFm v\u1EEFng n\u1EC1n t\u1EA3ng l\u1EADp tr\xECnh, ho\xE0n th\xE0nh xu\u1EA5t s\u1EAFc c\xE1c module backend \u0111\u01B0\u1EE3c giao t\u1EA1i FPT Software. Cu\u1ED1n b\xE1o c\xE1o tr\xECnh b\xE0y ch\u1EC9n chu, \u0111\xFAng quy c\xE1ch.",
  gradeClassification: "Xu\u1EA5t s\u1EAFc",
};
export const EvaluationDetail = ({
  student = DEFAULT_STUDENT,
  onBack,
  onEdit,
}) => {
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const handleExportPDF = async () => {
    if (student.internshipId) {
      try {
        const { blob, filename } = await lecturerExportService.downloadStudentEvaluationPdf(student.internshipId);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Đã tải PDF đánh giá cho ${student.name}`);
      } catch {
        showToast(`Xuất PDF từ server thất bại. Thử lại sau.`);
      }
    } else {
      showToast(`Không có internshipId — không thể xuất PDF từ server.`);
    }
  };
  const handleExportExcel = async () => {
    try {
      const { blob, filename } = await lecturerExportService.downloadEndOfTerm();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Đã tải bảng điểm Excel tổng hợp`);
    } catch {
      showToast(`Xuất Excel từ server thất bại. Thử lại sau.`);
    }
  };
  const handlePrint = () => {
    window.print();
  };

  // Real evaluation state from backend (LecturerRubricController.GetLecturerStudents)
  const hasEvaluation = Boolean(student.hasEvaluation);
  const isFinalized = Boolean(student.isEvaluationFinalized);
  const auditDate = student.evaluatedAt
    ? new Date(student.evaluatedAt).toLocaleDateString("vi-VN")
    : null;
  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16 font-sans">
      {/* Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* PAGE HEADER & EXPORT ACTIONS */}
      <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors border border-slate-200"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Chi tiết phiếu đánh giá thực tập
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full border border-emerald-200">
                Chính thức (Official)
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Hồ sơ tổng hợp kết quả đánh giá thực tập doanh nghiệp &amp; giảng
              viên.
            </p>
          </div>
        </div>

        {/* EXPORT ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-md transition-colors border border-rose-200 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Xuất PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-md transition-colors border border-emerald-200 flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-md transition-colors border border-slate-200 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>In phiếu</span>
          </button>

          {onEdit && (
            <button
              onClick={() => onEdit(student)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>Chỉnh sửa điểm</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: STUDENT INFORMATION */}
      <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
          <User className="w-4 h-4 text-blue-600" />
          <span>1. Thông tin sinh viên &amp; Đơn vị thực tập</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 flex items-center gap-4">
            <img
              src={
                student.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
              alt={student.name}
              className="w-20 h-20 rounded-lg object-cover border-2 border-blue-500 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {student.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                MSSV: <strong className="text-slate-800">{student.mssv}</strong>
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Lớp:{" "}
                <span className="font-bold text-blue-700">{student.class}</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Chuyên ngành: {student.major}
              </p>
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Doanh nghiệp thực tập
              </span>
              <span className="font-bold text-slate-900 mt-0.5 block line-clamp-1">
                {student.company}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Mentor hướng dẫn
              </span>
              <span className="font-bold text-slate-900 mt-0.5 block line-clamp-1">
                {student.supervisor}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Thời gian thực tập
              </span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                12 tuần (01/08 - 24/10)
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Báo cáo tuần
              </span>
              <span className="font-bold text-emerald-700 mt-0.5 block">
                {student.weeklyReportCount} bài đã nộp
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Trạng thái hồ sơ
              </span>
              <span className="font-bold text-blue-700 mt-0.5 block">
                Đầy đủ 100% minh chứng
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Trạng thái chấm
              </span>
              <span className="font-bold text-sky-700 mt-0.5 block">
                {student.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID FOR ENTERPRISE & LECTURER EVALUATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 2: ENTERPRISE EVALUATION */}
        <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>2. Đánh giá từ Doanh nghiệp</span>
            </h2>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded border border-emerald-200">
              Trọng số 40%
            </span>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-md border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                Điểm doanh nghiệp chấm:
              </span>
              <span className="text-3xl font-bold text-emerald-800">
                {student.enterpriseScore || "9.2"}
              </span>
              <span className="text-xs text-emerald-600 font-bold">
                {" "}
                / 10.0
              </span>
            </div>

            <div className="text-right space-y-1">
              <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] rounded-full inline-block">
                Đã ký đóng dấu
              </span>
              <p className="text-[10px] text-emerald-700 font-medium">
                Xác thực qua mã QR DN
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-800">
              Chi tiết ma trận tiêu chí Doanh nghiệp:
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Ý thức tổ chức kỷ luật:</span>
                <strong className="text-slate-900">10 / 10</strong>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-600">
                  Năng lực chuyên môn &amp; Code Quality:
                </span>
                <strong className="text-slate-900">9.0 / 10</strong>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Kỹ năng làm việc nhóm:</span>
                <strong className="text-slate-900">9.5 / 10</strong>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-900 block">
              Nhận xét từ Mentor ({student.supervisor}):
            </span>
            <p className="text-slate-700 italic">
              "Sinh viên có tinh thần chủ động cao, tiếp thu nhanh các công nghệ
              microservices tại FPT. Rất có tiềm năng trở thành nhân viên chính
              thức."
            </p>
          </div>
        </div>

        {/* SECTION 3: LECTURER EVALUATION */}
        <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>3. Đánh giá của Giảng viên hướng dẫn</span>
            </h2>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded border border-blue-200">
              Trọng số 40%
            </span>
          </div>

          <div className="bg-blue-50/60 p-4 rounded-md border border-blue-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-800 uppercase block">
                Điểm báo cáo giảng viên:
              </span>
              <span className="text-3xl font-bold text-blue-800">
                {student.lecturerScore || "9.0"}
              </span>
              <span className="text-xs text-blue-600 font-bold"> / 10.0</span>
            </div>

            <div className="text-right space-y-1">
              <span className="px-2.5 py-1 bg-blue-600 text-white font-bold text-[10px] rounded-full inline-block">
                Hội đồng duyệt
              </span>
              <p className="text-[10px] text-blue-700 font-medium">
                Bảo vệ: {student.presentationScore || "9.5"} điểm
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-800">Cơ cấu điểm Giảng viên:</p>
            <div className="space-y-1.5">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-600">
                  Điểm quá trình &amp; Nhật ký tuần:
                </span>
                <strong className="text-slate-900">9.0 / 10</strong>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-600">
                  Cuốn báo cáo thực tập (Quy cách &amp; Nội dung):
                </span>
                <strong className="text-slate-900">9.0 / 10</strong>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-600">
                  Điểm Thuyết trình Phản biện:
                </span>
                <strong className="text-slate-900">9.5 / 10</strong>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-900 block">
              Ghi chú của Giảng viên:
            </span>
            <p className="text-slate-700 italic">{student.lecturerComments}</p>
          </div>
        </div>
      </div>

      {/* SECTION 4: RUBRIC (6 CRITERIA TABLE) */}
      <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>4. Bảng điểm tiêu chuẩn 6 tiêu chí</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-3">Tiêu chí đánh giá</th>
                <th className="p-3 text-center">Trọng số</th>
                <th className="p-3 text-center">Thang điểm</th>
                <th className="p-3 text-center">Điểm đạt được</th>
                <th className="p-3">Nhận xét chi tiết theo tiêu chí</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              <tr>
                <td className="p-3 font-bold text-slate-900">
                  1. Ý thức &amp; Kỷ luật
                </td>
                <td className="p-3 text-center text-slate-500">10%</td>
                <td className="p-3 text-center text-slate-500">0 - 10</td>
                <td className="p-3 text-center font-bold text-blue-700">9.5</td>
                <td className="p-3 text-slate-600 italic">
                  Chấp hành nghiêm túc thời gian làm việc tại doanh nghiệp.
                </td>
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-900">
                  2. Tiến độ thực tập
                </td>
                <td className="p-3 text-center text-slate-500">10%</td>
                <td className="p-3 text-center text-slate-500">0 - 10</td>
                <td className="p-3 text-center font-bold text-blue-700">9.0</td>
                <td className="p-3 text-slate-600 italic">
                  Nộp đầy đủ 12/12 bài nhật ký hàng tuần đúng hạn.
                </td>
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-900">
                  3. Chất lượng công việc
                </td>
                <td className="p-3 text-center text-slate-500">25%</td>
                <td className="p-3 text-center text-slate-500">0 - 10</td>
                <td className="p-3 text-center font-bold text-blue-700">9.2</td>
                <td className="p-3 text-slate-600 italic">
                  Mã nguồn tối ưu, tuân thủ tiêu chuẩn lập trình FPT Software.
                </td>
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-900">
                  4. Báo cáo thực tập
                </td>
                <td className="p-3 text-center text-slate-500">25%</td>
                <td className="p-3 text-center text-slate-500">0 - 10</td>
                <td className="p-3 text-center font-bold text-blue-700">8.8</td>
                <td className="p-3 text-slate-600 italic">
                  Cấu trúc báo cáo khoa học, trình bày đẹp mắt.
                </td>
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-900">
                  5. Doanh nghiệp đánh giá
                </td>
                <td className="p-3 text-center text-slate-500">15%</td>
                <td className="p-3 text-center text-slate-500">0 - 10</td>
                <td className="p-3 text-center font-bold text-blue-700">9.2</td>
                <td className="p-3 text-slate-600 italic">
                  Mentor đánh giá rất cao tinh thần thái độ làm việc.
                </td>
              </tr>

              <tr>
                <td className="p-3 font-bold text-slate-900">
                  6. Thuyết trình &amp; Phản biện
                </td>
                <td className="p-3 text-center text-slate-500">15%</td>
                <td className="p-3 text-center text-slate-500">0 - 10</td>
                <td className="p-3 text-center font-bold text-blue-700">9.5</td>
                <td className="p-3 text-slate-600 italic">
                  Thuyết trình tự tin, trả lời xuất sắc câu hỏi phản biện.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5 & 6: FINAL SCORE BANNER & COMPREHENSIVE COMMENT */}
      <div className="il-panel p-6 border-t-4 border-t-[#1d4ed8] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            <h2 className="font-bold text-base text-slate-900">
              5. Kết quả tổng kết &amp; Xếp loại cuối kỳ
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            Sinh viên đạt tổng điểm{" "}
            <strong>{student.totalScore || 9.2} / 10</strong>. Đủ điều kiện công
            nhận hoàn thành học phần Thực tập tốt nghiệp.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-md border border-slate-200 shrink-0 self-stretch md:self-auto justify-between md:justify-end">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
              Điểm tổng kết:
            </span>
            <span className="text-4xl font-bold text-amber-600 il-kpi-val">
              {student.totalScore || 9.2}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">
              Xếp loại:
            </span>
            <span className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-md border border-emerald-500">
              {student.gradeClassification || "Xuất sắc"}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 7: AUDIT LOG HISTORY (DRAFT, SUBMITTED, EDITED, COMPLETED) */}
      <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
          <History className="w-4 h-4 text-blue-600" />
          <span>7. Lịch sử trạng thái phiếu đánh giá (Audit History)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Step 1: Khởi tạo phiếu đánh giá */}
          <div
            className={`p-3 rounded-md border relative ${
              hasEvaluation
                ? "bg-emerald-50 border-emerald-200"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between font-bold mb-1">
              <span
                className={hasEvaluation ? "text-emerald-800" : "text-slate-500"}
              >
                1. Khởi tạo phiếu đánh giá
              </span>
              <CheckCircle2
                className={`w-4 h-4 ${
                  hasEvaluation ? "text-emerald-600" : "text-slate-300"
                }`}
              />
            </div>
            <p
              className={`text-[10px] ${
                hasEvaluation ? "text-emerald-700" : "text-slate-400"
              }`}
            >
              {hasEvaluation
                ? `${auditDate ?? "Đã tạo"} • Giảng viên tạo & chấm điểm`
                : "Chưa tạo phiếu"}
            </p>
          </div>

          {/* Step 2: Chốt điểm chính thức */}
          <div
            className={`p-3 rounded-md border relative ${
              isFinalized
                ? "bg-blue-600 border-blue-600 shadow-md"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between font-bold mb-1">
              <span
                className={isFinalized ? "text-white" : "text-slate-500"}
              >
                2. Chốt điểm chính thức
              </span>
              <Check
                className={`w-4 h-4 ${isFinalized ? "text-white" : "text-slate-300"}`}
              />
            </div>
            <p
              className={`text-[10px] ${
                isFinalized ? "text-blue-100" : "text-slate-400"
              }`}
            >
              {isFinalized
                ? `${auditDate ?? "Đã chốt"} • Phê duyệt chính thức`
                : hasEvaluation
                  ? "Phiếu đang ở trạng thái nháp"
                  : "Chưa thực hiện"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
