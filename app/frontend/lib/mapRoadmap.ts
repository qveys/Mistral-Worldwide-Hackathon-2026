import type { Roadmap, Task } from '@echomaps/shared';

/** View model for a single objective in the canvas (with display color). */
export interface RoadmapObjectiveView {
    id: string;
    title: string;
    color: string;
}

/** View model for a task in the canvas (compatible with TaskCard). */
export interface RoadmapTaskView extends Task {
    isBlocked?: boolean;
    blockedBy?: string[];
}

/** View model for a time slot in the canvas (day index + period + tasks). */
export interface RoadmapTimeSlotView {
    day: number;
    period: 'AM' | 'PM';
    tasks: RoadmapTaskView[];
}

/** View model for the roadmap canvas (timeSlots instead of planning.slots). */
export interface RoadmapCanvasView {
    id: string;
    title: string;
    objectives: RoadmapObjectiveView[];
    timeSlots: RoadmapTimeSlotView[];
}

const PRIORITY_COLORS: Record<string, string> = {
    high: 'blue',
    medium: 'orange',
    low: 'green',
};

/**
 * Convert API roadmap to the canvas view shape (timeSlots by day index + period).
 */
export function mapRoadmapToCanvasView(roadmap: Roadmap): RoadmapCanvasView {
    const objectives: RoadmapObjectiveView[] = roadmap.objectives.map((obj) => ({
        id: obj.id,
        title: obj.text,
        color: PRIORITY_COLORS[obj.priority] ?? 'blue',
    }));

    const taskMap = new Map(roadmap.tasks.map((t) => [t.id, t]));

    const timeSlots: RoadmapTimeSlotView[] = [];
    if (roadmap.planning) {
        const slots = roadmap.planning.slots;
        const dayOrder = [...new Set(slots.map((s) => s.day))].sort();
        const dayToIndex = new Map(dayOrder.map((d, i) => [d, i + 1]));

        const key = (day: string, period: 'AM' | 'PM') => `${day}:${period}`;
        const bySlot = new Map<string, RoadmapTaskView[]>();
        for (const s of slots) {
            const k = key(s.day, s.slot);
            const task = taskMap.get(s.taskId);
            if (!task) continue;
            const list = bySlot.get(k) ?? [];
            list.push({ ...task } as RoadmapTaskView);
            bySlot.set(k, list);
        }

        for (const day of dayOrder) {
            const dayIdx = dayToIndex.get(day) ?? 0;
            for (const period of ['AM', 'PM'] as const) {
                const tasks = bySlot.get(key(day, period)) ?? [];
                if (tasks.length > 0) {
                    timeSlots.push({ day: dayIdx, period, tasks });
                }
            }
        }
    }

    return {
        id: roadmap.projectId,
        title: roadmap.title,
        objectives,
        timeSlots,
    };
}
