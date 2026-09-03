import { useState, useRef } from "react";
import { Toast } from "../../../components/common/Toast";
import { ArrowLeft, CloudUpload, Save, Clock, X, CheckCircle2, Archive } from "lucide-react";
import { useSemester } from "../../../contexts/SemesterContext";
import type { DocumentItem, DocumentStatus } from "../../../types/document";

interface UploadDocumentWorkspaceProps {
  initialData?: DocumentItem | null;
  onBack: () => void;
  onSave: (payload: any, isDraft?: boolean) => void;
}

export const UploadDocumentWorkspace = ({
  initialData,
  onBack,
  onSave,
}: UploadDocumentWorkspaceProps) => {
  const isEditing = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(initialData?.category || "Biểu mẫu");
  const { semesters } = useSemester();
  const [semester, setSemester] = useState(initialData?.semester || "");
  const [major, setMajor] = useState(initialData?.major || "");
  const [description, setDescription] = useState(
    initialData?.description ||
      "Biểu mẫu chuẩn ban hành theo quy định của Khoa Công nghệ Thông tin năm học 2026.",
  );
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(
    initialData
      ? {
          name: `${initialData.title}.${initialData.fileType.toLowerCase()}`,
          size: initialData.fileSize,
          type: initialData.fileType,
        }
      : null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [versionNumber, setVersionNumber] = useState(initialData?.version || "");
  const [releaseNote, setReleaseNote] = useState(
    "Bổ sung tiêu chuẩn nhận diện mới, cập nhật ma trận thang điểm 100.",
  );
  const [status, setStatus] = useState<DocumentStatus>(
    (initialData?.status as DocumentStatus) || "Đang lưu hành",
  );
  const [archiveReason, setArchiveReason] = useState(initialData?.archiveReason || "");
  const [visibility, setVisibility] = useState("Tất cả sinh viên");
  const [targetClass, setTargetClass] = useState("21DTH1, 21DTH2, 21DTH3");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const applyFile = (file: File) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toUpperCase() || "DOCX";
    setRawFile(file);
    setUploadedFile({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: ext,
    });
    triggerToast(`Đã đính kèm tệp: ${file.name}`);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      applyFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (isDraft = false) => {
    if (!isDraft && !title.trim()) {
      triggerToast("Vui lòng nhập tên tài liệu / biểu mẫu!");
      return;
    }

    const finalStatus: DocumentStatus = isDraft
      ? "Bản nháp"
      : status;

    const isPublished = finalStatus === "Đang lưu hành";

    const payload = {
      id: initialData?.id || `doc-${Date.now()}`,
      title,
      category,
      semester,
      major,
      fileType: uploadedFile?.type || "DOCX",
      fileSize: uploadedFile?.size || "1.2 MB",
      version: versionNumber,
      isLatest: true,
      updatedAt: new Date().toLocaleDateString("vi-VN"),
      uploader: "TS. Giảng viên (You)",
      uploaderRole: "Giảng viên Hướng dẫn",
      status: finalStatus,
      isPublished,
      description,
      downloads: initialData?.downloads || 0,
      rawFile,
      archiveReason: finalStatus === "Ngưng lưu hành" ? archiveReason || "Ngưng lưu hành theo kế hoạch" : undefined,
      archivedAt: finalStatus === "Ngưng lưu hành" ? new Date().toLocaleDateString("vi-VN") : undefined,
      archivedBy: finalStatus === "Ngưng lưu hành" ? "TS. Giảng viên" : undefined,
      versionHistory: [
        {
          version: versionNumber,
          date: new Date().toLocaleDateString("vi-VN"),
          author: "TS. Giảng viên",
          note: releaseNote || "Cập nhật tài liệu",
        },
        ...(initialData?.versionHistory || []),
      ],
      archiveLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          date: new Date().toLocaleDateString("vi-VN"),
          action: (finalStatus === "Ngưng lưu hành" ? "ARCHIVED" : finalStatus === "Đang lưu hành" ? "CIRCULATING" : "DRAFT") as any,
          actionLabel:
            finalStatus === "Ngưng lưu hành"
              ? "Ngưng lưu hành & Chuyển vào Log"
              : finalStatus === "Đang lưu hành"
              ? "Bắt đầu lưu hành chính thức (Public SV)"
              : "Lưu bản nháp",
          performedBy: "TS. Giảng viên",
          performedRole: "Giảng viên Hướng dẫn",
          reason: finalStatus === "Ngưng lưu hành" ? archiveReason || "Ngưng lưu hành theo đợt" : releaseNote,
          note: isPublished ? "Sinh viên trong đợt thực tập có thể thấy và tải về." : "Ẩn khỏi sinh viên, lưu log đối soát.",
          previousStatus: initialData?.status,
          newStatus: finalStatus,
        },
        ...(initialData?.archiveLogs || []),
      ],
    };

    onSave(payload, isDraft);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16 font-sans">
      {/* Toast alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* PAGE HEADER */}
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
              <CloudUpload className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {isEditing ? `Cập nhật biểu mẫu: ${initialData.title}` : "Đăng biểu mẫu & Tài liệu mới"}
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Phát hành biểu mẫu chuẩn hóa cho sinh viên tải về theo đợt thực tập. Quản lý trạng thái lưu hành và ghi log lưu trữ.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors border border-slate-200"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 font-bold text-xs rounded-md border border-amber-300 transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Lưu nháp</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{status === "Ngưng lưu hành" ? "Lưu tài liệu vào Log" : "Phát hành cho Sinh viên"}</span>
          </button>
        </div>
      </div>

      {/* FORM CONTENT */}
      <div className="space-y-6">
        {/* SECTION 1: TRẠNG THÁI LƯU HÀNH & ĐỢT THỰC TẬP */}
        <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Trạng thái lưu hành &amp; Đợt thực tập áp dụng
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <label className="block font-bold text-slate-800">
              Quyết định lưu hành biểu mẫu này:
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Option 1: Đang lưu hành */}
              <div
                onClick={() => setStatus("Đang lưu hành")}
                className={`p-4 rounded-lg border cursor-pointer transition-all space-y-1.5 ${
                  status === "Đang lưu hành"
                    ? "bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>🟢 Đang lưu hành (Public SV)</span>
                  </div>
                  <input
                    type="radio"
                    name="doc_status"
                    checked={status === "Đang lưu hành"}
                    onChange={() => setStatus("Đang lưu hành")}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-600">
                  Cho phép công khai cho sinh viên trong đợt thực tập này nhìn thấy và tải về.
                </p>
              </div>

              {/* Option 2: Ngưng lưu hành */}
              <div
                onClick={() => setStatus("Ngưng lưu hành")}
                className={`p-4 rounded-lg border cursor-pointer transition-all space-y-1.5 ${
                  status === "Ngưng lưu hành"
                    ? "bg-amber-50/80 border-amber-500 text-amber-950 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800">
                    <Archive className="w-4 h-4" />
                    <span>📦 Ngưng lưu hành (Lưu vào Log)</span>
                  </div>
                  <input
                    type="radio"
                    name="doc_status"
                    checked={status === "Ngưng lưu hành"}
                    onChange={() => setStatus("Ngưng lưu hành")}
                    className="accent-amber-600"
                  />
                </div>
                <p className="text-[11px] text-slate-600">
                  Không còn lưu hành nữa, ẩn khỏi sinh viên và lưu trữ đầy đủ thông tin vào nhật ký log.
                </p>
              </div>

              {/* Option 3: Bản nháp */}
              <div
                onClick={() => setStatus("Bản nháp")}
                className={`p-4 rounded-lg border cursor-pointer transition-all space-y-1.5 ${
                  status === "Bản nháp"
                    ? "bg-blue-50/80 border-blue-500 text-blue-950 shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-blue-700">
                    <Clock className="w-4 h-4" />
                    <span>📝 Bản nháp (Chưa phát hành)</span>
                  </div>
                  <input
                    type="radio"
                    name="doc_status"
                    checked={status === "Bản nháp"}
                    onChange={() => setStatus("Bản nháp")}
                    className="accent-blue-600"
                  />
                </div>
                <p className="text-[11px] text-slate-600">
                  Lưu tạm để tiếp tục chỉnh sửa nội dung, chưa phát hành ra ngoài.
                </p>
              </div>
            </div>

            {status === "Ngưng lưu hành" && (
              <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
                <label className="block font-bold text-amber-900">
                  Lý do ngưng lưu hành (Ghi nhận vào Log kiểm toán) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={archiveReason}
                  onChange={(e) => setArchiveReason(e.target.value)}
                  placeholder="VD: Hết hạn nộp HK I - 2026, Đã thay thế bằng Mẫu chuẩn v2.1, Thay đổi quy định Bộ môn..."
                  className="w-full p-2.5 bg-white border border-amber-300 rounded-md outline-none font-medium text-slate-900 focus:border-amber-600"
                />
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: THÔNG TIN TÀI LIỆU */}
        <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Thông tin chi tiết biểu mẫu
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Tên tài liệu */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                Tên tài liệu / Biểu mẫu <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Mẫu Báo cáo Thực tập Giữa kỳ & Cuối kỳ (Chuẩn 2026)..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-900 focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* Danh mục */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">Danh mục tài liệu</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-900 focus:border-blue-500 focus:bg-white"
              >
                <option value="Biểu mẫu">📁 Biểu mẫu</option>
                <option value="Báo cáo">📁 Báo cáo</option>
                <option value="Nhật ký">📁 Nhật ký</option>
                <option value="Kế hoạch">📁 Kế hoạch</option>
                <option value="Hướng dẫn">📁 Hướng dẫn</option>
                <option value="Văn bản khoa">📁 Văn bản khoa</option>
                <option value="Khác">📁 Khác</option>
              </select>
            </div>

            {/* Học kỳ / Đợt thực tập */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">Đợt thực tập / Học kỳ</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-900 focus:border-blue-500 focus:bg-white"
              >
                {semesters.map((s) => (
                  <option key={s.id} value={s.name}>{s.name} ({s.status === "active" ? "Đang diễn ra" : s.status === "upcoming" ? "Sắp tới" : "Đã đóng"})</option>
                ))}
                <option value="Tất cả học kỳ">Tất cả học kỳ</option>
              </select>
            </div>

            {/* Ngành áp dụng */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">Chuyên ngành áp dụng</label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-900 focus:border-blue-500 focus:bg-white"
              >
                <option value="Tất cả ngành">Tất cả chuyên ngành Khoa CNTT</option>
                <option value="Kỹ thuật Phần mềm">Kỹ thuật Phần mềm</option>
                <option value="Khoa học Dữ liệu">Khoa học Dữ liệu</option>
                <option value="An toàn Thông tin">An toàn Thông tin</option>
                <option value="Hệ thống Thông tin">Hệ thống Thông tin</option>
              </select>
            </div>

            {/* Mô tả chi tiết */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                Mô tả ngắn &amp; Hướng dẫn sử dụng cho sinh viên
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập ghi chú hướng dẫn sinh viên cách điền thông tin hoặc thời hạn nộp file..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-md outline-none font-medium text-slate-800 focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: DRAG & DROP UPLOAD AREA */}
        <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Tệp tài liệu (Upload File)
            </h2>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? "border-blue-600 bg-blue-50/80 scale-[1.01]"
                : "border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-slate-50"
            }`}
            onClick={handleSelectFile}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={(e) => applyFile(e.target.files?.[0] as File)}
            />
            {uploadedFile ? (
              <div className="max-w-md mx-auto bg-white p-4 rounded-lg border border-blue-200 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                    {uploadedFile.type}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-xs truncate max-w-[200px]">
                      {uploadedFile.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {uploadedFile.size} • Đã sẵn sàng phát hành
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                    setRawFile(null);
                  }}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                  <CloudUpload className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    Kéo &amp; Thả tệp vào đây, hoặc{" "}
                    <span className="text-blue-600 underline">duyệt tệp từ máy tính</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Dung lượng tối đa: 25MB mỗi tệp (Hỗ trợ DOCX, PDF, XLSX, PPTX, ZIP)
                  </p>
                </div>

                {/* Supported Formats */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {["PDF", "DOCX", "XLSX", "ZIP", "RAR", "PPTX"].map((ext) => (
                    <span
                      key={ext}
                      className="px-2 py-0.5 bg-white text-slate-600 border border-slate-200 font-bold text-[10px] rounded-md shadow-2xs"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: VERSION NUMBER & RELEASE NOTES */}
        <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              4
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Phiên bản &amp; Ghi chú phát hành (Version Control)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Số phiên bản (Version Number)
              </label>
              <input
                type="text"
                value={versionNumber}
                onChange={(e) => setVersionNumber(e.target.value)}
                placeholder="VD: v2.0, v2.1..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-bold text-blue-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                Ghi chú thay đổi (Release Notes)
              </label>
              <input
                type="text"
                value={releaseNote}
                onChange={(e) => setReleaseNote(e.target.value)}
                placeholder="VD: Bổ sung tiêu chuẩn chấm điểm và phụ lục nhận xét..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-medium text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
