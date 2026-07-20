import type { Msg } from "../../types/index";

export type EscalateTranscriptTurn = {
  role: "user" | "assistant";
  content: string;
  at?: string;
};

/** Build AI chat history to persist when the visitor escalates to a ticket. */
export function buildEscalateTranscript(messages: Msg[]): EscalateTranscriptTurn[] {
  return messages
    .filter(
      (m) =>
        !m.faqLocal &&
        !m.isStaff &&
        (m.role === "user" || m.role === "bot") &&
        m.text.trim().length > 0,
    )
    .map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: m.text.trim(),
      ...(m.sortAt ? { at: m.sortAt } : {}),
    }));
}

/** Prefill escalate summary from the latest visitor message in the AI thread. */
export function lastUserMessageForEscalate(messages: Msg[]): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const m = messages[i];
    if (m.role === "user" && !m.faqLocal && m.text.trim()) {
      return m.text.trim();
    }
  }
  return "";
}
