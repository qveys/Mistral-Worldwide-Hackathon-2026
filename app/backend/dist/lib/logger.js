function createEntry(level, service, message, meta) {
    return {
        timestamp: new Date().toISOString(),
        level,
        service,
        message,
        ...meta,
    };
}
export const logger = {
    info(service, message, meta) {
        console.log(JSON.stringify(createEntry('info', service, message, meta)));
    },
    warn(service, message, meta) {
        console.warn(JSON.stringify(createEntry('warn', service, message, meta)));
    },
    error(service, message, meta) {
        console.error(JSON.stringify(createEntry('error', service, message, meta)));
    },
};
export function logRouteError(route, error) {
    const meta = {
        route,
        error: error instanceof Error ? error.message : String(error),
    };
    if (error instanceof Error && error.stack)
        meta.stack = error.stack;
    logger.error('Route', `${route} failed`, meta);
}
//# sourceMappingURL=logger.js.map