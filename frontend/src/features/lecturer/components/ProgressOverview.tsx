import { Building2, ChevronRight } from 'lucide-react';

interface ProgressOverviewProps {
  onSelectStatusFilter?: (status: string) => void;
}

export const ProgressOverview = ({ onSelectStatusFilter }: ProgressOverviewProps) => {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-slate-800 text-sm md:text-base">
            Tổng quan tiến độ thực tập
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">Học kỳ I - 2026 • 28 Sinh viên phụ trách</p>
        </div>
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
          55% Hoàn thành đợt
        </span>
      </div>

      {/* Stacked Progress Bar */}
      <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden flex shadow-inner mb-4">
        <div
          style={{ width: '55%' }}
          onClick={() => onSelectStatusFilter?.('Đúng hạn')}
          className="bg-blue-600 text-white text-xs font-bold flex items-center justify-center transition-all hover:brightness-110 cursor-pointer"
          title="Đúng hạn: 55%"
        >
          55% Đúng hạn
        </div>
        <div
          style={{ width: '20%' }}
          onClick={() => onSelectStatusFilter?.('Chậm')}
          className="bg-orange-400 text-white text-xs font-bold flex items-center justify-center transition-all hover:brightness-110 cursor-pointer"
          title="Chậm: 20%"
        >
          20% Chậm
        </div>
        <div
          style={{ width: '10%' }}
          onClick={() => onSelectStatusFilter?.('Quá hạn')}
          className="bg-red-400 text-white text-xs font-bold flex items-center justify-center transition-all hover:brightness-110 cursor-pointer"
          title="Quá hạn: 10%"
        >
          10%
        </div>
        <div
          style={{ width: '15%' }}
          onClick={() => onSelectStatusFilter?.('Đã xong')}
          className="bg-emerald-400 text-white text-xs font-bold flex items-center justify-center transition-all hover:brightness-110 cursor-pointer"
          title="Xong: 15%"
        >
          15%
        </div>
      </div>

      {/* Legend Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* ĐÚNG HẠN */}
        <div
          onClick={() => onSelectStatusFilter?.('Đúng hạn')}
          className="p-3 rounded-xl bg-slate-50/80 hover:bg-blue-50/80 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">ĐÚNG HẠN</span>
            </div>
            <span className="text-xl font-extrabold text-slate-800">55%</span>
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
            <span className="text-[8px] font-black text-blue-600 absolute">55%</span>
          </div>
        </div>

        {/* CHẬM */}
        <div
          onClick={() => onSelectStatusFilter?.('Chậm')}
          className="p-3 rounded-xl bg-slate-50/80 hover:bg-orange-50/80 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">CHẬM</span>
            </div>
            <span className="text-xl font-extrabold text-slate-800">20%</span>
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
                className="text-orange-400 transition-all duration-500"
                strokeDasharray="20, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-[8px] font-black text-orange-500 absolute">20%</span>
          </div>
        </div>

        {/* QUÁ HẠN */}
        <div
          onClick={() => onSelectStatusFilter?.('Quá hạn')}
          className="p-3 rounded-xl bg-slate-50/80 hover:bg-red-50/80 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">QUÁ HẠN</span>
            </div>
            <span className="text-xl font-extrabold text-slate-800">10%</span>
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
                className="text-red-400 transition-all duration-500"
                strokeDasharray="10, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-[8px] font-black text-red-500 absolute">10%</span>
          </div>
        </div>

        {/* XONG */}
        <div
          onClick={() => onSelectStatusFilter?.('Đã xong')}
          className="p-3 rounded-xl bg-slate-50/80 hover:bg-emerald-50/80 border border-slate-200/80 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">XONG</span>
            </div>
            <span className="text-xl font-extrabold text-slate-800">15%</span>
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
                className="text-emerald-400 transition-all duration-500"
                strokeDasharray="15, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-[8px] font-black text-emerald-500 absolute">15%</span>
          </div>
        </div>
      </div>

      {/* Class Progress Breakdown Table */}
      <div className="pt-3 border-t border-slate-100">
        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Tiến độ nộp báo cáo theo lớp
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Lớp CNTT-K15A</span>
              <span className="text-[10px] text-slate-500">10/12 sinh viên đã hoàn thành</span>
            </div>
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">83%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Lớp CNTT-K15B</span>
              <span className="text-[10px] text-slate-500">8/10 sinh viên đã hoàn thành</span>
            </div>
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">80%</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Lớp KTPM-K15</span>
              <span className="text-[10px] text-slate-500">4/6 sinh viên đã hoàn thành</span>
            </div>
            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">67%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TopEnterprisesProps {
  enterprises: any[];
  onViewAll?: () => void;
}

export const TopEnterprises = ({ enterprises, onViewAll }: TopEnterprisesProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 border-l-4 border-l-teal-600 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <h4 className="text-xs font-extrabold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-blue-600" />
          TOP DOANH NGHIỆP
        </h4>
        <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
          124 tổng
        </span>
      </div>

      <div className="space-y-2.5">
        {enterprises.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl transition-colors border border-slate-200/80"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-white rounded-lg border border-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                {item.shortCode}
              </div>
              <span className="text-xs font-bold text-slate-800">{item.name}</span>
            </div>

            {/* Badge Tag */}
            <span
              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                item.badge === 'ĐỐI TÁC ƯU TIÊN'
                  ? 'bg-amber-500 text-white'
                  : item.badge === 'CÓ TRẢ LƯƠNG'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {item.badge}
            </span>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-400 font-medium">FPT, VNC, VT +12</span>
        <button
          onClick={onViewAll}
          className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>Chi tiết</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
