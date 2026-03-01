import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { z } from "zod";

// Configuration schema for Bedrock
const BedrockConfigSchema = z.object({
  region: z.string().default("us-east-1"),
  modelId: z.string().default("mistral.mistral-large-2402-v1:0"),
  maxTokens: z.number().default(4096),
  temperature: z.number().min(0).max(1).default(0.7)
});

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

  private async withRetry<T>(operation: () => Promise<T>, operationName: string, maxRetries = 2): Promise<T> {
    const totalAttempts = maxRetries + 1;
    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= totalAttempts; attempt++) {
      try {
        console.log(JSON.stringify({ level: "info", operation: operationName, attempt, maxRetries, totalAttempts }));
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.log(JSON.stringify({ level: "warn", operation: operationName, attempt, error: lastError.message }));
        if (attempt <= maxRetries) {
          const delayMs = 1000 * (2 ** (attempt - 1));
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    console.log(JSON.stringify({ level: "error", operation: operationName, message: "All retries failed" }));
    throw lastError;
  }

  async generateRoadmap(transcript: string, userId: string): Promise<any> {
    return this.withRetry(async () => {
      const prompt = this.buildRoadmapPrompt(transcript);

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
    }, "generateRoadmap");
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

  async generateRevision(roadmapId: string, instructions: string): Promise<any> {
    return this.withRetry(async () => {
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
    }, "generateRevision");
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
