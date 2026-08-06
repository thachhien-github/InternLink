import { useState } from 'react';
import { Search, Bell, User, Check } from 'lucide-react';
export const Header = ({
  activeTab,
  onNavigate,
  searchQuery,
  onSearchChange,
  unreadCount = 3,
  currentLecturer,
  assignedStudentsCount,
  onSwitchPortal,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const getTabLabel = (tab) => {
    switch (tab) {
      case "dashboard":
        return "T\u1ED5ng quan";
      case "students":
        return "Sinh vi\xEAn";
      case "internships":
        return "\u0110\u1EE3t th\u1EF1c t\u1EADp";
      case "enterprises":
        return "Doanh nghi\u1EC7p";
      case "templates":
        return "Bi\u1EC3u m\u1EABu";
      case "evaluations":
        return "\u0110\xE1nh gi\xE1 & Ch\u1EA5m \u0111i\u1EC3m";
      case "analytics":
        return "Th\u1ED1ng k\xEA & Ph\xE2n t\xEDch";
      case "reports":
        return "Kho B\xE1o c\xE1o \u0026 B\xE0i n\u1ED9p";
      case "notifications":
        return "Th\xF4ng b\xE1o";
      case "account":
        return "T\xE0i kho\u1EA3n & C\xE0i \u0111\u1EB7t";
      default:
        return "T\u1ED5ng quan";
    }
  };
  return <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4">
      {
    /* Left Breadcrumb & Active Lecturer Scope Indicator */
  }
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 font-medium">
          <span
    onClick={() => onNavigate("dashboard")}
    className="cursor-pointer hover:text-blue-600 transition-colors hidden sm:inline"
  >
            Nền tảng
          </span>
          <span className="hidden sm:inline">›</span>
          <span className="text-slate-900 font-semibold">{getTabLabel(activeTab)}</span>
        </div>

        {
    /* Active Lecturer Badge (Fixed to assigned scope) */
  }
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/90 text-blue-900 rounded-xl border border-blue-200/80 font-bold text-xs shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="truncate max-w-[180px] sm:max-w-none">
            GV: Trần Minh Huy ({currentLecturer}) • {assignedStudentsCount} SV HD
          </span>
        </div>
      </div>

      {
    /* Right Controls: Search bar, Notifications, Profile */
  }
      <div className="flex items-center gap-3">


        {
    /* Search Input */
  }
        <div className="relative w-48 sm:w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
    type="text"
    value={searchQuery}
    onChange={(e) => onSearchChange(e.target.value)}
    placeholder="Tìm sinh viên, doanh nghiệp, MSSV..."
    className="w-full pl-9 pr-3 py-1.5 text-xs md:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-full outline-none transition-all placeholder:text-slate-400"
  />
          {searchQuery && <button
    onClick={() => onSearchChange("")}
    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
  >
              ✕
            </button>}
        </div>

        {
    /* Notifications Popover */
  }
        <div className="relative">
          <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors relative"
    title="Thông báo"
  >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>}
          </button>

          {showNotifications && <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <h4 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-blue-600" /> Thông báo mới
                </h4>
                <button
    onClick={() => setShowNotifications(false)}
    className="text-xs text-blue-600 hover:underline"
  >
                  Đánh dấu đã đọc
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span className="text-blue-700">⚠️ Báo cáo quá hạn</span>
                    <span className="text-[10px] text-slate-400">10 phút trước</span>
                  </div>
                  <p className="text-slate-600">Phạm Phương Thảo (MSSV: 20120999) đã quá hạn nộp Báo cáo giữa kỳ.</p>
                </div>

                <div className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs space-y-1 transition-colors">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>🏢 Doanh nghiệp mới đăng ký</span>
                    <span className="text-[10px] text-slate-400">1 giờ trước</span>
                  </div>
                  <p className="text-slate-600">CMC Global yêu cầu xác nhận đối tác thực tập cho 5 sinh viên.</p>
                </div>

                <div className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs space-y-1 transition-colors">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>✨ AI Phát hiện trùng lặp</span>
                    <span className="text-[10px] text-slate-400">3 giờ trước</span>
                  </div>
                  <p className="text-slate-600">Báo cáo của Nguyễn Văn C có độ trùng lặp 38% với mẫu khóa trước.</p>
                </div>
              </div>

              <button
    onClick={() => {
      setShowNotifications(false);
      onNavigate("notifications");
    }}
    className="w-full mt-3 py-1.5 text-center text-xs text-blue-600 font-semibold bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
  >
                Xem tất cả thông báo
              </button>
            </div>}
        </div>

        {
    /* User Profile Icon */
  }
        <div className="relative">
          <button
    onClick={() => setShowProfileMenu(!showProfileMenu)}
    className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 hover:ring-blue-300 transition-all"
    title="Tài khoản Giảng viên hướng dẫn"
  >
            <User className="w-4 h-4" />
          </button>

          {showProfileMenu && <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="p-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">
                  {currentLecturer === "Th\u1EA7y Ph\u01B0\u1EDBc" ? "Tr\u1EA7n Minh Huy (Th\u1EA7y Ph\u01B0\u1EDBc)" : currentLecturer === "Th\u1EA7y Th\xE0nh" ? "Nguy\u1EC5n \u0110\u1EE9c Th\xE0nh (Th\u1EA7y Th\xE0nh)" : currentLecturer === "Th\u1EA7y C\u01B0\u1EDDng" ? "Ph\u1EA1m H\xF9ng C\u01B0\u1EDDng (Th\u1EA7y C\u01B0\u1EDDng)" : currentLecturer === "C\xF4 Minh An" ? "\u0110\u1EB7ng Minh An (C\xF4 Minh An)" : "Qu\u1EA3n tr\u1ECB vi\xEAn Super Admin"}
                </p>
                <p className="text-[11px] text-blue-600 font-semibold">Giảng viên hướng dẫn ({assignedStudentsCount} SV)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {currentLecturer === "Th\u1EA7y Ph\u01B0\u1EDBc" ? "huy.tm@internlink.edu.vn" : currentLecturer === "Th\u1EA7y Th\xE0nh" ? "thanh.nd@internlink.edu.vn" : currentLecturer === "Th\u1EA7y C\u01B0\u1EDDng" ? "cuong.ph@internlink.edu.vn" : currentLecturer === "C\xF4 Minh An" ? "an.dm@internlink.edu.vn" : "admin@internlink.edu.vn"}
                </p>
              </div>

              <div className="py-1 text-xs space-y-0.5">
                <button
    onClick={() => {
      setShowProfileMenu(false);
      onNavigate("account");
    }}
    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-lg flex items-center justify-between font-medium transition-colors"
  >
                  <span>Hồ sơ cá nhân</span>
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
    onClick={() => {
      setShowProfileMenu(false);
      alert("Ch\u1EE9c n\u0103ng \u0110\u1ED5i m\u1EADt kh\u1EA9u \u0111\xE3 m\u1EDF. Nh\u1EADp m\u1EADt kh\u1EA9u m\u1EDBi \u0111\u1EC3 c\u1EADp nh\u1EADt.");
    }}
    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-lg flex items-center justify-between font-medium transition-colors"
  >
                  <span>Đổi mật khẩu</span>
                  <Check className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
    onClick={() => {
      setShowProfileMenu(false);
      if (onLogout) {
        onLogout();
      }
    }}
    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-between font-bold transition-colors cursor-pointer"
  >
                  <span>Đăng xuất</span>
                  <span className="material-symbols-outlined text-sm">logout</span>
                </button>
              </div>
            </div>}
        </div>
      </div>
    </header>;
};
