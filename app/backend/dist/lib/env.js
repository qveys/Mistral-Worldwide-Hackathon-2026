import { logger } from './logger.js';
export function getRequiredEnv(name, service) {
    const value = process.env[name];
    if (typeof value === 'string' && value.trim().length > 0) {
        return value;
    }
    logger.error(service, `${name} environment variable is required but was not provided`);
    throw new Error(`${name} environment variable must be set before starting the application`);
}
//# sourceMappingURL=env.js.map