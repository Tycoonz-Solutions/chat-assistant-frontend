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
