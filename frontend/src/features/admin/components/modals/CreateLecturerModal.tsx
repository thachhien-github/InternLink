import { useState } from "react";
import { UserPlus, X, Save } from "lucide-react";

export interface CreateLecturerFormPayload {
  staffCode: string;
  fullName: string;
  email?: string;
  phone?: string;
  department?: string;
  grantAccount?: boolean;
}

const emptyForm: CreateLecturerFormPayload = {
  staffCode: "",
  fullName: "",
  email: "",
  phone: "",
  department: "",
  grantAccount: false,
};

interface CreateLecturerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onAddLecturer?: (payload: CreateLecturerFormPayload) => void | Promise<void>;
}

export const CreateLecturerModal = ({
  isOpen,
  onClose,
  onShowToast,
  onAddLecturer,
}: CreateLecturerModalProps) => {
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const setField = (key: keyof CreateLecturerFormPayload, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const staffCode = form.staffCode.trim();
    const fullName = form.fullName.trim();

    if (!staffCode) {
      onShowToast("Vui lòng nhập mã giảng viên (MaGV)!");
      return;
    }
    if (!fullName) {
      onShowToast("Vui lòng nhập họ và tên giảng viên!");
      return;
    }

    const payload: CreateLecturerFormPayload = {
      staffCode,
      fullName,
      email: form.email?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      department: form.department?.trim() || undefined,
      grantAccount: form.grantAccount,
    };

    setIsSaving(true);
    try {
      if (onAddLecturer) await onAddLecturer(payload);
      onShowToast(`Đã thêm giảng viên ${fullName} (${staffCode})`);
      setForm(emptyForm);
      onClose();
    } catch {
      /* parent shows API error */
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-md max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Thêm giảng viên</h3>
              <p className="text-[11px] text-slate-500">
                Cùng cột với file mẫu import Excel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="p-5 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                MaGV <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.staffCode}
                onChange={(e) => setField("staffCode", e.target.value)}
                placeholder="GV001"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-mono font-bold outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Họ tên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-bold outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="nguyenvana@university.edu.vn"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">SDT</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="0901234567"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Bộ môn</label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => setField("department", e.target.value)}
                placeholder="CNTT"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 p-3 bg-emerald-50 border border-emerald-100 rounded-md cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(form.grantAccount)}
              onChange={(e) => setField("grantAccount", e.target.checked)}
              className="mt-0.5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-emerald-900 leading-relaxed">
              <strong>Cấp tài khoản ngay</strong> — Username = MaGV, mật khẩu tạm 8 ký
              tự ngẫu nhiên. Gửi email nếu có địa chỉ. Lần đăng nhập đầu bắt buộc đổi
              mật khẩu.
            </span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Đang lưu…" : "Lưu giảng viên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
