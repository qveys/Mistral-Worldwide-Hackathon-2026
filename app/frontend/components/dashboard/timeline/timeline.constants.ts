export type TimelineZoomMode = 'day' | 'week' | 'month';

export const TIMELINE_TASKS = [
  { id: '1', titleKey: 'task1Title', start: '2026-03-01', end: '2026-03-05', status: 'done', color: 'bg-emerald-500/20 text-emerald-400', progress: 100 },
  { id: '2', titleKey: 'task2Title', start: '2026-03-04', end: '2026-03-10', status: 'doing', color: 'bg-blue-500/20 text-blue-400', progress: 65 },
  { id: '3', titleKey: 'task3Title', start: '2026-03-08', end: '2026-03-15', status: 'todo', color: 'bg-amber-500/20 text-amber-400', progress: 0 },
  { id: '4', titleKey: 'task4Title', start: '2026-03-12', end: '2026-03-25', status: 'todo', color: 'bg-blue-500/20 text-blue-400', progress: 0 },
  { id: '5', titleKey: 'task5Title', start: '2026-03-20', end: '2026-03-30', status: 'todo', color: 'bg-indigo-500/20 text-indigo-400', progress: 0 },
];

export const TIMELINE_DAY_KEYS = ['dayMon', 'dayTue', 'dayWed', 'dayThu', 'dayFri', 'daySat', 'daySun'] as const;
