import { useState } from 'react';
import { Search, Bell, User, Building2 } from 'lucide-react';
import { STUDENT_PROFILE, STUDENT_NOTIFICATIONS } from '../../../data/studentMockData';
export const Header = ({
  activeTab,
  onNavigate,
  onSwitchPortal,
  onLogout,
  searchQuery,
  onSearchChange
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const getTabLabel = (tab) => {
    switch (tab) {
      case "student-dashboard":
        return "T\u1ED5ng quan";
      case "student-internship":
        return "K\u1EF3 th\u1EF1c t\u1EADp c\u1EE7a t\xF4i";
      case "student-weekly-reports":
        return "B\xE1o c\xE1o tu\u1EA7n";
      case "student-submissions":
        return "S\u1EA3n ph\u1EA9m th\u1EF1c t\u1EADp";
      case "student-feedback":
        return "Ph\u1EA3n h\u1ED3i & Ch\u1EC9nh s\u1EEDa";
      case "student-templates":
        return "Bi\u1EC3u m\u1EABu & T\xE0i li\u1EC7u";
      case "student-notifications":
        return "Th\xF4ng b\xE1o";
      case "student-account":
        return "T\xE0i kho\u1EA3n";
      default:
        return "T\u1ED5ng quan";
    }
  };
  const unreadCount = STUDENT_NOTIFICATIONS.filter((n) => n.unread).length;
  return <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4">
      {
    /* Left Greeting & Context Info */
  }
      <div className="flex items-center gap-3">
        {
    /* Navigation Breadcrumb */
  }
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 font-medium">
          <span
    onClick={() => onNavigate("student-dashboard")}
    className="cursor-pointer hover:text-blue-600 transition-colors hidden sm:inline"
  >
            Cổng Sinh viên
          </span>
          <span className="hidden sm:inline">›</span>
          <span className="text-slate-900 font-semibold">{getTabLabel(activeTab)}</span>
        </div>

        {
    /* Company & Internship Status Badge */
  }
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50/90 text-blue-900 rounded-xl border border-blue-200/80 font-bold text-xs shadow-2xs">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          <span className="truncate max-w-[220px]">
            {STUDENT_PROFILE.company} • {STUDENT_PROFILE.position}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-1" />
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-extrabold">
            {STUDENT_PROFILE.statusBadge}
          </span>
        </div>
      </div>

      {
    /* Right Controls: Role Switcher, Search, Notifications, Profile */
  }
      <div className="flex items-center gap-2.5">


        {
    /* Search Input */
  }
        <div className="relative w-40 sm:w-56 md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
    type="text"
    value={searchQuery}
    onChange={(e) => onSearchChange(e.target.value)}
    placeholder="Tìm bài nộp, biểu mẫu..."
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
    title="Thông báo sinh viên"
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
                {STUDENT_NOTIFICATIONS.map((n) => <div key={n.id} className={`p-2.5 rounded-xl text-xs space-y-1 transition-colors ${n.unread ? "bg-blue-50/80 border border-blue-100" : "bg-slate-50 hover:bg-slate-100"}`}>
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span className={n.unread ? "text-blue-800 font-bold" : "text-slate-700"}>
                        {n.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{n.timeAgo}</p>
                  </div>)}
              </div>

              <button
    onClick={() => {
      setShowNotifications(false);
      onNavigate("student-notifications");
    }}
    className="w-full mt-3 py-1.5 text-center text-xs text-blue-600 font-semibold bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
  >
                Xem tất cả thông báo
              </button>
            </div>}
        </div>

        {
    /* Student Profile Button */
  }
        <div className="relative">
          <button
    onClick={() => setShowProfileMenu(!showProfileMenu)}
    className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 hover:ring-blue-300 transition-all"
    title="Hồ sơ Sinh viên"
  >
            SV
          </button>

          {showProfileMenu && <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="pb-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{STUDENT_PROFILE.name}</p>
                <p className="text-[11px] text-blue-600 font-semibold">MSSV: {STUDENT_PROFILE.mssv} • Lớp {STUDENT_PROFILE.class}</p>
                <p className="text-[10px] text-slate-500 mt-1">
                  GVHD: {STUDENT_PROFILE.lecturerName}
                </p>
              </div>

              <div className="py-1 text-xs space-y-0.5">
                <button
    onClick={() => {
      setShowProfileMenu(false);
      onNavigate("student-account");
    }}
    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-lg flex items-center justify-between font-medium transition-colors"
  >
                  <span>Hồ sơ cá nhân</span>
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
    onClick={() => {
      setShowProfileMenu(false);
      onNavigate("student-internship");
    }}
    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-lg flex items-center justify-between font-medium transition-colors"
  >
                  <span>Thông tin thực tập</span>
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {onLogout && <button
    onClick={() => {
      setShowProfileMenu(false);
      onLogout();
    }}
    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-between font-bold transition-colors border-t border-slate-100 pt-2.5 mt-1"
  >
                    <span>Đăng xuất hệ thống</span>
                    <span className="material-symbols-outlined text-sm">logout</span>
                  </button>}
              </div>
            </div>}
        </div>
      </div>
    </header>;
};

export { Header as StudentHeader };
