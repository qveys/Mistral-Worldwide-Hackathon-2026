export type TimelineZoomMode = 'day' | 'week' | 'month';

export const TIMELINE_TASKS = [
  { id: '1', title: 'Infra Setup', start: '2026-03-01', end: '2026-03-05', status: 'done', color: 'bg-emerald-500/20 text-emerald-400', progress: 100 },
  { id: '2', title: 'Data Schema', start: '2026-03-04', end: '2026-03-10', status: 'doing', color: 'bg-blue-500/20 text-blue-400', progress: 65 },
  { id: '3', title: 'Auth Logic', start: '2026-03-08', end: '2026-03-15', status: 'todo', color: 'bg-amber-500/20 text-amber-400', progress: 0 },
  { id: '4', title: 'Frontend UI', start: '2026-03-12', end: '2026-03-25', status: 'todo', color: 'bg-blue-500/20 text-blue-400', progress: 0 },
  { id: '5', title: 'API Integration', start: '2026-03-20', end: '2026-03-30', status: 'todo', color: 'bg-indigo-500/20 text-indigo-400', progress: 0 },
];

export const TIMELINE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
