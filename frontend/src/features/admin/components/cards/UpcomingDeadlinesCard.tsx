import { CalendarDays, Lock, FileText, Award, Flag, Clock } from "lucide-react";
export const UpcomingDeadlinesCard = () => {
  const deadlines = [
    {
      id: "d1",
      title: "Kh\xF3a ph\xE2n c\xF4ng h\u01B0\u1EDBng d\u1EABn",
      date: "15/10/2025",
      timeRemaining: "\u0110\xE3 kh\xF3a",
      status: "completed",
      icon: Lock,
      color: "slate",
    },
    {
      id: "d2",
      title: "H\u1EA1n n\u1ED9p b\xE1o c\xE1o cu\u1ED1i k\u1EF3",
      date: "30/11/2025",
      timeRemaining: "C\xF2n 15 ng\xE0y",
      status: "upcoming",
      icon: FileText,
      color: "amber",
    },
    {
      id: "d3",
      title: "Ng\xE0y b\u1EA3o v\u1EC7 th\u1EF1c t\u1EADp",
      date: "10/12/2025",
      timeRemaining: "C\xF2n 25 ng\xE0y",
      status: "upcoming",
      icon: Award,
      color: "blue",
    },
    {
      id: "d4",
      title: "K\u1EBFt th\xFAc k\u1EF3 th\u1EF1c t\u1EADp",
      date: "15/12/2025",
      timeRemaining: "C\xF2n 30 ng\xE0y",
      status: "upcoming",
      icon: Flag,
      color: "rose",
    },
  ];
  return (
    <div className="bg-white rounded-lg border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Lịch trình & Hạn chót sắp tới (Upcoming Deadlines)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Mốc thời gian trọng yếu của đợt thực tập Học kỳ I (2025-2026)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {deadlines.map((dl) => {
          const Icon = dl.icon;
          const isDone = dl.status === "completed";
          return (
            <div
              key={dl.id}
              className={`p-3.5 rounded-md border transition-all flex flex-col justify-between space-y-2 ${isDone ? "bg-slate-50/80 border-slate-200 text-slate-600 opacity-75" : "bg-slate-50/80 hover:bg-slate-50 border-slate-200/80"}`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-lg border ${isDone ? "bg-slate-200 text-slate-600 border-slate-300" : dl.color === "amber" ? "bg-amber-50 text-amber-600 border-amber-100" : dl.color === "blue" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDone ? "bg-slate-200 text-slate-700" : "bg-blue-100 text-blue-800"}`}
                >
                  {dl.timeRemaining}
                </span>
              </div>

              <div>
                <p className="font-bold text-slate-900 text-xs">{dl.title}</p>
                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-400" /> Ngày: {dl.date}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
