'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Task } from '../ui/TaskCard';
import { cn } from '@/lib/utils';
import { Target, CheckCircle2, Circle } from 'lucide-react';

interface ObjectiveCardProps {
  title: string;
  priority: 'high' | 'medium' | 'low';
  tasks: Task[];
  className?: string;
}

export function ObjectiveCard({ title, priority, tasks, className }: ObjectiveCardProps) {
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <Card className={cn("space-y-6", className)}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner">
            <Target size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h3>
        </div>
        <Badge variant="priority" type={priority}>
          {priority}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>Progression</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Condensed Task List */}
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          Tâches associées ({tasks.length})
        </p>
        <div className="space-y-1">
          {tasks.slice(0, 3).map((task) => (
            <div 
              key={task.id} 
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/30 dark:bg-white/5 border border-white/10"
            >
              {task.status === 'done' ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <Circle size={14} className="text-slate-300 dark:text-slate-600" />
              )}
              <span className={cn(
                "text-xs font-medium truncate flex-1",
                task.status === 'done' ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200"
              )}>
                {task.title}
              </span>
            </div>
          ))}
          {tasks.length > 3 && (
            <p className="text-[10px] text-slate-400 italic ml-1">
              + {tasks.length - 3} autres tâches...
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
