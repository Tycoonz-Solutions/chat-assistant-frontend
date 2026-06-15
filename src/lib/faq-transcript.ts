export type FaqExchange = {
  question: string;
  answer: string;
  askedAt: string;
};

function storageKey(projectToken: string | undefined, ticketId: string): string {
  const suffix = projectToken?.trim().slice(-12) || "default";
  return `chat-widget-faq-${suffix}-${ticketId}`;
}

export function loadFaqTranscript(
  projectToken: string | undefined,
  ticketId: string,
): FaqExchange[] {
  if (typeof window === "undefined" || !ticketId) return [];
  try {
    const raw = sessionStorage.getItem(storageKey(projectToken, ticketId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FaqExchange[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendFaqExchange(
  projectToken: string | undefined,
  ticketId: string,
  exchange: FaqExchange,
): FaqExchange[] {
  const list = loadFaqTranscript(projectToken, ticketId);
  list.push(exchange);
  if (typeof window !== "undefined") {
    sessionStorage.setItem(storageKey(projectToken, ticketId), JSON.stringify(list));
  }
  return list;
}

export function clearFaqTranscript(
  projectToken: string | undefined,
  ticketId: string,
): void {
  if (typeof window === "undefined" || !ticketId) return;
  sessionStorage.removeItem(storageKey(projectToken, ticketId));
}
