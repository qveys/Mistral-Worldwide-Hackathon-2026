import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { z } from "zod";

const MAX_VALIDATION_RETRIES = 2;

// Approximate pricing per token for Mistral Large on Bedrock (USD)
const PRICE_PER_INPUT_TOKEN = 0.004 / 1000;
const PRICE_PER_OUTPUT_TOKEN = 0.012 / 1000;

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
    const prompt = this.buildRoadmapPrompt(transcript);
    return this.invokeWithRetry(prompt, 'generateRoadmap', (body) => this.validateRoadmapResponse(body));
  }

  async generateRevision(roadmapId: string, instructions: string): Promise<any> {
    const prompt = this.buildRevisionPrompt(roadmapId, instructions);
    return this.invokeWithRetry(prompt, 'generateRevision', (body) => this.validateRevisionResponse(body));
  }

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
      return JSON.parse(new TextDecoder().decode(response.body));
    }

    throw new Error("Empty response from Bedrock");
  }

  private async invokeWithRetry<T>(
    prompt: string,
    operation: string,
    validate: (body: any) => T
  ): Promise<T> {
    let lastZodError: z.ZodError | undefined;

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

        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        // Estimate tokens from character lengths (rough: 1 token ≈ 4 chars)
        const promptTokens = Math.ceil(prompt.length / 4);
        const outputText = JSON.stringify(responseBody);
        const completionTokens = Math.ceil(outputText.length / 4);
        const cost = estimateCost(promptTokens, completionTokens);

        try {
          const validated = validate(responseBody);
          log('info', 'Bedrock call succeeded', { operation, attempt, latencyMs, ...cost });
          return validated;
        } catch (validationError) {
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
          } else {
            throw validationError;
          }
        }
      } catch (error) {
        const latencyMs = Date.now() - startTime;
        if (error instanceof z.ZodError) {
          lastZodError = error;
          log('warn', 'Zod validation failed, retrying', {
            operation,
            attempt,
            latencyMs,
            zodErrors: error.errors,
          });
          if (attempt <= MAX_VALIDATION_RETRIES) {
            continue;
          }
        } else {
          log('error', 'Bedrock service error', { operation, attempt, latencyMs, error: String(error) });
          throw error;
        }
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

  private buildRoadmapPrompt(transcript: string): string {
    return `You are an AI strategic planning assistant. Convert this brain dump into a structured roadmap:

${transcript}

Return ONLY valid JSON in this exact schema:
{
  "roadmap": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "priority": number (1-5),
      "dependencies": ["string"]
    }
  ],
  "metadata": {
    "processingTimeMs": number,
    "modelUsed": "string",
    "confidenceScore": number (0-1)
  }
}`;
  }

  private validateRoadmapResponse(response: any): any {
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

  private buildRevisionPrompt(roadmapId: string, instructions: string): string {
    return `Revise the existing roadmap ${roadmapId} based on these instructions:

${instructions}

Return ONLY valid JSON in this exact schema:
{
  "revisedRoadmap": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "priority": number (1-5),
      "status": "unchanged" | "modified" | "removed" | "added",
      "dependencies": ["string"]
    }
  ],
  "changesSummary": {
    "itemsModified": number,
    "itemsAdded": number,
    "itemsRemoved": number,
    "confidenceScore": number (0-1)
  }
}`;
  }

  private validateRevisionResponse(response: any): any {
    const RevisionResponseSchema = z.object({
      revisedRoadmap: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        priority: z.number().min(1).max(5),
        status: z.enum(["unchanged", "modified", "removed", "added"]),
        dependencies: z.array(z.string()).optional()
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
