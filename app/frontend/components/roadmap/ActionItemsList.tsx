'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Task, TaskCard, TaskStatus } from '../ui/TaskCard';
import { ListTodo, Filter } from 'lucide-react';

interface ActionItemsListProps {
  tasks: Task[];
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  className?: string;
}

const FILTER_OPTIONS: { labelKey: 'all' | 'backlog' | 'doing' | 'done'; value: TaskStatus | 'all' }[] = [
  { labelKey: 'all', value: 'all' },
  { labelKey: 'backlog', value: 'backlog' },
  { labelKey: 'doing', value: 'doing' },
  { labelKey: 'done', value: 'done' },
];

export function ActionItemsList({ tasks, onStatusChange, className }: ActionItemsListProps) {
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const t = useTranslations('actions');

  const filteredTasks = tasks.filter(task => filter === 'all' || task.status === filter);

  return (
    <div className={cn("space-y-6 w-full max-w-2xl mx-auto", className)}>
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <ListTodo size={20} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('actionItems')}
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-black text-slate-500">
            {tasks.length}
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 overflow-x-auto no-scrollbar">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                filter === option.value
                  ? "bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-3 relative">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onStatusChange={onStatusChange} 
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-white/5 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200 dark:border-white/10"
            >
              <Filter size={32} className="text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                No tasks found for this filter.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
