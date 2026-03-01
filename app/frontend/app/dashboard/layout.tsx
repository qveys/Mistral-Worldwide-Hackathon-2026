'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardThemeProvider, useDashboardTheme } from '@/lib/DashboardThemeContext';
import { cn } from '@/lib/utils';

function DashboardLayoutInner({
  children,
  isCollapsed,
  onToggleCollapse,
}: {
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const { isDarkMode } = useDashboardTheme();

  return (
    <div
      className={cn(
        'min-h-screen flex font-sans transition-colors duration-300',
        isDarkMode
          ? 'bg-[#09090b] text-zinc-400 selection:bg-violet-500/30'
          : 'bg-slate-100 text-slate-700 selection:bg-blue-200'
      )}
    >
      <DashboardSidebar
        isCollapsed={isCollapsed}
        onToggle={onToggleCollapse}
      />

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <DashboardThemeProvider>
      <DashboardLayoutInner
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      >
        {children}
      </DashboardLayoutInner>
    </DashboardThemeProvider>
  );
}
