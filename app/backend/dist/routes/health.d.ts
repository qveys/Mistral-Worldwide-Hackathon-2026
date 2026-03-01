type HealthRouterOptions = {
    version: string;
    startTime: number;
};
export default function createHealthRouter({ version, startTime }: HealthRouterOptions): import("express-serve-static-core").Router;
export {};
//# sourceMappingURL=health.d.ts.map