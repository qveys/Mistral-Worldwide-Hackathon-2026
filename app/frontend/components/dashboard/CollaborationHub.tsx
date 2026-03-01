'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Share2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

interface CollaborationHubProps {
  className?: string;
}

export function CollaborationHub({ className }: CollaborationHubProps) {
  const { isDarkMode } = useDashboardTheme();
  const t = useTranslations('dashboard');

  return (
    <div className={cn(
      "relative bg-gradient-to-r from-[#00b0ff]/10 to-[#536dfe]/5 border border-[#536dfe]/20 rounded-[2rem] px-10 py-6 flex items-center justify-between group overflow-hidden",
      isDarkMode ? "via-[#161618]" : "via-white",
      className
    )}>
      <Globe
        size={240}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none",
          isDarkMode ? "text-white/[0.04]" : "text-slate-400/30"
        )}
      />
      <div className="flex items-center gap-10 relative z-10">
        <div className="h-12 w-12 bg-[#536dfe]/20 rounded-2xl flex items-center justify-center text-[#536dfe] group-hover:scale-110 transition-transform">
          <Share2 size={24} />
        </div>
        <div className="space-y-1">
          <h4 className={cn("text-sm font-bold tracking-tight uppercase tracking-[0.1em]", isDarkMode ? "text-white" : "text-slate-900")}>{t('collaborationHub')}</h4>
          <p className={cn("text-[11px] font-medium", isDarkMode ? "text-zinc-500" : "text-slate-600")}>{t('collaborationDescription')}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <button className={cn(
          "h-10 px-5 rounded-full border transition-all text-[10px] font-bold uppercase tracking-widest",
          isDarkMode ? "border-zinc-800 text-zinc-500 hover:text-white" : "border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400"
        )}>
          {t('copySharedLink')}
        </button>
        <Button className="h-10 px-8 bg-[#536dfe] text-white hover:bg-[#536dfe]/90 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-[#536dfe]/20 active:scale-95 transition-all">
          {t('inviteTeam')}
        </Button>
      </div>
    </div>
  );
}
