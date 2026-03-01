import type { z } from 'zod';
import type { RoadmapSchema } from '../lib/schema.js';
type Roadmap = z.infer<typeof RoadmapSchema>;
/**
 * Save a project roadmap for the given user. Uses S3 if configured, fallback to local filesystem.
 * Stores under data/{userId}/{projectId}.json and updates the project index.
 */
export declare function saveProject(userId: string, projectId: string, roadmap: Roadmap): Promise<void>;
/**
 * Retrieve a project roadmap by ID. Returns null if not found or if requestUserId is not the owner.
 */
export declare function getProject(projectId: string, requestUserId: string): Promise<Roadmap | null>;
/**
 * Return the owner userId for a project, or null if the project is not in the index.
 * Used by controllers to return 404 vs 403 (not found vs forbidden).
 */
export declare function getProjectOwner(projectId: string): Promise<string | null>;
export {};
//# sourceMappingURL=storage.service.d.ts.map