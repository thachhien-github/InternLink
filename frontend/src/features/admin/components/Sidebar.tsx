import {
  LayoutDashboard,
  CalendarDays,
  UserCheck,
  Users,
  UserPlus,
  KeyRound,
  Bell,
  Settings,
  User,
  ShieldCheck,
  GraduationCap,
  Sparkles
} from 'lucide-react';
export const Sidebar = ({
  activeTab,
  onNavigate,
  onSwitchPortal,
  pendingRequestsCount = 8
}) => {
  const navSections = [
    {
      title: "TỔNG QUAN",
      items: [
        { id: "admin-dashboard", label: "Tổng quan", icon: LayoutDashboard }
      ]
    },
    {
      title: "QUẢN LÝ ĐÀO TẠO",
      items: [
        { id: "admin-semesters", label: "Kỳ thực tập", icon: CalendarDays, badge: "2 kỳ" },
        { id: "admin-assignments", label: "Phân công hướng dẫn", icon: UserPlus, badgeAlert: true, badgeText: "12 chưa PC" }
      ]
    },
    {
      title: "QUẢN LÝ NGƯỜI DÙNG",
      items: [
        { id: "admin-lecturers", label: "Giảng viên", icon: UserCheck, badge: "42" },
        { id: "admin-students", label: "Sinh viên", icon: Users, badge: "1,280" },
        { id: "admin-account-requests", label: "Yêu cầu tài khoản", icon: KeyRound, badge: `${pendingRequestsCount}`, badgeColor: "bg-amber-500 text-white" }
      ]
    },
    {
      title: "HỆ THỐNG & CÁ NHÂN",
      items: [
        { id: "admin-notifications", label: "Thông báo", icon: Bell, badgeAlert: true },
        { id: "admin-settings", label: "Cài đặt", icon: Settings },
        { id: "admin-account", label: "Tài khoản", icon: User }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      <div>
        {/* Top Branding Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-50/80 rounded-xl border border-indigo-100/80 shrink-0">
            <img
              src="/logo/logo_internlink-02.png"
              alt="InternLink Mark Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div>
            <div className="flex items-center font-bold text-lg tracking-tight leading-none">
              <span className="text-[#0b132b]">Intern</span>
              <span className="text-[#6366f1]">Link</span>
            </div>
            <p className="il-portal-badge">
              <Sparkles className="w-2.5 h-2.5 shrink-0" /> SUPER ADMIN
            </p>
          </div>
        </div>

        {/* Navigation Items Grouped */}
        <nav className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-170px)] il-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "il-active-pill font-bold"
                        : "text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-900"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span className="truncate whitespace-nowrap">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {item.badgeText && (
                        <span className="text-[9px] bg-rose-500 text-white font-extrabold px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                          {item.badgeText}
                        </span>
                      )}
                      {item.badge && !item.badgeText && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold il-kpi-val whitespace-nowrap shrink-0 ${item.badgeColor || (isActive ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600")}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.badgeAlert && !item.badgeText && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {
    /* Admin User Info Footer */
  }
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        <div
          onClick={() => onNavigate("admin-account")}
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-xs transition-all cursor-pointer border border-transparent hover:border-slate-200/80 group"
        >
          {/* Avatar / Emblem with online status */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-900 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-xs ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all">
              VPK
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" title="Trực tuyến" />
          </div>

          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-indigo-600 transition-colors">
              Văn phòng Khoa
            </p>
            <p className="text-[10px] text-indigo-600 font-bold truncate mt-0.5 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-indigo-500" /> Super Admin Workspace
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export { Sidebar as AdminSidebar };
