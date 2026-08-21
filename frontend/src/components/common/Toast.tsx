import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import type { ToastType } from "../../contexts/ToastContext";

interface ToastItem {
  id: string;
  message: string;
  type?: ToastType | string;
}

interface SingleToastCardProps {
  item: ToastItem;
  index: number;
  onDismiss: (id: string) => void;
}

type ResolvedToastType = "primary" | "success" | "warning" | "danger";

function normalizeToastType(raw?: string): ResolvedToastType | undefined {
  if (!raw) return undefined;
  const lower = raw.toLowerCase().trim();
  if (lower === "danger" || lower === "error" || lower === "destructive") return "danger";
  if (lower === "warning" || lower === "warn") return "warning";
  if (lower === "primary" || lower === "info") return "primary";
  if (lower === "success" || lower === "ok") return "success";
  return undefined;
}

function detectToastType(message: string, explicitType?: string): ResolvedToastType {
  const normalized = normalizeToastType(explicitType);
  if (normalized) return normalized;

  const lower = message.toLowerCase();
  if (
    lower.includes("lỗi") ||
    lower.includes("thất bại") ||
    lower.includes("hủy") ||
    lower.includes("xóa") ||
    lower.includes("không thành công") ||
    lower.includes("từ chối") ||
    lower.includes("khóa") ||
    lower.includes("error") ||
    lower.includes("fail") ||
    lower.includes("danger")
  ) {
    return "danger";
  }

  if (
    lower.includes("cảnh báo") ||
    lower.includes("nhắc") ||
    lower.includes("yêu cầu") ||
    lower.includes("chờ") ||
    lower.includes("quá hạn") ||
    lower.includes("thiếu") ||
    lower.includes("chú ý") ||
    lower.includes("lưu ý") ||
    lower.includes("warning")
  ) {
    return "warning";
  }

  if (
    lower.includes("đang") ||
    lower.includes("mở") ||
    lower.includes("sao chép") ||
    lower.includes("xem") ||
    lower.includes("liên kết") ||
    lower.includes("hướng dẫn") ||
    lower.includes("thông tin") ||
    lower.includes("chuyển") ||
    lower.includes("info") ||
    lower.includes("primary")
  ) {
    return "primary";
  }

  return "success";
}

interface ToastConfig {
  title: string;
  badgeText: string;
  barBg: string;
  titleColor: string;
  iconBg: string;
  Icon: LucideIcon;
  borderColor: string;
  glowColor: string;
  badgeBg: string;
}

const TOAST_CONFIGS: Record<ResolvedToastType, ToastConfig> = {
  primary: {
    title: "Thông báo",
    badgeText: "PRIMARY",
    barBg: "bg-blue-600",
    titleColor: "text-blue-700",
    iconBg: "bg-blue-50 text-blue-600 border border-blue-200/80 shadow-xs",
    Icon: Info,
    borderColor: "border-blue-200/90 shadow-blue-500/10",
    glowColor: "bg-blue-500/10",
    badgeBg: "bg-blue-100/70 text-blue-700",
  },
  success: {
    title: "Thành công",
    badgeText: "SUCCESS",
    barBg: "bg-emerald-500",
    titleColor: "text-emerald-700",
    iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-xs",
    Icon: CheckCircle2,
    borderColor: "border-emerald-200/90 shadow-emerald-500/10",
    glowColor: "bg-emerald-500/10",
    badgeBg: "bg-emerald-100/70 text-emerald-700",
  },
  warning: {
    title: "Cảnh báo",
    badgeText: "WARNING",
    barBg: "bg-amber-500",
    titleColor: "text-amber-700",
    iconBg: "bg-amber-50 text-amber-600 border border-amber-200/80 shadow-xs",
    Icon: AlertTriangle,
    borderColor: "border-amber-200/90 shadow-amber-500/10",
    glowColor: "bg-amber-500/10",
    badgeBg: "bg-amber-100/70 text-amber-800",
  },
  danger: {
    title: "Lỗi xử lý",
    badgeText: "DANGER",
    barBg: "bg-rose-500",
    titleColor: "text-rose-700",
    iconBg: "bg-rose-50 text-rose-600 border border-rose-200/80 shadow-xs",
    Icon: AlertCircle,
    borderColor: "border-rose-200/90 shadow-rose-500/10",
    glowColor: "bg-rose-500/10",
    badgeBg: "bg-rose-100/70 text-rose-700",
  },
};

const SingleToastCard = ({ item, index, onDismiss }: SingleToastCardProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(item.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);

  const toastType = detectToastType(item.message, item.type);
  const config = TOAST_CONFIGS[toastType];
  const IconComponent = config.Icon;
  const opacityLevel = Math.max(0.7, 1 - index * 0.12);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: opacityLevel, x: 0, scale: 1 - index * 0.02 }}
      exit={{
        opacity: 0,
        x: 70,
        scale: 0.95,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
      className="pointer-events-auto w-full"
    >
      <div
        className={`bg-white rounded-xl p-3.5 shadow-lg ${config.borderColor} border flex items-stretch gap-3 relative overflow-hidden transition-all duration-200`}
      >
        {/* State Accent Left Bar */}
        <div className={`w-1.5 rounded-full ${config.barBg} shrink-0 my-0.5`} />

        {/* Content Body */}
        <div className="flex-1 pr-6 py-0.5 space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4
              className={`text-xs font-bold tracking-tight uppercase ${config.titleColor}`}
            >
              {config.title}
            </h4>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${config.badgeBg}`}
            >
              {config.badgeText}
            </span>
          </div>
          <p className="text-xs font-medium text-slate-700 leading-snug break-words">
            {item.message}
          </p>
        </div>

        {/* State Icon */}
        <div
          className={`w-9 h-9 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0 self-center`}
        >
          <IconComponent className="w-4 h-4" />
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => onDismiss(item.id)}
          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors"
          title="Đóng thông báo"
          aria-label="Đóng"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

interface ToastProps {
  message: string | null;
  onClose: () => void;
  type?: ToastType | string;
}

export const Toast = ({ message, onClose, type }: ToastProps) => {
  const [toastList, setToastList] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (!message) return;
    const newId = Date.now().toString() + Math.random().toString().slice(2, 6);
    const newItem: ToastItem = { id: newId, message, type };
    setToastList((prev) => [newItem, ...prev.slice(0, 4)]);
    onClose();
  }, [message, type, onClose]);

  const handleDismiss = (id: string) => {
    setToastList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="fixed top-14 right-6 z-50 flex flex-col items-end space-y-2.5 pointer-events-none max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toastList.map((item, index) => (
          <SingleToastCard
            key={item.id}
            item={item}
            index={index}
            onDismiss={handleDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
