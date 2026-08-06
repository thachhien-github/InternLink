import { useState } from 'react';
import {
  User,
  ShieldCheck,
  KeyRound,
  Laptop,
  Edit3,
  Lock,
  Mail,
  Phone,
  Save,
  X,
  History
} from 'lucide-react';
export const AccountView = ({
  onShowToast
}) => {
  const [profile, setProfile] = useState({
    username: "admin.doyen",
    adminId: "ADM-2024-001",
    fullName: "\u0110\u1ED7 Ho\xE0ng Y\u1EBFn",
    role: "Super Admin (Qu\u1EA3n tr\u1ECB vi\xEAn Cao c\u1EA5p)",
    title: "Tr\u01B0\u1EDFng ban Qu\u1EA3n tr\u1ECB H\u1EC7 th\u1ED1ng",
    department: "V\u0103n ph\xF2ng Khoa C\xF4ng ngh\u1EC7 Th\xF4ng tin",
    email: "yen.do@internlink.edu.vn",
    phone: "0908 123 456",
    address: "227 Nguy\u1EC5n V\u0103n C\u1EEB, Ph\u01B0\u1EDDng 4, Qu\u1EADn 5, TP. H\u1ED3 Ch\xED Minh",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const privileges = [
    {
      id: "p1",
      title: "Qu\u1EA3n l\xFD \u0110\u1EE3t th\u1EF1c t\u1EADp & H\u1ECDc k\u1EF3",
      desc: "T\u1EA1o h\u1ECDc k\u1EF3, c\u1EA5u h\xECnh m\u1ED1c th\u1EDDi gian, ch\u1ED1t \u0111i\u1EC3m \u0111\u1EE3t th\u1EF1c t\u1EADp",
      scope: "To\xE0n quy\u1EC1n (Full Access)",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: "p2",
      title: "Ph\xE2n c\xF4ng Gi\u1EA3ng vi\xEAn & Sinh vi\xEAn",
      desc: "Ph\xE2n c\xF4ng gi\u1EA3ng vi\xEAn ph\u1EE5 tr\xE1ch, duy\u1EC7t danh s\xE1ch sinh vi\xEAn",
      scope: "To\xE0n quy\u1EC1n (Full Access)",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: "p3",
      title: "Ph\xEA duy\u1EC7t Doanh nghi\u1EC7p & Ch\u1EC9 ti\xEAu",
      desc: "Duy\u1EC7t c\xF4ng ty \u0111\u1ED1i t\xE1c, c\u1EA5u h\xECnh ch\u1EC9 ti\xEAu v\xE0 m\u1EE9c ph\u1EE5 c\u1EA5p",
      scope: "To\xE0n quy\u1EC1n (Full Access)",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: "p4",
      title: "C\u1EA5p & Ph\xEA duy\u1EC7t T\xE0i kho\u1EA3n ng\u01B0\u1EDDi d\xF9ng",
      desc: "Duy\u1EC7t y\xEAu c\u1EA7u \u0111\u0103ng k\xFD, c\u1EA5p/thu h\u1ED3i t\xE0i kho\u1EA3n Gi\u1EA3ng vi\xEAn/Sinh vi\xEAn",
      scope: "To\xE0n quy\u1EC1n (Full Access)",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: "p5",
      title: "C\u1EA5u h\xECnh H\u1EC7 th\u1ED1ng & Nh\u1EADt k\xFD Audit Log",
      desc: "Xem l\u1ECBch s\u1EED thao t\xE1c to\xE0n h\u1EC7 th\u1ED1ng, c\u1EA5u h\xECnh tham s\u1ED1 chung",
      scope: "X\xE1c th\u1EF1c 2FA (Requires 2FA)",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
    }
  ];
  const activeSessions = [
    {
      id: "s1",
      device: 'MacBook Pro 16"',
      os: "macOS Sonoma",
      ip: "118.69.182.45",
      loginTime: "02/08/2026 - 08:45",
      isCurrent: true
    },
    {
      id: "s2",
      device: "iPhone 15 Pro",
      os: "iOS 17.5",
      ip: "27.72.102.18",
      loginTime: "01/08/2026 - 19:20",
      isCurrent: false
    }
  ];
  const recentLogs = [
    { time: "02/08/2026 - 08:45", action: "\u0110\u0103ng nh\u1EADp th\xE0nh c\xF4ng", location: "Chrome / macOS" },
    { time: "01/08/2026 - 14:20", action: "C\u1EADp nh\u1EADt th\xF4ng tin \u0111\u1ECBa ch\u1EC9 l\xE0m vi\u1EC7c", location: "Safari / iOS" },
    { time: "25/07/2026 - 10:15", action: "C\u1EADp nh\u1EADt \u1EA3nh \u0111\u1EA1i di\u1EC7n h\u1ED3 s\u01A1", location: "Chrome / macOS" }
  ];
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setIsEditing(false);
    onShowToast("\u0110\xE3 l\u01B0u c\u1EADp nh\u1EADt th\xF4ng tin t\xE0i kho\u1EA3n th\xE0nh c\xF4ng!");
  };
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      onShowToast("M\u1EADt kh\u1EA9u m\u1EDBi v\xE0 x\xE1c nh\u1EADn kh\xF4ng kh\u1EDBp!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      onShowToast("M\u1EADt kh\u1EA9u t\u1ED1i thi\u1EC3u 6 k\xFD t\u1EF1!");
      return;
    }
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    onShowToast("\u0110\xE3 \u0111\u1ED5i m\u1EADt kh\u1EA9u th\xE0nh c\xF4ng!");
  };
  const handleToggle2FA = () => {
    const nextState = !is2FAEnabled;
    setIs2FAEnabled(nextState);
    onShowToast(nextState ? "\u0110\xE3 k\xEDch ho\u1EA1t x\xE1c th\u1EF1c hai y\u1EBFu t\u1ED1 (2FA)" : "\u0110\xE3 t\u1EAFt x\xE1c th\u1EF1c hai y\u1EBFu t\u1ED1 (2FA)");
  };
  return <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {
    /* HEADER BAR */
  }
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Tài khoản Quản trị</h1>
        </div>

        <button
    onClick={() => setIsEditing(!isEditing)}
    className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${isEditing ? "bg-slate-100 hover:bg-slate-200 text-slate-700" : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"}`}
  >
          {isEditing ? <>
              <X className="w-4 h-4" />
              <span>Hủy chỉnh sửa</span>
            </> : <>
              <Edit3 className="w-4 h-4" />
              <span>Chỉnh sửa hồ sơ</span>
            </>}
        </button>
      </div>

      {
    /* USER PROFILE CARD */
  }
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
    src={profile.avatarUrl}
    alt={profile.fullName}
    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-md shrink-0"
  />

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black tracking-tight">{profile.fullName}</h2>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-black rounded border border-emerald-400/30">
                {profile.adminId}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-semibold">{profile.title}</p>
            <p className="text-xs text-slate-400 font-medium">{profile.department}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-2 font-medium">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                {profile.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {
    /* MAIN CONTENT GRID */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {
    /* LEFT COLUMN: Profile info & Permissions */
  }
        <div className="lg:col-span-7 space-y-6">
          
          {
    /* PROFILE INFORMATION / EDIT FORM */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-black text-slate-900">Thông tin cá nhân</h2>
              </div>
            </div>

            {isEditing ? <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Họ và tên</label>
                    <input
    type="text"
    value={editForm.fullName}
    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold outline-none focus:border-blue-500"
    required
  />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Chức danh / Vị trí</label>
                    <input
    type="text"
    value={editForm.title}
    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold outline-none focus:border-blue-500"
    required
  />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email liên hệ</label>
                    <input
    type="email"
    value={editForm.email}
    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold outline-none focus:border-blue-500"
    required
  />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                    <input
    type="text"
    value={editForm.phone}
    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold outline-none focus:border-blue-500"
    required
  />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Đơn vị công tác</label>
                    <input
    type="text"
    value={editForm.department}
    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold outline-none focus:border-blue-500"
    required
  />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Địa chỉ làm việc</label>
                    <input
    type="text"
    value={editForm.address}
    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold outline-none focus:border-blue-500"
  />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
    type="button"
    onClick={() => {
      setEditForm({ ...profile });
      setIsEditing(false);
    }}
    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl"
  >
                    Hủy
                  </button>
                  <button
    type="submit"
    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xs flex items-center gap-1.5"
  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu thông tin</span>
                  </button>
                </div>
              </form> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Họ và tên</span>
                  <p className="font-extrabold text-slate-900">{profile.fullName}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Chức danh / Vai trò</span>
                  <p className="font-extrabold text-blue-700">{profile.title}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Email công vụ</span>
                  <p className="font-extrabold text-slate-900">{profile.email}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Số điện thoại</span>
                  <p className="font-extrabold text-slate-900">{profile.phone}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5 sm:col-span-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Đơn vị trực thuộc</span>
                  <p className="font-bold text-slate-800">{profile.department}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5 sm:col-span-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Địa chỉ cơ sở</span>
                  <p className="font-bold text-slate-800">{profile.address}</p>
                </div>
              </div>}
          </div>

          {
    /* ADMIN PERMISSIONS LIST */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-black text-slate-900">Quyền hạn Quản trị (Admin Privileges)</h2>
              </div>
            </div>

            <div className="space-y-2.5">
              {privileges.map((p) => <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between gap-2">
                  <p className="text-xs font-black text-slate-900">{p.title}</p>
                  <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border shrink-0 ${p.badgeColor}`}>
                    {p.scope}
                  </span>
                </div>)}
            </div>
          </div>

        </div>

        {
    /* RIGHT COLUMN: Security & Sessions */
  }
        <div className="lg:col-span-5 space-y-6">

          {
    /* SECURITY CARD */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-black text-slate-900">Bảo mật tài khoản</h2>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              
              {
    /* Password row */
  }
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                <p className="font-extrabold text-slate-900">Mật khẩu tài khoản</p>
                <button
    onClick={() => setShowPasswordModal(true)}
    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-extrabold rounded-lg border border-slate-200 text-[11px] shadow-2xs cursor-pointer"
  >
                  Đổi mật khẩu
                </button>
              </div>

              {
    /* 2FA row */
  }
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between gap-2">
                <p className="font-extrabold text-slate-900">Xác thực 2 bước (2FA)</p>
                <button
    onClick={handleToggle2FA}
    className={`px-3 py-1.5 font-extrabold rounded-lg text-[11px] border transition-colors cursor-pointer ${is2FAEnabled ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200" : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"}`}
  >
                  {is2FAEnabled ? "\u0110\xE3 k\xEDch ho\u1EA1t \u2713" : "K\xEDch ho\u1EA1t"}
                </button>
              </div>

            </div>
          </div>

          {
    /* ACTIVE SESSIONS CARD */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-black text-slate-900">Thiết bị đang hoạt động</h2>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {activeSessions.map((sess) => <div key={sess.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-900">{sess.device}</span>
                      {sess.isCurrent && <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[9px] font-black rounded">
                          Phiên hiện tại
                        </span>}
                    </div>
                    <p className="text-[10px] text-slate-500">{sess.os} • IP: {sess.ip}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">{sess.loginTime}</span>
                </div>)}
            </div>
          </div>

          {
    /* RECENT ACTIVITY LOGS */
  }
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-black text-slate-900">Hoạt động gần đây</h2>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {recentLogs.map((log, idx) => <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[10px] text-slate-400 shrink-0">{log.time}</span>
                </div>)}
            </div>
          </div>

        </div>

      </div>

      {
    /* CHANGE PASSWORD MODAL */
  }
      {showPasswordModal && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-slate-900 text-base">Đổi mật khẩu tài khoản</h3>
              </div>
              <button
    onClick={() => setShowPasswordModal(false)}
    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu hiện tại</label>
                <input
    type="password"
    value={passwordForm.currentPassword}
    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold outline-none focus:border-blue-500"
    required
  />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mật khẩu mới</label>
                <input
    type="password"
    value={passwordForm.newPassword}
    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold outline-none focus:border-blue-500"
    required
  />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                <input
    type="password"
    value={passwordForm.confirmPassword}
    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold outline-none focus:border-blue-500"
    required
  />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
    type="button"
    onClick={() => setShowPasswordModal(false)}
    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl"
  >
                  Hủy
                </button>
                <button
    type="submit"
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xs"
  >
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>}

    </div>;
};

export { AccountView as AdminAccountView };
