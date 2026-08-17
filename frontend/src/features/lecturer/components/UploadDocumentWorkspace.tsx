import { useState, useRef } from "react";
import { Toast } from "../../../components/common/Toast";
import { ArrowLeft, CloudUpload, Save, Clock, X } from "lucide-react";
export const UploadDocumentWorkspace = ({ initialData, onBack, onSave }) => {
  const isEditing = !!initialData;
  const fileInputRef = useRef(null);
  const [rawFile, setRawFile] = useState(null);
  const [title, setTitle] = useState(initialData?.title || "");
  const [category, setCategory] = useState(
    initialData?.category || "Bi\u1EC3u m\u1EABu",
  );
  const [semester, setSemester] = useState(
    initialData?.semester || "HK I - 2026",
  );
  const [major, setMajor] = useState(
    initialData?.major || "T\u1EA5t c\u1EA3 ng\xE0nh",
  );
  const [description, setDescription] = useState(
    initialData?.description ||
      "Bi\u1EC3u m\u1EABu chu\u1EA9n ban h\xE0nh theo quy \u0111\u1ECBnh c\u1EE7a Khoa C\xF4ng ngh\u1EC7 Th\xF4ng tin n\u0103m h\u1ECDc 2026.",
  );
  const [uploadedFile, setUploadedFile] = useState(
    initialData
      ? {
          name: `${initialData.title}.${initialData.fileType.toLowerCase()}`,
          size: initialData.fileSize,
          type: initialData.fileType,
        }
      : null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [versionNumber, setVersionNumber] = useState(
    initialData?.version || "v2.0",
  );
  const [releaseNote, setReleaseNote] = useState(
    "B\u1ED5 sung ti\xEAu chu\u1EA9n nh\u1EADn di\u1EC7n m\u1EDBi, c\u1EADp nh\u1EADt ma tr\u1EADn thang \u0111i\u1EC3m 100.",
  );
  const [visibility, setVisibility] = useState("T\u1EA5t c\u1EA3 sinh vi\xEAn");
  const [targetClass, setTargetClass] = useState("21DTH1, 21DTH2, 21DTH3");
  const [toastMessage, setToastMessage] = useState(null);
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const applyFile = (file) => {
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
  const handleFileDrop = (e) => {
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
      alert("Vui l\xF2ng nh\u1EADp t\xEAn t\xE0i li\u1EC7u!");
      return;
    }
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
      updatedAt: "H\xF4m nay",
      uploader: "TS. Gi\u1EA3ng vi\xEAn (You)",
      uploaderRole: "Gi\u1EA3ng vi\xEAn H\u01B0\u1EDBng d\u1EABn",
      status: isDraft
        ? "C\u1EA7n c\u1EADp nh\u1EADt"
        : "\u0110ang \xE1p d\u1EE5ng",
      description,
      downloads: initialData?.downloads || 0,
      rawFile,
      versionHistory: [
        {
          version: versionNumber,
          date: "H\xF4m nay",
          author: "TS. Gi\u1EA3ng vi\xEAn",
          note: releaseNote || "C\u1EADp nh\u1EADt t\xE0i li\u1EC7u",
        },
        ...(initialData?.versionHistory || []),
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
                {isEditing
                  ? `C\u1EADp nh\u1EADt t\xE0i li\u1EC7u: ${initialData.title}`
                  : "\u0110\u0103ng bi\u1EC3u m\u1EABu & T\xE0i li\u1EC7u m\u1EDBi"}
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Phát hành tài liệu, biểu mẫu và đề cương thực tập chuẩn hóa cho
              sinh viên toàn Khoa.
            </p>
          </div>
        </div>

        {/* Buttons */}
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
            <span>Phát hành tài liệu</span>
          </button>
        </div>
      </div>

      {/* FORM CONTENT */}
      <div className="space-y-6">
        {/* SECTION 1: THÔNG TIN TÀI LIỆU */}
        <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Thông tin tài liệu
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
              <label className="block font-bold text-slate-800 mb-1">
                Danh mục tài liệu
              </label>
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

            {/* Học kỳ */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Học kỳ áp dụng
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-900 focus:border-blue-500 focus:bg-white"
              >
                <option value="HK I - 2026">HK I - 2026 (Hiện tại)</option>
                <option value="HK II - 2025">HK II - 2025</option>
                <option value="HK II - 2024">HK II - 2024</option>
                <option value="Tất cả học kỳ">Tất cả học kỳ</option>
              </select>
            </div>

            {/* Ngành áp dụng */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                Chuyên ngành áp dụng
              </label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-900 focus:border-blue-500 focus:bg-white"
              >
                <option value="Tất cả ngành">
                  Tất cả chuyên ngành Khoa CNTT
                </option>
                <option value="Kỹ thuật Phần mềm">Kỹ thuật Phần mềm</option>
                <option value="Khoa học Dữ liệu">Khoa học Dữ liệu</option>
                <option value="An toàn Thông tin">An toàn Thông tin</option>
                <option value="Hệ thống Thông tin">Hệ thống Thông tin</option>
              </select>
            </div>

            {/* Mô tả chi tiết */}
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">
                Mô tả ngắn &amp; Hướng dẫn sử dụng
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

        {/* SECTION 2: DRAG & DROP UPLOAD AREA */}
        <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              2
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
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${isDragging ? "border-blue-600 bg-blue-50/80 scale-[1.01]" : "border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-slate-50"}`}
            onClick={handleSelectFile}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={(e) => applyFile(e.target.files?.[0])}
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
                    <span className="text-blue-600 underline">
                      duyệt tệp từ máy tính
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Dung lượng tối đa: 25MB mỗi tệp
                  </p>
                </div>

                {/* Supported Formats */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {[
                    "PDF",
                    "DOCX",
                    "XLSX",
                    "ZIP",
                    "RAR",
                    "PPTX",
                    "PNG",
                    "JPG",
                  ].map((ext) => (
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

        {/* SECTION 3: VERSION NUMBER & RELEASE NOTES */}
        <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              3
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

        {/* SECTION 4: VISIBILITY & PERMISSIONS */}
        <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              4
            </div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Phân quyền truy cập (Visibility Settings)
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="block font-bold text-slate-800">
              Đối tượng được phép xem &amp; tải tài liệu:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  id: "T\u1EA5t c\u1EA3 sinh vi\xEAn",
                  label: "T\u1EA5t c\u1EA3 sinh vi\xEAn",
                  desc: "C\xF4ng khai cho to\xE0n Khoa",
                },
                {
                  id: "Theo ng\xE0nh",
                  label: "Theo ng\xE0nh",
                  desc: "Ch\u1EC9 c\xE1c ng\xE0nh ch\u1EC9 \u0111\u1ECBnh",
                },
                {
                  id: "Theo l\u1EDBp",
                  label: "Theo l\u1EDBp",
                  desc: "Ch\u1EC9 l\u1EDBp h\u1ECDc ph\u1EA7n c\u1EE5 th\u1EC3",
                },
                {
                  id: "Theo h\u1ECDc k\u1EF3",
                  label: "Theo h\u1ECDc k\u1EF3",
                  desc: "Ch\u1EC9 sinh vi\xEAn HK I - 2026",
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setVisibility(opt.id)}
                  className={`p-3 rounded-md border cursor-pointer transition-all ${visibility === opt.id ? "bg-blue-50 border-blue-600 text-blue-900 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{opt.label}</span>
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === opt.id}
                      onChange={() => setVisibility(opt.id)}
                      className="accent-blue-600"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>

            {visibility === "Theo l\u1EDBp" && (
              <div className="pt-2">
                <label className="block font-bold text-slate-800 mb-1">
                  Mã lớp học phần áp dụng:
                </label>
                <input
                  type="text"
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  placeholder="VD: 21DTH1, 21DTH2..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none font-semibold text-slate-900"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
