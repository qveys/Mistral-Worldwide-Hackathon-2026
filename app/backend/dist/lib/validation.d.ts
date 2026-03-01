interface TaskNode {
    id: string;
    dependsOn: string[];
    priority?: number;
}
/**
 * Validates that every ID referenced in dependsOn actually exists in the task list.
 * Throws a 400-compatible error with details about missing references.
 */
export declare function validateDependencyIntegrity(tasks: TaskNode[]): void;
/**
 * Validates that no task has a higher priority (more urgent) than a task it depends on.
 * A task should not be scheduled before its dependencies.
 * Priority: 1 = low, 5 = urgent.
 * Throws a 400-compatible error if a constraint is violated.
 */
export declare function validateTimelineConstraints(tasks: TaskNode[]): void;
export {};
//# sourceMappingURL=validation.d.ts.map