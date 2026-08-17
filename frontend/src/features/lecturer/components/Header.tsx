import { useState } from "react";
import { Search, Bell, User } from "lucide-react";
import type { UserRole } from "../../../types/common";

export const Header = ({
  activeTab,
  onNavigate,
  searchQuery,
  onSearchChange,
  unreadCount = 3,
  currentLecturer,
  assignedStudentsCount,
  onSwitchPortal,
  onLogout,
}: {
  activeTab: string;
  onNavigate: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadCount?: number;
  currentLecturer?: string;
  assignedStudentsCount?: number;
  onSwitchPortal?: (role: UserRole) => void;
  onLogout?: () => void;
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "dashboard":
        return "Tổng quan";
      case "students":
        return "Sinh viên";
      case "internships":
        return "Đợt thực tập";
      case "enterprises":
        return "Doanh nghiệp";
      case "export":
        return "Export cuối kỳ";
      case "templates":
        return "Biểu mẫu";
      case "evaluations":
        return "Đánh giá & Chấm điểm";
      case "analytics":
        return "Thống kê & Phân tích";
      case "reports":
        return "Kho Báo cáo & Bài nộp";
      case "notifications":
        return "Thông báo";
      case "account":
        return "Tài khoản & Cài đặt";
      default:
        return "Tổng quan";
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 font-medium">
          <span
            onClick={() => onNavigate("dashboard")}
            className="cursor-pointer hover:text-blue-600 transition-colors hidden sm:inline"
          >
            Cổng Giảng viên
          </span>
          <span className="hidden sm:inline text-slate-300">/</span>
          <span className="text-slate-900 font-semibold">
            {getTabLabel(activeTab)}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-800 rounded-md border border-slate-200 font-semibold text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="truncate max-w-[180px] sm:max-w-none">
            GV: {currentLecturer} • {assignedStudentsCount} SV HD
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-48 sm:w-64 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm nhanh..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-md outline-none transition-colors placeholder:text-slate-400"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          ) : null}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors relative cursor-pointer"
            title="Thông báo"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-md border border-slate-200 p-4 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" /> Thông báo hệ thống
                </h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Đã đọc tất cả
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 il-scrollbar">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span className="text-slate-800">Báo cáo quá hạn</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      10 phút trước
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Phạm Phương Thảo (MSSV: 20120999) đã quá hạn nộp Báo cáo
                    giữa kỳ.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-md text-xs space-y-1 transition-colors">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>Doanh nghiệp mới đăng ký</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      1 giờ trước
                    </span>
                  </div>
                  <p className="text-slate-600">
                    CMC Global yêu cầu xác nhận đối tác thực tập cho 5 sinh
                    viên.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowNotifications(false);
                  onNavigate("notifications");
                }}
                className="w-full mt-3 py-2 text-center text-xs text-blue-600 font-semibold bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
              >
                Xem toàn bộ thông báo
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full bg-[#0b132b] text-white flex items-center justify-center font-bold text-xs hover:bg-[#1c2541] transition-colors cursor-pointer"
            title="Tài khoản Giảng viên"
          >
            <User className="w-4 h-4" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-md border border-slate-200 p-2 z-50">
              <div className="p-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">
                  {currentLecturer === "Thầy Phước"
                    ? "Trần Minh Huy (Thầy Phước)"
                    : currentLecturer === "Thầy Thành"
                      ? "Nguyễn Đức Thành (Thầy Thành)"
                      : currentLecturer === "Thầy Cường"
                        ? "Phạm Hùng Cường (Thầy Cường)"
                        : currentLecturer === "Cô Minh An"
                          ? "Đặng Minh An (Cô Minh An)"
                          : "Quản trị viên Super Admin"}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Giảng viên hướng dẫn ({assignedStudentsCount} SV)
                </p>
              </div>

              <div className="py-1 text-xs space-y-0.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigate("account");
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-md flex items-center justify-between font-medium transition-colors cursor-pointer"
                >
                  <span>Hồ sơ cá nhân</span>
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-md flex items-center justify-between font-semibold transition-colors cursor-pointer"
                >
                  <span>Đăng xuất hệ thống</span>
                  <span className="material-symbols-outlined text-sm">
                    logout
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
