import {
  History,
  UserPlus,
  FileUp,
  CalendarPlus,
  FileCheck2,
  UserCheck,
  Clock,
  ChevronRight
} from 'lucide-react';
export const AdminActivityTimeline = ({ onViewAllHistory }) => {
  const activities = [
    {
      id: "act-1",
      title: "Import 120 sinh vi\xEAn",
      desc: "\u0110\u1ED3ng b\u1ED9 danh s\xE1ch sinh vi\xEAn K20 Khoa CNTT t\u1EEB h\u1EC7 th\u1ED1ng \u0110\xE0o t\u1EA1o",
      time: "10 ph\xFAt tr\u01B0\u1EDBc",
      date: "H\xF4m nay, 10:15",
      user: "Admin Nguy\u1EC5n V\u0103n C",
      type: "import",
      icon: FileUp,
      color: "blue"
    },
    {
      id: "act-2",
      title: "Ph\xE2n c\xF4ng Gi\u1EA3ng vi\xEAn Nguy\u1EC5n V\u0103n A",
      desc: "Giao h\u01B0\u1EDBng d\u1EABn 15 sinh vi\xEAn L\u1EDBp 20DTH1 th\u1EF1c t\u1EADp t\u1EA1i FPT Software",
      time: "45 ph\xFAt tr\u01B0\u1EDBc",
      date: "H\xF4m nay, 09:40",
      user: "V\u0103n ph\xF2ng Khoa",
      type: "assignment",
      icon: UserPlus,
      color: "indigo"
    },
    {
      id: "act-3",
      title: "T\u1EA1o K\u1EF3 th\u1EF1c t\u1EADp H\u1ECDc k\u1EF3 II (2025 - 2026)",
      desc: "Thi\u1EBFt l\u1EADp m\u1ED1c th\u1EDDi gian v\xE0 h\u1EA1n n\u1ED9p cho \u0111\u1EE3t th\u1EF1c t\u1EADp ti\u1EBFp theo",
      time: "2 gi\u1EDD tr\u01B0\u1EDBc",
      date: "H\xF4m nay, 08:30",
      user: "Ban Gi\xE1m hi\u1EC7u / Khoa",
      type: "semester",
      icon: CalendarPlus,
      color: "emerald"
    },
    {
      id: "act-4",
      title: "Thu nh\u1EADn 45 B\xE1o c\xE1o cu\u1ED1i k\u1EF3",
      desc: "X\xE1c nh\u1EADn h\u1EE3p l\u1EC7 c\xE1c file PDF b\xE1o c\xE1o th\u1EF1c t\u1EADp \u0111\u1EE3t 1 t\u1EEB Sinh vi\xEAn",
      time: "H\xF4m qua, 16:20",
      date: "01/08/2026",
      user: "H\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng",
      type: "report",
      icon: FileCheck2,
      color: "teal"
    },
    {
      id: "act-5",
      title: "K\xEDch ho\u1EA1t t\xE0i kho\u1EA3n Gi\u1EA3ng vi\xEAn Tr\u1EA7n Th\u1ECB B",
      desc: "C\u1EA5p quy\u1EC1n Gi\u1EA3ng vi\xEAn h\u01B0\u1EDBng d\u1EABn & g\u1EEDi email x\xE1c th\u1EF1c t\xE0i kho\u1EA3n",
      time: "H\xF4m qua, 14:00",
      date: "01/08/2026",
      user: "Admin H\u1EC7 th\u1ED1ng",
      type: "account",
      icon: UserCheck,
      color: "purple"
    }
  ];
  return <div className="bg-white rounded-2xl border border-slate-200/80 border-l-4 border-l-purple-600 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Nhật ký Hoạt động Hệ thống (Recent Activities)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sắp xếp theo thứ tự mới nhất (Newest First)
            </p>
          </div>
        </div>

        {onViewAllHistory && <button
    onClick={onViewAllHistory}
    className="text-xs text-blue-600 hover:text-blue-800 font-extrabold flex items-center gap-1 hover:underline"
  >
            <span>Xem lịch sử</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>}
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {activities.map((act) => {
    const Icon = act.icon;
    return <div key={act.id} className="relative group">
              {
      /* Timeline Bullet */
    }
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-blue-600 shadow-xs flex items-center justify-center group-hover:scale-125 transition-transform z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              </div>

              <div className="bg-slate-50/70 hover:bg-slate-50 p-3 rounded-xl border border-slate-200/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-slate-900 text-xs">{act.title}</span>
                    <span className="text-[10px] bg-slate-200/70 text-slate-700 px-2 py-0.2 rounded-md font-bold">
                      {act.user}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{act.desc}</p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[10px] text-blue-700 font-extrabold flex items-center gap-1 sm:justify-end">
                    <Clock className="w-3 h-3 text-blue-500" /> {act.time}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium block">{act.date}</span>
                </div>
              </div>
            </div>;
  })}
      </div>
    </div>;
};
