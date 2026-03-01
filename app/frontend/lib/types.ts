export type TaskStatus = 'backlog' | 'doing' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskEstimate = 'S' | 'M' | 'L';
export type SlotTime = 'AM' | 'PM';

export interface Objective {
    id: string;
    text: string;
    priority: TaskPriority;
}

export interface Task {
    id: string;
    title: string;
    objectiveId: string;
    status: TaskStatus;
    estimate: TaskEstimate;
    priority: TaskPriority;
    dependsOn: string[];
}

export interface PlanningSlot {
    taskId: string;
    day: string; // ISO date "YYYY-MM-DD"
    slot: SlotTime;
    done: boolean;
}

export interface Planning {
    startDate: string;
    endDate: string;
    slots: PlanningSlot[];
}

export interface RevisionEntry {
    timestamp: string;
    patch: string;
}

export interface Roadmap {
    projectId: string;
    title: string;
    createdAt: string;
    brainDump: string;
    objectives: Objective[];
    tasks: Task[];
    planning?: Planning;
    revisionHistory: RevisionEntry[];
}

/**
 * Convert a Roadmap to a Markdown string for export.
 */
export function roadmapToMarkdown(roadmap: Roadmap): string {
    const lines: string[] = [];

    lines.push(`# ${roadmap.title}`);
    lines.push('');
    lines.push(`> Généré le ${new Date(roadmap.createdAt).toLocaleDateString('fr-FR')}`);
    lines.push('');

    // Objectives
    lines.push('## Objectifs');
    lines.push('');
    for (const obj of roadmap.objectives) {
        const badge = obj.priority === 'high' ? '🔴' : obj.priority === 'medium' ? '🟡' : '🔵';
        lines.push(`- ${badge} **${obj.text}** (${obj.priority})`);
    }
    lines.push('');

    // Tasks
    lines.push('## Tâches');
    lines.push('');
    lines.push('| Tâche | Priorité | Estimation | Statut | Dépendances |');
    lines.push('|-------|----------|------------|--------|-------------|');
    for (const task of roadmap.tasks) {
        const deps = task.dependsOn.length > 0 ? task.dependsOn.join(', ') : '—';
        const status = task.status === 'done' ? '✅' : task.status === 'doing' ? '🔄' : '⬜';
        lines.push(`| ${task.title} | ${task.priority} | ${task.estimate} | ${status} | ${deps} |`);
    }
    lines.push('');

    // Planning
    if (roadmap.planning) {
        lines.push('## Planning');
        lines.push('');
        lines.push(`Du ${roadmap.planning.startDate} au ${roadmap.planning.endDate}`);
        lines.push('');

        const slotsByDay = new Map<string, typeof roadmap.planning.slots>();
        for (const slot of roadmap.planning.slots) {
            const existing = slotsByDay.get(slot.day) ?? [];
            existing.push(slot);
            slotsByDay.set(slot.day, existing);
        }

        for (const [day, slots] of slotsByDay) {
            lines.push(`### ${day}`);
            for (const slot of slots) {
                const task = roadmap.tasks.find((t) => t.id === slot.taskId);
                const check = slot.done ? '[x]' : '[ ]';
                lines.push(`- ${check} **${slot.slot}** — ${task?.title ?? slot.taskId}`);
            }
            lines.push('');
        }
    }

    return lines.join('\n');
}
