'use client';

import { cn } from '@/lib/utils';
import dagre from 'dagre';
import { BookOpen, CheckCircle2, Clock, ExternalLink, Target, Zap } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import ReactFlow, {
    Background,
    ConnectionLineType,
    Controls,
    Edge,
    Handle,
    MarkerType,
    MiniMap,
    Node,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { Task } from '../ui/TaskCard';

// ---------- Types ----------

interface Objective {
    id: string;
    text: string;
    priority: 'high' | 'medium' | 'low';
}

interface KnowledgeGraphProps {
    objectives: Objective[];
    tasks: Task[];
    className?: string;
}

// ---------- Custom Nodes ----------

/** Objective node — accent indigo, rounded */
const ObjectiveNode = ({ data }: { data: { objective: Objective } }) => {
    const { objective } = data;

    const priorityColors: Record<string, string> = {
        high: 'border-indigo-500 shadow-indigo-500/20',
        medium: 'border-violet-400 shadow-violet-400/15',
        low: 'border-slate-400 shadow-slate-300/10',
    };

    const priorityBadge: Record<string, string> = {
        high: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
        medium: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        low: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    };

    return (
        <div
            className={cn(
                'px-5 py-4 rounded-2xl border-2 shadow-xl backdrop-blur-md min-w-50 max-w-65 transition-all',
                'bg-indigo-50/90 dark:bg-indigo-950/40',
                priorityColors[objective.priority],
            )}
        >
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-2 h-2 bg-indigo-500 border-none"
            />

            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                        <Target size={12} className="text-indigo-500 shrink-0" />
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-500 dark:text-indigo-400">
                            Objective
                        </span>
                    </div>
                    <span
                        className={cn(
                            'text-[8px] font-bold px-1.5 py-0.5 rounded uppercase',
                            priorityBadge[objective.priority],
                        )}
                    >
                        {objective.priority}
                    </span>
                </div>
                <p className="text-sm font-bold leading-tight text-indigo-900 dark:text-indigo-100 line-clamp-3">
                    {objective.text}
                </p>
            </div>
        </div>
    );
};

/** Task node — colored by status */
const KGTaskNode = ({ data }: { data: { task: Task; isBlocked: boolean } }) => {
    const { task, isBlocked } = data;

    const statusStyles: Record<string, string> = {
        backlog:
            'border-slate-200 bg-white/80 text-slate-600 dark:bg-slate-900 dark:border-white/10 dark:text-slate-400',
        doing: 'border-blue-500 bg-blue-50/90 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
        done: 'border-green-500 bg-green-50/90 text-green-700 dark:bg-green-900/20 dark:text-green-300 opacity-60',
    };

    const Icon = task.status === 'done' ? CheckCircle2 : task.status === 'doing' ? Clock : Zap;

    return (
        <div
            className={cn(
                'px-4 py-3 rounded-xl border-2 shadow-xl backdrop-blur-md min-w-45 max-w-55 transition-all relative',
                statusStyles[task.status],
                isBlocked && 'opacity-40 grayscale border-slate-400',
            )}
        >
            <Handle
                type="target"
                position={Position.Top}
                className="w-2 h-2 bg-slate-400 border-none"
            />

            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        {isBlocked ? 'Blocked' : task.status}
                    </span>
                    <Icon size={12} />
                </div>
                <p className="text-sm font-bold leading-tight line-clamp-2">{task.title}</p>
                <div className="mt-1.5 flex items-center gap-2">
                    <div
                        className={cn(
                            'text-[8px] font-bold px-1.5 py-0.5 rounded uppercase border',
                            task.priority === 'high'
                                ? 'border-red-200 text-red-500'
                                : 'border-slate-200 text-slate-400',
                        )}
                    >
                        {task.priority}
                    </div>
                    <div className="text-[8px] font-bold text-slate-400">{task.estimate}</div>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="w-2 h-2 bg-slate-400 border-none"
            />
        </div>
    );
};

/** Resource node — small teal node, clickable */
const ResourceNode = ({ data }: { data: { title: string; url: string } }) => {
    const handleClick = useCallback(() => {
        window.open(data.url, '_blank', 'noopener,noreferrer');
    }, [data.url]);

    return (
        <div
            onClick={handleClick}
            className={cn(
                'px-3 py-2 rounded-lg border shadow-md backdrop-blur-md min-w-35 max-w-50 transition-all cursor-pointer',
                'bg-teal-50/90 border-teal-300 hover:border-teal-500 hover:shadow-teal-500/20',
                'dark:bg-teal-950/40 dark:border-teal-700 dark:hover:border-teal-400',
            )}
        >
            <Handle
                type="target"
                position={Position.Top}
                className="w-1.5 h-1.5 bg-teal-400 border-none"
            />

            <div className="flex items-center gap-2">
                <BookOpen size={10} className="text-teal-500 shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">
                    Resource
                </span>
                <ExternalLink size={9} className="text-teal-400 ml-auto shrink-0" />
            </div>
            <p className="text-xs font-semibold leading-tight text-teal-800 dark:text-teal-200 mt-1 line-clamp-2">
                {data.title}
            </p>
        </div>
    );
};

// ---------- Node types registry ----------

const nodeTypes = {
    objectiveNode: ObjectiveNode,
    kgTaskNode: KGTaskNode,
    resourceNode: ResourceNode,
};

// ---------- Dagre layout ----------

/**
 * Compute positions for all nodes using dagre.
 * We force explicit ranks per node type (objective=min, task=middle, resource=max)
 * and use generous spacing so nothing overlaps.
 */
const NODE_SIZES: Record<string, { width: number; height: number }> = {
    objectiveNode: { width: 300, height: 140 },
    kgTaskNode: { width: 280, height: 160 },
    resourceNode: { width: 260, height: 110 },
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({
        rankdir: direction,
        ranksep: 300,
        nodesep: 200,
        edgesep: 100,
        marginx: 60,
        marginy: 60,
        align: 'UL',
    });

    nodes.forEach((node) => {
        const size = NODE_SIZES[node.type ?? 'kgTaskNode'] ?? { width: 260, height: 140 };
        g.setNode(node.id, { ...size });
    });

    edges.forEach((edge) => {
        g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    // Detect collisions and nudge overlapping nodes apart
    const positioned = nodes.map((node) => {
        const pos = g.node(node.id);
        const size = NODE_SIZES[node.type ?? 'kgTaskNode'] ?? { width: 260, height: 140 };
        return {
            ...node,
            targetPosition: (direction === 'TB' ? Position.Top : Position.Left) as Position,
            sourcePosition: (direction === 'TB' ? Position.Bottom : Position.Right) as Position,
            position: {
                x: pos.x - size.width / 2,
                y: pos.y - size.height / 2,
            },
        };
    });

    // Post-process: push apart any overlapping nodes
    for (let i = 0; i < positioned.length; i++) {
        const a = positioned[i];
        const aSize = NODE_SIZES[a.type ?? 'kgTaskNode'] ?? { width: 260, height: 140 };
        for (let j = i + 1; j < positioned.length; j++) {
            const b = positioned[j];
            const bSize = NODE_SIZES[b.type ?? 'kgTaskNode'] ?? { width: 260, height: 140 };

            const overlapX =
                a.position.x < b.position.x + bSize.width + 40 &&
                a.position.x + aSize.width + 40 > b.position.x;
            const overlapY =
                a.position.y < b.position.y + bSize.height + 40 &&
                a.position.y + aSize.height + 40 > b.position.y;

            if (overlapX && overlapY) {
                // Push b to the right
                b.position.x = a.position.x + aSize.width + 80;
            }
        }
    }

    return { nodes: positioned, edges };
};

// ---------- Legend ----------

function KnowledgeLegend() {
    const items = [
        { color: 'bg-indigo-500', label: 'Objective' },
        { color: 'bg-blue-500', label: 'Task' },
        { color: 'bg-teal-500', label: 'Resource' },
    ];

    const edgeItems = [
        { color: 'bg-indigo-400', label: 'Obj → Task', dashed: false },
        { color: 'bg-slate-400', label: 'Dependency', dashed: true },
        { color: 'bg-teal-400', label: 'Task → Resource', dashed: false },
    ];

    return (
        <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-lg">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">
                Knowledge Graph
            </p>
            <div className="space-y-1.5">
                {items.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className={cn('w-2.5 h-2.5 rounded-full', item.color)} />
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2 space-y-1.5">
                {edgeItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className="w-5 flex items-center">
                            <div
                                className={cn(
                                    'h-0.5 w-full rounded',
                                    item.color,
                                    item.dashed &&
                                        'border-t border-dashed border-slate-400 bg-transparent',
                                )}
                            />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------- Main component ----------

export function KnowledgeGraph({ objectives, tasks, className }: KnowledgeGraphProps) {
    const { nodes, edges } = useMemo(() => {
        const allNodes: Node[] = [];
        const allEdges: Edge[] = [];

        // 1. Objective nodes
        objectives.forEach((obj) => {
            allNodes.push({
                id: obj.id,
                type: 'objectiveNode',
                data: { objective: obj },
                position: { x: 0, y: 0 },
            });
        });

        // 2. Task nodes + edges to objectives + dependency edges
        tasks.forEach((task) => {
            const deps = task.dependsOn ?? task.dependencies ?? [];
            const isBlocked = deps.some((depId) => {
                const depTask = tasks.find((t) => t.id === depId);
                return depTask && depTask.status !== 'done';
            });

            allNodes.push({
                id: task.id,
                type: 'kgTaskNode',
                data: { task, isBlocked },
                position: { x: 0, y: 0 },
            });

            // Edge: Objective → Task
            if (task.objectiveId) {
                allEdges.push({
                    id: `e-obj-${task.objectiveId}-${task.id}`,
                    source: task.objectiveId,
                    target: task.id,
                    type: 'smoothstep',
                    animated: false,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#6366f1',
                    },
                    style: { stroke: '#6366f1', strokeWidth: 2 },
                });
            }

            // Edges: Task → Task (dependencies)
            deps.forEach((depId) => {
                allEdges.push({
                    id: `e-dep-${depId}-${task.id}`,
                    source: depId,
                    target: task.id,
                    type: 'smoothstep',
                    animated: tasks.find((t) => t.id === depId)?.status === 'doing',
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#94a3b8',
                    },
                    style: {
                        stroke: '#94a3b8',
                        strokeWidth: 2,
                        strokeDasharray: '6 3',
                    },
                });
            });

            // 3. Resource nodes + edges
            (task.resources ?? []).forEach((resource, idx) => {
                const resourceId = `res-${task.id}-${idx}`;
                allNodes.push({
                    id: resourceId,
                    type: 'resourceNode',
                    data: { title: resource.title, url: resource.url },
                    position: { x: 0, y: 0 },
                });

                allEdges.push({
                    id: `e-res-${task.id}-${resourceId}`,
                    source: task.id,
                    target: resourceId,
                    type: 'smoothstep',
                    animated: false,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#14b8a6',
                    },
                    style: { stroke: '#14b8a6', strokeWidth: 1.5 },
                });
            });
        });

        return getLayoutedElements(allNodes, allEdges);
    }, [objectives, tasks]);

    return (
        <div
            className={cn(
                'w-full h-150 bg-slate-50/50 dark:bg-black/20 rounded-[2.5rem] border border-white/20 dark:border-slate-700/50 overflow-hidden shadow-inner relative',
                className,
            )}
        >
            <KnowledgeLegend />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                minZoom={0.2}
                maxZoom={1.5}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#94a3b8" gap={20} size={1} />
                <Controls
                    showInteractive={false}
                    className="bg-white/80 dark:bg-black/80 border-none shadow-xl rounded-xl overflow-hidden"
                />
                <MiniMap
                    nodeColor={(node) => {
                        if (node.type === 'objectiveNode') return '#6366f1';
                        if (node.type === 'resourceNode') return '#14b8a6';
                        return '#64748b';
                    }}
                    className="bg-white/80 dark:bg-black/80 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden"
                    maskColor="rgba(0,0,0,0.1)"
                />
            </ReactFlow>
        </div>
    );
}
