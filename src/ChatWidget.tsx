// components/chat-widget/ChatWidget.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FloatingButton from "./components/FloatingButton";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatScreen from "./components/ChatScreen";
import WidgetMainView from "./components/WidgetMainView";
import PreChatScreen from "./components/PreChatScreen";
import EscalateScreen from "./components/EscalateScreen";
import type { EscalatePayload } from "./components/EscalateScreen";
import {
  buildEscalateTranscript,
  lastUserMessageForEscalate,
} from "./lib/build-escalate-transcript";
import {
  clearTicketCreatedNotice,
  markTicketCreatedNotice,
  withTicketCreatedNotice,
} from "./lib/ticket-created-notice";
import type { FAQ, Msg, ChatFAQWidgetProps, ThemeSettings } from "../types/index";
import {
  fetchWidgetConfig,
  type WidgetCapabilities,
} from "./lib/widget-config";
import {
  getVisitorTicket,
  listVisitorTicketMessages,
  postVisitorEscalate,
  postVisitorIdentify,
  postVisitorTicketMessage,
  postVisitorTicketRating,
  type VisitorTicketSummary,
} from "./widget-visitor-api";
import {
  buildVisitorThread,
  ticketMessageToWidgetMsg,
} from "./lib/ticket-thread-ui";
import { appendFaqExchange, clearFaqTranscript, loadFaqTranscript } from "./lib/faq-transcript";
import {
  loadVisitorSession,
  saveVisitorSession,
} from "./lib/visitor-session";
import {
  ensureVisitorSocket,
  disconnectVisitorSocket,
  subscribeVisitorSocket,
  visitorTicketSummaryFromSocket,
} from "./lib/widget-visitor-socket";
import {
  AI_CHAT_UNAVAILABLE_MESSAGE,
  userFacingChatError,
} from "./lib/chat-messages";
import { widgetFormFontSize } from "./lib/widget-font-size";
import { widgetPositionClass } from "./lib/widget-position";
import { dismissTicket, isTicketDismissed } from "./lib/dismissed-tickets";
import { widgetProjectStorageId } from "./lib/widget-storage-id";
import { hasWidgetApiBase, resolveWidgetApiBase } from "./lib/widget-api-base";

type View = "prechat" | "welcome" | "chat" | "main" | "escalate";

type VisitorProfile = {
  email: string;
  name: string;
  accessToken?: string;
  ticketId?: string | null;
};

