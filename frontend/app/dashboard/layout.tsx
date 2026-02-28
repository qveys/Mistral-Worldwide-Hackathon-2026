'use client';

import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#09090b] text-zinc-400 font-sans selection:bg-violet-500/30">
      
      {/* --- SHARED SIDEBAR --- */}
      <DashboardSidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />

      {/* --- PAGE CONTENT --- */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
