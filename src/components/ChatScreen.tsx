// components/chat-widget/components/ChatScreen.tsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import type { ThemeSettings } from '../../types';

export default function ChatScreen({
  styles,
  title,
  messages,
  showTyping,
  sending,
  text,
  setText,
  onSend,
  onBack,
  messagesEndRef,
  themeSettings,
  canEscalate,
  onContactSupport,
  interactionLocked = false,
  apiBaseUrl,
}: {
  styles: Record<string, React.CSSProperties>;
  title: string;
  messages: { role: string; text: string; time: string }[];
  showTyping?: boolean;
  sending?: boolean;
  interactionLocked?: boolean;
  text: string;
  setText: (s: string) => void;
  onSend: (e?: React.FormEvent) => Promise<void> | void;
  onBack: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  themeSettings: ThemeSettings;
  canEscalate?: boolean;
  onContactSupport?: () => void;
  apiBaseUrl?: string;
}) {
  return (
    <div style={styles.chatScreen}>
      <div style={styles.header as React.CSSProperties}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          <button
            type="button"
            onClick={onBack}
            disabled={interactionLocked}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: interactionLocked ? 'not-allowed' : 'pointer',
              opacity: interactionLocked ? 0.55 : 1,
              borderRadius: 8,
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ minWidth: 0 }}>
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
                fontSize: themeSettings?.fontSizeBase
                  ? themeSettings.fontSizeBase / 2 - 2
                  : 12,
                opacity: 0.9,
              }}
            >
              Online
            </div>
          </div>
        </div>
        {canEscalate && onContactSupport ? (
          <button
            type="button"
            onClick={onContactSupport}
            style={{
              flexShrink: 0,
              marginLeft: 8,
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
            Contact support
          </button>
        ) : null}
      </div>

      <MessageList
        styles={styles as never}
        messages={messages as never[]}
        showTyping={showTyping}
        messagesEndRef={messagesEndRef}
        themeSettings={themeSettings}
        apiBaseUrl={apiBaseUrl}
      />

      {canEscalate && onContactSupport ? (
        <div
          style={{
            flexShrink: 0,
            padding: "6px 16px 4px",
            textAlign: "center",
            background: themeSettings?.isDarkMode ? "#2b2b2b" : "#f8f8f8",
          }}
        >
          <button
            type="button"
            onClick={onContactSupport}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: themeSettings?.fontSizeBase ? themeSettings.fontSizeBase / 2 - 1 : 13,
              fontWeight: 600,
              color: themeSettings.primaryColor ?? "#006D77",
              textDecoration: "underline",
              padding: "2px 4px",
            }}
          >
            Need help? Create support ticket
          </button>
        </div>
      ) : null}

      <InputArea
        styles={styles as never}
        text={text}
        setText={setText}
        onSend={onSend}
        loading={Boolean(showTyping || sending || interactionLocked)}
        themeSettings={themeSettings}
      />
    </div>
  );
}
