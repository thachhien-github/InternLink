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
  Archive,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import type { DocumentItem } from "../../../types/document";

interface DocumentDetailWorkspaceProps {
  document: DocumentItem;
  onBack: () => void;
  onDownload: (doc: DocumentItem) => void;
  onArchiveToggle?: (doc: DocumentItem) => void;
}

export const DocumentDetailWorkspace = ({
  document,
  onBack,
  onDownload,
  onArchiveToggle,
}: DocumentDetailWorkspaceProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"info" | "logs">("info");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast("Đã sao chép liên kết tài liệu vào bộ nhớ tạm!");
  };

  const isCirculating =
    document.status === "Đang lưu hành" || (document as any).status === "Đang áp dụng";

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
            title="Quay lại danh sách"
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
              {/* Circulation Status Badge */}
              {isCirculating ? (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Đang lưu hành (Public SV tải về)
                </span>
              ) : document.status === "Bản nháp" ? (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Bản nháp (Chưa công khai)
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-300 rounded-md flex items-center gap-1">
                  <Archive className="w-3 h-3 text-slate-500" />
                  Ngưng lưu hành (Đã ẩn & Lưu vào log)
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              {document.title}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Đăng bởi <strong className="text-slate-800">{document.uploader}</strong> (
              {document.uploaderRole}) • Cập nhật ngày {document.updatedAt} • Đợt thực tập:{" "}
              <strong className="text-blue-700">{document.semester}</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={handleCopyLink}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors border border-slate-200 flex items-center gap-1.5"
          >
            <Copy className="w-4 h-4" />
            <span>Sao chép liên kết</span>
          </button>

          {onArchiveToggle && (
            <button
              onClick={() => onArchiveToggle(document)}
              className={`px-3 py-2 font-bold text-xs rounded-md transition-colors border flex items-center gap-1.5 ${
                isCirculating
                  ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300"
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>
                {isCirculating
                  ? "Ngưng lưu hành & Chuyển vào Log"
                  : "Mở lưu hành lại cho SV"}
              </span>
            </button>
          )}

          <button
            onClick={() => onDownload(document)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Tải xuống ({document.fileSize})</span>
          </button>
        </div>
      </div>

      {/* CIRCULATION STATUS BANNER */}
      {!isCirculating && (
        <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-lg flex items-start gap-3 text-amber-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-amber-900">
              Tài liệu này hiện KHÔNG còn lưu hành và đã bị ẩn khỏi sinh viên
            </p>
            <p className="text-amber-800 font-medium">
              Lý do ngưng lưu hành:{" "}
              <strong>
                {document.archiveReason ||
                  "Hết thời hạn áp dụng theo đợt thực tập / Đã chuyển sang biểu mẫu mới."}
              </strong>
            </p>
            {document.archivedAt && (
              <p className="text-[11px] text-amber-700">
                Thời gian thực hiện: {document.archivedAt}{" "}
                {document.archivedBy ? `bởi ${document.archivedBy}` : ""}
              </p>
            )}
          </div>
        </div>
      )}

      {isCirculating && (
        <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-lg flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Tài liệu đang được <strong>lưu hành công khai</strong> cho sinh viên thuộc đợt thực
              tập <strong>{document.semester}</strong> ({document.major}).
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200">
            Public Active
          </span>
        </div>
      )}

      {/* MAIN LAYOUT: PREVIEWER (8 cols) vs RIGHT SIDEBAR (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* INTERACTIVE DOCUMENT PREVIEWER (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-lg border border-slate-800 shadow-md overflow-hidden flex flex-col min-h-[600px]">
          {/* Toolbar */}
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">{document.fileType} Viewer</span>
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
              <span className="text-[11px] font-mono text-slate-400">{zoomLevel}%</span>
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
                  Ban hành theo Quyết định số 2026/QĐ-CNTT • Phiên bản {document.version}
                </p>
                {!isCirculating && (
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wide font-sans bg-rose-50 py-0.5 rounded">
                    [TÀI LIỆU ĐÃ NGƯNG LƯU HÀNH - LƯU TRỮ LOG ĐỐI SOÁT]
                  </p>
                )}
              </div>

              {/* Document Page Content Mock */}
              <div className="space-y-4 text-xs leading-relaxed text-slate-800 font-sans">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">1. QUI ĐỊNH CHUNG VỀ THỰC TẬP</h4>
                  <p className="text-slate-600 text-[11px]">
                    Sinh viên thực hiện quá trình thực tập tại các doanh nghiệp đối tác đã qua thẩm
                    định của Khoa. Thời gian tối thiểu là 12 tuần với tổng số giờ làm việc không
                    dưới 360 giờ.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">2. YÊU CẦU BÁO CÁO GIỮA KỲ &amp; CUỐI KỲ</h4>
                  <p className="text-slate-600 text-[11px]">
                    - Báo cáo giữa kỳ nộp vào tuần thứ 6 trên hệ thống InternLink.
                    <br />- Báo cáo cuối kỳ có chữ ký xác nhận của Mentor doanh nghiệp và đóng dấu
                    giáp lai.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                  <p className="font-bold text-slate-900 mb-0.5">Lưu ý đối với sinh viên:</p>
                  <p className="text-slate-600">
                    Sử dụng đúng phông chữ Arial / Times New Roman, cỡ chữ 12pt, giãn dòng 1.3
                    lines theo quy chuẩn.
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
          {/* Tabs for Sidebar */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveSidebarTab("info")}
              className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeSidebarTab === "info"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Thông tin tài liệu</span>
            </button>
            <button
              onClick={() => setActiveSidebarTab("logs")}
              className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                activeSidebarTab === "logs"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Nhật ký &amp; Log lưu trữ ({document.archiveLogs?.length || 0})</span>
            </button>
          </div>

          {activeSidebarTab === "info" ? (
            <div className="space-y-4">
              {/* Document Information Card */}
              <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Chi tiết văn bản</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Trạng thái lưu hành:</span>
                    <span
                      className={`px-2 py-0.5 font-bold text-[10px] rounded-md border ${
                        isCirculating
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {document.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Đợt thực tập áp dụng:</span>
                    <strong className="text-blue-700 font-bold">{document.semester}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Kích thước file:</span>
                    <strong className="text-slate-900">{document.fileSize}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Định dạng file:</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded border border-blue-200">
                      {document.fileType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Tổng lượt tải của SV:</span>
                    <strong className="text-blue-600 font-bold">
                      {document.downloads.toLocaleString()} lượt
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Phiên bản hiện tại:</span>
                    <strong className="text-emerald-600 font-bold">
                      {document.version} {document.isLatest ? "(Mới nhất)" : ""}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Ngành áp dụng:</span>
                    <strong className="text-slate-900">{document.major}</strong>
                  </div>

                  {document.description && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Mô tả &amp; Hướng dẫn:
                      </span>
                      <p className="text-slate-700 font-medium bg-slate-50 p-2.5 rounded-md border border-slate-200/80 leading-relaxed">
                        {document.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Version History */}
              <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Lịch sử các phiên bản tệp</span>
                </h3>

                <div className="space-y-2.5 max-h-52 overflow-y-auto">
                  {document.versionHistory?.map((vh, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-md border border-slate-100 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-blue-700">{vh.version}</span>
                        <span className="text-[10px] text-slate-400">{vh.date}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{vh.note}</p>
                      <p className="text-[10px] text-slate-400">Bởi: {vh.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ARCHIVE LOGS & AUDIT TRAIL TAB */
            <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Nhật ký lưu hành &amp; Log kiểm toán</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">Audit Trail</span>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Ghi nhận chi tiết toàn bộ các mốc phát hành, chuyển trạng thái lưu hành và lý do
                ngưng áp dụng văn bản.
              </p>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {document.archiveLogs && document.archiveLogs.length > 0 ? (
                  document.archiveLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                        log.action === "ARCHIVED"
                          ? "bg-amber-50/80 border-amber-200"
                          : log.action === "CIRCULATING"
                          ? "bg-emerald-50/80 border-emerald-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            log.action === "ARCHIVED"
                              ? "bg-amber-100 text-amber-800"
                              : log.action === "CIRCULATING"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          {log.actionLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {log.date}
                        </span>
                      </div>

                      {log.reason && (
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Lý do:</p>
                          <p className="text-slate-800 font-medium leading-relaxed bg-white/70 p-2 rounded border border-slate-200/60">
                            {log.reason}
                          </p>
                        </div>
                      )}

                      {log.note && (
                        <p className="text-[11px] text-slate-600 italic">
                          Ghi chú: {log.note}
                        </p>
                      )}

                      <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>
                          Thực hiện: <strong className="text-slate-700">{log.performedBy}</strong>
                        </span>
                        <span>{log.performedRole}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Chưa có nhật ký thay đổi trạng thái nào cho tài liệu này.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
