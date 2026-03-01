import { mkdir, readFile, writeFile } from 'fs/promises';
import * as path from 'node:path';

const PROJECTS_DIR = '/tmp/projects';
const PROJECT_ID_REGEX = /^[A-Za-z0-9_-]+$/;

async function ensureDir(): Promise<void> {
  await mkdir(PROJECTS_DIR, { recursive: true });
}

export function sanitizeProjectId(projectId: string): string {
  if (!PROJECT_ID_REGEX.test(projectId)) {
    throw new Error('Invalid projectId format');
  }
  return projectId;
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
    const error = err as NodeJS.ErrnoException;
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}
