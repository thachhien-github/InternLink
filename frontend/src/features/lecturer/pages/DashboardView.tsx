import {
  LayoutDashboard,
  RefreshCw,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Panel } from "../../../components/common/Panel";
import { RecentSubmissions } from "../components/RecentSubmissions";
import { StatsCards } from "../components/StatsCards";
import {
  DashboardDonutChart,
  DashboardTrendChart,
  buildLecturerStatusSlices,
} from "../../../components/common/DashboardCharts";
import type { ActionItem } from "../../../types/common";
import type { Deadline } from "../../../types/common";
import type { Submission } from "../../../types/submission";
import { useSemester } from "../../../contexts/SemesterContext";

export const DashboardView = ({
  actionItems,
  deadlines,
  submissions,
  stats,
  weeklyTrendData = [],
  onShowToast,
  onNavigate,
  onRefresh,
}: {
  actionItems: ActionItem[];
  deadlines: Deadline[];
  submissions: Submission[];
  stats: {
    total: number;
    interning: number;
    pending: number;
    overdue: number;
    completed: number;
    avgProg: number;
  };
  weeklyTrendData?: { label: string; value: number; target?: number }[];
  onShowToast: (msg: string) => void;
  onNavigate: (tab: string) => void;
  onRefresh?: () => Promise<void> | void;
}) => {
  const { selectedSemester } = useSemester();
  const statusSlices = buildLecturerStatusSlices(stats);

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      <PageHeader
        icon={LayoutDashboard}
        title="Tổng quan"
        subtitle={`Số liệu nhóm hướng dẫn · ${selectedSemester?.name || "Chưa chọn kỳ"}`}
        actions={[
          {
            label: "Làm mới",
            icon: RefreshCw,
            onClick: async () => {
              if (onRefresh) await onRefresh();
              onShowToast("Đã làm mới dữ liệu tổng quan");
            },
            variant: "secondary",
          },
        ]}
      />

      <StatsCards
        totalStudents={stats.total}
        interningCount={stats.interning}
        pendingResponseCount={stats.pending}
        overdueCount={stats.overdue}
        avgProgress={stats.avgProg}
        onCardClick={() => onNavigate("students")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Panel className="lg:col-span-8">
          <DashboardTrendChart
            title="Báo cáo tuần — nhóm của bạn"
            subtitle="Số bài nộp / tuần so với chỉ tiêu"
            data={weeklyTrendData}
            valueLabel="Đã nộp"
            targetLabel="Chỉ tiêu"
            variant="bar"
          />
        </Panel>
        <Panel className="lg:col-span-4">
          <DashboardDonutChart
            title="Trạng thái sinh viên"
            subtitle={`${stats.total} SV được phân công`}
            data={
              statusSlices.length > 0
                ? statusSlices
                : [{ name: "Chưa có dữ liệu", value: 1, tone: "slate" }]
            }
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
                  Cần xử lý
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Báo cáo, nhắc nhở và đánh giá chờ GVHD
                </p>
              </div>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                {actionItems.length} mục
              </span>
            </div>

            <ul className="divide-y divide-slate-100">
              {actionItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.type === "review" || item.type === "grade") {
                        onNavigate("reports");
                      } else {
                        onNavigate("students");
                      }
                    }}
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
                    <span className="flex items-center gap-1 text-[#1d4ed8] font-semibold text-[11px] shrink-0">
                      {item.buttonText}{" "}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </li>
              ))}
              {stats.pending > 0 && (
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("reports")}
                    className="w-full py-3 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-xs text-slate-900">
                        {stats.pending} bài nộp chờ nhận xét
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Kho báo cáo & bài nộp
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-amber-700 font-semibold text-[11px] shrink-0">
                      Duyệt <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </li>
              )}
              {stats.overdue > 0 && (
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate("students")}
                    className="w-full py-3 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-xs text-slate-900">
                        {stats.overdue} sinh viên quá hạn / rủi ro
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Cần theo dõi sát tiến độ
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-rose-700 font-semibold text-[11px] shrink-0">
                      Xem <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </li>
              )}
            </ul>
          </Panel>

          <RecentSubmissions
            submissions={submissions.slice(0, 5)}
            onViewAll={() => onNavigate("reports")}
            onReviewSubmission={() => onNavigate("reports")}
          />
        </div>

        <div className="lg:col-span-5 space-y-5">
          <Panel>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Hạn sắp tới</h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {deadlines.length} mốc
              </span>
            </div>
            <ul className="divide-y divide-slate-100">
              {deadlines.slice(0, 4).map((d) => (
                <li
                  key={d.id}
                  className="py-3 flex items-start gap-3 text-xs"
                >
                  <div className="text-center shrink-0 w-10">
                    <div className="text-sm font-bold text-slate-900">
                      {d.day}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase">
                      {d.month}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{d.title}</p>
                    <p className="text-[11px] text-slate-500">{d.subtitle}</p>
                    <p className="text-[10px] text-blue-700 font-bold mt-0.5">
                      {d.studentCount} sinh viên
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export { DashboardView as LecturerDashboardView };
