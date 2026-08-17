import { useState } from "react";
import {
  LayoutDashboard,
  RefreshCw,
  Download,
  UserPlus,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Panel } from "../../../components/common/Panel";
import { AdminKpiSection } from "../components/KpiSection";
import { WorkloadOverviewCard } from "../components/cards/WorkloadOverviewCard";
import { AdminActivityTimeline } from "../components/ActivityTimeline";
import { AssignLecturerModal } from "../components/modals/AssignLecturerModal";
import {
  buildAssignmentStatusSlices,
  buildInternshipStatusTrend,
  DashboardDonutChart,
  DashboardTrendChart,
} from "../../../components/common/DashboardCharts";
import { useAdminDashboardStats } from "../../../hooks/useAdminDashboardStats";
import { exportAdminDashboardReport } from "../../../lib/adminDashboardExport";

export const DashboardView = ({
  onShowToast,
  onNavigateTab,
}: {
  onShowToast: (msg: string) => void;
  onNavigateTab: (tab: string) => void;
}) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { stats, isLoading, updatedAt, reload } = useAdminDashboardStats(
    true,
    onShowToast,
  );

  const handleRefresh = async () => {
    if (isLoading) return;
    await reload();
    onShowToast("Đã làm mới dữ liệu tổng quan!");
  };

  const handleExportReport = () => {
    if (!stats) {
      onShowToast("Chưa có dữ liệu để xuất báo cáo. Vui lòng thử lại sau.");
      return;
    }
    setIsExporting(true);
    try {
      const filename = exportAdminDashboardReport(stats);
      onShowToast(`Đã tải xuống ${filename}`);
    } finally {
      setIsExporting(false);
    }
  };

  const subtitle = updatedAt
    ? `Cập nhật lúc ${updatedAt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
    : "Đang tải dữ liệu…";

  const internshipTrend = stats
    ? buildInternshipStatusTrend(stats.internshipStats)
    : [];
  const assignmentSlices = stats
    ? buildAssignmentStatusSlices(stats.assignedStudents, stats.unassignedStudents)
    : [];
  const actionItems = stats?.actionItems ?? [];
  const toneClass = {
    amber: "text-amber-700",
    blue: "text-[#1d4ed8]",
    emerald: "text-emerald-700",
  } as const;

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <PageHeader
        icon={LayoutDashboard}
        title="Tổng quan hệ thống"
        subtitle={subtitle}
        actions={[
          {
            label: isLoading ? "Đang làm mới…" : "Làm mới",
            icon: RefreshCw,
            onClick: () => void handleRefresh(),
            variant: "secondary",
            disabled: isLoading,
            loading: isLoading,
          },
          {
            label: isExporting ? "Đang xuất…" : "Xuất báo cáo",
            icon: Download,
            onClick: handleExportReport,
            variant: "secondary",
            disabled: isExporting || isLoading || !stats,
            loading: isExporting,
          },
          {
            label: "Phân công nhanh",
            icon: UserPlus,
            onClick: () => setShowAssignModal(true),
            variant: "primary",
            disabled: isLoading,
          },
        ]}
      />

      <AdminKpiSection
        stats={stats}
        isLoading={isLoading}
        onCardClick={(metric) => {
          if (metric === "lecturers") onNavigateTab("admin-lecturers");
          else if (metric === "students") onNavigateTab("admin-students");
          else if (metric === "companies") onNavigateTab("admin-companies");
          else if (metric === "semesters") onNavigateTab("admin-assignments");
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Panel className="lg:col-span-8">
          <DashboardTrendChart
            title="Trạng thái thực tập"
            subtitle="Phân bổ theo trạng thái đợt thực tập (API)"
            data={isLoading ? [] : internshipTrend}
            valueLabel="Số lượng"
            variant="bar"
          />
        </Panel>
        <Panel className="lg:col-span-4">
          <DashboardDonutChart
            title="Phân công giảng viên"
            subtitle="Sinh viên đã / chưa có GVHD"
            data={isLoading ? [] : assignmentSlices}
          />
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-5">
          <Panel>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Hạng mục chờ xử lý
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Việc cần Trưởng BĐH quyết định
                </p>
              </div>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                {isLoading ? "…" : `${actionItems.length} mục`}
              </span>
            </div>

            {isLoading ? (
              <p className="text-xs text-slate-500 py-4">Đang tải…</p>
            ) : actionItems.length === 0 ? (
              <p className="text-xs text-emerald-700 py-4 font-medium">
                Không có hạng mục chờ xử lý
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {actionItems.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onNavigateTab(item.tab)}
                      className="w-full py-3 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-semibold text-xs text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {item.subtitle}
                        </p>
                      </div>
                      <span
                        className={`flex items-center gap-1 font-semibold text-[11px] shrink-0 ${toneClass[item.tone]}`}
                      >
                        Xử lý <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <WorkloadOverviewCard
              stats={stats}
              isLoading={isLoading}
              onAssignClick={() => onNavigateTab("admin-assignments")}
            />
          </Panel>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <Panel>
            <AdminActivityTimeline
              activities={stats?.recentActivities}
              isLoading={isLoading}
              onViewAllHistory={() => onNavigateTab("admin-notifications")}
            />
          </Panel>
        </div>
      </div>

      <AssignLecturerModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onShowToast={onShowToast}
        onSuccess={reload}
      />
    </div>
  );
};

export { DashboardView as AdminDashboardView };
