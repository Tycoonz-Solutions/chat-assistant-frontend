import React from "react";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import FaqListPanel from "./FaqListPanel";
import HelpChip from "./HelpChip";
import type { FAQ, Msg, ThemeSettings } from "../types/index";

const DEFAULT_GREETING = "Hi there!\nHow can we help you today?";

function splitGreeting(raw: string | undefined): { headline: string; subtitle: string } {
  const t = (raw ?? "").trim() || DEFAULT_GREETING;
  const idx = t.indexOf("\n");
  if (idx === -1) return { headline: t, subtitle: "" };
  return { headline: t.slice(0, idx).trim(), subtitle: t.slice(idx + 1).trim() };
}

type Props = {
  styles: Record<string, React.CSSProperties>;
  title: string;
  messages: Msg[];
  showTyping: boolean;
  sending: boolean;
  text: string;
  setText: (s: string) => void;
  onSend: (e?: React.FormEvent) => Promise<void> | void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  themeSettings: ThemeSettings;
  faqs: FAQ[];
  onSelectFAQ: (f: FAQ) => void;
  helpOpen: boolean;
  onHelpOpenChange: (open: boolean) => void;
  hasActiveTicket: boolean;
  canEscalate: boolean;
  onContactSupport?: () => void;
  placeholder: string;
};

export default function WidgetMainView({
  styles,
  title,
  messages,
  showTyping,
  sending,
  text,
  setText,
  onSend,
  messagesEndRef,
  themeSettings,
  faqs,
  onSelectFAQ,
  helpOpen,
  onHelpOpenChange,
  hasActiveTicket,
  canEscalate,
  onContactSupport,
  placeholder,
}: Props) {
  const { headline, subtitle } = splitGreeting(themeSettings.greetingMessage);
  const showComposer = hasActiveTicket || messages.some((m) => m.role === "user");
  const isDark = themeSettings.isDarkMode;

  /** Input uses position:absolute globally; override so the help chip is not covered. */
  const layoutStyles = {
    ...styles,
    messagesArea: {
      ...styles.messagesArea,
      paddingBottom: 20,
    },
    inputArea: {
      ...styles.inputArea,
      position: "relative" as const,
      bottom: "auto" as const,
      width: "100%",
      borderTop: "none",
      padding: "0 0 16px",
    },
  };

  return (
    <div style={styles.chatScreen}>
      <div style={styles.header as React.CSSProperties}>
        <div style={{ minWidth: 0, flex: 1 }}>
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
              fontSize: 12,
              opacity: 0.9,
              marginTop: 2,
            }}
          >
            {hasActiveTicket ? "Continue your conversation" : headline}
          </div>
        </div>
        {canEscalate && onContactSupport && !hasActiveTicket ? (
          <button
            type="button"
            onClick={onContactSupport}
            style={{
              flexShrink: 0,
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.5)",
              color: "white",
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Get support
          </button>
        ) : null}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {!hasActiveTicket && messages.length === 0 && !helpOpen ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              textAlign: "center",
              gap: 12,
              background: isDark ? "#2b2b2b" : "#fafafa",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: isDark ? "#cbd5e1" : "#475569",
                lineHeight: 1.5,
              }}
            >
              {subtitle || "Use Quick help below for FAQs, or connect with our team."}
            </p>
            {canEscalate && onContactSupport ? (
              <button
                type="button"
                onClick={onContactSupport}
                style={{
                  border: "none",
                  borderRadius: 999,
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "#fff",
                  background: themeSettings.primaryColor ?? "#006D77",
                }}
              >
                Chat with our team
              </button>
            ) : null}
          </div>
        ) : (
          <MessageList
            styles={layoutStyles as never}
            messages={messages as never[]}
            showTyping={showTyping}
            messagesEndRef={messagesEndRef}
            themeSettings={themeSettings}
          />
        )}

        {helpOpen ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              background: isDark ? "#2b2b2b" : "#f8f8f8",
              boxShadow: isDark
                ? "0 -4px 24px rgba(0,0,0,0.45)"
                : "0 -4px 24px rgba(0,0,0,0.08)",
            }}
          >
            <FaqListPanel
              styles={styles}
              faqs={faqs}
              themeSettings={themeSettings}
              onSelectFAQ={onSelectFAQ}
              compact
            />
          </div>
        ) : null}
      </div>

      <div
        style={{
          flexShrink: 0,
          background: isDark ? "#2b2b2b" : "#f8f8f8",
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
          padding: "10px 16px 0",
        }}
      >
        <div style={{ marginBottom: showComposer && !helpOpen ? 10 : 0 }}>
          <HelpChip
            active={helpOpen}
            onClick={() => onHelpOpenChange(!helpOpen)}
            themeSettings={themeSettings}
          />
        </div>

        {showComposer && !helpOpen ? (
          <InputArea
            styles={layoutStyles as never}
            text={text}
            setText={setText}
            onSend={onSend}
            loading={Boolean(showTyping || sending)}
            themeSettings={themeSettings}
          />
        ) : helpOpen ? (
          <div style={{ height: 16 }} aria-hidden />
        ) : (
          <div style={{ height: 8 }} aria-hidden />
        )}
      </div>
    </div>
  );
}
