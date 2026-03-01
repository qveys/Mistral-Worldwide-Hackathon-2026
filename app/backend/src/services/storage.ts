import { mkdir, readFile, writeFile } from 'fs/promises';
import * as path from 'node:path';

const PROJECT_ID_REGEX = /^[A-Za-z0-9_-]+$/;
const PROJECTS_DIR = process.env.PROJECTS_DIR ?? 'data/projects';
export type Roadmap = Record<string, unknown>;

async function ensureDir(): Promise<void> {
  await mkdir(PROJECTS_DIR, { recursive: true });
}

function validateProjectId(projectId: string): void {
  if (!PROJECT_ID_REGEX.test(projectId)) {
    throw new Error('Invalid projectId format');
  }
}

function getProjectFilePath(projectId: string): string {
  validateProjectId(projectId);
  return path.join(PROJECTS_DIR, `${projectId}.json`);
}

export async function saveProject(projectId: string, roadmap: Roadmap): Promise<void> {
  await ensureDir();
  const filePath = getProjectFilePath(projectId);
  await writeFile(filePath, JSON.stringify(roadmap, null, 2), 'utf-8');
}

export async function getProject(projectId: string): Promise<Roadmap | null> {
  const filePath = getProjectFilePath(projectId);
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data) as Roadmap;
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code?: string }).code === 'ENOENT'
    ) {
      return null;
    }
    throw err;
  }
}
