import { useState, useEffect, FormEvent } from "react";
import { Toast } from "../../../components/common/Toast";
import { PageHeader } from "../../../components/common/PageHeader";
import { apiRequest, getApiErrorMessage } from "../../../lib/apiClient";
import { authService } from "../../../services/auth.service";
import { useAuth } from "../../../hooks/useAuth";
import { useLecturerNavStats } from "../../../hooks/useLecturerNavStats";
import { useSemester } from "../../../contexts/SemesterContext";
import {
  User,
  Building2,
  GraduationCap,
  ShieldCheck,
  Lock,
  KeyRound,
  Smartphone,
  Bell,
  Moon,
  Sun,
  Laptop,
  Clock,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Save,
  RotateCcw,
  Calendar,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  BookOpen,
  FileText,
  Check,
  X,
} from "lucide-react";

interface LecturerProfileData {
  fullName: string;
  lecturerCode: string;
  email: string;
  phone: string;
  office: string;
  dob: string;
  gender: string;
  degree: string;
  faculty: string;
  department: string;
  bio: string;
  avatarUrl?: string;
}

const DEFAULT_PROFILE: LecturerProfileData = {
  fullName: "",
  lecturerCode: "",
  email: "",
  phone: "",
  office: "",
  dob: "",
  gender: "Nam",
  degree: "",
  faculty: "",
  department: "",
  bio: "",
  avatarUrl: "",
};

interface LecturerOverviewDto {
  lecturer: {
    id: string;
    staffCode: string;
    fullName: string;
    email?: string;
    phone?: string;
    department?: string;
  };
  totalInternships: number;
  statusCounts: Record<string, number>;
}

