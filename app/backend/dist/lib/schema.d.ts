import { z } from 'zod';
export { ObjectiveSchema, PlanningSchema, PlanningSlotSchema, RevisionEntrySchema, RoadmapSchema, TaskSchema, } from '@echomaps/shared';
export declare const TranscriptionDeltaEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"transcription.text.delta">;
    text: z.ZodString;
}, z.core.$strip>;
export declare const TranscriptionDoneEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"transcription.done">;
}, z.core.$strip>;
export declare const TranscriptionErrorEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"error">;
    error: z.ZodString;
}, z.core.$strip>;
export declare const TranscriptionWsEventSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"transcription.text.delta">;
    text: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"transcription.done">;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"error">;
    error: z.ZodString;
}, z.core.$strip>], "type">;
export declare const StructureInputSchema: z.ZodObject<{
    text: z.ZodString;
    includePlanning: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const ReviseInputSchema: z.ZodObject<{
    projectId: z.ZodString;
    instruction: z.ZodString;
    roadmap: z.ZodObject<{
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
}, z.core.$strip>;
//# sourceMappingURL=schema.d.ts.map