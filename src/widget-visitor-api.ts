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

export async function postVisitorIdentify(
  apiBaseUrl: string,
  body: { email: string; name?: string }
): Promise<VisitorApiResult> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/v1/chat-bot/auth/identify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email.trim(),
      ...(body.name?.trim() ? { name: body.name.trim() } : {}),
    }),
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message
        ? json.message
        : `Identify failed (${res.status})`
    );
  }
  return readEnvelope(json);
}

export async function postVisitorEscalate(
  apiBaseUrl: string,
  body: { email: string; name?: string; projectToken: string; message: string }
): Promise<VisitorApiResult> {
  assertCompleteJwt(body.projectToken, "projectToken");
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/v1/chat-bot/auth/escalate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email.trim(),
      message: body.message.trim(),
      token: body.projectToken,
      ...(body.name?.trim() ? { name: body.name.trim() } : {}),
    }),
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message
        ? json.message
        : `Escalate failed (${res.status})`
    );
  }
  return readEnvelope(json);
}
