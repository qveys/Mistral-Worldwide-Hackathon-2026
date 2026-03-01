import { z } from "zod";
export const taskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.number().min(1).max(5),
    dependsOn: z.array(z.string()).default([]),
});
export const roadmapSchema = z.object({
    roadmap: z.array(taskSchema),
});
//# sourceMappingURL=schema.js.map