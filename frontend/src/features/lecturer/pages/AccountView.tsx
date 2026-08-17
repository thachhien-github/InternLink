import { useState, useEffect } from "react";
import { Toast } from "../../../components/common/Toast";
import { PageHeader } from "../../../components/common/PageHeader";
import { USE_MOCK } from "../../../config/env";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { authService } from "../../../services/auth.service";
import { useAuth } from "../../../hooks/useAuth";
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
  ShieldAlert,
  Calendar,
  ExternalLink,
} from "lucide-react";
export const AccountView = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [fullName, setFullName] = useState("TS. Trần Minh Huy");
  const [email, setEmail] = useState("huy.tran@hust.edu.vn");
  const [phone, setPhone] = useState("0988 123 456");
  const [address, setAddress] = useState(
    "Ph\xF2ng 402, T\xF2a nh\xE0 B1, \u0110H B\xE1ch Khoa H\xE0 N\u1ED9i",
  );
  const [dob, setDob] = useState("18/05/1982");
  const [gender, setGender] = useState("Nam");
  const [degree, setDegree] = useState(
    "Ti\u1EBFn s\u0129 / Gi\u1EA3ng vi\xEAn ch\xEDnh",
  );
  const [faculty, setFaculty] = useState(
    "Khoa C\xF4ng ngh\u1EC7 Th\xF4ng tin & Truy\u1EC1n th\xF4ng",
  );
  const [department, setDepartment] = useState(
    "B\u1ED9 m\xF4n C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m",
  );
  const [bio, setBio] = useState(
    "Gi\u1EA3ng vi\xEAn chuy\xEAn ng\xE0nh C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m, nghi\xEAn c\u1EE9u chuy\xEAn s\xE2u v\u1EC1 Ki\u1EBFn tr\xFAc Ph\u1EA7n m\u1EC1m, Microservices v\xE0 H\u1EC7 th\u1ED1ng Ph\xE2n t\xE1n.",
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passSuccessMsg, setPassSuccessMsg] = useState(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);
  const [themeMode, setThemeMode] = useState("light");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSystem, setNotifSystem] = useState(true);
  const [notifSubmissions, setNotifSubmissions] = useState(true);
  const [notifEnterprise, setNotifEnterprise] = useState(true);
  const [notifEvaluations, setNotifEvaluations] = useState(true);
  const [notifDeadlines, setNotifDeadlines] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3e3);
  };

  useEffect(() => {
    if (USE_MOCK || !user) return;
    setFullName(user.name);
    if (user.email) setEmail(user.email);
  }, [user]);

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "bg-slate-200" };
    if (pass.length < 6)
      return { score: 1, label: "Y\u1EBFu", color: "bg-rose-500" };
    if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
      return { score: 2, label: "Trung b\xECnh", color: "bg-amber-500" };
    }
    return { score: 3, label: "M\u1EA1nh", color: "bg-emerald-500" };
  };
  const passStrength = getPasswordStrength(newPassword);
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    showToast(
      "C\u1EADp nh\u1EADt h\u1ED3 s\u01A1 c\xE1 nh\xE2n th\xE0nh c\xF4ng!",
    );
  };
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không trùng khớp!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    try {
      if (!USE_MOCK) {
        if (!currentPassword.trim()) {
          alert("Vui lòng nhập mật khẩu hiện tại.");
          return;
        }
        await authService.changePassword({
          currentPassword,
          newPassword,
        });
      }
      setPassSuccessMsg("Đổi mật khẩu thành công!");
      showToast("Cập nhật mật khẩu tài khoản thành công!");
      setTimeout(() => {
        setPassSuccessMsg(null);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2e3);
    } catch (err) {
      alert(getApiErrorMessage(err));
    }
  };
  return (
    <div className="space-y-5 max-w-[1500px] mx-auto animate-in fade-in duration-200 font-sans pb-10">
      {/* Toast Banner */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {!USE_MOCK && (
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Tài khoản xác thực API thật. Chức năng đổi mật khẩu sẽ gửi trực tiếp đến hệ thống backend.
            </span>
          </div>
        </div>
      )}

      <PageHeader
        icon={User}
        title="Tài khoản & Hồ sơ"
        subtitle="Quản lý hồ sơ cá nhân, tài khoản đăng nhập, bảo mật 2FA và tùy chỉnh hệ thống InternLink."
        badge="Giảng viên Hướng dẫn"
        badgeColor="bg-blue-100 text-blue-800 border-blue-200"
      >
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md shrink-0 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === "profile" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Hồ sơ</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === "security" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bảo mật</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === "preferences" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Tùy chỉnh</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${activeTab === "activity" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Lịch sử</span>
          </button>
        </div>
      </PageHeader>

      {/* Main Grid Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Main Workspace (Col-Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: PROFILE SUMMARY CARD */}
          <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar block */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-lg bg-[#1d4ed8] text-white font-bold text-2xl flex items-center justify-center border-2 border-white">
                  TMH
                </div>
                <button
                  onClick={() =>
                    showToast(
                      "\u0110\xE3 m\u1EDF h\u1ED9p tho\u1EA1i t\u1EA3i \u1EA3nh \u0111\u1EA1i di\u1EC7n m\u1EDBi.",
                    )
                  }
                  className="absolute -bottom-2 -right-2 p-2 bg-slate-900 hover:bg-blue-600 text-white rounded-md shadow-md transition-colors border border-white"
                  title="Đổi ảnh đại diện"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Summary Details */}
              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    {fullName}
                  </h2>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Đã xác thực Edu
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-600 flex items-center justify-center sm:justify-start gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{degree}</span>
                </p>

                <p className="text-xs text-slate-500 font-medium">
                  {department} • {faculty}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Mã GV:{" "}
                    <strong className="text-slate-800 font-mono">
                      GV2018042
                    </strong>
                  </span>
                  <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Tham gia:{" "}
                    <strong className="text-slate-800">15/08/2021</strong>
                  </span>
                </div>
              </div>

              {/* Quick Action Button */}
              <div className="shrink-0 w-full sm:w-auto text-right">
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-md font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs ${isEditingProfile ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>
                    {isEditingProfile
                      ? "\u0110\xF3ng ch\u1EC9nh s\u1EEDa"
                      : "Ch\u1EC9nh s\u1EEDa h\u1ED3 s\u01A1"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: PERSONAL INFORMATION FORM */}
          {activeTab === "profile" && (
            <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Thông tin cá nhân &amp; Giảng dạy
                  </h3>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email giảng viên
                    </label>
                    <input
                      type="email"
                      disabled={!isEditingProfile}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Số điện thoại liên hệ
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Địa chỉ làm việc / Văn phòng
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Ngày sinh
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Giới tính
                    </label>
                    <select
                      disabled={!isEditingProfile}
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
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
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    >
                      <option value="Tiến sĩ / Giảng viên chính">
                        Tiến sĩ / Giảng viên chính
                      </option>
                      <option value="Thạc sĩ / Giảng viên">
                        Thạc sĩ / Giảng viên
                      </option>
                      <option value="Phó Giáo sư / Giảng viên cao cấp">
                        Phó Giáo sư / Giảng viên cao cấp
                      </option>
                      <option value="Giáo sư">Giáo sư</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Khoa / Trường
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-slate-800 disabled:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">
                    Giới thiệu bản thân &amp; Hướng nghiên cứu
                  </label>
                  <textarea
                    rows={3}
                    disabled={!isEditingProfile}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 bg-slate-50 disabled:bg-slate-100/70 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium text-xs text-slate-800 disabled:text-slate-600 leading-relaxed"
                  />
                </div>

                {isEditingProfile && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-xs flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Hủy bỏ</span>
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-xs shadow-xs flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu thay đổi</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* SECTION 3: ACCOUNT INFORMATION CARD */}
          {activeTab === "security" && (
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
                    Tên đăng nhập
                  </span>
                  <span className="font-bold text-slate-900 text-sm font-mono mt-0.5 block">
                    huy.tran.gv
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Email xác thực hệ thống
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    huy.tran@hust.edu.vn
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Vai trò phân quyền
                  </span>
                  <span className="font-bold text-blue-700 mt-0.5 block">
                    Giảng viên Hướng dẫn (Lecturer)
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-md border border-slate-200/70">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Phiên đăng nhập gần nhất
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    10:15 - Hôm nay (IP: 118.70.12.44)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: CHANGE PASSWORD */}
          {activeTab === "security" && (
            <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Đổi Mật Khẩu Tài Khoản
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Cập nhật lần cuối: 15/09/2026
                </span>
              </div>

              <form
                onSubmit={handleChangePasswordSubmit}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập mật khẩu hiện tại..."
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Ít nhất 8 ký tự, chữ hoa & số..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium"
                    />

                    {/* Password Strength Meter */}
                    {newPassword && (
                      <div className="mt-2 space-y-1 animate-in fade-in">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-500">
                            Độ mạnh mật khẩu:
                          </span>
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
                            className={`h-full flex-1 transition-all ${passStrength.score >= 1 ? passStrength.color : "bg-slate-200"}`}
                          />
                          <div
                            className={`h-full flex-1 transition-all ${passStrength.score >= 2 ? passStrength.color : "bg-slate-200"}`}
                          />
                          <div
                            className={`h-full flex-1 transition-all ${passStrength.score >= 3 ? passStrength.color : "bg-slate-200"}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Nhập lại mật khẩu mới..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                {passSuccessMsg && (
                  <p className="p-3 bg-emerald-50 text-emerald-800 font-bold rounded-md border border-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{passSuccessMsg}</span>
                  </p>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-xs shadow-xs transition-colors"
                  >
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 5: SECURITY & 2FA */}
          {activeTab === "security" && (
            <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Bảo mật nâng cao &amp; Thiết bị
                  </h3>
                </div>
              </div>

              {/* 2FA Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-xs text-slate-900">
                      Xác thực 2 yếu tố (2FA)
                    </p>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      Khuyên dùng
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Bảo vệ tài khoản bằng mã TOTP từ ứng dụng Authenticator
                    (Google/Microsoft).
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={is2FAEnabled}
                    onChange={(e) => {
                      setIs2FAEnabled(e.target.checked);
                      showToast(
                        e.target.checked
                          ? "\u0110\xE3 b\u1EADt x\xE1c th\u1EF1c 2FA."
                          : "\u0110\xE3 t\u1EAFt x\xE1c th\u1EF1c 2FA.",
                      );
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              {/* Active Logged In Devices */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  THIẾT BỊ ĐÃ ĐĂNG NHẬP
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-blue-50/70 rounded-md border border-blue-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 text-white rounded-lg">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          Chrome trên Windows 11 (Phiên hiện tại)
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Hà Nội, Việt Nam • IP: 118.70.12.44
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold text-[10px] rounded-full">
                      Đang hoạt động
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-200 text-slate-700 rounded-lg">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          Safari trên iPhone 15 Pro
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Hà Nội, Việt Nam • Đăng nhập 2 giờ trước
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        showToast(
                          "\u0110\xE3 \u0111\u0103ng xu\u1EA5t thi\u1EBFt b\u1ECB Safari iPhone.",
                        )
                      }
                      className="text-rose-600 font-bold hover:underline text-xs"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowLogoutAllModal(true)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-md border border-rose-200 transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất khỏi tất cả thiết bị khác</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6 & 7: NOTIFICATION PREFERENCES & APPEARANCE */}
          {activeTab === "preferences" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notification Toggles */}
              <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Tùy chỉnh Thông báo
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-bold text-slate-800">
                        Thông báo qua Email
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Gửi cập nhật quan trọng tới email Edu
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifEmail}
                      onChange={(e) => setNotifEmail(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-bold text-slate-800">
                        Bài nộp của sinh viên
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Khi SV nộp báo cáo tuần/giữa kỳ
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifSubmissions}
                      onChange={(e) => setNotifSubmissions(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-bold text-slate-800">
                        Phản hồi Doanh nghiệp
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Khi công ty gửi đánh giá thực tập
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifEnterprise}
                      onChange={(e) => setNotifEnterprise(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-bold text-slate-800">
                        Nhắc hạn chấm điểm
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Nhắc nhở khi sắp hết hạn nhập điểm
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifDeadlines}
                      onChange={(e) => setNotifDeadlines(e.target.checked)}
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
                          showToast(
                            "\u0110\xE3 ch\u1ECDn giao di\u1EC7n S\xE1ng.",
                          );
                        }}
                        className={`p-2.5 rounded-md border font-bold flex flex-col items-center gap-1.5 transition-all ${themeMode === "light" ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                      >
                        <Sun className="w-4 h-4" />
                        <span>Sáng</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setThemeMode("dark");
                          showToast(
                            "Ch\u1EBF \u0111\u1ED9 T\u1ED1i s\u1EBD \u0111\u01B0\u1EE3c \xE1p d\u1EE5ng cho to\xE0n b\u1ED9 c\u1ED5ng.",
                          );
                        }}
                        className={`p-2.5 rounded-md border font-bold flex flex-col items-center gap-1.5 transition-all ${themeMode === "dark" ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                      >
                        <Moon className="w-4 h-4" />
                        <span>Tối</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setThemeMode("system");
                          showToast(
                            "\u0110\xE3 thi\u1EBFt l\u1EADp theo h\u1EC7 th\u1ED1ng.",
                          );
                        }}
                        className={`p-2.5 rounded-md border font-bold flex flex-col items-center gap-1.5 transition-all ${themeMode === "system" ? "bg-blue-50 border-blue-500 text-blue-700 shadow-xs" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
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

          {/* SECTION 8: ACTIVITY LOG */}
          {activeTab === "activity" && (
            <div className="bg-white p-6 rounded-lg border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Nhật ký Hoạt động Tài khoản
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Ghi lại 30 ngày gần nhất
                </span>
              </div>

              <div className="relative border-l-2 border-slate-100 ml-3 space-y-4 pl-4 text-xs font-medium">
                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
                  <p className="font-bold text-slate-900">
                    Đăng nhập hệ thống thành công
                  </p>
                  <p className="text-[11px] text-slate-500">
                    10:15 - Hôm nay • IP: 118.70.12.44 (Chrome Windows)
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                  <p className="font-bold text-slate-900">
                    Chấm điểm bài nộp Báo cáo Báo cáo Giữa kỳ
                  </p>
                  <p className="text-[11px] text-slate-500">
                    09:30 - Hôm nay • Sinh viên: Trần Văn B (Đạt 9.0 điểm)
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-xs" />
                  <p className="font-bold text-slate-900">
                    Xuất báo cáo thống kê đợt thực tập Học kỳ I - 2026
                  </p>
                  <p className="text-[11px] text-slate-500">
                    16:00 - Hôm qua • Định dạng Excel (.xlsx)
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white" />
                  <p className="font-bold text-slate-900">
                    Cập nhật thông tin hồ sơ cá nhân
                  </p>
                  <p className="text-[11px] text-slate-500">
                    25/10/2026 • Đã thay đổi số điện thoại và địa chỉ văn phòng
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white" />
                  <p className="font-bold text-slate-900">
                    Đổi mật khẩu tài khoản thành công
                  </p>
                  <p className="text-[11px] text-slate-500">
                    15/09/2026 • Đã xác thực qua OTP Email
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: DANGER ZONE */}
          {activeTab === "security" && (
            <div className="p-5 bg-rose-50/50 rounded-lg border border-rose-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-xs text-rose-900 uppercase tracking-wider">
                  VÙNG NGUY HỂM &amp; TÀI KHOẢN
                </h3>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Các thao tác bên dưới có tác động trực tiếp tới quyền truy cập
                tài khoản giảng viên. Nếu cần tạm khóa tài khoản hoặc hủy phân
                quyền, vui lòng gửi yêu cầu tới Quản trị viên Edu Admin.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <button
                  onClick={() =>
                    alert(
                      "\u0110\xE3 \u0111\u0103ng xu\u1EA5t kh\u1ECFi t\xE0i kho\u1EA3n Gi\u1EA3ng vi\xEAn.",
                    )
                  }
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-md shadow-xs transition-colors"
                >
                  Đăng xuất tài khoản
                </button>
                <button
                  onClick={() =>
                    alert(
                      "\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u h\u1ED7 tr\u1EE3 t\xE0i kho\u1EA3n t\u1EDBi Qu\u1EA3n tr\u1ECB vi\xEAn Edu Admin.",
                    )
                  }
                  className="px-4 py-2 bg-white hover:bg-rose-100 text-rose-700 font-bold rounded-md border border-rose-200 transition-colors"
                >
                  Gửi yêu cầu Khóa tài khoản
                </button>
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
                    28 Sinh viên
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg">
                  HK I - 2026
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-md border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-medium block">
                    Doanh nghiệp hợp tác
                  </span>
                  <span className="text-lg font-bold text-slate-900">
                    6 Công ty
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
                    6 bài nộp
                  </span>
                </div>
                <span className="px-2.5 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full">
                  Cần xử lý
                </span>
              </div>

              <div className="p-3.5 bg-amber-50/80 rounded-md border border-amber-200/80 flex items-center justify-between">
                <div>
                  <span className="text-amber-800 font-medium block">
                    Thông báo chưa đọc
                  </span>
                  <span className="text-lg font-bold text-amber-900">
                    2 thông báo
                  </span>
                </div>
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          {/* EDU CERTIFICATE BADGE */}
          <div className="il-accent-panel p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-sm text-slate-900">Hồ sơ Giảng viên Chuẩn</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Tài khoản đã được liên kết chính thức với Cơ sở dữ liệu Phòng Đào
              Tạo Trường ĐH Bách Khoa Hà Nội.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Trạng thái bảo mật:</span>
              <span className="font-bold text-emerald-700">100% An toàn</span>
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
                showToast(
                  "\u0110\xE3 t\u1EA3i t\xE0i li\u1EC7u H\u01B0\u1EDBng d\u1EABn Gi\u1EA3ng vi\xEAn (PDF).",
                );
              }}
              className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-md transition-colors border border-slate-200/60"
            >
              <span>Sổ tay Hướng dẫn Giảng viên (PDF)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                showToast(
                  "Email li\xEAn h\u1EC7 Admin: admin.edu@internlink.edu.vn",
                );
              }}
              className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-md transition-colors border border-slate-200/60"
            >
              <span>Liên hệ Văn phòng Khoa / Admin</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Logout All Devices Confirmation Modal */}
      {showLogoutAllModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-md border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Đăng xuất tất cả thiết bị?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Bạn sẽ bị đăng xuất khỏi tất cả các trình duyệt và thiết bị di
                động ngoại trừ phiên hiện tại.
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
                onClick={() => {
                  setShowLogoutAllModal(false);
                  showToast(
                    "\u0110\xE3 \u0111\u0103ng xu\u1EA5t kh\u1ECFi 2 thi\u1EBFt b\u1ECB kh\xE1c.",
                  );
                }}
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
