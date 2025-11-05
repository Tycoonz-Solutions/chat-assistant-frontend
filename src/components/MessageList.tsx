// components/chat-widget/components/MessageList.tsx
import React from 'react';
import { ThemeSettings } from '../../types';

export default function MessageList({
  styles,
  messages,
  loading=true,
  messagesEndRef,
  themeSettings
}: {
  styles: any;
  messages: any[];
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  themeSettings: ThemeSettings
}) {
  const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div style={styles.messagesArea} className="hide-scrollbar">
      {messages.length === 0 && (
        <div style={{
          textAlign: 'center',
          color: themeSettings?.isDarkMode ? "#fff" : '#718096',
          fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 4 : 14,
          padding: '40px 20px',
        }}>
          Start a conversation...
        </div>
      )}

      {messages.map((msg, idx) => {
        const isBot = msg.role === 'bot';
        return (
          <div key={idx} className={`message-row ${isBot ? 'bot' : 'user'}`}>
            {isBot && (
              <div className="bot-avatar" aria-hidden>
                <img src="https://i.pravatar.cc/150?img=32" alt="bot avatar" />
              </div>
            )}

            <div className={`message-content ${isBot ? 'bot' : 'user'}`} style={{ maxWidth: '80%' }}>
              <div style={isBot ? styles.botMessageBubble : styles.userMessageBubble}>
                {msg.text}
              </div>
              <div style={{ ...styles.timeText, alignSelf: isBot ? 'flex-start' : 'flex-end' }}>
                {msg.time ?? nowTime()}
              </div>
            </div>
          </div>
        );
      })}

      {loading && (
        <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          alignSelf: 'flex-start',
        }}>
          <div className="bot-avatar" aria-hidden>
            <img src="https://i.pravatar.cc/150?img=32" alt="bot avatar" />
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
