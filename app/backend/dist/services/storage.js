import { mkdir, readFile, writeFile } from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { assertValidProjectId } from '../lib/projectId.js';
import { HttpError } from '../lib/httpError.js';
const PROJECTS_DIR = process.env.STORAGE_DIR || process.env.PROJECTS_DIR || path.join(os.tmpdir(), 'projects');
const PROJECTS_DIR_RESOLVED = path.resolve(PROJECTS_DIR);
async function ensureDir() {
    await mkdir(PROJECTS_DIR, { recursive: true });
}
function getProjectFilePath(projectId) {
    const safeProjectId = assertValidProjectId(projectId);
    const candidatePath = path.join(PROJECTS_DIR_RESOLVED, `${safeProjectId}.json`);
    const resolvedPath = path.resolve(candidatePath);
    if (!resolvedPath.startsWith(`${PROJECTS_DIR_RESOLVED}${path.sep}`)) {
        throw new HttpError('Invalid project path', 400);
    }
    return resolvedPath;
}
export async function saveProject(projectId, payload) {
    await ensureDir();
    const filePath = getProjectFilePath(projectId);
    await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');
}
export async function getProject(projectId) {
    const filePath = getProjectFilePath(projectId);
    try {
        const data = await readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }
    catch (err) {
        const fsError = err;
        if (fsError.code === 'ENOENT') {
            return null;
        }
        throw fsError;
    }
}
//# sourceMappingURL=storage.js.map