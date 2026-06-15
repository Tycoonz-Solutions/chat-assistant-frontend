import React, { useState } from "react";
import type { ThemeSettings } from "../../types/index";

export default function PreChatScreen({
  styles,
  themeSettings,
  onContinue,
  busy,
}: {
  styles: Record<string, React.CSSProperties>;
  themeSettings: ThemeSettings;
  onContinue: (payload: { email: string; name: string }) => void | Promise<void>;
  busy: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div style={styles.welcomeScreen}>
      <div style={styles.welcomeHeader}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              margin: 0,
              fontSize: themeSettings?.fontSizeBase ?? 28,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Before we start
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: (themeSettings?.fontSizeBase ?? 28) / 2,
              opacity: 0.95,
              lineHeight: 1.5,
            }}
          >
            Tell us who you are so we can help and follow up by email if needed.
          </p>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          width: "100%",
          padding: "0 24px 24px",
          boxSizing: "border-box",
        }}
      >
        <div style={styles.faqContainer}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email.trim()) return;
              await onContinue({ email: email.trim(), name: name.trim() });
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <label style={styles.formLabel as React.CSSProperties}>Name</label>
              <input
                style={styles.formInput as React.CSSProperties}
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={styles.formLabel as React.CSSProperties}>Email</label>
              <input
                style={styles.formInput as React.CSSProperties}
                placeholder="you@example.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={busy}
                style={{
                  ...(styles.sendPill as React.CSSProperties),
                  opacity: busy ? 0.7 : 1,
                  pointerEvents: busy ? "none" : undefined,
                }}
              >
                {busy ? "Please wait…" : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
