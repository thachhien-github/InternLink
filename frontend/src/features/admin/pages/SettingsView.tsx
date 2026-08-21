import { useState, useEffect } from "react";
import {
  Sliders,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  HardDrive,
  Save,
  RotateCcw,
  Send,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { ConfirmDialog } from "../../../components/common/ConfirmDialog";
import { USE_MOCK } from "../../../config/env";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { adminEmailService } from "../../../services/adminEmail.service";
import {
  adminSettingsService,
  type AdminFacultySettings,
} from "../../../services/adminSettings.service";

type FacultySettings = AdminFacultySettings;

const DEFAULT_FACULTY_SETTINGS: FacultySettings = {
  departmentName: "Khoa Công nghệ Thông tin",
  supportEmail: "internlink.cntt@gmail.com",
  phone: "0906891704",
  address: "Tòa nhà A, 227 Nguyễn Văn Cừ, Q.5, TP.HCM",
  maxStudentsPerLecturer: 30,
  defaultReportDeadlineDay: "Chủ Nhật (23:59)",
  maxFileSizeMb: 25,
  allowLateSubmission: true,
  autoLockSemesterEnd: true,
};

const STORAGE_KEY = "internlink_faculty_settings";

export const SettingsView = ({
  onShowToast,
}: {
  onShowToast: (msg: string) => void;
  onNavigateTab?: (tab: string) => void;
}) => {
  const [settings, setSettings] = useState<FacultySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_FACULTY_SETTINGS, ...JSON.parse(saved) };
      }
      return DEFAULT_FACULTY_SETTINGS;
    } catch {
      return DEFAULT_FACULTY_SETTINGS;
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (USE_MOCK) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await adminSettingsService.getSettings();
        if (!cancelled && data) {
          setSettings(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } catch {
        // Fallback to local storage
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!settings.departmentName.trim()) {
      onShowToast("Vui lòng nhập Tên Khoa / Đơn vị quản lý.");
      return;
    }
    if (!settings.supportEmail.trim()) {
      onShowToast("Vui lòng nhập Email hỗ trợ.");
      return;
    }

    setIsSaving(true);
    try {
      if (!USE_MOCK) {
        const updated = await adminSettingsService.updateSettings(settings);
        setSettings(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      }
      onShowToast("Đã lưu các thiết lập cài đặt thành công!");
    } catch (err) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      onShowToast(`Đã lưu cục bộ: ${getApiErrorMessage(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    setIsSaving(true);
    try {
      if (!USE_MOCK) {
        const res = await adminSettingsService.resetSettings();
        setSettings(res);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
      } else {
        setSettings(DEFAULT_FACULTY_SETTINGS);
        localStorage.removeItem(STORAGE_KEY);
      }
      onShowToast("Đã khôi phục tất cả cài đặt về giá trị mặc định của Khoa.");
    } catch (err) {
      setSettings(DEFAULT_FACULTY_SETTINGS);
      localStorage.removeItem(STORAGE_KEY);
      onShowToast(`Đã khôi phục mặc định: ${getApiErrorMessage(err)}`);
    } finally {
      setIsSaving(false);
      setShowResetConfirm(false);
    }
  };

  const handleTestEmail = async () => {
    const toEmail = settings.supportEmail.trim();
    if (!toEmail) {
      onShowToast("Vui lòng nhập email hỗ trợ trước khi gửi thử.");
      return;
    }
    if (USE_MOCK) {
      onShowToast(`[Thử nghiệm] Đã gửi thông báo kiểm tra tới ${toEmail}`);
      return;
    }
    setIsTestingEmail(true);
    try {
      await adminEmailService.testEmail({
        toEmail,
        fullName: "Quản trị viên Khoa",
        role: "Admin",
      });
      onShowToast(`Đã gửi email kiểm tra kết nối tới ${toEmail}`);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto min-w-0 font-sans pb-12 animate-in fade-in">
      {/* 1. PAGE HEADER */}
      <PageHeader
        icon={Sliders}
        title="Cài đặt & Thông tin Khoa (Faculty Settings)"
        subtitle="Quản lý thông tin liên hệ chính thức của Khoa và các tham số quy định thực tập nội bộ."
        actions={[
          {
            label: "Khôi phục mặc định",
            icon: RotateCcw,
            onClick: () => setShowResetConfirm(true),
            variant: "secondary",
          },
        ]}
      >
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
        </button>
      </PageHeader>

      {/* 2. SUMMARY STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-md shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Đơn vị quản lý
            </span>
            <p className="font-bold text-slate-900 truncate" title={settings.departmentName}>
              {settings.departmentName}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-md shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Email hỗ trợ
            </span>
            <p className="font-bold text-slate-900 truncate" title={settings.supportEmail}>
              {settings.supportEmail}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-md shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              SV tối đa / Giảng viên
            </span>
            <p className="font-bold text-slate-900">
              {settings.maxStudentsPerLecturer} sinh viên / GV
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-md shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
              Hạn nộp báo cáo
            </span>
            <p className="font-bold text-slate-900 truncate">
              {settings.defaultReportDeadlineDay}
            </p>
          </div>
        </div>
      </div>

      {/* 3. SETTINGS FORM */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: FACULTY CONTACT INFORMATION */}
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                1. Thông tin Liên hệ Khoa &amp; Ban Quản lý
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Thông tin xuất hiện trên các văn bản, thông báo và hỗ trợ sinh viên liên hệ.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tên Khoa / Đơn vị chủ quản <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={settings.departmentName}
                  onChange={(e) =>
                    setSettings({ ...settings, departmentName: e.target.value })
                  }
                  placeholder="Ví dụ: Khoa Công nghệ Thông tin"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Số điện thoại / Hotline văn phòng Khoa
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  placeholder="Ví dụ: 0906891704"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email liên hệ hỗ trợ thực tập <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={settings.supportEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, supportEmail: e.target.value })
                    }
                    placeholder="internlink.cntt@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={isTestingEmail}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md border border-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
                  title="Gửi email kiểm tra"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isTestingEmail ? "Đang gửi..." : "Gửi thử"}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Địa chỉ văn phòng Khoa
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  placeholder="Ví dụ: Tòa nhà A, 227 Nguyễn Văn Cừ, Q.5, TP.HCM"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: INTERNSHIP RULES & PARAMETERS */}
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                2. Quy tắc Thực tập &amp; Hạn nộp Báo cáo
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Thiết lập hạn mức phân công giảng viên, thời hạn nộp bài và dung lượng tệp cho phép.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Số sinh viên tối đa / 1 Giảng viên
              </label>
              <div className="relative">
                <Users className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={settings.maxStudentsPerLecturer}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxStudentsPerLecturer: Number(e.target.value),
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-blue-500 font-bold text-slate-900"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Cảnh báo khi phân công vượt định mức.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Hạn nộp báo cáo tuần mặc định
              </label>
              <select
                value={settings.defaultReportDeadlineDay}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultReportDeadlineDay: e.target.value,
                  })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-blue-500 font-medium text-slate-900"
              >
                <option value="Chủ Nhật (23:59)">Chủ Nhật (23:59 hàng tuần)</option>
                <option value="Thứ Bảy (23:59)">Thứ Bảy (23:59 hàng tuần)</option>
                <option value="Thứ Sáu (17:00)">Thứ Sáu (17:00 hàng tuần)</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Mốc tính trễ hạn nộp báo cáo tuần.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Dung lượng tệp đính kèm tối đa
              </label>
              <div className="relative">
                <HardDrive className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={settings.maxFileSizeMb}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxFileSizeMb: Number(e.target.value),
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-blue-500 font-bold text-slate-900"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Giới hạn dung lượng mỗi tệp (MB).
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-md border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Cho phép sinh viên nộp trễ báo cáo tuần
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Báo cáo nộp sau hạn chót vẫn được ghi nhận nhưng hiển thị nhãn &quot;Nộp trễ&quot; để GVHD theo dõi.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowLateSubmission}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allowLateSubmission: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-md border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Tự động khóa chỉnh sửa điểm khi học kỳ kết thúc
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Ngăn chặn việc sửa đổi bảng điểm và báo cáo sau khi kỳ thực tập chính thức đóng.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoLockSemesterEnd}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoLockSemesterEnd: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* BOTTOM SAVE BAR */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Các thay đổi được áp dụng ngay sau khi lưu.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-md border border-slate-200 transition-colors"
            >
              Đặt lại mặc định
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Đang lưu..." : "Lưu cài đặt"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* CONFIRM RESET DIALOG */}
      <ConfirmDialog
        open={showResetConfirm}
        title="Khôi phục cài đặt mặc định"
        description="Bạn có chắc chắn muốn đặt lại toàn bộ thông tin Khoa và các tham số quy định thực tập về giá trị mặc định ban đầu?"
        confirmLabel="Khôi phục mặc định"
        variant="danger"
        onConfirm={handleResetDefaults}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};

export default SettingsView;
export { SettingsView as AdminSettingsView };
