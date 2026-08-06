import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
export const StatsCards = ({
  totalStudents,
  interningCount,
  pendingResponseCount,
  overdueCount,
  avgProgress,
  onCardClick
}) => {
  return <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 il-stagger">
      {
    /* 1. TỔNG SINH VIÊN HƯỚNG DẪN */
  }
      <div
    onClick={() => onCardClick?.("all")}
    className="il-card-interactive bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 p-4 rounded-2xl border border-indigo-200/80 border-l-4 border-l-indigo-500 shadow-2xs hover:shadow-md cursor-pointer space-y-1.5"
  >
        <div className="flex items-center justify-between text-indigo-600">
          <span className="text-[10px] font-extrabold uppercase text-indigo-800 tracking-wider">
            Sinh viên hướng dẫn
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-100/80 text-indigo-600 border border-indigo-200/60 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-900">{totalStudents}</span>
          <span className="text-xs font-bold text-slate-400">sinh viên</span>
        </div>
        <span className="text-[11px] text-indigo-600 font-bold block">Danh sách đợt hiện tại</span>
      </div>

      {
    /* 2. ĐANG THỰC TẬP DOANH NGHIỆP */
  }
      <div
    onClick={() => onCardClick?.("interning")}
    className="il-card-interactive bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 p-4 rounded-2xl border border-emerald-200/80 border-l-4 border-l-emerald-500 shadow-2xs hover:shadow-md cursor-pointer space-y-1.5"
  >
        <div className="flex items-center justify-between text-emerald-600">
          <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
            Đã tiếp nhận Doanh nghiệp
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-600 border border-emerald-200/60 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-emerald-800">{interningCount}</span>
          <span className="text-xs font-bold text-emerald-600">sinh viên</span>
        </div>
        <span className="text-[11px] text-emerald-600 font-bold block">Đang làm việc tại công ty</span>
      </div>

      {
    /* 3. BÁO CÁO CẦN PHẢN HỒI */
  }
      <div
    onClick={() => onCardClick?.("pending")}
    className="il-card-interactive bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 p-4 rounded-2xl border border-amber-200/80 border-l-4 border-l-amber-500 shadow-2xs hover:shadow-md cursor-pointer space-y-1.5"
  >
        <div className="flex items-center justify-between text-amber-600">
          <span className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider">
            Báo cáo cần phản hồi
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-600 border border-amber-200/60 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-amber-800">{pendingResponseCount}</span>
          <span className="text-xs font-bold text-amber-600">báo cáo</span>
        </div>
        <span className="text-[11px] text-amber-600 font-bold block">
          {overdueCount > 0 ? `${overdueCount} b\xE1o c\xE1o c\u1EA7n x\u1EED l\xFD g\u1EA5p` : "\u0110\xE3 ph\u1EA3n h\u1ED3i k\u1ECBp th\u1EDDi"}
        </span>
      </div>

      {
    /* 4. TIẾN ĐỘ TRUNG BÌNH */
  }
      <div
    onClick={() => onCardClick?.("progress")}
    className="il-card-interactive bg-gradient-to-br from-blue-50/80 via-white to-sky-50/40 p-4 rounded-2xl border border-blue-200/80 border-l-4 border-l-blue-500 shadow-2xs hover:shadow-md cursor-pointer space-y-1.5"
  >
        <div className="flex items-center justify-between text-blue-600">
          <span className="text-[10px] font-extrabold uppercase text-blue-800 tracking-wider">
            Tiến độ trung bình
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-600 border border-blue-200/60 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-blue-900">{avgProgress}%</span>
          <span className="text-xs font-bold text-blue-600">tiến độ</span>
        </div>
        <span className="text-[11px] text-blue-600 font-bold block">Bình quân toàn bộ sinh viên</span>
      </div>
    </section>;
};
