interface TaskNode {
  id: string;
  dependsOn: string[];
}

/**
 * Detects whether the task dependency graph contains a cycle using DFS.
 */
export function hasCycle(tasks: TaskNode[]): boolean {
  const adj = new Map<string, string[]>();
  for (const task of tasks) {
    adj.set(task.id, task.dependsOn);
  }

  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  for (const task of tasks) {
    color.set(task.id, WHITE);
  }

  function dfs(node: string): boolean {
    color.set(node, GRAY);
    for (const dep of adj.get(node) ?? []) {
      const c = color.get(dep);
      if (c === GRAY) return true;
      if (c === WHITE && dfs(dep)) return true;
    }
    color.set(node, BLACK);
    return false;
  }

  for (const task of tasks) {
    if (color.get(task.id) === WHITE && dfs(task.id)) {
      return true;
    }
  }

  return false;
}

/**
 * Returns tasks in topological order (dependencies first) using Kahn's algorithm.
 * Throws an Error if the graph contains a cycle.
 */
export function topologicalSort(tasks: TaskNode[]): TaskNode[] {
  const taskMap = new Map<string, TaskNode>();
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const task of tasks) {
    taskMap.set(task.id, task);
    inDegree.set(task.id, 0);
    adj.set(task.id, []);
  }

  for (const task of tasks) {
    for (const dep of task.dependsOn) {
      // dep → task (task depends on dep, so dep must come first)
      const neighbors = adj.get(dep);
      if (!neighbors) {
        throw new Error(`Unknown dependency "${dep}" referenced by task "${task.id}"`);
      }
      neighbors.push(task.id);
      inDegree.set(task.id, (inDegree.get(task.id) ?? 0) + 1);
    }
  }

  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id);
  }

  const sorted: TaskNode[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(taskMap.get(current)!);

    for (const neighbor of adj.get(current) ?? []) {
      const newDegree = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    }
  }

  if (sorted.length !== tasks.length) {
    throw new Error("Cycle detected in dependency graph — topological sort is impossible");
  }

  return sorted;
}
