'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, AlertCircle, Clock } from 'lucide-react';

export type Priority = 'high' | 'medium' | 'low';

export interface ActionItem {
  id: string;
  title: string;
  priority: Priority;
  completed?: boolean;
  dueDate?: string;
}

interface ActionItemsListProps {
  items: ActionItem[];
  onToggle?: (id: string) => void;
  className?: string;
}

export function ActionItemsList({ items, onToggle, className }: ActionItemsListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className={cn("bg-white/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20", className)}>
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <CheckCircle2 size={24} className="text-green-500" />
        Actions Prioritaires
      </h3>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {items.length > 0 ? (
          items.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              onClick={() => onToggle?.(item.id)}
              className={cn(
                "group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer",
                item.completed 
                  ? "bg-slate-50/40 border-slate-100 opacity-60" 
                  : "bg-white/60 border-white/40 hover:bg-white/80 hover:border-blue-300 hover:shadow-lg backdrop-blur-sm"
              )}
            >
              <div className="flex-shrink-0">
                {item.completed ? (
                  <CheckCircle2 size={24} className="text-blue-500 fill-blue-50" />
                ) : (
                  <Circle size={24} className="text-slate-300 group-hover:text-blue-400" />
                )}
              </div>

              <div className="flex-1">
                <p className={cn(
                  "font-medium transition-all",
                  item.completed ? "text-slate-500 line-through" : "text-slate-800"
                )}>
                  {item.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <PriorityBadge priority={item.priority} />
                  {item.dueDate && (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={12} />
                      {item.dueDate}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-slate-400 py-8 italic">Aucune action identifiée pour le moment.</p>
        )}
      </motion.div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const config = {
    high: { color: "text-red-600 bg-red-50 border-red-100", icon: AlertCircle, label: "Haute" },
    medium: { color: "text-amber-600 bg-amber-50 border-amber-100", icon: Clock, label: "Moyenne" },
    low: { color: "text-blue-600 bg-blue-50 border-blue-100", icon: CheckCircle2, label: "Basse" }
  };

  const { color, icon: Icon, label } = config[priority];

  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", color)}>
      <Icon size={10} />
      {label}
    </span>
  );
}
