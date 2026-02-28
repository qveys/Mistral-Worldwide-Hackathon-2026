'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

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
  const [mounted, setMounted] = useState(false);

  // Only show the heatmap once mounted to be extra safe, 
  // though static data fixes the core issue
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 auto-rows-[160px]">
          
          <ConsoleHero />

          <div className="col-span-12 lg:col-span-4 row-span-2">
            {mounted ? (
              <ActivityHeatmap data={STATIC_ACTIVITY_DATA} />
            ) : (
              <div className="bg-[#161618] border border-zinc-800/50 rounded-[2rem] p-8 h-full animate-pulse" />
            )}
          </div>

          {/* Box 3: Roadmaps List */}
          <div className="col-span-12 lg:col-span-8 row-span-3 bg-[#161618] border border-zinc-800/50 rounded-[2.5rem] p-8 flex flex-col gap-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800/50 pb-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500 px-2">Active Units</h3>
              <Link href="/dashboard/roadmaps" className="text-[10px] font-bold text-violet-400 hover:text-white transition-colors px-2 flex items-center gap-2">
                EXPLORE ROADMAPS <ChevronRight size={12} />
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
             />
             <StatBox 
                label="Topological Sort"
                value="Healthy"
                detail="VERIFIED"
                icon={CheckCircle2}
                color="text-emerald-500"
                progress={100}
                className="flex-1"
             />
          </div>

          <div className="col-span-12 row-span-1 mt-2">
            <CollaborationHub />
          </div>

      </div>
    </div>
  );
}
