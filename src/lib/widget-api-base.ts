/**
 * Empty string means same-origin (relative `/api/v1/...` via a reverse proxy).
 * `undefined` / omitted means the widget has no backend configured.
 */
export function resolveWidgetApiBase(
  apiBaseUrl: string | undefined | null,
): string | undefined {
  if (typeof apiBaseUrl !== "string") return undefined;
  return apiBaseUrl.replace(/\/$/, "");
}

export function hasWidgetApiBase(apiBaseUrl: string | undefined | null): boolean {
  return typeof apiBaseUrl === "string";
}
