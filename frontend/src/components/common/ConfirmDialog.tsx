import type { ReactNode } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

export type ConfirmDialogVariant = "danger" | "warning" | "primary";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_STYLES: Record<
  ConfirmDialogVariant,
  { icon: typeof Trash2; iconWrap: string; confirmBtn: string }
> = {
  danger: {
    icon: Trash2,
    iconWrap: "bg-rose-50 text-rose-600 border-rose-100",
    confirmBtn: "bg-rose-600 hover:bg-rose-700 text-white",
  },
  warning: {
    icon: AlertTriangle,
    iconWrap: "bg-amber-50 text-amber-600 border-amber-100",
    confirmBtn: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  primary: {
    icon: AlertTriangle,
    iconWrap: "bg-blue-50 text-blue-600 border-blue-100",
    confirmBtn: "bg-[#1d4ed8] hover:bg-blue-700 text-white",
  },
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!open) return null;

  const styles = VARIANT_STYLES[variant];
  const Icon = styles.icon;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 animate-in fade-in">
      <div
        className="bg-white rounded-lg border border-slate-200 shadow-md w-full max-w-md overflow-hidden animate-in zoom-in-95"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-2 rounded-md border shrink-0 ${styles.iconWrap}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <h3
              id="confirm-dialog-title"
              className="text-sm font-bold text-slate-900 truncate"
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="text-xs text-slate-600 leading-relaxed">{description}</div>
        </div>

        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 font-bold text-xs rounded-md"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 disabled:opacity-60 font-bold text-xs rounded-md flex items-center gap-1.5 ${styles.confirmBtn}`}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
