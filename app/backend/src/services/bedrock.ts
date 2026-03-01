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
  constructor(
    message: string,
    public readonly attempts: number,
    public readonly lastZodError: z.ZodError
  ) {
    super(message);
    this.name = 'BedrockValidationExhaustedError';
  }
}

function log(level: string, message: string, extra: Record<string, unknown> = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    service: 'bedrock',
    message,
    ...extra,
  };
  if (level === 'error') {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

function estimateCost(promptTokens: number, completionTokens: number) {
  return {
    inputTokens: promptTokens,
    outputTokens: completionTokens,
    estimatedCostUsd:
      promptTokens * PRICE_PER_INPUT_TOKEN +
      completionTokens * PRICE_PER_OUTPUT_TOKEN,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function extractMistralOutputText(responseEnvelope: unknown): string | null {
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
  private client: BedrockRuntimeClient;
  private config: z.infer<typeof BedrockConfigSchema>;

  constructor(config?: Partial<z.infer<typeof BedrockConfigSchema>>) {
    this.config = BedrockConfigSchema.parse({
      region: process.env.AWS_REGION || "us-east-1",
      modelId: process.env.BEDROCK_MODEL_ID || "mistral.mistral-large-2402-v1:0",
      ...config
    });

    this.client = new BedrockRuntimeClient({ region: this.config.region });
  }

  async generateRoadmap(transcript: string, userId: string): Promise<any> {
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

  async invokeModel(prompt: string): Promise<any> {
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
      const responseEnvelope = JSON.parse(new TextDecoder().decode(response.body));
      const outputText = extractMistralOutputText(responseEnvelope);
      if (outputText !== null) {
        return JSON.parse(outputText);
      }
      return responseEnvelope;
    }

    throw new Error("Empty response from Bedrock");
  }

  async invokeModelWithRetry<T>(
    prompt: string,
    operation: string,
    validate: (body: unknown) => T
  ): Promise<T> {
    return this.invokeWithRetry(prompt, operation, validate);
  }

  private async invokeWithRetry<T>(
    prompt: string,
    operation: string,
    validate: (body: unknown) => T
  ): Promise<T> {
    const totalAttempts = MAX_VALIDATION_RETRIES + 1;
    let lastZodError: z.ZodError | undefined;

    for (let attempt = 1; attempt <= totalAttempts; attempt++) {
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
        let responseBody: unknown = responseEnvelope;
        if (outputText !== null) {
          try {
            responseBody = JSON.parse(outputText);
          } catch (parseError) {
            log('warn', 'Model output is not valid JSON, retrying', {
              operation,
              attempt,
              maxRetries: MAX_VALIDATION_RETRIES,
              totalAttempts,
              latencyMs,
              error: String(parseError),
            });
            if (attempt <= MAX_VALIDATION_RETRIES) {
              const delayMs = 1000 * (2 ** (attempt - 1));
              await new Promise((resolve) => setTimeout(resolve, delayMs));
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
          log('info', 'Bedrock call succeeded', {
            operation,
            attempt,
            maxRetries: MAX_VALIDATION_RETRIES,
            totalAttempts,
            latencyMs,
            ...cost,
          });
          return validated;
        } catch (validationError) {
          if (validationError instanceof z.ZodError) {
            lastZodError = validationError;
            log('warn', 'Zod validation failed, retrying', {
              operation,
              attempt,
              maxRetries: MAX_VALIDATION_RETRIES,
              totalAttempts,
              latencyMs,
              zodErrors: validationError.errors,
              ...cost,
            });
            if (attempt <= MAX_VALIDATION_RETRIES) {
              const delayMs = 1000 * (2 ** (attempt - 1));
              await new Promise((resolve) => setTimeout(resolve, delayMs));
              continue;
            }
          } else {
            throw validationError;
          }
        }
      } catch (error) {
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

    throw new BedrockValidationExhaustedError(
      `Bedrock response validation failed after ${MAX_VALIDATION_RETRIES + 1} attempts`,
      MAX_VALIDATION_RETRIES + 1,
      lastZodError!
    );
  }

  private validateRoadmapResponse(response: any): any {
    const RoadmapResponseSchema = z.object({
      roadmap: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        priority: z.number().min(1).max(5),
        dependsOn: z.array(z.string()).default([])
      })),
      metadata: z.object({
        processingTimeMs: z.number(),
        modelUsed: z.string(),
        confidenceScore: z.number().min(0).max(1)
      })
    });

    return RoadmapResponseSchema.parse(response);
  }

  async generateRevision(roadmapId: string, instructions: string): Promise<any> {
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
    } catch (error) {
      console.error("Bedrock revision error:", error);
      throw error;
    }
  }

  private buildRevisionPrompt(roadmapId: string, instructions: string): string {
    return buildRevisePrompt(roadmapId, instructions);
  }

  private validateRevisionResponse(response: any): any {
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
