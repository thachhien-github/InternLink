import {
  BarChart3,
  AlertCircle,
  UserPlus
} from 'lucide-react';
export const WorkloadOverviewCard = ({ onAssignClick }) => {
  const workloadStats = {
    totalStudents: 1280,
    assignedStudents: 1268,
    unassignedStudents: 12,
    totalLecturers: 42,
    activeLecturers: 38,
    unassignedLecturers: 3,
    avgRatio: 30.2,
    // students per lecturer
    maxCapacityRatio: 35,
    // max recommended
    availableCapacity: 150,
    // student capacity remaining across all lecturers
    workloadBreakdown: [
      { category: "\u0110\u1EA1t \u0111\u1ECBnh m\u1EE9c (25-30 SV)", count: 24, percent: 57.1, color: "bg-emerald-500" },
      { category: "T\u1EA3i cao / C\u1EADn t\u1ED1i \u0111a (31-35 SV)", count: 12, percent: 28.6, color: "bg-amber-500" },
      { category: "Qu\xE1 t\u1EA3i (>35 SV)", count: 2, percent: 4.8, color: "bg-rose-500" },
      { category: "Th\u1EA5p / D\u01B0\u1EDBi \u0111\u1ECBnh m\u1EE9c (<20 SV)", count: 4, percent: 9.5, color: "bg-blue-500" }
    ]
  };
  return <div className="bg-white rounded-2xl border border-slate-200/80 border-l-4 border-l-indigo-600 p-5 shadow-xs space-y-5">
      {
    /* Card Header */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Phân bổ Tải công việc (Workload Overview)
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Giám sát tỷ lệ Sinh viên / Giảng viên, phân công hướng dẫn và công suất tiếp nhận
            </p>
          </div>
        </div>

        {onAssignClick && <button
    onClick={onAssignClick}
    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
  >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Phân công hướng dẫn</span>
          </button>}
      </div>

      {
    /* 4 Metric Summary Blocks */
  }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50/60 rounded-2xl border border-slate-100 text-xs">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tỷ lệ TB Sinh viên / Giảng viên</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">{workloadStats.avgRatio}</span>
            <span className="text-[11px] font-bold text-slate-500">Sinh viên / Giảng viên</span>
          </div>
          <p className="text-[10px] text-indigo-600 font-extrabold">Định mức đề xuất: ≤ {workloadStats.maxCapacityRatio} Sinh viên / Giảng viên</p>
        </div>

        <div className="space-y-1 sm:border-l sm:border-slate-200/60 sm:pl-4">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Đã phân công hướng dẫn</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-blue-900">{workloadStats.assignedStudents}</span>
            <span className="text-[11px] font-bold text-slate-500">/ {workloadStats.totalStudents} sinh viên</span>
          </div>
          <p className="text-[10px] text-blue-600 font-bold">Đạt 99.1% tổng số sinh viên</p>
        </div>

        <div className="space-y-1 sm:border-l sm:border-slate-200/60 sm:pl-4">
          <p className="text-[10px] font-bold uppercase text-rose-500 font-extrabold tracking-wider">Chưa phân công</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-rose-600">{workloadStats.unassignedStudents}</span>
            <span className="text-[11px] font-bold text-rose-500">sinh viên</span>
          </div>
          <p className="text-[10px] text-rose-600 font-extrabold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Cần ghép vào Giảng viên khả dụng
          </p>
        </div>

        <div className="space-y-1 sm:border-l sm:border-slate-200/60 sm:pl-4">
          <p className="text-[10px] font-bold uppercase text-emerald-600 font-extrabold tracking-wider">Sức chứa còn lại (Capacity)</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-emerald-700">+{workloadStats.availableCapacity}</span>
            <span className="text-[11px] font-bold text-emerald-600">sinh viên</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold">38 Giảng viên còn công suất tiếp nhận</p>
        </div>
      </div>

      {
    /* Visual Workload Distribution Bar */
  }
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
          <span>Phân bố Định mức Tải của Giảng viên (42 Giảng viên)</span>
          <span className="text-slate-500 text-[11px]">2 Giảng viên quá tải • 4 Giảng viên dưới tải</span>
        </div>

        {
    /* Stacked bar visual */
  }
        <div className="w-full bg-slate-100 h-4 rounded-xl flex overflow-hidden p-0.5 border border-slate-200">
          {workloadStats.workloadBreakdown.map((item, idx) => <div
    key={idx}
    style={{ width: `${item.percent}%` }}
    className={`${item.color} h-full transition-all hover:opacity-90 relative group cursor-pointer first:rounded-l-lg last:rounded-r-lg`}
    title={`${item.category}: ${item.count} Gi\u1EA3ng vi\xEAn (${item.percent}%)`}
  />)}
        </div>

        {
    /* Legend */
  }
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] px-1">
          {workloadStats.workloadBreakdown.map((item, idx) => <div key={idx} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
              <span className="font-bold text-slate-700">{item.category}:</span>
              <span className="text-slate-500 font-medium">{item.count} Giảng viên ({item.percent}%)</span>
            </div>)}
        </div>
      </div>
    </div>;
};
