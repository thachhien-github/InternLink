import { Users, Briefcase, FileText, TrendingUp } from "lucide-react";
import { KpiCard, KpiGrid } from "../../../components/common/KpiCard";

export const StatsCards = ({
  totalStudents,
  interningCount,
  pendingResponseCount,
  overdueCount,
  avgProgress,
  onCardClick,
}: {
  totalStudents: number;
  interningCount: number;
  pendingResponseCount: number;
  overdueCount: number;
  completedCount?: number;
  avgProgress: number;
  onCardClick?: (type: string) => void;
}) => {
  return (
    <KpiGrid>
      <KpiCard
        tone="blue"
        title="Sinh viên hướng dẫn"
        value={totalStudents}
        unit="sinh viên"
        icon={Users}
        footer="Phân công đợt HK1 • 2026"
        onClick={() => onCardClick?.("all")}
      />
      <KpiCard
        tone="emerald"
        title="Đã nhận Doanh nghiệp"
        value={interningCount}
        unit="sinh viên"
        icon={Briefcase}
        footer="Đang thực tập tại công ty"
        onClick={() => onCardClick?.("interning")}
      />
      <KpiCard
        tone="amber"
        title="Báo cáo cần phản hồi"
        value={pendingResponseCount}
        unit="báo cáo"
        icon={FileText}
        footer={
          overdueCount > 0
            ? `${overdueCount} cần duyệt gấp`
            : "Đã phản hồi kịp thời"
        }
        onClick={() => onCardClick?.("pending")}
      />
      <KpiCard
        tone="sky"
        title="Tiến độ trung bình"
        value={`${avgProgress}%`}
        unit="tiến độ"
        icon={TrendingUp}
        footer={
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        }
        onClick={() => onCardClick?.("progress")}
      />
    </KpiGrid>
  );
};
