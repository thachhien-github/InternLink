import { Calendar, Check } from 'lucide-react';
export const TimelineStepper = ({
  currentTerm = "H\u1ECDc k\u1EF3 I - 2026",
  onStepClick
}) => {
  const steps = [
    { number: 1, title: "\u0110\u0103ng k\xFD", status: "completed" },
    { number: 2, title: "Ph\xEA duy\u1EC7t DN", status: "completed" },
    { number: 3, title: "B\xE1o c\xE1o tu\u1EA7n", status: "completed" },
    { number: 4, title: "\u0110\xE1nh gi\xE1 GK", status: "current" },
    { number: 5, title: "N\u1ED9p b\xE1o c\xE1o", status: "upcoming" },
    { number: 6, title: "Ch\u1EA5m \u0111i\u1EC3m", status: "upcoming" },
    { number: 7, title: "Ho\xE0n th\xE0nh", status: "upcoming" }
  ];
  return <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs">
      {
    /* Card Header */
  }
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm md:text-base">
            Tiến trình đợt thực tập
          </h3>
        </div>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          {currentTerm}
        </span>
      </div>

      {
    /* Stepper Bar */
  }
      <div className="relative px-4">
        {
    /* Connection Line */
  }
        <div className="absolute top-4 left-10 right-10 h-0.5 bg-slate-200 -z-0">
          <div className="h-full bg-blue-600 w-1/2 transition-all duration-500" />
        </div>

        {
    /* Steps */
  }
        <div className="flex items-center justify-between relative z-10">
          {steps.map((step) => {
    const isCompleted = step.status === "completed";
    const isCurrent = step.status === "current";
    return <div
      key={step.number}
      onClick={() => onStepClick?.(step.number)}
      className="flex flex-col items-center group cursor-pointer"
    >
                {
      /* Circle Icon */
    }
                <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${isCompleted || isCurrent ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-400 border border-slate-200"} ${isCurrent ? "ring-4 ring-blue-100 scale-110" : ""}`}
    >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.number}
                </div>

                {
      /* Step Title */
    }
                <span
      className={`mt-2 text-xs font-semibold text-center transition-colors ${isCurrent ? "text-blue-700 font-bold" : isCompleted ? "text-slate-800" : "text-slate-400"}`}
    >
                  {step.title}
                </span>
              </div>;
  })}
        </div>
      </div>
    </div>;
};
