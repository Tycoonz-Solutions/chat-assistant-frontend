import { assertCompleteJwt } from "./chat-backend";
import type { FAQ, ThemeSettings } from "../../types";

const FONT_SIZES = new Set<ThemeSettings["fontSizeBase"]>([23, 24, 26, 28]);
const POSITIONS = new Set<NonNullable<ThemeSettings["position"]>>([
  "bottom-right",
  "bottom-left",
  "top-right",
  "top-left",
]);

export type WidgetCapabilities = {
  aiChatEnabled: boolean;
  agentSupportEnabled: boolean;
};

export type WidgetConfig = {
  appearance: Partial<ThemeSettings>;
  faqs: FAQ[];
  capabilities: WidgetCapabilities;
};

export class WidgetConfigError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "WidgetConfigError";
    this.status = status;
  }
}

/** 401/403 — project inactive, deleted, bad token, or domain blocked. */
export function isWidgetConfigHardFailure(err: unknown): boolean {
  if (err instanceof WidgetConfigError) {
    return err.status === 401 || err.status === 403;
  }
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  return (
    msg.includes("inactive") ||
    msg.includes("no longer available") ||
    msg.includes("has been removed") ||
    msg.includes("not authorized") ||
    msg.includes("invalid or revoked") ||
    msg.includes("invalid or expired")
  );
}

const DEFAULT_CAPABILITIES: WidgetCapabilities = {
  aiChatEnabled: true,
  agentSupportEnabled: true,
};

function parseCapabilities(raw: unknown): WidgetCapabilities {
  if (!raw || typeof raw !== "object") return DEFAULT_CAPABILITIES;
  const c = raw as Record<string, unknown>;
  return {
    aiChatEnabled: c.aiChatEnabled !== false,
    agentSupportEnabled: c.agentSupportEnabled !== false,
  };
}

function parseFaqList(raw: unknown): FAQ[] {
  if (!Array.isArray(raw)) return [];
  const out: FAQ[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const question =
      typeof (item as { question?: unknown }).question === "string"
        ? (item as { question: string }).question.trim()
        : "";
    const ans =
      typeof (item as { ans?: unknown }).ans === "string"
        ? (item as { ans: string }).ans.trim()
        : "";
    if (question && ans) out.push({ question, ans });
  }
  return out;
}

function parseAppearanceAttributes(a: Record<string, unknown>): Partial<ThemeSettings> {
  const out: Partial<ThemeSettings> = {};
  if (typeof a.botName === "string" && a.botName.trim()) out.botName = a.botName.trim();
  if (typeof a.greetingMessage === "string") out.greetingMessage = a.greetingMessage;
  if (typeof a.isDarkMode === "boolean") out.isDarkMode = a.isDarkMode;
  if (typeof a.primaryColor === "string") out.primaryColor = a.primaryColor;
  if (typeof a.secondaryColor === "string") out.secondaryColor = a.secondaryColor;
  if (typeof a.isGradient === "boolean") out.isGradient = a.isGradient;
  const fontSizeBase = a.fontSizeBase;
  if (
    typeof fontSizeBase === "number" &&
    FONT_SIZES.has(fontSizeBase as ThemeSettings["fontSizeBase"])
  ) {
    out.fontSizeBase = fontSizeBase as ThemeSettings["fontSizeBase"];
  }
  const position = a.position;
  if (
    typeof a.position === "string" &&
    POSITIONS.has(position as NonNullable<ThemeSettings["position"]>)
  ) {
    out.position = position as ThemeSettings["position"];
  }
  if (typeof a.botAvatarUrl === "string" && a.botAvatarUrl.trim()) {
    out.botAvatarUrl = a.botAvatarUrl.trim();
  }
  return out;
}

/**
 * Loads appearance + project FAQs for the embed widget.
 */
export async function fetchWidgetConfig(
  apiBaseUrl: string,
  projectToken: string
): Promise<WidgetConfig> {
  assertCompleteJwt(projectToken, "projectToken");
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/v1/appearance/widget-config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: projectToken.trim() }),
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok || json.success === false) {
    const status = res.status;
    const serverMsg =
      typeof json.message === "string" && json.message ? json.message : "";
    if (status === 403) {
      throw new WidgetConfigError(
        serverMsg ||
          "This organisation is inactive. The chat widget is not available right now.",
        status,
      );
    }
    if (status === 401) {
      throw new WidgetConfigError(
        serverMsg ||
          "Project token is invalid or expired. Copy a fresh token from Admin → Projects.",
        status,
      );
    }
    if (status === 503) {
      throw new WidgetConfigError(
        serverMsg ||
          "Server cannot reach the database right now. Check MongoDB Atlas and your network, then refresh.",
        status,
      );
    }
    throw new WidgetConfigError(serverMsg || `Widget config failed (${status})`, status);
  }

  const data = json.data as { attributes?: Record<string, unknown> } | undefined;
  const attrs = data?.attributes ?? {};
  const appearance = parseAppearanceAttributes(attrs);

  const fromMeta = parseFaqList((json.meta as { faqs?: unknown } | undefined)?.faqs);
  const fromAttrs = parseFaqList(attrs.faqs);
  const faqs = fromMeta.length > 0 ? fromMeta : fromAttrs;
  const capabilities = parseCapabilities(
    (json.meta as { capabilities?: unknown } | undefined)?.capabilities,
  );

  return { appearance, faqs, capabilities };
}

/** @deprecated Use fetchWidgetConfig */
export async function fetchWidgetAppearance(
  apiBaseUrl: string,
  projectToken: string
): Promise<Partial<ThemeSettings>> {
  const { appearance } = await fetchWidgetConfig(apiBaseUrl, projectToken);
  return appearance;
}
