import React from "react";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import FaqListPanel from "./FaqListPanel";
import HelpChip from "./HelpChip";
import ConversationRatingPrompt from "./ConversationRatingPrompt";
import WidgetCloseButton from "./WidgetCloseButton";
import type { FAQ, Msg, ThemeSettings } from "../../types";
import { formatTicketId } from "../lib/formatTicketId";
import WelcomeMessagePanel from "./WelcomeMessagePanel";
import {
  widgetHeaderSubFontSize,
} from "../lib/widget-font-size";
import { formatVisitorTicketStatus } from "../lib/ticket-created-notice";
import { resolveWelcomeCopy } from "../lib/greeting-message";

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
  activeTicketId?: string | null;
  /** Raw ticket status from API (open / new / in_progress / resolved). */
  ticketStatus?: string | null;
  /** Open ticket available to resume without forcing the visitor into the thread. */
  resumableTicketId?: string | null;
  onResumeTicket?: () => void;
  /** Leave live-agent mode; keep the same message timeline and chat with FAQ/AI again. */
  onExitAgentChat?: () => void;
  /** Close the whole widget (used on mobile full-screen). */
  onClose?: () => void;
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
  apiBaseUrl?: string;
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
  activeTicketId = null,
  ticketStatus = null,
  resumableTicketId = null,
  onResumeTicket,
  onExitAgentChat,
  onClose,
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
  apiBaseUrl,
}: Props) {
  const { headline, subtitle } = resolveWelcomeCopy(themeSettings);
  const feedbackComplete = ratingSubmitted || !showRatingPrompt;
  const showResolvedActions =
    ticketResolved && feedbackComplete && hasActiveTicket;
  const showComposer =
    (!ticketResolved || allowResolvedReply) &&
    (hasActiveTicket ||
      messages.some((m) => m.role === "user") ||
      aiChatAvailable);
  /** FAQs visible in the main area before the user starts chatting */
  const showInlineFaqs =
    !hasActiveTicket && messages.length === 0 && !helpOpen && faqs.length > 0;
  const showHelpChip =
    faqs.length > 0 && !showInlineFaqs && !hasActiveTicket;
  const showWelcomePanel =
    !hasActiveTicket && messages.length === 0 && !ticketResolved;
  const isDark = themeSettings.isDarkMode;
  const headerSubSize = widgetHeaderSubFontSize(themeSettings.fontSizeBase);

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
      <div
        style={styles.header as React.CSSProperties}
        className="chat-widget-sheet-header"
      >
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
          {hasActiveTicket || !showWelcomePanel ? (
            <div
              style={{
                fontSize: headerSubSize,
                opacity: 0.9,
                marginTop: 2,
                lineHeight: 1.4,
              }}
            >
              {hasActiveTicket && activeTicketId
                ? `Ticket ${formatTicketId(activeTicketId)} · Status: ${formatVisitorTicketStatus(
                    ticketResolved ? "resolved" : ticketStatus,
                  )}`
                : hasActiveTicket
                  ? `Status: ${formatVisitorTicketStatus(
                      ticketResolved ? "resolved" : ticketStatus,
                    )}`
                  : subtitle || headline}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          {hasActiveTicket && onExitAgentChat ? (
            <button
              type="button"
              onClick={onExitAgentChat}
              disabled={interactionLocked}
              aria-busy={interactionLocked}
              style={{
                flexShrink: 0,
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.5)",
                color: "white",
                borderRadius: 999,
                padding: "8px 14px",
                fontSize: headerSubSize,
                fontWeight: 600,
                cursor: interactionLocked ? "not-allowed" : "pointer",
                opacity: interactionLocked ? 0.55 : 1,
              }}
            >
              {interactionLocked ? "Please wait…" : "Exit agent chat"}
            </button>
          ) : null}
          {!hasActiveTicket &&
          ((canEscalate && onContactSupport) ||
            (resumableTicketId && onResumeTicket)) ? (
            <button
              type="button"
              onClick={() => {
                if (interactionLocked) return;
                if (resumableTicketId && onResumeTicket) {
                  onResumeTicket();
                  return;
                }
                onContactSupport?.();
              }}
              disabled={interactionLocked}
              aria-busy={interactionLocked}
              style={{
                flexShrink: 0,
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.5)",
                color: "white",
                borderRadius: 999,
                padding: "8px 14px",
                fontSize: headerSubSize,
                fontWeight: 600,
                cursor: interactionLocked ? "not-allowed" : "pointer",
                opacity: interactionLocked ? 0.55 : 1,
              }}
            >
              {interactionLocked
                ? "Please wait…"
                : resumableTicketId
                  ? "Resume agent chat"
                  : "Talk to agent"}
            </button>
          ) : null}
          {onClose ? <WidgetCloseButton onClose={onClose} /> : null}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflowY: "auto",
        }}
      >
        {showWelcomePanel ? (
          <WelcomeMessagePanel themeSettings={themeSettings} compact />
        ) : null}

        {showInlineFaqs ? (
          <FaqListPanel
            styles={styles}
            faqs={faqs}
            themeSettings={themeSettings}
            onSelectFAQ={onSelectFAQ}
            disabled={interactionLocked}
            compact
          />
        ) : (
          <>
            <MessageList
              styles={layoutStyles as never}
              messages={messages as never[]}
              showTyping={showTyping}
              messagesEndRef={messagesEndRef}
              themeSettings={themeSettings}
              apiBaseUrl={apiBaseUrl}
              hideEmptyPlaceholder={showWelcomePanel}
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

        {helpOpen && !showInlineFaqs ? (
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
          {showHelpChip ? (
            <HelpChip
              active={helpOpen}
              disabled={interactionLocked && !helpOpen}
              onClick={() => onHelpOpenChange(!helpOpen)}
              themeSettings={themeSettings}
            />
          ) : null}
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
