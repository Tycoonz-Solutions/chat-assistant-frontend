import { assertCompleteJwt } from "./lib/chat-backend";

export type VisitorApiResult = {
  message: string;
  accessToken: string;
  ticketId?: string | null;
  email?: string;
  name?: string;
};

function readEnvelope(json: Record<string, unknown>): VisitorApiResult {
  const data = json.data as Record<string, unknown> | undefined;
  const attrs = (data?.attributes ?? {}) as Record<string, unknown>;
  const accessToken = attrs.accessToken;
  if (typeof accessToken !== "string" || !accessToken) {
    throw new Error("Unexpected response from server");
  }
  return {
    message: typeof json.message === "string" ? json.message : "OK",
    accessToken,
    ticketId: (attrs.ticketId as string | null | undefined) ?? null,
    email: typeof attrs.email === "string" ? attrs.email : undefined,
    name: typeof attrs.name === "string" ? attrs.name : undefined,
  };
}

/** Prefer field errors (especially email) over a generic API message. */
function apiErrorMessage(json: Record<string, unknown>, fallback: string): string {
  const errors = json.errors;
  if (errors && typeof errors === "object" && !Array.isArray(errors)) {
    const map = errors as Record<string, unknown>;
    if (typeof map.email === "string" && map.email.trim()) return map.email.trim();
    const first = Object.values(map).find(
      (v) => typeof v === "string" && v.trim() && v.trim().toLowerCase() !== "validation error"
    );
    if (typeof first === "string") return first.trim();
  }
  if (typeof json.message === "string" && json.message.trim()) {
    const msg = json.message.trim();
    if (msg.toLowerCase() !== "validation error") return msg;
  }
  return fallback;
}

export async function postVisitorIdentify(
  apiBaseUrl: string,
  body: { email: string; name?: string; projectToken?: string }
): Promise<VisitorApiResult> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/v1/chat-bot/auth/identify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email.trim(),
      ...(body.name?.trim() ? { name: body.name.trim() } : {}),
      ...(body.projectToken?.trim() ? { token: body.projectToken.trim() } : {}),
    }),
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || json.success === false) {
    throw new Error(apiErrorMessage(json, `Identify failed (${res.status})`));
  }
  return readEnvelope(json);
}

export type VisitorTicketMessage = {
  id: string;
  senderRole: "visitor" | "staff" | "bot" | "unknown";
  senderLabel: string;
  senderAvatar?: string | null;
  text: string;
  createdAt: string | null;
};

function parseTicketMessages(json: Record<string, unknown>): VisitorTicketMessage[] {
  const data = json.data;
  const rows = Array.isArray(data) ? data : data ? [data] : [];
  return rows.map((row) => {
    const r = row as Record<string, unknown>;
    const attrs = (r.attributes ?? {}) as Record<string, unknown>;
    const role = attrs.senderRole;
    return {
      id: String(r.id ?? ""),
      senderRole:
        role === "visitor" || role === "staff" || role === "bot" ? role : "unknown",
      senderLabel:
        typeof attrs.senderLabel === "string" ? attrs.senderLabel : "Support",
      senderAvatar:
        typeof attrs.senderAvatar === "string" && attrs.senderAvatar.trim()
          ? attrs.senderAvatar.trim()
          : null,
      text: typeof attrs.text === "string" ? attrs.text : "",
      createdAt:
        typeof attrs.createdAt === "string" ? attrs.createdAt : null,
    };
  });
}

export async function listVisitorTicketMessages(
  apiBaseUrl: string,
  ticketId: string,
  accessToken: string
): Promise<VisitorTicketMessage[]> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(
    `${base}/api/v1/chat-bot/auth/ticket/${encodeURIComponent(ticketId)}/messages`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message
        ? json.message
        : `Could not load conversation (${res.status})`
    );
  }
  return parseTicketMessages(json);
}

export type VisitorTicketSummary = {
  id: string;
  status: string;
  rating: number | null;
  ratedAt: string | null;
  canRate: boolean;
  hasAssignedAgent: boolean;
};

function parseVisitorTicketSummary(json: Record<string, unknown>): VisitorTicketSummary {
  const data = json.data as Record<string, unknown> | undefined;
  const attrs = (data?.attributes ?? {}) as Record<string, unknown>;
  return {
    id: String(data?.id ?? ""),
    status: typeof attrs.status === "string" ? attrs.status : "open",
    rating:
      typeof attrs.rating === "number" && !Number.isNaN(attrs.rating)
        ? attrs.rating
        : null,
    ratedAt: typeof attrs.ratedAt === "string" ? attrs.ratedAt : null,
    canRate: attrs.canRate === true,
    hasAssignedAgent: attrs.hasAssignedAgent === true,
  };
}

export async function getVisitorTicket(
  apiBaseUrl: string,
  ticketId: string,
  accessToken: string
): Promise<VisitorTicketSummary> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(
    `${base}/api/v1/chat-bot/auth/ticket/${encodeURIComponent(ticketId)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message
        ? json.message
        : `Could not load conversation (${res.status})`
    );
  }
  return parseVisitorTicketSummary(json);
}

export async function postVisitorTicketRating(
  apiBaseUrl: string,
  ticketId: string,
  accessToken: string,
  rating: number,
  comment?: string
): Promise<VisitorTicketSummary> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(
    `${base}/api/v1/chat-bot/auth/ticket/${encodeURIComponent(ticketId)}/rating`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        rating,
        ...(comment?.trim() ? { comment: comment.trim() } : {}),
      }),
    }
  );
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message
        ? json.message
        : `Could not submit rating (${res.status})`
    );
  }
  return parseVisitorTicketSummary(json);
}

export async function postVisitorTicketMessage(
  apiBaseUrl: string,
  ticketId: string,
  accessToken: string,
  text: string
): Promise<VisitorTicketMessage> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(
    `${base}/api/v1/chat-bot/auth/ticket/${encodeURIComponent(ticketId)}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ text: text.trim() }),
    }
  );
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message
        ? json.message
        : `Could not send message (${res.status})`
    );
  }
  const list = parseTicketMessages(json);
  if (!list[0]) throw new Error("Unexpected response from server");
  return list[0];
}

export type EscalateTranscriptTurn = {
  role: "user" | "assistant";
  content: string;
  at?: string;
};

export async function postVisitorEscalate(
  apiBaseUrl: string,
  body: {
    email: string;
    name?: string;
    projectToken: string;
    subject: string;
    message: string;
    transcript?: EscalateTranscriptTurn[];
  }
): Promise<VisitorApiResult> {
  assertCompleteJwt(body.projectToken, "projectToken");
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/v1/chat-bot/auth/escalate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email.trim(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      token: body.projectToken,
      ...(body.name?.trim() ? { name: body.name.trim() } : {}),
      ...(body.transcript?.length ? { transcript: body.transcript } : {}),
    }),
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || json.success === false) {
    throw new Error(apiErrorMessage(json, `Escalate failed (${res.status})`));
  }
  return readEnvelope(json);
}
