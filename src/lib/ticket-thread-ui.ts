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

/** Ticket chat + FAQ quick-help, sorted by time (visitor-only FAQ rows). */
export function buildVisitorThread(
  ticketMsgs: Msg[],
  faqExchanges: FaqExchange[],
): Msg[] {
  const faqMsgs = faqExchanges.flatMap(faqExchangeToMsgs);
  return [...ticketMsgs, ...faqMsgs].sort(compareMsgs);
}

/**
 * Keep local FAQ/AI (and any unsynced turns) when entering or refreshing the agent thread.
 * Prefer ticket rows when the same content already exists on the ticket.
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
  const extras: Msg[] = [];

  for (const m of localMsgs) {
    if (m.ticketCreatedNotice) continue;
    if (m.id && byId.has(m.id)) continue;
    // Mode notices (enter/exit agent) must survive sync even if ticket has a similar divider.
    if (m.localOnly) {
      const already =
        extras.some(
          (e) =>
            e.localOnly &&
            e.text === m.text &&
            (e.sortAt ?? "") === (m.sortAt ?? ""),
        ) ||
        ticketThread.some(
          (t) =>
            t.localOnly &&
            t.text === m.text &&
            (t.sortAt ?? "") === (m.sortAt ?? ""),
        );
      if (!already) extras.push(m);
      continue;
    }
    const key = messageDedupeKey(m);
    if (!m.text.trim() || seenText.has(key)) continue;
    seenText.add(key);
    extras.push(m);
  }

  if (!extras.length) return ticketThread;
  return [...ticketThread, ...extras].sort(compareMsgs);
}

export const AGENT_ENTER_NOTICE = "You've reached our customer support agent";
export const AGENT_EXIT_NOTICE = "You've left customer support";

/** Append a centered system divider at the end of the timeline (skip if already in thread). */
export function appendSystemNotice(messages: Msg[], text: string): Msg[] {
  const trimmed = text.trim();
  if (!trimmed) return messages;
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
