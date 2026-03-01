import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { z } from "zod";
import { buildStructurePrompt } from "../prompts/structure.js";
import { buildRevisePrompt } from "../prompts/revise.js";
// Configuration schema for Bedrock
const BedrockConfigSchema = z.object({
    region: z.string().default("us-east-1"),
    modelId: z.string().default("mistral.mistral-large-2402-v1:0"),
    maxTokens: z.number().default(4096),
    temperature: z.number().min(0).max(1).default(0.7)
});
export class BedrockService {
    client;
    config;
    constructor(config) {
        this.config = BedrockConfigSchema.parse({
            region: process.env.AWS_REGION || "us-east-1",
            modelId: process.env.BEDROCK_MODEL_ID || "mistral.mistral-large-2402-v1:0",
            ...config
        });
        this.client = new BedrockRuntimeClient({ region: this.config.region });
    }
    async generateRoadmap(transcript, userId) {
        try {
            const prompt = buildStructurePrompt(transcript);
            const input = {
                modelId: this.config.modelId,
                contentType: "application/json",
                accept: "application/json",
                body: JSON.stringify({
                    prompt,
                    max_tokens: this.config.maxTokens,
                    temperature: this.config.temperature,
                    top_p: 0.9
                })
            };
            const command = new InvokeModelCommand(input);
            const response = await this.client.send(command);
            if (response.body) {
                const responseBody = JSON.parse(new TextDecoder().decode(response.body));
                return this.validateRoadmapResponse(responseBody);
            }
            throw new Error("Empty response from Bedrock");
        }
        catch (error) {
            console.error("Bedrock service error:", error);
            throw error;
        }
    }
    validateRoadmapResponse(response) {
        const RoadmapResponseSchema = z.object({
            roadmap: z.array(z.object({
                id: z.string(),
                title: z.string(),
                description: z.string(),
                priority: z.number().min(1).max(5),
                dependencies: z.array(z.string()).optional()
            })),
            metadata: z.object({
                processingTimeMs: z.number(),
                modelUsed: z.string(),
                confidenceScore: z.number().min(0).max(1)
            })
        });
        return RoadmapResponseSchema.parse(response);
    }
    async generateRevision(roadmapId, instructions) {
        try {
            const prompt = this.buildRevisionPrompt(roadmapId, instructions);
            const input = {
                modelId: this.config.modelId,
                contentType: "application/json",
                accept: "application/json",
                body: JSON.stringify({
                    prompt,
                    max_tokens: this.config.maxTokens,
                    temperature: this.config.temperature,
                    top_p: 0.9
                })
            };
            const command = new InvokeModelCommand(input);
            const response = await this.client.send(command);
            if (response.body) {
                const responseBody = JSON.parse(new TextDecoder().decode(response.body));
                return this.validateRevisionResponse(responseBody);
            }
            throw new Error("Empty response from Bedrock");
        }
        catch (error) {
            console.error("Bedrock revision error:", error);
            throw error;
        }
    }
    buildRevisionPrompt(roadmapId, instructions) {
        return buildRevisePrompt(roadmapId, instructions);
    }
    validateRevisionResponse(response) {
        const RevisionResponseSchema = z.object({
            revisedRoadmap: z.array(z.object({
                id: z.string(),
                title: z.string(),
                description: z.string(),
                priority: z.number().min(1).max(5),
                status: z.enum(["unchanged", "modified", "removed", "added"]),
                dependsOn: z.array(z.string()).default([])
            })),
            changesSummary: z.object({
                itemsModified: z.number(),
                itemsAdded: z.number(),
                itemsRemoved: z.number(),
                confidenceScore: z.number().min(0).max(1)
            })
        });
        return RevisionResponseSchema.parse(response);
    }
}
//# sourceMappingURL=bedrock.js.map