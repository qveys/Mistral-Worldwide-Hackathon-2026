'use client';

import { Badge } from '@/components/ui/Badge';
import { Task } from '@/lib/types';
import { Target } from 'lucide-react';

interface Objective {
    id: string;
    text: string;
    priority: string;
}

interface ObjectiveGridProps {
    objectives: Objective[];
    tasks: Task[];
}

export function ObjectiveGrid({ objectives, tasks }: ObjectiveGridProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-500">
                <Target size={14} className="text-blue-500" />
                Strategic Clusters
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {objectives.map((obj) => {
                    const relatedTasks = tasks.filter((t) => t.objectiveId === obj.id);
                    const doneTasks = relatedTasks.filter((t) => t.status === 'done').length;
                    const progress =
                        relatedTasks.length > 0 ? (doneTasks / relatedTasks.length) * 100 : 0;
                    return (
                        <div
                            key={obj.id}
                            className="bg-white border-2 border-slate-300 shadow-lg dark:bg-[#161618] dark:border-zinc-800/50 dark:shadow-none rounded-[2rem] p-6 hover:border-blue-500/30 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <Badge
                                    variant="status"
                                    type={progress === 100 ? 'done' : 'doing'}
                                    className="uppercase text-[8px] font-black tracking-widest"
                                >
                                    {progress === 100 ? 'Synced' : 'Active'}
                                </Badge>
                                <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-600 italic">
                                    PRIORITY: {obj.priority}
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors leading-tight mb-2">
                                {obj.text}
                            </h4>
                            <div className="mt-6 flex flex-col gap-1.5">
                                <div className="flex justify-between text-[9px] font-bold text-slate-500 dark:text-zinc-500 uppercase">
                                    <span>
                                        {doneTasks}/{relatedTasks.length} Nodes
                                    </span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
