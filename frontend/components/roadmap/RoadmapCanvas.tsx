'use client';

import { cn } from '@/lib/utils';
import { motion, Variants } from 'framer-motion';
import React from 'react';

interface RoadmapCanvasProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export function RoadmapCanvas({ children, className, title }: RoadmapCanvasProps) {
    return (
        <div
            className={cn(
                'w-full bg-slate-50/30 backdrop-blur-lg rounded-3xl p-8 min-h-[500px] border border-white/20 shadow-inner',
                className,
            )}
        >
            {title && (
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold text-slate-900 mb-8 border-l-4 border-blue-600 pl-4"
                >
                    {title}
                </motion.h2>
            )}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {children}
            </motion.div>
        </div>
    );
}

interface RoadmapItemProps {
    title: string;
    description: string;
    period?: string;
    status?: 'todo' | 'in-progress' | 'done';
}

export function RoadmapItem({ title, description, period, status = 'todo' }: RoadmapItemProps) {
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 12 },
        },
    };

    return (
        <motion.div
            variants={itemVariants}
            className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-white/40 hover:bg-white/80 hover:shadow-md transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                {period && (
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
                        {period}
                    </span>
                )}
                <div
                    className={cn(
                        'h-3 w-3 rounded-full',
                        status === 'done' && 'bg-green-500',
                        status === 'in-progress' && 'bg-amber-500 animate-pulse',
                        status === 'todo' && 'bg-slate-300',
                    )}
                />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {title}
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </motion.div>
    );
}