export default function ChatWidget({
  title = "AI Chatbot",
  faqs: faqsProp,
  placeholder = "Type message here...",
  sendMessage,
  apiBaseUrl,
  projectToken,
  visitorGate,
  themeSettings: themeSettingsProp,
}: ChatFAQWidgetProps) {
  // Empty string = same-origin (proxy). Undefined = no backend configured.
  const apiBase = resolveWidgetApiBase(apiBaseUrl);
  const hasApi = hasWidgetApiBase(apiBaseUrl);
  const gateDefault = Boolean(hasApi && projectToken?.trim());
  const visitorGateEffective = visitorGate !== undefined ? visitorGate : gateDefault;

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>(() => {
    if (!visitorGateEffective) return "welcome";
    return "prechat";
  });
  const [helpOpen, setHelpOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [awaitingBot, setAwaitingBot] = useState(false);
  const [sending, setSending] = useState(false);
  const [visitor, setVisitor] = useState<VisitorProfile | null>(null);
  const [prechatBusy, setPrechatBusy] = useState(false);
  const [prechatError, setPrechatError] = useState<string | null>(null);
  const [escalateBusy, setEscalateBusy] = useState(false);
  const [remoteFaqs, setRemoteFaqs] = useState<FAQ[] | null>(null);
  const [capabilities, setCapabilities] = useState<WidgetCapabilities>({
    aiChatEnabled: true,
    agentSupportEnabled: true,
  });
  const [ticketSummary, setTicketSummary] = useState<VisitorTicketSummary | null>(null);
  const [ratingBusy, setRatingBusy] = useState(false);
  const [ratingSkipped, setRatingSkipped] = useState(false);
  const [allowResolvedReply, setAllowResolvedReply] = useState(false);
  const [widgetUnavailable, setWidgetUnavailable] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(!visitorGateEffective);
  /** Open ticket from identify shouldn't skip FAQ/AI home — only enter thread after resume/escalate. */
  const [inTicketThread, setInTicketThread] = useState(false);

  const interactionLockRef = useRef(false);
  const [interactionLocked, setInteractionLocked] = useState(false);

  const acquireInteractionLock = useCallback(() => {
    if (interactionLockRef.current) return false;
    interactionLockRef.current = true;
    setInteractionLocked(true);
    return true;
  }, []);

  const releaseInteractionLock = useCallback(() => {
    interactionLockRef.current = false;
    setInteractionLocked(false);
  }, []);

  const handleHelpOpenChange = useCallback((open: boolean) => {
    if (open && interactionLockRef.current) return;
    setHelpOpen(open);
  }, []);

  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    isDarkMode: false,
    primaryColor: "#006D77",
    secondaryColor: "#006D7738",
    fontSizeBase: 28,
    isGradient: false,
    position: "bottom-right",
  });

  useEffect(() => {
    if (!themeSettingsProp) return;
    setThemeSettings((prev) => ({ ...prev, ...themeSettingsProp }));
  }, [themeSettingsProp]);

  const themeSettingsPropRef = useRef(themeSettingsProp);
  themeSettingsPropRef.current = themeSettingsProp;

  useEffect(() => {
    const tok = projectToken?.trim();
    if (!hasApi || apiBase === undefined || !tok) return;

    let cancelled = false;
    (async () => {
      try {
        setWidgetUnavailable(null);
        const config = await fetchWidgetConfig(apiBase, tok);
        if (cancelled) return;
        setThemeSettings((prev) => ({
          ...prev,
          ...config.appearance,
          ...(themeSettingsPropRef.current ?? {}),
        }));
        setRemoteFaqs(config.faqs);
        setCapabilities(config.capabilities);
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "";
        if (
          msg.includes("inactive") ||
          msg.includes("no longer available") ||
          msg.includes("has been removed")
        ) {
          setWidgetUnavailable(msg);
          setRemoteFaqs([]);
          return;
        }
        setRemoteFaqs([]);
        console.warn(
          "[ChatWidget] Could not load widget config (appearance + FAQs). " +
            "Check VITE_API_URL, VITE_PROJECT_TOKEN (full JWT from Admin → Projects), and that the backend is running.",
          err
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiBase, hasApi, projectToken]);

  const faqs = useMemo(() => {
    if (faqsProp && faqsProp.length > 0) return faqsProp;
    return remoteFaqs ?? [];
  }, [faqsProp, remoteFaqs]);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const visitorRef = useRef(visitor);
  visitorRef.current = visitor;

  const hasAiBackend = Boolean(sendMessage);
  const aiChatAvailable =
    capabilities.aiChatEnabled && hasAiBackend;
  const activeTicketId = visitor?.ticketId ?? null;
  const viewingTicketThread = Boolean(activeTicketId && inTicketThread);
  const resumableTicketId =
    activeTicketId && !inTicketThread ? activeTicketId : null;
  // One open ticket at a time — no second escalate while one exists.
  const canEscalate = Boolean(
    hasApi &&
      projectToken?.trim() &&
      capabilities.agentSupportEnabled &&
      !activeTicketId,
  );

  const visitorAccessToken = visitor?.accessToken ?? null;

  const ticketSyncInFlightRef = useRef(false);
  const ticketSyncQueuedRef = useRef(false);

  const ratingSkipStorageKey = useCallback(
    (ticketId: string) => {
      return `chat-widget-rating-skipped-${widgetProjectStorageId(projectToken)}-${ticketId}`;
    },
    [projectToken],
  );

  const syncTicketThread = useCallback(async () => {
    const tid = visitorRef.current?.ticketId;
    const token = visitorRef.current?.accessToken;
    if (apiBase === undefined || !tid || !token) return;
    if (ticketSyncInFlightRef.current) {
      ticketSyncQueuedRef.current = true;
      return;
    }

    ticketSyncInFlightRef.current = true;
    try {
      const [rows, summary] = await Promise.all([
        listVisitorTicketMessages(apiBase, tid, token),
        getVisitorTicket(apiBase, tid, token),
      ]);
      const ticketMsgs = rows.map(ticketMessageToWidgetMsg);
      const faqExchanges = loadFaqTranscript(projectToken, tid);
      const thread = withTicketCreatedNotice(
        buildVisitorThread(ticketMsgs, faqExchanges),
        projectToken,
        String(tid),
        () =>
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
      setMessages(thread);
      setTicketSummary(summary);
    } catch (err) {
      console.warn("[ChatWidget] Could not sync ticket messages", err);
    } finally {
      ticketSyncInFlightRef.current = false;
      if (ticketSyncQueuedRef.current) {
        ticketSyncQueuedRef.current = false;
        void syncTicketThread();
      }
    }
  }, [apiBase, projectToken]);

  useEffect(() => {
    if (!activeTicketId) {
      setTicketSummary(null);
      setRatingSkipped(false);
      setAllowResolvedReply(false);
      return;
    }
    const skipped =
      typeof window !== "undefined" &&
      sessionStorage.getItem(ratingSkipStorageKey(activeTicketId)) === "1";
    setRatingSkipped(skipped);
  }, [activeTicketId, ratingSkipStorageKey]);

  useEffect(() => {
    if (ticketSummary?.status !== "resolved") {
      setAllowResolvedReply(false);
    }
  }, [ticketSummary?.status]);

  useEffect(() => {
    if (!visitorGateEffective) {
      setSessionReady(true);
      return;
    }

    let cancelled = false;
    setSessionReady(false);

    async function hydrateVisitorSession() {
      disconnectVisitorSocket();
      setMessages([]);
      setTicketSummary(null);
      setRatingSkipped(false);
      setAllowResolvedReply(false);
      setInTicketThread(false);
      setAwaitingBot(false);
      setText("");

      const stored = loadVisitorSession(projectToken);
      if (!stored?.email) {
        if (cancelled) return;
        setVisitor(null);
        visitorRef.current = null;
        setView("prechat");
        setHelpOpen(false);
        setSessionReady(true);
        return;
      }

      const tok = projectToken?.trim();
      let profile: VisitorProfile = {
        email: stored.email,
        name: stored.name,
        accessToken: stored.accessToken,
        ticketId: null,
      };

      if (apiBase !== undefined && tok) {
        try {
          const r = await postVisitorIdentify(apiBase, {
            email: stored.email,
            name: stored.name || undefined,
            projectToken: tok,
          });
          profile = {
            email: r.email ?? stored.email,
            name: r.name ?? stored.name,
            accessToken: r.accessToken,
            ticketId: r.ticketId ?? null,
          };
          if (
            profile.ticketId &&
            isTicketDismissed(projectToken, profile.ticketId)
          ) {
            profile.ticketId = null;
          }
        } catch {
          profile = {
            email: stored.email,
            name: stored.name,
            accessToken: stored.accessToken,
            ticketId: null,
          };
        }
      }

      if (cancelled) return;
      setVisitor(profile);
      visitorRef.current = profile;
      saveVisitorSession(profile, projectToken);
      // Always land on FAQ / AI home; resume open tickets via banner.
      setInTicketThread(false);
      setMessages([]);
      setView("main");
      setHelpOpen(false);
      setSessionReady(true);
    }

    void hydrateVisitorSession();

    return () => {
      cancelled = true;
      disconnectVisitorSocket();
    };
  }, [visitorGateEffective, projectToken, apiBase]);

  useEffect(() => {
    if (visitor) {
      saveVisitorSession(visitor, projectToken);
    }
  }, [visitor, projectToken]);

  useEffect(() => {
    if (!sessionReady || !open || view !== "main" || !viewingTicketThread || !visitorAccessToken) return;
    void syncTicketThread();
    const id = window.setInterval(() => {
      void syncTicketThread();
    }, 12_000);
    return () => window.clearInterval(id);
  }, [sessionReady, open, view, viewingTicketThread, visitorAccessToken, syncTicketThread]);

  useEffect(() => {
    const token = visitorAccessToken;
    if (apiBase === undefined || !apiBase || !token) return;

    ensureVisitorSocket(apiBase, token);

    const unsubMsg = subscribeVisitorSocket("receive-message", (payload) => {
      const tid = visitorRef.current?.ticketId;
      const incomingTicketId =
        payload.ticketId != null ? String(payload.ticketId) : null;
      if (!tid || (incomingTicketId && incomingTicketId !== tid)) return;
      void syncTicketThread();
    });

    const unsubTicket = subscribeVisitorSocket("ticket-updated", (payload) => {
      const tid = visitorRef.current?.ticketId;
      if (!tid || String(payload.ticketId ?? "") !== tid) return;

      const summary = visitorTicketSummaryFromSocket(payload);
      if (summary) {
        setTicketSummary(summary);
        if (summary.status === "resolved") {
          setAllowResolvedReply(false);
          if (summary.canRate) {
            setRatingSkipped(false);
            if (typeof window !== "undefined") {
              sessionStorage.removeItem(ratingSkipStorageKey(tid));
            }
          }
        }
      } else {
        void syncTicketThread();
      }
    });

    return () => {
      unsubMsg();
      unsubTicket();
    };
  }, [apiBase, visitorAccessToken, projectToken, syncTicketThread]);

  const collectIdentityOnEscalate = useMemo(
    () => !visitor || !visitor.email,
    [visitor]
  );

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) {
        setOpen(false);
        setTimeout(() => {
          setView((v) => {
            if (visitorGateEffective && !visitorRef.current) return "prechat";
            if (visitorGateEffective && visitorRef.current) return "main";
            if (v === "chat" || v === "escalate") return "welcome";
            return v;
          });
        }, 300);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open, visitorGateEffective]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, awaitingBot]);

  const nowTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  function matchFaqAnswer(userText: string): string | null {
    const q = userText.trim().toLowerCase();
    if (!q) return null;
    const exact = faqs.find((f) => f.question.toLowerCase() === q);
    if (exact) return exact.ans;
    const partial = faqs.find((f) => q.includes(f.question.toLowerCase()));
    return partial?.ans ?? null;
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim() || interactionLockRef.current) return;

    setHelpOpen(false);

    const tid = visitor?.ticketId;
    const token = visitor?.accessToken;
    const awaitingRating =
      ticketSummary?.status === "resolved" &&
      ticketSummary?.canRate &&
      !ratingSkipped;
    if (awaitingRating) {
      return;
    }
    if (!acquireInteractionLock()) return;

    try {
      if (apiBase !== undefined && inTicketThread && tid && token) {
        const body = text.trim();
        setText("");
        const userMsg: Msg = { role: "user", text: body, time: nowTime() };
        setMessages((m) => [...m, userMsg]);
        setSending(true);
        try {
          await postVisitorTicketMessage(apiBase, tid, token, body);
          await syncTicketThread();
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          setMessages((m) => [
            ...m,
            { role: "bot", text: userFacingChatError(msg), time: nowTime() },
          ]);
        } finally {
          setSending(false);
        }
        return;
      }

      const userMsg: Msg = { role: "user", text: text.trim(), time: nowTime() };
      setMessages((m) => [...m, userMsg]);
      setText("");
      setAwaitingBot(true);

      let reply: string;
      const fromFaq = matchFaqAnswer(userMsg.text);
      if (fromFaq) {
        reply = fromFaq;
      } else if (sendMessage && aiChatAvailable) {
        const history = messages
          .filter((m) => (m.role === "user" || m.role === "bot") && m.text.trim())
          .slice(-16)
          .map((m) => ({
            role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
            content: m.text.trim(),
          }));
        const r = sendMessage(userMsg.text, history);
        reply = typeof r === "string" ? r : await r;
      } else {
        reply = AI_CHAT_UNAVAILABLE_MESSAGE;
      }
      const botMsg: Msg = { role: "bot", text: reply, time: nowTime() };
      setMessages((m) => [...m, botMsg]);

      const looksUnhelpful =
        !fromFaq &&
        reply === AI_CHAT_UNAVAILABLE_MESSAGE;

      if (looksUnhelpful && canEscalate) {
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: "You can still reach our team using “Contact support” in the header.",
            time: nowTime(),
          },
        ]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const reply = userFacingChatError(msg);
      setMessages((m) => [
        ...m,
        { role: "bot", text: reply, time: nowTime() },
      ]);
      if (canEscalate && reply === AI_CHAT_UNAVAILABLE_MESSAGE) {
        setMessages((m) => [
          ...m,
          {
            role: "bot",
            text: "You can still reach our team using “Contact support” in the header.",
            time: nowTime(),
          },
        ]);
      }
    } finally {
      setAwaitingBot(false);
      releaseInteractionLock();
    }
  }

  async function handleSelectFAQ(f: FAQ) {
    if (interactionLockRef.current) return;
    if (!acquireInteractionLock()) return;

    if (visitorGateEffective) {
      setHelpOpen(false);
    } else {
      setView("chat");
    }

    setAwaitingBot(true);
    const tid = visitorRef.current?.ticketId;
    const token = visitorRef.current?.accessToken;
    const askedAt = new Date().toISOString();

    try {
      const ticketIsResolved = ticketSummary?.status === "resolved";
      if (apiBase !== undefined && inTicketThread && tid && token && !ticketIsResolved) {
        appendFaqExchange(projectToken, tid, {
          question: f.question,
          answer: f.ans,
          askedAt,
        });
        await syncTicketThread();
      } else {
        const userMsg: Msg = {
          role: "user",
          text: f.question,
          time: nowTime(),
          sortAt: askedAt,
          faqLocal: true,
        };
        const botMsg: Msg = {
          role: "bot",
          text: f.ans,
          time: nowTime(),
          sortAt: new Date(Date.parse(askedAt) + 1).toISOString(),
          faqLocal: true,
          faqForQuestion: f.question,
        };
        setMessages((m) => [...m, userMsg, botMsg]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages((m) => [
        ...m,
        { role: "bot", text: userFacingChatError(msg), time: nowTime() },
      ]);
    } finally {
      setAwaitingBot(false);
      releaseInteractionLock();
    }
  }

  function handleBackToFAQs() {
    if (interactionLockRef.current) return;
    if (visitorGateEffective) {
      setHelpOpen(true);
    } else {
      setView("welcome");
    }
  }

  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }

  const INPUT_AREA_ESTIMATED_HEIGHT = 84;

  const widgetPosition = themeSettings.position ?? "bottom-right";
  function getAnchors(pos: NonNullable<ThemeSettings["position"]>) {
    switch (pos) {
      case "bottom-left":
        return {
          btnPos: { bottom: 24, left: 24, top: "auto" as const, right: "auto" as const },
          panelPos: { bottom: 100, left: 24, top: "auto" as const, right: "auto" as const },
        };
      case "top-right":
        return {
          btnPos: { top: 24, right: 24, bottom: "auto" as const, left: "auto" as const },
          panelPos: { top: 100, right: 24, bottom: "auto" as const, left: "auto" as const },
        };
      case "top-left":
        return {
          btnPos: { top: 24, left: 24, bottom: "auto" as const, right: "auto" as const },
          panelPos: { top: 100, left: 24, bottom: "auto" as const, right: "auto" as const },
        };
      case "bottom-right":
      default:
        return {
          btnPos: { bottom: 24, right: 24, top: "auto" as const, left: "auto" as const },
          panelPos: { bottom: 100, right: 24, top: "auto" as const, left: "auto" as const },
        };
    }
  }
  const { btnPos, panelPos } = getAnchors(widgetPosition);
  const positionClass = widgetPositionClass(widgetPosition);
  const chatTitle = themeSettings.botName?.trim() || title;
  const formFontSize = widgetFormFontSize(themeSettings.fontSizeBase);

  const styles = {
    floatingButton: {
      position: "fixed" as const,
      ...btnPos,
      height: 64,
      width: 64,
      borderRadius: "50%",
      background: themeSettings.isGradient
        ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        : themeSettings.primaryColor ?? "#776b00ff",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      boxShadow: `0 8px 24px ${
        themeSettings.isGradient
          ? themeSettings.secondaryColor || themeSettings.primaryColor
          : themeSettings.primaryColor
      }`,
      cursor: "pointer",
      zIndex: 1000,
      transition: "all 0.3s ease",
    },
    panel: {
      position: "fixed" as const,
      ...panelPos,
      width: "min(480px, calc(100vw - 24px))",
      height: 650,
      maxWidth: "calc(100vw - 24px)",
      maxHeight: "min(650px, calc(100dvh - 128px))",
      boxSizing: "border-box" as const,
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#f8f8f8",
      borderRadius: 20,
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
      overflow: "hidden",
      transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
      opacity: open ? 1 : 0,
      pointerEvents: (open ? "auto" : "none") as React.CSSProperties["pointerEvents"],
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 999,
      display: "flex",
      flexDirection: "column" as const,
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 24px",
      background: themeSettings.isGradient
        ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        : themeSettings.primaryColor ?? "#776b00ff",
      color: "white",
      flexShrink: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    welcomeScreen: {
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
      overflow: "hidden",
      minHeight: 0,
      alignItems: "stretch",
      width: "100%",
    },
    welcomeHeader: {
      background: themeSettings.isGradient
        ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        : themeSettings.primaryColor ?? "#776b00ff",
      padding: "40px 24px",
      color: "white",
      position: "relative" as const,
      overflow: "hidden",
      width: "100%",
      flexShrink: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      boxSizing: "border-box" as const,
    },
    faqContainer: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column" as const,
      overflow: "hidden",
      padding: "24px",
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#f8f8f8",
      borderRadius: "10px",
      border: `1px solid ${
        themeSettings.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
      }`,
    },
    faqCard: {
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#fff",
      borderRadius: 12,
      marginBottom: 12,
      boxShadow: themeSettings?.isDarkMode
        ? "0 2px 8px rgba(0, 0, 0, 0.2)"
        : "0 2px 8px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
    },
    chatScreen: {
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#f8f8f8",
      minHeight: 0,
    },
    messagesArea: {
      flex: 1,
      overflowY: "auto" as const,
      padding: `20px 20px ${INPUT_AREA_ESTIMATED_HEIGHT + 12}px 20px`,
      display: "flex",
      flexDirection: "column" as const,
      gap: 12,
      minHeight: 0,
    },
    userMessageBubble: {
      background: themeSettings.isGradient
        ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        : themeSettings.primaryColor ?? "#776b00ff",
      color: "white",
      padding: "12px 16px",
      borderRadius: "16px 16px 4px 16px",
      fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 4 : 16,
      lineHeight: 1.5,
      animation: "slideInRight 0.3s ease",
    },
    botMessageBubble: {
      background: themeSettings.isGradient
        ? `rgba(${hexToRgb(themeSettings.primaryColor)}, 0.6)`
        : themeSettings.secondaryColor ?? "#776b00ff",
      color: "#1a1a1a",
      padding: "12px 16px",
      borderRadius: "16px 16px 16px 4px",
      fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 4 : 14,
      lineHeight: 1.5,
      whiteSpace: "pre-wrap" as const,
      animation: "slideInLeft 0.3s ease",
    },
    timeText: {
      fontSize: 11,
      opacity: 0.6,
      marginTop: 6,
      color: themeSettings?.isDarkMode ? "#fff" : "#0000",
    },
    inputArea: {
      padding: "16px 20px",
      flexShrink: 0,
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#f8f8f8",
      borderTop: `1px solid ${
        themeSettings.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
      }`,
      width: "100%",
    },
    inputWrapper: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      background: themeSettings?.isDarkMode ? "#333" : "#fff",
      borderRadius: 24,
      padding: "8px 12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    input: {
      flex: 1,
      border: "none",
      background: "transparent",
      outline: "none",
      fontSize: 14,
      padding: "8px 12px",
      width: "0%",
      color: themeSettings?.isDarkMode ? "#fff" : "#1a1a1a",
    },
    sendButton: {
      background: themeSettings.isGradient
        ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        : themeSettings.primaryColor ?? "#776b00ff",
      color: "white",
      border: "none",
      borderRadius: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      cursor: "pointer",
      transition: "all 0.2s ease",
      flexShrink: 0,
      fontSize: 14,
      padding: "8px 16px",
    },
    formLabel: {
      display: "block",
      fontSize: formFontSize,
      fontWeight: 500,
      marginBottom: 4,
      color: themeSettings?.isDarkMode ? "#fff" : "#1a1a1a",
    },
    formInput: {
      width: "100%",
      border: `1px solid ${
        themeSettings.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
      }`,
      borderRadius: 8,
      padding: "12px 14px",
      fontSize: formFontSize,
      outline: "none",
      boxSizing: "border-box" as const,
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#fff",
      color: themeSettings?.isDarkMode ? "#fff" : "#1a1a1a",
    },
    formTextarea: {
      width: "100%",
      border: `1px solid ${
        themeSettings.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
      }`,
      borderRadius: 8,
      padding: "12px 14px",
      fontSize: formFontSize,
      lineHeight: 1.5,
      outline: "none",
      boxSizing: "border-box" as const,
      height: 96,
      resize: "vertical" as const,
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#fff",
      color: themeSettings?.isDarkMode ? "#fff" : "#1a1a1a",
    },
    sendPill: {
      background: themeSettings.isGradient
        ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
        : themeSettings.primaryColor ?? "#776b00ff",
      color: "white",
      border: "none",
      borderRadius: 36,
      padding: "10px 30px",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
  } as const;

  async function onPreChatContinue(payload: { email: string; name: string }) {
    if (apiBase === undefined) {
      setVisitor({ email: payload.email, name: payload.name });
      setPrechatError(null);
      setView("welcome");
      return;
    }
    setPrechatBusy(true);
    setPrechatError(null);
    try {
      const r = await postVisitorIdentify(apiBase, {
        email: payload.email,
        name: payload.name || undefined,
        projectToken: projectToken?.trim() || undefined,
      });
      const profile = {
        email: r.email ?? payload.email,
        name: r.name ?? payload.name,
        accessToken: r.accessToken,
        ticketId: r.ticketId ?? null,
      };
      setVisitor(profile);
      visitorRef.current = profile;
      saveVisitorSession(profile, projectToken);
      // Don't auto-open an old ticket thread — keep FAQ / AI / Get support home.
      setInTicketThread(false);
      setMessages([]);
      setTicketSummary(null);
      setHelpOpen(false);
      setView("main");
    } catch (e) {
      setPrechatError(e instanceof Error ? e.message : "Could not save your details");
    } finally {
      setPrechatBusy(false);
    }
  }

  const ticketResolved = ticketSummary?.status === "resolved";
  const showRatingPrompt = Boolean(
    ticketSummary?.canRate && !ratingSkipped && activeTicketId
  );
  const ratingSubmitted = ticketSummary?.rating != null;

  async function handleRatingSubmit(rating: number) {
    const tid = visitorRef.current?.ticketId;
    const token = visitorRef.current?.accessToken;
    if (apiBase === undefined || !tid || !token) return;

    setRatingBusy(true);
    try {
      const summary = await postVisitorTicketRating(apiBase, tid, token, rating);
      setTicketSummary(summary);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages((m) => [
        ...m,
        { role: "bot", text: userFacingChatError(msg), time: nowTime() },
      ]);
    } finally {
      setRatingBusy(false);
    }
  }

  function handleRatingSkip() {
    if (!activeTicketId) return;
    sessionStorage.setItem(ratingSkipStorageKey(activeTicketId), "1");
    setRatingSkipped(true);
  }

  function handleStartNewConversation() {
    const current = visitorRef.current;
    if (!current?.email) return;

    const oldTicketId = current.ticketId;
    if (oldTicketId) {
      dismissTicket(projectToken, oldTicketId);
      clearFaqTranscript(projectToken, oldTicketId);
      clearTicketCreatedNotice(projectToken, oldTicketId);
    }

    const profile = {
      email: current.email,
      name: current.name,
      accessToken: current.accessToken,
      ticketId: null as string | null,
    };
    setVisitor(profile);
    visitorRef.current = profile;
    saveVisitorSession(profile, projectToken);
    setTicketSummary(null);
    setRatingSkipped(false);
    setAllowResolvedReply(false);
    setInTicketThread(false);
    setMessages([]);
    setText("");
    setHelpOpen(false);
  }

  async function handleResumeTicket() {
    if (!activeTicketId) return;
    setInTicketThread(true);
    setHelpOpen(false);
    await syncTicketThread();
  }

  function handleContinueResolvedConversation() {
    setAllowResolvedReply(true);
  }

  async function onEscalateSubmit(payload: EscalatePayload) {
    const tok = projectToken?.trim();
    if (apiBase === undefined || !tok) return;

    const email = payload.email ?? visitor?.email;
    if (!email) return;

    setEscalateBusy(true);
    try {
      const transcript = buildEscalateTranscript(messages);
      const r = await postVisitorEscalate(apiBase, {
        email,
        name: payload.name ?? visitor?.name,
        projectToken: tok,
        message: payload.summary,
        ...(transcript.length ? { transcript } : {}),
      });
      setVisitor((v) => ({
        email: r.email ?? email,
        name: r.name ?? v?.name ?? payload.name ?? "",
        accessToken: r.accessToken,
        ticketId: r.ticketId ?? v?.ticketId ?? null,
      }));
      visitorRef.current = {
        email: r.email ?? email,
        name: r.name ?? payload.name ?? "",
        accessToken: r.accessToken,
        ticketId: r.ticketId ?? null,
      };
      if (r.ticketId && r.accessToken) {
        markTicketCreatedNotice(projectToken, String(r.ticketId));
        setInTicketThread(true);
        // Drop stale resolved/rating UI from a previous ticket before sync.
        setTicketSummary(null);
        setRatingSkipped(false);
        setAllowResolvedReply(false);
        await syncTicketThread();
      } else {
        setMessages((m) => [
          ...m,
          { role: "bot", text: r.message, time: nowTime() },
        ]);
      }
      setHelpOpen(false);
      setView("main");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setMessages((m) => [
        ...m,
        { role: "bot", text: userFacingChatError(msg), time: nowTime() },
      ]);
      setHelpOpen(false);
      setView("main");
    } finally {
      setEscalateBusy(false);
    }
  }

  if (widgetUnavailable && hasApi && projectToken?.trim()) {
    return null;
  }

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
        .message-content {
          display: flex;
          flex-direction: column;
          max-width: 75%;
          min-width: 0;
        }
        .message-row.user .message-content { align-items: flex-end; align-self: flex-end; }
        .message-row.bot .message-content { align-items: flex-start; }
        .message-bubble {
          width: fit-content;
          max-width: 100%;
          word-break: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
        }
        .message-bubble a.chat-message-link {
          color: inherit;
          text-decoration: underline;
          text-underline-offset: 2px;
          word-break: break-word;
        }
        @keyframes slideInRight { from{ opacity:0; transform:translateX(20px);} to{ opacity:1; transform:translateX(0);} }
        @keyframes slideInLeft  { from{ opacity:0; transform:translateX(-20px);} to{ opacity:1; transform:translateX(0);} }
        @keyframes pulse { 0%,100%{ transform:scale(1); opacity:1;} 50%{ transform:scale(1.1); opacity:0.8;} }
        .widget-help-chip:focus,
        .widget-help-chip:focus-visible {
          outline: none;
          box-shadow: none;
        }
        .chat-panel[data-theme="dark"] .chat-widget-input::placeholder,
        .chat-panel[data-theme="dark"] .chat-widget-form-input::placeholder {
          color: #94a3b8;
          opacity: 1;
        }
        .chat-panel[data-theme="light"] .chat-widget-input::placeholder,
        .chat-panel[data-theme="light"] .chat-widget-form-input::placeholder {
          color: #64748b;
          opacity: 1;
        }
        .chat-widget-form-input {
          font-size: ${formFontSize}px !important;
          line-height: 1.5;
        }
        @media (max-width: 768px), (max-height: 720px) {
          .chat-panel {
            left: 12px !important;
            right: 12px !important;
            width: auto !important;
            max-width: none !important;
            height: auto !important;
            max-height: none !important;
            border-radius: 16px !important;
          }
          .chat-panel.chat-pos-br,
          .chat-panel.chat-pos-bl {
            top: calc(env(safe-area-inset-top, 0px) + 24px) !important;
            bottom: 88px !important;
          }
          .chat-panel.chat-pos-tr,
          .chat-panel.chat-pos-tl {
            top: 88px !important;
            bottom: calc(env(safe-area-inset-bottom, 0px) + 24px) !important;
          }
          .chat-widget-floating-btn {
            width: 48px !important;
            height: 48px !important;
          }
          .chat-widget-floating-btn svg {
            width: 22px !important;
            height: 22px !important;
          }
          .chat-widget-floating-btn.chat-pos-br,
          .chat-widget-floating-btn.chat-pos-tr {
            right: 20px !important;
            left: auto !important;
          }
          .chat-widget-floating-btn.chat-pos-bl,
          .chat-widget-floating-btn.chat-pos-tl {
            left: 20px !important;
            right: auto !important;
          }
          .chat-widget-floating-btn.chat-pos-br,
          .chat-widget-floating-btn.chat-pos-bl {
            bottom: 20px !important;
            top: auto !important;
          }
          .chat-widget-floating-btn.chat-pos-tr,
          .chat-widget-floating-btn.chat-pos-tl {
            top: 20px !important;
            bottom: auto !important;
          }
          .chat-widget-welcome-header {
            padding: 28px 20px !important;
          }
          .chat-widget-welcome-header h2 {
            font-size: clamp(1.25rem, 5vw, 1.75rem) !important;
            line-height: 1.25 !important;
          }
          .chat-widget-welcome-header p {
            font-size: clamp(0.8125rem, 3.5vw, 0.9375rem) !important;
            line-height: 1.5 !important;
          }
          .chat-widget-prechat-body {
            padding: 0 16px 20px !important;
          }
          .chat-widget-faq-container {
            padding: 20px !important;
          }
        }
      `}</style>

      <FloatingButton
        open={open}
        setOpen={setOpen}
        styles={styles}
        themeSettings={themeSettings}
        className={`chat-widget-floating-btn chat-pos-${positionClass}`}
      />

      <div
        ref={panelRef}
        style={styles.panel}
        data-theme={themeSettings.isDarkMode ? "dark" : "light"}
        className={`chat-panel chat-pos-${positionClass}`}
      >
        {view === "prechat" && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, width: "100%" }}>
            <PreChatScreen
              styles={styles as unknown as Record<string, React.CSSProperties>}
              themeSettings={themeSettings}
              onContinue={onPreChatContinue}
              busy={prechatBusy}
              error={prechatError}
            />
          </div>
        )}

        {view === "main" && visitorGateEffective ? (
          <WidgetMainView
            styles={styles as unknown as Record<string, React.CSSProperties>}
            title={chatTitle}
            messages={messages}
            showTyping={awaitingBot}
            sending={sending}
            text={text}
            setText={setText}
            onSend={handleSend}
            messagesEndRef={messagesEndRef as unknown as React.RefObject<HTMLDivElement>}
            themeSettings={themeSettings}
            faqs={faqs}
            onSelectFAQ={handleSelectFAQ}
            helpOpen={helpOpen}
            onHelpOpenChange={handleHelpOpenChange}
            interactionLocked={interactionLocked}
            hasActiveTicket={viewingTicketThread}
            activeTicketId={viewingTicketThread ? activeTicketId : null}
            ticketStatus={viewingTicketThread ? ticketSummary?.status ?? null : null}
            resumableTicketId={resumableTicketId}
            onResumeTicket={() => void handleResumeTicket()}
            ticketResolved={viewingTicketThread && ticketResolved}
            showRatingPrompt={viewingTicketThread && showRatingPrompt}
            ratingBusy={ratingBusy}
            ratingSubmitted={ratingSubmitted}
            onRatingSubmit={handleRatingSubmit}
            onRatingSkip={handleRatingSkip}
            onStartNewConversation={handleStartNewConversation}
            onContinueResolvedConversation={handleContinueResolvedConversation}
            allowResolvedReply={allowResolvedReply}
            canEscalate={canEscalate}
            aiChatAvailable={aiChatAvailable}
            onContactSupport={() => setView("escalate")}
            placeholder={placeholder}
            apiBaseUrl={apiBase}
          />
        ) : null}

        {view === "welcome" && !visitorGateEffective ? (
          <WelcomeScreen
            styles={styles}
            faqs={faqs}
            onSelectFAQ={handleSelectFAQ}
            interactionLocked={interactionLocked}
            placeholder={placeholder}
            text={text}
            setText={setText}
            onSend={(e) => {
              e.preventDefault();
              setView("chat");
              handleSend(e);
            }}
            themeSettings={themeSettings}
            canEscalate={canEscalate}
            onCreateSupportTicket={() => setView("escalate")}
          />
        ) : null}

        {view === "chat" && !visitorGateEffective ? (
          <ChatScreen
            styles={styles}
            title={chatTitle}
            messages={messages}
            showTyping={awaitingBot}
            sending={sending}
            text={text}
            setText={setText}
            onSend={handleSend}
            onBack={handleBackToFAQs}
            interactionLocked={interactionLocked}
            messagesEndRef={messagesEndRef as unknown as React.RefObject<HTMLDivElement>}
            themeSettings={themeSettings}
            canEscalate={canEscalate}
            onContactSupport={() => setView("escalate")}
            apiBaseUrl={apiBase}
          />
        ) : null}

        {view === "escalate" && (
          <EscalateScreen
            styles={styles as unknown as Record<string, React.CSSProperties>}
            themeSettings={themeSettings}
            title={chatTitle}
            onBack={() => {
              setHelpOpen(false);
              setView("main");
            }}
            onSubmit={onEscalateSubmit}
            busy={escalateBusy}
            collectIdentity={collectIdentityOnEscalate}
            initialEmail={visitor?.email}
            initialName={visitor?.name}
            initialSummary={lastUserMessageForEscalate(messages)}
          />
        )}
      </div>
    </>
  );
}
