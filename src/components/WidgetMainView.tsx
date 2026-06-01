import React from "react";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import FaqListPanel from "./FaqListPanel";
import WidgetTabBar, { type WidgetTab } from "./WidgetTabBar";
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
  mainTab: WidgetTab;
  onMainTabChange: (tab: WidgetTab) => void;
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
  mainTab,
  onMainTabChange,
  hasActiveTicket,
  canEscalate,
  onContactSupport,
  placeholder,
}: Props) {
  const { headline, subtitle } = splitGreeting(themeSettings.greetingMessage);
  const hasThread = hasActiveTicket && messages.some((m) => m.id);
  const showBadge = hasThread && mainTab === "help";

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

      <WidgetTabBar
        active={mainTab}
        onChange={onMainTabChange}
        themeSettings={themeSettings}
        showConversationBadge={showBadge}
      />

      {mainTab === "conversation" ? (
        <>
          {!hasActiveTicket && messages.length === 0 ? (
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
                background: themeSettings?.isDarkMode ? "#2b2b2b" : "#fafafa",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: themeSettings?.isDarkMode ? "#cbd5e1" : "#475569",
                  lineHeight: 1.5,
                }}
              >
                {subtitle || "Ask a question in Quick help, or connect with our team."}
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
              styles={styles as never}
              messages={messages as never[]}
              showTyping={showTyping}
              messagesEndRef={messagesEndRef}
              themeSettings={themeSettings}
            />
          )}

          {hasActiveTicket || messages.some((m) => m.role === "user") ? (
            <InputArea
              styles={styles as never}
              text={text}
              setText={setText}
              onSend={onSend}
              loading={Boolean(showTyping || sending)}
              themeSettings={themeSettings}
            />
          ) : null}
        </>
      ) : (
        <FaqListPanel
          styles={styles}
          faqs={faqs}
          themeSettings={themeSettings}
          onSelectFAQ={onSelectFAQ}
          compact
        />
      )}
    </div>
  );
}
