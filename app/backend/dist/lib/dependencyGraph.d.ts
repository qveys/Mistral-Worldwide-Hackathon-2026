interface TaskNode {
    id: string;
    dependsOn: string[];
}
/**
 * Detect if the task dependency graph contains a cycle using DFS.
 * Returns true if a cycle is found.
 */
export declare function hasCycle(tasks: TaskNode[]): boolean;
/**
 * Topological sort of tasks based on dependsOn.
 * Returns task IDs in execution order. Throws if cycle detected.
 */
export declare function topologicalSort(tasks: TaskNode[]): string[];
export {};
//# sourceMappingURL=dependencyGraph.d.ts.map