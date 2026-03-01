'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Layout, Network, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExportButton } from '@/components/ui/ExportButton';

interface ProjectHeaderProps {
  projectId: string;
  roadmapTitle: string;
  viewMode: 'grid' | 'graph' | 'timeline';
  setViewMode: (mode: 'grid' | 'graph' | 'timeline') => void;
  markdown: string;
  roadmapData: any;
}

export function ProjectHeader({ 
  projectId, 
  roadmapTitle, 
  viewMode, 
  setViewMode, 
  markdown, 
  roadmapData 
}: ProjectHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/roadmaps"
            className="p-2 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-[1px] bg-zinc-800" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hidden sm:block">
            Roadmap Unit / {projectId.substring(0, 8)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800 mr-4">
            {[
              { id: 'grid', icon: Layout, label: 'Structured View' },
              { id: 'graph', icon: Network, label: 'Neural Graph' },
              { id: 'timeline', icon: Calendar, label: 'Execution Timeline' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                title={mode.label}
                className={cn(
                  "p-2 rounded-lg transition-all relative",
                  viewMode === mode.id ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-600 hover:text-zinc-400"
                )}
              >
                <mode.icon size={16} />
              </button>
            ))}
          </div>
          <ExportButton
            markdown={markdown}
            data={roadmapData}
            filename={roadmapTitle.replace(/\s+/g, '-').toLowerCase()}
          />
        </div>
      </div>
    </header>
  );
}
