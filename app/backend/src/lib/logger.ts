type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    service: string;
    message: string;
    [key: string]: unknown;
}

function createEntry(
    level: LogLevel,
    service: string,
    message: string,
    meta?: Record<string, unknown>,
): LogEntry {
    return {
        timestamp: new Date().toISOString(),
        level,
        service,
        message,
        ...meta,
    };
}

export const logger = {
    info(service: string, message: string, meta?: Record<string, unknown>): void {
        console.log(JSON.stringify(createEntry('info', service, message, meta)));
    },

    warn(service: string, message: string, meta?: Record<string, unknown>): void {
        console.warn(JSON.stringify(createEntry('warn', service, message, meta)));
    },

    error(service: string, message: string, meta?: Record<string, unknown>): void {
        console.error(JSON.stringify(createEntry('error', service, message, meta)));
    },
};
