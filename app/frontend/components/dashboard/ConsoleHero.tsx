'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Activity, Mic, Command } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';
import { cn } from '@/lib/utils';

export function ConsoleHero() {
  const { isDarkMode } = useDashboardTheme();
  const t = useTranslations('dashboard');

  return (
    <div className={cn(
      "col-span-12 lg:col-span-8 row-span-2 rounded-[2rem] p-10 flex flex-col justify-between relative overflow-hidden group",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
    )}>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#536dfe]/10 border border-[#536dfe]/20 text-[#536dfe] text-[10px] font-black uppercase tracking-widest w-fit">
          <Activity size={12} className="animate-pulse" />
          {t('neuralSync')}
        </div>
        <h2 className={cn(
          "text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1]",
          isDarkMode ? "text-white" : "text-slate-900"
        )}>
          {t.rich('designRoadmap', {
            br: () => <br />,
            spanStyle: (chunks) => (
              <span
                className={cn(
                  'italic font-serif',
                  isDarkMode ? 'text-zinc-500' : 'text-slate-600'
                )}
              >
                {chunks}
              </span>
            ),
          })}
        </h2>
      </div>
      <div className="relative z-10 flex items-center gap-4">
        <Link href="/dashboard/roadmaps/new">
          <Button className={cn(
            "h-14 px-8 rounded-full font-bold transition-all group/btn",
            isDarkMode ? "bg-zinc-100 text-black hover:bg-white shadow-2xl shadow-white/5" : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
          )}>
            <Mic size={18} className="mr-2 group-hover/btn:scale-110 transition-transform" />
            {t('newBrainDump')}
          </Button>
        </Link>
      </div>
      <Command size={320} className={cn(
        "absolute -right-16 -bottom-16 rotate-12 group-hover:rotate-0 transition-transform duration-1000",
        isDarkMode ? "text-white/5" : "text-slate-300"
      )} />
    </div>
  );
}
