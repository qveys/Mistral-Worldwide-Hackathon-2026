interface TaskNode {
    id: string;
    dependsOn: string[];
}
/**
 * Detects whether the task dependency graph contains a cycle using DFS.
 */
export declare function hasCycle(tasks: TaskNode[]): boolean;
/**
 * Returns tasks in topological order (dependencies first) using Kahn's algorithm.
 * Throws an Error if the graph contains a cycle.
 */
export declare function topologicalSort(tasks: TaskNode[]): TaskNode[];
export {};
//# sourceMappingURL=dependencyGraph.d.ts.map