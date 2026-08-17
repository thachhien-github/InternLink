import { useState } from "react";
import { Toast } from "../../../components/common/Toast";
import {
  ArrowLeft,
  Download,
  Copy,
  History,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
export const DocumentDetailWorkspace = ({ document, onBack, onDownload }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [toastMessage, setToastMessage] = useState(null);
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast(
      "\u0110\xE3 sao ch\xE9p li\xEAn k\u1EBFt t\xE0i li\u1EC7u v\xE0o b\u1ED9 nh\u1EDB t\u1EA1m!",
    );
  };
  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16 font-sans">
      {/* Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* HEADER */}
      <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors border border-slate-200"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md uppercase">
                {document.category}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                Phiên bản {document.version}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              {document.title}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Đăng bởi{" "}
              <strong className="text-slate-800">{document.uploader}</strong> (
              {document.uploaderRole}) • Cập nhật ngày {document.updatedAt}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleCopyLink}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors border border-slate-200 flex items-center gap-1.5"
          >
            <Copy className="w-4 h-4" />
            <span>Sao chép liên kết</span>
          </button>

          <button
            onClick={() => onDownload(document)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Tải xuống ({document.fileSize})</span>
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT: PREVIEWER (8 cols) vs RIGHT SIDEBAR (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* INTERACTIVE DOCUMENT PREVIEWER (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-lg border border-slate-800 shadow-md overflow-hidden flex flex-col min-h-[600px]">
          {/* Toolbar */}
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">
                {document.fileType} Viewer
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-medium">
                Trang {currentPage} / {totalPages}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-400">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(200, z + 10))}
                className="p-1 hover:bg-slate-700 rounded text-slate-300"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-700 mx-1" />

              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 hover:bg-slate-700 disabled:opacity-40 rounded text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1 hover:bg-slate-700 disabled:opacity-40 rounded text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Document Content Canvas View */}
          <div className="flex-1 p-8 bg-slate-950/80 overflow-auto flex items-center justify-center">
            <div
              style={{ transform: `scale(${zoomLevel / 100})` }}
              className="bg-white text-slate-900 p-10 rounded-md shadow-md max-w-xl w-full min-h-[500px] transition-transform origin-top space-y-6 font-serif border border-slate-200"
            >
              {/* Document Header Mock */}
              <div className="text-center space-y-1 border-b pb-4 border-slate-200">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-sans">
                  TRƯỜNG ĐẠI HỌC • KHOA CÔNG NGHỆ THÔNG TIN
                </p>
                <h2 className="text-base font-bold text-slate-900 uppercase leading-snug">
                  {document.title}
                </h2>
                <p className="text-[11px] italic text-slate-600 font-sans">
                  Ban hành theo Quyết định số 2026/QĐ-CNTT • Phiên bản{" "}
                  {document.version}
                </p>
              </div>

              {/* Document Page Content Mock */}
              <div className="space-y-4 text-xs leading-relaxed text-slate-800 font-sans">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">
                    1. QUI ĐỊNH CHUNG VỀ THỰC TẬP
                  </h4>
                  <p className="text-slate-600 text-[11px]">
                    Sinh viên thực hiện quá trình thực tập tại các doanh nghiệp
                    đối tác đã qua thẩm định của Khoa. Thời gian tối thiểu là 12
                    tuần với tổng số giờ làm việc không dưới 360 giờ.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">
                    2. YÊU CẦU BÁO CÁO GIỮA KỲ &amp; CUỐI KỲ
                  </h4>
                  <p className="text-slate-600 text-[11px]">
                    - Báo cáo giữa kỳ nộp vào tuần thứ 6 trên hệ thống
                    InternLink.
                    <br />- Báo cáo cuối kỳ có chữ ký xác nhận của Mentor doanh
                    nghiệp và đóng dấu giáp lai.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                  <p className="font-bold text-slate-900 mb-0.5">
                    Lưu ý đối với sinh viên:
                  </p>
                  <p className="text-slate-600">
                    Sử dụng đúng phông chữ Arial / Times New Roman, cỡ chữ 12pt,
                    giãn dòng 1.3 lines theo quy chuẩn.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] font-sans text-slate-400">
                <span>Học kỳ: {document.semester}</span>
                <span>
                  Trang {currentPage} / {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Document Information Card */}
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Thông tin tài liệu</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">
                  Kích thước file:
                </span>
                <strong className="text-slate-900">{document.fileSize}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">
                  Định dạng file:
                </span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded border border-blue-200">
                  {document.fileType}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">
                  Tổng lượt tải xuống:
                </span>
                <strong className="text-blue-600 font-bold">
                  {document.downloads.toLocaleString()} lượt
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">
                  Phiên bản hiện tại:
                </span>
                <strong className="text-emerald-600 font-bold">
                  {document.version} (Latest)
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">
                  Ngành áp dụng:
                </span>
                <strong className="text-slate-900">{document.major}</strong>
              </div>
            </div>
          </div>

          {/* Version History Log */}
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-blue-600" />
              <span>Lịch sử các phiên bản</span>
            </h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {document.versionHistory?.map((vh, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-md border border-slate-100 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-700">
                      {vh.version}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {vh.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    {vh.note}
                  </p>
                  <p className="text-[10px] text-slate-400">Bởi: {vh.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
