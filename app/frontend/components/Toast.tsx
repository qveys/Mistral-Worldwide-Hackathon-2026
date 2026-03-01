"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss: () => void;
}

const TYPE_STYLES: Record<ToastType, string> = {
  success: "border-success bg-success/10 text-success",
  error: "border-destructive bg-destructive/10 text-destructive",
  warning: "border-warning bg-warning/10 text-warning",
  info: "border-primary bg-primary/10 text-primary",
};

export function Toast({ message, type = "info", duration = 3000, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 rounded-lg border px-4 py-3 shadow-lg ${TYPE_STYLES[type]}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onDismiss}
          aria-label="Fermer la notification"
          className="ml-2 text-current opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
