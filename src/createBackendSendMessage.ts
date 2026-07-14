import { postChatCompletion } from "./lib/chat-backend";
import type { ChatHistoryTurn } from "../types/index";

export type CreateBackendSendMessageOptions = {
  apiBaseUrl: string;
  projectToken?: string | null;
  siteName?: string;
  websiteDescription?: string;
};

/**
 * Factory for {@link ChatFAQWidgetProps.sendMessage} — wires the widget to your Express `POST /api/v1/chat`.
 */
export function createBackendSendMessage(
  opts: CreateBackendSendMessageOptions
): (message: string, history?: ChatHistoryTurn[]) => Promise<string> {
  return (message: string, history?: ChatHistoryTurn[]) =>
    postChatCompletion({
      apiBaseUrl: opts.apiBaseUrl,
      message,
      history,
      projectToken: opts.projectToken,
      siteName: opts.siteName,
      websiteDescription: opts.websiteDescription,
    });
}
