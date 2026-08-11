import {
  UserCheck,
  Users,
  CalendarDays,
  Building2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface AdminKpiSectionProps {
  onCardClick?: (id: string) => void;
}

export const AdminKpiSection = ({ onCardClick }: AdminKpiSectionProps) => {
  const kpis = [
    {
      id: "lecturers",
      title: "Giảng viên",
      value: "42",
      unit: "giảng viên",
      desc: "38 đang hướng dẫn",
      trend: "+3 đợt này",
      trendType: "positive",
      icon: UserCheck,
    },
    {
      id: "students",
      title: "Sinh viên",
      value: "1,280",
      unit: "sinh viên",
      desc: "Khoa CNTT & Kỹ thuật",
      trend: "+12% đợt này",
      trendType: "positive",
      icon: Users,
    },
    {
      id: "semesters",
      title: "Đợt thực tập",
      value: "2",
      unit: "đợt",
      desc: "Đang diễn ra",
      trend: "Đúng tiến độ",
      trendType: "neutral",
      icon: CalendarDays,
    },
    {
      id: "companies",
      title: "Doanh nghiệp",
      value: "185",
      unit: "doanh nghiệp",
      desc: "124 đối tác MOU",
      trend: "+15 đối tác mới",
      trendType: "positive",
      icon: Building2,
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 il-stagger">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            onClick={() => onCardClick && onCardClick(kpi.id)}
            className="il-bento-card il-card-interactive p-5 cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-display">
                  {kpi.title}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-slate-900 il-kpi-val">
                    {kpi.value}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{kpi.unit}</span>
                </div>
              </div>

              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium truncate max-w-[140px]" title={kpi.desc}>
                {kpi.desc}
              </span>

              <span className="px-2.5 py-0.5 rounded-full font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 flex items-center gap-1 font-display">
                {kpi.trendType === "positive" && <TrendingUp className="w-3 h-3 text-indigo-600" />}
                {kpi.trendType === "negative" && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                <span>{kpi.trend}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
