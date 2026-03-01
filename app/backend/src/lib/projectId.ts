const PROJECT_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

export function isValidProjectId(projectId: string): boolean {
  return PROJECT_ID_PATTERN.test(projectId);
}

export function sanitizeProjectId(projectId: string): string {
  const trimmed = projectId.trim();
  if (!isValidProjectId(trimmed)) {
    throw new Error('Invalid project id');
  }
  return trimmed;
}
