'use client';

import React from 'react';
import { Activity, Mic, Command } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function ConsoleHero() {
  return (
    <div className="col-span-12 lg:col-span-8 row-span-2 bg-[#161618] border border-zinc-800/50 rounded-[2rem] p-10 flex flex-col justify-between relative overflow-hidden group">
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest w-fit">
          <Activity size={12} className="animate-pulse" />
          Neural Sync: Optimal
        </div>
        <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.1]">
          Design your next <br />
          <span className="text-zinc-500 italic font-serif">strategic roadmap.</span>
        </h2>
      </div>
      <div className="relative z-10 flex items-center gap-4">
        <Link href="/">
          <Button className="h-14 px-8 bg-zinc-100 text-black hover:bg-white rounded-2xl font-bold transition-all shadow-2xl shadow-white/5 group/btn">
            <Mic size={18} className="mr-2 group-hover/btn:scale-110 transition-transform" />
            New Brain Dump
          </Button>
        </Link>
        <div className="hidden sm:flex h-14 items-center gap-2 px-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-zinc-500 text-xs font-mono hover:border-zinc-700 transition-colors cursor-text">
          <span className="text-zinc-700">⌘</span>K to search context...
        </div>
      </div>
      <Command size={320} className="absolute -right-16 -bottom-16 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
    </div>
  );
}
