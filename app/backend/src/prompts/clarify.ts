export function buildClarifyPrompt(brainDump: string): string {
  return `You are an AI assistant that detects ambiguity in project descriptions.

Analyze this brain dump and determine if clarification is needed:

"${brainDump}"

If the description is clear and actionable, respond with:
{"needsClarification": false}

If the description is ambiguous, vague, or missing critical information, respond with:
{"needsClarification": true, "question": "Your single most important clarifying question here"}

Rules:
- Only ask ONE question at a time
- Focus on the most critical ambiguity
- Keep the question concise and specific
- Return ONLY valid JSON, no markdown

JSON ONLY:`;
}
