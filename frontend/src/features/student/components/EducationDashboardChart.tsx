import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const chartData = [
  { period: 'Tuần 1', completed: 40, expected: 50 },
  { period: 'Tuần 2', completed: 52, expected: 59 },
  { period: 'Tuần 3', completed: 60, expected: 64 },
  { period: 'Tuần 4', completed: 68, expected: 72 },
  { period: 'Tuần 5', completed: 75, expected: 78 },
  { period: 'Tuần 6', completed: 84, expected: 86 },
  { period: 'Tuần 7', completed: 91, expected: 92 },
  { period: 'Tuần 8', completed: 98, expected: 95 }
];

export const EducationDashboardChart = () => {
  return (
    <div className="bg-white border border-slate-200/80 shadow-xs rounded-[10px] p-5 h-full">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Xu hướng tiến độ thực tập</h3>
          <p className="text-sm text-slate-500 mt-1">So sánh tiến trình hiện tại với mục tiêu chương trình học.</p>
        </div>
        <div className="inline-flex items-center rounded-[6px] border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
          8 tuần gần nhất
        </div>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.16} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} width={36} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)' }} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
            <Area type="monotone" dataKey="completed" stroke="#2563EB" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={3} activeDot={{ r: 6 }} />
            <Area type="monotone" dataKey="expected" stroke="#059669" fillOpacity={1} fill="url(#colorExpected)" strokeWidth={3} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
