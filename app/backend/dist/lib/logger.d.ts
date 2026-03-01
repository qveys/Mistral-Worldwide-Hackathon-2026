export declare const logger: {
    info(service: string, message: string, meta?: Record<string, unknown>): void;
    warn(service: string, message: string, meta?: Record<string, unknown>): void;
    error(service: string, message: string, meta?: Record<string, unknown>): void;
};
export declare function logRouteError(route: string, error: unknown): void;
//# sourceMappingURL=logger.d.ts.map