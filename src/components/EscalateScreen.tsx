import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { ThemeSettings } from "../../types/index";
import { widgetFormFontSize, widgetHeaderSubFontSize } from "../lib/widget-font-size";

export type EscalatePayload = {
  summary: string;
  email?: string;
  name?: string;
};

export default function EscalateScreen({
  styles,
  themeSettings,
  title,
  onBack,
  onSubmit,
  busy,
  collectIdentity,
  initialEmail,
  initialName,
}: {
  styles: Record<string, React.CSSProperties>;
  themeSettings: ThemeSettings;
  title: string;
  onBack: () => void;
  onSubmit: (payload: EscalatePayload) => void | Promise<void>;
  busy: boolean;
  collectIdentity: boolean;
  initialEmail?: string;
  initialName?: string;
}) {
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [name, setName] = useState(initialName ?? "");
  const formFontSize = widgetFormFontSize(themeSettings.fontSizeBase);
  const headerSubSize = widgetHeaderSubFontSize(themeSettings.fontSizeBase);

  return (
    <div style={styles.chatScreen}>
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              borderRadius: 8,
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: themeSettings?.fontSizeBase
                  ? themeSettings.fontSizeBase / 2 + 4
                  : 16,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: headerSubSize,
                opacity: 0.9,
              }}
            >
              Contact support
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 20,
          color: themeSettings?.isDarkMode ? "#f1f5f9" : "#1e293b",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: formFontSize,
            lineHeight: 1.5,
          }}
        >
          Describe your issue. Our team can continue by email if no agent is available.
        </p>
        {collectIdentity ? (
          <>
            <div style={{ marginBottom: 10 }}>
              <label style={styles.formLabel as React.CSSProperties}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="chat-widget-form-input"
                style={styles.formInput as React.CSSProperties}
                placeholder="you@example.com"
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={styles.formLabel as React.CSSProperties}>Name (optional)</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="chat-widget-form-input"
                style={styles.formInput as React.CSSProperties}
                placeholder="Your name"
              />
            </div>
          </>
        ) : null}
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={6}
          className="chat-widget-form-input"
          style={{
            ...(styles.formTextarea as React.CSSProperties),
            width: "100%",
            minHeight: 140,
            fontSize: formFontSize,
          }}
          placeholder="What do you need help with?"
        />
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            disabled={
              busy ||
              summary.trim().length < 3 ||
              (collectIdentity && !email.trim())
            }
            onClick={async () => {
              await onSubmit({
                summary: summary.trim(),
                ...(collectIdentity
                  ? { email: email.trim(), name: name.trim() || undefined }
                  : {}),
              });
            }}
            style={{
              ...(styles.sendPill as React.CSSProperties),
              opacity:
                busy || summary.trim().length < 3 || (collectIdentity && !email.trim())
                  ? 0.6
                  : 1,
            }}
          >
            {busy ? "Sending…" : "Send request"}
          </button>
        </div>
      </div>
    </div>
  );
}
