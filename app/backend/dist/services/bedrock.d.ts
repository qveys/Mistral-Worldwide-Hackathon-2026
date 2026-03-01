import { z } from "zod";
declare const BedrockConfigSchema: z.ZodObject<{
    region: z.ZodDefault<z.ZodString>;
    modelId: z.ZodDefault<z.ZodString>;
    maxTokens: z.ZodDefault<z.ZodNumber>;
    temperature: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare class BedrockValidationExhaustedError extends Error {
    readonly attempts: number;
    readonly lastZodError: z.ZodError;
    constructor(message: string, attempts: number, lastZodError: z.ZodError);
}
export declare class BedrockService {
    private client;
    private config;
    constructor(config?: Partial<z.infer<typeof BedrockConfigSchema>>);
    generateRoadmap(transcript: string): Promise<any>;
    invokeModel(prompt: string): Promise<any>;
    invokeModelWithRetry<T>(prompt: string, operation: string, validate: (body: unknown) => T): Promise<T>;
    private invokeWithRetry;
    private buildRoadmapPrompt;
    private validateRoadmapResponse;
}
export {};
//# sourceMappingURL=bedrock.d.ts.map