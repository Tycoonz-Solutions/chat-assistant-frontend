// components/chat-widget/components/WelcomeScreen.tsx
import React from "react";
import { List, ChevronRight, Send, type LucideIcon } from "lucide-react";
import type { FAQ, ThemeSettings } from "../../types/index";

const DEFAULT_GREETING = "Hi there!\nAI chat powered by our team - how can we assist you today?";

function splitGreetingMessage(raw: string | undefined): { headline: string; subtitle: string } {
  const t = (raw ?? "").trim() || DEFAULT_GREETING;
  const idx = t.indexOf("\n");
  if (idx === -1) return { headline: t, subtitle: "" };
  return { headline: t.slice(0, idx).trim(), subtitle: t.slice(idx + 1).trim() };
}

export default function WelcomeScreen({
  styles,
  faqs,
  onSelectFAQ,
  placeholder,
  text,
  setText,
  onSend,
  themeSettings,
  canEscalate,
  onCreateSupportTicket,
}: {
  styles: any;
  faqs: FAQ[];
  onSelectFAQ: (f: FAQ) => void;
  placeholder: string;
  text: string;
  setText: (s: string) => void;
  onSend: (e: React.FormEvent) => void;
  themeSettings: ThemeSettings;
  canEscalate?: boolean;
  onCreateSupportTicket?: () => void;
}) {
  const { headline, subtitle } = splitGreetingMessage(themeSettings.greetingMessage);
  return (
    <div style={styles.welcomeScreen}>
      <div style={styles.welcomeHeader}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ margin: 0, fontSize: themeSettings?.fontSizeBase, fontWeight: 700, marginBottom: 8 }}>
            {headline}
          </h2>
          {subtitle ? (
            <p style={{ margin: 0, fontSize: themeSettings?.fontSizeBase / 2, opacity: 0.95, lineHeight: 1.5 }}>
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {canEscalate && onCreateSupportTicket ? (
        <div
          style={{
            width: "90%",
            padding: "8px 12px 0",
            textAlign: "center",
          }}
        >
          <button
            type="button"
            onClick={onCreateSupportTicket}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: themeSettings?.fontSizeBase ? themeSettings.fontSizeBase / 2 - 1 : 13,
              fontWeight: 600,
              color: themeSettings.primaryColor ?? "#006D77",
              textDecoration: "underline",
              padding: "4px 8px",
            }}
          >
            Need help? Create support ticket
          </button>
        </div>
      ) : null}

      <div style={{
        marginTop: '-30px',
        maxHeight: '404px',
        display: 'flex',
        flexDirection: 'column' as const,
        zIndex: 9,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '0%',
        width: '90%',
      }}>

        <div style={styles.faqContainer} >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
            padding: '0 4px',
            height: '7%',
          }}>
            {themeSettings.isGradient
              ? <GradientIcon themeSettings={themeSettings} />
              : <List size={20} color={themeSettings.primaryColor} />}

            <h3 style={{ margin: 0, fontSize: themeSettings?.fontSizeBase ? (themeSettings?.fontSizeBase / 2) + 4 : 16, fontWeight: 600, color: themeSettings?.isDarkMode ? '#fff' : '#1a1a1a' }}>
              Quick FAQs
            </h3>
          </div>

          <div className="hide-scrollbar" style={{
            display: 'flex', flexDirection: 'column', gap: 4, height: '88%', overflowY: 'auto' as const,
          }}>
            {faqs.length === 0 ? (
              <p
                style={{
                  margin: 0,
                  padding: '12px 8px',
                  fontSize: themeSettings?.fontSizeBase
                    ? themeSettings.fontSizeBase / 2
                    : 14,
                  color: themeSettings?.isDarkMode ? '#aaa' : '#64748b',
                  textAlign: 'center',
                }}
              >
                No FAQs yet for this project. Add them in the admin under FAQs/Knowledge Base.
              </p>
            ) : null}
            {faqs.map((faq, index) => (
              <button
                key={index}
                style={styles.faqCard}
                onClick={() => onSelectFAQ(faq)}
                onMouseEnter={(e) => { e.currentTarget.style.border = `1px solid ${themeSettings.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.border = '1px solid transparent'; }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 10px',
                  cursor: 'pointer',
                }}>
                  <span style={{
                    fontSize: themeSettings?.fontSizeBase ? (themeSettings?.fontSizeBase / 2) + 2 : 16,
                    color: index === 0 ? themeSettings?.isDarkMode ? '#fff' : '#1a1a1a' : themeSettings?.isDarkMode ? '#ccc' : '#4a5568',
                    fontWeight: index === 0 ? 600 : 500,
                    textAlign: 'left',
                    flex: 1,
                  }}>
                    {faq.question}
                  </span>
                  {getThemedIcon({
                    Icon: ChevronRight,
                    size: 20,
                    themeSettings,
                  })}

                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.inputArea}>
        <form onSubmit={onSend}>
          <div style={styles.inputWrapper}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              style={styles.input}
            />
            <button
              type="submit"
              style={styles.sendButton}
            >
              <Send size={18} /> Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



function GradientIcon({ themeSettings }: { themeSettings: ThemeSettings }) {
  const gradientId = 'iconGradient';

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={themeSettings.primaryColor} />
          <stop offset="100%" stopColor={themeSettings.secondaryColor} />
        </linearGradient>
      </defs>
      {/* Reuse the List icon path here manually */}
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke={`url(#${gradientId})`} />
    </svg>
  );
}


// Generic function to handle gradient or solid icon rendering
const getThemedIcon = ({
  Icon,
  size = 20,
  themeSettings,
}: {
  Icon: LucideIcon;
  size?: number;
  themeSettings: ThemeSettings;
}) => {
  if (themeSettings.isGradient) {
    // Apply gradient if isGradient is true
    const gradientId = React.useId();

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={themeSettings.primaryColor} />
            <stop offset="100%" stopColor={themeSettings.secondaryColor} />
          </linearGradient>
        </defs>
        {/* Render icon with gradient */}
        <Icon stroke={`url(#${gradientId})`} fill="none" size={size} />
      </svg>
    );
  } else {
    // Use solid color if isGradient is false
    return <Icon size={size} color={themeSettings.primaryColor ?? "#006D77"} />;
  }
};
