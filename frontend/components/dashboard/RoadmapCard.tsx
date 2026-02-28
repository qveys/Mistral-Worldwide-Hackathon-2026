'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowUpRight, History, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface RoadmapCardProps {
  id: string;
  title: string;
  status: string;
  lastEdit: string;
  nodes: number;
  variant?: 'list' | 'grid';
  team?: number;
}

export function RoadmapCard({ 
  id, 
  title, 
  status, 
  lastEdit, 
  nodes, 
  variant = 'list',
  team 
}: RoadmapCardProps) {
  if (variant === 'grid') {
    return (
      <Link href={`/project/${id}`} className="group relative flex flex-col justify-between p-8 bg-[#161618] border border-zinc-800/50 rounded-[2rem] hover:border-violet-500/30 transition-all overflow-hidden h-full">
        <div className="relative z-10 flex justify-between items-start">
          <div className="h-12 w-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-inner">
            <FileText size={24} />
          </div>
          <Badge variant="status" type="done" className="bg-zinc-800/50 text-[10px] border-none px-3 font-bold uppercase tracking-widest">{status}</Badge>
        </div>
        
        <div className="relative z-10 space-y-2 mt-4">
          <h3 className="text-xl font-semibold text-white group-hover:text-violet-400 transition-colors leading-tight">{title}</h3>
          <div className="flex items-center gap-4 text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
            <span className="flex items-center gap-1"><Layers size={10} /> {nodes} Nodes</span>
            <span className="flex items-center gap-1"><History size={10} /> {lastEdit}</span>
          </div>
        </div>

        {team && (
          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-zinc-800/50 mt-4">
            <div className="flex -space-x-2">
              {Array.from({ length: team }).map((_, i) => (
                <div key={i} className="h-6 w-6 rounded-full border-2 border-[#161618] bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-500">
                  U{i+1}
                </div>
              ))}
            </div>
            <ArrowUpRight size={20} className="text-zinc-700 group-hover:text-white transition-all" />
          </div>
        )}
      </Link>
    );
  }

  return (
    <Link href={`/project/${id}`} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-800/50 transition-all border border-transparent hover:border-zinc-800 w-full">
      <div className="flex items-center gap-5">
        <div className="h-11 w-11 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:bg-violet-600 transition-all shadow-inner">
          <FileText size={20} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-zinc-200 group-hover:text-violet-400 transition-colors">{title}</p>
          <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">{nodes} nodes generated • {lastEdit}</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
         <Badge variant="status" type="done" className="bg-zinc-800/50 text-zinc-500 border-none text-[9px] px-4 py-1 font-bold uppercase tracking-[0.1em]">{status}</Badge>
         <ArrowUpRight size={16} className="text-zinc-700 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
