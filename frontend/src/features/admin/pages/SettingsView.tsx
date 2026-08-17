import { useState } from "react";
import {
  ShieldCheck,
  Server,
  HardDrive,
  Database,
  RefreshCw,
  Save,
  RotateCcw,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Sliders,
  HelpCircle,
  Globe,
  Building,
  FileText,
  Mail,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { KpiCard, KpiGrid } from "../../../components/common/KpiCard";
import { Panel } from "../../../components/common/Panel";
import { USE_MOCK } from "../../../config/env";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { adminEmailService } from "../../../services/adminEmail.service";
import { useAdminDashboardStats } from "../../../hooks/useAdminDashboardStats";
const DEFAULT_GENERAL_SETTINGS = {
  systemName: "Hệ thống Quản lý Thực tập InternLink",
  departmentName: "Khoa Công nghệ Thông tin",
  supportEmail: "internlink.cntt@gmail.com",
  phone: "0906891704",
  address: "Tòa nhà A, 227 Nguyễn Văn Cừ, Q.5, TP.HCM",
  language: "vi",
  timezone: "Asia/Ho_Chi_Minh",
  logoUrl:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
};

export const SettingsView = ({ onShowToast, onNavigateTab }) => {
  const { stats } = useAdminDashboardStats(!USE_MOCK, onShowToast);
  const [generalSettings, setGeneralSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("internlink_admin_general_settings");
      return saved ? JSON.parse(saved) : DEFAULT_GENERAL_SETTINGS;
    } catch {
      return DEFAULT_GENERAL_SETTINGS;
    }
  });
  const [accountPolicy, setAccountPolicy] = useState({
    allowSelfRegistration: false,
    requireEduEmail: true,
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpireDays: 90,
    maxLoginFailures: 5,
    autoLockAccount: true,
    allowPasswordReset: true,
  });
  const [internshipSettings, setInternshipSettings] = useState({
    allowMultipleSemesters: false,
    maxStudentsPerLecturer: 30,
    allowEditAfterAssignment: false,
    allowLecturerChange: true,
    allowLateSubmission: true,
    defaultReportDeadlineDay: "Ch\u1EE7 Nh\u1EADt (23:59)",
    autoLockSemesterEnd: true,
  });
  const [fileSettings, setFileSettings] = useState({
    maxFileSizeMb: 25,
    allowedPdf: true,
    allowedDocx: true,
    allowedXlsx: true,
    allowedZip: true,
    storageUsedGb: 28.4,
    storageTotalGb: 100,
  });
  const [backupInfo, setBackupInfo] = useState({
    lastBackup: "02/08/2026 - 03:00:00",
    nextBackup: "03/08/2026 - 03:00:00",
    backupSize: "1.42 GB",
    status: "T\u1EF1 \u0111\u1ED9ng \u0111\u1ECBnh k\u1EF3",
  });
  const [auditLogs, setAuditLogs] = useState([
    {
      id: "LOG-8092",
      time: "02/08/2026 08:45:12",
      admin: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
      action:
        "C\u1EADp nh\u1EADt Dung l\u01B0\u1EE3ng t\u1EC7p t\u1ED1i \u0111a th\xE0nh 25 MB",
      module: "L\u01B0u tr\u1EEF & File",
      ip: "118.69.182.45",
      status: "success",
    },
    {
      id: "LOG-8091",
      time: "02/08/2026 03:00:01",
      admin: "System Auto-Backup",
      action:
        "Th\u1EF1c hi\u1EC7n Sao l\u01B0u c\u01A1 s\u1EDF d\u1EEF li\u1EC7u \u0111\u1ECBnh k\u1EF3",
      module: "Sao l\u01B0u",
      ip: "10.0.4.12 (Internal)",
      status: "success",
    },
    {
      id: "LOG-8090",
      time: "01/08/2026 16:30:22",
      admin: "V\u0103n ph\xF2ng Khoa (L\xEA V\u0103n An)",
      action:
        "Ph\xEA duy\u1EC7t 12 Y\xEAu c\u1EA7u c\u1EA5p l\u1EA1i m\u1EADt kh\u1EA9u",
      module: "T\xE0i kho\u1EA3n",
      ip: "118.69.182.50",
      status: "success",
    },
    {
      id: "LOG-8089",
      time: "01/08/2026 14:15:05",
      admin: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
      action:
        "B\u1EADt quy t\u1EAFc Y\xEAu c\u1EA7u K\xFD t\u1EF1 \u0111\u1EB7c bi\u1EC7t trong M\u1EADt kh\u1EA9u",
      module: "Ch\xEDnh s\xE1ch M\u1EADt kh\u1EA9u",
      ip: "118.69.182.45",
      status: "success",
    },
    {
      id: "LOG-8088",
      time: "31/07/2026 21:05:40",
      admin: "H\u1EC7 th\u1ED1ng Security",
      action:
        "Th\u1EA5t b\u1EA1i \u0111\u0103ng nh\u1EADp qu\xE1 5 l\u1EA7n - Kh\xF3a IP t\u1EA1m th\u1EDDi",
      module: "B\u1EA3o m\u1EADt",
      ip: "27.72.102.18",
      status: "failed",
    },
    {
      id: "LOG-8087",
      time: "31/07/2026 10:20:00",
      admin: "Super Admin (\u0110\u1ED7 Ho\xE0ng Y\u1EBFn)",
      action: "G\u1EEDi Th\xF4ng b\xE1o b\u1EA3o tr\xEC H\u1EC7 th\u1ED1ng",
      module: "Th\xF4ng b\xE1o",
      ip: "118.69.182.45",
      status: "success",
    },
  ]);
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [logModuleFilter, setLogModuleFilter] = useState("all");
  const [logStatusFilter, setLogStatusFilter] = useState("all");
  const [logCurrentPage, setLogCurrentPage] = useState(1);
  const logPageSize = 5;
  const [isSaving, setIsSaving] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState("all");
  const filteredLogs = auditLogs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.admin.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.ip.includes(logSearchQuery) ||
      log.id.toLowerCase().includes(logSearchQuery.toLowerCase());
    const matchModule =
      logModuleFilter === "all" || log.module === logModuleFilter;
    const matchStatus =
      logStatusFilter === "all" || log.status === logStatusFilter;
    return matchSearch && matchModule && matchStatus;
  });
  const totalLogPages = Math.ceil(filteredLogs.length / logPageSize) || 1;
  const paginatedLogs = filteredLogs.slice(
    (logCurrentPage - 1) * logPageSize,
    logCurrentPage * logPageSize,
  );
  const handleSaveAllSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      try {
        localStorage.setItem(
          "internlink_admin_general_settings",
          JSON.stringify(generalSettings),
        );
        localStorage.setItem(
          "internlink_admin_account_policy",
          JSON.stringify(accountPolicy),
        );
        localStorage.setItem(
          "internlink_admin_internship_settings",
          JSON.stringify(internshipSettings),
        );
        localStorage.setItem(
          "internlink_admin_file_settings",
          JSON.stringify(fileSettings),
        );
      } catch (e) {
        console.error(e);
      }
      onShowToast("Đã lưu tất cả Cấu hình Hệ thống (cục bộ) thành công!");
      const newLog = {
        id: `LOG-${Math.floor(8100 + Math.random() * 100)}`,
        time: new Date().toLocaleString("vi-VN"),
        admin: "Super Admin",
        action: `Cập nhật Cấu hình (Email: ${generalSettings.supportEmail}, Hotline: ${generalSettings.phone})`,
        module: "Cài đặt hệ thống",
        ip: "118.69.182.45",
        status: "success",
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }, 400);
  };

  const handleRestoreDefaults = () => {
    setShowResetConfirmModal(false);
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setGeneralSettings(DEFAULT_GENERAL_SETTINGS);
      setAccountPolicy({
        allowSelfRegistration: false,
        requireEduEmail: true,
        minPasswordLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        passwordExpireDays: 90,
        maxLoginFailures: 5,
        autoLockAccount: true,
        allowPasswordReset: true,
      });
      setFileSettings({
        maxFileSizeMb: 25,
        allowedPdf: true,
        allowedDocx: true,
        allowedXlsx: true,
        allowedZip: true,
        storageUsedGb: 28.4,
        storageTotalGb: 100,
      });
      setInternshipSettings({
        allowMultipleSemesters: false,
        maxStudentsPerLecturer: 30,
        allowEditAfterAssignment: false,
        allowLecturerChange: true,
        allowLateSubmission: true,
        defaultReportDeadlineDay: "Chủ Nhật (23:59)",
        autoLockSemesterEnd: true,
      });
      try {
        localStorage.removeItem("internlink_admin_general_settings");
        localStorage.removeItem("internlink_admin_account_policy");
        localStorage.removeItem("internlink_admin_internship_settings");
        localStorage.removeItem("internlink_admin_file_settings");
      } catch (e) {
        console.error(e);
      }
      onShowToast(
        "Đã khôi phục cài đặt về cấu hình mặc định (internlink.cntt@gmail.com / 0906891704)!",
      );
    }, 400);
  };

  const handleTestEmail = async () => {
    const toEmail = generalSettings.supportEmail.trim();
    if (!toEmail) {
      onShowToast("Vui lòng nhập email hỗ trợ trước khi gửi thử.");
      return;
    }
    if (USE_MOCK) {
      onShowToast(`[Mock] Đã gửi email thử tới ${toEmail}`);
      return;
    }
    setIsTestingEmail(true);
    try {
      await adminEmailService.testEmail({
        toEmail,
        fullName: "Admin Test",
        role: "Student",
      });
      onShowToast(`Đã gửi email thử tới ${toEmail}`);
    } catch (err) {
      onShowToast(getApiErrorMessage(err));
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleManualBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      const now = new Date().toLocaleString("vi-VN");
      setBackupInfo((prev) => ({
        ...prev,
        lastBackup: now,
      }));

      const backupObj = {
        generalSettings,
        accountPolicy,
        internshipSettings,
        fileSettings,
        backupInfo,
        exportedAt: new Date().toISOString(),
      };

      const jsonStr = JSON.stringify(backupObj, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `internlink_settings_backup_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      onShowToast("Đã tạo và tải xuống bản sao lưu cấu hình hệ thống (.json)!");
      const newLog = {
        id: `LOG-${Math.floor(8100 + Math.random() * 100)}`,
        time: now,
        admin: "Super Admin",
        action: "Tải bản sao lưu cấu hình hệ thống (.json)",
        module: "Sao lưu",
        ip: "118.69.182.45",
        status: "success",
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }, 500);
  };

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto min-w-0 max-w-full overflow-hidden">
      <PageHeader
        icon={Sliders}
        title="Cài đặt hệ thống (System Settings)"
        actions={[
          {
            label: "Khôi phục mặc định",
            icon: RotateCcw,
            onClick: () => setShowResetConfirmModal(true),
            variant: "secondary",
          },
        ]}
      >
        <button
          type="button"
          onClick={handleSaveAllSettings}
          disabled={isSaving}
          className="il-btn il-btn-primary il-btn-press disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? "Đang lưu..." : "Lưu tất cả thay đổi"}</span>
        </button>
      </PageHeader>

      <KpiGrid>
        <KpiCard
          tone="emerald"
          title="Trạng thái hệ thống"
          value="Ổn định"
          icon={Activity}
          footer={stats ? `${stats.studentCount} SV trong hệ thống` : "100% Hoạt động"}
        />
        <KpiCard
          tone="blue"
          title="Cấu hình tham số"
          value="12 / 12"
          icon={Sliders}
          footer="Sẵn sàng vận hành"
        />
        <KpiCard
          tone="amber"
          title="Dung lượng tệp"
          value={`${fileSettings.storageUsedGb} GB`}
          icon={HardDrive}
          footer={`Trên tổng ${fileSettings.storageTotalGb} GB`}
        />
        <KpiCard
          tone="sky"
          title="Phiên bản hệ thống"
          value="v3.4.2"
          icon={Globe}
          footer="Standard Stable"
        />
      </KpiGrid>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200/80 overflow-x-auto scrollbar-none max-w-full shrink-0">
        <button
          onClick={() => setActiveTabSection("all")}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${activeTabSection === "all" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
        >
          Tất cả cấu hình
        </button>
        <button
          onClick={() => setActiveTabSection("general")}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${activeTabSection === "general" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
        >
          1. Cấu hình chung
        </button>
        <button
          onClick={() => setActiveTabSection("security")}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${activeTabSection === "security" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
        >
          2. Chính sách tài khoản
        </button>
        <button
          onClick={() => setActiveTabSection("internship")}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${activeTabSection === "internship" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
        >
          3. Quy tắc thực tập
        </button>
        <button
          onClick={() => setActiveTabSection("file")}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${activeTabSection === "file" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
        >
          4. Lưu trữ &amp; Tệp tin
        </button>
        <button
          onClick={() => setActiveTabSection("logs")}
          className={`px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${activeTabSection === "logs" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
        >
          5. Nhật ký hệ thống
        </button>
      </div>

      {/* MAIN LAYOUT: 8 COLS LEFT, 4 COLS RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0 max-w-full">
        {/* LEFT COLUMN: MAIN CONFIGURATION PANELS */}
        <div className="lg:col-span-8 space-y-6 min-w-0 max-w-full">
          {/* SECTION 1: GENERAL SETTINGS */}
          {(activeTabSection === "all" || activeTabSection === "general") && (
            <Panel className="space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    1. Cấu hình chung hệ thống
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Thông tin hiển thị chính thức của đơn vị quản lý thực tập.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Tên hệ thống
                  </label>
                  <input
                    type="text"
                    value={generalSettings.systemName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        systemName: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Tên Khoa / Đơn vị
                  </label>
                  <input
                    type="text"
                    value={generalSettings.departmentName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        departmentName: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Email hỗ trợ
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          supportEmail: e.target.value,
                        })
                      }
                      className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleTestEmail}
                      disabled={isTestingEmail}
                      className="shrink-0 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md text-xs font-bold text-slate-700 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isTestingEmail ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Mail className="w-3.5 h-3.5" />
                      )}
                      Gửi thử
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Gọi `POST /api/Admin/email/test` — kiểm tra cấu hình SMTP.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Số điện thoại / Hotline
                  </label>
                  <input
                    type="text"
                    value={generalSettings.phone}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Địa chỉ văn phòng Khoa
                  </label>
                  <input
                    type="text"
                    value={generalSettings.address}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Ngôn ngữ mặc định
                  </label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        language: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="vi">Tiếng Việt (Mặc định)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Múi giờ hệ thống
                  </label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        timezone: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Asia/Ho_Chi_Minh">
                      (GMT+07:00) Hồ Chí Minh, Hà Nội
                    </option>
                  </select>
                </div>
              </div>
            </Panel>
          )}

          {/* SECTION 2: ACCOUNT & SECURITY POLICY */}
          {(activeTabSection === "all" || activeTabSection === "security") && (
            <Panel className="space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    2. Chính sách tài khoản &amp; Mật khẩu
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Quy tắc đăng ký, quy định độ dài mật khẩu và cơ chế khóa tài
                    khoản.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Switches */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-md border border-slate-200/60">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Cho phép đăng ký tài khoản tự do
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Nếu tắt, tài khoản chỉ do Quản trị viên cấp.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={accountPolicy.allowSelfRegistration}
                    onChange={(e) =>
                      setAccountPolicy({
                        ...accountPolicy,
                        allowSelfRegistration: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-md border border-slate-200/60">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Yêu cầu email tên miền nhà trường (`@...edu.vn`)
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Bắt buộc xác thực danh tính sinh viên.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={accountPolicy.requireEduEmail}
                    onChange={(e) =>
                      setAccountPolicy({
                        ...accountPolicy,
                        requireEduEmail: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Độ dài mật khẩu tối thiểu
                    </label>
                    <input
                      type="number"
                      min={6}
                      max={32}
                      value={accountPolicy.minPasswordLength}
                      onChange={(e) =>
                        setAccountPolicy({
                          ...accountPolicy,
                          minPasswordLength: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Số lần đăng nhập sai tối đa
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={10}
                      value={accountPolicy.maxLoginFailures}
                      onChange={(e) =>
                        setAccountPolicy({
                          ...accountPolicy,
                          maxLoginFailures: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200/60 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accountPolicy.requireUppercase}
                      onChange={(e) =>
                        setAccountPolicy({
                          ...accountPolicy,
                          requireUppercase: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span>Chữ hoa (A-Z)</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200/60 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accountPolicy.requireNumbers}
                      onChange={(e) =>
                        setAccountPolicy({
                          ...accountPolicy,
                          requireNumbers: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span>Ký tự số (0-9)</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200/60 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accountPolicy.requireSpecialChars}
                      onChange={(e) =>
                        setAccountPolicy({
                          ...accountPolicy,
                          requireSpecialChars: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span>Ký tự đặc biệt (@#$)</span>
                  </label>
                </div>
              </div>
            </Panel>
          )}

          {/* SECTION 3: INTERNSHIP RULES */}
          {(activeTabSection === "all" ||
            activeTabSection === "internship") && (
            <Panel className="space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    3. Quy tắc kỳ thực tập &amp; Hạn nộp
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Giới hạn số lượng sinh viên hướng dẫn, thời gian nộp báo cáo
                    tuần.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Số sinh viên tối đa / 1 Giảng viên
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={internshipSettings.maxStudentsPerLecturer}
                      onChange={(e) =>
                        setInternshipSettings({
                          ...internshipSettings,
                          maxStudentsPerLecturer: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Hạn nộp báo cáo tuần mặc định
                    </label>
                    <select
                      value={internshipSettings.defaultReportDeadlineDay}
                      onChange={(e) =>
                        setInternshipSettings({
                          ...internshipSettings,
                          defaultReportDeadlineDay: e.target.value,
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="Chủ Nhật (23:59)">
                        Chủ Nhật (23:59 hàng tuần)
                      </option>
                      <option value="Thứ Bảy (23:59)">
                        Thứ Bảy (23:59 hàng tuần)
                      </option>
                      <option value="Thứ Sáu (17:00)">
                        Thứ Sáu (17:00 hàng tuần)
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-md border border-slate-200/60">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Cho phép nộp trễ báo cáo tuần
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Báo cáo nộp trễ sẽ được đánh dấu cờ màu cam.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={internshipSettings.allowLateSubmission}
                    onChange={(e) =>
                      setInternshipSettings({
                        ...internshipSettings,
                        allowLateSubmission: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-md border border-slate-200/60">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Tự động khóa kỳ thực tập khi hết hạn học kỳ
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Ngăn chặn chỉnh sửa điểm sau khi kết thúc học kỳ.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={internshipSettings.autoLockSemesterEnd}
                    onChange={(e) =>
                      setInternshipSettings({
                        ...internshipSettings,
                        autoLockSemesterEnd: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Panel>
          )}

          {/* SECTION 4: FILE & STORAGE LIMITS */}
          {(activeTabSection === "all" || activeTabSection === "file") && (
            <Panel className="space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-md">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    4. Giới hạn file &amp; Dung lượng lưu trữ
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Quy định kích thước tệp tải lên tối đa và các định dạng tài
                    liệu được phép.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Kích thước tệp tải lên tối đa (MB)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={fileSettings.maxFileSizeMb}
                      onChange={(e) =>
                        setFileSettings({
                          ...fileSettings,
                          maxFileSizeMb: Number(e.target.value),
                        })
                      }
                      className="w-32 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-500">
                      MB / tệp
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">
                    Định dạng tài liệu cho phép:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200/60 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fileSettings.allowedPdf}
                        onChange={(e) =>
                          setFileSettings({
                            ...fileSettings,
                            allowedPdf: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span>PDF (.pdf)</span>
                    </label>

                    <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200/60 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fileSettings.allowedDocx}
                        onChange={(e) =>
                          setFileSettings({
                            ...fileSettings,
                            allowedDocx: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span>Word (.docx)</span>
                    </label>

                    <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200/60 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fileSettings.allowedXlsx}
                        onChange={(e) =>
                          setFileSettings({
                            ...fileSettings,
                            allowedXlsx: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span>Excel (.xlsx)</span>
                    </label>

                    <label className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200/60 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fileSettings.allowedZip}
                        onChange={(e) =>
                          setFileSettings({
                            ...fileSettings,
                            allowedZip: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                      />
                      <span>Nén (.zip / .rar)</span>
                    </label>
                  </div>
                </div>

                {/* Storage usage bar */}
                <div className="p-4 bg-slate-50 rounded-md border border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">
                      Dung lượng ổ đĩa đã sử dụng
                    </span>
                    <span className="text-blue-600">
                      {fileSettings.storageUsedGb} GB /{" "}
                      {fileSettings.storageTotalGb} GB (28.4%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: "28.4%" }}
                    />
                  </div>
                </div>
              </div>
            </Panel>
          )}

          {/* SECTION 5: AUDIT LOGS */}
          {(activeTabSection === "all" || activeTabSection === "logs") && (
            <Panel className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-md">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      5. Nhật ký thao tác hệ thống (Audit Logs)
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Lịch sử thay đổi cấu hình và hành động quản trị.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Tìm nhật ký..."
                      value={logSearchQuery}
                      onChange={(e) => {
                        setLogSearchQuery(e.target.value);
                        setLogCurrentPage(1);
                      }}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44"
                    />
                  </div>
                </div>
              </div>

              {/* LOGS TABLE */}
              <div className="overflow-x-auto rounded-md border border-slate-200/80">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                      <th className="py-2.5 px-3.5">Mã Log</th>
                      <th className="py-2.5 px-3.5">Thời gian</th>
                      <th className="py-2.5 px-3.5">Người thực hiện</th>
                      <th className="py-2.5 px-3.5">Hành động</th>
                      <th className="py-2.5 px-3.5">Phân mục</th>
                      <th className="py-2.5 px-3.5">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    {paginatedLogs.length > 0 ? (
                      paginatedLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-2.5 px-3.5 font-bold text-slate-900">
                            {log.id}
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-500 whitespace-nowrap">
                            {log.time}
                          </td>
                          <td className="py-2.5 px-3.5 font-bold text-slate-800">
                            {log.admin}
                          </td>
                          <td className="py-2.5 px-3.5 max-w-xs truncate">
                            {log.action}
                          </td>
                          <td className="py-2.5 px-3.5">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md border border-slate-200">
                              {log.module}
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5">
                            {log.status === "success" ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Thành
                                công
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-[11px]">
                                <XCircle className="w-3.5 h-3.5" /> Thất bại
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-xs text-slate-400 font-medium"
                        >
                          Không tìm thấy nhật ký phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {totalLogPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-slate-500 font-medium">
                    Trang {logCurrentPage} / {totalLogPages}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setLogCurrentPage((p) => Math.max(1, p - 1))
                      }
                      disabled={logCurrentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setLogCurrentPage((p) => Math.min(totalLogPages, p + 1))
                      }
                      disabled={logCurrentPage === totalLogPages}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </Panel>
          )}
        </div>

        {/* RIGHT SIDEBAR: QUICK ACTIONS & SYSTEM STATUS */}
        <div className="lg:col-span-4 space-y-6 min-w-0 max-w-full">
          {/* WIDGET 1: QUICK ACTIONS */}
          <Panel className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" /> Thao tác nhanh
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={handleSaveAllSettings}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>Lưu cấu hình hiện tại</span>
              </button>

              <button
                onClick={handleManualBackup}
                disabled={isBackingUp}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBackingUp ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <Database className="w-4 h-4 text-emerald-600" />
                )}
                <span>Sao lưu dữ liệu ngay</span>
              </button>

              <button
                onClick={() => setShowResetConfirmModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-600 rounded-md text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Khôi phục cài đặt gốc</span>
              </button>
            </div>
          </Panel>

          {/* WIDGET 2: SYSTEM HEALTH */}
          <Panel className="space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" /> Dịch vụ hệ thống
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md">
                <span className="font-bold text-slate-700">
                  Cơ sở dữ liệu (Database)
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                  Kết nối tốt
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md">
                <span className="font-bold text-slate-700">
                  Máy chủ Web (App Server)
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                  Sẵn sàng
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-md">
                <span className="font-bold text-slate-700">
                  Lần sao lưu gần nhất
                </span>
                <span className="font-bold text-slate-600 text-[11px]">
                  {backupInfo.lastBackup.split(" - ")[0]}
                </span>
              </div>
            </div>
          </Panel>

          {/* WIDGET 3: NEED HELP */}
          <div className="il-accent-panel p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#1d4ed8]">
              <HelpCircle className="w-5 h-5" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Hỗ trợ kỹ thuật
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Cần hỗ trợ tùy chỉnh cấu hình chuyên sâu hoặc hỗ trợ khôi phục dữ
              liệu? Liên hệ Ban CNTT Khoa.
            </p>
            <div className="pt-1">
              <span className="text-xs font-bold text-[#1d4ed8]">
                Hotline: (028) 3835 1056
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM RESET MODAL */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-md animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-50 rounded-md">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Khôi phục Cài đặt Mặc định?
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Thao tác này sẽ đặt lại tất cả thông số cấu hình về giá trị
                  ban đầu.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-all cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleRestoreDefaults}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-all cursor-pointer shadow-xs"
              >
                Xác nhận khôi phục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SettingsView;

export { SettingsView as AdminSettingsView };
