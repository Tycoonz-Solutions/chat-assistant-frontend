import * as react_jsx_runtime from 'react/jsx-runtime';

type FAQ = {
    question: string;
    ans: string;
};
/** Prior turns for multi-turn AI chat (OpenAI roles). */
type ChatHistoryTurn = {
    role: "user" | "assistant";
    content: string;
};
interface ChatFAQWidgetProps {
    title?: string;
    faqs?: FAQ[];
    placeholder?: string;
    sendMessage?: (msg: string, history?: ChatHistoryTurn[]) => Promise<string> | string;
    apiBaseUrl?: string;
    projectToken?: string;
    visitorGate?: boolean;
    themeSettings?: Partial<ThemeSettings>;
}
interface ThemeSettings {
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

declare function ChatWidget({ title, faqs: faqsProp, placeholder, sendMessage, apiBaseUrl, projectToken, visitorGate, themeSettings: themeSettingsProp, }: ChatFAQWidgetProps): react_jsx_runtime.JSX.Element | null;

type CreateBackendSendMessageOptions = {
    apiBaseUrl: string;
    projectToken?: string | null;
    siteName?: string;
    websiteDescription?: string;
};
/**
 * Factory for {@link ChatFAQWidgetProps.sendMessage} — wires the widget to your Express `POST /api/v1/chat`.
 */
declare function createBackendSendMessage(opts: CreateBackendSendMessageOptions): (message: string, history?: ChatHistoryTurn[]) => Promise<string>;

type PostChatParams = {
    apiBaseUrl: string;
    message: string;
    /** Prior turns excluding the current `message` */
    history?: Array<{
        role: "user" | "assistant";
        content: string;
    }>;
    projectToken?: string | null;
    siteName?: string;
    websiteDescription?: string;
};
/** A JWT must be `header.payload.signature` — otherwise the backend returns "jwt malformed". */
declare function assertCompleteJwt(token: string, label?: string): void;
/**
 * Calls `POST /api/v1/chat` on your backend (CORS must allow the host site).
 */
declare function postChatCompletion(params: PostChatParams): Promise<string>;

type VisitorApiResult = {
    message: string;
    accessToken: string;
    ticketId?: string | null;
    email?: string;
    name?: string;
};
declare function postVisitorIdentify(apiBaseUrl: string, body: {
    email: string;
    name?: string;
    projectToken?: string;
}): Promise<VisitorApiResult>;
declare function postVisitorEscalate(apiBaseUrl: string, body: {
    email: string;
    name?: string;
    projectToken: string;
    message: string;
}): Promise<VisitorApiResult>;

export { ChatWidget, type VisitorApiResult, assertCompleteJwt, createBackendSendMessage, ChatWidget as default, postChatCompletion, postVisitorEscalate, postVisitorIdentify };
