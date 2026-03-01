interface MistralMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
/**
 * Call Mistral via AWS Bedrock InvokeModel.
 * Uses the chat/messages format required by Mistral Large 3.
 * Returns the raw text from the model's first choice.
 */
export declare function callMistral(messages: MistralMessage[], options?: {
    maxTokens?: number;
    temperature?: number;
}): Promise<string>;
/**
 * Extract JSON from a model response that might contain extra text.
 * Looks for the first { and last } to extract the JSON object.
 */
export declare function extractJSON(text: string): string;
export {};
//# sourceMappingURL=bedrock.service.d.ts.map