import { useState, FormEvent, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  Building2,
  GraduationCap,
  ShieldCheck,
  Camera,
  Edit3,
  Key,
  LogOut,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Panel } from "../../../components/common/Panel";
import { getApiErrorMessage } from "../../../lib/apiClient";
import { authService } from "../../../services/auth.service";
import { useStudentPortal } from "../../../contexts/StudentPortalContext";
import type { StudentProfile } from "../../../types/common";
import type { StudentPortalProfileDto } from "../../../types/api";

type PersonalInfo = {
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  address: string;
  className: string;
  major: string;
  faculty: string;
};

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&auto=format&fit=crop&q=80";

function contactStorageKey(mssv: string) {
  return `internlink_student_contact_${mssv}`;
}

function avatarStorageKey(mssv: string) {
  return `internlink_student_avatar_${mssv}`;
}

function buildPersonalInfo(
  profile: StudentProfile,
  portal?: StudentPortalProfileDto | null,
): PersonalInfo {
  const s = portal?.student;
  return {
    fullName: s?.fullName ?? profile.name ?? "—",
    studentId: s?.studentCode ?? profile.mssv ?? "—",
    email: s?.email ?? (profile.mssv ? `${profile.mssv}@student.edu.vn` : "—"),
    phone: s?.phone ?? "—",
    address: "—",
    className: s?.class ?? profile.class ?? "—",
    major: s?.major ?? profile.major ?? "—",
    faculty: "Khoa Công nghệ Thông tin",
  };
}

function loadContactOverrides(mssv: string): Partial<PersonalInfo> | null {
  if (!mssv || mssv === "—") return null;
  try {
    const raw = localStorage.getItem(contactStorageKey(mssv));
    return raw ? (JSON.parse(raw) as Partial<PersonalInfo>) : null;
  } catch {
    return null;
  }
}

