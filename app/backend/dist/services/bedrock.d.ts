import { z } from "zod";
declare const BedrockConfigSchema: z.ZodObject<{
    region: z.ZodDefault<z.ZodString>;
    modelId: z.ZodDefault<z.ZodString>;
    maxTokens: z.ZodDefault<z.ZodNumber>;
    temperature: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    region: string;
    modelId: string;
    maxTokens: number;
    temperature: number;
}, {
    region?: string | undefined;
    modelId?: string | undefined;
    maxTokens?: number | undefined;
    temperature?: number | undefined;
}>;
export declare class BedrockService {
    private client;
    private config;
    constructor(config?: Partial<z.infer<typeof BedrockConfigSchema>>);
    generateRoadmap(transcript: string, userId: string): Promise<any>;
    private buildRoadmapPrompt;
    private validateRoadmapResponse;
    generateRevision(roadmapId: string, instructions: string): Promise<any>;
    private buildRevisionPrompt;
    private validateRevisionResponse;
}
export {};
//# sourceMappingURL=bedrock.d.ts.map