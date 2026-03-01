'use client';

import React, { useState } from 'react';
import { TimelineHeader } from '@/components/dashboard/timeline/TimelineHeader';
import { TimelineControls } from '@/components/dashboard/timeline/TimelineControls';
import { TimelineView } from '@/components/dashboard/timeline/TimelineView';
import {
  TIMELINE_TASKS,
  type TimelineZoomMode,
} from '@/components/dashboard/timeline/timeline.constants';

export default function TimelinePage() {
  const [zoomMode, setZoomMode] = useState<TimelineZoomMode>('week');

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <TimelineHeader />
      <TimelineControls zoomMode={zoomMode} onZoomModeChange={setZoomMode} />

      <div className="space-y-4">
        <TimelineView tasks={TIMELINE_TASKS} zoomMode={zoomMode} />
      </div>
    </div>
  );
}
