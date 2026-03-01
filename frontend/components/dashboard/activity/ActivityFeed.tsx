'use client';

import React from 'react';
import { 
  GitBranch, 
  MessageSquare, 
  CheckCircle2, 
  Zap, 
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

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
  const { isDarkMode } = useDashboardTheme();

  return (
    <div className={cn(
      "rounded-[2.5rem] p-8 flex flex-col gap-6 overflow-hidden",
      isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
    )}>
      <div className={cn("flex items-center justify-between border-b pb-6", isDarkMode ? "border-zinc-800/50" : "border-slate-200")}>
        <h3 className={cn("text-[11px] font-bold uppercase tracking-[0.3em] px-2", isDarkMode ? "text-zinc-500" : "text-slate-600")}>Neural Event Log</h3>
        <span className={cn("text-[10px] font-mono px-2 italic", isDarkMode ? "text-zinc-600" : "text-slate-600")}>Real-time sync active</span>
      </div>
      
      <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar">
        {activities.map((item) => {
          const Config = icons[item.type];
          return (
            <div key={item.id} className={cn(
              "group flex items-center justify-between p-4 rounded-2xl transition-all border border-transparent",
              isDarkMode ? "hover:bg-zinc-800/50 hover:border-zinc-800" : "hover:bg-slate-100 hover:border-slate-300"
            )}>
              <div className="flex items-center gap-5">
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shadow-inner", Config.bg, Config.color)}>
                  <Config.icon size={20} />
                </div>
                <div className="space-y-1">
                  <p className={cn("text-sm font-medium group-hover:text-violet-400 transition-colors leading-tight", isDarkMode ? "text-zinc-200" : "text-slate-800")}>
                    {item.msg}
                  </p>
                  <div className={cn("flex items-center gap-3 text-[10px] font-mono uppercase tracking-widest", isDarkMode ? "text-zinc-600" : "text-slate-600")}>
                    <span className={cn("font-bold", isDarkMode ? "text-zinc-400" : "text-slate-700")}>{item.user}</span>
                    <span>•</span>
                    <span>{item.project}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn("text-[10px] font-mono", isDarkMode ? "text-zinc-700" : "text-slate-500")}>{item.time}</span>
                <ArrowRight size={14} className={cn("transition-all", isDarkMode ? "text-zinc-800 group-hover:text-white" : "text-slate-400 group-hover:text-violet-500")} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
