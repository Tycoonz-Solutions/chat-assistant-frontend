/** Stable per-project id for sessionStorage keys (full token — JWTs are unique). */
export function widgetProjectStorageId(projectToken?: string): string {
  const token = projectToken?.trim();
  return token || "default";
}
