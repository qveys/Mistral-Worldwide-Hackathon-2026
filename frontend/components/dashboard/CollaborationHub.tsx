'use client';

import React from 'react';
import { Share2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface CollaborationHubProps {
  className?: string;
}

export function CollaborationHub({ className }: CollaborationHubProps) {
  return (
    <div className={cn(
      "bg-gradient-to-r from-violet-600/10 via-[#161618] to-indigo-900/5 border border-violet-500/20 rounded-[2rem] px-10 py-6 flex items-center justify-between group overflow-hidden",
      className
    )}>
      <div className="flex items-center gap-10 relative z-10">
        <div className="h-12 w-12 bg-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
          <Share2 size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white tracking-tight uppercase tracking-[0.1em]">Collaboration Hub</h4>
          <p className="text-[11px] text-zinc-500 font-medium">Invite your engineering team to sync neural contexts in real-time.</p>
        </div>
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <button className="h-10 px-5 rounded-xl border border-zinc-800 text-zinc-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">
          Copy Shared Link
        </button>
        <Button className="h-10 px-8 bg-violet-600 text-white hover:bg-violet-700 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-violet-600/20 active:scale-95 transition-all">
          Invite Team
        </Button>
      </div>
      <Globe size={160} className="absolute -right-8 -bottom-16 text-white/5 group-hover:rotate-45 transition-transform duration-[2000ms]" />
    </div>
  );
}
