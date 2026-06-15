import React, { useState } from "react";
import type { ThemeSettings } from "../../types";

type Props = {
  themeSettings: ThemeSettings;
  busy: boolean;
  onSubmit: (rating: number) => Promise<void>;
  onSkip: () => void;
};

export default function ConversationRatingPrompt({
  themeSettings,
  busy,
  onSubmit,
  onSkip,
}: Props) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const primary = themeSettings.primaryColor ?? "#006D77";
  const isDark = themeSettings.isDarkMode;

  async function handleSubmit() {
    if (!selected || busy) return;
    await onSubmit(selected);
  }

  return (
    <div
      style={{
        margin: "12px 16px 0",
        padding: "14px 16px",
        borderRadius: 12,
        border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,109,119,0.06)",
      }}
    >
      <p
        style={{
          margin: "0 0 4px",
          fontSize: 14,
          fontWeight: 600,
          color: isDark ? "#fff" : "#1a1a1a",
        }}
      >
        How was your conversation?
      </p>
      <p
        style={{
          margin: "0 0 12px",
          fontSize: 12,
          color: isDark ? "rgba(255,255,255,0.72)" : "#6b7280",
        }}
      >
        Rate your experience after this chat has ended.
      </p>

      <div
        style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}
        role="radiogroup"
        aria-label="Rate your conversation from 1 to 5 stars"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= (hovered || selected);
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={selected === star}
              disabled={busy}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(star)}
              style={{
                border: "none",
                background: "transparent",
                cursor: busy ? "not-allowed" : "pointer",
                fontSize: 28,
                lineHeight: 1,
                padding: 0,
                color: active ? "#f59e0b" : isDark ? "#4b5563" : "#d1d5db",
                transition: "color 0.12s ease",
              }}
            >
              ★
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onSkip}
          disabled={busy}
          style={{
            border: "none",
            background: "transparent",
            color: isDark ? "rgba(255,255,255,0.7)" : "#6b7280",
            fontSize: 13,
            cursor: busy ? "not-allowed" : "pointer",
            padding: "6px 10px",
          }}
        >
          Skip
        </button>
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!selected || busy}
          style={{
            border: "none",
            borderRadius: 20,
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            background: primary,
            opacity: !selected || busy ? 0.55 : 1,
            cursor: !selected || busy ? "not-allowed" : "pointer",
          }}
        >
          {busy ? "Submitting…" : "Submit"}
        </button>
      </div>
    </div>
  );
}
