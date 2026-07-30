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
 * Keep local FAQ/AI (and any unsynced turns) when entering or refreshing the agent thread.
 * Prefer ticket rows when the same content already exists on the ticket — unless the local
 * turn is newer than the ticket tip (post-exit AI must survive resume).
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
  const mergedSoFar = () => [...ticketThread, ...extras];

  for (const m of localMsgs) {
    if (m.ticketCreatedNotice) continue;
    if (m.id && byId.has(m.id)) continue;

    const mode = m.isSystem ? modeOfNotice(String(m.text || "")) : null;
    if (m.localOnly || mode) {
      if (mode && lastAgentModeNotice(mergedSoFar()) === mode) continue;
      if (
        m.localOnly &&
        extras.some(
          (e) =>
            e.localOnly &&
            e.text === m.text &&
            (e.sortAt ?? "") === (m.sortAt ?? ""),
        )
      ) {
        continue;
      }
      extras.push(m);
      continue;
    }

    const key = messageDedupeKey(m);
    if (!m.text.trim()) continue;
    const newerThanTicket = Boolean(m.sortAt && ticketTip && m.sortAt > ticketTip);
    if (seenText.has(key) && !newerThanTicket) continue;
    seenText.add(key);
    extras.push(m);
  }

  if (!extras.length) return ticketThread;
  return [...ticketThread, ...extras].sort(compareMsgs);
}

function pushSystemNotice(messages: Msg[], text: string): Msg[] {
  const sortAt = new Date().toISOString();
  return [
    ...messages,
    {
      role: "bot",
      text: text,
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

/**
 * Append a centered system divider.
 * For agent enter/exit, allow repeats when the visitor transitions modes again
 * (e.g. leave → AI chat → resume agent must show a new "reached support" notice).
 */
export function appendSystemNotice(messages: Msg[], text: string): Msg[] {
  const trimmed = text.trim();
  if (!trimmed) return messages;

  const mode = modeOfNotice(trimmed);
  if (mode) {
    if (lastAgentModeNotice(messages) === mode) return messages;
    return pushSystemNotice(messages, trimmed);
  }

  if (
    messages.some(
      (m) => m.isSystem && String(m.text || "").trim() === trimmed,
    )
  ) {
    return messages;
  }
  return pushSystemNotice(messages, trimmed);
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
