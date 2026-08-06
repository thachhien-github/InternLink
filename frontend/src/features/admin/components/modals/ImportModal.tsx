import { useState } from 'react';
import { FileUp, X, Upload, Download, FileSpreadsheet } from 'lucide-react';
export const ImportModal = ({
  isOpen,
  type,
  onClose,
  onShowToast
}) => {
  const [fileName, setFileName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  if (!isOpen) return null;
  const isLecturer = type === "lecturers";
  const title = isLecturer ? "Import Gi\u1EA3ng vi\xEAn t\u1EEB Excel" : "Import Sinh vi\xEAn t\u1EEB Excel";
  const handleSimulatedUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onShowToast(`\u0110\xE3 import th\xE0nh c\xF4ng d\u1EEF li\u1EC7u ${isLecturer ? "42 Gi\u1EA3ng vi\xEAn" : "120 Sinh vi\xEAn"} v\xE0o h\u1EC7 th\u1ED1ng!`);
      onClose();
    }, 1e3);
  };
  return <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95">
        
        {
    /* Header */
  }
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{title}</h3>
              <p className="text-xs text-slate-500 font-medium">Đồng bộ danh sách theo mẫu file chuẩn (.xlsx, .csv)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Content */
  }
        <form onSubmit={handleSimulatedUpload} className="space-y-4 text-xs">
          
          {
    /* Download Template Link */
  }
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-700">File mẫu {isLecturer ? "Gi\u1EA3ng vi\xEAn" : "Sinh vi\xEAn"} chuẩn</span>
            </div>
            <button
    type="button"
    onClick={() => onShowToast(`\u0110\xE3 t\u1EA3i file m\u1EABu Mau_Import_${isLecturer ? "GiangVien" : "SinhVien"}.xlsx`)}
    className="text-blue-600 hover:text-blue-800 font-extrabold flex items-center gap-1"
  >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file mẫu</span>
            </button>
          </div>

          {
    /* Upload Area */
  }
          <div
    onClick={() => setFileName(isLecturer ? "DS_GiangVien_2026.xlsx" : "DS_SinhVien_K20.xlsx")}
    className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 p-6 rounded-2xl text-center space-y-2 cursor-pointer transition-colors"
  >
            <Upload className="w-8 h-8 text-indigo-600 mx-auto" />
            <div>
              <p className="font-extrabold text-slate-800 text-xs">
                {fileName ? fileName : "B\u1EA5m \u0111\u1EC3 ch\u1ECDn file ho\u1EB7c k\xE9o th\u1EA3 v\xE0o \u0111\xE2y"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Hỗ trợ các định dạng .XLSX, .XLS, .CSV (Tối đa 20MB)</p>
            </div>
          </div>

          {
    /* Buttons */
  }
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-colors"
  >
              Hủy
            </button>

            <button
    type="submit"
    disabled={isUploading}
    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
  >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u..." : "B\u1EAFt \u0111\u1EA7u Import"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>;
};
