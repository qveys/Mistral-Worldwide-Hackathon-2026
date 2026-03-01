'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatBoxProps {
    label: string;
    value: string;
    detail: string;
    icon: LucideIcon;
    color?: string;
    progress?: number;
    className?: string;
}

export function StatBox({
    label,
    value,
    detail,
    icon: Icon,
    color = 'text-amber-500',
    progress,
    className,
}: StatBoxProps) {
    return (
        <div
            className={cn(
                'rounded-[2.5rem] p-8 flex flex-col justify-between group',
                'bg-white border-2 border-slate-300 shadow-lg dark:bg-[#161618] dark:border-zinc-800/50 dark:shadow-none',
                className,
            )}
        >
            <div className="flex justify-between items-center">
                <Icon
                    size={20}
                    className={cn(color, 'group-hover:scale-110 transition-transform')}
                />
                <span
                    className={cn(
                        'text-[10px] font-mono px-2 py-1 rounded',
                        'text-slate-600 bg-slate-200 dark:text-zinc-500 dark:bg-zinc-800',
                    )}
                >
                    {detail}
                </span>
            </div>
            <div className="space-y-3">
                <p
                    className={cn(
                        'text-[10px] font-bold uppercase tracking-widest',
                        'text-slate-600 dark:text-zinc-600',
                    )}
                >
                    {label}
                </p>
                <p
                    className={cn(
                        'text-4xl font-medium tracking-tighter',
                        'text-slate-900 dark:text-white',
                    )}
                >
                    {value}
                </p>
                {progress !== undefined && (
                    <div
                        className={cn(
                            'w-full h-1.5 rounded-full overflow-hidden',
                            'bg-slate-200 dark:bg-zinc-800',
                        )}
                    >
                        <div
                            className={cn(
                                'h-full transition-all duration-1000',
                                color.replace('text-', 'bg-'),
                            )}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
