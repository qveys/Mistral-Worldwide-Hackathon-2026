import type { Request, Response } from 'express';
import crypto from 'node:crypto';
import { ZodError } from 'zod';
import { hasCycle } from '../lib/dependencyGraph.js';
import { logger } from '../lib/logger.js';
import { RoadmapSchema, StructureInputSchema } from '../lib/schema.js';
import { buildRetryPrompt, buildStructurePrompt } from '../prompts/structure.prompt.js';
import { callMistral, extractJSON } from '../services/bedrock.service.js';
import { saveProject } from '../services/storage.service.js';

/**
 * POST /structure
 * Transforms a brain dump text into a structured roadmap via Mistral (Bedrock).
 */
export async function structureController(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
        // 1. Validate input
        const input = StructureInputSchema.parse(req.body);

        // 2. Build prompt
        const { system, user } = buildStructurePrompt(input.text, input.includePlanning);

        // 3. Log the prompt
        logger.info('StructureController', '>>> PROMPT SENT TO MISTRAL', {
            system: system.slice(0, 2000),
            user,
        });

        // 4. Call Mistral via Bedrock
        const rawResponse = await callMistral([
            { role: 'system', content: system },
            { role: 'user', content: user },
        ]);

        // 5. Log raw response
        logger.info('StructureController', '<<< RAW MISTRAL RESPONSE', {
            rawResponse,
        });

        // 6. Extract and parse JSON
        const jsonStr = extractJSON(rawResponse);
        let roadmapData: unknown;
        try {
            roadmapData = JSON.parse(jsonStr);
        } catch {
            logger.error('StructureController', 'Failed to parse Mistral JSON response', {
                rawResponse: rawResponse.slice(0, 500),
            });
            res.status(502).json({ error: 'AI returned invalid JSON' });
            return;
        }

        // 5. Validate with Zod (with 1 retry on failure)
        let roadmap;
        try {
            roadmap = RoadmapSchema.parse(roadmapData);
        } catch (zodError) {
            logger.warn('StructureController', 'First Zod validation failed, retrying', {
                error: zodError instanceof ZodError ? zodError.message : String(zodError),
            });

            // Retry: ask Mistral to fix its output
            const retryPrompt = buildRetryPrompt(
                jsonStr,
                zodError instanceof ZodError ? zodError.message : String(zodError),
            );
            const retryResponse = await callMistral([
                { role: 'system', content: retryPrompt.system },
                { role: 'user', content: retryPrompt.user },
            ]);

            const retryJson = extractJSON(retryResponse);
            const retryData = JSON.parse(retryJson);
            roadmap = RoadmapSchema.parse(retryData);
        }

        // 6. Check for dependency cycles
        if (hasCycle(roadmap.tasks)) {
            logger.error('StructureController', 'Cycle detected in task dependencies');
            res.status(422).json({
                error: 'AI generated circular task dependencies. Please try again.',
            });
            return;
        }

        // 7. Assign projectId & fix metadata
        const projectId = crypto.randomUUID();
        roadmap.projectId = projectId;
        roadmap.brainDump = input.text;
        roadmap.createdAt = new Date().toISOString();

        // 8. Save to storage
        await saveProject(projectId, roadmap);

        const latencyMs = Date.now() - startTime;
        logger.info('StructureController', 'Roadmap generated successfully', {
            projectId,
            latencyMs,
            objectivesCount: roadmap.objectives.length,
            tasksCount: roadmap.tasks.length,
            hasPlanning: !!roadmap.planning,
        });

        // 9. Return validated roadmap
        res.json(roadmap);
    } catch (error) {
        const latencyMs = Date.now() - startTime;
        logger.error('StructureController', 'Structure generation failed', {
            latencyMs,
            error: error instanceof Error ? error.message : String(error),
        });

        if (error instanceof ZodError) {
            res.status(422).json({
                error: 'AI output validation failed after retry',
                details: error.issues,
            });
            return;
        }

        res.status(500).json({ error: 'Failed to generate roadmap' });
    }
}
