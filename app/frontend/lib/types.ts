import type { Roadmap } from '@echomaps/shared';

export type {
    Objective,
    Task,
    PlanningSlot,
    Planning,
    RevisionEntry,
    Roadmap,
    TaskStatus,
    TaskPriority,
    TaskEstimate,
    SlotTime,
} from '@echomaps/shared';

/** Labels for locale-aware markdown export (from exportMarkdown namespace). */
export interface ExportMarkdownLabels {
    generatedOn: string;
    objectives: string;
    tasks: string;
    tableTask: string;
    tablePriority: string;
    tableEstimate: string;
    tableStatus: string;
    tableDependencies: string;
    planning: string;
    fromTo: string;
}

const DEFAULT_LABELS_FR: ExportMarkdownLabels = {
    generatedOn: 'Généré le',
    objectives: 'Objectifs',
    tasks: 'Tâches',
    tableTask: 'Tâche',
    tablePriority: 'Priorité',
    tableEstimate: 'Estimation',
    tableStatus: 'Statut',
    tableDependencies: 'Dépendances',
    planning: 'Planning',
    fromTo: 'Du {start} au {end}',
};

/**
 * Convert a Roadmap to a Markdown string for export.
 * When options is provided, uses the given locale for dates and labels for all section headers (i18n).
 */
export function roadmapToMarkdown(
    roadmap: Roadmap,
    options?: { locale: string; labels: ExportMarkdownLabels }
): string {
    const locale = options?.locale ?? 'fr-FR';
    const L = options?.labels ?? DEFAULT_LABELS_FR;
    const dateStr = new Date(roadmap.createdAt).toLocaleDateString(locale);

    const lines: string[] = [];

    lines.push(`# ${roadmap.title}`);
    lines.push('');
    lines.push(`> ${L.generatedOn} ${dateStr}`);
    lines.push('');

    lines.push(`## ${L.objectives}`);
    lines.push('');
    for (const obj of roadmap.objectives) {
        const badge = obj.priority === 'high' ? '🔴' : obj.priority === 'medium' ? '🟡' : '🔵';
        lines.push(`- ${badge} **${obj.text}** (${obj.priority})`);
    }
    lines.push('');

    lines.push(`## ${L.tasks}`);
    lines.push('');
    lines.push(`| ${L.tableTask} | ${L.tablePriority} | ${L.tableEstimate} | ${L.tableStatus} | ${L.tableDependencies} |`);
    lines.push('|-------|----------|------------|--------|-------------|');
    for (const task of roadmap.tasks) {
        const deps = task.dependsOn.length > 0 ? task.dependsOn.join(', ') : '—';
        const status = task.status === 'done' ? '✅' : task.status === 'doing' ? '🔄' : '⬜';
        lines.push(`| ${task.title} | ${task.priority} | ${task.estimate} | ${status} | ${deps} |`);
    }
    lines.push('');

    if (roadmap.planning) {
        lines.push(`## ${L.planning}`);
        lines.push('');
        const fromToStr = L.fromTo
            .replace('{start}', roadmap.planning.startDate)
            .replace('{end}', roadmap.planning.endDate);
        lines.push(fromToStr);
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
