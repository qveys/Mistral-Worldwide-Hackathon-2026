'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node, 
  Position, 
  MarkerType,
  Handle,
  ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import { cn } from '@/lib/utils';
import { Task, TaskStatus } from '../ui/TaskCard';
import { Lock, CheckCircle2, Clock, Zap } from 'lucide-react';

interface DependencyGraphProps {
  tasks: Task[];
  onStatusChange?: (id: string, newStatus: TaskStatus) => void;
  className?: string;
}

// Custom Node Component
const TaskNode = ({ data }: { data: { task: Task; isBlocked: boolean } }) => {
  const { task, isBlocked } = data;
  
  const statusStyles = {
    backlog: "border-slate-200 bg-white/80 text-slate-600 dark:bg-slate-900 dark:border-white/10 dark:text-slate-400",
    doing: "border-blue-500 bg-blue-50/90 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
    done: "border-green-500 bg-green-50/90 text-green-700 dark:bg-green-900/20 dark:text-green-300 opacity-60",
  };

  const Icon = task.status === 'done' ? CheckCircle2 : (task.status === 'doing' ? Clock : Zap);

  return (
    <div className={cn(
      "px-4 py-3 rounded-xl border-2 shadow-xl backdrop-blur-md min-w-[180px] transition-all relative",
      statusStyles[task.status],
      isBlocked && "opacity-40 grayscale border-slate-400"
    )}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-slate-400 border-none" />
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
            {isBlocked ? 'Blocked' : task.status}
          </span>
          {isBlocked ? <Lock size={12} className="text-red-500" /> : <Icon size={12} />}
        </div>
        <p className="text-sm font-bold leading-tight line-clamp-2">
          {task.title}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className={cn(
            "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase border",
            task.priority === 'high' ? "border-red-200 text-red-500" : "border-slate-200 text-slate-400"
          )}>
            {task.priority}
          </div>
          <div className="text-[8px] font-bold text-slate-400">
            Size: {task.estimate}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-slate-400 border-none" />
    </div>
  );
};

const nodeTypes = {
  taskNode: TaskNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const nodeWidth = 200;
  const nodeHeight = 100;
  
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = direction === 'TB' ? Position.Top : Position.Left;
    node.sourcePosition = direction === 'TB' ? Position.Bottom : Position.Right;

    // We are shifting the dagre node position (which is center-based) to top-left
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

export function DependencyGraph({ tasks, onStatusChange, className }: DependencyGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = tasks.map((task) => {
      // Check if blocked by any uncompleted task
      const isBlocked = task.dependencies?.some(depId => {
        const depTask = tasks.find(t => t.id === depId);
        return depTask && depTask.status !== 'done';
      }) ?? false;

      return {
        id: task.id,
        type: 'taskNode',
        data: { task, isBlocked },
        position: { x: 0, y: 0 },
      };
    });

    const edges: Edge[] = [];
    tasks.forEach((task) => {
      task.dependencies?.forEach((depId) => {
        edges.push({
          id: `e-${depId}-${task.id}`,
          source: depId,
          target: task.id,
          type: 'smoothstep',
          animated: tasks.find(t => t.id === depId)?.status === 'doing',
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#94a3b8',
          },
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        });
      });
    });

    return getLayoutedElements(nodes, edges);
  }, [tasks]);

  return (
    <div className={cn("w-full h-[600px] bg-slate-50/50 dark:bg-black/20 rounded-[2.5rem] border border-white/20 overflow-hidden shadow-inner", className)}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#94a3b8" gap={20} size={1} opacity={0.2} />
        <Controls showInteractive={false} className="bg-white/80 dark:bg-black/80 border-none shadow-xl rounded-xl overflow-hidden" />
      </ReactFlow>
    </div>
  );
}
