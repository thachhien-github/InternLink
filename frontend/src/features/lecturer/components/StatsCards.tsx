import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
export const StatsCards = ({
  totalStudents,
  interningCount,
  pendingResponseCount,
  overdueCount,
  completedCount,
  avgProgress,
  onCardClick
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
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. TỔNG SINH VIÊN HƯỚNG DẪN */}
      <div
        onClick={() => onCardClick?.("all")}
        className="il-bento-card p-5 cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-display">
            Sinh viên hướng dẫn
          </span>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 il-kpi-val">{totalStudents}</span>
            <span className="text-xs font-semibold text-slate-500">sinh viên</span>
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>Phân công đợt HK1 • 2026</span>
          </p>
        </div>
      </div>

      {/* 2. ĐANG THỰC TẬP DOANH NGHIỆP */}
      <div
        onClick={() => onCardClick?.("interning")}
        className="il-bento-card p-5 cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-display">
            Đã nhận Doanh nghiệp
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-900 il-kpi-val">{interningCount}</span>
            <span className="text-xs font-semibold text-emerald-600">sinh viên</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Đang thực tập tại công ty</span>
          </p>
        </div>
      </div>

      {/* 3. BÁO CÁO CẦN PHẢN HỒI */}
      <div
        onClick={() => onCardClick?.("pending")}
        className="il-bento-card p-5 cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-display">
            Báo cáo cần phản hồi
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-900 il-kpi-val">{pendingResponseCount}</span>
            <span className="text-xs font-semibold text-amber-600">báo cáo</span>
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>{overdueCount > 0 ? `${overdueCount} cần duyệt gấp` : "Đã phản hồi kịp thời"}</span>
          </p>
        </div>
      </div>

      {/* 4. TIẾN ĐỘ TRUNG BÌNH */}
      <div
        onClick={() => onCardClick?.("progress")}
        className="il-bento-card p-5 cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-display">
            Tiến độ trung bình
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-900 il-kpi-val">{avgProgress}%</span>
            <span className="text-xs font-semibold text-blue-600">tiến độ</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${avgProgress}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
};
