import React, { useState } from "react";
import type { ThemeSettings } from "../../types";

type Props = {
  themeSettings: ThemeSettings;
  busy: boolean;
  onSubmit: (rating: number) => Promise<void>;
  onSkip: () => void;
};

/**
 * Elevated white card — matches the floating “Made in Bolt” badge look
 * (white surface, soft shadow, dark type) so it reads clearly on dark widgets.
 */
export default function ConversationRatingPrompt({
  themeSettings,
  busy,
  onSubmit,
  onSkip,
}: Props) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const primary = themeSettings.primaryColor ?? "#006D77";

  async function handleSubmit() {
    if (!selected || busy) return;
    await onSubmit(selected);
  }

  return (
    <div
      style={{
        margin: "4px 0 12px",
        padding: "16px 18px",
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <p
        style={{
          margin: "0 0 4px",
          fontSize: 14,
          fontWeight: 700,
          color: "#111827",
          letterSpacing: "-0.01em",
        }}
      >
        How was your conversation?
      </p>
      <p
        style={{
          margin: "0 0 14px",
          fontSize: 12,
          lineHeight: 1.4,
          color: "#6b7280",
        }}
      >
        Rate your experience after this chat has ended.
      </p>

      <div
        style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}
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
                color: active ? "#f59e0b" : "#d1d5db",
                transition: "color 0.12s ease",
              }}
            >
              ★
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }}>
        <button
          type="button"
          onClick={onSkip}
          disabled={busy}
          style={{
            border: "none",
            background: "transparent",
            color: "#6b7280",
            fontSize: 13,
            fontWeight: 500,
            cursor: busy ? "not-allowed" : "pointer",
            padding: "8px 12px",
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
            borderRadius: 999,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            background: primary,
            opacity: !selected || busy ? 0.55 : 1,
            cursor: !selected || busy ? "not-allowed" : "pointer",
            boxShadow: !selected || busy ? "none" : "0 2px 8px rgba(0,0,0,0.18)",
          }}
        >
          {busy ? "Submitting…" : "Submit"}
        </button>
      </div>
    </div>
  );
}
