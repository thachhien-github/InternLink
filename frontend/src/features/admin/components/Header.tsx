import { useState } from 'react';
import {
  Search,
  Bell,
  User,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Settings
} from 'lucide-react';
export const Header = ({
  activeTab,
  onNavigate,
  onSwitchPortal,
  onLogout,
  onShowToast,
  selectedSemester = "H\u1ECDc k\u1EF3 I - 2025-2026",
  onSemesterChange
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const getTabTitle = (tab) => {
    switch (tab) {
      case "admin-dashboard":
        return "T\u1ED5ng quan h\u1EC7 th\u1ED1ng";
      case "admin-semesters":
        return "Qu\u1EA3n l\xFD K\u1EF3 th\u1EF1c t\u1EADp";
      case "admin-lecturers":
        return "Danh s\xE1ch Gi\u1EA3ng vi\xEAn";
      case "admin-students":
        return "Danh s\xE1ch Sinh vi\xEAn";
      case "admin-assignments":
        return "Ph\xE2n c\xF4ng h\u01B0\u1EDBng d\u1EABn";
      case "admin-account-requests":
        return "Duy\u1EC7t Y\xEAu c\u1EA7u t\xE0i kho\u1EA3n";
      case "admin-notifications":
        return "Trung t\xE2m Th\xF4ng b\xE1o";
      case "admin-settings":
        return "C\xE0i \u0111\u1EB7t H\u1EC7 th\u1ED1ng";
      case "admin-account":
        return "H\u1ED3 s\u01A1 Ban Qu\u1EA3n l\xFD";
      default:
        return "Trang qu\u1EA3n tr\u1ECB";
    }
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onShowToast(`\u0110ang t\xECm ki\u1EBFm to\xE0n h\u1EC7 th\u1ED1ng: "${searchQuery}"`);
    }
  };
  return <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4">
      {
    /* Left Breadcrumb & Semester/Admin Badge */
  }
      <div className="flex items-center gap-3">
        {
    /* Navigation Breadcrumb */
  }
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 font-medium">
          <span
    onClick={() => onNavigate("admin-dashboard")}
    className="cursor-pointer hover:text-blue-600 transition-colors hidden sm:inline"
  >
            Cổng Quản trị
          </span>
          <span className="hidden sm:inline">›</span>
          <span className="text-slate-900 font-semibold">{getTabTitle(activeTab)}</span>
        </div>

        {
    /* Semester & Role Scope Badge */
  }
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/90 text-blue-900 rounded-xl border border-blue-200/80 font-bold text-xs shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <div className="flex items-center gap-1.5">
            <span className="hidden xl:inline text-slate-600">Đợt:</span>
            <select
    value={selectedSemester}
    onChange={(e) => {
      if (onSemesterChange) onSemesterChange(e.target.value);
      onShowToast(`\u0110\xE3 chuy\u1EC3n \u0111\u1EE3t th\u1EF1c t\u1EADp: ${e.target.value}`);
    }}
    className="bg-transparent font-bold text-xs text-blue-900 outline-none cursor-pointer pr-1"
  >
              <option value="Học kỳ I - 2025-2026">HK1 (2025-2026)</option>
              <option value="Học kỳ II - 2025-2026">HK2 (2025-2026)</option>
              <option value="Học kỳ Hè - 2025-2026">HK Hè (2025-2026)</option>
            </select>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        </div>
      </div>

      {
    /* Right Controls: Search bar, Notifications, User Profile */
  }
      <div className="flex items-center gap-3">
        {
    /* Universal Search Form */
  }
        <form onSubmit={handleSearchSubmit} className="relative w-48 sm:w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Tìm MSSV, Giảng viên, Mã đợt, Doanh nghiệp..."
    className="w-full pl-9 pr-3 py-1.5 text-xs md:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-full outline-none transition-all placeholder:text-slate-400"
  />
          {searchQuery && <button
    type="button"
    onClick={() => setSearchQuery("")}
    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
  >
              ✕
            </button>}
        </form>

        {
    /* Notifications Popover */
  }
        <div className="relative">
          <button
    onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors relative"
    title="Thông báo hệ thống"
  >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              2
            </span>
          </button>

          {showNotificationsMenu && <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <h4 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-blue-600" /> Thông báo hệ thống
                </h4>
                <button
    onClick={() => {
      onNavigate("admin-notifications");
      setShowNotificationsMenu(false);
    }}
    className="text-xs text-blue-600 hover:underline"
  >
                  Xem tất cả
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                <div className="p-2.5 bg-amber-50/80 border border-amber-100 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>8 yêu cầu tài khoản mới</span>
                  </div>
                  <p className="text-slate-600 pl-5">3 Giảng viên thỉnh giảng &amp; 5 Sinh viên vừa đăng ký tài khoản.</p>
                </div>

                <div className="p-2.5 bg-blue-50/80 border border-blue-100 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Import thành công 120 sinh viên</span>
                  </div>
                  <p className="text-slate-600 pl-5">Dữ liệu danh sách từ Khoa CNTT đã được đồng bộ hoàn tất.</p>
                </div>
              </div>

              <button
    onClick={() => {
      setShowNotificationsMenu(false);
      onNavigate("admin-notifications");
    }}
    className="w-full mt-3 py-1.5 text-center text-xs text-blue-600 font-semibold bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
  >
                Mở Trung tâm Thông báo
              </button>
            </div>}
        </div>

        {
    /* Admin Profile Button */
  }
        <div className="relative">
          <button
    onClick={() => setShowProfileMenu(!showProfileMenu)}
    className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 hover:ring-blue-300 transition-all"
    title="Tài khoản Ban Quản lý"
  >
            <User className="w-4 h-4" />
          </button>

          {showProfileMenu && <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="pb-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">Quản trị viên Hệ thống</p>
                <p className="text-[11px] text-blue-600 font-semibold">Trưởng Ban Điều Hành Khoa</p>
                <p className="text-[10px] text-slate-400 mt-0.5">admin@internlink.edu.vn</p>
              </div>

              <div className="py-1 text-xs space-y-0.5">
                <button
    onClick={() => {
      setShowProfileMenu(false);
      onNavigate("admin-account");
    }}
    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-lg flex items-center justify-between font-medium transition-colors"
  >
                  <span>Hồ sơ Ban Quản lý</span>
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
    onClick={() => {
      setShowProfileMenu(false);
      onNavigate("admin-settings");
    }}
    className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-lg flex items-center justify-between font-medium transition-colors"
  >
                  <span>Cài đặt hệ thống</span>
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {onLogout && <button
    onClick={() => {
      setShowProfileMenu(false);
      onLogout();
    }}
    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-between font-bold transition-colors border-t border-slate-100 pt-2.5 mt-1 cursor-pointer"
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

export { Header as AdminHeader };
