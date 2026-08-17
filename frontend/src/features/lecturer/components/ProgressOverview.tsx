import { Building2, ChevronRight } from "lucide-react";
import type { Enterprise } from "../../../types/enterprise";

interface ProgressOverviewProps {
  onSelectStatusFilter?: (status: string) => void;
}

export const ProgressOverview = ({
  onSelectStatusFilter,
}: ProgressOverviewProps) => {
  return (
    <div className="il-panel p-5 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm md:text-base font-display">
            Tổng quan tiến độ thực tập
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Học kỳ I - 2026 • 28 Sinh viên phụ trách
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200/80 font-display">
          55% Hoàn thành đợt
        </span>
      </div>

      {/* Stacked Progress Bar */}
      <div className="w-full h-7 bg-slate-100 rounded-md overflow-hidden flex shadow-inner mb-5 p-0.5 border border-slate-200/60">
        <div
          style={{ width: "55%" }}
          onClick={() => onSelectStatusFilter?.("Đúng hạn")}
          className="bg-blue-600 text-white text-xs font-bold flex items-center justify-center transition-all hover:brightness-110 cursor-pointer rounded-l-lg"
          title="Đúng hạn: 55%"
        >
          55% Đúng hạn
        </div>
        <div
          style={{ width: "20%" }}
          onClick={() => onSelectStatusFilter?.("Chậm")}
          className="bg-amber-500 text-white text-xs font-bold flex items-center justify-center transition-all hover:brightness-110 cursor-pointer"
          title="Chậm: 20%"
        >
          20% Chậm
        </div>
        <div
          style={{ width: "10%" }}
          onClick={() => onSelectStatusFilter?.("Quá hạn")}
          className="bg-rose-500 text-white text-xs font-bold flex items-center justify-center transition-all hover:brightness-110 cursor-pointer"
          title="Quá hạn: 10%"
        >
          10%
        </div>
        <div
          style={{ width: "15%" }}
          onClick={() => onSelectStatusFilter?.("Đã xong")}
          className="bg-emerald-500 text-white text-xs font-bold flex items-center justify-center transition-all hover:brightness-110 cursor-pointer rounded-r-lg"
          title="Xong: 15%"
        >
          15%
        </div>
      </div>

      {/* Legend Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {/* ĐÚNG HẠN */}
        <div
          onClick={() => onSelectStatusFilter?.("Đúng hạn")}
          className="p-3.5 rounded-md bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-[10px] font-bold text-slate-500 uppercase font-display">
                ĐÚNG HẠN
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-900 il-kpi-val">
              55%
            </span>
          </div>
          <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-600 transition-all duration-500"
                strokeDasharray="55, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-[9px] font-bold text-blue-600 absolute il-kpi-val">
              55
            </span>
          </div>
        </div>

        {/* CHẬM */}
        <div
          onClick={() => onSelectStatusFilter?.("Chậm")}
          className="p-3.5 rounded-md bg-slate-50 hover:bg-amber-50/70 border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase font-display">
                CHẬM
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-900 il-kpi-val">
              20%
            </span>
          </div>
          <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-500 transition-all duration-500"
                strokeDasharray="20, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-[9px] font-bold text-amber-600 absolute il-kpi-val">
              20
            </span>
          </div>
        </div>

        {/* QUÁ HẠN */}
        <div
          onClick={() => onSelectStatusFilter?.("Quá hạn")}
          className="p-3.5 rounded-md bg-slate-50 hover:bg-rose-50/70 border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase font-display">
                QUÁ HẠN
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-900 il-kpi-val">
              10%
            </span>
          </div>
          <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-rose-500 transition-all duration-500"
                strokeDasharray="10, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-[9px] font-bold text-rose-600 absolute il-kpi-val">
              10
            </span>
          </div>
        </div>

        {/* XONG */}
        <div
          onClick={() => onSelectStatusFilter?.("Đã xong")}
          className="p-3.5 rounded-md bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase font-display">
                XONG
              </span>
            </div>
            <span className="text-2xl font-bold text-slate-900 il-kpi-val">
              15%
            </span>
          </div>
          <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-500"
                strokeDasharray="15, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-[9px] font-bold text-emerald-600 absolute il-kpi-val">
              15
            </span>
          </div>
        </div>
      </div>

      {/* Class Progress Breakdown Table */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 font-display">
          Tiến độ nộp báo cáo theo lớp
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50/80 rounded-md border border-slate-200/70 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Lớp CNTT-K15A
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                10/12 sinh viên hoàn thành
              </span>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 il-kpi-val">
              83%
            </span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-md border border-slate-200/70 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Lớp CNTT-K15B
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                8/10 sinh viên hoàn thành
              </span>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 il-kpi-val">
              80%
            </span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-md border border-slate-200/70 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Lớp KTPM-K15
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                4/6 sinh viên hoàn thành
              </span>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 il-kpi-val">
              67%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TopEnterprisesProps {
  enterprises: Enterprise[];
  onViewAll?: () => void;
}

export const TopEnterprises = ({
  enterprises,
  onViewAll,
}: TopEnterprisesProps) => {
  return (
    <div className="il-panel p-5">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-2 font-display">
          <Building2 className="w-4 h-4 text-blue-600" />
          TOP DOANH NGHIỆP
        </h4>
        <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 font-display">
          124 đối tác
        </span>
      </div>

      <div className="space-y-2.5">
        {enterprises.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-slate-50/80 hover:bg-blue-50/50 rounded-md transition-colors border border-slate-200/70"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg border border-slate-200/80 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0 font-display shadow-xs">
                {item.shortCode}
              </div>
              <span className="text-xs font-bold text-slate-800">
                {item.name}
              </span>
            </div>

            <span
              className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
 item.badge === "ĐỐI TÁC ƯU TIÊN"
 ? "bg-amber-500 text-white"
 : item.badge === "CÓ TRẢ LƯƠNG"
 ? "bg-emerald-500 text-white"
 : "bg-slate-200 text-slate-700"
 }`}
            >
              {item.badge}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
        <span className="text-slate-400 font-medium">
          FPT, CMC, Viettel +12
        </span>
        <button
          onClick={onViewAll}
          className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Xem tất cả</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
