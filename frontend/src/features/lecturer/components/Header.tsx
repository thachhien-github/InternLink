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
}: {
  activeTab: string;
  onNavigate: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadCount?: number;
  currentLecturer?: string;
  assignedStudentsCount?: number;
  onSwitchPortal?: (role: string) => void;
  onLogout?: () => void;
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "dashboard": return "Tổng quan";
      case "students": return "Sinh viên";
      case "internships": return "Đợt thực tập";
      case "enterprises": return "Doanh nghiệp";
      case "templates": return "Biểu mẫu";
      case "evaluations": return "Đánh giá & Chấm điểm";
      case "analytics": return "Thống kê & Phân tích";
      case "reports": return "Kho Báo cáo & Bài nộp";
      case "notifications": return "Thông báo";
      case "account": return "Tài khoản & Cài đặt";
      default: return "Tổng quan";
    }
  };

  return (
    <header className="sticky top-0 z-30 il-glass-panel border-b border-slate-200/80 px-4 md:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left Breadcrumb & Active Lecturer Scope Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 font-medium font-display">
          <span
            onClick={() => onNavigate("dashboard")}
            className="cursor-pointer hover:text-indigo-600 transition-colors hidden sm:inline"
          >
            Nền tảng
          </span>
          <span className="hidden sm:inline text-slate-300">/</span>
          <span className="text-slate-900 font-bold">{getTabLabel(activeTab)}</span>
        </div>

        {/* Active Scope Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50/90 text-indigo-900 rounded-full border border-indigo-200/80 font-bold text-xs shadow-2xs font-display">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="truncate max-w-[180px] sm:max-w-none">
            GV: Trần Minh Huy ({currentLecturer}) • {assignedStudentsCount} SV HD
          </span>
        </div>
      </div>

      {/* Right Controls: Search bar, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Command-Bar Styled Search Input */}
        <div className="relative w-48 sm:w-64 md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm nhanh (Ctrl+K)..."
            className="w-full pl-10 pr-8 py-2 text-xs bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-200/70 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl outline-none transition-all placeholder:text-slate-400 font-medium"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          ) : (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded font-mono hidden md:inline">
              ⌘K
            </span>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 rounded-xl transition-colors relative cursor-pointer"
            title="Thông báo"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white il-kpi-val">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 font-display">
                  <Bell className="w-4 h-4 text-indigo-600" /> Thông báo hệ thống
                </h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  Đã đọc tất cả
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 il-scrollbar">
                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="text-indigo-700">⚠️ Báo cáo quá hạn</span>
                    <span className="text-[10px] text-slate-400 font-normal">10 phút trước</span>
                  </div>
                  <p className="text-slate-600">Phạm Phương Thảo (MSSV: 20120999) đã quá hạn nộp Báo cáo giữa kỳ.</p>
                </div>

                <div className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl text-xs space-y-1 transition-colors">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>🏢 Doanh nghiệp mới đăng ký</span>
                    <span className="text-[10px] text-slate-400 font-normal">1 giờ trước</span>
                  </div>
                  <p className="text-slate-600">CMC Global yêu cầu xác nhận đối tác thực tập cho 5 sinh viên.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowNotifications(false);
                  onNavigate("notifications");
                }}
                className="w-full mt-3 py-2 text-center text-xs text-indigo-600 font-bold bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer font-display"
              >
                Xem toàn bộ thông báo
              </button>
            </div>
          )}
        </div>

        {/* User Profile Icon */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/20 hover:scale-105 transition-all cursor-pointer"
            title="Tài khoản Giảng viên"
          >
            <User className="w-4 h-4" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="p-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 font-display">
                  {currentLecturer === "Thầy Phước" ? "Trần Minh Huy (Thầy Phước)" : currentLecturer === "Thầy Thành" ? "Nguyễn Đức Thành (Thầy Thành)" : currentLecturer === "Thầy Cường" ? "Phạm Hùng Cường (Thầy Cường)" : currentLecturer === "Cô Minh An" ? "Đặng Minh An (Cô Minh An)" : "Quản trị viên Super Admin"}
                </p>
                <p className="text-[11px] text-indigo-600 font-bold">Giảng viên hướng dẫn ({assignedStudentsCount} SV)</p>
              </div>

              <div className="py-1 text-xs space-y-0.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate("account");
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl flex items-center justify-between font-semibold transition-colors cursor-pointer"
                >
                  <span>Hồ sơ cá nhân</span>
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl flex items-center justify-between font-bold transition-colors cursor-pointer"
                >
                  <span>Đăng xuất hệ thống</span>
                  <span className="material-symbols-outlined text-sm">logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
