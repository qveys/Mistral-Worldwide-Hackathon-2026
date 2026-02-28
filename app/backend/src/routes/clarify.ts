import { Router } from 'express';
import { z } from 'zod';
import { BedrockService } from '../services/bedrock.js';
import { buildClarifyPrompt } from '../prompts/clarify.js';

const router = Router();
const bedrockService = new BedrockService();

const ClarifyRequestSchema = z.object({
  brainDump: z.string().min(10, 'Brain dump too short'),
});

const ClarifyResponseSchema = z.object({
  needsClarification: z.boolean(),
  question: z.string().optional(),
});

router.post('/', async (req, res) => {
  try {
    const { brainDump } = ClarifyRequestSchema.parse(req.body);

    const prompt = buildClarifyPrompt(brainDump);

    const input = {
      modelId: process.env.BEDROCK_MODEL_ID || 'mistral.mistral-large-2402-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        prompt,
        max_tokens: 256,
        temperature: 0.3,
      }),
    };

    const { BedrockRuntimeClient, InvokeModelCommand } = await import(
      '@aws-sdk/client-bedrock-runtime'
    );
    const client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    const command = new InvokeModelCommand(input);
    const response = await client.send(command);

    if (!response.body) {
      throw new Error('Empty response from Bedrock');
    }

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const parsed = ClarifyResponseSchema.parse(responseBody);

    res.json(parsed);
  } catch (error) {
    console.error('Clarify endpoint error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request', details: error.errors });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
});

export default router;
