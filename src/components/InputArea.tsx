// components/chat-widget/components/InputArea.tsx
import React, { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import type { ThemeSettings } from "../../types";

const MAX_INPUT_HEIGHT_PX = 120;

export default function InputArea({
  styles,
  text,
  setText,
  onSend,
  loading,
  themeSettings,
}: {
  styles: any;
  text: string;
  setText: (s: string) => void;
  onSend: (e?: React.FormEvent) => Promise<void> | void;
  loading: boolean;
  themeSettings: ThemeSettings;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT_PX)}px`;
  }, [text]);

  return (
    <div style={styles.inputArea}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend(e);
        }}
      >
        <div
          style={{
            ...styles.inputWrapper,
            alignItems: "flex-end",
          }}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!loading && text.trim()) void onSend(e);
              }
            }}
            placeholder="Type message here..."
            className="chat-widget-input"
            rows={1}
            disabled={loading}
            style={{
              ...styles.input,
              width: "auto",
              minWidth: 0,
              resize: "none",
              overflowY: "auto",
              overflowX: "hidden",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              lineHeight: 1.4,
              maxHeight: MAX_INPUT_HEIGHT_PX,
            }}
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            style={{
              ...styles.sendButton,
              opacity: loading || !text.trim() ? 0.5 : 1,
              cursor: loading || !text.trim() ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!loading && text.trim()) {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.background = themeSettings?.isGradient
                  ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
                  : themeSettings.primaryColor;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = themeSettings?.isGradient
                ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
                : themeSettings.primaryColor;
            }}
          >
            <Send size={18} /> Send
          </button>
        </div>
      </form>
    </div>
  );
}
