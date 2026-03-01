/**
 * System prompt for POST /structure — brain dump → structured roadmap.
 * Technique: Role + Task + Constraints + Schema + JSON-only enforcement.
 */

const ROADMAP_SCHEMA_DESCRIPTION = `
{
  "projectId": "",
  "title": "string — concise project title derived from the brain dump",
  "createdAt": "ISO 8601 timestamp",
  "brainDump": "string — the original input text",
  "objectives": [
    {
      "id": "obj-1",
      "text": "Clear, actionable objective",
      "priority": "high | medium | low"
    }
  ],
  "tasks": [
    {
      "id": "task-1",
      "title": "Atomic task description",
      "objectiveId": "obj-1",
      "status": "backlog",
      "estimate": "S | M | L",
      "priority": "high | medium | low",
      "dependsOn": []
    }
  ],
  "revisionHistory": []
}`;

const PLANNING_SCHEMA_DESCRIPTION = `
  "planning": {
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "slots": [
      {
        "taskId": "task-1",
        "day": "YYYY-MM-DD",
        "slot": "AM | PM",
        "done": false
      }
    ]
  }`;

const SYSTEM_BASE = `You are an expert project manager and organizer. Your job is to transform a chaotic brain dump into a clean, structured roadmap.

RULES:
1. Detect the language of the input text. Generate ALL content (title, objectives, tasks) in that SAME language.
2. Identify distinct, actionable objectives from the brain dump.
3. Break each objective into atomic tasks (1 action = 1 task).
4. Assign priorities (high/medium/low) based on urgency and importance.
5. Set ALL task statuses to "backlog".
6. Assign realistic estimates: S (< 1h), M (1-4h), L (> 4h).
7. Only add dependsOn when a clear prerequisite relationship exists. If unsure, use an empty array.
8. Generate unique IDs: "obj-1", "obj-2" for objectives; "task-1", "task-2" for tasks.
9. Leave projectId as an empty string (it will be assigned server-side).
10. Set createdAt to the current ISO timestamp.

OUTPUT FORMAT:
Return ONLY valid JSON. No markdown fences. No explanation. No text before or after the JSON.`;

export function buildStructurePrompt(
    brainDump: string,
    includePlanning: boolean,
): {
    system: string;
    user: string;
} {
    let system = SYSTEM_BASE;

    if (includePlanning) {
        system += `

PLANNING:
Since the user requested a planning, also include a "planning" field in the JSON.
- Distribute tasks across realistic days, using AM and PM slots.
- Start from tomorrow. Each day should have at most 2 slots (AM + PM).
- Respect task dependencies: a task cannot be scheduled before its dependencies.
- Set all "done" fields to false.
- The planning field must follow this schema:
${PLANNING_SCHEMA_DESCRIPTION}`;
    }

    system += `

JSON SCHEMA:
${ROADMAP_SCHEMA_DESCRIPTION}${includePlanning ? '\n  // + planning field as described above' : ''}`;

    const user = `Here is the brain dump to structure:\n\n${brainDump}`;

    return { system, user };
}

/**
 * Build a retry prompt when Zod validation fails.
 * Includes the validation error so the model can fix its output.
 */
export function buildRetryPrompt(
    previousOutput: string,
    zodError: string,
): { system: string; user: string } {
    const system = `You are a JSON correction assistant. The previous JSON output failed schema validation.
Fix the JSON to match the required schema. Return ONLY valid JSON. No explanation.`;

    const user = `Previous output:
${previousOutput}

Validation error:
${zodError}

Fix the JSON and return it.`;

    return { system, user };
}
