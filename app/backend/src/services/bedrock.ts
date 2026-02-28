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

  async generateRoadmap(transcript: string, userId: string): Promise<any> {
    try {
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
    } catch (error) {
      console.error("Bedrock service error:", error);
      throw error;
    }
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

  async invokeModel(prompt: string): Promise<any> {
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

      if (response.body) {
        return JSON.parse(new TextDecoder().decode(response.body));
      }

      throw new Error("Empty response from Bedrock");
    } catch (error) {
      console.error("Bedrock invoke error:", error);
      throw error;
    }
  }
}