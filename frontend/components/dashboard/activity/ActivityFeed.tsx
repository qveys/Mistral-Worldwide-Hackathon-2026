'use client';

import React from 'react';
import { 
  GitBranch, 
  MessageSquare, 
  CheckCircle2, 
  Zap, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: 'commit' | 'comment' | 'status' | 'neural';
  msg: string;
  project: string;
  time: string;
  user: string;
}

const icons = {
  commit: { icon: GitBranch, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  comment: { icon: MessageSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  status: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  neural: { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
};

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="bg-[#161618] border border-zinc-800/50 rounded-[2.5rem] p-8 flex flex-col gap-6 overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800/50 pb-6">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500 px-2">Neural Event Log</h3>
        <span className="text-[10px] font-mono text-zinc-600 px-2 italic">Real-time sync active</span>
      </div>
      
      <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar">
        {activities.map((item) => {
          const Config = icons[item.type];
          return (
            <div key={item.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-800/50 transition-all border border-transparent hover:border-zinc-800">
              <div className="flex items-center gap-5">
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shadow-inner", Config.bg, Config.color)}>
                  <Config.icon size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-violet-400 transition-colors leading-tight">
                    {item.msg}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
                    <span className="text-zinc-400 font-bold">{item.user}</span>
                    <span>•</span>
                    <span>{item.project}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-zinc-700">{item.time}</span>
                <ArrowRight size={14} className="text-zinc-800 group-hover:text-white transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
