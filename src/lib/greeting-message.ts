import type { ThemeSettings } from "../../types";

const DEFAULT_GREETING_BODY =
  "AI chat powered by our team — how can we assist you today?";

const DEFAULT_PRECHAT_BODY =
  "Tell us who you are so we can help and follow up by email if needed.";

/** Old/default first-line slogans — never show these as the welcome headline. */
const DISCARDED_HEADLINES = [
  /^at your service!?$/i,
  /^hi there!?$/i,
  /^hello!?$/i,
];

function isDiscardedHeadline(line: string): boolean {
  return DISCARDED_HEADLINES.some((re) => re.test(line.trim()));
}

/**
 * First line = headline, rest = subtitle (legacy greeting field shape).
 * Prefer {@link resolveWelcomeCopy} for visitor-facing welcome UI.
 */
export function splitGreetingMessage(raw: string | undefined): {
  headline: string;
  subtitle: string;
} {
  const t = (raw ?? "").trim();
  if (!t) return { headline: "", subtitle: "" };
  const idx = t.indexOf("\n");
  if (idx === -1) return { headline: t, subtitle: "" };
  return { headline: t.slice(0, idx).trim(), subtitle: t.slice(idx + 1).trim() };
}

export function resolveBotName(themeSettings: Pick<ThemeSettings, "botName">): string {
  return themeSettings.botName?.trim() || "AI Chatbot";
}

/**
 * Visitor welcome: always lead with the chatbot name.
 * Configured greeting text is supporting copy only (never "At your service!").
 */
export function resolveWelcomeCopy(
  themeSettings: Pick<ThemeSettings, "botName" | "greetingMessage">,
  options?: { preChat?: boolean },
): { headline: string; subtitle: string } {
  const botName = resolveBotName(themeSettings);
  const headline = `Welcome! I'm ${botName}`;

  const { headline: first, subtitle: rest } = splitGreetingMessage(
    themeSettings.greetingMessage,
  );

  let subtitle = "";
  if (rest) {
    subtitle = rest;
  } else if (first && !isDiscardedHeadline(first)) {
    subtitle = first;
  }

  if (!subtitle) {
    subtitle = options?.preChat ? DEFAULT_PRECHAT_BODY : DEFAULT_GREETING_BODY;
  }

  return { headline, subtitle };
}
