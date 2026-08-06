import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  FileCheck,
  Award,
  BarChart3,
  Bell,
  User,
  GraduationCap,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';
export const Sidebar = ({ activeTab, onNavigate, currentLecturer = "Thầy Phước" }) => {
  const navSections = [
    {
      title: "TỔNG QUAN",
      items: [
        { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard }
      ]
    },
    {
      title: "QUẢN LÝ THỰC TẬP",
      items: [
        { id: "students", label: "Sinh viên", icon: Users, badge: "28" },
        { id: "enterprises", label: "Doanh nghiệp", icon: Building2, badge: "124" },
        { id: "reports", label: "Kho Báo cáo & Bài nộp", icon: FileCheck, badge: "8" },
        { id: "evaluations", label: "Đánh giá & Chấm điểm", icon: Award, badge: "8" },
        { id: "analytics", label: "Thống kê & Phân tích", icon: BarChart3 }
      ]
    },
    {
      title: "TÀI NGUYÊN & HỆ THỐNG",
      items: [
        { id: "templates", label: "Biểu mẫu", icon: FileText },
        { id: "notifications", label: "Thông báo", icon: Bell, badgeAlert: true },
        { id: "account", label: "Tài khoản", icon: User }
      ]
    }
  ];

  return <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-40 select-none shadow-xs">
      {/* Top Header Logo */}
      <div>
        <div className="p-4 border-b border-slate-100 flex items-center gap-2.5">
          <img
            src="/logo/logo_internlink-02.png"
            alt="InternLink Mark Logo"
            className="w-9 h-9 object-contain shrink-0"
          />
          <div>
            <div className="flex items-center font-black text-xl tracking-tight leading-none">
              <span className="text-[#1f295d]">Intern</span>
              <span className="text-[#3b66c4]">Link</span>
            </div>
            <p className="text-[10px] text-[#3b66c4] font-extrabold uppercase tracking-wider flex items-center gap-1 mt-1">
              <Sparkles className="w-2.5 h-2.5 shrink-0" /> CỔNG GIẢNG VIÊN
            </p>
          </div>
        </div>

        {/* Nav Items Grouped */}
        <nav className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-none">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-0.5">
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
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"}`}>
                        {item.badge}
                      </span>
                    )}

                    {item.badgeAlert && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {
    /* Bottom User Card */
  }
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div
    onClick={() => onNavigate("account")}
    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100/90 transition-all cursor-pointer border border-transparent hover:border-slate-200/80 group"
  >
          {
    /* Avatar with online status */
  }
          <div className="relative shrink-0">
            <img
    src={currentLecturer === "C\xF4 Minh An" ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" : currentLecturer === "Th\u1EA7y Th\xE0nh" ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"}
    alt="Avatar Giảng viên"
    referrerPolicy="no-referrer"
    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all"
  />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" title="Đang hoạt động" />
          </div>

          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-xs font-extrabold text-slate-900 truncate leading-tight group-hover:text-blue-600 transition-colors">
              {currentLecturer === "Th\u1EA7y Ph\u01B0\u1EDBc" ? "TS. Tr\u1EA7n Minh Huy" : currentLecturer === "Th\u1EA7y Th\xE0nh" ? "ThS. Nguy\u1EC5n \u0110\u1EE9c Th\xE0nh" : currentLecturer === "Th\u1EA7y C\u01B0\u1EDDng" ? "TS. Ph\u1EA1m H\xF9ng C\u01B0\u1EDDng" : currentLecturer === "C\xF4 Minh An" ? "PGS.TS. \u0110\u1EB7ng Minh An" : "TS. Tr\u1EA7n Minh Huy"}
            </p>
            <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
              Khoa Công nghệ Thông tin
            </p>
          </div>
        </div>
      </div>
    </aside>;
};
