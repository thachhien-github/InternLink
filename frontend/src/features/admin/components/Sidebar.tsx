import {
  LayoutDashboard,
  UserCheck,
  Users,
  UserPlus,
  Building2,
  KeyRound,
  Bell,
  Settings,
  User,
  Calendar,
} from "lucide-react";
import { FEATURES } from "../../../config/featureFlags";
import { formatCountBadge, getNameInitials } from "../../../lib/userDisplay";
import type { AdminNavStats } from "../../../hooks/useAdminNavStats";
import type { AuthUser } from "../../../contexts/AuthContext";

type NavItem = {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  badgeAlert?: boolean;
  badgeText?: string;
  flag?: keyof typeof FEATURES;
};

export const Sidebar = ({
  activeTab,
  onNavigate,
  stats,
  user,
}: {
  activeTab: string;
  onNavigate: (id: string) => void;
  stats?: AdminNavStats;
  user?: AuthUser | null;
}) => {
  const unassigned = stats?.unassignedCount ?? 0;
  const campaigns = stats?.notificationCampaignCount ?? 0;
  const unread = stats?.unreadNotificationCount ?? 0;

  const navSections: { title: string; items: NavItem[] }[] = [
    {
      title: "TỔNG QUAN",
      items: [
        { id: "admin-dashboard", label: "Tổng quan", icon: LayoutDashboard },
      ],
    },
    {
      title: "QUẢN LÝ",
      items: [
        {
          id: "admin-students",
          label: "Sinh viên",
          icon: Users,
          badge:
            stats && stats.studentCount > 0
              ? formatCountBadge(stats.studentCount)
              : undefined,
        },
        {
          id: "admin-lecturers",
          label: "Giảng viên",
          icon: UserCheck,
          badge:
            stats && stats.lecturerCount > 0
              ? formatCountBadge(stats.lecturerCount)
              : undefined,
        },
        {
          id: "admin-companies",
          label: "Doanh nghiệp",
          icon: Building2,
        },
        {
          id: "admin-users",
          label: "Người dùng",
          icon: KeyRound,
        },
        {
          id: "admin-assignments",
          label: "Phân công hướng dẫn",
          icon: UserPlus,
          ...(unassigned > 0
            ? { badgeText: `${unassigned} chưa PC` }
            : {}),
        },
        {
          id: "admin-semesters",
          label: "Kỳ thực tập",
          icon: Calendar,
          flag: "adminSemesters",
        },
      ],
    },
    {
      title: "HỆ THỐNG & CÁ NHÂN",
      items: [
        {
          id: "admin-notifications",
          label: "Thông báo",
          icon: Bell,
          ...(unread > 0
            ? { badge: String(unread), badgeAlert: true }
            : campaigns > 0
            ? { badge: String(campaigns) }
            : {}),
        },
        { id: "admin-settings", label: "Cài đặt", icon: Settings },
        { id: "admin-account", label: "Tài khoản", icon: User },
      ],
    },
  ];

  const displayName = user?.name ?? "Quản trị viên";
  const displayRole =
    user?.role === "admin" ? "Super Admin" : (user?.role ?? "Admin");
  const initials = getNameInitials(displayName);

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
            <p className="il-portal-badge">SUPER ADMIN</p>
          </div>
        </div>

        <nav className="p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-170px)] il-scrollbar">
          {visibleSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <p className="il-sidebar-section">{section.title}</p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const normalizedActive = activeTab?.startsWith("admin-")
                  ? activeTab
                  : `admin-${activeTab}`;
                const isActive = normalizedActive === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`il-sidebar-nav ${isActive ? "is-active" : ""}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {item.badgeText && (
                        <span className="text-[9px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                          {item.badgeText}
                        </span>
                      )}
                      {item.badge && !item.badgeText && (
                        <span className="il-sidebar-badge">{item.badge}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="il-sidebar-footer">
        <div
          onClick={() => onNavigate("admin-account")}
          className="il-sidebar-profile"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-md bg-[#0b132b] text-white font-bold text-xs flex items-center justify-center border border-slate-200">
              {initials}
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"
              title="Trực tuyến"
            />
          </div>

          <div className="overflow-hidden min-w-0 flex-1">
            <p className="il-sidebar-profile-name truncate">{displayName}</p>
            <p className="il-sidebar-profile-meta truncate">{displayRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export { Sidebar as AdminSidebar };
