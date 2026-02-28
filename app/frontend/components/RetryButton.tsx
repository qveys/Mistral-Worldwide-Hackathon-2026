"use client";

import { useState } from "react";

interface RetryButtonProps {
  onRetry: () => Promise<void> | void;
  label?: string;
}

export function RetryButton({ onRetry, label = "Reessayer" }: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <button
      onClick={handleRetry}
      disabled={isRetrying}
      aria-label={label}
      className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
    >
      {isRetrying ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Chargement...
        </span>
      ) : (
        label
      )}
    </button>
  );
}
