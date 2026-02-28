import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { TaskSchema, RoadmapMetadataSchema } from '../schemas/roadmap.js';

const ProjectSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  roadmap: z.array(TaskSchema),
  metadata: RoadmapMetadataSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export type Project = z.infer<typeof ProjectSchema>;
export type { Task } from '../schemas/roadmap.js';

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
    // Validate ID as UUID at service level to prevent path traversal
    z.string().uuid().parse(project.id);

    await this.ensureStorageDir();

    const now = new Date().toISOString();
    const fullProject: Project = {
      ...project,
      createdAt: project.createdAt ?? now,
      updatedAt: project.updatedAt ?? now
    };

    const validated = ProjectSchema.parse(fullProject);
    const filePath = this.getProjectFilePath(validated.id);
    await fs.writeFile(filePath, JSON.stringify(validated, null, 2), 'utf-8');

    return validated;
  }

  async getProject(projectId: string): Promise<Project | null> {
    // Validate ID as UUID at service level to prevent path traversal
    const idValidation = z.string().uuid().safeParse(projectId);
    if (!idValidation.success) return null;

    const filePath = this.getProjectFilePath(idValidation.data);

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
