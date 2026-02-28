import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

// Schema for a stored project
const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.number().min(1).max(5),
  dependencies: z.array(z.string()).optional()
});

const ProjectSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  roadmap: z.array(TaskSchema),
  metadata: z.object({
    processingTimeMs: z.number(),
    modelUsed: z.string(),
    confidenceScore: z.number().min(0).max(1)
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Project = z.infer<typeof ProjectSchema>;
export type Task = z.infer<typeof TaskSchema>;

export class StorageService {
  private storageDir: string;

  constructor() {
    this.storageDir = process.env.STORAGE_DIR || path.join(process.cwd(), 'data', 'projects');
  }

  private async ensureStorageDir(): Promise<void> {
    await fs.mkdir(this.storageDir, { recursive: true });
  }

  private getProjectFilePath(projectId: string): string {
    return path.join(this.storageDir, `${projectId}.json`);
  }

  async saveProject(project: Omit<Project, 'createdAt' | 'updatedAt'> & { createdAt?: string; updatedAt?: string }): Promise<Project> {
    await this.ensureStorageDir();

    const now = new Date().toISOString();
    const fullProject: Project = {
      ...project,
      createdAt: project.createdAt ?? now,
      updatedAt: now
    };

    const validated = ProjectSchema.parse(fullProject);
    const filePath = this.getProjectFilePath(validated.id);
    await fs.writeFile(filePath, JSON.stringify(validated, null, 2), 'utf-8');

    return validated;
  }

  async getProject(projectId: string): Promise<Project | null> {
    const filePath = this.getProjectFilePath(projectId);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const raw = JSON.parse(content);
      return ProjectSchema.parse(raw);
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  async listProjects(userId: string): Promise<Project[]> {
    await this.ensureStorageDir();

    let files: string[];
    try {
      files = await fs.readdir(this.storageDir);
    } catch {
      return [];
    }

    const projects: Project[] = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      try {
        const content = await fs.readFile(path.join(this.storageDir, file), 'utf-8');
        const project = ProjectSchema.parse(JSON.parse(content));
        if (project.userId === userId) {
          projects.push(project);
        }
      } catch {
        // Skip invalid files
      }
    }

    return projects.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
}
