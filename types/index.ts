// components/chat-widget/types.ts
export type FAQ = { question: string; ans: string };
export type Msg = { role: 'user' | 'bot'; text: string; time: string };

export interface ChatFAQWidgetProps {
  title?: string;
  faqs?: FAQ[];
  placeholder?: string;
  sendMessage?: (msg: string) => Promise<string> | string;
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
}
