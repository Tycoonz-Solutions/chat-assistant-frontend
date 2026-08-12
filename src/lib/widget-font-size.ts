/** Readable body copy derived from appearance fontSizeBase. */
export function widgetBodyFontSize(fontSizeBase?: number): number {
  const base = fontSizeBase ?? 28;
  return Math.max(16, Math.round(base / 2 + 4));
}

/** Form fields — match message bubble size for readability. */
export function widgetFormFontSize(fontSizeBase?: number): number {
  return widgetBodyFontSize(fontSizeBase);
}

/** Header subtitle under the bot name. */
export function widgetHeaderSubFontSize(fontSizeBase?: number): number {
  const base = fontSizeBase ?? 28;
  return Math.max(14, Math.round(base / 2));
}

/** Large welcome headline (pre-chat / welcome banner). */
export function widgetWelcomeHeadlineSize(fontSizeBase?: number): number {
  return fontSizeBase ?? 28;
}

/**
 * Pre-chat name/email screen — keep headline close to form text
 * (base/2 was too small for the greeting; full base was too loud).
 */
export function widgetPrechatHeadlineSize(fontSizeBase?: number): number {
  return widgetFormFontSize(fontSizeBase) + 3;
}

/** Pre-chat subtitle under the welcome line — near form size. */
export function widgetPrechatSubtitleSize(fontSizeBase?: number): number {
  return Math.max(14, widgetFormFontSize(fontSizeBase) - 1);
}
