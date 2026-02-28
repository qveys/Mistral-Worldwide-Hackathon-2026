import React from 'react';
import Link from 'next/link';
import { Home, Moon, Sun, Box, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocCategory, NAV_ITEMS } from './constants';

interface SidebarProps {
  activeCategory: DocCategory;
  onCategoryChange: (id: DocCategory) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Sidebar = ({
  activeCategory,
  onCategoryChange,
  isDarkMode,
  onToggleTheme
}: SidebarProps) => (
  <aside className="w-80 h-screen sticky top-0 border-r border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-xl p-6 flex flex-col gap-8 z-20">
    <div className="flex items-center gap-3 px-2">
      <div className="h-8 w-8 bg-[#ff4f00] rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
        <Box size={18} />
      </div>
      <div>
        <h1 className="text-sm font-black uppercase tracking-tighter italic dark:text-white">EchoMaps <span className="text-[#ff4f00]">UI</span></h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Documentation</p>
      </div>
    </div>

    <nav className="flex-1 space-y-1">
      <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Composants</p>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onCategoryChange(item.id)}
          className={cn(
            "w-full flex items-start gap-4 p-4 rounded-2xl transition-all text-left group",
            activeCategory === item.id 
              ? "bg-[#ff4f00] text-white shadow-xl shadow-orange-500/20 scale-[1.02]" 
              : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400"
          )}
        >
          <item.icon size={18} className={cn("mt-0.5", activeCategory === item.id ? "text-white" : "text-slate-400 dark:text-slate-600 group-hover:text-[#ff4f00]")} />
          <div className="flex flex-col">
            <span className="font-black uppercase tracking-tighter italic text-[11px]">{item.label}</span>
            <span className={cn("text-[9px] font-medium opacity-70 leading-none mt-1", activeCategory === item.id ? "text-orange-50" : "text-slate-400")}>{item.desc}</span>
          </div>
          {activeCategory === item.id && <ChevronRight size={14} className="ml-auto mt-1" />}
        </button>
      ))}
    </nav>

    <div className="pt-6 border-t border-slate-200 dark:border-white/5 space-y-4">
      <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 group">
        <Home size={18} className="group-hover:text-[#ff4f00]" />
        <span className="text-xs font-bold uppercase tracking-widest">Retour Accueil</span>
      </Link>
      <button onClick={onToggleTheme} className="w-full flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-600 dark:text-slate-300">
        <span className="text-[10px] font-black uppercase tracking-widest">{isDarkMode ? 'Mode Sombre' : 'Mode Clair'}</span>
        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  </aside>
);
