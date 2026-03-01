import { z } from "zod";
declare const BedrockConfigSchema: z.ZodObject<{
    region: z.ZodDefault<z.ZodString>;
    modelId: z.ZodDefault<z.ZodString>;
    maxTokens: z.ZodDefault<z.ZodNumber>;
    temperature: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare class BedrockService {
    private client;
    private config;
    constructor(config?: Partial<z.infer<typeof BedrockConfigSchema>>);
    generateRoadmap(transcript: string, userId: string): Promise<any>;
    private validateRoadmapResponse;
}
export {};
//# sourceMappingURL=bedrock.d.ts.map