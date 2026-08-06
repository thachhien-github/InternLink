import { useState } from 'react';
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
  Check
} from 'lucide-react';
export const AccountView = ({
  onShowToast,
  onNavigate,
  onLogout
}) => {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Nguy\u1EC5n V\u0103n An",
    studentId: "20110123",
    email: "nguyenvana@student.edu.vn",
    phone: "0988 123 456",
    address: "123 Nguy\u1EC5n V\u0103n C\u1EEB, Ph\u01B0\u1EDDng 4, Qu\u1EADn 5, TP. H\u1ED3 Ch\xED Minh",
    className: "20DTH1",
    major: "C\xF4ng ngh\u1EC7 Ph\u1EA7n m\u1EC1m",
    faculty: "Khoa C\xF4ng ngh\u1EC7 Th\xF4ng tin"
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempPersonalInfo, setTempPersonalInfo] = useState({ ...personalInfo });
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [tempAvatarInput, setTempAvatarInput] = useState("");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordText, setShowPasswordText] = useState(false);
  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    setPersonalInfo({ ...tempPersonalInfo });
    setIsEditingProfile(false);
    onShowToast("\u0110\xE3 l\u01B0u th\xF4ng tin t\xE0i kho\u1EA3n th\xE0nh c\xF4ng!");
  };
  const handleCancelPersonalInfo = () => {
    setTempPersonalInfo({ ...personalInfo });
    setIsEditingProfile(false);
    onShowToast("\u0110\xE3 h\u1EE7y ch\u1EC9nh s\u1EEDa th\xF4ng tin");
  };
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      onShowToast("Vui l\xF2ng nh\u1EADp m\u1EADt kh\u1EA9u hi\u1EC7n t\u1EA1i!");
      return;
    }
    if (newPassword.length < 6) {
      onShowToast("M\u1EADt kh\u1EA9u m\u1EDBi ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 6 k\xFD t\u1EF1!");
      return;
    }
    if (newPassword !== confirmPassword) {
      onShowToast("X\xE1c nh\u1EADn m\u1EADt kh\u1EA9u m\u1EDBi kh\xF4ng kh\u1EDBp!");
      return;
    }
    setShowChangePasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onShowToast("\u0110\xE3 thay \u0111\u1ED5i m\u1EADt kh\u1EA9u th\xE0nh c\xF4ng!");
  };
  return <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      
      {
    /* 1. COMPACT HEADER BANNER */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Thông tin Tài khoản
            </h1>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-extrabold text-[11px] rounded-full border border-blue-200">
              MSSV: {personalInfo.studentId}
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 font-extrabold text-[11px] rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sinh viên chính thức
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Quản lý hồ sơ cá nhân, thông tin sinh viên và bảo mật mật khẩu tài khoản.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
    onClick={() => setShowChangePasswordModal(true)}
    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
  >
            <Key className="w-3.5 h-3.5 text-slate-500" />
            <span>Đổi mật khẩu</span>
          </button>

          <button
    onClick={() => {
      if (onLogout) onLogout();
      else onShowToast("\u0110\xE3 \u0111\u0103ng xu\u1EA5t t\xE0i kho\u1EA3n!");
    }}
    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all flex items-center gap-1.5"
  >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {
    /* 2. MAIN ACCOUNT CONTENT GRID */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {
    /* LEFT 2 COLS: PERSONAL INFO FORM & INTERNSHIP SUMMARY */
  }
        <div className="lg:col-span-2 space-y-6">

          {
    /* HERO PROFILE SUMMARY CARD */
  }
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-4">
                
                {
    /* Avatar with edit icon */
  }
                <div className="relative group shrink-0">
                  <img
    src={avatarUrl}
    alt={personalInfo.fullName}
    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-400/40 border border-white/20 shadow-md"
  />
                  <button
    onClick={() => {
      setTempAvatarInput(avatarUrl);
      setShowAvatarModal(true);
    }}
    className="absolute -bottom-1 -right-1 p-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-xs border border-white/30 transition-transform hover:scale-110"
    title="Đổi ảnh đại diện"
  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-extrabold text-white">{personalInfo.fullName}</h2>
                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                      Lớp {personalInfo.className}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{personalInfo.major} • {personalInfo.faculty}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                    <Mail className="w-3 h-3 text-blue-400" /> {personalInfo.email}
                  </p>
                </div>
              </div>

              <button
    onClick={() => {
      setIsEditingProfile(true);
      setTempPersonalInfo({ ...personalInfo });
    }}
    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-center"
  >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa</span>
              </button>
            </div>

            {
    /* Quick Internship Info */
  }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-blue-300 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Doanh nghiệp thực tập</p>
                  <p className="font-bold text-white text-xs">Công ty TNHH FPT Software</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-emerald-300 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Giảng viên hướng dẫn</p>
                  <p className="font-bold text-emerald-300 text-xs">Thầy Nguyễn Văn Phước</p>
                </div>
              </div>
            </div>
          </div>

          {
    /* PERSONAL INFORMATION DETAILS */
  }
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" /> Hồ sơ cá nhân
              </h2>

              {!isEditingProfile ? <button
    onClick={() => {
      setIsEditingProfile(true);
      setTempPersonalInfo({ ...personalInfo });
    }}
    className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
  >
                  <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
                </button> : <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 font-bold text-[11px] rounded-lg border border-amber-200">
                  Đang chỉnh sửa
                </span>}
            </div>

            <form onSubmit={handleSavePersonalInfo} className="space-y-4">
              {
    /* EDITABLE CONTACT FIELDS */
  }
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" /> Thông tin liên hệ
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Họ và tên *</label>
                    <input
    type="text"
    value={isEditingProfile ? tempPersonalInfo.fullName : personalInfo.fullName}
    onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, fullName: e.target.value })}
    disabled={!isEditingProfile}
    required
    className={`w-full px-3.5 py-2 rounded-xl border font-bold outline-none transition-all ${isEditingProfile ? "bg-white border-blue-400 focus:border-blue-600 text-slate-900 shadow-xs" : "bg-slate-50 border-slate-200/80 text-slate-900"}`}
  />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email sinh viên *</label>
                    <input
    type="email"
    value={isEditingProfile ? tempPersonalInfo.email : personalInfo.email}
    onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, email: e.target.value })}
    disabled={!isEditingProfile}
    required
    className={`w-full px-3.5 py-2 rounded-xl border font-bold outline-none transition-all ${isEditingProfile ? "bg-white border-blue-400 focus:border-blue-600 text-slate-900 shadow-xs" : "bg-slate-50 border-slate-200/80 text-slate-900"}`}
  />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại *</label>
                    <input
    type="text"
    value={isEditingProfile ? tempPersonalInfo.phone : personalInfo.phone}
    onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, phone: e.target.value })}
    disabled={!isEditingProfile}
    required
    className={`w-full px-3.5 py-2 rounded-xl border font-bold outline-none transition-all ${isEditingProfile ? "bg-white border-blue-400 focus:border-blue-600 text-slate-900 shadow-xs" : "bg-slate-50 border-slate-200/80 text-slate-900"}`}
  />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Địa chỉ liên hệ</label>
                    <input
    type="text"
    value={isEditingProfile ? tempPersonalInfo.address : personalInfo.address}
    onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, address: e.target.value })}
    disabled={!isEditingProfile}
    className={`w-full px-3.5 py-2 rounded-xl border font-medium outline-none transition-all ${isEditingProfile ? "bg-white border-blue-400 focus:border-blue-600 text-slate-900 shadow-xs" : "bg-slate-50 border-slate-200/80 text-slate-900"}`}
  />
                  </div>
                </div>
              </div>

              {
    /* READ-ONLY ACADEMIC FIELDS */
  }
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Thông tin sinh viên (Cố định)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">MSSV</p>
                    <p className="font-black text-slate-900 mt-0.5">{personalInfo.studentId}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Lớp</p>
                    <p className="font-bold text-slate-900 mt-0.5">{personalInfo.className}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Ngành học</p>
                    <p className="font-bold text-slate-900 mt-0.5">{personalInfo.major}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Khoa</p>
                    <p className="font-bold text-slate-900 mt-0.5">{personalInfo.faculty}</p>
                  </div>
                </div>
              </div>

              {
    /* SAVE / CANCEL BUTTONS */
  }
              {isEditingProfile && <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
    type="button"
    onClick={handleCancelPersonalInfo}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
  >
                    <X className="w-3.5 h-3.5" /> Hủy
                  </button>

                  <button
    type="submit"
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
  >
                    <Save className="w-3.5 h-3.5" /> Lưu thay đổi
                  </button>
                </div>}
            </form>
          </div>

        </div>

        {
    /* RIGHT 1 COL: ACCOUNT SECURITY & SESSION INFO */
  }
        <div className="lg:col-span-1 space-y-6">

          {
    /* SECURITY STATUS BOX */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Bảo mật & Đăng nhập
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Mật khẩu tài khoản</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-800">••••••••••••</span>
                  <button
    onClick={() => setShowChangePasswordModal(true)}
    className="text-[11px] text-blue-600 hover:text-blue-700 font-bold"
  >
                    Thay đổi
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Lần đăng nhập gần nhất</p>
                <p className="font-bold text-slate-900">Hôm nay, 10:15</p>
                <p className="text-[10px] text-slate-500">Thiết bị: macOS / Google Chrome</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Trạng thái bảo vệ</p>
                <p className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tài khoản đã xác thực
                </p>
              </div>
            </div>

            <div className="pt-1">
              <button
    onClick={() => setShowChangePasswordModal(true)}
    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
  >
                <Key className="w-3.5 h-3.5" /> Đổi mật khẩu tài khoản
              </button>
            </div>
          </div>

          {
    /* LOGOUT QUICK BOX */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <LogOut className="w-4 h-4 text-rose-600" /> Đăng xuất hệ thống
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Đăng xuất phiên làm việc khỏi trình duyệt này. Tất cả dữ liệu báo cáo vẫn được lưu an toàn.
            </p>
            <button
    onClick={() => {
      if (onLogout) onLogout();
      else onShowToast("\u0110\xE3 \u0111\u0103ng xu\u1EA5t t\xE0i kho\u1EA3n!");
    }}
    className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
  >
              <LogOut className="w-3.5 h-3.5" /> Đăng xuất ngay
            </button>
          </div>

        </div>

      </div>

      {
    /* MODAL 1: CHANGE PASSWORD */
  }
      {showChangePasswordModal && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 relative">
            <button
    onClick={() => setShowChangePasswordModal(false)}
    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
  >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Đổi mật khẩu tài khoản</h3>
                <p className="text-xs text-slate-500 font-medium">Nhập mật khẩu hiện tại và thiết lập mật khẩu mới</p>
              </div>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu hiện tại *</label>
                <div className="relative">
                  <input
    type={showPasswordText ? "text" : "password"}
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    required
    placeholder="••••••••"
    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 pr-10"
  />
                  <button
    type="button"
    onClick={() => setShowPasswordText(!showPasswordText)}
    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
  >
                    {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu mới (Tối thiểu 6 ký tự) *</label>
                <input
    type={showPasswordText ? "text" : "password"}
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    required
    placeholder="••••••••"
    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
  />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới *</label>
                <input
    type={showPasswordText ? "text" : "password"}
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
    placeholder="••••••••"
    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500"
  />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
    type="button"
    onClick={() => setShowChangePasswordModal(false)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
  >
                  Hủy
                </button>

                <button
    type="submit"
    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
  >
                  <Key className="w-4 h-4" />
                  <span>Xác nhận đổi</span>
                </button>
              </div>
            </form>
          </div>
        </div>}

      {
    /* MODAL 2: EDIT AVATAR */
  }
      {showAvatarModal && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95 relative">
            <button
    onClick={() => setShowAvatarModal(false)}
    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
  >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Đổi ảnh đại diện</h3>
            </div>

            <div className="text-center space-y-3">
              <img
    src={tempAvatarInput || avatarUrl}
    alt="Avatar Preview"
    className="w-20 h-20 rounded-2xl object-cover mx-auto ring-2 ring-blue-100 border border-slate-200 shadow-sm"
  />

              <div className="text-left text-xs space-y-1">
                <label className="block font-bold text-slate-700">Đường dẫn ảnh (URL Image)</label>
                <input
    type="text"
    value={tempAvatarInput}
    onChange={(e) => setTempAvatarInput(e.target.value)}
    placeholder="https://images.unsplash.com/..."
    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:bg-white focus:border-blue-500"
  />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
    type="button"
    onClick={() => setShowAvatarModal(false)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
  >
                Hủy
              </button>

              <button
    type="button"
    onClick={() => {
      if (tempAvatarInput) setAvatarUrl(tempAvatarInput);
      setShowAvatarModal(false);
      onShowToast("\u0110\xE3 c\u1EADp nh\u1EADt \u1EA3nh \u0111\u1EA1i di\u1EC7n th\xE0nh c\xF4ng!");
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
  >
                <Check className="w-4 h-4" />
                <span>Cập nhật</span>
              </button>
            </div>
          </div>
        </div>}

    </div>;
};

export { AccountView as StudentAccountView };