export const AccountView = () => {
  const { user } = useAuth();
  const { selectedSemester } = useSemester();
  const { stats: navStats } = useLecturerNavStats();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences" | "activity">("profile");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Profile data
  const [profile, setProfile] = useState<LecturerProfileData>(DEFAULT_PROFILE);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<LecturerProfileData>(profile);

  // Avatar Modal
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newAvatarInput, setNewAvatarInput] = useState(profile.avatarUrl || "");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passSuccessMsg, setPassSuccessMsg] = useState<string | null>(null);
  const [passErrorMsg, setPassErrorMsg] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Device logout modal
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);
  const [loggedDevices, setLoggedDevices] = useState<any[]>([]);

  // Preferences
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "system">("light");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSubmissions, setNotifSubmissions] = useState(true);
  const [notifEnterprise, setNotifEnterprise] = useState(true);
  const [notifDeadlines, setNotifDeadlines] = useState(true);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      setIsLoadingProfile(true);
      try {
        const overview = await apiRequest<LecturerOverviewDto>("/api/Lecturer/me");
        if (cancelled) return;
        const lec = overview.lecturer;
        const loaded: LecturerProfileData = {
          fullName: lec.fullName || user?.name || "",
          lecturerCode: lec.staffCode || "",
          email: lec.email || user?.email || "",
          phone: lec.phone || "",
          office: "",
          dob: "",
          gender: "Nam",
          degree: "",
          faculty: "",
          department: lec.department || "",
          bio: "",
          avatarUrl: user?.avatarUrl || "",
        };
        // Merge with any locally-saved edits (office, dob, bio, etc.)
        try {
          const saved = localStorage.getItem("internlink_lecturer_profile");
          if (saved) {
            const parsed = JSON.parse(saved) as Partial<LecturerProfileData>;
            Object.assign(loaded, {
              office: parsed.office || loaded.office,
              dob: parsed.dob || loaded.dob,
              degree: parsed.degree || loaded.degree,
              faculty: parsed.faculty || loaded.faculty,
              bio: parsed.bio || loaded.bio,
              gender: parsed.gender || loaded.gender,
            });
          }
        } catch { /* ignore */ }
        setProfile(loaded);
        setTempProfile(loaded);
      } catch {
        // Fallback to auth context
        if (!cancelled && user) {
          setProfile((prev) => ({
            ...prev,
            fullName: user.name || prev.fullName,
            email: user.email || prev.email,
            avatarUrl: user.avatarUrl || prev.avatarUrl,
          }));
        }
      } finally {
        if (!cancelled) setIsLoadingProfile(false);
      }
    }
    void loadProfile();
    return () => { cancelled = true; };
  }, [user]);

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-slate-200" };
    if (pass.length < 6) return { score: 1, label: "Yếu", color: "bg-rose-500" };
    if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
      return { score: 2, label: "Trung bình", color: "bg-amber-500" };
    }
    return { score: 3, label: "Mạnh", color: "bg-emerald-500" };
  };
  const passStrength = getPasswordStrength(newPassword);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!tempProfile.fullName.trim()) {
      showToast("Họ và tên không được để trống!");
      return;
    }
    setProfile(tempProfile);
    setIsEditingProfile(false);
    try {
      localStorage.setItem("internlink_lecturer_profile", JSON.stringify(tempProfile));
    } catch {
      // ignore
    }
    showToast("Cập nhật hồ sơ cá nhân giảng viên thành công!");
  };

  const handleCancelProfile = () => {
    setTempProfile(profile);
    setIsEditingProfile(false);
  };

  const handleSaveAvatar = (e: FormEvent) => {
    e.preventDefault();
    const updated = { ...profile, avatarUrl: newAvatarInput.trim() };
    setProfile(updated);
    setTempProfile(updated);
    try {
      localStorage.setItem("internlink_lecturer_profile", JSON.stringify(updated));
    } catch {
      // ignore
    }
    setShowAvatarModal(false);
    showToast("Đã cập nhật ảnh đại diện thành công!");
  };

  const handleChangePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPassErrorMsg(null);
    setPassSuccessMsg(null);

    if (newPassword.length < 8) {
      setPassErrorMsg("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassErrorMsg("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    setIsChangingPass(true);
    try {
      if (!currentPassword.trim()) {
        setPassErrorMsg("Vui lòng nhập mật khẩu hiện tại.");
        setIsChangingPass(false);
        return;
      }
      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      setPassSuccessMsg("Đổi mật khẩu tài khoản thành công!");
      showToast("Đổi mật khẩu thành công! Hãy sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.");
      setTimeout(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPassSuccessMsg(null);
      }, 3000);
    } catch (err) {
      setPassErrorMsg(getApiErrorMessage(err));
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleLogoutSingleDevice = (id: string) => {
    setLoggedDevices((prev) => prev.filter((d) => d.id !== id));
    showToast("Đã đăng xuất thiết bị khỏi phiên làm việc.");
  };

  const handleLogoutAllOtherDevices = () => {
    setLoggedDevices((prev) => prev.filter((d) => d.isCurrent));
    setShowLogoutAllModal(false);
    showToast("Đã đăng xuất khỏi tất cả các thiết bị khác!");
  };

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto animate-in fade-in duration-200 font-sans pb-12">
      {/* Toast Alert */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* 1. PAGE HEADER */}
      <PageHeader
        icon={User}
        title="Tài khoản & Hồ sơ Giảng viên"
        subtitle="Quản lý thông tin học hàm/học vị, tài khoản SSO, đổi mật khẩu và tùy chỉnh hệ thống InternLink."
        badge="Giảng viên Hướng dẫn"
        badgeColor="bg-blue-100 text-blue-800 border-blue-200"
      >
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md shrink-0 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Hồ sơ & Giảng dạy</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "security"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tài khoản & Mật khẩu</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "preferences"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Tùy chỉnh</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "activity"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Nhật ký Hoạt động</span>
          </button>
        </div>
      </PageHeader>

      {/* 2. MAIN 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Main Tabs Workspace (Col-Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* PROFILE SUMMARY HEADER CARD */}
          <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}
              <div className="relative group shrink-0">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-24 h-24 rounded-lg object-cover border-2 border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-blue-600 text-white font-bold text-2xl flex items-center justify-center border-2 border-white shadow-xs">
                    {profile.fullName
                      .split(" ")
                      .slice(-2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase() || "GV"}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setNewAvatarInput(profile.avatarUrl || "");
                    setShowAvatarModal(true);
                  }}
                  className="absolute -bottom-2 -right-2 p-2 bg-slate-900 hover:bg-blue-600 text-white rounded-md shadow-md transition-colors border border-white"
                  title="Cập nhật ảnh đại diện"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Summary details */}
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{profile.fullName}</h2>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Đã liên kết CSDL Đào tạo
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-600 flex items-center justify-center sm:justify-start gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{profile.degree}</span>
                </p>

                <p className="text-xs text-slate-500 font-medium">
                  {profile.department} • {profile.faculty}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Mã GV: <strong className="text-slate-800 font-mono">{profile.lecturerCode}</strong>
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Đợt thực tập: <strong className="text-slate-800">{selectedSemester?.name || "Chưa chọn kỳ"}</strong>
                  </span>
                </div>
              </div>

              {/* Action trigger button */}
              {activeTab === "profile" && (
                <div className="shrink-0 w-full sm:w-auto text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingProfile) {
                        handleCancelProfile();
                      } else {
                        setTempProfile(profile);
                        setIsEditingProfile(true);
                      }
                    }}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-md font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs ${
                      isEditingProfile
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{isEditingProfile ? "Đóng chỉnh sửa" : "Chỉnh sửa hồ sơ"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* TAB 1: PROFILE & TEACHING DETAILS */}
          {activeTab === "profile" && (
            <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Thông tin Cá nhân &amp; Giảng dạy
                  </h3>
                </div>
                {!isEditingProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      setTempProfile(profile);
                      setIsEditingProfile(true);
                    }}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Chỉnh sửa thông tin
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Họ và tên giảng viên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={isEditingProfile ? tempProfile.fullName : profile.fullName}
                      onChange={(e) =>
                        setTempProfile({ ...tempProfile, fullName: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Mã giảng viên
                    </label>
                    <input
                      type="text"
                      disabled={true}
                      value={profile.lecturerCode}
                      className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-md outline-none font-mono font-bold text-slate-600 cursor-not-allowed"
                      title="Mã giảng viên do Phòng Đào tạo cấp, không thể tự chỉnh sửa"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email công vụ (Edu)
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        disabled={!isEditingProfile}
                        value={isEditingProfile ? tempProfile.email : profile.email}
                        onChange={(e) =>
                          setTempProfile({ ...tempProfile, email: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Số điện thoại liên hệ
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={isEditingProfile ? tempProfile.phone : profile.phone}
                        onChange={(e) =>
                          setTempProfile({ ...tempProfile, phone: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Văn phòng / Phòng làm việc
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        disabled={!isEditingProfile}
                        value={isEditingProfile ? tempProfile.office : profile.office}
                        onChange={(e) =>
                          setTempProfile({ ...tempProfile, office: e.target.value })
                        }
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Ngày sinh
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={isEditingProfile ? tempProfile.dob : profile.dob}
                      onChange={(e) =>
                        setTempProfile({ ...tempProfile, dob: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Giới tính
                    </label>
                    <select
                      disabled={!isEditingProfile}
                      value={isEditingProfile ? tempProfile.gender : profile.gender}
                      onChange={(e) =>
                        setTempProfile({ ...tempProfile, gender: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Học hàm / Học vị
                    </label>
                    <select
                      disabled={!isEditingProfile}
                      value={isEditingProfile ? tempProfile.degree : profile.degree}
                      onChange={(e) =>
                        setTempProfile({ ...tempProfile, degree: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    >
                      <option value="Tiến sĩ / Giảng viên chính">Tiến sĩ / Giảng viên chính</option>
                      <option value="Thạc sĩ / Giảng viên">Thạc sĩ / Giảng viên</option>
                      <option value="Phó Giáo sư / Giảng viên cao cấp">Phó Giáo sư / Giảng viên cao cấp</option>
                      <option value="Giáo sư">Giáo sư</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Khoa / Viện
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={isEditingProfile ? tempProfile.faculty : profile.faculty}
                      onChange={(e) =>
                        setTempProfile({ ...tempProfile, faculty: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Bộ môn trực thuộc
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={isEditingProfile ? tempProfile.department : profile.department}
                      onChange={(e) =>
                        setTempProfile({ ...tempProfile, department: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    Giới thiệu bản thân &amp; Hướng nghiên cứu chuyên sâu
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditingProfile}
                    value={isEditingProfile ? tempProfile.bio : profile.bio}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, bio: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-xs text-slate-800 disabled:text-slate-600 leading-relaxed"
                  />
                </div>

                {isEditingProfile && (
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleCancelProfile}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Hủy bỏ</span>
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu thông tin</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: ACCOUNT CREDENTIALS & PASSWORD (NO 2FA, NO DANGER ZONE) */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in">
              {/* Account Credentials Panel */}
              <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Thông tin Tài khoản Đăng nhập
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-medium">
                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">
                      Tên đăng nhập hệ thống
                    </span>
                    <span className="font-bold text-slate-900 text-sm font-mono mt-0.5 block">
                      huy.tran.gv
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">
                      Email đăng nhập SSO
                    </span>
                    <span className="font-bold text-slate-900 mt-0.5 block">
                      {profile.email}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">
                      Vai trò &amp; Quyền hạn
                    </span>
                    <span className="font-bold text-blue-700 mt-0.5 block">
                      Giảng viên Hướng dẫn (Lecturer Supervisor)
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">
                      Trạng thái tài khoản
                    </span>
                    <span className="font-bold text-emerald-700 mt-0.5 block flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Đang hoạt động bình thường
                    </span>
                  </div>
                </div>
              </div>

              {/* Change Password Form */}
              <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-sm text-slate-900">
                      Đổi Mật Khẩu Tài Khoản
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Mật khẩu tối thiểu 8 ký tự
                  </span>
                </div>

                <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Mật khẩu hiện tại <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        placeholder="Nhập mật khẩu hiện tại..."
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        title={showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Mật khẩu mới <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          placeholder="Ít nhất 8 ký tự, chữ hoa & số..."
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          title={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Strength Meter */}
                      {newPassword && (
                        <div className="mt-2 space-y-1 animate-in fade-in">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-slate-500">Độ mạnh mật khẩu:</span>
                            <span
                              className={
                                passStrength.score === 3
                                  ? "text-emerald-600"
                                  : passStrength.score === 2
                                    ? "text-amber-600"
                                    : "text-rose-600"
                              }
                            >
                              {passStrength.label}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                            <div
                              className={`h-full flex-1 transition-all ${
                                passStrength.score >= 1 ? passStrength.color : "bg-slate-200"
                              }`}
                            />
                            <div
                              className={`h-full flex-1 transition-all ${
                                passStrength.score >= 2 ? passStrength.color : "bg-slate-200"
                              }`}
                            />
                            <div
                              className={`h-full flex-1 transition-all ${
                                passStrength.score >= 3 ? passStrength.color : "bg-slate-200"
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="Nhập lại mật khẩu mới..."
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full p-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          title={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {passErrorMsg && (
                    <p className="p-3 bg-rose-50 text-rose-800 font-bold rounded-md border border-rose-200 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{passErrorMsg}</span>
                    </p>
                  )}

                  {passSuccessMsg && (
                    <p className="p-3 bg-emerald-50 text-emerald-800 font-bold rounded-md border border-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{passSuccessMsg}</span>
                    </p>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isChangingPass}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-xs shadow-xs transition-colors disabled:opacity-50"
                    >
                      {isChangingPass ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Logged In Devices */}
              <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-sm text-slate-900">
                      Thiết bị Đã Đăng Nhập &amp; Phiên Làm Việc
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {loggedDevices.length} thiết bị đang kết nối
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {loggedDevices.map((dev) => (
                    <div
                      key={dev.id}
                      className={`p-3 rounded-md border flex items-center justify-between ${
                        dev.isCurrent
                          ? "bg-blue-50/70 border-blue-200/80"
                          : "bg-slate-50 border-slate-200/80"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            dev.isCurrent ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {dev.type === "laptop" ? (
                            <Laptop className="w-4 h-4" />
                          ) : (
                            <Smartphone className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {dev.name} {dev.isCurrent && "(Phiên hiện tại)"}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {dev.location} • IP: {dev.ip} • {dev.time}
                          </p>
                        </div>
                      </div>

                      {dev.isCurrent ? (
                        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded-full">
                          Đang hoạt động
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleLogoutSingleDevice(dev.id)}
                          className="text-rose-600 font-bold hover:underline text-xs"
                        >
                          Đăng xuất
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {loggedDevices.some((d) => !d.isCurrent) && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowLogoutAllModal(true)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-md border border-rose-200 transition-colors flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất khỏi tất cả thiết bị khác</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PREFERENCES & NOTIFICATIONS */}
          {activeTab === "preferences" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
              {/* Notification Toggles */}
              <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Tùy chỉnh Thông báo
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between cursor-pointer p-2.5 hover:bg-slate-50 rounded-md transition-colors">
                    <div>
                      <p className="font-bold text-slate-800">Thông báo qua Email Edu</p>
                      <p className="text-[11px] text-slate-500">
                        Nhận bản tin cập nhật định kỳ vào hộp thư
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifEmail}
                      onChange={(e) => {
                        setNotifEmail(e.target.checked);
                        showToast("Đã lưu tùy chọn thông báo Email.");
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-2.5 hover:bg-slate-50 rounded-md transition-colors">
                    <div>
                      <p className="font-bold text-slate-800">Bài nộp của sinh viên</p>
                      <p className="text-[11px] text-slate-500">
                        Thông báo ngay khi SV nộp báo cáo tuần / giữa kỳ
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifSubmissions}
                      onChange={(e) => {
                        setNotifSubmissions(e.target.checked);
                        showToast("Đã lưu tùy chọn thông báo bài nộp.");
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-2.5 hover:bg-slate-50 rounded-md transition-colors">
                    <div>
                      <p className="font-bold text-slate-800">Đánh giá từ Doanh nghiệp</p>
                      <p className="text-[11px] text-slate-500">
                        Thông báo khi công ty gửi phiếu nhận xét thực tập
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifEnterprise}
                      onChange={(e) => {
                        setNotifEnterprise(e.target.checked);
                        showToast("Đã lưu tùy chọn thông báo Doanh nghiệp.");
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-2.5 hover:bg-slate-50 rounded-md transition-colors">
                    <div>
                      <p className="font-bold text-slate-800">Nhắc hạn chấm điểm</p>
                      <p className="text-[11px] text-slate-500">
                        Cảnh báo trước 48h khi sắp hết hạn nhập điểm
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifDeadlines}
                      onChange={(e) => {
                        setNotifDeadlines(e.target.checked);
                        showToast("Đã lưu tùy chọn nhắc hạn chấm điểm.");
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>

              {/* Appearance & Language */}
              <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Laptop className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Giao diện &amp; Ngôn ngữ
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-2">
                      Chủ đề giao diện (Theme)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setThemeMode("light");
                          showToast("Đã chọn giao diện Sáng chuẩn mực.");
                        }}
                        className={`p-2.5 rounded-md border font-bold flex flex-col items-center gap-1.5 transition-all ${
                          themeMode === "light"
                            ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        <span>Sáng</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setThemeMode("dark");
                          showToast("Chế độ Tối sẽ áp dụng cho phiên làm việc.");
                        }}
                        className={`p-2.5 rounded-md border font-bold flex flex-col items-center gap-1.5 transition-all ${
                          themeMode === "dark"
                            ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        <span>Tối</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setThemeMode("system");
                          showToast("Đã chọn giao diện theo hệ thống.");
                        }}
                        className={`p-2.5 rounded-md border font-bold flex flex-col items-center gap-1.5 transition-all ${
                          themeMode === "system"
                            ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Laptop className="w-4 h-4" />
                        <span>Hệ thống</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Ngôn ngữ hiển thị
                    </label>
                    <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        Tiếng Việt (Vietnamese)
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
                        Mặc định
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACTIVITY LOG */}
          {activeTab === "activity" && (
            <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Nhật ký Hoạt động Giảng viên
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Ghi lại 30 ngày gần nhất
                </span>
              </div>

              <div className="relative border-l-2 border-slate-100 ml-3 space-y-4 pl-4 text-xs font-medium">
                <div className="py-8 text-center text-slate-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-bold">Chưa có dữ liệu nhật ký</p>
                  <p className="text-[11px] mt-1">Tính năng nhật ký hoạt động sẽ được cập nhật trong phiên bản tiếp theo.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Quick Summary Sidebar (Col-Span 1) */}
        <div className="space-y-6">
          {/* SCOPE STATS CARD */}
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
              PHẠM VI QUẢN LÝ HƯỚNG DẪN
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-blue-50/80 rounded-md border border-blue-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-medium block">
                    Sinh viên hướng dẫn
                  </span>
                  <span className="text-lg font-bold text-blue-900">
                    {navStats.studentCount} Sinh viên
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg">
                  {selectedSemester?.name || "Chưa chọn kỳ"}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-medium block">
                    Doanh nghiệp hợp tác
                  </span>
                  <span className="text-lg font-bold text-slate-900">
                    {navStats.enterpriseCount} Công ty
                  </span>
                </div>
                <Building2 className="w-5 h-5 text-slate-400" />
              </div>

              <div className="p-3.5 bg-rose-50/80 rounded-md border border-rose-200/80 flex items-center justify-between">
                <div>
                  <span className="text-rose-700 font-medium block">
                    Bài nộp chờ chấm
                  </span>
                  <span className="text-lg font-bold text-rose-900">
                    {navStats.pendingReviewCount} bài nộp
                  </span>
                </div>
                {navStats.pendingReviewCount > 0 && (
                  <span className="px-2.5 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full">
                    Cần xử lý
                  </span>
                )}
              </div>

              <div className="p-3.5 bg-amber-50/80 rounded-md border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-amber-800 font-medium block">
                    Thông báo mới
                  </span>
                  <span className="text-lg font-bold text-amber-900">
                    {navStats.unreadNotificationCount} thông báo
                  </span>
                </div>
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          {/* EDU ACCREDITATION CARD */}
          <div className="bg-slate-50 p-5 rounded-lg border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-sm text-slate-900">Hồ sơ Giảng viên Chuẩn</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Tài khoản đã được liên kết chính thức với Cơ sở dữ liệu Phòng Đào Tạo Khoa CNTT. Dữ liệu điểm số và đánh giá báo cáo được bảo mật và tự động đồng bộ.
            </p>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Trạng thái hồ sơ:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Hợp lệ
              </span>
            </div>
          </div>

          {/* HELPFUL LINKS CARD */}
          <div className="bg-white p-5 rounded-lg border border-slate-200/80 shadow-xs space-y-3 text-xs font-semibold">
            <h4 className="text-slate-400 uppercase text-[10px] tracking-wider font-bold">
              TRỢ GIÚP &amp; HƯỚNG DẪN
            </h4>

            <a
              href="#docs"
              onClick={(e) => {
                e.preventDefault();
                showToast("Đã tải tài liệu Sổ tay Hướng dẫn Giảng viên (PDF).");
              }}
              className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-md transition-colors border border-slate-200/60"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Sổ tay Hướng dẫn Giảng viên (PDF)</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                showToast("Email liên hệ Ban Đào tạo: daotao.cntt@vlu.edu.vn");
              }}
              className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-md transition-colors border border-slate-200/60"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Liên hệ Văn phòng Khoa / Admin</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* AVATAR UPDATE MODAL */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Cập nhật ảnh đại diện giảng viên
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAvatar} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đường dẫn ảnh (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newAvatarInput}
                  onChange={(e) => setNewAvatarInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Dán đường dẫn ảnh chân dung hoặc để trống để sử dụng avatar chữ cái mặc định.
                </p>
              </div>

              {/* Preview */}
              <div className="p-3 bg-slate-50 rounded-md flex items-center gap-3 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500">Xem trước:</span>
                {newAvatarInput ? (
                  <img
                    src={newAvatarInput}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-slate-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                    GV
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow-xs"
                >
                  Lưu ảnh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGOUT ALL OTHER DEVICES MODAL */}
      {showLogoutAllModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Đăng xuất tất cả thiết bị khác?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Bạn sẽ bị đăng xuất khỏi tất cả các trình duyệt và thiết bị di động ngoại trừ phiên hiện tại này.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutAllModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs flex-1"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleLogoutAllOtherDevices}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-md text-xs flex-1 shadow-xs"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
