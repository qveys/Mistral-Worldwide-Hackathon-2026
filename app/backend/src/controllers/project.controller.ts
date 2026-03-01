import type { Request, Response } from 'express';
import { logger } from '../lib/logger.js';
import { RoadmapSchema } from '../lib/schema.js';
import { getProject } from '../services/storage.service.js';

/**
 * GET /project/:id
 * Retrieve a saved project roadmap by ID.
 */
export async function projectController(req: Request, res: Response): Promise<void> {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];

    if (!id) {
        res.status(400).json({ error: 'Project ID is required' });
        return;
    }

    try {
        const project = await getProject(id);

        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        // Validate stored data integrity
        const validated = RoadmapSchema.parse(project);
        res.json(validated);
    } catch (error) {
        logger.error('ProjectController', 'Failed to retrieve project', {
            projectId: id,
            error: error instanceof Error ? error.message : String(error),
        });
        res.status(500).json({ error: 'Failed to retrieve project' });
    }
}
