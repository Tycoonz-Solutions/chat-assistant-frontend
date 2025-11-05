// components/chat-widget/types.ts
export type FAQ = { question: string; ans: string };
export type Msg = { role: 'user' | 'bot'; text: string; time: string };

export interface ChatFAQWidgetProps {
  title?: string;
  faqs: FAQ[];
  placeholder?: string;
  sendMessage?: (msg: string) => Promise<string> | string;
}


export interface ThemeSettings {
  isDarkMode: boolean;
  secondaryColor: string;
  fontSizeBase: 23 | 24 | 26 | 28,
  isGradient: boolean,
  primaryColor: string,
}