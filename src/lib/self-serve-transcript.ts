import type { Msg } from "../../types/index";
import { widgetProjectStorageId } from "./widget-storage-id";

function storageKey(projectToken: string | undefined, email: string): string {
  const e = email.trim().toLowerCase();
  return `chat-widget-conversation-${widgetProjectStorageId(projectToken)}-${e}`;
}

/** Persist FAQ / AI / prior agent turns so mode switches and reloads keep one timeline. */
export function loadSelfServeTranscript(
  projectToken: string | undefined,
  email: string | undefined | null,
): Msg[] {
  if (typeof window === "undefined" || !email?.trim()) return [];
  try {
    const raw = sessionStorage.getItem(storageKey(projectToken, email));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Msg[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSelfServeTranscript(
  projectToken: string | undefined,
  email: string | undefined | null,
  messages: Msg[],
): void {
  if (typeof window === "undefined" || !email?.trim()) return;
  try {
    sessionStorage.setItem(
      storageKey(projectToken, email),
      JSON.stringify(messages),
    );
  } catch {
    /* quota / private mode */
  }
}

export function clearSelfServeTranscript(
  projectToken: string | undefined,
  email: string | undefined | null,
): void {
  if (typeof window === "undefined" || !email?.trim()) return;
  sessionStorage.removeItem(storageKey(projectToken, email));
}
