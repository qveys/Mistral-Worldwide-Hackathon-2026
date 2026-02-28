'use client';

import React from 'react';

export function ActivityInsights({ insights }: { insights: string[] }) {
  return (
    <div className="bg-[#161618] border border-zinc-800/50 rounded-[2rem] p-8 space-y-6">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Live Insights</h3>
      <div className="space-y-4">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-violet-500 flex-shrink-0" />
            <p className="text-[11px] text-zinc-400 leading-relaxed italic font-medium">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
