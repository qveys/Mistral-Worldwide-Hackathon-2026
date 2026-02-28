import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.number().min(1).max(5),
  dependencies: z.array(z.string()).optional(),
  dependsOn: z.array(z.string()).default([]),
});

export type Task = z.infer<typeof taskSchema>;

export const roadmapSchema = z.object({
  roadmap: z.array(taskSchema),
});

export type Roadmap = z.infer<typeof roadmapSchema>;
