import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { logger } from '../lib/logger.js';

const MODEL_ID = process.env['BEDROCK_MODEL_ID'] || 'mistral.mistral-large-2407-v1:0';

const client = new BedrockRuntimeClient({
    region: process.env['AWS_REGION'] || 'us-west-2',
});

interface MistralMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

/** Mistral Large 3 uses the chat/messages response format */
interface MistralChatResponse {
    choices: Array<{
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
}

/**
 * Call Mistral via AWS Bedrock InvokeModel.
 * Uses the chat/messages format required by Mistral Large 3.
 * Returns the raw text from the model's first choice.
 */
export async function callMistral(
    messages: MistralMessage[],
    options?: { maxTokens?: number; temperature?: number },
): Promise<string> {
    const startTime = Date.now();

    const payload = {
        messages,
        max_tokens: options?.maxTokens ?? 4096,
        temperature: options?.temperature ?? 0.3,
    };

    try {
        const command = new InvokeModelCommand({
            modelId: MODEL_ID,
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(payload),
        });

        const response = await client.send(command);
        const responseBody = new TextDecoder().decode(response.body);
        const parsed: MistralChatResponse = JSON.parse(responseBody);

        const text = parsed.choices?.[0]?.message?.content ?? '';
        const latencyMs = Date.now() - startTime;

        logger.info('BedrockService', 'Mistral call succeeded', {
            model: MODEL_ID,
            latencyMs,
            inputLength: JSON.stringify(messages).length,
            outputLength: text.length,
        });

        return text.trim();
    } catch (error) {
        const latencyMs = Date.now() - startTime;
        logger.error('BedrockService', 'Mistral call failed', {
            model: MODEL_ID,
            latencyMs,
            error: error instanceof Error ? error.message : String(error),
        });
        throw error;
    }
}

/**
 * Extract JSON from a model response that might contain extra text.
 * Looks for the first { and last } to extract the JSON object.
 */
export function extractJSON(text: string): string {
    // Try to find JSON block in markdown fences first
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch?.[1]) {
        return fenceMatch[1].trim();
    }

    // Find first { and last }
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
        return text.slice(start, end + 1);
    }

    return text;
}
