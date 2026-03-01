import type { Roadmap } from '../lib/schema.js';
/**
 * Builds the prompt sent to Mistral for revising an existing roadmap.
 *
 * @param roadmap  The current roadmap JSON object
 * @param instruction  User instruction in clear text (e.g. "Met X en urgent")
 * @returns  The formatted prompt string
 */
export declare function buildRevisePrompt(roadmap: Roadmap, instruction: string): string;
//# sourceMappingURL=revise.d.ts.map