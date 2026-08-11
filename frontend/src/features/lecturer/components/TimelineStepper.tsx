import { Calendar, Check } from 'lucide-react';

export const TimelineStepper = ({
  currentTerm = "Học kỳ I - 2026",
  onStepClick
}: {
  currentTerm?: string;
  onStepClick?: (stepNumber: number) => void;
}) => {
  const steps = [
    { number: 1, title: "Đăng ký", status: "completed" },
    { number: 2, title: "Phê duyệt DN", status: "completed" },
    { number: 3, title: "Báo cáo tuần", status: "completed" },
    { number: 4, title: "Đánh giá GK", status: "current" },
    { number: 5, title: "Nộp báo cáo", status: "upcoming" },
    { number: 6, title: "Chấm điểm", status: "upcoming" },
    { number: 7, title: "Hoàn thành", status: "upcoming" }
  ];

  return (
    <div className="il-bento-card p-5 md:p-6">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/80">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm md:text-base font-display">
              Tiến trình đợt thực tập
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Theo dõi các mốc thời gian quy định</p>
          </div>
        </div>
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full font-display">
          {currentTerm}
        </span>
      </div>

      {/* Stepper Bar */}
      <div className="relative px-3 pt-1 pb-2">
        {/* Connection Line */}
        <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 rounded-full -z-0">
          <div className="h-full bg-gradient-to-r from-indigo-600 to-blue-600 w-[55%] rounded-full shadow-xs" />
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between relative z-10">
          {steps.map((step) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            return (
              <div
                key={step.number}
                onClick={() => onStepClick?.(step.number)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : isCurrent
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white ring-4 ring-indigo-100 scale-110 shadow-lg shadow-indigo-500/30"
                      : "bg-slate-50 text-slate-400 border border-slate-200"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="il-kpi-val">{step.number}</span>}
                </div>

                <span
                  className={`mt-2 text-xs font-semibold text-center transition-colors ${
                    isCurrent ? "text-indigo-600 font-bold" : isCompleted ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
