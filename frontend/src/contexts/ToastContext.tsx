import { createContext, useState, useCallback, ReactNode } from "react";

export type ToastType = "success" | "warning" | "danger" | "info";

export interface ToastContextType {
  message: string | null;
  type?: ToastType;
  showToast: (msg: string, type?: ToastType) => void;
  clearToast: () => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<ToastType | undefined>(undefined);

  const showToast = useCallback((msg: string, toastType?: ToastType) => {
    setMessage(msg);
    setType(toastType);
  }, []);

  const clearToast = useCallback(() => {
    setMessage(null);
    setType(undefined);
  }, []);

  return (
    <ToastContext.Provider value={{ message, type, showToast, clearToast }}>
      {children}
    </ToastContext.Provider>
  );
}
