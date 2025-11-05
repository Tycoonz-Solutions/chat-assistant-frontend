// components/chat-widget/ChatWidget.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import FloatingButton from './components/FloatingButton';
import WelcomeScreen from './components/WelcomeScreen';
import ChatScreen from './components/ChatScreen';
import LoginForm from './components/LoginForm';
import { FAQ, Msg, ChatFAQWidgetProps, ThemeSettings } from '../types/index';

export default function ChatWidget({
  title = 'AI Chatbot',
  faqs,
  placeholder = 'Type message here...',
  sendMessage,
}: ChatFAQWidgetProps) {
  // --- state & refs (same as original) ---
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'welcome' | 'chat' | 'login'>('welcome');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    isDarkMode: false,
    primaryColor: '#006D77',
    secondaryColor: '#006D7738',
    fontSizeBase: 28,
    isGradient: false,
  });
  const panelRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setTimeout(() => setView('chat'), 300);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const nowTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // message handlers (kept same logic)
  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: 'user', text: text.trim(), time: nowTime() };
    setMessages((m) => [...m, userMsg]);
    setText('');
    setLoading(true);

    try {
      let reply: string;
      if (sendMessage) {
        const r = sendMessage(userMsg.text);
        reply = typeof r === 'string' ? r : await r;
      } else {
        const q = userMsg.text.toLowerCase();
        const match =
          faqs.find((f) => f.question.toLowerCase() === q) ||
          faqs.find((f) => q.includes(f.question.toLowerCase()));
        reply = match ? match.ans : "Sorry, I don't have an answer for that.";
      }
      const botMsg: Msg = { role: 'bot', text: reply, time: nowTime() };
      setMessages((m) => [...m, botMsg]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: `Error: ${err?.message ?? String(err)}`, time: nowTime() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectFAQ(f: FAQ) {
    setView('chat');
    const userMsg: Msg = { role: 'user', text: f.question, time: nowTime() };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    setTimeout(async () => {
      try {
        let reply: string;
        if (sendMessage) {
          const r = sendMessage(f.question);
          reply = typeof r === 'string' ? r : await r;
        } else {
          reply = f.ans;
        }
        const botMsg: Msg = { role: 'bot', text: reply, time: nowTime() };
        setMessages((m) => [...m, botMsg]);
      } catch (err: any) {
        setMessages((m) => [
          ...m,
          { role: 'bot', text: `Error: ${err?.message ?? String(err)}`, time: nowTime() },
        ]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function handleBackToFAQs() {
    setView('welcome');
  }

  // simple contact form state (for login view)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email.trim() || !query.trim()) return;
    setSending(true);
    setTimeout(() => {
      console.log('contact form submitted', { name, email, query });
      setSending(false);
      setView('chat');
    }, 700);
  }



  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }



  const INPUT_AREA_ESTIMATED_HEIGHT = 84; // px — used to reserve space at bottom of messages

  // --- Styles object (kept here in main file only) ---
  const styles = {
    floatingButton: {
      position: 'fixed' as const,
      bottom: 24,
      right: 24,
      height: 64,
      width: 64,
      borderRadius: '50%',
      background: themeSettings.isGradient
        ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        : themeSettings.primaryColor ?? '#776b00ff', color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      boxShadow: `0 8px 24px ${themeSettings.isGradient
        ? themeSettings.secondaryColor || themeSettings.primaryColor
        : themeSettings.primaryColor
        }`,
      cursor: 'pointer',
      zIndex: 1000,
      transition: 'all 0.3s ease',
    },
    panel: {
      position: 'fixed' as const,
      bottom: 100,
      right: 24,
      width: 480,
      height: 650,
      maxWidth: '95vw',
      maxHeight: '80vh',
      background: themeSettings?.isDarkMode ? '#2b2b2b' : '#f8f8f8',
      borderRadius: 20,
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
      transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
      opacity: open ? 1 : 0,
      pointerEvents: (open ? 'auto' : 'none') as React.CSSProperties['pointerEvents'],
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column' as const,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 24px',
      background: themeSettings.isGradient
        ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        : themeSettings.primaryColor ?? '#776b00ff',
      color: 'white',
    },
    welcomeScreen: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      justifyContent: 'start',
      alignItems: 'center',
    },
    welcomeHeader: {
      background: themeSettings.isGradient
        ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        : themeSettings.primaryColor ?? '#776b00ff', padding: '40px 24px',
      color: 'white',
      position: 'relative' as const,
      overflow: 'hidden',
      width: '90%',
    },
    faqContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '24px',
      background: themeSettings?.isDarkMode ? '#2b2b2b' : '#f8f8f8',
      borderRadius: '10px',
      border: `1px solid ${themeSettings.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    },
    faqCard: {
      background: themeSettings?.isDarkMode ? '#2b2b2b' : '#fff',
      borderRadius: 12,
      marginBottom: 12,
      boxShadow: themeSettings?.isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
    },
    chatScreen: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      background: themeSettings?.isDarkMode ? '#2b2b2b' : '#f8f8f8',
      minHeight: 0,
    },
    messagesArea: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: `20px 20px ${INPUT_AREA_ESTIMATED_HEIGHT + 12}px 20px`,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 12,
      minHeight: 0,
    },
    userMessageBubble: {
      background: themeSettings.isGradient
        ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        : themeSettings.primaryColor ?? '#776b00ff',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '16px 16px 4px 16px',
      maxWidth: '75%',
      wordWrap: 'break-word' as const,
      fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 4 : 16,
      lineHeight: 1.5,
      animation: 'slideInRight 0.3s ease',
    },
    botMessageBubble: {
      background: themeSettings.isGradient
        ? `rgba(${hexToRgb(themeSettings.primaryColor)}, 0.6)`
        : themeSettings.secondaryColor ?? '#776b00ff',
      color: '#1a1a1a',
      padding: '12px 16px',
      borderRadius: '16px 16px 16px 4px',
      maxWidth: '75%',
      wordWrap: 'break-word' as const,
      fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 4 : 14,
      lineHeight: 1.5,
      animation: 'slideInLeft 0.3s ease',
    },
    timeText: {
      fontSize: 11,
      opacity: 0.6,
      marginTop: 6,
      color: themeSettings?.isDarkMode ? '#fff' : '#0000',
    },
    inputArea: {
      padding: '16px 20px',
      position: 'absolute' as const,
      bottom: 0,
      background: themeSettings?.isDarkMode ? '#2b2b2b' : '#f8f8f8',
      borderTop: `1px solid ${themeSettings.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      width: '93%',
    },
    inputWrapper: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      background: themeSettings?.isDarkMode ? '#333' : '#fff',
      borderRadius: 24,
      padding: '8px 12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    input: {
      flex: 1,
      border: 'none',
      background: 'transparent',
      outline: 'none',
      fontSize: 14,
      padding: '8px 12px',
      width: '0%',
      color: themeSettings?.isDarkMode ? '#fff' : '#1a1a1a',
    },
    sendButton: {
      background: themeSettings.isGradient
        ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        : themeSettings.primaryColor ?? '#776b00ff', color: 'white',
      border: 'none',
      borderRadius: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      flexShrink: 0,
      fontSize: 14,
      padding: '8px 16px',
    },
    formLabel: {
      display: 'block',
      fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 : 14,
      fontWeight: 500,
      marginBottom: 4,
      color: themeSettings?.isDarkMode ? "#fff" : '#1a1a1a',
    },
    formInput: {
      width: '100%',
      border: `1px solid ${themeSettings.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      borderRadius: 8,
      padding: '10px 12px',
      fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 : 12,
      outline: 'none',
      boxSizing: 'border-box' as const,
      background: themeSettings?.isDarkMode ? '#2b2b2b' : '#fff',
      color: themeSettings?.isDarkMode ? "#fff" : '#1a1a1a',
    },
    formTextarea: {
      width: '100%',
      border: `1px solid ${themeSettings.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      borderRadius: 8,
      padding: '10px 12px',
      fontSize: 12,
      outline: 'none',
      boxSizing: 'border-box' as const,
      height: 96,
      resize: 'vertical' as const,
      background: themeSettings?.isDarkMode ? '#2b2b2b' : '#fff',
      color: themeSettings?.isDarkMode ? "#fff" : '#1a1a1a',
    },
    sendPill: {
      background: themeSettings.isGradient
        ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        : themeSettings.primaryColor ?? '#776b00ff',
      color: 'white',
      border: 'none',
      borderRadius: 36,
      padding: '10px 30px',
      fontSize: 14,
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
  } as const;

  return (
    <>
      <style>{`
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .message-row { display:flex; align-items:flex-end; gap:8px; }
        .message-row.user { justify-content:flex-end; }
        .message-row.bot { justify-content:flex-start; }
        .bot-avatar { width:36px; height:36px; border-radius:50%; flex-shrink:0; overflow:hidden; }
        .bot-avatar img { width:100%; height:100%; object-fit:cover; display:block; }
        .message-content { display:flex; flex-direction:column; align-items:flex-start; }
        .message-content.user { align-items:flex-end; }
        @keyframes slideInRight { from{ opacity:0; transform:translateX(20px);} to{ opacity:1; transform:translateX(0);} }
        @keyframes slideInLeft  { from{ opacity:0; transform:translateX(-20px);} to{ opacity:1; transform:translateX(0);} }
        @keyframes pulse { 0%,100%{ transform:scale(1); opacity:1;} 50%{ transform:scale(1.1); opacity:0.8;} }
        @media (max-width: 600px) {.chat-panel { right: 8px !important;}}
      `}</style>

      <FloatingButton
        open={open}
        setOpen={setOpen}
        styles={styles}
        themeSettings={themeSettings}
      />

      <div ref={panelRef} style={styles.panel} className='chat-panel'>
        {view === 'welcome' && (
          <WelcomeScreen
            styles={styles}
            faqs={faqs}
            onSelectFAQ={handleSelectFAQ}
            placeholder={placeholder}
            text={text}
            setText={setText}
            onSend={(e) => { e.preventDefault(); setView('chat'); handleSend(e); }}
            themeSettings={themeSettings}
          />
        )}

        {view === 'chat' && (
          <ChatScreen
            styles={styles}
            title={title}
            messages={messages}
            loading={loading}
            text={text}
            setText={setText}
            onSend={handleSend}
            onBack={handleBackToFAQs}
            messagesEndRef={messagesEndRef as unknown as React.RefObject<HTMLDivElement>}
            themeSettings={themeSettings}

          />
        )}

        {view === 'login' && (
          <LoginForm
            styles={styles}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            query={query}
            setQuery={setQuery}
            sending={sending}
            onSubmit={submit}
            themeSettings={themeSettings}
          />
        )}
      </div>
    </>
  );
}
