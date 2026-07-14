const DEFAULT_GREETING =
  "Hi there!\nAI chat powered by our team - how can we assist you today?";

export function splitGreetingMessage(raw: string | undefined): {
  headline: string;
  subtitle: string;
} {
  const t = (raw ?? "").trim() || DEFAULT_GREETING;
  const idx = t.indexOf("\n");
  if (idx === -1) return { headline: t, subtitle: "" };
  return { headline: t.slice(0, idx).trim(), subtitle: t.slice(idx + 1).trim() };
}
