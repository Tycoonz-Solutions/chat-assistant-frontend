// components/chat-widget/types.ts
export type FAQ = { question: string; ans: string };
export type Msg = {
  role: 'user' | 'bot';
  text: string;
  time: string;
  id?: string;
  /** ISO timestamp for ordering merged ticket + FAQ messages */
  sortAt?: string;
  /** FAQ quick-help row (persisted on escalate with the rest of the thread) */
  faqLocal?: boolean;
  faqForQuestion?: string;
  /** System divider (e.g. handoff to live agent) */
  isSystem?: boolean;
  /** Widget-only notice (enter/exit agent); kept across ticket sync */
  localOnly?: boolean;
  /** Local confirmation after escalate (widget-only, not sent to agent) */
  ticketCreatedNotice?: boolean;
  /** Live agent / staff name shown above the message bubble */
  senderName?: string;
  isStaff?: boolean;
  /** Staff profile photo (`/uploads/...`) when available */
  senderAvatar?: string | null;
};

/** Prior turns for multi-turn AI chat (OpenAI roles). */
export type ChatHistoryTurn = { role: "user" | "assistant"; content: string };

export interface ChatFAQWidgetProps {
  title?: string;
  faqs?: FAQ[];
  placeholder?: string;
  sendMessage?: (
    msg: string,
    history?: ChatHistoryTurn[],
  ) => Promise<string> | string;
  apiBaseUrl?: string;
  projectToken?: string;
  visitorGate?: boolean;
  themeSettings?: Partial<ThemeSettings>;
}

export interface ThemeSettings {
  botName?: string;
  greetingMessage?: string;
  isDarkMode: boolean;
  secondaryColor: string;
  fontSizeBase: 23 | 24 | 26 | 28;
  isGradient: boolean;
  primaryColor: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Project logo or custom bot avatar path from widget config */
  botAvatarUrl?: string | null;
}
