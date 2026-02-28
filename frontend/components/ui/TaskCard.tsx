'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertCircle, Clock, CheckCircle2, BarChart3, Zap, Lock } from 'lucide-react';

export type TaskStatus = 'backlog' | 'doing' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskEstimate = 'S' | 'M' | 'L';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimate: TaskEstimate;
  dependencies?: string[]; // IDs of tasks this task depends on
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  isBlocked?: boolean;
  blockedBy?: string[]; // Titles of blocking tasks
  className?: string;
}

const statusConfig = {
  backlog: { label: 'Backlog', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', next: 'doing' as TaskStatus },
  doing: { label: 'In Progress', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', next: 'done' as TaskStatus },
  done: { label: 'Completed', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400', next: 'backlog' as TaskStatus },
};

const priorityConfig = {
  high: { label: 'High', icon: AlertCircle, color: 'text-red-500' },
  medium: { label: 'Med', icon: Clock, color: 'text-amber-500' },
  low: { label: 'Low', icon: Zap, color: 'text-blue-400' },
};

export function TaskCard({ task, onStatusChange, isBlocked = false, blockedBy = [], className }: TaskCardProps) {
  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBlocked) return;
    onStatusChange(task.id, statusConfig[task.status].next);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isBlocked ? 0.4 : (task.status === 'done' ? 0.6 : 1),
        y: 0,
        scale: 1
      }}
      whileHover={!isBlocked ? { scale: 1.02 } : {}}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group p-4 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-sm transition-all relative",
        !isBlocked && "hover:shadow-xl hover:border-white/40 dark:hover:border-white/20",
        isBlocked && "cursor-not-allowed grayscale-[0.8]",
        task.status === 'done' && "grayscale-[0.5]",
        className
      )}
    >
      {/* Blocked Overlay / Lock Icon */}
      <AnimatePresence>
        {isBlocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-3 right-3 text-slate-400 dark:text-slate-500"
            title={`Bloqué par : ${blockedBy.join(', ')}`}
          >
            <Lock size={16} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="space-y-1">
          <h4 className={cn(
            "text-base font-semibold text-slate-800 dark:text-slate-100 leading-tight",
            task.status === 'done' && "line-through text-slate-500",
            isBlocked && "text-slate-500"
          )}>
            {task.title}
          </h4>
          
          {isBlocked && blockedBy.length > 0 && (
            <p className="text-[10px] font-medium text-red-400/80 italic">
              Attente : {blockedBy.join(', ')}
            </p>
          )}
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badge - Clickable if not blocked */}
          <button
            onClick={handleStatusClick}
            disabled={isBlocked}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
              isBlocked 
                ? "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600" 
                : cn(statusConfig[task.status].color, "active:scale-95 cursor-pointer")
            )}
          >
            {isBlocked ? 'Bloqué' : statusConfig[task.status].label}
          </button>

          {/* Priority Badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/50 dark:bg-white/5 border border-white/20 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
            {React.createElement(priorityConfig[task.priority].icon, { size: 12, className: priorityConfig[task.priority].color })}
            {priorityConfig[task.priority].label}
          </div>

          {/* Estimate Badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/50 dark:bg-white/5 border border-white/20 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            <BarChart3 size={12} className="text-indigo-400" />
            Size: {task.estimate}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
