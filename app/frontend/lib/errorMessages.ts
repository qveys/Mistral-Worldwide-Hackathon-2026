/**
 * Maps backend API error strings to i18n message keys (errors.*).
 * Use with useTranslations('errors') then t(getErrorKey(apiError)) or show apiError as fallback.
 */
const ERROR_MAP: Record<string, string> = {
  'Project ID is required': 'projectIdRequired',
  'Project not found': 'projectNotFound',
  'Failed to retrieve project': 'failedRetrieveProject',
  'AI returned invalid JSON': 'aiInvalidJson',
  'AI generated circular task dependencies. Please try again.': 'aiCircularDeps',
  'AI output validation failed after retry': 'aiValidationFailed',
  'Failed to generate roadmap': 'failedGenerateRoadmap',
};

export function getErrorKey(apiError: string): string | null {
  const key = ERROR_MAP[apiError];
  return key ?? null;
}

/**
 * Returns the i18n key if the error is known, otherwise null (caller can display raw message).
 */
export function getErrorMessageKey(error: unknown): string | null {
  const message = error instanceof Error ? error.message : String(error);
  return getErrorKey(message);
}
