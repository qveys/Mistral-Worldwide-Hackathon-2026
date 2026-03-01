import { mkdir, readFile, writeFile } from 'fs/promises';
import * as path from 'node:path';
import { sanitizeProjectId } from '../lib/projectId.js';

const DEFAULT_PROJECTS_DIR = path.join(process.cwd(), 'data', 'projects');
const PROJECTS_DIR = path.resolve(process.env.PROJECTS_DIR ?? DEFAULT_PROJECTS_DIR);

async function ensureDir(): Promise<void> {
  await mkdir(PROJECTS_DIR, { recursive: true });
}

export async function saveProject(projectId: string, roadmap: unknown): Promise<void> {
  await ensureDir();
  const safeProjectId = sanitizeProjectId(projectId);
  const filePath = path.join(PROJECTS_DIR, `${safeProjectId}.json`);
  await writeFile(filePath, JSON.stringify(roadmap, null, 2), 'utf-8');
}

export async function getProject(projectId: string): Promise<unknown | null> {
  const safeProjectId = sanitizeProjectId(projectId);
  const filePath = path.join(PROJECTS_DIR, `${safeProjectId}.json`);
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      err.code === 'ENOENT'
    ) {
      return null;
    }
    throw err;
  }
}
