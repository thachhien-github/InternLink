import {
  CalendarDays,
  Clock,
  Flag,
  Building2,
  ChevronRight,
} from "lucide-react";

export const InternshipOverviewCard = ({
  onViewDetails,
  onEditSemester,
}: {
  onViewDetails?: () => void;
  onEditSemester?: () => void;
}) => {
  const semesterData = {
    name: "Thực tập Tốt nghiệp K20 (2025 - 2026)",
    term: "Học kỳ I",
    academicYear: "2025 - 2026",
    startDate: "01/09/2025",
    endDate: "15/12/2025",
    status: "Đang diễn ra",
    currentWeek: "Tuần 10 / 15",
    progress: 66,
    totalStudents: 1280,
    placedStudents: 1268,
    partnerCompanies: 185,
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <CalendarDays className="w-5 h-5 text-[#1d4ed8] shrink-0 mt-0.5" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {semesterData.name}
              </h2>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                {semesterData.status} · {semesterData.currentWeek}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Học kỳ I · Niên khóa 2025 - 2026 · Khoa Công nghệ Thông tin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onEditSemester}
            className="il-btn il-btn-secondary"
          >
            Cấu hình đợt
          </button>
          <button
            type="button"
            onClick={onViewDetails}
            className="il-btn il-btn-primary"
          >
            <span>Chi tiết kỳ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs pt-1 border-t border-slate-100">
        <div className="space-y-0.5 pt-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
            Học kỳ
          </p>
          <p className="font-semibold text-slate-800">{semesterData.term}</p>
        </div>
        <div className="space-y-0.5 pt-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
            Niên khóa
          </p>
          <p className="font-semibold text-slate-800">
            {semesterData.academicYear}
          </p>
        </div>
        <div className="space-y-0.5 pt-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
            Ngày bắt đầu
          </p>
          <p className="font-semibold text-slate-800 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" /> {semesterData.startDate}
          </p>
        </div>
        <div className="space-y-0.5 pt-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
            Ngày kết thúc
          </p>
          <p className="font-semibold text-slate-800 flex items-center gap-1">
            <Flag className="w-3 h-3 text-slate-400" /> {semesterData.endDate}
          </p>
        </div>
        <div className="space-y-0.5 pt-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
            Sinh viên thực tập
          </p>
          <p className="font-semibold text-slate-800">
            {semesterData.placedStudents} / {semesterData.totalStudents}
          </p>
        </div>
        <div className="space-y-0.5 pt-3">
          <p className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
            Doanh nghiệp
          </p>
          <p className="font-semibold text-slate-800 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-400" />
            {semesterData.partnerCompanies} công ty
          </p>
        </div>
      </div>

      <div className="space-y-1.5 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Tiến độ đợt thực tập
          </span>
          <span className="font-semibold text-[#1d4ed8]">
            {semesterData.progress}% hoàn thành
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
          <div
            className="bg-[#1d4ed8] h-full rounded-full transition-all duration-500"
            style={{ width: `${semesterData.progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <span>Khởi động (01/09)</span>
          <span className="text-slate-700 font-medium">
            Đang ở Tuần 10 (Nộp báo cáo giữa kỳ)
          </span>
          <span>Bảo vệ (15/12)</span>
        </div>
      </div>
    </section>
  );
};
