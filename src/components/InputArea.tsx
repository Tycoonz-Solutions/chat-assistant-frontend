// components/chat-widget/components/InputArea.tsx
import React from 'react';
import { Send } from 'lucide-react';
import type { ThemeSettings } from '../../types';

export default function InputArea({
  styles,
  text,
  setText,
  onSend,
  loading,
  themeSettings
}: {
  styles: any;
  text: string;
  setText: (s: string) => void;
  onSend: (e?: React.FormEvent) => Promise<void> | void;
  loading: boolean;
  themeSettings: ThemeSettings;
}) {
  return (
    <div style={styles.inputArea}>
      <form onSubmit={(e) => { e.preventDefault(); onSend(e); }}>
        <div style={styles.inputWrapper}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type message here..."
            className="chat-widget-input"
            style={styles.input}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            style={{
              ...styles.sendButton,
              opacity: loading || !text.trim() ? 0.5 : 1,
              cursor: loading || !text.trim() ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading && text.trim()) {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = themeSettings?.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = themeSettings?.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor;
            }}
          >
            <Send size={18} /> Send
          </button>
        </div>
      </form>
    </div>
  );
}
