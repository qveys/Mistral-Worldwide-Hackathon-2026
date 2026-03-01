import { authRouter } from './auth.route.js';
import { projectRouter } from './project.route.js';
import { structureRouter } from './structure.route.js';
import { setupTranscribeRoute } from './transcribe.route.js';
export function registerRoutes(app, wss) {
    // WebSocket routes
    setupTranscribeRoute(wss);
    // REST routes
    app.use(authRouter);
    app.use(structureRouter);
    app.use(projectRouter);
}
//# sourceMappingURL=index.js.map