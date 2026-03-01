import { HttpError } from "./httpError.js";
const PROJECT_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
export function assertValidProjectId(projectId) {
    if (!PROJECT_ID_PATTERN.test(projectId)) {
        throw new HttpError("Invalid project id format", 400);
    }
    return projectId;
}
//# sourceMappingURL=projectId.js.map