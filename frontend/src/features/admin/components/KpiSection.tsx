import {
  UserCheck,
  Users,
  CalendarDays,
  Building2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
export const AdminKpiSection = ({ onCardClick }) => {
  const kpis = [
    {
      id: "lecturers",
      title: "Gi\u1EA3ng vi\xEAn",
      value: "42",
      unit: "gi\u1EA3ng vi\xEAn",
      desc: "38 \u0111ang h\u01B0\u1EDBng d\u1EABn",
      trend: "+3 h\u1ECDc k\u1EF3 n\xE0y",
      trendType: "positive",
      icon: UserCheck,
      color: "blue"
    },
    {
      id: "students",
      title: "Sinh vi\xEAn",
      value: "1,280",
      unit: "sinh vi\xEAn",
      desc: "Khoa CNTT & K\u1EF9 thu\u1EADt",
      trend: "+12% \u0111\u1EE3t n\xE0y",
      trendType: "positive",
      icon: Users,
      color: "indigo"
    },
    {
      id: "semesters",
      title: "\u0110\u1EE3t th\u1EF1c t\u1EADp",
      value: "2",
      unit: "\u0111\u1EE3t",
      desc: "\u0110ang di\u1EC5n ra",
      trend: "\u0110\xFAng ti\u1EBFn \u0111\u1ED9",
      trendType: "neutral",
      icon: CalendarDays,
      color: "sky"
    },
    {
      id: "companies",
      title: "Doanh nghi\u1EC7p",
      value: "185",
      unit: "doanh nghi\u1EC7p",
      desc: "124 \u0111\u1ED1i t\xE1c MOU",
      trend: "+15 doanh nghi\u1EC7p m\u1EDBi",
      trendType: "positive",
      icon: Building2,
      color: "teal"
    }
  ];
  const getColorClasses = (color) => {
    switch (color) {
      case "blue":
        return {
          cardBg: "bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 border-blue-200/80",
          bgIcon: "bg-blue-100/80 text-blue-600 border-blue-200/60",
          borderHover: "hover:border-blue-400",
          borderLeft: "border-l-4 border-l-blue-500",
          badge: "bg-blue-100/80 text-blue-800 border-blue-200"
        };
      case "indigo":
        return {
          cardBg: "bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 border-indigo-200/80",
          bgIcon: "bg-indigo-100/80 text-indigo-600 border-indigo-200/60",
          borderHover: "hover:border-indigo-400",
          borderLeft: "border-l-4 border-l-indigo-500",
          badge: "bg-indigo-100/80 text-indigo-800 border-indigo-200"
        };
      case "sky":
        return {
          cardBg: "bg-gradient-to-br from-sky-50/80 via-white to-cyan-50/40 border-sky-200/80",
          bgIcon: "bg-sky-100/80 text-sky-600 border-sky-200/60",
          borderHover: "hover:border-sky-400",
          borderLeft: "border-l-4 border-l-sky-500",
          badge: "bg-sky-100/80 text-sky-800 border-sky-200"
        };
      case "teal":
        return {
          cardBg: "bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/40 border-teal-200/80",
          bgIcon: "bg-teal-100/80 text-teal-600 border-teal-200/60",
          borderHover: "hover:border-teal-400",
          borderLeft: "border-l-4 border-l-teal-500",
          badge: "bg-teal-100/80 text-teal-800 border-teal-200"
        };
      case "rose":
        return {
          cardBg: "bg-gradient-to-br from-rose-50/80 via-white to-orange-50/40 border-rose-200/80",
          bgIcon: "bg-rose-100/80 text-rose-600 border-rose-200/60",
          borderHover: "hover:border-rose-400",
          borderLeft: "border-l-4 border-l-rose-500",
          badge: "bg-rose-100/80 text-rose-800 border-rose-200"
        };
      case "amber":
        return {
          cardBg: "bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 border-amber-200/80",
          bgIcon: "bg-amber-100/80 text-amber-600 border-amber-200/60",
          borderHover: "hover:border-amber-400",
          borderLeft: "border-l-4 border-l-amber-500",
          badge: "bg-amber-100/80 text-amber-800 border-amber-200"
        };
      case "emerald":
        return {
          cardBg: "bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border-emerald-200/80",
          bgIcon: "bg-emerald-100/80 text-emerald-600 border-emerald-200/60",
          borderHover: "hover:border-emerald-400",
          borderLeft: "border-l-4 border-l-emerald-500",
          badge: "bg-emerald-100/80 text-emerald-800 border-emerald-200"
        };
      case "purple":
        return {
          cardBg: "bg-gradient-to-br from-purple-50/80 via-white to-pink-50/40 border-purple-200/80",
          bgIcon: "bg-purple-100/80 text-purple-600 border-purple-200/60",
          borderHover: "hover:border-purple-400",
          borderLeft: "border-l-4 border-l-purple-500",
          badge: "bg-purple-100/80 text-purple-800 border-purple-200"
        };
      default:
        return {
          cardBg: "bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 border-blue-200/80",
          bgIcon: "bg-blue-100/80 text-blue-600 border-blue-200/60",
          borderHover: "hover:border-blue-400",
          borderLeft: "border-l-4 border-l-blue-500",
          badge: "bg-blue-100/80 text-blue-800 border-blue-200"
        };
    }
  };
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
    const Icon = kpi.icon;
    const colorStyle = getColorClasses(kpi.color);
    return <div
      key={kpi.id}
      onClick={() => onCardClick && onCardClick(kpi.id)}
      className={`${colorStyle.cardBg} p-4 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden ${colorStyle.borderLeft} ${colorStyle.borderHover}`}
    >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-500 block">
                  {kpi.title}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:scale-105 transition-transform duration-200 inline-block">
                    {kpi.value}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{kpi.unit}</span>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border ${colorStyle.bgIcon} shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium truncate max-w-[140px]" title={kpi.desc}>
                {kpi.desc}
              </span>

              <span className={`px-2 py-0.5 rounded-md font-extrabold border flex items-center gap-1 ${colorStyle.badge}`}>
                {kpi.trendType === "positive" && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                {kpi.trendType === "negative" && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                <span>{kpi.trend}</span>
              </span>
            </div>
          </div>;
  })}
    </div>;
};
