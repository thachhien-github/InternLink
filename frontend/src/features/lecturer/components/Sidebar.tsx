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
import { useAuth } from "../../../hooks/useAuth";
import { useLecturerNavStats } from "../../../hooks/useLecturerNavStats";

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
  currentLecturer = "Giảng viên",
}: {
  activeTab: string;
  onNavigate: (id: string) => void;
  currentLecturer?: string;
  onSwitchPortal?: (role: UserRole) => void;
}) => {
  const { user } = useAuth();
  const { stats } = useLecturerNavStats();

  const displayName = user?.name || currentLecturer || "Giảng viên";
  const userInitials = displayName
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "GV";

  const navSections: { title: string; items: NavItem[] }[] = [
    {
      title: "TỔNG QUAN",
      items: [{ id: "dashboard", label: "Tổng quan", icon: LayoutDashboard }],
    },
    {
      title: "QUẢN LÝ THỰC TẬP",
      items: [
        {
          id: "students",
          label: "Sinh viên",
          icon: Users,
          badge: stats.studentCount > 0 ? String(stats.studentCount) : undefined,
        },
        {
          id: "enterprises",
          label: "Doanh nghiệp",
          icon: Building2,
          badge: stats.enterpriseCount > 0 ? String(stats.enterpriseCount) : undefined,
        },
        {
          id: "reports",
          label: "Báo cáo & Bài nộp",
          icon: FileCheck,
          badge: stats.pendingReviewCount > 0 ? String(stats.pendingReviewCount) : undefined,
        },
        {
          id: "evaluations",
          label: "Đánh giá & Chấm điểm",
          icon: Award,
          badge: stats.evaluatedCount > 0 ? String(stats.evaluatedCount) : undefined,
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
          badgeAlert: stats.unreadNotificationCount > 0,
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
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border border-slate-200">
                {userInitials}
              </div>
            )}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
              title="Đang hoạt động"
            />
          </div>

          <div className="overflow-hidden min-w-0 flex-1">
            <p className="il-sidebar-profile-name truncate">
              {displayName}
            </p>
            <p className="il-sidebar-profile-meta truncate">
              {user?.email || "Khoa Công nghệ Thông tin"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
