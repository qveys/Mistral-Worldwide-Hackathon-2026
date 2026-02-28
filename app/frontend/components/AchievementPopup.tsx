"use client";

import { useEffect, useRef } from "react";
import type { Achievement } from "@/hooks/useGamification";

interface AchievementPopupProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementPopup({ achievement, onDismiss }: AchievementPopupProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Dynamic import of canvas-confetti
    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#8b5cf6", "#22c55e", "#f59e0b"],
      });
    }).catch(() => { /* confetti not critical */ });

    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <canvas ref={canvasRef} className="fixed inset-0" />
      <div
        className="pointer-events-auto animate-bounce rounded-2xl border border-primary bg-card px-8 py-6 shadow-2xl shadow-primary/20"
        role="alert"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-5xl">{achievement.icon}</span>
          <h3 className="text-lg font-bold text-card-foreground">
            {achievement.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  );
}
