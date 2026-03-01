'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'error' | 'warning' | 'success';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const typeConfig = {
  error: {
    icon: AlertCircle,
    color: 'text-red-500',
    bg: 'bg-red-50/90 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-800',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-50/90 dark:bg-amber-900/30',
    border: 'border-amber-200 dark:border-amber-800',
  },
  success: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-50/90 dark:bg-green-900/30',
    border: 'border-green-200 dark:border-green-800',
  },
};

export function Toast({ message, type, isVisible, onClose, duration = 5000, action }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0 && !action) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose, action]);

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 pointer-events-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-full border shadow-2xl backdrop-blur-md transition-all",
              config.bg,
              config.border
            )}
          >
            <div className={cn("flex-shrink-0", config.color)}>
              <Icon size={20} />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 flex-1 leading-tight">
              {message}
            </p>

            {action && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                aria-label={action.label}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all hover:scale-105 active:scale-95 border shrink-0",
                  type === 'error' ? "bg-red-500 text-white border-red-400 hover:bg-red-600" : "bg-slate-900 text-white border-slate-700 hover:bg-black"
                )}
              >
                {action.label}
              </button>
            )}

            <button
              onClick={onClose}
              aria-label="Fermer la notification"
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 dark:text-slate-500 transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
