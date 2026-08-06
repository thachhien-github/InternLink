import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderAction {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  ariaLabel?: string;
}

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  actions?: PageHeaderAction[];
  children?: ReactNode;
}

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200',
  actions = [],
  children
}: PageHeaderProps) {
  const getButtonClasses = (variant: string = 'secondary') => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs hover:shadow-md';
      case 'ghost':
        return 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80';
      case 'secondary':
      default:
        return 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/80';
    }
  };

  return (
    <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 il-animate-in">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2.5 bg-blue-100/80 text-blue-700 rounded-xl border border-blue-200/40 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            {badge && (
              <span className={`px-2.5 py-0.5 font-extrabold text-[10px] rounded-full border ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {(actions.length > 0 || children) && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {actions.map((action, idx) => {
            const ActionIcon = action.icon;
            return (
              <button
                key={idx}
                onClick={action.onClick}
                aria-label={action.ariaLabel || action.label}
                className={`il-btn-press px-3.5 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${getButtonClasses(action.variant)}`}
              >
                {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
                <span>{action.label}</span>
              </button>
            );
          })}
          {children}
        </div>
      )}
    </div>
  );
}
