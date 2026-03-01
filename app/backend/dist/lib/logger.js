export function logRouteError(route, error) {
    const entry = {
        timestamp: new Date().toISOString(),
        level: 'error',
        service: 'routes',
        route,
        error: error instanceof Error ? error.message : String(error),
    };
    console.error(JSON.stringify(entry));
}
//# sourceMappingURL=logger.js.map