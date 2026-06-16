import { io, type Socket } from "socket.io-client";
import type { VisitorTicketMessage, VisitorTicketSummary } from "../widget-visitor-api";

export type VisitorSocketEvent = "receive-message" | "ticket-updated";

let socket: Socket | null = null;
let currentToken: string | null = null;
let currentBaseUrl: string | null = null;

const handlerSets: Record<
  VisitorSocketEvent,
  Set<(payload: Record<string, unknown>) => void>
> = {
  "receive-message": new Set(),
  "ticket-updated": new Set(),
};

function attachAllHandlers(s: Socket) {
  s.off("receive-message");
  s.off("ticket-updated");
  handlerSets["receive-message"].forEach((fn) => s.on("receive-message", fn));
  handlerSets["ticket-updated"].forEach((fn) => s.on("ticket-updated", fn));
}

export function ensureVisitorSocket(apiBaseUrl: string, accessToken: string): Socket | null {
  const base = apiBaseUrl.replace(/\/$/, "");
  if (!base || !accessToken) return null;

  if (socket?.connected && currentToken === accessToken && currentBaseUrl === base) {
    return socket;
  }

  socket?.disconnect();
  currentToken = accessToken;
  currentBaseUrl = base;

  socket = io(base, {
    query: { token: accessToken },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 8,
  });

  socket.on("connect", () => {
    if (socket) attachAllHandlers(socket);
  });

  attachAllHandlers(socket);
  return socket;
}

export function subscribeVisitorSocket(
  event: VisitorSocketEvent,
  handler: (payload: Record<string, unknown>) => void,
): () => void {
  handlerSets[event].add(handler);
  return () => {
    handlerSets[event].delete(handler);
  };
}

export function disconnectVisitorSocket() {
  socket?.disconnect();
  socket = null;
  currentToken = null;
  currentBaseUrl = null;
  handlerSets["receive-message"].clear();
  handlerSets["ticket-updated"].clear();
}

function parseMessageAttrs(attrs: Record<string, unknown>): VisitorTicketMessage {
  const role = attrs.senderRole;
  return {
    id: "",
    senderRole: role === "visitor" || role === "staff" ? role : "unknown",
    senderLabel:
      typeof attrs.senderLabel === "string" ? attrs.senderLabel : "Support",
    text: typeof attrs.text === "string" ? attrs.text : "",
    createdAt:
      typeof attrs.createdAt === "string" ? attrs.createdAt : null,
  };
}

export function parseSocketTicketMessage(
  payload: Record<string, unknown>,
): VisitorTicketMessage | null {
  const data = payload.data;
  if (data && typeof data === "object") {
    const rows = Array.isArray(data) ? data : [data];
    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) return null;
    const attrs = (row.attributes ?? {}) as Record<string, unknown>;
    const parsed = parseMessageAttrs(attrs);
    parsed.id = String(row.id ?? "");
    if (!parsed.id) return null;
    return parsed;
  }

  const id = payload._id != null ? String(payload._id) : payload.id != null ? String(payload.id) : "";
  if (!id) return null;

  const role = payload.senderRole;
  return {
    id,
    senderRole: role === "visitor" || role === "staff" ? role : "unknown",
    senderLabel:
      typeof payload.senderLabel === "string" ? payload.senderLabel : "Support",
    text: typeof payload.text === "string" ? payload.text : "",
    createdAt:
      typeof payload.createdAt === "string"
        ? payload.createdAt
        : payload.createdAt != null
          ? String(payload.createdAt)
          : null,
  };
}

export function visitorTicketSummaryFromSocket(
  payload: Record<string, unknown>,
): VisitorTicketSummary | null {
  const ticketId = payload.ticketId != null ? String(payload.ticketId) : "";
  if (!ticketId) return null;

  return {
    id: ticketId,
    status: typeof payload.status === "string" ? payload.status : "open",
    rating:
      typeof payload.rating === "number" && !Number.isNaN(payload.rating)
        ? payload.rating
        : null,
    ratedAt: typeof payload.ratedAt === "string" ? payload.ratedAt : null,
    canRate: payload.canRate === true,
    hasAssignedAgent: payload.hasAssignedAgent === true,
  };
}
