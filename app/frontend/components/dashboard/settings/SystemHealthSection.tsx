'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Activity, ShieldCheck, Database, Server } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export function SystemHealthSection() {
  const t = useTranslations('settings');
  const lastHealthCheckTime = React.useMemo(() => new Date().toLocaleTimeString(), []);
  const systems = [
    { labelKey: 'neuralEngine' as const, statusKey: 'stable' as const, icon: Server, color: 'text-emerald-500' },
    { labelKey: 'primaryDb' as const, statusKey: 'optimal' as const, icon: Database, color: 'text-blue-500' },
    { labelKey: 'securityUnit' as const, statusKey: 'active' as const, icon: ShieldCheck, color: 'text-violet-500' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700/50 rounded-[2.5rem] p-8 lg:p-10 space-y-8 h-full flex flex-col">
      <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-6">
        <Activity size={18} className="text-emerald-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">{t('systemIntegrity')}</h3>
      </div>

      <div className="flex-1 space-y-6">
        {systems.map((sys, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
            <div className="flex items-center gap-4">
              <div className={cn("p-2 rounded-lg bg-zinc-800", sys.color)}>
                <sys.icon size={16} />
              </div>
              <span className="text-xs font-bold text-zinc-300">{t(sys.labelKey)}</span>
            </div>
            <Badge className="bg-zinc-800 text-zinc-500 border-none text-[8px] uppercase tracking-widest px-3">{t(sys.statusKey)}</Badge>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-zinc-800/50">
        <p className="text-[10px] text-zinc-600 font-mono italic">
          {t('lastHealthCheck', { time: lastHealthCheckTime })}
        </p>
      </div>
    </div>
  );
}
