import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { ThemeSettings } from "../../types/index";
import { widgetFormFontSize, widgetHeaderSubFontSize } from "../lib/widget-font-size";
import {
  INVALID_EMAIL_MESSAGE,
  REQUIRED_EMAIL_MESSAGE,
  isValidEmail,
} from "../lib/email";

export type EscalatePayload = {
  subject: string;
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
  initialSummary,
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
  initialSummary?: string;
}) {
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState(initialSummary ?? "");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [name, setName] = useState(initialName ?? "");
  const [localError, setLocalError] = useState<string | null>(null);
  const formFontSize = widgetFormFontSize(themeSettings.fontSizeBase);
  const headerSubSize = widgetHeaderSubFontSize(themeSettings.fontSizeBase);

  const canSubmit =
    !busy &&
    subject.trim().length >= 3 &&
    summary.trim().length >= 3 &&
    (!collectIdentity || Boolean(email.trim()));

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
          {collectIdentity
            ? "Please leave your email address so we can contact you:"
            : "Describe your issue. Our team can continue by email if no agent is available."}
        </p>
        {collectIdentity ? (
          <>
            <div style={{ marginBottom: 10 }}>
              <label style={styles.formLabel as React.CSSProperties}>Name (optional)</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="chat-widget-form-input"
                style={styles.formInput as React.CSSProperties}
                placeholder="Enter name"
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={styles.formLabel as React.CSSProperties}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (localError) setLocalError(null);
                }}
                className="chat-widget-form-input"
                style={styles.formInput as React.CSSProperties}
                placeholder="Enter email address"
              />
            </div>
          </>
        ) : null}
        <div style={{ marginBottom: 10 }}>
          <label style={styles.formLabel as React.CSSProperties}>Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="chat-widget-form-input"
            style={styles.formInput as React.CSSProperties}
            placeholder="Enter subject for query"
            maxLength={200}
          />
        </div>
        <div style={{ marginBottom: 4 }}>
          <label style={styles.formLabel as React.CSSProperties}>Query</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={5}
            className="chat-widget-form-input"
            style={{
              ...(styles.formTextarea as React.CSSProperties),
              width: "100%",
              minHeight: 120,
              fontSize: formFontSize,
            }}
            placeholder="Enter the issue you're facing"
            maxLength={5000}
          />
        </div>
        {localError ? (
          <p
            role="alert"
            style={{
              margin: "10px 0 0",
              color: "#f87171",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {localError}
          </p>
        ) : null}
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={async () => {
              if (collectIdentity) {
                const trimmed = email.trim();
                if (!trimmed) {
                  setLocalError(REQUIRED_EMAIL_MESSAGE);
                  return;
                }
                if (!isValidEmail(trimmed)) {
                  setLocalError(INVALID_EMAIL_MESSAGE);
                  return;
                }
              }
              if (subject.trim().length < 3) {
                setLocalError("Please enter a subject (at least 3 characters).");
                return;
              }
              if (summary.trim().length < 3) {
                setLocalError("Please describe your issue (at least 3 characters).");
                return;
              }
              setLocalError(null);
              await onSubmit({
                subject: subject.trim(),
                summary: summary.trim(),
                ...(collectIdentity
                  ? { email: email.trim(), name: name.trim() || undefined }
                  : {}),
              });
            }}
            style={{
              ...(styles.sendPill as React.CSSProperties),
              opacity: canSubmit ? 1 : 0.6,
            }}
          >
            {busy ? "Sending…" : "Send request"}
          </button>
        </div>
      </div>
    </div>
  );
}
