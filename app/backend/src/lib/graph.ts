/**
 * Detect if a directed graph has a cycle using DFS
 * @param adjacencyList - Map of node ID to array of dependent node IDs
 * @returns true if cycle exists
 */
export function hasCycle(adjacencyList: Map<string, string[]>): boolean {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function dfs(node: string): boolean {
    visited.add(node);
    recursionStack.add(node);

    const neighbors = adjacencyList.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(node);
    return false;
  }

  for (const node of adjacencyList.keys()) {
    if (!visited.has(node)) {
      if (dfs(node)) return true;
    }
  }

  return false;
}

/**
 * Topological sort using Kahn's algorithm
 * @returns sorted array of node IDs, or null if cycle exists
 */
export function topologicalSort(adjacencyList: Map<string, string[]>): string[] | null {
  const inDegree = new Map<string, number>();

  // Initialize in-degrees
  for (const node of adjacencyList.keys()) {
    if (!inDegree.has(node)) inDegree.set(node, 0);
    for (const dep of adjacencyList.get(node) || []) {
      inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
    }
  }

  const queue: string[] = [];
  for (const [node, degree] of inDegree) {
    if (degree === 0) queue.push(node);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    sorted.push(node);
    for (const neighbor of adjacencyList.get(node) || []) {
      const newDegree = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    }
  }

  return sorted.length === inDegree.size ? sorted : null;
}

/**
 * Validate referential integrity: all dependsOn IDs must exist in the task list
 */
export function validateReferentialIntegrity(
  tasks: Array<{ id: string; dependsOn?: string[] }>
): { valid: boolean; errors: string[] } {
  const taskIds = new Set(tasks.map(t => t.id));
  const errors: string[] = [];

  for (const task of tasks) {
    if (task.dependsOn) {
      for (const depId of task.dependsOn) {
        if (!taskIds.has(depId)) {
          errors.push(`Task "${task.id}" depends on unknown task "${depId}"`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
