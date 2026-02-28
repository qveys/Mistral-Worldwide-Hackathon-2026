'use client';

import React from 'react';

// Dashboard Components
import { ActivityHeader } from '@/components/dashboard/ActivityHeader';
import { ActivityStats } from '@/components/dashboard/ActivityStats';
import { ActivityFilters } from '@/components/dashboard/ActivityFilters';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import { ActivityInsights } from '@/components/dashboard/ActivityInsights';

// Constants & Mock Data
import { 
  STATIC_ACTIVITY_DATA, 
  MOCK_ACTIVITIES, 
  LIVE_INSIGHTS 
} from '@/components/dashboard/activity.constants';

export default function ActivityPage() {
  return (
    <div className="p-6 lg:p-10 space-y-8">
      
      <ActivityHeader />
      <ActivityStats />

      <div className="grid grid-cols-12 gap-4">
        
        {/* Main Feed Area */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <ActivityFilters />
          <ActivityFeed activities={MOCK_ACTIVITIES} />
        </div>

        {/* Sidebar Info Area */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <ActivityHeatmap 
            data={STATIC_ACTIVITY_DATA} 
            title="Neural Sync Flow" 
            className="h-auto" 
          />
          <ActivityInsights insights={LIVE_INSIGHTS} />
        </div>

      </div>

    </div>
  );
}
