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
//# sourceMappingURL=logger.js.map