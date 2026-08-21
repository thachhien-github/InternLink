import { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Users,
  Award,
  Building2,
  Loader2,
  FileText,
  Printer,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Panel } from "../../../components/common/Panel";
import { USE_MOCK } from "../../../config/env";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { lecturerExportService } from "../../../services/lecturerExport.service";
import {
  EvaluationPdfModal,
  type StudentEvaluationItem,
} from "../components/EvaluationPdfModal";

const SAMPLE_STUDENT_FOR_PDF: StudentEvaluationItem = {
  id: "eval-sample",
  name: "Nguyễn Văn An",
  mssv: "20210001",
  class: "CNTT-K15A",
  major: "Kỹ thuật Phần mềm",
  company: "FPT Software",
  supervisor: "Nguyễn Văn Hải (Mentor)",
  weeklyReportCount: "12/12",
  enterpriseScore: 9.2,
  lecturerScore: 9.0,
  presentationScore: 9.5,
  totalScore: 9.2,
  status: "Hoàn thành",
  gradeClassification: "Xuất sắc",
  lecturerComments:
    "Sinh viên hoàn thành xuất sắc đề tài, có tinh thần trách nhiệm cao và áp dụng tốt kiến thức chuyên ngành vào thực tiễn.",
};

export const ExportView = ({
  onShowToast,
  studentCount = 28,
}: {
  onShowToast: (msg: string) => void;
  studentCount?: number;
}) => {
  const [includeGrades, setIncludeGrades] = useState(true);
  const [includeEnterpriseFeedback, setIncludeEnterpriseFeedback] =
    useState(true);
  const [includeWeeklySummary, setIncludeWeeklySummary] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const handleExportMockCsv = () => {
    const headers = [
      "STT",
      "Mã số SV",
      "Họ và tên",
      "Lớp",
      "Ngành học",
      "Doanh nghiệp thực tập",
      "Giảng viên hướng dẫn",
      "Số báo cáo tuần",
      "Điểm DN (40%)",
      "Điểm GV (40%)",
      "Điểm Bảo vệ (20%)",
      "Điểm Tổng kết",
      "Xếp loại",
      "Trạng thái",
      "Nhận xét",
    ];

    const sampleRows = [
      [
        1,
        '"20210001"',
        '"Nguyễn Văn An"',
        '"CNTT-K15A"',
        '"Kỹ thuật Phần mềm"',
        '"FPT Software"',
        '"ThS. Nguyễn Văn Phước"',
        '"12/12"',
        9.2,
        9.0,
        9.5,
        9.2,
        '"Xuất sắc"',
        '"Hoàn thành"',
        '"Hoàn thành xuất sắc đề tài"',
      ],
      [
        2,
        '"20210002"',
        '"Trần Thị Bình"',
        '"CNTT-K15B"',
        '"Khoa học Dữ liệu"',
        '"Viettel Telecom"',
        '"ThS. Nguyễn Văn Phước"',
        '"12/12"',
        9.5,
        9.3,
        9.0,
        9.3,
        '"Xuất sắc"',
        '"Hoàn thành"',
        '"Báo cáo Data Pipeline xuất sắc"',
      ],
      [
        3,
        '"20210003"',
        '"Lê Hoàng Cường"',
        '"HTTT-K15"',
        '"Hệ thống Thông tin"',
        '"VNG Corporation"',
        '"ThS. Nguyễn Văn Phước"',
        '"11/12"',
        8.5,
        8.0,
        8.5,
        8.3,
        '"Giỏi"',
        '"Hoàn thành"',
        '"Kiến trúc Cloud tốt"',
      ],
      [
        4,
        '"20210004"',
        '"Phạm Minh Đức"',
        '"CNTT-K15A"',
        '"Kỹ thuật Phần mềm"',
        '"MISA Joint Stock Co."',
        '"ThS. Nguyễn Văn Phước"',
        '"12/12"',
        8.8,
        8.5,
        8.8,
        8.7,
        '"Giỏi"',
        '"Hoàn thành"',
        '"Kỹ năng đáp ứng tốt chuẩn"',
      ],
    ];

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...sampleRows.map((r) => r.join(","))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bang_Diem_Tong_Hop_Thuc_Tap_HK1_2026.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast(`Đã xuất và tải xuống bảng điểm tổng hợp (.csv) thành công!`);
  };

  const handleExport = async () => {
    if (USE_MOCK) {
      handleExportMockCsv();
      return;
    }
    setIsExporting(true);
    try {
      const { blob, filename } =
        await lecturerExportService.downloadEndOfTerm();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast(`Đã tải xuống ${filename}`);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const { blob, filename } =
        await lecturerExportService.downloadEndOfTermPdf();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onShowToast(`Đã xuất và tải xuống ${filename}`);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-5 max-w-[900px] mx-auto animate-in fade-in duration-200">
      <PageHeader
        icon={FileSpreadsheet}
        title="Export cuối kỳ & Báo cáo tổng hợp"
        subtitle="Xuất bảng điểm toàn khóa, nhận xét doanh nghiệp và phiếu đánh giá chuẩn mẫu trường."
        actions={[
          {
            label: "Mẫu Phiếu Đánh Giá (In/Xem)",
            icon: Printer,
            onClick: () => setShowPdfModal(true),
            variant: "secondary",
          },
          {
            label: isExportingPdf ? "Đang xuất PDF…" : "Xuất Báo Cáo PDF",
            icon: isExportingPdf ? Loader2 : FileText,
            onClick: () => {
              if (!isExportingPdf) void handleExportPdf();
            },
            variant: "secondary",
          },
          {
            label: isExporting ? "Đang xuất…" : "Xuất Bảng Điểm (.xlsx)",
            icon: isExporting ? Loader2 : Download,
            onClick: () => {
              if (!isExporting) void handleExport();
            },
            variant: "primary",
          },
        ]}
      />

      <Panel className="space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Tùy chọn xuất dữ liệu đợt thực tập
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu tổng hợp toàn bộ sinh viên được phân công cho Giảng viên
            hướng dẫn trong học kỳ hiện tại.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-lg">
            <Users className="w-4 h-4 text-blue-600 mb-1.5" />
            <p className="font-bold text-slate-900">{studentCount} sinh viên</p>
            <p className="text-slate-500">Đợt HK I 2025-2026</p>
          </div>
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-lg">
            <Award className="w-4 h-4 text-emerald-600 mb-1.5" />
            <p className="font-bold text-slate-900">Điểm & xếp loại</p>
            <p className="text-slate-500">GVHD + DN + Hội đồng</p>
          </div>
          <div className="p-3.5 bg-sky-50/60 border border-sky-100 rounded-lg">
            <Building2 className="w-4 h-4 text-sky-600 mb-1.5" />
            <p className="font-bold text-slate-900">Doanh nghiệp</p>
            <p className="text-slate-500">Mentor & phản hồi định kỳ</p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={includeGrades}
              onChange={(e) => setIncludeGrades(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Bảng điểm tổng hợp & xếp loại học lực toàn khóa (Thang điểm 10 & Thang 4)</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEnterpriseFeedback}
              onChange={(e) => setIncludeEnterpriseFeedback(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Phản hồi chi tiết và nhận xét từ Người hướng dẫn doanh nghiệp (Mentor)</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={includeWeeklySummary}
              onChange={(e) => setIncludeWeeklySummary(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Tóm tắt tiến độ 12 tuần nhật ký thực tập và minh chứng đính kèm</span>
          </label>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">
              Định dạng tệp hỗ trợ:
            </p>
            <p>
              • <strong>Excel (.xlsx / .csv)</strong>: Chứa đầy đủ 15 trường thông tin chi tiết phục vụ nhập điểm vào hệ thống Đào tạo trường.<br/>
              • <strong>Phiếu Đánh Giá (PDF)</strong>: Mẫu văn bản chuẩn Bộ Giáo Dục với Quốc hiệu, tiêu chí Rubric và 3 chữ ký xác nhận.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Endpoint API đồng bộ: <code className="font-mono text-slate-700">GET /api/Lecturer/export/end-of-term</code>
        </div>
      </Panel>

      {/* PDF Modal */}
      {showPdfModal && (
        <EvaluationPdfModal
          student={SAMPLE_STUDENT_FOR_PDF}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
};

export { ExportView as LecturerExportView };
