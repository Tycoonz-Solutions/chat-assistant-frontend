import React from "react";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import FaqListPanel from "./FaqListPanel";
import HelpChip from "./HelpChip";
import ConversationRatingPrompt from "./ConversationRatingPrompt";
import type { FAQ, Msg, ThemeSettings } from "../../types";

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
  interactionLocked?: boolean;
  hasActiveTicket: boolean;
  ticketResolved?: boolean;
  showRatingPrompt?: boolean;
  ratingBusy?: boolean;
  ratingSubmitted?: boolean;
  onRatingSubmit?: (rating: number) => Promise<void>;
  onRatingSkip?: () => void;
  onStartNewConversation?: () => void;
  onContinueResolvedConversation?: () => void;
  allowResolvedReply?: boolean;
  canEscalate: boolean;
  aiChatAvailable?: boolean;
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
  interactionLocked = false,
  hasActiveTicket,
  ticketResolved = false,
  showRatingPrompt = false,
  ratingBusy = false,
  ratingSubmitted = false,
  onRatingSubmit,
  onRatingSkip,
  onStartNewConversation,
  onContinueResolvedConversation,
  allowResolvedReply = false,
  canEscalate,
  aiChatAvailable = false,
  onContactSupport,
  placeholder,
}: Props) {
  const { headline, subtitle } = splitGreeting(themeSettings.greetingMessage);
  const feedbackComplete = ratingSubmitted || !showRatingPrompt;
  const showResolvedActions =
    ticketResolved && feedbackComplete && hasActiveTicket;
  const showComposer =
    (!ticketResolved || allowResolvedReply) &&
    (hasActiveTicket ||
      messages.some((m) => m.role === "user") ||
      aiChatAvailable);
  const showLandingHint =
    !hasActiveTicket && messages.length === 0 && !helpOpen;
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
            {ticketResolved
              ? "This conversation is resolved"
              : hasActiveTicket
                ? "Continue your conversation"
                : headline}
          </div>
        </div>
        {canEscalate && onContactSupport && !hasActiveTicket ? (
          <button
            type="button"
            onClick={onContactSupport}
            disabled={interactionLocked}
            style={{
              flexShrink: 0,
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.5)",
              color: "white",
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: interactionLocked ? "not-allowed" : "pointer",
              opacity: interactionLocked ? 0.55 : 1,
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
        {showLandingHint ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
              textAlign: "center",
              gap: 8,
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
              {subtitle ||
                (aiChatAvailable
                  ? "Type below to chat with AI, use Quick help for FAQs."
                  : "Use Quick help below for FAQs.")}
            </p>
            {canEscalate ? (
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: isDark ? "#94a3b8" : "#64748b",
                }}
              >
                Need a person? Tap <strong>Get support</strong> above.
              </p>
            ) : null}
          </div>
        ) : (
          <>
            <MessageList
              styles={layoutStyles as never}
              messages={messages as never[]}
              showTyping={showTyping}
              messagesEndRef={messagesEndRef}
              themeSettings={themeSettings}
            />
            {showResolvedActions && ratingSubmitted ? (
              <p
                style={{
                  margin: "8px 16px 0",
                  fontSize: 13,
                  color: isDark ? "#86efac" : "#047857",
                  textAlign: "center",
                }}
              >
                Thanks for your feedback!
              </p>
            ) : null}
            {showResolvedActions ? (
              <div
                style={{
                  padding: "12px 16px 0",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                {!allowResolvedReply && onContinueResolvedConversation ? (
                  <button
                    type="button"
                    onClick={onContinueResolvedConversation}
                    style={{
                      border: `1px solid ${themeSettings.primaryColor ?? "#006D77"}`,
                      borderRadius: 999,
                      padding: "10px 20px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      color: themeSettings.primaryColor ?? "#006D77",
                      background: "transparent",
                    }}
                  >
                    Continue this conversation
                  </button>
                ) : null}
                {onStartNewConversation ? (
                  <button
                    type="button"
                    onClick={onStartNewConversation}
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
                    Start new conversation
                  </button>
                ) : null}
              </div>
            ) : null}
          </>
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
              disabled={interactionLocked}
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
        {showRatingPrompt && onRatingSubmit && onRatingSkip ? (
          <ConversationRatingPrompt
            themeSettings={themeSettings}
            busy={ratingBusy}
            onSubmit={onRatingSubmit}
            onSkip={onRatingSkip}
          />
        ) : null}

        <div style={{ marginBottom: showComposer && !helpOpen ? 10 : 0 }}>
          <HelpChip
            active={helpOpen}
            disabled={interactionLocked && !helpOpen}
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
            loading={Boolean(showTyping || sending || interactionLocked)}
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
