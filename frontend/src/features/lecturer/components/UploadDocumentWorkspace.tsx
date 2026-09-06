import { useState, useRef } from "react";
import { Toast } from "../../../components/common/Toast";
import { ArrowLeft, CloudUpload, Save, X } from "lucide-react";
import type { DocumentItem } from "../../../types/document";

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
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addFiles = (files: File[]) => {
    if (!files.length) return;
    setRawFiles((prev) => {
      const combined = [...prev, ...files];
      if (combined.length > 20) {
        triggerToast("Chỉ chấp nhận tối đa 20 tệp");
        return prev;
      }
      return combined;
    });
    triggerToast(`Đã chọn ${files.length} tệp`);
  };

  const removeFile = (idx: number) => {
    setRawFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = (isDraft = false) => {
    if (!isDraft && rawFiles.length === 0) {
      triggerToast("Vui lòng chọn file trước khi tải lên");
      return;
    }

    const payload = {
      rawFiles,
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
                {isEditing ? `Chỉnh sửa tài liệu: ${initialData.title}` : "Tải tài liệu lên"}
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Chọn file trên máy và tải lên kho tài liệu thực tập.
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
            onClick={() => handleSubmit(false)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Tải lên</span>
          </button>
        </div>
      </div>

      {/* UPLOAD AREA */}
      <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
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
            multiple
            onChange={(e) => {
              if (e.target.files) addFiles(Array.from(e.target.files));
              e.target.value = "";
            }}
          />
          {rawFiles.length > 0 ? (
            <div className="max-w-lg mx-auto space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700">
                  {rawFiles.length} tệp đã chọn
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRawFiles([]);
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold"
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5">
                {rawFiles.map((f, idx) => {
                  const ext = f.name.split(".").pop()?.toUpperCase() || "DOCX";
                  const size = (f.size / (1024 * 1024)).toFixed(1);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white p-2 rounded border border-slate-200 shadow-sm text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-slate-800 w-7">{ext}</span>
                        <span className="text-slate-600 truncate">{f.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 w-16 text-right">
                          {size} MB
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <CloudUpload className="w-7 h-7" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">
                  Kéo &amp; Thả nhiều tệp vào đây, hoặc{" "}
                  <span className="text-blue-600 underline">duyệt tệp từ máy tính</span>
                </p>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Tối đa 25MB mỗi tệp (DOCX, PDF, XLSX, PPTX, ZIP)
                </p>
              </div>
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
    </div>
  );
};
