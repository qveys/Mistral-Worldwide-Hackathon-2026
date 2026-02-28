export function buildRevisePrompt(currentRoadmap: string, instructions: string): string {
  return `You are an AI assistant that revises project roadmaps based on user feedback.

## Current Roadmap
${currentRoadmap}

## Revision Instructions
${instructions}

## Rules
- Update the roadmap according to the instructions
- Each task MUST have a "dependsOn" array (empty if no dependencies)
- Mark each task's status: "unchanged", "modified", "removed", or "added"
- Ensure no circular dependencies exist
- Maintain referential integrity (dependsOn IDs must reference existing tasks)
- Re-order tasks respecting dependency constraints

Return ONLY valid JSON:
{
  "revisedRoadmap": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "priority": 1-5,
      "status": "unchanged|modified|removed|added",
      "dependsOn": ["task-id"]
    }
  ],
  "changesSummary": {
    "itemsModified": number,
    "itemsAdded": number,
    "itemsRemoved": number,
    "confidenceScore": 0.0-1.0
  }
}

JSON ONLY:`;
}
