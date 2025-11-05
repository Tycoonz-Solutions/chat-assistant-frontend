// components/chat-widget/components/ChatScreen.tsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { ThemeSettings } from '../../types';

export default function ChatScreen({
  styles,
  title,
  messages,
  loading,
  text,
  setText,
  onSend,
  onBack,
  messagesEndRef,
  themeSettings

}: {
  styles: any;
  title: string;
  messages: any[];
  loading: boolean;
  text: string;
  setText: (s: string) => void;
  onSend: (e?: React.FormEvent) => Promise<void> | void;
  onBack: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  themeSettings: ThemeSettings;
}) {
  return (
    <div style={styles.chatScreen}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
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
          <div>
            <div style={{ fontWeight: 600, fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 4 : 16 }}>{title}</div>
            <div style={{ fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 - 2 : 12, opacity: 0.9 }}>Online</div>
          </div>
        </div>
      </div>

      <MessageList styles={styles} messages={messages} loading={loading} messagesEndRef={messagesEndRef} themeSettings={themeSettings}
      />

<div>asad</div>
      <InputArea
        styles={styles}
        text={text}
        setText={setText}
        onSend={onSend}
        loading={loading}
        themeSettings={themeSettings}
      />
    </div>
  );
}
