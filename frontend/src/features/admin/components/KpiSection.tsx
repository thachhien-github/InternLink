import {
  UserCheck,
  Users,
  CalendarDays,
  Building2,
  TrendingUp,
} from "lucide-react";
import { KpiCard, KpiGrid } from "../../../components/common/KpiCard";
import type { AdminDashboardStats } from "../../../hooks/useAdminDashboardStats";

interface AdminKpiSectionProps {
  onCardClick?: (id: string) => void;
  stats?: AdminDashboardStats | null;
  isLoading?: boolean;
}

function formatCount(n: number): string {
  return n.toLocaleString("vi-VN");
}

export const AdminKpiSection = ({
  onCardClick,
  stats,
  isLoading,
}: AdminKpiSectionProps) => {
  const lecturerCount = stats?.lecturerCount ?? "—";
  const studentCount = stats?.studentCount ?? "—";
  const companyCount = stats?.companyCount ?? "—";
  const internshipCount = stats?.internshipInProgress ?? "—";

  return (
    <KpiGrid>
      <KpiCard
        tone="blue"
        title="Giảng viên"
        value={isLoading ? "…" : formatCount(Number(lecturerCount))}
        unit="giảng viên"
        icon={UserCheck}
        footer={
          <span className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-500">
              {stats
                ? `${stats.lecturersWithStudents} đang hướng dẫn SV`
                : "Đang tải…"}
            </span>
            {stats && (
              <span className="flex items-center gap-1 shrink-0">
                <TrendingUp className="w-3 h-3" /> API
              </span>
            )}
          </span>
        }
        onClick={() => onCardClick?.("lecturers")}
      />
      <KpiCard
        tone="emerald"
        title="Sinh viên"
        value={isLoading ? "…" : formatCount(Number(studentCount))}
        unit="sinh viên"
        icon={Users}
        footer={
          <span className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-500">
              {stats
                ? `${stats.activeStudents} đã cấp tài khoản`
                : "Đang tải…"}
            </span>
          </span>
        }
        onClick={() => onCardClick?.("students")}
      />
      <KpiCard
        tone="amber"
        title="Thực tập"
        value={isLoading ? "…" : formatCount(Number(internshipCount))}
        unit="đang thực hiện"
        icon={CalendarDays}
        footer={
          <span className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-500">
              {stats ? `${stats.internshipTotal} tổng đợt` : "Đang tải…"}
            </span>
            <span className="shrink-0">Theo API</span>
          </span>
        }
        onClick={() => onCardClick?.("semesters")}
      />
      <KpiCard
        tone="sky"
        title="Doanh nghiệp"
        value={isLoading ? "…" : formatCount(Number(companyCount))}
        unit="doanh nghiệp"
        icon={Building2}
        footer={
          <span className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-500">
              {stats
                ? `${stats.activeCompanies} đang hợp tác`
                : "Đang tải…"}
            </span>
          </span>
        }
        onClick={() => onCardClick?.("companies")}
      />
    </KpiGrid>
  );
};
