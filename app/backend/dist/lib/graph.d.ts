/**
 * Detect if a directed graph has a cycle using DFS.
 * Expects adjacency as prerequisite -> dependent nodes.
 * @param adjacencyList - Map of node ID to array of dependent node IDs
 * @returns true if cycle exists
 */
export declare function hasCycle(adjacencyList: Map<string, string[]>): boolean;
/**
 * Topological sort using Kahn's algorithm.
 * Expects adjacency as prerequisite -> dependent nodes.
 * @returns sorted array of node IDs, or null if cycle exists
 */
export declare function topologicalSort(adjacencyList: Map<string, string[]>): string[] | null;
/**
 * Validate referential integrity: all dependsOn IDs must exist in the task list
 */
export declare function validateReferentialIntegrity(tasks: Array<{
    id: string;
    dependsOn?: string[];
}>): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=graph.d.ts.map