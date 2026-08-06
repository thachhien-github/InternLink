import {
  CalendarPlus,
  UserPlus,
  Users,
  Send,
  Archive,
  Zap,
  ArrowRight
} from 'lucide-react';
export const QuickActionsBar = ({
  onCreateSemester,
  onImportLecturers,
  onImportStudents,
  onAssignLecturers,
  onSendNotification,
  onViewArchive
}) => {
  const actions = [
    {
      id: "create-semester",
      title: "T\u1EA1o k\u1EF3 th\u1EF1c t\u1EADp",
      subtitle: "Thi\u1EBFt l\u1EADp \u0111\u1EE3t m\u1EDBi & l\u1ECBch tr\xECnh",
      icon: CalendarPlus,
      color: "bg-blue-600 hover:bg-blue-700 text-white",
      badge: "Ch\xEDnh",
      onClick: onCreateSemester
    },
    {
      id: "import-lecturers",
      title: "Import Gi\u1EA3ng vi\xEAn",
      subtitle: "T\u1EA3i l\xEAn danh s\xE1ch t\u1EEB Excel/CSV",
      icon: UserPlus,
      color: "bg-indigo-600 hover:bg-indigo-700 text-white",
      badge: "Excel",
      onClick: onImportLecturers
    },
    {
      id: "import-students",
      title: "Import Sinh vi\xEAn",
      subtitle: "\u0110\u1ED3ng b\u1ED9 danh s\xE1ch SV Khoa",
      icon: Users,
      color: "bg-teal-600 hover:bg-teal-700 text-white",
      badge: "Excel",
      onClick: onImportStudents
    },
    {
      id: "assign-lecturers",
      title: "Ph\xE2n c\xF4ng h\u01B0\u1EDBng d\u1EABn",
      subtitle: "Gh\xE9p SV v\u1EDBi GV theo \u0111\u1ECBnh m\u1EE9c",
      icon: UserPlus,
      color: "bg-emerald-600 hover:bg-emerald-700 text-white",
      badge: "T\u1EF1 \u0111\u1ED9ng",
      onClick: onAssignLecturers
    },
    {
      id: "send-notification",
      title: "G\u1EEDi th\xF4ng b\xE1o",
      subtitle: "Ph\xE1t th\xF4ng b\xE1o cho To\xE0n Khoa",
      icon: Send,
      color: "bg-amber-600 hover:bg-amber-700 text-white",
      badge: "G\u1EEDi ngay",
      onClick: onSendNotification
    },
    {
      id: "view-archive",
      title: "Xem kho l\u01B0u tr\u1EEF",
      subtitle: "Tra c\u1EE9u d\u1EEF li\u1EC7u c\xE1c kh\xF3a c\u0169",
      icon: Archive,
      color: "bg-slate-800 hover:bg-slate-900 text-white",
      badge: "Khoa CNTT",
      onClick: onViewArchive
    }
  ];
  return <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Thao tác nhanh (Quick Actions)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Các lối tóm tắt vận hành hệ thống dành cho Trưởng Khoa & Ban Quản Lý
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((act) => {
    const Icon = act.icon;
    return <button
      key={act.id}
      onClick={act.onClick}
      className={`p-4 rounded-2xl transition-all duration-200 text-left shadow-xs hover:shadow-md active:scale-95 flex flex-col justify-between space-y-3 relative group overflow-hidden ${act.color}`}
    >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] bg-white/20 text-white font-extrabold px-2 py-0.5 rounded-md">
                  {act.badge}
                </span>
              </div>

              <div>
                <p className="font-black text-xs text-white leading-tight">{act.title}</p>
                <p className="text-[10px] text-white/80 font-medium mt-1 line-clamp-1">{act.subtitle}</p>
              </div>

              <div className="flex items-center justify-end text-white/90 group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>;
  })}
      </div>
    </div>;
};
