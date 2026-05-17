import { postChatCompletion } from "./lib/chat-backend";

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
): (message: string) => Promise<string> {
  return (message: string) =>
    postChatCompletion({
      apiBaseUrl: opts.apiBaseUrl,
      message,
      projectToken: opts.projectToken,
      siteName: opts.siteName,
      websiteDescription: opts.websiteDescription,
    });
}
