export function buildStructurePrompt(brainDump: string): string {
  return `You are an AI strategic planning assistant. Your task is to convert a brain dump into a structured project roadmap.

## Brain Dump
${brainDump}

## Instructions
- Analyze the brain dump and extract actionable tasks
- Organize tasks by priority (1=highest, 5=lowest)
- Identify dependencies between tasks
- Generate unique IDs for each task

Return ONLY valid JSON, no markdown, no explanation. Use this exact schema:
{
  "roadmap": [
    {
      "id": "task-1",
      "title": "string",
      "description": "string",
      "priority": 1-5,
      "dependencies": ["task-id"]
    }
  ],
  "metadata": {
    "processingTimeMs": 0,
    "modelUsed": "mistral-large",
    "confidenceScore": 0.0-1.0
  }
}

JSON ONLY:`;
}
