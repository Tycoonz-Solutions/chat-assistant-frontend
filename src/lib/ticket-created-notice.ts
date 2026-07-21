import type { Msg } from "../../types/index";
import { formatTicketId } from "./formatTicketId";
import { widgetProjectStorageId } from "./widget-storage-id";

/** Visitor-facing ticket status label. */
export function formatVisitorTicketStatus(status: string | null | undefined): string {
  const s = (status || "open").trim().toLowerCase();
  if (s === "new") return "New";
  if (s === "in_progress" || s === "in-progress") return "In Progress";
  if (s === "resolved") return "Resolved";
  return "Open";
}

function noticeStorageKey(projectToken: string | undefined, ticketId: string): string {
  return `chat-widget-ticket-created-notice-${widgetProjectStorageId(projectToken)}-${ticketId}`;
}

/** Remember to show the post-escalate confirmation across ticket syncs. */
export function markTicketCreatedNotice(
  projectToken: string | undefined,
  ticketId: string,
): void {
  if (typeof window === "undefined" || !ticketId) return;
  try {
    sessionStorage.setItem(noticeStorageKey(projectToken, ticketId), "1");
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearTicketCreatedNotice(
  projectToken: string | undefined,
  ticketId: string,
): void {
  if (typeof window === "undefined" || !ticketId) return;
  try {
    sessionStorage.removeItem(noticeStorageKey(projectToken, ticketId));
  } catch {
    /* ignore */
  }
}

export function shouldShowTicketCreatedNotice(
  projectToken: string | undefined,
  ticketId: string,
): boolean {
  if (typeof window === "undefined" || !ticketId) return false;
  try {
    return sessionStorage.getItem(noticeStorageKey(projectToken, ticketId)) === "1";
  } catch {
    return false;
  }
}

/** Local-only confirmation shown in the widget after escalate (not stored on the ticket). */
export function buildTicketCreatedNoticeMsg(
  ticketId: string,
  nowTime: () => string,
): Msg {
  const idLabel = formatTicketId(ticketId);
  const text = [
    "Your support ticket has been created successfully.",
    "",
    `Ticket ID: ${idLabel}`,
    "",
    "Our support team has been notified and will respond during working hours. You’ll get a confirmation email, and another when an agent replies.",
    "",
    "Estimated Response Time: Within 24 hours.",
  ].join("\n");

  return {
    id: `ticket-created-notice-${ticketId}`,
    role: "bot",
    text,
    time: nowTime(),
    sortAt: new Date().toISOString(),
    ticketCreatedNotice: true,
    senderName: "Support",
  };
}

/** Append the confirmation when syncing a ticket thread, if marked for this ticket.
 * Hide (and clear) once an agent/staff has replied — the waiting notice is no longer useful.
 */
export function withTicketCreatedNotice(
  thread: Msg[],
  projectToken: string | undefined,
  ticketId: string,
  nowTime: () => string,
): Msg[] {
  const hasStaffReply = thread.some((m) => m.isStaff);
  if (hasStaffReply) {
    clearTicketCreatedNotice(projectToken, ticketId);
    return thread.filter((m) => !m.ticketCreatedNotice);
  }

  if (!shouldShowTicketCreatedNotice(projectToken, ticketId)) {
    return thread.filter((m) => !m.ticketCreatedNotice);
  }
  if (thread.some((m) => m.ticketCreatedNotice)) return thread;
  return [...thread, buildTicketCreatedNoticeMsg(ticketId, nowTime)];
}
