import {
  Database,
  HardDrive,
  Users,
  Cpu,
  CloudCheck,
  Activity
} from 'lucide-react';
export const SystemStatusCard = () => {
  const systemMetrics = [
    {
      id: "db",
      label: "C\u01A1 s\u1EDF d\u1EEF li\u1EC7u (Database)",
      value: "PostgreSQL 15 \u2022 12ms",
      status: "Ho\u1EA1t \u0111\u1ED9ng t\u1ED1t",
      icon: Database,
      isGood: true
    },
    {
      id: "storage",
      label: "Dung l\u01B0\u1EE3ng l\u01B0u tr\u1EEF (Storage)",
      value: "128 GB / 500 GB (25.6%)",
      status: "An to\xE0n",
      icon: HardDrive,
      isGood: true
    },
    {
      id: "users",
      label: "Ng\u01B0\u1EDDi d\xF9ng tr\u1EF1c tuy\u1EBFn",
      value: "342 \u0111ang truy c\u1EADp",
      status: "B\xECnh th\u01B0\u1EDDng",
      icon: Users,
      isGood: true
    },
    {
      id: "version",
      label: "Phi\xEAn b\u1EA3n h\u1EC7 th\u1ED1ng",
      value: "v2.4.0-enterprise",
      status: "\u0110\xE3 c\u1EADp nh\u1EADt",
      icon: Cpu,
      isGood: true
    },
    {
      id: "backup",
      label: "Sao l\u01B0u m\u1EDBi nh\u1EA5t (Backup)",
      value: "02:00 H\xF4m nay (T\u1EF1 \u0111\u1ED9ng)",
      status: "\u0110\xE3 l\u01B0u tr\u1EEF",
      icon: CloudCheck,
      isGood: true
    },
    {
      id: "server",
      label: "M\xE1y ch\u1EE7 Cloud Run",
      value: "Uptime 99.98%",
      status: "S\u1EB5n s\xE0ng 100%",
      icon: Activity,
      isGood: true
    }
  ];
  return <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Trạng thái Hệ thống (System Health)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Giám sát hạ tầng Cloud Run, CSDL PostgreSQL và dung lượng
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-lg border border-emerald-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Toàn bộ 6/6 dịch vụ OK</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {systemMetrics.map((item) => {
    const Icon = item.icon;
    return <div key={item.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4 text-emerald-600" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
              </div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider truncate" title={item.label}>
                {item.label}
              </p>
              <p className="font-extrabold text-slate-800 text-xs truncate" title={item.value}>
                {item.value}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold block">{item.status}</span>
            </div>;
  })}
      </div>
    </div>;
};
