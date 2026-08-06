import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastItem {
  id: string;
  message: string;
  type?: string;
}

interface SingleToastCardProps {
  item: ToastItem;
  index: number;
  onDismiss: (id: string) => void;
}

function detectToastType(message: string, explicitType?: string): string {
  if (explicitType) return explicitType;
  const lower = message.toLowerCase();
  if (lower.includes('lỗi') || lower.includes('thất bại') || lower.includes('hủy') || lower.includes('xóa')) {
    return 'danger';
  }
  if (lower.includes('cảnh báo') || lower.includes('nhắc') || lower.includes('yêu cầu') || lower.includes('chờ') || lower.includes('quá hạn') || lower.includes('thiếu')) {
    return 'warning';
  }
  if (lower.includes('đang') || lower.includes('mở') || lower.includes('sao chép') || lower.includes('xem') || lower.includes('liên kết') || lower.includes('hướng dẫn')) {
    return 'info';
  }
  return 'success';
}

const SingleToastCard = ({ item, index, onDismiss }: SingleToastCardProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(item.id);
    }, 2000);
    return () => clearTimeout(timer);
  }, [item.id, onDismiss]);

  const toastType = detectToastType(item.message, item.type);
  const configs: Record<string, { title: string; barBg: string; titleColor: string; iconBg: string; Icon: any; borderColor: string }> = {
    success: { title: 'Success!', barBg: 'bg-emerald-500', titleColor: 'text-emerald-600', iconBg: 'bg-emerald-100 text-emerald-600', Icon: CheckCircle2, borderColor: 'border-slate-200/90' },
    warning: { title: 'Warning!', barBg: 'bg-amber-500', titleColor: 'text-amber-600', iconBg: 'bg-amber-100 text-amber-600', Icon: AlertTriangle, borderColor: 'border-slate-200/90' },
    danger: { title: 'Error!', barBg: 'bg-rose-500', titleColor: 'text-rose-600', iconBg: 'bg-rose-100 text-rose-600', Icon: AlertCircle, borderColor: 'border-slate-200/90' },
    info: { title: 'Information!', barBg: 'bg-blue-500', titleColor: 'text-blue-600', iconBg: 'bg-blue-100 text-blue-600', Icon: Info, borderColor: 'border-slate-200/90' },
  };
  const config = configs[toastType] || configs.success;
  const IconComponent = config.Icon;
  const opacityLevel = Math.max(0.65, 1 - index * 0.15);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: opacityLevel, x: 0, scale: 1 - index * 0.02 }}
      exit={{ opacity: 0, x: 70, scale: 0.95, transition: { duration: 0.35, ease: 'easeOut' } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
      className="pointer-events-auto w-full"
    >
      <div className={`bg-white rounded-2xl p-3.5 shadow-2xl shadow-slate-300/60 border ${config.borderColor} flex items-stretch gap-3 relative overflow-hidden backdrop-blur-xs`}>
        <div className={`w-1.5 rounded-full ${config.barBg} shrink-0 my-0.5`} />
        <div className="flex-1 pr-6 py-0.5 space-y-0.5 min-w-0">
          <h4 className={`text-xs font-black tracking-tight ${config.titleColor}`}>{config.title}</h4>
          <p className="text-xs font-semibold text-slate-700 leading-snug break-words">{item.message}</p>
        </div>
        <div className={`w-8 h-8 rounded-full ${config.iconBg} flex items-center justify-center shrink-0 self-center shadow-xs`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <button
          onClick={() => onDismiss(item.id)}
          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          title="Đóng"
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
  type?: string;
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
    <div className="fixed top-14 right-6 z-50 flex flex-col items-end space-y-3 pointer-events-none max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toastList.map((item, index) => (
          <SingleToastCard key={item.id} item={item} index={index} onDismiss={handleDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};
