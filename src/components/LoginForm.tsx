// components/chat-widget/components/LoginForm.tsx
import React from 'react';
import { ThemeSettings } from '../../types';

export default function LoginForm({
  styles,
  name,
  setName,
  email,
  setEmail,
  query,
  setQuery,
  sending,
  onSubmit,
  themeSettings
}: {
  styles: any;
  name: string;
  setName: (s: string) => void;
  email: string;
  setEmail: (s: string) => void;
  query: string;
  setQuery: (s: string) => void;
  sending: boolean;
  onSubmit: (e?: React.FormEvent) => void;
  themeSettings: ThemeSettings;
}) {
  return (
    <div style={styles.welcomeScreen}>
      <div style={styles.welcomeHeader}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ margin: 0, fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase : 28, fontWeight: 700, marginBottom: 8 }}>
            Hi there!
          </h2>
          <p style={{ margin: 0, fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 : 14, opacity: 0.95, lineHeight: 1.5 }}>
            AI chat powered by our team - how can we assist you today?
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '-30px',
        maxHeight: '500px',
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
            <h3 style={{ margin: -3, fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 4 : 16, fontWeight: 600, color: themeSettings?.isDarkMode ? "#fff" : '#1a1a1a' }}>
              Please leave your email address so we can <br /> contact you:
            </h3>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }}>
            <div style={{ marginBottom: 12 }}>
              <label style={styles.formLabel as React.CSSProperties}>Name (optional):</label>
              <input
                className="chat-widget-form-input"
                style={styles.formInput as React.CSSProperties}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={styles.formLabel as React.CSSProperties}>Email Address:</label>
              <input
                className="chat-widget-form-input"
                style={styles.formInput as React.CSSProperties}
                placeholder="Enter email address"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={styles.formLabel as React.CSSProperties}>Query:</label>
              <textarea
                className="chat-widget-form-input"
                style={styles.formTextarea as React.CSSProperties}
                placeholder="Enter your query"
                value={query}
                required
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={sending}
                style={{
                  ...styles.sendPill as React.CSSProperties,
                  opacity: sending ? 0.7 : 1,
                  pointerEvents: sending ? 'none' : undefined,
                }}
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
