'use client';

import React from 'react';
import { 
  ChevronRight,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

// Dashboard Components
import { ConsoleHero } from '@/components/dashboard/ConsoleHero';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { RoadmapCard } from '@/components/dashboard/RoadmapCard';
import { StatBox } from '@/components/dashboard/StatBox';
import { CollaborationHub } from '@/components/dashboard/CollaborationHub';

// Static mock data to avoid hydration mismatch
const STATIC_ACTIVITY_DATA = [
  1, 2, 0, 3, 1, 0, 0, 2, 3, 1, 0, 2, 0, 1,
  0, 1, 2, 1, 0, 3, 2, 1, 0, 0, 2, 3, 1, 0,
  3, 2, 1, 0, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0,
  1, 0, 0, 2, 3, 1, 2, 0, 3, 1, 0, 0, 2, 3,
  2, 1, 0, 0, 1, 2, 3, 1, 0, 2, 0, 1, 0, 1,
  0, 3, 2, 1, 0, 0, 2, 3, 1, 0, 3, 2, 1, 0,
  2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 1, 0, 0, 2,
].slice(0, 14 * 7);

const recentProjects = [
  { id: '1', title: 'Microservices Architecture v2', status: 'Stable', lastEdit: '2m ago', nodes: 24 },
  { id: '2', title: 'Product Launch Q3', status: 'Review', lastEdit: '1h ago', nodes: 12 },
  { id: '3', title: 'Mobile UI/UX Refactor', status: 'Draft', lastEdit: '4h ago', nodes: 18 },
  { id: '4', title: 'API Gateway Scaling', status: 'Stable', lastEdit: '1d ago', nodes: 32 },
];

export default function DashboardOverview() {
  const { isDarkMode } = useDashboardTheme();

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 auto-rows-[160px]">
          
          <ConsoleHero />

          <div className="col-span-12 lg:col-span-4 row-span-2">
            <ActivityHeatmap data={STATIC_ACTIVITY_DATA} />
          </div>

          {/* Box 3: Roadmaps List */}
          <div className={cn(
            "col-span-12 lg:col-span-8 row-span-3 rounded-[2.5rem] p-8 flex flex-col gap-6 overflow-hidden",
            isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg"
          )}>
            <div className={cn("flex items-center justify-between border-b pb-6", isDarkMode ? "border-zinc-800/50" : "border-slate-200")}>
              <h3 className={cn("text-[11px] font-bold uppercase tracking-[0.3em] px-2", isDarkMode ? "text-zinc-500" : "text-slate-600")}>Active Units</h3>
              <Link 
                href="/dashboard/roadmaps" 
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                  isDarkMode 
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/40 hover:bg-blue-500/25 hover:border-blue-400/60" 
                    : "bg-blue-50 text-blue-600 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 shadow-sm"
                )}
              >
                EXPLORE ROADMAPS <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
            <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar">
              {recentProjects.map((project) => (
                <RoadmapCard key={project.id} {...project} variant="list" />
              ))}
            </div>
          </div>

          {/* Box 4: Performance Column */}
          <div className="col-span-12 lg:col-span-4 row-span-3 flex flex-col gap-4">
             <StatBox 
                label="Inference Speed"
                value="84.2 t/s"
                detail="42ms LATENCY"
                icon={Zap}
                color="text-amber-500"
                progress={84}
                className="flex-1"
                variant={isDarkMode ? 'dark' : 'light'}
             />
             <StatBox 
                label="Topological Sort"
                value="Healthy"
                detail="VERIFIED"
                icon={CheckCircle2}
                color="text-emerald-500"
                progress={100}
                className="flex-1"
                variant={isDarkMode ? 'dark' : 'light'}
             />
          </div>

          <div className="col-span-12 row-span-1 mt-2">
            <CollaborationHub />
          </div>

      </div>
    </div>
  );
}
