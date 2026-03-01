'use client';

import React from 'react';
import { Activity, ShieldCheck, Database, Server } from 'lucide-react';

export function SystemHealthSection() {
  return (
    <div className="bg-[#161618] border border-zinc-800/50 rounded-[2.5rem] p-8 lg:p-10 space-y-8 h-full flex flex-col">
      <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-6">
        <Activity size={18} className="text-emerald-500" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">System Integrity</h3>
      </div>

      <div className="flex-1 space-y-6">
        {[
          { label: 'Neural Engine', status: 'Stable', icon: Server, color: 'text-emerald-500' },
          { label: 'Primary DB', status: 'Optimal', icon: Database, color: 'text-blue-500' },
          { label: 'Security Unit', status: 'Active', icon: ShieldCheck, color: 'text-violet-500' },
        ].map((sys, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
            <div className="flex items-center gap-4">
              <div className={cn("p-2 rounded-lg bg-zinc-800", sys.color)}>
                <sys.icon size={16} />
              </div>
              <span className="text-xs font-bold text-zinc-300">{sys.label}</span>
            </div>
            <Badge className="bg-zinc-800 text-zinc-500 border-none text-[8px] uppercase tracking-widest px-3">{sys.status}</Badge>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-zinc-800/50">
        <p className="text-[10px] text-zinc-600 font-mono italic">
          Last health check: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
