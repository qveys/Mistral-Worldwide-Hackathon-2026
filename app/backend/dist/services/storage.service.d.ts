import type { z } from 'zod';
import type { RoadmapSchema } from '../lib/schema.js';
type Roadmap = z.infer<typeof RoadmapSchema>;
/**
 * Save a project roadmap. Uses S3 if configured, fallback to local filesystem.
 */
export declare function saveProject(projectId: string, roadmap: Roadmap): Promise<void>;
/**
 * Retrieve a project roadmap by ID. Returns null if not found.
 */
export declare function getProject(projectId: string): Promise<Roadmap | null>;
export {};
//# sourceMappingURL=storage.service.d.ts.map