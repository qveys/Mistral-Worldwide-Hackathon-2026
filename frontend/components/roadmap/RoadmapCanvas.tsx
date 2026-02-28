'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TaskCard, TaskStatus, TaskPriority, TaskEstimate } from '../ui/TaskCard';
import { Target,} from 'lucide-react';

export interface RoadmapTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimate: TaskEstimate;
  objectiveId: string;
  isBlocked?: boolean;
  blockedBy?: string[];
  dependencies?: string[];
}

export interface RoadmapObjective {
  id: string;
  title: string;
  color: string; // e.g., 'blue', 'orange', 'green'
}

export interface RoadmapTimeSlot {
  day: number;
  period: 'AM' | 'PM';
  tasks: RoadmapTask[];
}

export interface Roadmap {
  id: string;
  title: string;
  objectives: RoadmapObjective[];
  timeSlots: RoadmapTimeSlot[];
}

interface RoadmapCanvasProps {
  roadmap: Roadmap;
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const slotVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export function RoadmapCanvas({ roadmap, onTaskStatusChange, className }: RoadmapCanvasProps) {
  return (
    <div className={cn(
      "w-full max-h-[80vh] overflow-y-auto pr-4 scrollbar-hide custom-scrollbar",
      className
    )}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col gap-12 pb-20"
      >
        {/* Central Timeline Line */}
        <div className="absolute left-8 md:left-1/2 top-4 bottom-0 w-[2px] bg-gradient-to-b from-blue-500 via-slate-200 dark:via-white/10 to-transparent -translate-x-1/2 hidden md:block" />

        {roadmap.timeSlots.map((slot, slotIdx) => (
          <motion.div 
            key={`${slot.day}-${slot.period}`}
            variants={slotVariants}
            className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            {/* Day/Period Marker - Desktop Center */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-4 border-blue-500 shadow-lg shadow-blue-500/20" />
              <div className="mt-2 px-3 py-1 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-tighter whitespace-nowrap shadow-xl">
                Day {slot.day} {slot.period}
              </div>
            </div>

            {/* Mobile Marker */}
            <div className="md:hidden flex items-center gap-3 mb-2 ml-2">
               <div className="w-12 h-12 rounded-2xl bg-blue-600 flex flex-col items-center justify-center text-white shadow-lg">
                  <span className="text-[10px] font-black leading-none uppercase">Day</span>
                  <span className="text-xl font-bold leading-none">{slot.day}</span>
               </div>
               <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {slot.period === 'AM' ? 'Matin (09h - 13h)' : 'Après-midi (14h - 18h)'}
               </div>
            </div>

            {/* Tasks Container */}
            <div className={cn(
              "space-y-4 md:pt-12",
              slotIdx % 2 === 0 ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12 md:text-left"
            )}>
              {slot.tasks.map((task) => {
                const objective = roadmap.objectives.find(o => o.id === task.objectiveId);
                return (
                  <div key={task.id} className="relative group">
                    {/* Objective Connector */}
                    <div className={cn(
                      "absolute top-1/2 w-4 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity hidden md:block",
                      slotIdx % 2 === 0 ? "-right-4 bg-gradient-to-l" : "-left-4 bg-gradient-to-r",
                      objective?.color === 'blue' ? "from-blue-500" : "from-orange-500"
                    )} />
                    
                    <div className="flex flex-col gap-1">
                      {objective && (
                        <div className={cn(
                          "flex items-center gap-1.5 mb-1",
                          slotIdx % 2 === 0 ? "md:justify-end" : "md:justify-start"
                        )}>
                           <Target size={10} className={cn(
                             objective.color === 'blue' ? "text-blue-500" : "text-orange-500"
                           )} />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                              {objective.title}
                           </span>
                        </div>
                      )}
                      <TaskCard 
                        task={task} 
                        isBlocked={task.isBlocked}
                        blockedBy={task.blockedBy}
                        onStatusChange={(id, status) => onTaskStatusChange?.(id, status)}
                        className="text-left"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
