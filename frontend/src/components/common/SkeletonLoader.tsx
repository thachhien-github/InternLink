import React from "react";

export const SkeletonBox: React.FC<{
  className?: string;
  animate?: boolean;
}> = ({ className = "h-4 w-full", animate = true }) => {
  return (
    <div
      className={`bg-slate-200/70 rounded-md ${animate ? "animate-pulse" : ""} ${className}`}
    />
  );
};

export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}> = ({ rows = 5, columns = 5, showHeader = true }) => {
  return (
    <div className="w-full border border-slate-200/80 rounded-lg overflow-hidden bg-white shadow-2xs">
      {showHeader && (
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <SkeletonBox className="h-5 w-48" />
          <SkeletonBox className="h-8 w-32 rounded-lg" />
        </div>
      )}

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="py-3 px-4">
                  <SkeletonBox className="h-3.5 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: rows }).map((_, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/50">
                {Array.from({ length: columns }).map((_, cIdx) => (
                  <td key={cIdx} className="py-3.5 px-4">
                    {cIdx === 0 ? (
                      <div className="flex items-center gap-3">
                        <SkeletonBox className="w-8 h-8 rounded-full shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <SkeletonBox className="h-3.5 w-32" />
                          <SkeletonBox className="h-2.5 w-20" />
                        </div>
                      </div>
                    ) : cIdx === columns - 1 ? (
                      <div className="flex justify-end gap-2">
                        <SkeletonBox className="w-7 h-7 rounded-md" />
                        <SkeletonBox className="w-7 h-7 rounded-md" />
                      </div>
                    ) : (
                      <SkeletonBox
                        className={`h-3 ${cIdx % 2 === 0 ? "w-24" : "w-16"}`}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3.5 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <SkeletonBox className="w-9 h-9 rounded-lg" />
            <SkeletonBox className="w-16 h-5 rounded-full" />
          </div>
          <SkeletonBox className="h-4 w-3/4" />
          <SkeletonBox className="h-3 w-1/2" />
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <SkeletonBox className="h-3 w-20" />
            <SkeletonBox className="h-3 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const MetricSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 bg-white rounded-lg border border-slate-200/80 shadow-2xs space-y-2 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <SkeletonBox className="h-3 w-24" />
            <SkeletonBox className="w-6 h-6 rounded-md" />
          </div>
          <SkeletonBox className="h-6 w-16" />
          <SkeletonBox className="h-2.5 w-32" />
        </div>
      ))}
    </div>
  );
};
