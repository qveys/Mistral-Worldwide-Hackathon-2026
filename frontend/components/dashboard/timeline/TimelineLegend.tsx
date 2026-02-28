'use client';

import React from 'react';
import { Target, Zap, Clock, AlertCircle } from 'lucide-react';

export function TimelineLegend() {
  return (
    <div className="bg-[#161618] border border-zinc-800/50 rounded-[2rem] p-8 space-y-8">
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Critical Path</h3>
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <AlertCircle size={14} className="text-amber-500" />
            <span className="text-xs font-bold text-white uppercase tracking-tight">Latency Risk</span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed italic">
            &quot;Data Schema completion is required before Auth Logic can initialize. Current delay: 2 days.&quot;
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Resource Allocation</h3>
        <div className="space-y-3">
          {[
            { label: 'Compute Unit', val: '84%', icon: Zap, color: 'text-amber-500' },
            { label: 'Map Integrity', val: '100%', icon: Target, color: 'text-emerald-500' },
            { label: 'Timeline Sync', val: '12%', icon: Clock, color: 'text-violet-500' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <item.icon size={14} className={item.color} />
                <span className="text-[11px] font-medium text-zinc-400">{item.label}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 group-hover:text-white transition-colors">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
