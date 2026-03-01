'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  History,
  Calendar,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Target,
  Command,
  Moon,
  Sun,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';

export function DashboardSidebar({ 
  isCollapsed, 
  onToggle 
}: { 
  isCollapsed: boolean; 
  onToggle: () => void 
}) {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useDashboardTheme();

  const navItems = [
    { id: 'dash', label: 'Console', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'proj', label: 'Roadmaps', icon: Target, href: '/dashboard/roadmaps' },
    { id: 'hist', label: 'Activity', icon: History, href: '/dashboard/activity' },
    { id: 'cal', label: 'Timeline', icon: Calendar, href: '/dashboard/timeline' },
  ];

  return (
    <aside className={cn(
      "h-screen sticky top-0 border-r p-4 flex flex-col gap-8 z-30 transition-all duration-500",
      isCollapsed ? "w-20" : "w-64",
      isDarkMode ? "border-zinc-800/50 bg-[#09090b]" : "border-slate-300 bg-white"
    )}>
      <div className={cn("flex items-center gap-3 px-2", isCollapsed ? "justify-center" : "justify-between")}>
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className={cn(
            "h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0",
            isDarkMode ? "bg-zinc-100 text-black" : "bg-blue-500 text-white"
          )}>
            <Command size={16} />
          </div>
          {!isCollapsed && (
            <span className={cn("font-bold tracking-tight text-sm uppercase", isDarkMode ? "text-white" : "text-slate-900")}>
              EchoMaps
            </span>
          )}
        </Link>
        <button 
          onClick={onToggle} 
          className={cn("p-1 rounded-md", isDarkMode ? "hover:bg-zinc-800 text-zinc-500" : "hover:bg-slate-200 text-slate-600")}
        >
          {isCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.id} 
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                isActive 
                  ? isDarkMode ? "text-white bg-zinc-800" : "text-slate-900 bg-slate-200" 
                  : isDarkMode ? "text-zinc-300 hover:text-white hover:bg-zinc-800/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                isCollapsed && "justify-center px-0"
              )}
            >
              <span className={cn(
                "flex items-center justify-center rounded-lg p-1.5 flex-shrink-0 transition-colors",
                isActive ? (isDarkMode ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-600") : "text-current"
              )}>
                <item.icon size={22} strokeWidth={2} />
              </span>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn("space-y-0.5 pt-4 border-t", isDarkMode ? "border-zinc-800/50" : "border-slate-200")}>
        <button
          onClick={toggleTheme}
          aria-label={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            isDarkMode ? "text-amber-400 hover:text-amber-300 hover:bg-zinc-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
            isCollapsed && "justify-center px-0"
          )}
        >
          <span className="flex items-center justify-center rounded-lg p-1.5 flex-shrink-0 text-current">
            {isDarkMode ? <Sun size={22} strokeWidth={2} /> : <Moon size={22} strokeWidth={2} />}
          </span>
          {!isCollapsed && <span>{isDarkMode ? 'Clair' : 'Sombre'}</span>}
        </button>
        <button className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium", isDarkMode ? "text-zinc-300 hover:text-white" : "text-slate-600 hover:text-slate-900", isCollapsed && "justify-center px-0")}>
          <span className="flex items-center justify-center rounded-lg p-1.5 flex-shrink-0 text-current">
            <Settings size={22} strokeWidth={2} />
          </span>
          {!isCollapsed && <span>Settings</span>}
        </button>
        <Link href="/" className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium", isDarkMode ? "text-zinc-300 hover:text-red-400" : "text-slate-600 hover:text-red-500", isCollapsed && "justify-center px-0")}>
          <span className="flex items-center justify-center rounded-lg p-1.5 flex-shrink-0 text-current">
            <LogOut size={22} strokeWidth={2} />
          </span>
          {!isCollapsed && <span>Exit</span>}
        </Link>
      </div>
    </aside>
  );
}
