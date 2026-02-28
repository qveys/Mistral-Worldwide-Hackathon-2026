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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DashboardSidebar({ 
  isCollapsed, 
  onToggle 
}: { 
  isCollapsed: boolean; 
  onToggle: () => void 
}) {
  const pathname = usePathname();

  const navItems = [
    { id: 'dash', label: 'Console', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'proj', label: 'Roadmaps', icon: Target, href: '/dashboard/roadmaps' },
    { id: 'hist', label: 'Activity', icon: History, href: '/dashboard/activity' },
    { id: 'cal', label: 'Timeline', icon: Calendar, href: '/dashboard/timeline' },
  ];

  return (
    <aside className={cn(
      "h-screen sticky top-0 border-r border-zinc-800/50 bg-[#09090b] p-4 flex flex-col gap-8 z-30 transition-all duration-500",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={cn("flex items-center gap-3 px-2", isCollapsed ? "justify-center" : "justify-between")}>
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="h-7 w-7 bg-zinc-100 rounded-lg flex items-center justify-center text-black flex-shrink-0">
            <Command size={16} />
          </div>
          {!isCollapsed && <span className="font-bold tracking-tight text-white text-sm uppercase">EchoMaps</span>}
        </Link>
        <button onClick={onToggle} className="p-1 hover:bg-zinc-800 rounded-md text-zinc-500">
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
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-xs font-medium",
                isActive ? "text-white bg-zinc-800" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon size={16} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-0.5 pt-4 border-t border-zinc-800/50">
        <button className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-medium text-zinc-500 hover:text-white", isCollapsed && "justify-center px-0")}>
          <Settings size={16} />
          {!isCollapsed && <span>Settings</span>}
        </button>
        <Link href="/" className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-medium text-zinc-600 hover:text-red-400", isCollapsed && "justify-center px-0")}>
          <LogOut size={16} />
          {!isCollapsed && <span>Exit</span>}
        </Link>
      </div>
    </aside>
  );
}
