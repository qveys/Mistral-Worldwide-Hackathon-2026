import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

const PROJECTS_DIR = '/tmp/projects';

async function ensureDir(): Promise<void> {
  await mkdir(PROJECTS_DIR, { recursive: true });
}

export async function saveProject(projectId: string, roadmap: any): Promise<void> {
  await ensureDir();
  const filePath = path.join(PROJECTS_DIR, `${projectId}.json`);
  await writeFile(filePath, JSON.stringify(roadmap, null, 2), 'utf-8');
}

export async function getProject(projectId: string): Promise<any | null> {
  const filePath = path.join(PROJECTS_DIR, `${projectId}.json`);
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}
