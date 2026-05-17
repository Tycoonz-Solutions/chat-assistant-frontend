export type PostChatParams = {
  apiBaseUrl: string;
  message: string;
  projectToken?: string | null;
  siteName?: string;
  websiteDescription?: string;
};

/** A JWT must be `header.payload.signature` — otherwise the backend returns "jwt malformed". */
export function assertCompleteJwt(token: string, label = "Token"): void {
  const t = token.trim();
  const parts = t.split(".");
  if (parts.length !== 3 || parts.some((p) => !p.length)) {
    throw new Error(
      `${label} is not a complete JWT. Copy the full \`projectToken\` from the admin Projects screen ` +
        `(one long string with two dots, e.g. xxxxx.yyyyy.zzzzz — not just the first segment).`
    );
  }
}

/**
 * Calls `POST /api/v1/chat` on your backend (CORS must allow the host site).
 */
export async function postChatCompletion(params: PostChatParams): Promise<string> {
  if (params.projectToken?.trim()) {
    assertCompleteJwt(params.projectToken, "VITE_PROJECT_TOKEN");
  }
  const base = params.apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: params.message,
      ...(params.projectToken
        ? { token: params.projectToken }
        : {
            siteName: params.siteName ?? "N/A",
            websiteDescription: params.websiteDescription ?? "N/A",
          }),
    }),
  });
  const body = (await res.json()) as {
    success?: boolean;
    message?: string;
    data?: unknown;
  };
  if (!res.ok || body.success === false) {
    throw new Error(
      typeof body.message === "string" && body.message
        ? body.message
        : `Chat request failed (${res.status})`
    );
  }
  const d = body.data;
  if (typeof d === "string") return d;
  return String(d ?? "");
}
