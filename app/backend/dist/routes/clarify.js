import { Router } from 'express';
import { z } from 'zod';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { buildClarifyPrompt } from '../prompts/clarify.js';
const router = Router();
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-east-1',
});
const ClarifyRequestSchema = z
    .object({
    text: z.string().min(10, 'Text too short').optional(),
    brainDump: z.string().min(10, 'Brain dump too short').optional(),
})
    .refine((data) => typeof data.text === 'string' || typeof data.brainDump === 'string', {
    message: 'Either "text" or "brainDump" is required',
    path: ['text'],
});
const ClarifyResponseSchema = z.discriminatedUnion('needsClarification', [
    z.object({
        needsClarification: z.literal(false),
    }),
    z.object({
        needsClarification: z.literal(true),
        question: z.string().min(1, 'question is required when needsClarification is true'),
    }),
]);
router.post('/', async (req, res) => {
    try {
        const { text, brainDump } = ClarifyRequestSchema.parse(req.body);
        const normalizedBrainDump = text ?? brainDump;
        if (!normalizedBrainDump) {
            throw new Error('Missing brain dump text');
        }
        const prompt = buildClarifyPrompt(normalizedBrainDump);
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
        const command = new InvokeModelCommand(input);
        const response = await bedrockClient.send(command);
        if (!response.body) {
            throw new Error('Empty response from Bedrock');
        }
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const outputText = responseBody?.outputs?.[0]?.text;
        if (typeof outputText !== 'string') {
            throw new Error('Invalid Bedrock response format: missing outputs[0].text');
        }
        const parsed = ClarifyResponseSchema.parse(JSON.parse(outputText));
        res.json(parsed);
    }
    catch (error) {
        console.error('Clarify endpoint error:', error);
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Invalid request', details: error.issues });
        }
        else {
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
});
export default router;
//# sourceMappingURL=clarify.js.map