import React, { useState } from "react";
import type { ThemeSettings } from "../../types/index";
import { resolveWelcomeCopy } from "../lib/greeting-message";
import WidgetCloseButton from "./WidgetCloseButton";
import {
  INVALID_EMAIL_MESSAGE,
  REQUIRED_EMAIL_MESSAGE,
  isValidEmail,
} from "../lib/email";
import {
  widgetPrechatHeadlineSize,
  widgetPrechatSubtitleSize,
} from "../lib/widget-font-size";

export default function PreChatScreen({
  styles,
  themeSettings,
  onContinue,
  busy,
  error,
  onClose,
}: {
  styles: Record<string, React.CSSProperties>;
  themeSettings: ThemeSettings;
  onContinue: (payload: { email: string; name: string }) => void | Promise<void>;
  busy: boolean;
  error?: string | null;
  onClose?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const { headline, subtitle } = resolveWelcomeCopy(themeSettings, { preChat: true });
  const headerFontSize = widgetPrechatHeadlineSize(themeSettings?.fontSizeBase);
  const bodyFontSize = widgetPrechatSubtitleSize(themeSettings?.fontSizeBase);
  const shownError = localError || error || null;

  return (
    <div style={styles.welcomeScreen} className="chat-widget-prechat">
      <div style={styles.welcomeHeader} className="chat-widget-welcome-header">
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                margin: 0,
                fontSize: headerFontSize,
                fontWeight: 700,
                marginBottom: 6,
                lineHeight: 1.3,
              }}
            >
              {headline}
            </h2>
            {subtitle ? (
              <p
                style={{
                  margin: 0,
                  fontSize: bodyFontSize,
                  opacity: 0.95,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
          {onClose ? <WidgetCloseButton onClose={onClose} /> : null}
        </div>
      </div>

      <div
        className="chat-widget-prechat-body"
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
        <div style={styles.faqContainer} className="chat-widget-faq-container">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const trimmed = email.trim();
              if (!trimmed) {
                setLocalError(REQUIRED_EMAIL_MESSAGE);
                return;
              }
              if (!isValidEmail(trimmed)) {
                setLocalError(INVALID_EMAIL_MESSAGE);
                return;
              }
              setLocalError(null);
              await onContinue({ email: trimmed, name: name.trim() });
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <label style={styles.formLabel as React.CSSProperties}>Name</label>
              <input
                className="chat-widget-form-input"
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
                className="chat-widget-form-input"
                style={styles.formInput as React.CSSProperties}
                placeholder="you@example.com"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (localError) setLocalError(null);
                }}
                autoComplete="email"
              />
            </div>
            {shownError ? (
              <p
                role="alert"
                style={{
                  margin: "0 0 12px",
                  color: "#f87171",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                {shownError}
              </p>
            ) : null}
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
