import type { InternshipStatsDto } from "../../types/api";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TONE_FILL: Record<string, string> = {
  blue: "#1d4ed8",
  emerald: "#059669",
  amber: "#d97706",
  rose: "#e11d48",
  sky: "#0284c7",
  slate: "#64748b",
};

export type ChartSlice = {
  name: string;
  value: number;
  tone?: keyof typeof TONE_FILL;
};

export type TrendPoint = {
  label: string;
  value: number;
  target?: number;
};

export function DashboardTrendChart({
  title,
  subtitle,
  data,
  valueLabel = "Thực tế",
  targetLabel = "Kế hoạch",
  variant = "area",
}: {
  title: string;
  subtitle?: string;
  data: TrendPoint[];
  valueLabel?: string;
  targetLabel?: string;
  variant?: "area" | "bar";
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          {variant === "bar" ? (
            <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="value" name={valueLabel} fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              {data.some((d) => d.target != null) && (
                <Bar
                  dataKey="target"
                  name={targetLabel}
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dashTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dashTargetFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              <Area
                type="monotone"
                dataKey="value"
                name={valueLabel}
                stroke="#1d4ed8"
                strokeWidth={2}
                fill="url(#dashTrendFill)"
              />
              {data.some((d) => d.target != null) && (
                <Area
                  type="monotone"
                  dataKey="target"
                  name={targetLabel}
                  stroke="#059669"
                  strokeWidth={2}
                  fill="url(#dashTargetFill)"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DashboardDonutChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle?: string;
  data: ChartSlice[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {subtitle && (
          <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={TONE_FILL[entry.tone ?? "slate"]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-slate-900">{total}</span>
          <span className="text-[10px] text-slate-400 font-medium uppercase">
            Tổng
          </span>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-2 text-[11px]">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: TONE_FILL[d.tone ?? "slate"] }}
            />
            <span className="text-slate-600 truncate">{d.name}</span>
            <span className="font-bold text-slate-900 ml-auto">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Build admin internship status bar chart from API stats */
export function buildInternshipStatusTrend(
  stats: InternshipStatsDto,
): TrendPoint[] {
  return [
    { label: "Chưa bắt đầu", value: stats.notStarted },
    { label: "Đang TT", value: stats.inProgress },
    { label: "Chậm tiến độ", value: stats.behindSchedule },
    { label: "Chờ duyệt", value: stats.awaitingFeedback },
    { label: "Cần sửa", value: stats.requiresRevision },
    { label: "Hoàn thành", value: stats.completed },
    { label: "Đã chấm", value: stats.graded },
  ].filter((p) => p.value > 0);
}

export function buildAssignmentStatusSlices(
  assigned: number,
  unassigned: number,
): ChartSlice[] {
  return [
    { name: "Đã phân công GV", value: assigned, tone: "emerald" },
    { name: "Chưa phân công", value: unassigned, tone: "amber" },
  ].filter((s) => s.value > 0);
}

export function buildLecturerStatusSlices(stats: {
  total: number;
  interning: number;
  pending: number;
  overdue: number;
  completed: number;
}): ChartSlice[] {
  const onTrack = Math.max(
    0,
    stats.total - stats.pending - stats.overdue - stats.completed,
  );
  return [
    { name: "Đúng tiến độ", value: onTrack, tone: "emerald" },
    { name: "Chờ duyệt", value: stats.pending, tone: "amber" },
    { name: "Quá hạn / rủi ro", value: stats.overdue, tone: "rose" },
    { name: "Hoàn thành", value: stats.completed, tone: "sky" },
  ].filter((s) => s.value > 0);
}
