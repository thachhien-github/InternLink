import {
  CalendarDays,
  Clock,
  Flag,
  Building2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
export const InternshipOverviewCard = ({
  onViewDetails,
  onEditSemester
}) => {
  const semesterData = {
    name: "Th\u1EF1c t\u1EADp T\u1ED1t nghi\u1EC7p K20 (2025 - 2026)",
    term: "H\u1ECDc k\u1EF3 I",
    academicYear: "2025 - 2026",
    startDate: "01/09/2025",
    endDate: "15/12/2025",
    status: "\u0110ang di\u1EC5n ra",
    currentWeek: "Tu\u1EA7n 10 / 15",
    progress: 66,
    // percentage
    totalStudents: 1280,
    placedStudents: 1268,
    partnerCompanies: 185
  };
  return <div className="bg-white rounded-2xl border border-slate-200/80 border-l-4 border-l-blue-600 p-5 shadow-xs space-y-4 relative overflow-hidden">
      {
    /* Header title */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                {semesterData.name}
              </h2>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {semesterData.status} ({semesterData.currentWeek})
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Học kỳ I • Niên khóa 2025 - 2026 • Khoa Công nghệ Thông tin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
    onClick={onEditSemester}
    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-200/80 transition-colors"
  >
            Cấu hình đợt
          </button>
          <button
    onClick={onViewDetails}
    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1"
  >
            <span>Chi tiết kỳ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {
    /* Grid displaying information */
  }
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
        <div className="p-1.5 space-y-0.5">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Học kỳ</p>
          <p className="font-black text-slate-800 text-xs">{semesterData.term}</p>
        </div>

        <div className="p-1.5 space-y-0.5 sm:border-l sm:border-slate-200/60 sm:pl-3">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Niên khóa</p>
          <p className="font-black text-slate-800 text-xs">{semesterData.academicYear}</p>
        </div>

        <div className="p-1.5 space-y-0.5 sm:border-l sm:border-slate-200/60 sm:pl-3">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Ngày bắt đầu</p>
          <p className="font-bold text-slate-800 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-600" /> {semesterData.startDate}
          </p>
        </div>

        <div className="p-1.5 space-y-0.5 sm:border-l sm:border-slate-200/60 sm:pl-3">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Ngày kết thúc</p>
          <p className="font-bold text-slate-800 text-xs flex items-center gap-1">
            <Flag className="w-3 h-3 text-rose-600" /> {semesterData.endDate}
          </p>
        </div>

        <div className="p-1.5 space-y-0.5 sm:border-l sm:border-slate-200/60 sm:pl-3">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sinh viên thực tập</p>
          <p className="font-black text-blue-900 text-xs">{semesterData.placedStudents} / {semesterData.totalStudents} sinh viên</p>
        </div>

        <div className="p-1.5 space-y-0.5 sm:border-l sm:border-slate-200/60 sm:pl-3">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Doanh nghiệp</p>
          <p className="font-bold text-slate-800 text-xs flex items-center gap-1">
            <Building2 className="w-3 h-3 text-teal-600" /> {semesterData.partnerCompanies} công ty
          </p>
        </div>
      </div>

      {
    /* Visual Progress Bar */
  }
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Tiến độ đợt thực tập
          </span>
          <span className="font-black text-blue-700">{semesterData.progress}% hoàn thành</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200/80 overflow-hidden">
          <div
    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 h-full rounded-full transition-all duration-500 shadow-xs relative"
    style={{ width: `${semesterData.progress}%` }}
  >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-0.5">
          <span>Khởi động (01/09)</span>
          <span className="font-bold text-slate-700">Đang ở Tuần 10 (Nộp báo cáo giữa kỳ)</span>
          <span>Nộp báo cáo cuối & Bảo vệ (15/12)</span>
        </div>
      </div>
    </div>;
};
