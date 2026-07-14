import { widgetProjectStorageId } from "./widget-storage-id";

function storageKey(projectToken?: string): string {
  return `chat-widget-dismissed-tickets-${widgetProjectStorageId(projectToken)}`;
}

function readSet(projectToken?: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(storageKey(projectToken));
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.map(String)) : new Set();
  } catch {
    return new Set();
  }
}

function writeSet(projectToken: string | undefined, ids: Set<string>) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(storageKey(projectToken), JSON.stringify([...ids]));
}

export function isTicketDismissed(
  projectToken: string | undefined,
  ticketId: string,
): boolean {
  return readSet(projectToken).has(String(ticketId));
}

export function dismissTicket(projectToken: string | undefined, ticketId: string) {
  const ids = readSet(projectToken);
  ids.add(String(ticketId));
  writeSet(projectToken, ids);
}

export function clearDismissedTicket(
  projectToken: string | undefined,
  ticketId: string,
) {
  const ids = readSet(projectToken);
  ids.delete(String(ticketId));
  writeSet(projectToken, ids);
}
