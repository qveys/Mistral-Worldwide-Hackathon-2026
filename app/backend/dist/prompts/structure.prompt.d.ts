/**
 * System prompt for POST /structure — brain dump → structured roadmap.
 * Technique: Role + Task + Constraints + Schema + JSON-only enforcement.
 */
export declare function buildStructurePrompt(brainDump: string, includePlanning: boolean): {
    system: string;
    user: string;
};
/**
 * Build a retry prompt when Zod validation fails.
 * Includes the validation error so the model can fix its output.
 */
export declare function buildRetryPrompt(previousOutput: string, zodError: string): {
    system: string;
    user: string;
};
//# sourceMappingURL=structure.prompt.d.ts.map