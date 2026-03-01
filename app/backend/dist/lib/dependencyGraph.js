/**
 * Detect if the task dependency graph contains a cycle using DFS.
 * Returns true if a cycle is found.
 */
export function hasCycle(tasks) {
    const WHITE = 0; // not visited
    const GRAY = 1; // in current DFS path
    const BLACK = 2; // fully processed
    const color = new Map();
    const adj = new Map();
    const validIds = new Set(tasks.map((task) => task.id));
    for (const task of tasks) {
        color.set(task.id, WHITE);
        adj.set(task.id, task.dependsOn.filter((dep) => validIds.has(dep)));
    }
    function dfs(nodeId) {
        color.set(nodeId, GRAY);
        const neighbors = adj.get(nodeId) ?? [];
        for (const neighbor of neighbors) {
            const neighborColor = color.get(neighbor);
            if (neighborColor === GRAY)
                return true; // back edge → cycle
            if (neighborColor === WHITE && dfs(neighbor))
                return true;
        }
        color.set(nodeId, BLACK);
        return false;
    }
    for (const task of tasks) {
        if (color.get(task.id) === WHITE) {
            if (dfs(task.id))
                return true;
        }
    }
    return false;
}
/**
 * Topological sort of tasks based on dependsOn.
 * Returns task IDs in execution order. Throws if cycle detected.
 */
export function topologicalSort(tasks) {
    if (hasCycle(tasks)) {
        throw new Error('Cannot topologically sort: cycle detected in task dependencies');
    }
    const inDegree = new Map();
    const adj = new Map();
    const validIds = new Set(tasks.map((t) => t.id));
    for (const task of tasks) {
        inDegree.set(task.id, 0);
        adj.set(task.id, []);
    }
    for (const task of tasks) {
        for (const dep of task.dependsOn) {
            if (validIds.has(dep)) {
                adj.get(dep).push(task.id);
                inDegree.set(task.id, (inDegree.get(task.id) ?? 0) + 1);
            }
        }
    }
    const queue = [];
    for (const [id, degree] of inDegree) {
        if (degree === 0)
            queue.push(id);
    }
    const sorted = [];
    while (queue.length > 0) {
        const current = queue.shift();
        sorted.push(current);
        for (const neighbor of adj.get(current) ?? []) {
            const newDegree = (inDegree.get(neighbor) ?? 1) - 1;
            inDegree.set(neighbor, newDegree);
            if (newDegree === 0)
                queue.push(neighbor);
        }
    }
    return sorted;
}
//# sourceMappingURL=dependencyGraph.js.map