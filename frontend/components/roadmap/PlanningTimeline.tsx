'use client';

import type { Planning, Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';

interface PlanningTimelineProps {
    planning: Planning;
    tasks: Task[];
    onToggleSlot?: (taskId: string, day: string, slot: 'AM' | 'PM') => void;
    className?: string;
}

export function PlanningTimeline({
    planning,
    tasks,
    onToggleSlot,
    className,
}: PlanningTimelineProps) {
    // Group slots by day
    const slotsByDay = new Map<string, typeof planning.slots>();
    for (const slot of planning.slots) {
        const existing = slotsByDay.get(slot.day) ?? [];
        existing.push(slot);
        slotsByDay.set(slot.day, existing);
    }

    const days = Array.from(slotsByDay.entries()).sort(([a], [b]) => a.localeCompare(b));

    const formatDay = (dateStr: string) => {
        try {
            return new Date(dateStr + 'T00:00:00').toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
            });
        } catch {
            return dateStr;
        }
    };

    const totalSlots = planning.slots.length;
    const doneSlots = planning.slots.filter((s) => s.done).length;
    const progress = totalSlots > 0 ? Math.round((doneSlots / totalSlots) * 100) : 0;

    return (
        <div className={cn('w-full space-y-6', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
                        <Calendar size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Planning
                        </h3>
                        <p className="text-xs text-slate-500">
                            {planning.startDate} → {planning.endDate}
                        </p>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full bg-green-500 rounded-full"
                        />
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        {progress}%
                    </span>
                </div>
            </div>

            {/* Timeline */}
            <div className="relative space-y-4">
                {/* Vertical line */}
                <div className="absolute left-5 top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800" />

                <AnimatePresence>
                    {days.map(([day, slots], dayIndex) => (
                        <motion.div
                            key={day}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: dayIndex * 0.1 }}
                            className="relative pl-12"
                        >
                            {/* Day dot */}
                            <div className="absolute left-3 top-2 h-4 w-4 rounded-full bg-orange-500 border-4 border-white dark:border-slate-950 shadow-sm z-10" />

                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                    {formatDay(day)}
                                </h4>

                                <div className="space-y-2">
                                    {slots
                                        .sort((a, b) => (a.slot === 'AM' ? -1 : 1))
                                        .map((slot) => {
                                            const task = tasks.find((t) => t.id === slot.taskId);
                                            return (
                                                <motion.button
                                                    key={`${slot.day}-${slot.slot}-${slot.taskId}`}
                                                    onClick={() =>
                                                        onToggleSlot?.(
                                                            slot.taskId,
                                                            slot.day,
                                                            slot.slot,
                                                        )
                                                    }
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    className={cn(
                                                        'w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left',
                                                        slot.done
                                                            ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                                                            : 'bg-white/40 dark:bg-black/40 border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-black/60',
                                                    )}
                                                >
                                                    {slot.done ? (
                                                        <CheckCircle2
                                                            size={20}
                                                            className="text-green-500 shrink-0"
                                                        />
                                                    ) : (
                                                        <Circle
                                                            size={20}
                                                            className="text-slate-300 dark:text-slate-700 shrink-0"
                                                        />
                                                    )}

                                                    <span
                                                        className={cn(
                                                            'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shrink-0',
                                                            slot.slot === 'AM'
                                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                                : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
                                                        )}
                                                    >
                                                        {slot.slot}
                                                    </span>

                                                    <span
                                                        className={cn(
                                                            'text-sm font-medium flex-1',
                                                            slot.done
                                                                ? 'text-slate-500 line-through'
                                                                : 'text-slate-800 dark:text-slate-100',
                                                        )}
                                                    >
                                                        {task?.title ?? slot.taskId}
                                                    </span>

                                                    {task && (
                                                        <span
                                                            className={cn(
                                                                'text-[10px] font-bold uppercase px-2 py-0.5 rounded-full',
                                                                task.priority === 'high' &&
                                                                    'bg-red-100 text-red-600',
                                                                task.priority === 'medium' &&
                                                                    'bg-amber-100 text-amber-600',
                                                                task.priority === 'low' &&
                                                                    'bg-blue-100 text-blue-600',
                                                            )}
                                                        >
                                                            {task.estimate}
                                                        </span>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
