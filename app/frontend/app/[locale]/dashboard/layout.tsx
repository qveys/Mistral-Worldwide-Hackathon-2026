'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardBreadcrumb } from '@/components/dashboard/DashboardBreadcrumb';
import { useDashboardTheme } from '@/lib/DashboardThemeContext';
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
        'min-h-screen flex font-sans transition-colors duration-500',
        isDarkMode ? 'dark bg-[#09090b] text-zinc-400' : 'bg-slate-50 text-slate-700',
        isDarkMode ? 'selection:bg-[#536dfe]/30' : 'selection:bg-[#00b0ff]/30'
      )}
    >
      <DashboardSidebar
        isCollapsed={isCollapsed}
        onToggle={onToggleCollapse}
      />

      <main className="flex-1 overflow-y-auto">
        <DashboardBreadcrumb />
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
    <DashboardLayoutInner
      isCollapsed={isCollapsed}
      onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
    >
      {children}
    </DashboardLayoutInner>
  );
}
