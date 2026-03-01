import { mkdir, readFile, writeFile } from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { z } from 'zod';

const ProjectIdSchema = z.string().uuid();
const PROJECTS_DIR = process.env.STORAGE_DIR ?? path.join(os.tmpdir(), 'projects');

async function ensureDir(): Promise<void> {
  await mkdir(PROJECTS_DIR, { recursive: true });
}

function getProjectFilePath(projectId: string): string {
  const validatedId = ProjectIdSchema.parse(projectId);
  const baseDir = path.resolve(PROJECTS_DIR);
  const filePath = path.resolve(baseDir, `${validatedId}.json`);

  if (path.dirname(filePath) !== baseDir) {
    throw new Error('Resolved project path escapes the projects directory');
  }

  return filePath;
}

export async function saveProject(projectId: string, payload: unknown): Promise<void> {
  await ensureDir();
  const filePath = getProjectFilePath(projectId);
  await writeFile(filePath, JSON.stringify(payload, null, 2), 'utf-8');
}

export async function getProject(projectId: string): Promise<unknown | null> {
  const idValidation = ProjectIdSchema.safeParse(projectId);
  if (!idValidation.success) {
    return null;
  }

  const filePath = getProjectFilePath(idValidation.data);

  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}
