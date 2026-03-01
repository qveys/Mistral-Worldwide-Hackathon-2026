'use client';

import React from 'react';
import { Share2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

interface CollaborationHubProps {
  className?: string;
}

export function CollaborationHub({ className }: CollaborationHubProps) {
  const { isDarkMode } = useDashboardTheme();

  return (
    <div className={cn(
      "bg-gradient-to-r from-violet-600/10 to-indigo-900/5 border border-violet-500/20 rounded-[2rem] px-10 py-6 flex items-center justify-between group overflow-hidden",
      isDarkMode ? "via-[#161618]" : "via-white",
      className
    )}>
      <div className="flex items-center gap-10 relative z-10">
        <div className="h-12 w-12 bg-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
          <Share2 size={24} />
        </div>
        <div className="space-y-1">
          <h4 className={cn("text-sm font-bold tracking-tight uppercase tracking-[0.1em]", isDarkMode ? "text-white" : "text-slate-900")}>Collaboration Hub</h4>
          <p className={cn("text-[11px] font-medium", isDarkMode ? "text-zinc-500" : "text-slate-600")}>Invite your engineering team to sync neural contexts in real-time.</p>
        </div>
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <button className={cn(
          "h-10 px-5 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-widest",
          isDarkMode ? "border-zinc-800 text-zinc-500 hover:text-white" : "border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400"
        )}>
          Copy Shared Link
        </button>
        <Button className="h-10 px-8 bg-violet-600 text-white hover:bg-violet-700 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-violet-600/20 active:scale-95 transition-all">
          Invite Team
        </Button>
      </div>
      <Globe size={160} className={cn(
        "absolute -right-8 -bottom-16 group-hover:rotate-45 transition-transform duration-[2000ms]",
        isDarkMode ? "text-white/5" : "text-slate-300"
      )} />
    </div>
  );
}
