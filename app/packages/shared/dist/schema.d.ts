import { z } from 'zod';
export declare const ObjectiveSchema: z.ZodObject<{
    id: z.ZodString;
    text: z.ZodString;
    priority: z.ZodEnum<{
        high: "high";
        medium: "medium";
        low: "low";
    }>;
}, z.core.$strip>;
export declare const TaskSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    objectiveId: z.ZodString;
    status: z.ZodEnum<{
        backlog: "backlog";
        doing: "doing";
        done: "done";
    }>;
    estimate: z.ZodEnum<{
        S: "S";
        M: "M";
        L: "L";
    }>;
    priority: z.ZodEnum<{
        high: "high";
        medium: "medium";
        low: "low";
    }>;
    dependsOn: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const PlanningSlotSchema: z.ZodObject<{
    taskId: z.ZodString;
    day: z.ZodString;
    slot: z.ZodEnum<{
        AM: "AM";
        PM: "PM";
    }>;
    done: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const PlanningSchema: z.ZodObject<{
    startDate: z.ZodString;
    endDate: z.ZodString;
    slots: z.ZodArray<z.ZodObject<{
        taskId: z.ZodString;
        day: z.ZodString;
        slot: z.ZodEnum<{
            AM: "AM";
            PM: "PM";
        }>;
        done: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const RevisionEntrySchema: z.ZodObject<{
    timestamp: z.ZodString;
    patch: z.ZodString;
}, z.core.$strip>;
export declare const RoadmapSchema: z.ZodObject<{
    projectId: z.ZodString;
    title: z.ZodString;
    createdAt: z.ZodString;
    brainDump: z.ZodString;
    objectives: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        priority: z.ZodEnum<{
            high: "high";
            medium: "medium";
            low: "low";
        }>;
    }, z.core.$strip>>;
    tasks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        objectiveId: z.ZodString;
        status: z.ZodEnum<{
            backlog: "backlog";
            doing: "doing";
            done: "done";
        }>;
        estimate: z.ZodEnum<{
            S: "S";
            M: "M";
            L: "L";
        }>;
        priority: z.ZodEnum<{
            high: "high";
            medium: "medium";
            low: "low";
        }>;
        dependsOn: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    planning: z.ZodOptional<z.ZodObject<{
        startDate: z.ZodString;
        endDate: z.ZodString;
        slots: z.ZodArray<z.ZodObject<{
            taskId: z.ZodString;
            day: z.ZodString;
            slot: z.ZodEnum<{
                AM: "AM";
                PM: "PM";
            }>;
            done: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    revisionHistory: z.ZodDefault<z.ZodArray<z.ZodObject<{
        timestamp: z.ZodString;
        patch: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type Objective = z.infer<typeof ObjectiveSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type PlanningSlot = z.infer<typeof PlanningSlotSchema>;
export type Planning = z.infer<typeof PlanningSchema>;
export type RevisionEntry = z.infer<typeof RevisionEntrySchema>;
export type Roadmap = z.infer<typeof RoadmapSchema>;
export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];
export type TaskEstimate = Task['estimate'];
export type SlotTime = PlanningSlot['slot'];
//# sourceMappingURL=schema.d.ts.map