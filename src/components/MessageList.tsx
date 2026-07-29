// components/chat-widget/components/MessageList.tsx
import React from 'react';
import type { ThemeSettings } from '../../types';
import { DEFAULT_BOT_AVATAR, resolveWidgetAssetUrl, widgetBotAvatarUrl } from '../lib/widget-display';
import { widgetBodyFontSize } from '../lib/widget-font-size';
import LinkifiedText from './LinkifiedText';

export default function MessageList({
  styles,
  messages,
  showTyping = false,
  messagesEndRef,
  themeSettings,
  apiBaseUrl,
  hideEmptyPlaceholder = false,
}: {
  styles: any;
  messages: any[];
  /** Bot/FAQ is generating a reply — not used when waiting on a live agent */
  showTyping?: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  themeSettings: ThemeSettings;
  apiBaseUrl?: string;
  hideEmptyPlaceholder?: boolean;
}) {
  const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const defaultAvatarSrc = widgetBotAvatarUrl(apiBaseUrl, themeSettings.botAvatarUrl);

  return (
    <div style={styles.messagesArea} className="hide-scrollbar">
      {messages.length === 0 && !hideEmptyPlaceholder && (
        <div style={{
          textAlign: 'center',
          color: themeSettings?.isDarkMode ? "#fff" : '#718096',
          fontSize: widgetBodyFontSize(themeSettings?.fontSizeBase),
          padding: '40px 20px',
        }}>
          Start a conversation...
        </div>
      )}

      {messages.map((msg, idx) => {
        if (msg.isSystem) {
          return (
            <div
              key={msg.id ?? `system-${idx}`}
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  maxWidth: "92%",
                  textAlign: "center",
                  fontSize: widgetBodyFontSize(themeSettings?.fontSizeBase),
                  fontWeight: 600,
                  lineHeight: 1.4,
                  color: themeSettings?.isDarkMode ? "#e2e8f0" : "#0f766e",
                  background: themeSettings?.isDarkMode
                    ? "rgba(13, 148, 136, 0.22)"
                    : "rgba(0, 109, 119, 0.12)",
                  border: themeSettings?.isDarkMode
                    ? "1px solid rgba(45, 212, 191, 0.35)"
                    : "1px solid rgba(0, 109, 119, 0.25)",
                  borderRadius: 8,
                  padding: "8px 14px",
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        }

        const isBot = msg.role === 'bot';
        const showStaffName = isBot && msg.isStaff && msg.senderName;
        const showAiName =
          isBot && !msg.isStaff && !msg.isSystem && Boolean(msg.senderName);
        // Staff photo only for real staff rows — never reuse it for AI/FAQ replies.
        const avatarSrc = msg.isStaff
          ? resolveWidgetAssetUrl(apiBaseUrl, msg.senderAvatar) || defaultAvatarSrc
          : defaultAvatarSrc;
        return (
          <div key={msg.id ?? `local-${idx}`} className={`message-row ${isBot ? 'bot' : 'user'}`}>
            {isBot && (
              <div className="bot-avatar" aria-hidden>
                <img
                  src={avatarSrc}
                  alt=""
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.dataset.fallback === "1") return;
                    img.dataset.fallback = "1";
                    img.src = DEFAULT_BOT_AVATAR;
                  }}
                />
              </div>
            )}

            <div className={`message-content ${isBot ? 'bot' : 'user'}`}>
              {showStaffName || showAiName ? (
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: themeSettings?.isDarkMode ? '#e2e8f0' : '#334155',
                    marginBottom: 4,
                    lineHeight: 1.3,
                  }}
                >
                  {msg.senderName}
                </div>
              ) : null}
              <div
                className="message-bubble"
                style={isBot ? styles.botMessageBubble : styles.userMessageBubble}
              >
                <LinkifiedText text={msg.text} />
              </div>
              <div style={{ ...styles.timeText, alignSelf: isBot ? 'flex-start' : 'flex-end' }}>
                {msg.time ?? nowTime()}
              </div>
            </div>
          </div>
        );
      })}

      {showTyping && (
        <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          alignSelf: 'flex-start',
        }}>
          <div className="bot-avatar" aria-hidden>
            <img src={defaultAvatarSrc} alt="" />
          </div>
          <div style={{
            background: themeSettings?.isDarkMode ? '#383737ff' : '#d1e7e8',
            padding: '12px 16px',
            borderRadius: '16px 16px 16px 4px',
            fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 4 : 14,
            color: '#4a5568',
          }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: themeSettings.isGradient
                  ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
                  : themeSettings.primaryColor ?? '#006D77',
                animation: 'pulse 1.4s ease-in-out infinite',
              }} />
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: themeSettings.isGradient
                  ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
                  : themeSettings.primaryColor ?? '#006D77', animation: 'pulse 1.4s ease-in-out 0.2s infinite',
              }} />
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: themeSettings.isGradient
                  ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
                  : themeSettings.primaryColor ?? '#006D77', animation: 'pulse 1.4s ease-in-out 0.4s infinite',
              }} />
            </div>
            <div style={{ ...styles.timeText, marginTop: 8 }}>{nowTime()}</div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
