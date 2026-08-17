import {
  LayoutDashboard,
  Briefcase,
  FileCheck2,
  FolderKanban,
  MessageSquare,
  FileText,
  Bell,
  User,
} from "lucide-react";
export const Sidebar = ({
  activeTab,
  onNavigate,
  onSwitchPortal,
  studentName = "Nguyễn Văn A",
}) => {
  const navSections = [
    {
      title: "TỔNG QUAN",
      items: [
        { id: "student-dashboard", label: "Tổng quan", icon: LayoutDashboard },
        {
          id: "student-internship",
          label: "Kỳ thực tập của tôi",
          icon: Briefcase,
          badge: "Active",
        },
      ],
    },
    {
      title: "BÁO CÁO & ĐÁNH GIÁ",
      items: [
        {
          id: "student-weekly-reports",
          label: "Báo cáo tuần",
          icon: FileCheck2,
        },
        {
          id: "student-submissions",
          label: "Sản phẩm thực tập",
          icon: FolderKanban,
        },
        {
          id: "student-feedback",
          label: "Phản hồi & Chỉnh sửa",
          icon: MessageSquare,
        },
      ],
    },
    {
      title: "TÀI NGUYÊN & HỆ THỐNG",
      items: [
        {
          id: "student-templates",
          label: "Biểu mẫu & Tài liệu",
          icon: FileText,
        },
        {
          id: "student-notifications",
          label: "Thông báo",
          icon: Bell,
          badgeAlert: true,
        },
        { id: "student-account", label: "Tài khoản", icon: User },
      ],
    },
  ];

  return (
    <aside className="il-sidebar w-64 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      <div>
        <div className="il-sidebar-header">
          <div className="il-sidebar-logo">
            <img
              src="/logo/logo_internlink-02.png"
              alt="InternLink Mark Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div>
            <div className="flex items-center font-bold text-lg tracking-tight leading-none">
              <span className="il-sidebar-brand-intern">Intern</span>
              <span className="il-sidebar-brand-link">Link</span>
            </div>
            <p className="il-portal-badge">CỔNG SINH VIÊN</p>
          </div>
        </div>

        <nav className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-160px)] il-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <p className="il-sidebar-section">{section.title}</p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const normalizedActive = activeTab?.startsWith("student-")
                  ? activeTab
                  : `student-${activeTab}`;
                const isActive = normalizedActive === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`il-sidebar-nav ${isActive ? "is-active" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="il-sidebar-badge">{item.badge}</span>
                    )}

                    {item.badgeAlert && !isActive && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="il-sidebar-footer">
        <div
          onClick={() => onNavigate("student-account")}
          className="il-sidebar-profile"
        >
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
              alt="Avatar Sinh viên"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
              title="Trực tuyến"
            />
          </div>

          <div className="overflow-hidden min-w-0 flex-1">
            <p className="il-sidebar-profile-name">{studentName}</p>
            <p className="il-sidebar-profile-meta">MSSV: 20110123</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export { Sidebar as StudentSidebar };
