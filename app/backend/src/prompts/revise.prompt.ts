/**
 * System prompt for POST /revise — apply user instruction to existing roadmap.
 */

export function buildRevisePrompt(
    currentRoadmap: string,
    instruction: string,
): { system: string; user: string } {
    const system = `You are a project revision assistant. You will receive an existing roadmap JSON and a user instruction.
Apply the instruction to the roadmap and return the UPDATED roadmap JSON.

RULES:
1. Detect the language of the instruction and the existing roadmap. Keep the same language.
2. Only modify what the instruction asks for. Do not remove or alter unrelated fields.
3. If the instruction adds tasks, generate new unique IDs (e.g., "task-N+1").
4. If the instruction changes priorities or dependencies, update accordingly.
5. Maintain valid dependsOn references — do not create cycles.
6. Keep projectId, createdAt, and brainDump unchanged.
7. Add an entry to revisionHistory with the current timestamp and instruction as patch.

OUTPUT FORMAT:
Return ONLY valid JSON. No markdown fences. No explanation. No text before or after the JSON.`;

    const user = `Current roadmap:
${currentRoadmap}

User instruction:
${instruction}`;

    return { system, user };
}
