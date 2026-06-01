export type StoredVisitor = {
  email: string;
  name: string;
  accessToken?: string;
  ticketId?: string | null;
};

function storageKey(projectToken?: string): string {
  const suffix = projectToken?.trim().slice(-12) || "default";
  return `chat-widget-visitor-${suffix}`;
}

export function loadVisitorSession(projectToken?: string): StoredVisitor | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(storageKey(projectToken));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredVisitor;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveVisitorSession(
  visitor: StoredVisitor | null,
  projectToken?: string,
): void {
  if (typeof window === "undefined") return;
  const key = storageKey(projectToken);
  if (!visitor?.email) {
    sessionStorage.removeItem(key);
    return;
  }
  sessionStorage.setItem(key, JSON.stringify(visitor));
}
