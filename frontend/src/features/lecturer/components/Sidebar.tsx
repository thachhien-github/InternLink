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
  FileSpreadsheet,
} from "lucide-react";
import { FEATURES } from "../../../config/featureFlags";

import type { UserRole } from "../../../types/common";

type NavItem = {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  badgeAlert?: boolean;
  flag?: keyof typeof FEATURES;
};

export const Sidebar = ({
  activeTab,
  onNavigate,
  currentLecturer = "Thầy Phước",
}: {
  activeTab: string;
  onNavigate: (id: string) => void;
  currentLecturer?: string;
  onSwitchPortal?: (role: UserRole) => void;
}) => {
  const navSections: { title: string; items: NavItem[] }[] = [
    {
      title: "TỔNG QUAN",
      items: [{ id: "dashboard", label: "Tổng quan", icon: LayoutDashboard }],
    },
    {
      title: "QUẢN LÝ THỰC TẬP",
      items: [
        { id: "students", label: "Sinh viên", icon: Users, badge: "28" },
        {
          id: "enterprises",
          label: "Doanh nghiệp",
          icon: Building2,
          badge: "124",
        },
        {
          id: "reports",
          label: "Báo cáo & Bài nộp",
          icon: FileCheck,
          badge: "8",
        },
        {
          id: "evaluations",
          label: "Đánh giá & Chấm điểm",
          icon: Award,
          badge: "8",
        },
        {
          id: "export",
          label: "Export cuối kỳ",
          icon: FileSpreadsheet,
        },
        {
          id: "analytics",
          label: "Thống kê & Phân tích",
          icon: BarChart3,
          flag: "lecturerAnalytics",
        },
      ],
    },
    {
      title: "TÀI NGUYÊN & HỆ THỐNG",
      items: [
        { id: "templates", label: "Biểu mẫu", icon: FileText },
        {
          id: "notifications",
          label: "Thông báo",
          icon: Bell,
          badgeAlert: true,
        },
        { id: "account", label: "Tài khoản", icon: User },
      ],
    },
  ];

  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.flag || FEATURES[item.flag],
      ),
    }))
    .filter((section) => section.items.length > 0);

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
            <p className="il-portal-badge">CỔNG GIẢNG VIÊN</p>
          </div>
        </div>

        <nav className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-160px)] il-scrollbar">
          {visibleSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <p className="il-sidebar-section">{section.title}</p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
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
          onClick={() => onNavigate("account")}
          className="il-sidebar-profile"
        >
          <div className="relative shrink-0">
            <img
              src={
                currentLecturer === "Cô Minh An"
                  ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                  : currentLecturer === "Thầy Thành"
                    ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                    : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
              }
              alt="Avatar Giảng viên"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
              title="Đang hoạt động"
            />
          </div>

          <div className="overflow-hidden min-w-0 flex-1">
            <p className="il-sidebar-profile-name">
              {currentLecturer === "Thầy Phước"
                ? "TS. Trần Minh Huy"
                : currentLecturer === "Thầy Thành"
                  ? "ThS. Nguyễn Đức Thành"
                  : currentLecturer === "Thầy Cường"
                    ? "TS. Phạm Hùng Cường"
                    : currentLecturer === "Cô Minh An"
                      ? "PGS.TS. Đặng Minh An"
                      : "TS. Trần Minh Huy"}
            </p>
            <p className="il-sidebar-profile-meta">Khoa Công nghệ Thông tin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
