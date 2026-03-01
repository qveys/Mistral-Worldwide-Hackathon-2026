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
export class BedrockValidationExhaustedError extends Error {
    attempts;
    lastZodError;
    constructor(message, attempts, lastZodError) {
        super(message);
        this.attempts = attempts;
        this.lastZodError = lastZodError;
        this.name = 'BedrockValidationExhaustedError';
    }
}
function log(level, message, extra = {}) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        service: 'bedrock',
        message,
        ...extra,
    };
    if (level === 'error') {
        console.error(JSON.stringify(entry));
    }
    else {
        console.log(JSON.stringify(entry));
    }
}
function estimateCost(promptTokens, completionTokens) {
    return {
        inputTokens: promptTokens,
        outputTokens: completionTokens,
        estimatedCostUsd: promptTokens * PRICE_PER_INPUT_TOKEN +
            completionTokens * PRICE_PER_OUTPUT_TOKEN,
    };
}
function isRecord(value) {
    return typeof value === 'object' && value !== null;
}
function extractMistralOutputText(responseEnvelope) {
    if (!isRecord(responseEnvelope)) {
        return null;
    }
    const outputs = responseEnvelope.outputs;
    if (!Array.isArray(outputs) || outputs.length === 0) {
        return null;
    }
    const firstOutput = outputs[0];
    if (!isRecord(firstOutput)) {
        return null;
    }
    return typeof firstOutput.text === 'string' ? firstOutput.text : null;
}
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
            return responseEnvelope;
        }
        throw new Error("Empty response from Bedrock");
    }
    async invokeModelWithRetry(prompt, operation, validate) {
        return this.invokeWithRetry(prompt, operation, validate);
    }
    async invokeWithRetry(prompt, operation, validate) {
        let lastZodError;
        for (let attempt = 1; attempt <= MAX_VALIDATION_RETRIES + 1; attempt++) {
            const startTime = Date.now();
            try {
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
                const latencyMs = Date.now() - startTime;
                if (!response.body) {
                    throw new Error("Empty response from Bedrock");
                }
                const responseEnvelope = JSON.parse(new TextDecoder().decode(response.body));
                const outputText = extractMistralOutputText(responseEnvelope);
                let responseBody = responseEnvelope;
                if (outputText !== null) {
                    try {
                        responseBody = JSON.parse(outputText);
                    }
                    catch (parseError) {
                        log('warn', 'Model output is not valid JSON, retrying', {
                            operation,
                            attempt,
                            latencyMs,
                            error: String(parseError),
                        });
                        if (attempt <= MAX_VALIDATION_RETRIES) {
                            continue;
                        }
                        throw parseError;
                    }
                }
                // Estimate tokens from character lengths (rough: 1 token ≈ 4 chars)
                const promptTokens = Math.ceil(prompt.length / 4);
                const outputForCost = outputText ?? JSON.stringify(responseBody);
                const completionTokens = Math.ceil(outputForCost.length / 4);
                const cost = estimateCost(promptTokens, completionTokens);
                try {
                    const validated = validate(responseBody);
                    log('info', 'Bedrock call succeeded', { operation, attempt, latencyMs, ...cost });
                    return validated;
                }
                catch (validationError) {
                    if (validationError instanceof z.ZodError) {
                        lastZodError = validationError;
                        log('warn', 'Zod validation failed, retrying', {
                            operation,
                            attempt,
                            latencyMs,
                            zodErrors: validationError.errors,
                            ...cost,
                        });
                        if (attempt <= MAX_VALIDATION_RETRIES) {
                            continue;
                        }
                    }
                    else {
                        throw validationError;
                    }
                }
            }
            catch (error) {
                const latencyMs = Date.now() - startTime;
                log('error', 'Bedrock service error', { operation, attempt, latencyMs, error: String(error) });
                throw error;
            }
        }
        log('error', 'Bedrock validation retries exhausted', {
            operation,
            maxRetries: MAX_VALIDATION_RETRIES,
            zodErrors: lastZodError?.errors,
        });
        throw new BedrockValidationExhaustedError(`Bedrock response validation failed after ${MAX_VALIDATION_RETRIES + 1} attempts`, MAX_VALIDATION_RETRIES + 1, lastZodError);
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