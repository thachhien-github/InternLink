import {
  LayoutDashboard,
  Briefcase,
  FileCheck2,
  FolderKanban,
  MessageSquare,
  FileText,
  Bell,
  User,
  GraduationCap,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';
export const Sidebar = ({
  activeTab,
  onNavigate,
  onSwitchPortal,
  studentName = "Nguyễn Văn A"
}) => {
  const navSections = [
    {
      title: "TỔNG QUAN",
      items: [
        { id: "student-dashboard", label: "Tổng quan", icon: LayoutDashboard },
        { id: "student-internship", label: "Kỳ thực tập của tôi", icon: Briefcase, badge: "Active" }
      ]
    },
    {
      title: "BÁO CÁO & ĐÁNH GIÁ",
      items: [
        { id: "student-weekly-reports", label: "Báo cáo tuần", icon: FileCheck2, badge: "Tuần 6" },
        { id: "student-submissions", label: "Sản phẩm thực tập", icon: FolderKanban, badge: "7/8" },
        { id: "student-feedback", label: "Phản hồi & Chỉnh sửa", icon: MessageSquare, badge: "2 góp ý" }
      ]
    },
    {
      title: "TÀI NGUYÊN & HỆ THỐNG",
      items: [
        { id: "student-templates", label: "Biểu mẫu & Tài liệu", icon: FileText },
        { id: "student-notifications", label: "Thông báo", icon: Bell, badgeAlert: true },
        { id: "student-account", label: "Tài khoản", icon: User }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      {/* Top Section */}
      <div>
        {/* App Logo Header */}
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
              <Sparkles className="w-2.5 h-2.5 shrink-0" /> CỔNG SINH VIÊN
            </p>
          </div>
        </div>

        {/* Navigation Items Grouped */}
        <nav className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-160px)] il-scrollbar">
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
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold il-kpi-val ${
                        isActive ? "bg-white/25 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {item.badgeAlert && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {
    /* Bottom Profile Footer */
  }
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        <div
          onClick={() => onNavigate("student-account")}
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-xs transition-all cursor-pointer border border-transparent hover:border-slate-200/80 group"
        >
          {
    /* Avatar with online status */
  }
          <div className="relative shrink-0">
            <img
    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    alt="Avatar Sinh viên"
    referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all"
  />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" title="Trực tuyến" />
          </div>

          <div className="overflow-hidden min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-indigo-600 transition-colors">
              {studentName}
            </p>
            <p className="text-[10px] text-blue-600 font-bold truncate mt-0.5 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-blue-500" /> MSSV: 20110123
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export { Sidebar as StudentSidebar };
