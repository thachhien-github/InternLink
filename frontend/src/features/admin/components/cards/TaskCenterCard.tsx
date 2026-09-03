import {
  CheckSquare,
  UserX,
  UserX2,
  KeyRound,
  FileCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
export const TaskCenterCard = ({ onHandleTask }) => {
  const pendingTasks: any[] = [];
  return (
    <div className="bg-white rounded-lg border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-md border border-amber-100">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Nhiệm vụ cần xử lý ngay (Task Center)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Các vấn đề vận hành đợt thực tập cần Ban Quản lý giải quyết
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-lg border border-amber-200 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> 4 mục chờ
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pendingTasks.map((task) => {
          const Icon = task.icon;
          return (
            <div
              key={task.id}
              className="p-3.5 bg-slate-50/80 hover:bg-slate-50 rounded-md border border-slate-200/80 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-md border shrink-0 ${task.color === "rose" ? "bg-rose-50 text-rose-600 border-rose-100" : task.color === "amber" ? "bg-amber-50 text-amber-600 border-amber-100" : task.color === "slate" ? "bg-slate-100 text-slate-700 border-slate-200" : "bg-blue-50 text-blue-600 border-blue-100"}`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 text-xs truncate">
                      {task.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                    {task.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${task.urgency === "Cao" ? "bg-rose-100 text-rose-700" : task.urgency === "Trung b\xECnh" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-700"}`}
                >
                  Ưu tiên: {task.urgency}
                </span>

                <button
                  onClick={() => onHandleTask(task.id, task.title)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1"
                >
                  <span>Xử lý ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
