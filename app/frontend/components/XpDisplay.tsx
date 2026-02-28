"use client";

interface XpDisplayProps {
  xp: number;
  level: number;
  streak: number;
}

export function XpDisplay({ xp, level, streak }: XpDisplayProps) {
  const xpInLevel = xp % 100;

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5">
        <span className="text-primary font-bold">Lv.{level}</span>
        <div className="h-2 w-20 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${xpInLevel}%` }}
          />
        </div>
        <span className="text-muted-foreground">{xp} XP</span>
      </div>
      {streak > 0 && (
        <div className="flex items-center gap-1">
          <span className="text-warning">🔥</span>
          <span className="font-medium text-foreground">{streak}j</span>
        </div>
      )}
    </div>
  );
}
