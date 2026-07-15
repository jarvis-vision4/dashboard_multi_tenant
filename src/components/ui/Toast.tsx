'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success:
    'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100',
  error:
    'border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-100',
  warning:
    'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-100',
  info: 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-100',
};

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={cn(
                'animate-in slide-in-from-right flex min-w-[300px] items-center gap-3 rounded-lg border-l-4 px-4 py-3 shadow-md',
                colors[t.type]
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <p className="flex-1 text-sm font-medium">{t.message}</p>
              <button
                onClick={() =>
                  setToasts((prev) => prev.filter((x) => x.id !== t.id))
                }
                className="shrink-0 rounded-md p-1 hover:opacity-70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export { ToastProvider, useToast };
