import { z } from "zod";
export declare const taskSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodNumber;
    dependsOn: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type Task = z.infer<typeof taskSchema>;
export declare const roadmapSchema: z.ZodObject<{
    roadmap: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        priority: z.ZodNumber;
        dependsOn: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Roadmap = z.infer<typeof roadmapSchema>;
//# sourceMappingURL=schema.d.ts.map