import {
  FileText,
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  ChevronRight
} from 'lucide-react';

interface ActionItemsCardProps {
  actionItems: any[];
  onActionClick: (item: any) => void;
}

export const ActionItemsCard = ({ actionItems, onActionClick }: ActionItemsCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-4 bg-blue-600 rounded-full" />
          <h3 className="font-extrabold text-slate-800 text-sm md:text-base">
            Cần xử lý hôm nay
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Thứ 4, 25 Tháng 10
        </span>
      </div>

      {/* Action Item Rows */}
      <div className="grid grid-cols-1 gap-2.5">
        {/* 1. 5 báo cáo cần nhận xét */}
        <div className="p-3 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">
                5 báo cáo cần nhận xét
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Nhóm CNTT K15 • <span className="text-red-600 font-semibold">Ưu tiên cao</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => onActionClick(actionItems[0] || { id: 'act-1', title: '5 báo cáo', subtitle: '', type: 'review', count: 5 })}
            className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-blue-600 transition-colors border border-transparent hover:border-slate-200 shrink-0 cursor-pointer"
            title="Xem danh sách"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2. 3 sinh viên chưa nộp */}
        <div className="p-3 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">
                3 sinh viên chưa nộp
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Cần gửi nhắc nhở hệ thống
              </p>
            </div>
          </div>
          <button
            onClick={() => onActionClick(actionItems[1] || { id: 'act-2', title: 'Nhắc nhở', subtitle: '', type: 'remind', count: 3 })}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Nhắc nhở
          </button>
        </div>

        {/* 3. 2 sinh viên quá hạn */}
        <div className="p-3 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">
                2 sinh viên quá hạn
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Giai đoạn: Báo cáo giữa kỳ
              </p>
            </div>
          </div>
          <button
            onClick={() => onActionClick(actionItems[2] || { id: 'act-3', title: 'Quá hạn', subtitle: '', type: 'overdue', count: 2 })}
            className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-rose-600 transition-colors border border-transparent hover:border-slate-200 shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4. Duyệt doanh nghiệp */}
        <div className="p-3 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">
                2 doanh nghiệp chờ duyệt
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                CMC Global, MISA Software
              </p>
            </div>
          </div>
          <button
            onClick={() => onActionClick(actionItems[4] || { id: 'act-5', title: 'Duyệt doanh nghiệp', subtitle: '', type: 'enterprise', count: 2 })}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Duyệt
          </button>
        </div>
      </div>
    </div>
  );
};

interface UpcomingDeadlinesCardProps {
  deadlines: any[];
  onViewCalendar?: () => void;
}

export const UpcomingDeadlinesCard = ({ deadlines, onViewCalendar }: UpcomingDeadlinesCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h4 className="text-xs font-extrabold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            LỊCH HẠN SẮP TỚI
          </h4>
        </div>

        <div className="space-y-3">
          {deadlines.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2.5 bg-slate-50/80 hover:bg-blue-50/60 rounded-xl transition-colors border border-slate-200/80"
            >
              {/* Date Badge */}
              <div className="w-11 h-11 bg-red-100/80 rounded-xl flex flex-col items-center justify-center shrink-0 border border-red-200">
                <span className="text-[9px] font-extrabold text-red-600 uppercase tracking-tighter">
                  {item.month}
                </span>
                <span className="text-sm font-black text-red-700 leading-none">
                  {item.day}
                </span>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Link */}
      <button
        onClick={onViewCalendar}
        className="w-full mt-4 py-2 text-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer border border-transparent hover:border-blue-100"
      >
        <span>Xem lịch tháng</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
