'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { FileText, ArrowUpRight, History, Layers, MoreVertical, Pencil, Trash2, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

interface RoadmapCardProps {
  id: string;
  title: string;
  status: string;
  lastEdit: string;
  nodes: number;
  variant?: 'list' | 'grid';
  team?: number;
}

const STATUS_TYPES = ['draft', 'stable', 'review'] as const;

function CardActionsMenu({ 
  id, 
  isOpen, 
  onClose, 
  isDarkMode 
}: { id: string; isOpen: boolean; onClose: () => void; isDarkMode: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const itemClass = cn(
    "flex items-center gap-2 w-full px-3 py-2.5 text-left text-xs font-semibold transition-colors first:rounded-t-lg last:rounded-b-lg",
    isDarkMode ? "text-zinc-100 hover:bg-zinc-700 hover:text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
  );

  return (
    <div ref={ref} className="relative">
      {isOpen && (
        <div className={cn(
          "absolute right-0 top-full mt-1 z-50 min-w-[150px] py-1 rounded-xl shadow-2xl border-2",
          isDarkMode ? "bg-zinc-950 border-zinc-600 shadow-black/50" : "bg-white border-slate-300 shadow-slate-400/30"
        )}>
          <button type="button" className={itemClass} onClick={(e) => { e.stopPropagation(); /* rename */ onClose(); }}>
            <Edit3 size={14} /> Renommer
          </button>
          <button type="button" className={itemClass} onClick={(e) => { e.stopPropagation(); /* edit */ onClose(); }}>
            <Pencil size={14} /> Modifier
          </button>
          <button type="button" className={cn(itemClass, isDarkMode ? "text-red-400 hover:bg-red-900/50 hover:text-red-300" : "text-red-600 hover:bg-red-50 hover:text-red-700")} onClick={(e) => { e.stopPropagation(); /* delete */ onClose(); }}>
            <Trash2 size={14} /> Supprimer
          </button>
        </div>
      )}
    </div>
  );
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
  const { isDarkMode } = useDashboardTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const statusType = STATUS_TYPES.includes(status.toLowerCase() as typeof STATUS_TYPES[number]) 
    ? status.toLowerCase() 
    : 'backlog';

  if (variant === 'grid') {
    return (
      <Link 
        href={`/project/${id}`} 
        className={cn(
          "group relative flex flex-col justify-between p-8 rounded-[2rem] hover:border-blue-500/30 transition-all overflow-hidden h-full",
          isDarkMode ? "bg-[#161618] border border-zinc-800/50" : "bg-white border-2 border-slate-300 shadow-lg hover:border-blue-400/50"
        )}
      >
        <div className="relative z-10 flex justify-between items-start">
          <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner",
            isDarkMode ? "bg-zinc-800 text-zinc-500" : "bg-slate-200 text-slate-600"
          )}>
            <FileText size={24} />
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
            <div className="relative">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen((o) => !o); }}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isDarkMode ? "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300" : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                )}
              >
                <MoreVertical size={18} />
              </button>
              <CardActionsMenu id={id} isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDarkMode={isDarkMode} />
            </div>
            <Badge variant="status" type={statusType} className="text-[10px] border-none px-3 font-bold uppercase tracking-widest">{status}</Badge>
          </div>
        </div>
        
        <div className="relative z-10 space-y-2 mt-4">
          <h3 className={cn("text-xl font-semibold group-hover:text-blue-400 transition-colors leading-tight", isDarkMode ? "text-white" : "text-slate-900")}>{title}</h3>
          <div className={cn("flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest", isDarkMode ? "text-zinc-600" : "text-slate-600")}>
            <span className="flex items-center gap-1"><Layers size={10} /> {nodes} tâches</span>
            <span className="flex items-center gap-1"><History size={10} /> {lastEdit}</span>
          </div>
        </div>

        {team && (
          <div className={cn("relative z-10 flex items-center justify-between pt-4 mt-4", isDarkMode ? "border-t border-zinc-800/50" : "border-t border-slate-200")}>
            <div className="flex -space-x-2">
              {Array.from({ length: team }).map((_, i) => (
                <div key={i} className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center text-[8px] font-bold",
                  isDarkMode ? "border-[#161618] bg-zinc-800 text-zinc-500" : "border-white bg-slate-300 text-slate-600"
                )}>
                  U{i+1}
                </div>
              ))}
            </div>
            <ArrowUpRight size={20} className={cn("transition-all", isDarkMode ? "text-zinc-700 group-hover:text-white" : "text-slate-500 group-hover:text-blue-500")} />
          </div>
        )}
      </Link>
    );
  }

  return (
    <Link 
      href={`/project/${id}`} 
      className={cn(
        "group flex items-center justify-between p-4 rounded-2xl transition-all border border-transparent w-full",
        isDarkMode ? "hover:bg-zinc-800/50 hover:border-zinc-800" : "hover:bg-slate-100 hover:border-slate-300"
      )}
    >
      <div className="flex items-center gap-5">
        <div className={cn(
          "h-11 w-11 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner",
          isDarkMode ? "bg-zinc-800 text-zinc-500" : "bg-slate-200 text-slate-600"
        )}>
          <FileText size={20} />
        </div>
        <div className="space-y-1">
          <p className={cn("text-sm font-semibold group-hover:text-blue-400 transition-colors", isDarkMode ? "text-zinc-200" : "text-slate-800")}>{title}</p>
          <p className={cn("text-[10px] font-mono uppercase tracking-widest", isDarkMode ? "text-zinc-600" : "text-slate-600")}>{nodes} tâches • {lastEdit}</p>
        </div>
      </div>
      <div className="flex items-center gap-4" onClick={(e) => e.preventDefault()}>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen((o) => !o); }}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isDarkMode ? "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300" : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"
            )}
          >
            <MoreVertical size={18} />
          </button>
          <CardActionsMenu id={id} isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDarkMode={isDarkMode} />
        </div>
        <Badge variant="status" type={statusType} className="border-none text-[9px] px-4 py-1 font-bold uppercase tracking-[0.1em]">{status}</Badge>
        <ArrowUpRight size={16} className={cn("transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5", isDarkMode ? "text-zinc-700 group-hover:text-white" : "text-slate-500 group-hover:text-blue-500")} />
      </div>
    </Link>
  );
}
