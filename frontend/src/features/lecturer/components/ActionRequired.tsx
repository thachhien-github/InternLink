import {
  FileText,
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";
import type { ActionItem, Deadline } from "../../../types/common";

interface ActionItemsCardProps {
  actionItems: ActionItem[];
  onActionClick: (item: ActionItem) => void;
}

export const ActionItemsCard = ({
  actionItems,
  onActionClick,
}: ActionItemsCardProps) => {
  return (
    <div className="il-panel p-5">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm md:text-base font-display">
            Cần xử lý hôm nay
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium font-display">
          Thứ 4, 25 Tháng 10
        </span>
      </div>

      {/* Action Item Rows */}
      <div className="grid grid-cols-1 gap-2.5">
        {/* 1. 5 báo cáo cần nhận xét */}
        <div className="p-3 bg-slate-50 hover:bg-rose-50/50 rounded-md border border-slate-200/70 flex items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">
                5 báo cáo cần nhận xét
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Nhóm CNTT K15 •{" "}
                <span className="text-rose-600 font-bold">Ưu tiên cao</span>
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              onActionClick(
                actionItems[0] || {
                  id: "act-1",
                  title: "5 báo cáo",
                  subtitle: "",
                  type: "review",
                  count: 5,
                  buttonText: "Xem danh sách",
                },
              )
            }
            className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-blue-600 transition-colors border border-transparent hover:border-slate-200 shrink-0 cursor-pointer"
            title="Xem danh sách"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2. 3 sinh viên chưa nộp */}
        <div className="p-3 bg-slate-50 hover:bg-amber-50/50 rounded-md border border-slate-200/70 flex items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">
                3 sinh viên chưa nộp
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Gửi nhắc nhở tự động
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              onActionClick(
                actionItems[1] || {
                  id: "act-2",
                  title: "Nhắc nhở",
                  subtitle: "",
                  type: "remind",
                  count: 3,
                  buttonText: "Nhắc nhở",
                },
              )
            }
            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer font-display"
          >
            Nhắc nhở
          </button>
        </div>

        {/* 3. 2 sinh viên quá hạn */}
        <div className="p-3 bg-slate-50 hover:bg-rose-50/50 rounded-md border border-slate-200/70 flex items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">
                2 sinh viên quá hạn
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Báo cáo thực tập giữa kỳ
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              onActionClick(
                actionItems[2] || {
                  id: "act-3",
                  title: "Quá hạn",
                  subtitle: "",
                  type: "overdue",
                  count: 2,
                  buttonText: "Cảnh báo",
                },
              )
            }
            className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-rose-600 transition-colors border border-transparent hover:border-slate-200 shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4. Duyệt doanh nghiệp */}
        <div className="p-3 bg-slate-50 hover:bg-emerald-50/50 rounded-md border border-slate-200/70 flex items-center justify-between gap-3 transition-colors">
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
            onClick={() =>
              onActionClick(
                actionItems[4] || {
                  id: "act-5",
                  title: "Duyệt doanh nghiệp",
                  subtitle: "",
                  type: "enterprise",
                  count: 2,
                  buttonText: "Duyệt",
                },
              )
            }
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer font-display"
          >
            Duyệt
          </button>
        </div>
      </div>
    </div>
  );
};

interface UpcomingDeadlinesCardProps {
  deadlines: Deadline[];
  onViewCalendar?: () => void;
}

export const UpcomingDeadlinesCard = ({
  deadlines,
  onViewCalendar,
}: UpcomingDeadlinesCardProps) => {
  return (
    <div className="il-panel p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-2 font-display">
            <CalendarCheck className="w-4 h-4 text-blue-600" />
            LỊCH HẠN SẮP TỚI
          </h4>
        </div>

        <div className="space-y-3">
          {deadlines.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-blue-50/50 rounded-md transition-colors border border-slate-200/70"
            >
              {/* Date Badge */}
              <div className="w-11 h-11 bg-rose-50 rounded-md flex flex-col items-center justify-center shrink-0 border border-rose-200/80">
                <span className="text-[9px] font-bold text-rose-600 uppercase tracking-tighter font-display">
                  {item.month}
                </span>
                <span className="text-sm font-bold text-rose-700 leading-none il-kpi-val">
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
        className="w-full mt-4 py-2 text-center text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer font-display"
      >
        <span>Xem lịch tháng</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