export const AccountView = ({
  onShowToast,
  onLogout,
}: {
  onShowToast: (msg: string) => void;
  onNavigate?: (tab: string) => void;
  onLogout?: () => void;
}) => {
  const { profile, portalData } = useStudentPortal();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() =>
    buildPersonalInfo(profile, portalData),
  );
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempPersonalInfo, setTempPersonalInfo] = useState<PersonalInfo>(() =>
    buildPersonalInfo(profile, portalData),
  );
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [tempAvatarInput, setTempAvatarInput] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    const base = buildPersonalInfo(profile, portalData);
    const overrides = loadContactOverrides(base.studentId);
    const merged = overrides ? { ...base, ...overrides } : base;
    setPersonalInfo(merged);
    if (!isEditingProfile) {
      setTempPersonalInfo(merged);
    }

    const storedAvatar = localStorage.getItem(avatarStorageKey(base.studentId));
    setAvatarUrl(storedAvatar || DEFAULT_AVATAR);
  }, [portalData, profile, isEditingProfile]);

  const handleSavePersonalInfo = (e: FormEvent) => {
    e.preventDefault();
    const next = { ...tempPersonalInfo };
    setPersonalInfo(next);
    setIsEditingProfile(false);
    if (next.studentId && next.studentId !== "—") {
      localStorage.setItem(
        contactStorageKey(next.studentId),
        JSON.stringify({
          email: next.email,
          phone: next.phone,
          address: next.address,
        }),
      );
    }
    onShowToast(
      "Đã lưu thông tin liên hệ trên thiết bị này (chưa đồng bộ lên hệ thống).",
    );
  };
  const handleCancelPersonalInfo = () => {
    setTempPersonalInfo({ ...personalInfo });
    setIsEditingProfile(false);
    onShowToast("\u0110\xE3 h\u1EE7y ch\u1EC9nh s\u1EEDa th\xF4ng tin");
  };
  const handleChangePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSaved(false);

    if (newPassword.length < 8) {
      setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Xác nhận mật khẩu mới không khớp.");
      return;
    }

    setIsPasswordLoading(true);
    try {
      if (!currentPassword.trim()) {
        setPasswordError("Vui lòng nhập mật khẩu hiện tại.");
        return;
      }
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onShowToast("Đã thay đổi mật khẩu thành công!");
    } catch (err) {
      setPasswordError(getApiErrorMessage(err));
    } finally {
      setIsPasswordLoading(false);
    }
  };
  return (
    <div className="space-y-5 animate-in fade-in duration-200 max-w-7xl mx-auto">
      <PageHeader
        icon={User}
        title="Thông tin Tài khoản"
        subtitle="Quản lý hồ sơ cá nhân, thông tin sinh viên và bảo mật mật khẩu tài khoản."
        badge={`MSSV: ${personalInfo.studentId}`}
        badgeColor="bg-blue-100 text-blue-800 border-blue-200"
        actions={[
          {
            label: "Chỉnh sửa hồ sơ",
            icon: Edit3,
            onClick: () => {
              setIsEditingProfile(true);
              setTempPersonalInfo({ ...personalInfo });
            },
            variant: "secondary",
          },
        ]}
      >
        <span className="px-2 py-0.5 font-semibold text-[10px] rounded-md border bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> {profile.statusBadge}
        </span>
        <button
          type="button"
          onClick={() => {
            if (onLogout) onLogout();
            else onShowToast("Đã đăng xuất tài khoản!");
          }}
          className="il-btn-press px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-md border border-rose-200 transition-all flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng xuất</span>
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Panel className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="relative group shrink-0">
                  <img
                    src={avatarUrl}
                    alt={personalInfo.fullName}
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setTempAvatarInput(avatarUrl);
                      setShowAvatarModal(true);
                    }}
                    className="absolute -bottom-1 -right-1 p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md border border-white transition-colors"
                    title="Đổi ảnh đại diện"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {personalInfo.fullName}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {personalInfo.major} · Lớp {personalInfo.className}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" /> {personalInfo.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditingProfile(true);
                  setTempPersonalInfo({ ...personalInfo });
                }}
                className="il-btn il-btn-secondary text-xs self-start sm:self-center"
              >
                <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-md">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Doanh nghiệp
                  </p>
                  <p className="font-bold text-slate-800">
                    {profile.company}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-md">
                <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Giảng viên HD
                  </p>
                  <p className="font-bold text-slate-800">
                    {profile.lecturerName}
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" /> Hồ sơ cá nhân
              </h2>

              {!isEditingProfile ? (
                <button
                  onClick={() => {
                    setIsEditingProfile(true);
                    setTempPersonalInfo({ ...personalInfo });
                  }}
                  className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-md transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
                </button>
              ) : (
                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 font-bold text-[11px] rounded-lg border border-amber-200">
                  Đang chỉnh sửa
                </span>
              )}
            </div>

            <form onSubmit={handleSavePersonalInfo} className="space-y-4">
              {/* EDITABLE CONTACT FIELDS */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" /> Thông tin liên hệ
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={
                        isEditingProfile
                          ? tempPersonalInfo.fullName
                          : personalInfo.fullName
                      }
                      onChange={(e) =>
                        setTempPersonalInfo({
                          ...tempPersonalInfo,
                          fullName: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                      required
                      className={`w-full px-3.5 py-2 rounded-md border font-bold outline-none transition-all ${isEditingProfile ? "bg-white border-blue-400 focus:border-blue-600 text-slate-900 shadow-xs" : "bg-slate-50 border-slate-200/80 text-slate-900"}`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email sinh viên *
                    </label>
                    <input
                      type="email"
                      value={
                        isEditingProfile
                          ? tempPersonalInfo.email
                          : personalInfo.email
                      }
                      onChange={(e) =>
                        setTempPersonalInfo({
                          ...tempPersonalInfo,
                          email: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                      required
                      className={`w-full px-3.5 py-2 rounded-md border font-bold outline-none transition-all ${isEditingProfile ? "bg-white border-blue-400 focus:border-blue-600 text-slate-900 shadow-xs" : "bg-slate-50 border-slate-200/80 text-slate-900"}`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="text"
                      value={
                        isEditingProfile
                          ? tempPersonalInfo.phone
                          : personalInfo.phone
                      }
                      onChange={(e) =>
                        setTempPersonalInfo({
                          ...tempPersonalInfo,
                          phone: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                      required
                      className={`w-full px-3.5 py-2 rounded-md border font-bold outline-none transition-all ${isEditingProfile ? "bg-white border-blue-400 focus:border-blue-600 text-slate-900 shadow-xs" : "bg-slate-50 border-slate-200/80 text-slate-900"}`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Địa chỉ liên hệ
                    </label>
                    <input
                      type="text"
                      value={
                        isEditingProfile
                          ? tempPersonalInfo.address
                          : personalInfo.address
                      }
                      onChange={(e) =>
                        setTempPersonalInfo({
                          ...tempPersonalInfo,
                          address: e.target.value,
                        })
                      }
                      disabled={!isEditingProfile}
                      className={`w-full px-3.5 py-2 rounded-md border font-medium outline-none transition-all ${isEditingProfile ? "bg-white border-blue-400 focus:border-blue-600 text-slate-900 shadow-xs" : "bg-slate-50 border-slate-200/80 text-slate-900"}`}
                    />
                  </div>
                </div>
              </div>

              {/* READ-ONLY ACADEMIC FIELDS */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Thông tin sinh
                  viên (Cố định)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-md border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      MSSV
                    </p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {personalInfo.studentId}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-md border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Lớp
                    </p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {personalInfo.className}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-md border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Ngành học
                    </p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {personalInfo.major}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-md border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Khoa
                    </p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {personalInfo.faculty}
                    </p>
                  </div>
                </div>
              </div>

              {/* SAVE / CANCEL BUTTONS */}
              {isEditingProfile && (
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelPersonalInfo}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" /> Hủy
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" /> Lưu thay đổi
                  </button>
                </div>
              )}
            </form>
          </Panel>
        </div>

        <div className="lg:col-span-1 space-y-5">
          <Panel className="space-y-4" id="change-password">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Bảo mật
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200/80">
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Lần đăng nhập gần nhất
                </p>
                <p className="font-bold text-slate-900 mt-0.5">—</p>
                <p className="text-[10px] text-slate-500">
                  Thông tin đăng nhập chưa được hiển thị
                </p>
              </div>
            </div>

            {passwordSaved && (
              <div className="p-3 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Mật khẩu đã được cập nhật.
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs border-t border-slate-100 pt-4">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-600" /> Đổi mật khẩu
              </p>

              {passwordError && (
                <div className="p-2.5 rounded-md border border-rose-200 bg-rose-50 text-rose-800 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mật khẩu hiện tại{" "}
                  <span className="text-slate-400 font-medium">(tuỳ chọn)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Bỏ trống nếu lần đăng nhập đầu"
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mật khẩu mới *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="Tối thiểu 8 ký tự"
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Xác nhận mật khẩu mới *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPasswordLoading}
                className="il-btn il-btn-primary w-full justify-center py-2 disabled:opacity-60"
              >
                {isPasswordLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang lưu...
                  </>
                ) : (
                  "Cập nhật mật khẩu"
                )}
              </button>
            </form>
          </Panel>

          <Panel className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <LogOut className="w-4 h-4 text-rose-600" /> Đăng xuất hệ thống
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Đăng xuất phiên làm việc khỏi trình duyệt này. Tất cả dữ liệu báo
              cáo vẫn được lưu an toàn.
            </p>
            <button
              onClick={() => {
                if (onLogout) onLogout();
                else
                  onShowToast(
                    "\u0110\xE3 \u0111\u0103ng xu\u1EA5t t\xE0i kho\u1EA3n!",
                  );
              }}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-md border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Đăng xuất ngay
            </button>
          </Panel>
        </div>
      </div>

      {/* MODAL: EDIT AVATAR */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-md max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95 relative">
            <button
              onClick={() => setShowAvatarModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-md shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                Đổi ảnh đại diện
              </h3>
            </div>

            <div className="text-center space-y-3">
              <img
                src={tempAvatarInput || avatarUrl}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-lg object-cover mx-auto ring-2 ring-blue-100 border border-slate-200 shadow-sm"
              />

              <div className="text-left text-xs space-y-1">
                <label className="block font-bold text-slate-700">
                  Đường dẫn ảnh (URL Image)
                </label>
                <input
                  type="text"
                  value={tempAvatarInput}
                  onChange={(e) => setTempAvatarInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md font-medium outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md transition-colors"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={() => {
                  if (tempAvatarInput) {
                    setAvatarUrl(tempAvatarInput);
                    if (personalInfo.studentId && personalInfo.studentId !== "—") {
                      localStorage.setItem(
                        avatarStorageKey(personalInfo.studentId),
                        tempAvatarInput,
                      );
                    }
                  }
                  setShowAvatarModal(false);
                  onShowToast("Đã cập nhật ảnh đại diện trên thiết bị này.");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Cập nhật</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AccountView as StudentAccountView };
