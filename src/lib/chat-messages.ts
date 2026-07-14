export const AI_CHAT_UNAVAILABLE_MESSAGE =
  "AI chat is currently unavailable. Please contact our support team for assistance";

export const RATE_LIMIT_CHAT_ERROR_MESSAGE =
  "We're busy right now. Please try again in a moment or contact support.";

export const GENERIC_CHAT_ERROR_MESSAGE =
  "Something went wrong. Please try again in a moment.";

export function isAiChatUnavailableError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("ai chat is not available") ||
    lower.includes("ai chat is currently unavailable") ||
    lower.includes("not available for this organisation")
  );
}

function isTechnicalChatError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("429") ||
    lower.includes("rate limit") ||
    lower.includes("quota") ||
    lower.includes("openai") ||
    lower.includes("api-errors") ||
    lower.includes("exceeded your current") ||
    lower.includes("econnrefused") ||
    lower.includes("fetch failed") ||
    lower.includes("network error") ||
    lower.includes("api key") ||
    lower.includes("incorrect api key") ||
    /\b(500|502|503|504)\b/.test(lower)
  );
}

export function userFacingChatError(message: string): string {
  if (isAiChatUnavailableError(message)) return AI_CHAT_UNAVAILABLE_MESSAGE;

  const lower = message.toLowerCase();
  if (
    lower.includes("429") ||
    lower.includes("rate limit") ||
    lower.includes("quota") ||
    lower.includes("exceeded your current")
  ) {
    return RATE_LIMIT_CHAT_ERROR_MESSAGE;
  }

  if (isTechnicalChatError(message)) return GENERIC_CHAT_ERROR_MESSAGE;

  return message.trim() || GENERIC_CHAT_ERROR_MESSAGE;
}
