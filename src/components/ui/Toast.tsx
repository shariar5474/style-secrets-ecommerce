'use client';

import * as React from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

let globalAddToast: ((toast: Omit<ToastItem, 'id'>) => void) | null = null;

export function toast(toastData: Omit<ToastItem, 'id'>) {
  if (globalAddToast) {
    globalAddToast(toastData);
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = React.useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  React.useEffect(() => {
    globalAddToast = addToast;
    return () => {
      globalAddToast = null;
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-4">
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-sm transition-all animate-in slide-in-from-bottom-5 duration-200',
              item.type === 'success' && 'bg-white border-green-200 text-green-900',
              item.type === 'error' && 'bg-white border-red-200 text-red-900',
              item.type === 'warning' && 'bg-white border-amber-200 text-amber-900',
              item.type === 'info' && 'bg-white border-brand-pink/30 text-brand-charcoal'
            )}
          >
            <div className="shrink-0 mt-0.5">
              {item.type === 'success' && (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              )}
              {item.type === 'error' && (
                <XCircle className="h-5 w-5 text-rose-600" />
              )}
              {item.type === 'warning' && (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
              {item.type === 'info' && (
                <Info className="h-5 w-5 text-brand-pink" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-semibold text-xs uppercase tracking-wide">
                {item.title}
              </h5>
              {item.message && (
                <p className="text-xs text-gray-600 mt-0.5 break-words">
                  {item.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors p-0.5 rounded"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    return {
      toasts: [],
      addToast: toast,
      removeToast: () => {},
      toast,
    };
  }
  return context;
}

export default ToastProvider;
