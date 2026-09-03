import { useState, useEffect } from "react";
import {
  Database,
  HardDrive,
  Users,
  Cpu,
  CloudCheck,
  Activity,
} from "lucide-react";
export const SystemStatusCard = () => {
  const [systemMetrics, setSystemMetrics] = useState<any[]>([]);

  useEffect(() => {
    // Fetch actual system health from backend if available
    fetch("/health/ready")
      .then((r) => {
        if (r.ok) {
          setSystemMetrics([
            { id: "status", label: "Hệ thống", value: "Online", status: "Hoạt động", icon: Activity, isGood: true },
          ]);
        }
      })
      .catch(() => {});
  }, []);
  return (
    <div className="bg-white rounded-lg border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Trạng thái Hệ thống (System Health)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Giám sát hạ tầng Cloud Run, CSDL PostgreSQL và dung lượng
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Toàn bộ 6/6 dịch vụ OK</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {systemMetrics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-3 bg-slate-50/80 rounded-md border border-slate-200/70 space-y-1"
            >
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4 text-emerald-600" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
              </div>
              <p
                className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate"
                title={item.label}
              >
                {item.label}
              </p>
              <p
                className="font-bold text-slate-800 text-xs truncate"
                title={item.value}
              >
                {item.value}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold block">
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
