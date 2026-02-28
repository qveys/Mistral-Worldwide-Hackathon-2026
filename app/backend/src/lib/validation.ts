interface TaskNode {
  id: string;
  dependsOn: string[];
  priority?: number;
}

/**
 * Validates that every ID referenced in dependsOn actually exists in the task list.
 * Throws a 400-compatible error with details about missing references.
 */
export function validateDependencyIntegrity(tasks: TaskNode[]): void {
  const ids = new Set(tasks.map((t) => t.id));
  const errors: string[] = [];

  for (const task of tasks) {
    for (const dep of task.dependsOn) {
      if (!ids.has(dep)) {
        errors.push(
          `Task "${task.id}" depends on "${dep}", which does not exist`
        );
      }
    }
  }

  if (errors.length > 0) {
    const err = new Error(
      `Invalid dependency references:\n- ${errors.join("\n- ")}`
    );
    (err as any).statusCode = 400;
    throw err;
  }
}

/**
 * Validates that no task has a higher priority (more urgent) than a task it depends on.
 * A task should not be scheduled before its dependencies.
 * Priority: 1 = low, 5 = urgent.
 * Throws a 400-compatible error if a constraint is violated.
 */
export function validateTimelineConstraints(tasks: TaskNode[]): void {
  const taskMap = new Map<string, TaskNode>();
  for (const task of tasks) {
    taskMap.set(task.id, task);
  }

  const errors: string[] = [];

  for (const task of tasks) {
    for (const depId of task.dependsOn) {
      const dep = taskMap.get(depId);
      if (!dep) continue; // integrity check handles missing deps
      if (
        task.priority !== undefined &&
        dep.priority !== undefined &&
        task.priority > dep.priority
      ) {
        errors.push(
          `Task "${task.id}" (priority ${task.priority}) depends on "${dep.id}" (priority ${dep.priority}), but has higher priority than its dependency`
        );
      }
    }
  }

  if (errors.length > 0) {
    const err = new Error(
      `Timeline constraint violations:\n- ${errors.join("\n- ")}`
    );
    (err as any).statusCode = 400;
    throw err;
  }
}
