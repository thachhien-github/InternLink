import {
  CheckSquare,
  UserX,
  UserX2,
  KeyRound,
  FileCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
export const TaskCenterCard = ({ onHandleTask }) => {
  const pendingTasks = [
    {
      id: "unassigned-students",
      title: "12 sinh vi\xEAn ch\u01B0a \u0111\u01B0\u1EE3c ph\xE2n c\xF4ng",
      desc: "Khoa CNTT - \u0110\u1EE3t th\u1EF1c t\u1EADp HK1 (2025-2026)",
      icon: UserX,
      color: "rose",
      urgency: "Cao",
      actionText: "Ph\xE2n c\xF4ng ngay"
    },
    {
      id: "unactivated-lecturers",
      title: "3 gi\u1EA3ng vi\xEAn ch\u01B0a k\xEDch ho\u1EA1t t\xE0i kho\u1EA3n",
      desc: "Gi\u1EA3ng vi\xEAn th\u1EC9nh gi\u1EA3ng m\u1EDBi b\u1ED5 sung k\u1EF3 n\xE0y",
      icon: UserX2,
      color: "amber",
      urgency: "Trung b\xECnh",
      actionText: "G\u1EEDi k\xEDch ho\u1EA1t"
    },
    {
      id: "password-resets",
      title: "15 y\xEAu c\u1EA7u \u0111\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u",
      desc: "Y\xEAu c\u1EA7u x\xE1c minh t\u1EEB email sinh vi\xEAn v\xE0 GV",
      icon: KeyRound,
      color: "purple",
      urgency: "Trung b\xECnh",
      actionText: "Duy\u1EC7t c\u1EA5p l\u1EA1i"
    },
    {
      id: "final-reports-pending",
      title: "25 b\xE1o c\xE1o cu\u1ED1i k\u1EF3 \u0111ang ch\u1EDD thu",
      desc: "H\u1ED9i \u0111\u1ED3ng b\u1EA3o v\u1EC7 \u0111\u1EE3t 1 c\u1EA7n thu th\u1EADp \u0111\u1EE7 file PDF",
      icon: FileCheck,
      color: "blue",
      urgency: "B\xECnh th\u01B0\u1EDDng",
      actionText: "Thu nh\u1EADn ngay"
    }
  ];
  return <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Nhiệm vụ cần xử lý ngay (Task Center)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Các vấn đề vận hành đợt thực tập cần Ban Quản lý giải quyết
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-extrabold text-xs rounded-lg border border-amber-200 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> 4 mục chờ
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pendingTasks.map((task) => {
    const Icon = task.icon;
    return <div
      key={task.id}
      className="p-3.5 bg-slate-50/80 hover:bg-slate-50 rounded-xl border border-slate-200/80 transition-all flex flex-col justify-between space-y-3 group"
    >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl border shrink-0 ${task.color === "rose" ? "bg-rose-50 text-rose-600 border-rose-100" : task.color === "amber" ? "bg-amber-50 text-amber-600 border-amber-100" : task.color === "purple" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-extrabold text-slate-900 text-xs truncate">{task.title}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{task.desc}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${task.urgency === "Cao" ? "bg-rose-100 text-rose-700" : task.urgency === "Trung b\xECnh" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-700"}`}>
                  Ưu tiên: {task.urgency}
                </span>

                <button
      onClick={() => onHandleTask(task.id, task.title)}
      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1 active:scale-95"
    >
                  <span>Xử lý ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>;
  })}
      </div>
    </div>;
};
