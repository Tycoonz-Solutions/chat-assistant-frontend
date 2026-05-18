import type { Msg } from "../../types/index";
import type { VisitorTicketMessage } from "../widget-visitor-api";

function formatTime(iso: string | null): string {
  if (!iso) {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ticketMessageToWidgetMsg(m: VisitorTicketMessage): Msg {
  const time = formatTime(m.createdAt);
  if (m.senderRole === "visitor") {
    return { id: m.id, role: "user", text: m.text, time };
  }
  const label =
    m.senderLabel && m.senderLabel !== "Unknown sender" && m.senderLabel !== "System"
      ? m.senderLabel
      : "Support";
  return { id: m.id, role: "bot", text: `${label}: ${m.text}`, time };
}

export function mergeFaqWithTicketMessages(faqMsgs: Msg[], ticketMsgs: Msg[]): Msg[] {
  const localOnly = faqMsgs.filter((m) => !m.id);
  return [...localOnly, ...ticketMsgs];
}
