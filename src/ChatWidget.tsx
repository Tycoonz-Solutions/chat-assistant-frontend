'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, Send, ChevronRight, ArrowLeft, List } from 'lucide-react';

type FAQ = { question: string; ans: string };

export interface ChatFAQWidgetProps {
  title?: string;
  faqs: FAQ[];
  placeholder?: string;
  sendMessage?: (msg: string) => Promise<string> | string;
}

export default function ChatWidget({
  title = 'AI Chatbot',
  faqs,
  placeholder = 'Type message here...',
  sendMessage,
}: ChatFAQWidgetProps) {
  const [open, setOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setTimeout(() => setShowChat(false), 300);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user' as const, text: text.trim() };
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
      setMessages((m) => [...m, { role: 'bot', text: reply }]);
    } catch (err: any) {
      setMessages((m) => [...m, { role: 'bot', text: `Error: ${err?.message ?? String(err)}` }]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectFAQ(f: FAQ) {
    setShowChat(true);
    const userMsg = { role: 'user' as const, text: f.question };
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
        setMessages((m) => [...m, { role: 'bot', text: reply }]);
      } catch (err: any) {
        setMessages((m) => [...m, { role: 'bot', text: `Error: ${err?.message ?? String(err)}` }]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function handleBackToFAQs() {
    setShowChat(false);
  }

  const styles = {
    floatingButton: {
      position: 'fixed' as const,
      bottom: 24,
      right: 24,
      height: 64,
      width: 64,
      borderRadius: '50%',
      background: '#006D77',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      boxShadow: '0 8px 24px rgba(13, 115, 119, 0.4)',
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
      background: '#ffffff',
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
      background: '#006D77',
      color: 'white',
    },
    welcomeScreen: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      justifyContent: 'start', // centers vertically
      alignItems: 'center',     // centers horizontally

    },
    welcomeHeader: {
      background: 'linear-gradient(135deg, #006D77 0%, #14919b 100%)',
      padding: '40px 24px',
      color: 'white',
      position: 'relative' as const,
      overflow: 'hidden',
      width: "90%"
    },
    faqContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '24px',
      background: '#fff',
      borderRadius: "10px",
      border:'1px solid #c4c4c4ff'
    },
    faqCard: {
      background: 'white',
      borderRadius: 12,
      marginBottom: 12,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
    },
    chatScreen: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      background: '#f0f2f5',
    },
    messagesArea: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: 20,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 12,
    },
    userMessage: {
      alignSelf: 'flex-end' as const,
      background: '#006D77',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '16px 16px 4px 16px',
      maxWidth: '75%',
      wordWrap: 'break-word' as const,
      fontSize: 14,
      lineHeight: 1.5,
      animation: 'slideInRight 0.3s ease',
    },
    botMessage: {
      alignSelf: 'flex-start' as const,
      background: '#d1e7e8',
      color: '#1a1a1a',
      padding: '12px 16px',
      borderRadius: '16px 16px 16px 4px',
      maxWidth: '75%',
      wordWrap: 'break-word' as const,
      fontSize: 14,
      lineHeight: 1.5,
      animation: 'slideInLeft 0.3s ease',
    },
    inputArea: {
      padding: '16px 20px',
      position: 'absolute' as const,
      bottom: 0,
      background: 'white',
      borderTop: '1px solid #e0e0e0',
      width: "93%"
    },
    inputWrapper: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      background: '#f0f2f5',
      borderRadius: 24,
      padding: '8px 12px',
    },
    input: {
      flex: 1,
      border: 'none',
      background: 'transparent',
      outline: 'none',
      fontSize: 14,
      padding: '8px 12px',
      color: '#1a1a1a',
    },
    sendButton: {
      background: '#006D77',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: 40,
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    },
  };

  return (
    <>
      <style>{`
      .hide-scrollbar {
          scrollbar-width: none;      
          -ms-overflow-style: none;    
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;              
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
      `}</style>

      <button
        style={styles.floatingButton}
        onClick={() => setOpen((s) => !s)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(13, 115, 119, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(13, 115, 119, 0.4)';
        }}
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      <div ref={panelRef} style={styles.panel}>
        {!showChat ? (
          <div style={styles.welcomeScreen}>
            <div style={styles.welcomeHeader}>


              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                  Hi there!
                </h2>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.95, lineHeight: 1.5 }}>
                  AI chat powered by our team - how can we assist you today?
                </p>
              </div>
            </div>

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


              <div style={styles.faqContainer} className="hide-scrollbar">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 16,
                  padding: '0 4px',
                }}>
                  <List size={20} color="#006D77" />
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
                    Quick FAQs
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {faqs.map((faq, index) => (
                    <button
                      key={index}
                      style={styles.faqCard}
                      onClick={() => handleSelectFAQ(faq)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(4px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 115, 119, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 10px',
                        cursor: 'pointer',
                      }}>
                        <span style={{
                          fontSize: 14,
                          color: index === 0 ? '#006D77' : '#4a5568',
                          fontWeight: index === 0 ? 600 : 500,
                          textAlign: 'left',
                          flex: 1,
                        }}>
                          {faq.question}
                        </span>
                        <ChevronRight size={20} color="#006D77" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.inputArea}>
              <form onSubmit={(e) => { e.preventDefault(); setShowChat(true); handleSend(e); }}>
                <div style={styles.inputWrapper}>
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholder}
                    style={styles.input}
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
                        e.currentTarget.style.background = '#0a5f62';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = '#006D77';
                    }}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div style={styles.chatScreen}>
            <div style={styles.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={handleBackToFAQs}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
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
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>Online</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => setShowChat(false), 300);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
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
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={styles.messagesArea}>
              {messages.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: '#718096',
                  fontSize: 14,
                  padding: '40px 20px',
                }}>
                  Start a conversation...
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={msg.role === 'user' ? styles.userMessage : styles.botMessage}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div style={{
                  alignSelf: 'flex-start',
                  background: '#d1e7e8',
                  padding: '12px 16px',
                  borderRadius: '16px 16px 16px 4px',
                  fontSize: 14,
                  color: '#4a5568',
                }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#006D77',
                      animation: 'pulse 1.4s ease-in-out infinite',
                    }} />
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#006D77',
                      animation: 'pulse 1.4s ease-in-out 0.2s infinite',
                    }} />
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#006D77',
                      animation: 'pulse 1.4s ease-in-out 0.4s infinite',
                    }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={styles.inputArea}>
              <form onSubmit={handleSend}>
                <div style={styles.inputWrapper}>
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={placeholder}
                    style={styles.input}
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
                        e.currentTarget.style.background = '#0a5f62';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.background = '#006D77';
                    }}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

