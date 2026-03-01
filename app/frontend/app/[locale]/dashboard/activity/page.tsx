'use client';

import React from 'react';
import { ActivityHeader } from '@/components/dashboard/activity/ActivityHeader';
import { ActivityFilters } from '@/components/dashboard/activity/ActivityFilters';
import { ActivityFeed } from '@/components/dashboard/activity/ActivityFeed';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';
import {
  STATIC_ACTIVITY_DATA,
  MOCK_ACTIVITIES,
} from '@/components/dashboard/activity/activity.constants';

export default function ActivityPage() {
  return (
    <div className="p-6 lg:p-10 space-y-8">
      <ActivityHeader />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <ActivityFilters />
          <ActivityFeed activities={MOCK_ACTIVITIES} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <ActivityHeatmap data={STATIC_ACTIVITY_DATA} />
        </div>
      </div>
    </div>
  );
}
