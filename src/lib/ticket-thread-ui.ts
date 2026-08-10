import type { Msg } from "../../types/index";
import type { FaqExchange } from "./faq-transcript";
import type { VisitorTicketMessage } from "../widget-visitor-api";
import { parseStaffSenderName } from "./widget-display";

function formatTime(iso: string | null): string {
  if (!iso) {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ticketMessageToWidgetMsg(m: VisitorTicketMessage): Msg {
  const sortAt = m.createdAt ?? new Date().toISOString();
  const time = formatTime(m.createdAt);
  if (m.senderRole === "system") {
    return {
      id: m.id,
      role: "bot",
      text: m.text,
      time,
      sortAt,
      isSystem: true,
    };
  }
  if (m.senderRole === "visitor") {
    return { id: m.id, role: "user", text: m.text, time, sortAt };
  }
  if (m.senderRole === "bot") {
    return {
      id: m.id,
      role: "bot",
      text: m.text,
      senderName: m.senderLabel || "AI Assistant",
      time,
      sortAt,
      isStaff: false,
      senderAvatar: null,
    };
  }
  const label =
    m.senderLabel && m.senderLabel !== "Unknown sender" && m.senderLabel !== "System"
      ? m.senderLabel
      : "Support";
  return {
    id: m.id,
    role: "bot",
    text: m.text,
    senderName: parseStaffSenderName(label),
    isStaff: true,
    senderAvatar: m.senderAvatar ?? null,
    time,
    sortAt,
  };
}

function faqExchangeToMsgs(exchange: FaqExchange): Msg[] {
  const base = Date.parse(exchange.askedAt) || Date.now();
  const qAt = new Date(base).toISOString();
  const aAt = new Date(base + 1).toISOString();
  return [
    {
      role: "user",
      text: exchange.question,
      time: formatTime(qAt),
      sortAt: qAt,
      faqLocal: true,
    },
    {
      role: "bot",
      text: exchange.answer,
      time: formatTime(aAt),
      sortAt: aAt,
      faqLocal: true,
      faqForQuestion: exchange.question,
    },
  ];
}

function compareMsgs(a: Msg, b: Msg): number {
  const ta = a.sortAt ?? "";
  const tb = b.sortAt ?? "";
  if (ta !== tb) return ta.localeCompare(tb);
  if (a.isSystem !== b.isSystem) return a.isSystem ? -1 : 1;
  if (a.role !== b.role) return a.role === "user" ? -1 : 1;
  return 0;
}

function messageDedupeKey(m: Msg): string {
  return `${m.role}|${m.text.trim().toLowerCase()}`;
}

function latestSortAt(messages: Msg[]): string {
  let max = "";
  for (const m of messages) {
    const t = m.sortAt ?? "";
    if (t > max) max = t;
  }
  return max;
}

/** Ticket chat + FAQ quick-help, sorted by time (visitor-only FAQ rows). */
export function buildVisitorThread(
  ticketMsgs: Msg[],
  faqExchanges: FaqExchange[],
): Msg[] {
  const faqMsgs = faqExchanges.flatMap(faqExchangeToMsgs);
  return [...ticketMsgs, ...faqMsgs].sort(compareMsgs);
}

export const AGENT_ENTER_NOTICE = "You've reached our customer support agent";
export const AGENT_EXIT_NOTICE = "You've left customer support";

function modeOfNotice(text: string): "enter" | "exit" | null {
  const t = text.trim();
  if (t === AGENT_ENTER_NOTICE) return "enter";
  if (t === AGENT_EXIT_NOTICE) return "exit";
  return null;
}

/** Last enter/exit divider in the local timeline (ignores other system rows). */
export function lastAgentModeNotice(
  messages: Msg[],
): "enter" | "exit" | null {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const m = messages[i];
    if (!m?.isSystem) continue;
    const mode = modeOfNotice(String(m.text || ""));
    if (mode) return mode;
  }
  return null;
}

/**
 * Keep local FAQ/AI (and any unsynced turns) when refreshing the ticket thread.
 * Enter/exit notices live ONLY on the ticket — never merge local copies of those.
 */
export function mergeLocalIntoTicketThread(
  ticketThread: Msg[],
  localMsgs: Msg[],
): Msg[] {
  if (!localMsgs.length) return ticketThread;

  const byId = new Set(
    ticketThread.map((m) => m.id).filter((id): id is string => Boolean(id)),
  );
  const seenText = new Set(ticketThread.map(messageDedupeKey));
  const ticketTip = latestSortAt(ticketThread);
  const extras: Msg[] = [];

  for (const m of localMsgs) {
    if (m.ticketCreatedNotice) continue;
    if (m.id && byId.has(m.id)) continue;

    // Mode notices are ticket-only; local copies cause duplicates / wrong order.
    if (m.isSystem && modeOfNotice(String(m.text || ""))) continue;
    if (m.localOnly && m.isSystem) continue;

    const key = messageDedupeKey(m);
    if (!m.text.trim()) continue;
    const newerThanTicket = Boolean(m.sortAt && ticketTip && m.sortAt > ticketTip);
    if (seenText.has(key) && !newerThanTicket) continue;
    seenText.add(key);
    extras.push(m);
  }

  if (!extras.length) return ticketThread;
  return dedupeAdjacentModeNotices([...ticketThread, ...extras].sort(compareMsgs));
}

/** Collapse consecutive identical enter/exit notices (legacy duplicate rows). */
export function dedupeAdjacentModeNotices(messages: Msg[]): Msg[] {
  const out: Msg[] = [];
  for (const m of messages) {
    const mode = m.isSystem ? modeOfNotice(String(m.text || "")) : null;
    if (mode && out.length > 0) {
      const prev = out[out.length - 1];
      if (
        prev?.isSystem &&
        modeOfNotice(String(prev.text || "")) === mode
      ) {
        continue;
      }
    }
    out.push(m);
  }
  return out;
}

/**
 * Keep enter/exit notices that were just posted but may be missing from a racing
 * ticket fetch (stale response would otherwise wipe them from the UI).
 * Never re-inject a mode notice when the ticket is already in that mode.
 */
export function preservePendingModeNotices(
  ticketThread: Msg[],
  liveMsgs: Msg[],
): Msg[] {
  if (!liveMsgs.length) return ticketThread;

  const byId = new Set(
    ticketThread.map((m) => m.id).filter((id): id is string => Boolean(id)),
  );
  const tip = latestSortAt(ticketThread);
  const ticketMode = lastAgentModeNotice(ticketThread);
  const pending = liveMsgs.filter((m) => {
    if (!m.isSystem) return false;
    const mode = modeOfNotice(String(m.text || ""));
    if (!mode) return false;
    if (m.id && byId.has(m.id)) return false;
    // Ticket already ends in this mode — don't paste a second "reached"/"left".
    if (ticketMode === mode) return false;
    if (!m.id && m.sortAt && tip && m.sortAt <= tip) return false;
    if (!m.id && !m.sortAt) return false;
    return true;
  });

  if (!pending.length) return ticketThread;
  return dedupeAdjacentModeNotices(
    [...ticketThread, ...pending].sort(compareMsgs),
  );
}

/**
 * Append a non-mode system divider locally (e.g. rare UI-only notices).
 * Enter/exit must be written via the ticket notices API — not sessionStorage.
 */
export function appendSystemNotice(messages: Msg[], text: string): Msg[] {
  const trimmed = text.trim();
  if (!trimmed) return messages;

  // Ticket DB owns enter/exit; never park them as localOnly.
  if (modeOfNotice(trimmed)) return messages;

  if (
    messages.some(
      (m) => m.isSystem && String(m.text || "").trim() === trimmed,
    )
  ) {
    return messages;
  }
  const sortAt = new Date().toISOString();
  return [
    ...messages,
    {
      role: "bot",
      text: trimmed,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sortAt,
      isSystem: true,
      localOnly: true,
    },
  ];
}

/** Self-serve FAQ/AI turns after the latest exit notice (for syncing onto the ticket). */
export function selfServeTurnsSinceLastExit(messages: Msg[]): Array<{
  role: "user" | "assistant";
  content: string;
  at?: string;
}> {
  let start = 0;
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (
      messages[i]?.isSystem &&
      modeOfNotice(String(messages[i].text || "")) === "exit"
    ) {
      start = i + 1;
      break;
    }
  }
  return messages
    .slice(start)
    .filter(
      (m) =>
        !m.isSystem &&
        !m.isStaff &&
        !m.ticketCreatedNotice &&
        (m.role === "user" || m.role === "bot") &&
        m.text.trim().length > 0,
    )
    .map((m) => ({
      role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
      content: m.text.trim(),
      ...(m.sortAt ? { at: m.sortAt } : {}),
    }));
}
