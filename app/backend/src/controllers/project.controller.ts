import type { Request, Response } from 'express';
import { logger } from '../lib/logger.js';
import { RoadmapSchema } from '../lib/schema.js';
import { getProjectForUser } from '../services/storage.service.js';

/**
 * GET /project/:id
 * Retrieve a saved project roadmap by ID. Requires auth; only the owner can access.
 */
export async function projectController(req: Request, res: Response): Promise<void> {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];

    if (!id) {
        res.status(400).json({ error: 'Project ID is required' });
        return;
    }

    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    try {
        const result = await getProjectForUser(id, userId);
        if (result.status === 'not_found') {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        if (result.status === 'forbidden') {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        // Validate stored data integrity
        const validated = RoadmapSchema.parse(result.project);
        res.json(validated);
    } catch (error) {
        logger.error('ProjectController', 'Failed to retrieve project', {
            projectId: id,
            error: error instanceof Error ? error.message : String(error),
        });
        res.status(500).json({ error: 'Failed to retrieve project' });
    }
}
