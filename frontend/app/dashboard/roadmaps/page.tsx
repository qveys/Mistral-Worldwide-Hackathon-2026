'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

// Dashboard Shared Components
import { RoadmapCard } from '@/components/dashboard/RoadmapCard';

// Page Specific Components
import { RoadmapControls } from '@/components/dashboard/roadmaps/RoadmapControls';

const roadmaps = [
  { id: '1', title: 'Microservices Architecture v2', status: 'Stable', lastEdit: '2m ago', nodes: 24, team: 4 },
  { id: '2', title: 'Product Launch Q3', status: 'Review', lastEdit: '1h ago', nodes: 12, team: 2 },
  { id: '3', title: 'Mobile UI/UX Refactor', status: 'Draft', lastEdit: '4h ago', nodes: 18, team: 1 },
  { id: '4', title: 'API Gateway Scaling', status: 'Stable', lastEdit: '1d ago', nodes: 32, team: 3 },
  { id: '5', title: 'Cloud Migration Strategy', status: 'Draft', lastEdit: '2d ago', nodes: 45, team: 5 },
  { id: '6', title: 'Security Audit 2026', status: 'Stable', lastEdit: '1w ago', nodes: 8, team: 2 },
];

export default function RoadmapsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode } = useDashboardTheme();

  return (
    <div className="p-6 lg:p-10 space-y-10">
      
      {/* Header & Primary Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h2 className={cn("text-4xl lg:text-5xl font-medium tracking-tight leading-tight", isDarkMode ? "text-white" : "text-slate-900")}>
            Roadmap <span className={cn("italic font-serif text-3xl lg:text-4xl", isDarkMode ? "text-zinc-600" : "text-slate-600")}>Explorer</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard" 
            className={cn(
              "inline-flex items-center gap-2 h-10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              isDarkMode ? "text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-600" : "text-slate-600 hover:text-slate-900 border-2 border-slate-300 hover:border-slate-400"
            )}
          >
            <LayoutDashboard size={16} />
            Console
          </Link>
          <Link href="/">
            <Button className={cn(
              "!h-10 !px-5 !py-2 !rounded-xl font-bold transition-all group text-sm",
              isDarkMode ? "bg-white text-black hover:bg-zinc-200 shadow-2xl shadow-white/5" : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
            )}>
              <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />
              Initialize Roadmap
            </Button>
          </Link>
        </div>
      </div>

      {/* Factorized Controls */}
      <RoadmapControls 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* Display Logic */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[240px]" 
          : cn("space-y-2 rounded-[2.5rem] p-4", isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg")
      )}>
        {roadmaps.map((roadmap) => (
          <RoadmapCard 
            key={roadmap.id} 
            {...roadmap} 
            variant={viewMode} 
          />
        ))}
        
        {viewMode === 'grid' && (
          <Link 
            href="/" 
            className={cn(
              "group flex flex-col items-center justify-center p-8 border border-dashed rounded-[2rem] hover:border-violet-500/50 hover:bg-violet-500/5 transition-all hover:text-violet-400",
              isDarkMode ? "bg-zinc-900/20 border-zinc-800 text-zinc-600" : "bg-slate-50 border-slate-300 text-slate-600"
            )}
          >
            <div className={cn("h-14 w-14 rounded-full border border-dashed flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", isDarkMode ? "border-zinc-700" : "border-slate-400")}>
              <Plus size={24} />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest italic">New Roadmap Cluster</p>
          </Link>
        )}
      </div>

    </div>
  );
}
