import { mkdir, readFile, writeFile } from 'fs/promises';
import * as path from 'node:path';
const PROJECTS_DIR = '/tmp/projects';
const PROJECT_ID_REGEX = /^[A-Za-z0-9_-]+$/;
async function ensureDir() {
    await mkdir(PROJECTS_DIR, { recursive: true });
}
export function sanitizeProjectId(projectId) {
    if (!PROJECT_ID_REGEX.test(projectId)) {
        throw new Error('Invalid projectId format');
    }
    return projectId;
}
export async function saveProject(projectId, roadmap) {
    await ensureDir();
    const safeProjectId = sanitizeProjectId(projectId);
    const filePath = path.join(PROJECTS_DIR, `${safeProjectId}.json`);
    await writeFile(filePath, JSON.stringify(roadmap, null, 2), 'utf-8');
}
export async function getProject(projectId) {
    const safeProjectId = sanitizeProjectId(projectId);
    const filePath = path.join(PROJECTS_DIR, `${safeProjectId}.json`);
    try {
        const data = await readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }
    catch (err) {
        const error = err;
        if (error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
}
//# sourceMappingURL=storage.js.map