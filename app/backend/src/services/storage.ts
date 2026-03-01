import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import type { Roadmap } from '../lib/schema.js';
import { HttpError } from '../lib/httpError.js';
import { assertValidProjectId } from '../lib/projectId.js';

const PROJECTS_DIR = process.env.PROJECTS_DIR || '/tmp/projects';
const PROJECTS_DIR_RESOLVED = path.resolve(PROJECTS_DIR);

async function ensureDir(): Promise<void> {
  await mkdir(PROJECTS_DIR, { recursive: true });
}

function getProjectFilePath(projectId: string): string {
  const safeProjectId = assertValidProjectId(projectId);
  const candidatePath = path.join(PROJECTS_DIR_RESOLVED, `${safeProjectId}.json`);
  const resolvedPath = path.resolve(candidatePath);

  if (!resolvedPath.startsWith(`${PROJECTS_DIR_RESOLVED}${path.sep}`)) {
    throw new HttpError('Invalid project path', 400);
  }

  return resolvedPath;
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
    const fsError = err as NodeJS.ErrnoException;
    if (fsError.code === 'ENOENT') {
      return null;
    }
    throw fsError;
  }
}
