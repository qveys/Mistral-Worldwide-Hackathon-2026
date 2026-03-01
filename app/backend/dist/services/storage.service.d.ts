import type { z } from 'zod';
import type { RoadmapSchema } from '../lib/schema.js';
type Roadmap = z.infer<typeof RoadmapSchema>;
type ProjectAccessResult = {
    status: 'not_found';
} | {
    status: 'forbidden';
} | {
    status: 'found';
    project: Roadmap;
};
/**
 * Save a project roadmap for the given user. Uses S3 if configured, fallback to local filesystem.
 * Stores under data/{userId}/{projectId}.json and updates the project index.
 */
export declare function saveProject(userId: string, projectId: string, roadmap: Roadmap): Promise<void>;
/**
 * Retrieve a project roadmap with a single index read while preserving
 * not_found vs forbidden outcomes.
 */
export declare function getProjectForUser(projectId: string, requestUserId: string): Promise<ProjectAccessResult>;
export {};
//# sourceMappingURL=storage.service.d.ts.map