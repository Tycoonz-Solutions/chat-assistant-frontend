"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ChatWidget: () => ChatWidget,
  assertCompleteJwt: () => assertCompleteJwt,
  createBackendSendMessage: () => createBackendSendMessage,
  default: () => ChatWidget,
  postChatCompletion: () => postChatCompletion,
  postVisitorEscalate: () => postVisitorEscalate,
  postVisitorIdentify: () => postVisitorIdentify
});
module.exports = __toCommonJS(index_exports);

// src/ChatWidget.tsx
var import_react7 = require("react");

// src/components/FloatingButton.tsx
var import_lucide_react = require("lucide-react");
var import_jsx_runtime = require("react/jsx-runtime");
function FloatingButton({
  open,
  setOpen,
  styles,
  themeSettings,
  className
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "button",
    {
      className,
      style: styles.floatingButton,
      onClick: () => setOpen((s) => !s),
      onMouseEnter: (e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = `0 12px 32px ${themeSettings?.isGradient ? themeSettings.secondaryColor || themeSettings.primaryColor : themeSettings.primaryColor}`;
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${themeSettings?.isGradient ? themeSettings.secondaryColor || themeSettings.primaryColor : themeSettings.primaryColor}`;
      },
      "aria-label": "Open chat",
      children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.X, { size: 28 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_lucide_react.MessageCircle, { size: 28 })
    }
  );
}

// src/components/WelcomeScreen.tsx
var import_react = __toESM(require("react"));
var import_lucide_react3 = require("lucide-react");

// src/lib/greeting-message.ts
var DEFAULT_GREETING_BODY = "AI chat powered by our team \u2014 how can we assist you today?";
var DEFAULT_PRECHAT_BODY = "Tell us who you are so we can help and follow up by email if needed.";
var DISCARDED_HEADLINES = [
  /^at your service!?$/i,
  /^hi there!?$/i,
  /^hello!?$/i
];
function isDiscardedHeadline(line) {
  return DISCARDED_HEADLINES.some((re) => re.test(line.trim()));
}
function splitGreetingMessage(raw) {
  const t = (raw ?? "").trim();
  if (!t) return { headline: "", subtitle: "" };
  const idx = t.indexOf("\n");
  if (idx === -1) return { headline: t, subtitle: "" };
  return { headline: t.slice(0, idx).trim(), subtitle: t.slice(idx + 1).trim() };
}
function resolveBotName(themeSettings) {
  return themeSettings.botName?.trim() || "AI Chatbot";
}
function resolveWelcomeCopy(themeSettings, options) {
  const botName = resolveBotName(themeSettings);
  const headline = `Welcome! I'm ${botName}`;
  const { headline: first, subtitle: rest } = splitGreetingMessage(
    themeSettings.greetingMessage
  );
  let subtitle = "";
  if (rest) {
    subtitle = rest;
  } else if (first && !isDiscardedHeadline(first)) {
    subtitle = first;
  }
  if (!subtitle) {
    subtitle = options?.preChat ? DEFAULT_PRECHAT_BODY : DEFAULT_GREETING_BODY;
  }
  return { headline, subtitle };
}

// src/components/WidgetCloseButton.tsx
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function WidgetCloseButton({
  onClose,
  size = 22
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "button",
    {
      type: "button",
      onClick: onClose,
      "aria-label": "Close chat",
      className: "chat-widget-close-btn",
      style: {
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        marginLeft: 8,
        padding: 0,
        border: "none",
        borderRadius: 999,
        background: "rgba(255,255,255,0.18)",
        color: "white",
        cursor: "pointer"
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react2.X, { size, strokeWidth: 2.25 })
    }
  );
}

// src/components/WelcomeScreen.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function WelcomeScreen({
  styles,
  faqs,
  onSelectFAQ,
  placeholder,
  text,
  setText,
  onSend,
  themeSettings,
  canEscalate,
  onCreateSupportTicket,
  interactionLocked = false,
  aiChatAvailable = false,
  onClose
}) {
  const { headline, subtitle } = resolveWelcomeCopy(themeSettings);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: styles.welcomeScreen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: styles.welcomeHeader, className: "chat-widget-welcome-header", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "div",
      {
        style: {
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { minWidth: 0, flex: 1 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { style: { margin: 0, fontSize: themeSettings?.fontSizeBase, fontWeight: 700, marginBottom: 8 }, children: headline }),
            subtitle ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { style: { margin: 0, fontSize: themeSettings?.fontSizeBase / 2, opacity: 0.95, lineHeight: 1.5, whiteSpace: "pre-wrap" }, children: subtitle }) : null
          ] }),
          onClose ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(WidgetCloseButton, { onClose }) : null
        ]
      }
    ) }),
    canEscalate && onCreateSupportTicket ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        style: {
          width: "90%",
          padding: "8px 12px 0",
          textAlign: "center"
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "button",
          {
            type: "button",
            onClick: onCreateSupportTicket,
            style: {
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: themeSettings?.fontSizeBase ? themeSettings.fontSizeBase / 2 - 1 : 13,
              fontWeight: 600,
              color: themeSettings.primaryColor ?? "#006D77",
              textDecoration: "underline",
              padding: "4px 8px"
            },
            children: "Need help? Create support ticket"
          }
        )
      }
    ) : null,
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        style: {
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
          width: "90%",
          marginTop: -24,
          overflow: "hidden"
        },
        children: faqs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: styles.faqContainer, className: "chat-widget-faq-container", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
            padding: "0 4px",
            flexShrink: 0
          }, children: [
            themeSettings.isGradient ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(GradientIcon, { themeSettings }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react3.List, { size: 20, color: themeSettings.primaryColor }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { margin: 0, fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 4 : 16, fontWeight: 600, color: themeSettings?.isDarkMode ? "#fff" : "#1a1a1a" }, children: "Quick FAQs" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              className: "hide-scrollbar",
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 4,
                flex: 1,
                minHeight: 0,
                overflowY: "auto"
              },
              children: faqs.map((faq, index) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "button",
                {
                  type: "button",
                  disabled: interactionLocked,
                  style: {
                    ...styles.faqCard,
                    opacity: interactionLocked ? 0.55 : 1,
                    cursor: interactionLocked ? "not-allowed" : "pointer"
                  },
                  onClick: () => {
                    if (interactionLocked) return;
                    onSelectFAQ(faq);
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.border = `1px solid ${themeSettings.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`;
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.border = "1px solid transparent";
                  },
                  children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 10px",
                    cursor: "pointer"
                  }, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { style: {
                      fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 2 : 16,
                      color: index === 0 ? themeSettings?.isDarkMode ? "#fff" : "#1a1a1a" : themeSettings?.isDarkMode ? "#ccc" : "#4a5568",
                      fontWeight: index === 0 ? 600 : 500,
                      textAlign: "left",
                      flex: 1
                    }, children: faq.question }),
                    getThemedIcon({
                      Icon: import_lucide_react3.ChevronRight,
                      size: 20,
                      themeSettings
                    })
                  ] })
                },
                index
              ))
            }
          )
        ] }) : null
      }
    ),
    aiChatAvailable ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: styles.inputArea, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("form", { onSubmit: onSend, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: styles.inputWrapper, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "input",
        {
          value: text,
          onChange: (e) => setText(e.target.value),
          placeholder,
          className: "chat-widget-input",
          style: styles.input,
          disabled: interactionLocked
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        "button",
        {
          type: "submit",
          style: {
            ...styles.sendButton,
            opacity: interactionLocked ? 0.55 : 1,
            cursor: interactionLocked ? "not-allowed" : "pointer"
          },
          disabled: interactionLocked,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_lucide_react3.Send, { size: 18 }),
            " Send"
          ]
        }
      )
    ] }) }) }) : null
  ] });
}
function GradientIcon({ themeSettings }) {
  const gradientId = "iconGradient";
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: "20", height: "20", viewBox: "0 0 24 24", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("linearGradient", { id: gradientId, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("stop", { offset: "0%", stopColor: themeSettings.primaryColor }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("stop", { offset: "100%", stopColor: themeSettings.secondaryColor })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01", stroke: `url(#${gradientId})` })
  ] });
}
var getThemedIcon = ({
  Icon,
  size = 20,
  themeSettings
}) => {
  if (themeSettings.isGradient) {
    const gradientId = import_react.default.useId();
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        strokeWidth: "2",
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("linearGradient", { id: gradientId, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("stop", { offset: "0%", stopColor: themeSettings.primaryColor }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("stop", { offset: "100%", stopColor: themeSettings.secondaryColor })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { stroke: `url(#${gradientId})`, fill: "none", size })
        ]
      }
    );
  } else {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Icon, { size, color: themeSettings.primaryColor ?? "#006D77" });
  }
};

// src/components/ChatScreen.tsx
var import_lucide_react5 = require("lucide-react");

// src/lib/widget-display.ts
var DEFAULT_BOT_AVATAR = "https://i.pravatar.cc/150?img=32";
function resolveWidgetAssetUrl(apiBaseUrl, path) {
  if (!path?.trim()) return null;
  const raw = path.trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  const normalized = raw.startsWith("/") ? raw : `/${raw}`;
  if (typeof window !== "undefined" && normalized.startsWith("/uploads")) {
    try {
      const apiOrigin = apiBaseUrl?.trim() ? new URL(apiBaseUrl, window.location.href).origin : "";
      if (!apiOrigin || apiOrigin === window.location.origin) {
        return normalized;
      }
      if (window.location.pathname.includes("/demo-site") || /localhost|127\.0\.0\.1/.test(window.location.hostname)) {
        return normalized;
      }
      return `${apiOrigin}${normalized}`;
    } catch {
      return normalized;
    }
  }
  if (!apiBaseUrl?.trim()) return normalized;
  return `${apiBaseUrl.replace(/\/$/, "")}${normalized}`;
}
function widgetBotAvatarUrl(apiBaseUrl, botAvatarUrl) {
  return resolveWidgetAssetUrl(apiBaseUrl, botAvatarUrl) ?? DEFAULT_BOT_AVATAR;
}
function parseStaffSenderName(label) {
  const raw = String(label || "").trim();
  if (!raw || raw === "Unknown sender" || raw === "System") return "Support";
  const match = raw.match(/^(.+?)\s*\((?:Agent|Owner|Support)\)$/);
  return match ? match[1].trim() : raw;
}

// src/lib/widget-font-size.ts
function widgetBodyFontSize(fontSizeBase) {
  const base = fontSizeBase ?? 28;
  return Math.max(16, Math.round(base / 2 + 4));
}
function widgetFormFontSize(fontSizeBase) {
  return widgetBodyFontSize(fontSizeBase);
}
function widgetHeaderSubFontSize(fontSizeBase) {
  const base = fontSizeBase ?? 28;
  return Math.max(14, Math.round(base / 2));
}
function widgetWelcomeHeadlineSize(fontSizeBase) {
  return fontSizeBase ?? 28;
}
function widgetPrechatHeadlineSize(fontSizeBase) {
  return widgetFormFontSize(fontSizeBase) + 3;
}
function widgetPrechatSubtitleSize(fontSizeBase) {
  return Math.max(14, widgetFormFontSize(fontSizeBase) - 1);
}

// src/components/LinkifiedText.tsx
var import_react2 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var URL_RE = /\b((?:https?:\/\/|www\.)[^\s<>"'`]+)/gi;
function trimTrailingPunctuation(url) {
  let core = url;
  let trailing = "";
  while (/[),.;:!?'"\]]$/u.test(core)) {
    trailing = core.slice(-1) + trailing;
    core = core.slice(0, -1);
  }
  return { hrefCore: core, trailing };
}
function toHref(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  return null;
}
function LinkifiedText({ text }) {
  const raw = text ?? "";
  if (!raw) return null;
  const nodes = [];
  let lastIndex = 0;
  let match;
  const re = new RegExp(URL_RE.source, URL_RE.flags);
  while ((match = re.exec(raw)) !== null) {
    const full = match[1] ?? match[0];
    const start = match.index;
    if (start > lastIndex) {
      nodes.push(raw.slice(lastIndex, start));
    }
    const { hrefCore, trailing } = trimTrailingPunctuation(full);
    const href = toHref(hrefCore);
    if (href && hrefCore) {
      nodes.push(
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "a",
          {
            href,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "chat-message-link",
            children: hrefCore
          },
          `link-${start}-${hrefCore}`
        )
      );
      if (trailing) nodes.push(trailing);
    } else {
      nodes.push(full);
    }
    lastIndex = start + full.length;
  }
  if (lastIndex < raw.length) {
    nodes.push(raw.slice(lastIndex));
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: nodes.map(
    (node, i) => typeof node === "string" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react2.Fragment, { children: node }, `t-${i}`) : node
  ) });
}

// src/components/MessageList.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function MessageList({
  styles,
  messages,
  showTyping = false,
  messagesEndRef,
  themeSettings,
  apiBaseUrl,
  hideEmptyPlaceholder = false
}) {
  const nowTime = () => (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const defaultAvatarSrc = widgetBotAvatarUrl(apiBaseUrl, themeSettings.botAvatarUrl);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: styles.messagesArea, className: "hide-scrollbar", children: [
    messages.length === 0 && !hideEmptyPlaceholder && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: {
      textAlign: "center",
      color: themeSettings?.isDarkMode ? "#fff" : "#718096",
      fontSize: widgetBodyFontSize(themeSettings?.fontSizeBase),
      padding: "40px 20px"
    }, children: "Start a conversation..." }),
    messages.map((msg, idx) => {
      if (msg.isSystem) {
        return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "center",
              padding: "12px 16px"
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "div",
              {
                style: {
                  maxWidth: "92%",
                  textAlign: "center",
                  fontSize: widgetBodyFontSize(themeSettings?.fontSizeBase),
                  fontWeight: 600,
                  lineHeight: 1.4,
                  color: themeSettings?.isDarkMode ? "#e2e8f0" : "#0f766e",
                  background: themeSettings?.isDarkMode ? "rgba(13, 148, 136, 0.22)" : "rgba(0, 109, 119, 0.12)",
                  border: themeSettings?.isDarkMode ? "1px solid rgba(45, 212, 191, 0.35)" : "1px solid rgba(0, 109, 119, 0.25)",
                  borderRadius: 8,
                  padding: "8px 14px"
                },
                children: msg.text
              }
            )
          },
          msg.id ?? `system-${idx}`
        );
      }
      const isBot = msg.role === "bot";
      const showStaffName = isBot && msg.isStaff && msg.senderName;
      const showAiName = isBot && !msg.isStaff && !msg.isSystem && Boolean(msg.senderName);
      const avatarSrc = msg.isStaff ? resolveWidgetAssetUrl(apiBaseUrl, msg.senderAvatar) || defaultAvatarSrc : defaultAvatarSrc;
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `message-row ${isBot ? "bot" : "user"}`, children: [
        isBot && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "bot-avatar", "aria-hidden": true, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "img",
          {
            src: avatarSrc,
            alt: "",
            onError: (e) => {
              const img = e.currentTarget;
              if (img.dataset.fallback === "1") return;
              img.dataset.fallback = "1";
              img.src = DEFAULT_BOT_AVATAR;
            }
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `message-content ${isBot ? "bot" : "user"}`, children: [
          showStaffName || showAiName ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "div",
            {
              style: {
                fontSize: 12,
                fontWeight: 600,
                color: themeSettings?.isDarkMode ? "#e2e8f0" : "#334155",
                marginBottom: 4,
                lineHeight: 1.3
              },
              children: msg.senderName
            }
          ) : null,
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "div",
            {
              className: "message-bubble",
              style: isBot ? styles.botMessageBubble : styles.userMessageBubble,
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(LinkifiedText, { text: msg.text })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { ...styles.timeText, alignSelf: isBot ? "flex-start" : "flex-end" }, children: msg.time ?? nowTime() })
        ] })
      ] }, msg.id ?? `local-${idx}`);
    }),
    showTyping && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      alignSelf: "flex-start"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "bot-avatar", "aria-hidden": true, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("img", { src: defaultAvatarSrc, alt: "" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: {
        background: themeSettings?.isDarkMode ? "#383737ff" : "#d1e7e8",
        padding: "12px 16px",
        borderRadius: "16px 16px 16px 4px",
        fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 4 : 14,
        color: "#4a5568"
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { display: "flex", gap: 4 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: {
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: themeSettings.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor ?? "#006D77",
            animation: "pulse 1.4s ease-in-out infinite"
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: {
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: themeSettings.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor ?? "#006D77",
            animation: "pulse 1.4s ease-in-out 0.2s infinite"
          } }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: {
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: themeSettings.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor ?? "#006D77",
            animation: "pulse 1.4s ease-in-out 0.4s infinite"
          } })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: { ...styles.timeText, marginTop: 8 }, children: nowTime() })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { ref: messagesEndRef })
  ] });
}

// src/components/InputArea.tsx
var import_react3 = require("react");
var import_lucide_react4 = require("lucide-react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var MAX_INPUT_HEIGHT_PX = 120;
function InputArea({
  styles,
  text,
  setText,
  onSend,
  loading,
  themeSettings
}) {
  const textareaRef = (0, import_react3.useRef)(null);
  (0, import_react3.useEffect)(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_INPUT_HEIGHT_PX)}px`;
  }, [text]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { style: styles.inputArea, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    "form",
    {
      onSubmit: (e) => {
        e.preventDefault();
        onSend(e);
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
        "div",
        {
          style: {
            ...styles.inputWrapper,
            alignItems: "flex-end"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              "textarea",
              {
                ref: textareaRef,
                value: text,
                onChange: (e) => setText(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading && text.trim()) void onSend(e);
                  }
                },
                placeholder: "Type message here...",
                className: "chat-widget-input",
                rows: 1,
                disabled: loading,
                style: {
                  ...styles.input,
                  width: "auto",
                  minWidth: 0,
                  resize: "none",
                  overflowY: "auto",
                  overflowX: "hidden",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                  lineHeight: 1.4,
                  maxHeight: MAX_INPUT_HEIGHT_PX
                }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
              "button",
              {
                type: "submit",
                disabled: loading || !text.trim(),
                style: {
                  ...styles.sendButton,
                  opacity: loading || !text.trim() ? 0.5 : 1,
                  cursor: loading || !text.trim() ? "not-allowed" : "pointer"
                },
                onMouseEnter: (e) => {
                  if (!loading && text.trim()) {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.background = themeSettings?.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor;
                  }
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.background = themeSettings?.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor;
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react4.Send, { size: 18 }),
                  " Send"
                ]
              }
            )
          ]
        }
      )
    }
  ) });
}

// src/components/ChatScreen.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function ChatScreen({
  styles,
  title,
  messages,
  showTyping,
  sending,
  text,
  setText,
  onSend,
  onBack,
  messagesEndRef,
  themeSettings,
  canEscalate,
  onContactSupport,
  interactionLocked = false,
  aiChatAvailable = false,
  apiBaseUrl,
  onClose
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: styles.chatScreen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: styles.header, className: "chat-widget-sheet-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "button",
          {
            type: "button",
            onClick: onBack,
            disabled: interactionLocked,
            style: {
              background: "transparent",
              border: "none",
              color: "white",
              cursor: interactionLocked ? "not-allowed" : "pointer",
              opacity: interactionLocked ? 0.55 : 1,
              borderRadius: 8,
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = "transparent";
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_lucide_react5.ArrowLeft, { size: 20 })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "div",
            {
              style: {
                fontWeight: 600,
                fontSize: themeSettings?.fontSizeBase ? themeSettings.fontSizeBase / 2 + 4 : 16
              },
              children: title
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            "div",
            {
              style: {
                fontSize: themeSettings?.fontSizeBase ? themeSettings.fontSizeBase / 2 - 2 : 12,
                opacity: 0.9
              },
              children: "Online"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }, children: [
        canEscalate && onContactSupport ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "button",
          {
            type: "button",
            onClick: onContactSupport,
            style: {
              flexShrink: 0,
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.5)",
              color: "white",
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer"
            },
            children: "Contact support"
          }
        ) : null,
        onClose ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(WidgetCloseButton, { onClose }) : null
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      MessageList,
      {
        styles,
        messages,
        showTyping,
        messagesEndRef,
        themeSettings,
        apiBaseUrl
      }
    ),
    canEscalate && onContactSupport ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "div",
      {
        style: {
          flexShrink: 0,
          padding: "6px 16px 4px",
          textAlign: "center",
          background: themeSettings?.isDarkMode ? "#2b2b2b" : "#f8f8f8"
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          "button",
          {
            type: "button",
            onClick: onContactSupport,
            style: {
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: themeSettings?.fontSizeBase ? themeSettings.fontSizeBase / 2 - 1 : 13,
              fontWeight: 600,
              color: themeSettings.primaryColor ?? "#006D77",
              textDecoration: "underline",
              padding: "2px 4px"
            },
            children: "Need help? Create support ticket"
          }
        )
      }
    ) : null,
    aiChatAvailable ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      InputArea,
      {
        styles,
        text,
        setText,
        onSend,
        loading: Boolean(showTyping || sending || interactionLocked),
        themeSettings
      }
    ) : null
  ] });
}

// src/components/FaqListPanel.tsx
var import_lucide_react6 = require("lucide-react");
var import_jsx_runtime8 = require("react/jsx-runtime");
function FaqListPanel({
  styles,
  faqs,
  themeSettings,
  onSelectFAQ,
  compact = false,
  disabled = false
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
    "div",
    {
      className: "hide-scrollbar",
      style: {
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: compact ? "12px 16px 16px" : "16px 20px 20px",
        background: themeSettings?.isDarkMode ? "#2b2b2b" : "#f8f8f8"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_lucide_react6.List, { size: 18, color: themeSettings.primaryColor ?? "#006D77" }),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                "h3",
                {
                  style: {
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    color: themeSettings?.isDarkMode ? "#fff" : "#1a1a1a"
                  },
                  children: "Quick questions"
                }
              )
            ]
          }
        ),
        faqs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "p",
          {
            style: {
              margin: 0,
              fontSize: 13,
              color: themeSettings?.isDarkMode ? "#aaa" : "#64748b",
              textAlign: "center",
              padding: "24px 8px"
            },
            children: "No FAQs yet. Start a conversation and our team will help you."
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: faqs.map((faq, index) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          "button",
          {
            type: "button",
            disabled,
            style: {
              ...styles.faqCard,
              width: "100%",
              border: `1px solid ${themeSettings.isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.55 : 1,
              textAlign: "left"
            },
            onClick: () => {
              if (disabled) return;
              onSelectFAQ(faq);
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  gap: 8
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                    "span",
                    {
                      style: {
                        fontSize: 14,
                        fontWeight: 500,
                        color: themeSettings?.isDarkMode ? "#f1f5f9" : "#1a1a1a",
                        flex: 1
                      },
                      children: faq.question
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                    import_lucide_react6.ChevronRight,
                    {
                      size: 18,
                      color: themeSettings.primaryColor ?? "#006D77"
                    }
                  )
                ]
              }
            )
          },
          `${faq.question}-${index}`
        )) })
      ]
    }
  );
}

// src/components/HelpChip.tsx
var import_lucide_react7 = require("lucide-react");
var import_jsx_runtime9 = require("react/jsx-runtime");
function HelpChip({ active, onClick, themeSettings, disabled = false }) {
  const primary = themeSettings.primaryColor ?? "#006D77";
  const isDark = themeSettings.isDarkMode;
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    "button",
    {
      type: "button",
      className: "widget-help-chip",
      onClick,
      disabled,
      "aria-expanded": active,
      "aria-disabled": disabled,
      "aria-label": active ? "Back to messages" : "Browse quick help",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        border: `1px solid ${active ? primary : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
        borderRadius: 999,
        padding: "7px 14px",
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        pointerEvents: disabled ? "none" : void 0,
        background: active ? primary : isDark ? "#333" : "#fff",
        color: active ? "#fff" : isDark ? "#e2e8f0" : "#334155",
        boxShadow: active ? "none" : isDark ? "0 1px 3px rgba(0,0,0,0.35)" : "0 1px 4px rgba(0,0,0,0.08)",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
        outline: "none"
      },
      children: [
        active ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react7.X, { size: 16, "aria-hidden": true }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react7.HelpCircle, { size: 16, "aria-hidden": true }),
        active ? "Back to chat" : "Quick help"
      ]
    }
  );
}

// src/components/ConversationRatingPrompt.tsx
var import_react4 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
function ConversationRatingPrompt({
  themeSettings,
  busy,
  onSubmit,
  onSkip
}) {
  const [hovered, setHovered] = (0, import_react4.useState)(0);
  const [selected, setSelected] = (0, import_react4.useState)(0);
  const primary = themeSettings.primaryColor ?? "#006D77";
  async function handleSubmit() {
    if (!selected || busy) return;
    await onSubmit(selected);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
    "div",
    {
      style: {
        margin: "4px 0 12px",
        padding: "16px 18px",
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08)"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "p",
          {
            style: {
              margin: "0 0 4px",
              fontSize: 14,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.01em"
            },
            children: "How was your conversation?"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "p",
          {
            style: {
              margin: "0 0 14px",
              fontSize: 12,
              lineHeight: 1.4,
              color: "#6b7280"
            },
            children: "Rate your experience after this chat has ended."
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "div",
          {
            style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 14 },
            role: "radiogroup",
            "aria-label": "Rate your conversation from 1 to 5 stars",
            children: [1, 2, 3, 4, 5].map((star) => {
              const active = star <= (hovered || selected);
              return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
                "button",
                {
                  type: "button",
                  role: "radio",
                  "aria-checked": selected === star,
                  disabled: busy,
                  onMouseEnter: () => setHovered(star),
                  onMouseLeave: () => setHovered(0),
                  onClick: () => setSelected(star),
                  style: {
                    border: "none",
                    background: "transparent",
                    cursor: busy ? "not-allowed" : "pointer",
                    fontSize: 28,
                    lineHeight: 1,
                    padding: 0,
                    color: active ? "#f59e0b" : "#d1d5db",
                    transition: "color 0.12s ease"
                  },
                  children: "\u2605"
                },
                star
              );
            })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center" }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "button",
            {
              type: "button",
              onClick: onSkip,
              disabled: busy,
              style: {
                border: "none",
                background: "transparent",
                color: "#6b7280",
                fontSize: 13,
                fontWeight: 500,
                cursor: busy ? "not-allowed" : "pointer",
                padding: "8px 12px"
              },
              children: "Skip"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "button",
            {
              type: "button",
              onClick: () => void handleSubmit(),
              disabled: !selected || busy,
              style: {
                border: "none",
                borderRadius: 999,
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                background: primary,
                opacity: !selected || busy ? 0.55 : 1,
                cursor: !selected || busy ? "not-allowed" : "pointer",
                boxShadow: !selected || busy ? "none" : "0 2px 8px rgba(0,0,0,0.18)"
              },
              children: busy ? "Submitting\u2026" : "Submit"
            }
          )
        ] })
      ]
    }
  );
}

// src/lib/formatTicketId.ts
function formatTicketId(id) {
  const tail = id.replace(/\D/g, "").slice(-6) || id.slice(-6);
  return `#${tail.toUpperCase()}`;
}

// src/components/WelcomeMessagePanel.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
function WelcomeMessagePanel({
  themeSettings,
  compact = false
}) {
  const { headline, subtitle } = resolveWelcomeCopy(themeSettings);
  const headlineSize = widgetWelcomeHeadlineSize(themeSettings.fontSizeBase);
  const bodySize = widgetBodyFontSize(themeSettings.fontSizeBase);
  const isDark = themeSettings.isDarkMode;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "div",
    {
      style: {
        margin: compact ? "12px 16px 0" : "16px 16px 0",
        padding: compact ? "16px 18px" : "20px 22px",
        borderRadius: 16,
        background: themeSettings.isGradient ? `linear-gradient(135deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor ?? "#006D77",
        color: "#fff",
        boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.08)"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "div",
          {
            style: {
              fontSize: compact ? headlineSize * 0.85 : headlineSize,
              fontWeight: 700,
              lineHeight: 1.25,
              marginBottom: subtitle ? 8 : 0
            },
            children: headline
          }
        ),
        subtitle ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "p",
          {
            style: {
              margin: 0,
              fontSize: bodySize,
              lineHeight: 1.5,
              opacity: 0.95,
              whiteSpace: "pre-wrap"
            },
            children: subtitle
          }
        ) : null
      ]
    }
  );
}

// src/lib/widget-storage-id.ts
function widgetProjectStorageId(projectToken) {
  const token = projectToken?.trim();
  return token || "default";
}

// src/lib/ticket-created-notice.ts
function formatVisitorTicketStatus(status) {
  const s = (status || "open").trim().toLowerCase();
  if (s === "new") return "New";
  if (s === "in_progress" || s === "in-progress") return "In Progress";
  if (s === "resolved") return "Resolved";
  return "Open";
}
function noticeStorageKey(projectToken, ticketId) {
  return `chat-widget-ticket-created-notice-${widgetProjectStorageId(projectToken)}-${ticketId}`;
}
function markTicketCreatedNotice(projectToken, ticketId) {
  if (typeof window === "undefined" || !ticketId) return;
  try {
    sessionStorage.setItem(noticeStorageKey(projectToken, ticketId), "1");
  } catch {
  }
}
function clearTicketCreatedNotice(projectToken, ticketId) {
  if (typeof window === "undefined" || !ticketId) return;
  try {
    sessionStorage.removeItem(noticeStorageKey(projectToken, ticketId));
  } catch {
  }
}
function shouldShowTicketCreatedNotice(projectToken, ticketId) {
  if (typeof window === "undefined" || !ticketId) return false;
  try {
    return sessionStorage.getItem(noticeStorageKey(projectToken, ticketId)) === "1";
  } catch {
    return false;
  }
}
function buildTicketCreatedNoticeMsg(ticketId, nowTime) {
  const idLabel = formatTicketId(ticketId);
  const text = [
    "Your support ticket has been created successfully.",
    "",
    `Ticket ID: ${idLabel}`,
    "",
    "Our support team has been notified and will respond during working hours. You\u2019ll get a confirmation email, and another when an agent replies.",
    "",
    "Estimated Response Time: Within 24 hours."
  ].join("\n");
  return {
    id: `ticket-created-notice-${ticketId}`,
    role: "bot",
    text,
    time: nowTime(),
    sortAt: (/* @__PURE__ */ new Date()).toISOString(),
    ticketCreatedNotice: true,
    senderName: "Support"
  };
}
function withTicketCreatedNotice(thread, projectToken, ticketId, nowTime) {
  const hasStaffReply = thread.some((m) => m.isStaff);
  if (hasStaffReply) {
    clearTicketCreatedNotice(projectToken, ticketId);
    return thread.filter((m) => !m.ticketCreatedNotice);
  }
  if (!shouldShowTicketCreatedNotice(projectToken, ticketId)) {
    return thread.filter((m) => !m.ticketCreatedNotice);
  }
  if (thread.some((m) => m.ticketCreatedNotice)) return thread;
  return [...thread, buildTicketCreatedNoticeMsg(ticketId, nowTime)];
}

// src/components/WidgetMainView.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
function WidgetMainView({
  styles,
  title,
  messages,
  showTyping,
  sending,
  text,
  setText,
  onSend,
  messagesEndRef,
  themeSettings,
  faqs,
  onSelectFAQ,
  helpOpen,
  onHelpOpenChange,
  interactionLocked = false,
  hasActiveTicket,
  activeTicketId = null,
  ticketStatus = null,
  resumableTicketId = null,
  onResumeTicket,
  onExitAgentChat,
  onClose,
  ticketResolved = false,
  showRatingPrompt = false,
  ratingBusy = false,
  ratingSubmitted = false,
  onRatingSubmit,
  onRatingSkip,
  onStartNewConversation,
  onContinueResolvedConversation,
  allowResolvedReply = false,
  canEscalate,
  aiChatAvailable = false,
  onContactSupport,
  placeholder,
  apiBaseUrl
}) {
  const { headline, subtitle } = resolveWelcomeCopy(themeSettings);
  const feedbackComplete = ratingSubmitted || !showRatingPrompt;
  const showResolvedActions = ticketResolved && feedbackComplete && hasActiveTicket;
  const showComposer = (!ticketResolved || allowResolvedReply) && (hasActiveTicket || aiChatAvailable);
  const showInlineFaqs = !hasActiveTicket && messages.length === 0 && !helpOpen && faqs.length > 0;
  const showHelpChip = faqs.length > 0 && !showInlineFaqs && !hasActiveTicket;
  const showWelcomePanel = !hasActiveTicket && messages.length === 0 && !ticketResolved;
  const isDark = themeSettings.isDarkMode;
  const headerSubSize = widgetHeaderSubFontSize(themeSettings.fontSizeBase);
  const layoutStyles = {
    ...styles,
    messagesArea: {
      ...styles.messagesArea,
      paddingBottom: 20
    },
    inputArea: {
      ...styles.inputArea,
      position: "relative",
      bottom: "auto",
      width: "100%",
      borderTop: "none",
      padding: "0 0 16px"
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: styles.chatScreen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
      "div",
      {
        style: styles.header,
        className: "chat-widget-sheet-header",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { style: { minWidth: 0, flex: 1 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              "div",
              {
                style: {
                  fontWeight: 600,
                  fontSize: themeSettings?.fontSizeBase ? themeSettings.fontSizeBase / 2 + 4 : 16
                },
                children: title
              }
            ),
            hasActiveTicket || !showWelcomePanel ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              "div",
              {
                style: {
                  fontSize: headerSubSize,
                  opacity: 0.9,
                  marginTop: 2,
                  lineHeight: 1.4
                },
                children: hasActiveTicket && activeTicketId ? `Ticket ${formatTicketId(activeTicketId)} \xB7 Status: ${formatVisitorTicketStatus(
                  ticketResolved ? "resolved" : ticketStatus
                )}` : hasActiveTicket ? `Status: ${formatVisitorTicketStatus(
                  ticketResolved ? "resolved" : ticketStatus
                )}` : subtitle || headline
              }
            ) : null
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0
              },
              children: [
                hasActiveTicket && onExitAgentChat ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                  "button",
                  {
                    type: "button",
                    onClick: onExitAgentChat,
                    disabled: interactionLocked,
                    "aria-busy": interactionLocked,
                    style: {
                      flexShrink: 0,
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.5)",
                      color: "white",
                      borderRadius: 999,
                      padding: "8px 14px",
                      fontSize: headerSubSize,
                      fontWeight: 600,
                      cursor: interactionLocked ? "not-allowed" : "pointer",
                      opacity: interactionLocked ? 0.55 : 1
                    },
                    children: interactionLocked ? "Please wait\u2026" : "Exit agent chat"
                  }
                ) : null,
                !hasActiveTicket && (canEscalate && onContactSupport || resumableTicketId && onResumeTicket) ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      if (interactionLocked) return;
                      if (resumableTicketId && onResumeTicket) {
                        onResumeTicket();
                        return;
                      }
                      onContactSupport?.();
                    },
                    disabled: interactionLocked,
                    "aria-busy": interactionLocked,
                    style: {
                      flexShrink: 0,
                      background: "rgba(255,255,255,0.2)",
                      border: "1px solid rgba(255,255,255,0.5)",
                      color: "white",
                      borderRadius: 999,
                      padding: "8px 14px",
                      fontSize: headerSubSize,
                      fontWeight: 600,
                      cursor: interactionLocked ? "not-allowed" : "pointer",
                      opacity: interactionLocked ? 0.55 : 1
                    },
                    children: interactionLocked ? "Please wait\u2026" : resumableTicketId ? "Resume agent chat" : "Talk to agent"
                  }
                ) : null,
                onClose ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(WidgetCloseButton, { onClose }) : null
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
      "div",
      {
        style: {
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflowY: "auto"
        },
        children: [
          showWelcomePanel ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(WelcomeMessagePanel, { themeSettings, compact: true }) : null,
          showInlineFaqs ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            FaqListPanel,
            {
              styles,
              faqs,
              themeSettings,
              onSelectFAQ,
              disabled: interactionLocked,
              compact: true
            }
          ) : /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              MessageList,
              {
                styles: layoutStyles,
                messages,
                showTyping,
                messagesEndRef,
                themeSettings,
                apiBaseUrl,
                hideEmptyPlaceholder: showWelcomePanel
              }
            ),
            showResolvedActions && ratingSubmitted ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
              "p",
              {
                style: {
                  margin: "8px 16px 0",
                  fontSize: 13,
                  color: isDark ? "#86efac" : "#047857",
                  textAlign: "center"
                },
                children: "Thanks for your feedback!"
              }
            ) : null,
            showResolvedActions ? /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
              "div",
              {
                style: {
                  padding: "12px 16px 0",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  alignItems: "center"
                },
                children: [
                  !allowResolvedReply && onContinueResolvedConversation ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                    "button",
                    {
                      type: "button",
                      onClick: onContinueResolvedConversation,
                      style: {
                        border: `1px solid ${themeSettings.primaryColor ?? "#006D77"}`,
                        borderRadius: 999,
                        padding: "10px 20px",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        color: themeSettings.primaryColor ?? "#006D77",
                        background: "transparent"
                      },
                      children: "Continue this conversation"
                    }
                  ) : null,
                  onStartNewConversation ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                    "button",
                    {
                      type: "button",
                      onClick: onStartNewConversation,
                      style: {
                        border: "none",
                        borderRadius: 999,
                        padding: "10px 20px",
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: "pointer",
                        color: "#fff",
                        background: themeSettings.primaryColor ?? "#006D77"
                      },
                      children: "Start new conversation"
                    }
                  ) : null
                ]
              }
            ) : null
          ] }),
          helpOpen && !showInlineFaqs ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "div",
            {
              style: {
                position: "absolute",
                inset: 0,
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                background: isDark ? "#2b2b2b" : "#f8f8f8",
                boxShadow: isDark ? "0 -4px 24px rgba(0,0,0,0.45)" : "0 -4px 24px rgba(0,0,0,0.08)"
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                FaqListPanel,
                {
                  styles,
                  faqs,
                  themeSettings,
                  onSelectFAQ,
                  disabled: interactionLocked,
                  compact: true
                }
              )
            }
          ) : null
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
      "div",
      {
        style: {
          flexShrink: 0,
          background: isDark ? "#2b2b2b" : "#f8f8f8",
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
          padding: "10px 16px 0"
        },
        children: [
          showRatingPrompt && onRatingSubmit && onRatingSkip ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            ConversationRatingPrompt,
            {
              themeSettings,
              busy: ratingBusy,
              onSubmit: onRatingSubmit,
              onSkip: onRatingSkip
            }
          ) : null,
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: { marginBottom: showComposer && !helpOpen ? 10 : 0 }, children: showHelpChip ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            HelpChip,
            {
              active: helpOpen,
              disabled: interactionLocked && !helpOpen,
              onClick: () => onHelpOpenChange(!helpOpen),
              themeSettings
            }
          ) : null }),
          showComposer && !helpOpen ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            InputArea,
            {
              styles: layoutStyles,
              text,
              setText,
              onSend,
              loading: Boolean(showTyping || sending || interactionLocked),
              themeSettings
            }
          ) : helpOpen ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: { height: 16 }, "aria-hidden": true }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { style: { height: 8 }, "aria-hidden": true })
        ]
      }
    )
  ] });
}

// src/components/PreChatScreen.tsx
var import_react5 = require("react");

// src/lib/email.ts
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
var INVALID_EMAIL_MESSAGE = "Please enter a valid email address";
var REQUIRED_EMAIL_MESSAGE = "Email is required";

// src/components/PreChatScreen.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
function PreChatScreen({
  styles,
  themeSettings,
  onContinue,
  busy,
  error,
  onClose
}) {
  const [name, setName] = (0, import_react5.useState)("");
  const [email, setEmail] = (0, import_react5.useState)("");
  const [localError, setLocalError] = (0, import_react5.useState)(null);
  const { headline, subtitle } = resolveWelcomeCopy(themeSettings, { preChat: true });
  const headerFontSize = widgetPrechatHeadlineSize(themeSettings?.fontSizeBase);
  const bodyFontSize = widgetPrechatSubtitleSize(themeSettings?.fontSizeBase);
  const shownError = localError || error || null;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { style: styles.welcomeScreen, className: "chat-widget-prechat", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: styles.welcomeHeader, className: "chat-widget-welcome-header", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
      "div",
      {
        style: {
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "flex-start",
          gap: 12
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              "h2",
              {
                style: {
                  margin: 0,
                  fontSize: headerFontSize,
                  fontWeight: 700,
                  marginBottom: 6,
                  lineHeight: 1.3
                },
                children: headline
              }
            ),
            subtitle ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              "p",
              {
                style: {
                  margin: 0,
                  fontSize: bodyFontSize,
                  opacity: 0.95,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap"
                },
                children: subtitle
              }
            ) : null
          ] }),
          onClose ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(WidgetCloseButton, { onClose }) : null
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      "div",
      {
        className: "chat-widget-prechat-body",
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          width: "100%",
          padding: "0 24px 24px",
          boxSizing: "border-box"
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: styles.faqContainer, className: "chat-widget-faq-container", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
          "form",
          {
            onSubmit: async (e) => {
              e.preventDefault();
              const trimmed = email.trim();
              if (!trimmed) {
                setLocalError(REQUIRED_EMAIL_MESSAGE);
                return;
              }
              if (!isValidEmail(trimmed)) {
                setLocalError(INVALID_EMAIL_MESSAGE);
                return;
              }
              setLocalError(null);
              await onContinue({ email: trimmed, name: name.trim() });
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { style: { marginBottom: 12 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("label", { style: styles.formLabel, children: "Name" }),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                  "input",
                  {
                    className: "chat-widget-form-input",
                    style: styles.formInput,
                    placeholder: "Your name",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    autoComplete: "name"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { style: { marginBottom: 16 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("label", { style: styles.formLabel, children: "Email" }),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                  "input",
                  {
                    className: "chat-widget-form-input",
                    style: styles.formInput,
                    placeholder: "you@example.com",
                    type: "email",
                    required: true,
                    value: email,
                    onChange: (e) => {
                      setEmail(e.target.value);
                      if (localError) setLocalError(null);
                    },
                    autoComplete: "email"
                  }
                )
              ] }),
              shownError ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                "p",
                {
                  role: "alert",
                  style: {
                    margin: "0 0 12px",
                    color: "#f87171",
                    fontSize: 13,
                    textAlign: "center"
                  },
                  children: shownError
                }
              ) : null,
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { style: { display: "flex", justifyContent: "flex-end" }, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                "button",
                {
                  type: "submit",
                  disabled: busy,
                  style: {
                    ...styles.sendPill,
                    opacity: busy ? 0.7 : 1,
                    pointerEvents: busy ? "none" : void 0
                  },
                  children: busy ? "Please wait\u2026" : "Continue"
                }
              ) })
            ]
          }
        ) })
      }
    )
  ] });
}

// src/components/EscalateScreen.tsx
var import_react6 = require("react");
var import_lucide_react8 = require("lucide-react");
var import_jsx_runtime14 = require("react/jsx-runtime");
function EscalateScreen({
  styles,
  themeSettings,
  title,
  onBack,
  onSubmit,
  busy,
  collectIdentity,
  initialEmail,
  initialName,
  initialSummary,
  onClose
}) {
  const [subject, setSubject] = (0, import_react6.useState)("");
  const [summary, setSummary] = (0, import_react6.useState)(initialSummary ?? "");
  const [email, setEmail] = (0, import_react6.useState)(initialEmail ?? "");
  const [name, setName] = (0, import_react6.useState)(initialName ?? "");
  const [localError, setLocalError] = (0, import_react6.useState)(null);
  const formFontSize = widgetFormFontSize(themeSettings.fontSizeBase);
  const headerSubSize = widgetHeaderSubFontSize(themeSettings.fontSizeBase);
  const canSubmit = !busy && subject.trim().length >= 3 && summary.trim().length >= 3 && (!collectIdentity || Boolean(email.trim()));
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: styles.chatScreen, children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: styles.header, className: "chat-widget-sheet-header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          "button",
          {
            type: "button",
            onClick: onBack,
            style: {
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              borderRadius: 8,
              padding: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_lucide_react8.ArrowLeft, { size: 20 })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            "div",
            {
              style: {
                fontWeight: 600,
                fontSize: themeSettings?.fontSizeBase ? themeSettings.fontSizeBase / 2 + 4 : 16
              },
              children: title
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            "div",
            {
              style: {
                fontSize: headerSubSize,
                opacity: 0.9
              },
              children: "Contact support"
            }
          )
        ] })
      ] }),
      onClose ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(WidgetCloseButton, { onClose }) : null
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
      "div",
      {
        style: {
          flex: 1,
          overflowY: "auto",
          padding: 20,
          color: themeSettings?.isDarkMode ? "#f1f5f9" : "#1e293b"
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            "p",
            {
              style: {
                margin: "0 0 12px",
                fontSize: formFontSize,
                lineHeight: 1.5
              },
              children: collectIdentity ? "Please leave your email address so we can contact you:" : "Describe your issue. Our team can continue by email if no agent is available."
            }
          ),
          collectIdentity ? /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_jsx_runtime14.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { marginBottom: 10 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { style: styles.formLabel, children: "Name (optional)" }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                "input",
                {
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  className: "chat-widget-form-input",
                  style: styles.formInput,
                  placeholder: "Enter name"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { marginBottom: 10 }, children: [
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { style: styles.formLabel, children: "Email Address" }),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                "input",
                {
                  type: "email",
                  required: true,
                  value: email,
                  onChange: (e) => {
                    setEmail(e.target.value);
                    if (localError) setLocalError(null);
                  },
                  className: "chat-widget-form-input",
                  style: styles.formInput,
                  placeholder: "Enter email address"
                }
              )
            ] })
          ] }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { marginBottom: 10 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { style: styles.formLabel, children: "Subject" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              "input",
              {
                value: subject,
                onChange: (e) => setSubject(e.target.value),
                className: "chat-widget-form-input",
                style: styles.formInput,
                placeholder: "Enter subject for query",
                maxLength: 200
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { style: { marginBottom: 4 }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("label", { style: styles.formLabel, children: "Query" }),
            /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              "textarea",
              {
                value: summary,
                onChange: (e) => setSummary(e.target.value),
                rows: 5,
                className: "chat-widget-form-input",
                style: {
                  ...styles.formTextarea,
                  width: "100%",
                  minHeight: 120,
                  fontSize: formFontSize
                },
                placeholder: "Enter the issue you're facing",
                maxLength: 5e3
              }
            )
          ] }),
          localError ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            "p",
            {
              role: "alert",
              style: {
                margin: "10px 0 0",
                color: "#f87171",
                fontSize: 13,
                textAlign: "center"
              },
              children: localError
            }
          ) : null,
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { style: { marginTop: 16, display: "flex", justifyContent: "flex-end" }, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
            "button",
            {
              type: "button",
              disabled: !canSubmit,
              onClick: async () => {
                if (collectIdentity) {
                  const trimmed = email.trim();
                  if (!trimmed) {
                    setLocalError(REQUIRED_EMAIL_MESSAGE);
                    return;
                  }
                  if (!isValidEmail(trimmed)) {
                    setLocalError(INVALID_EMAIL_MESSAGE);
                    return;
                  }
                }
                if (subject.trim().length < 3) {
                  setLocalError("Please enter a subject (at least 3 characters).");
                  return;
                }
                if (summary.trim().length < 3) {
                  setLocalError("Please describe your issue (at least 3 characters).");
                  return;
                }
                setLocalError(null);
                await onSubmit({
                  subject: subject.trim(),
                  summary: summary.trim(),
                  ...collectIdentity ? { email: email.trim(), name: name.trim() || void 0 } : {}
                });
              },
              style: {
                ...styles.sendPill,
                opacity: canSubmit ? 1 : 0.6
              },
              children: busy ? "Sending\u2026" : "Send request"
            }
          ) })
        ]
      }
    )
  ] });
}

// src/lib/build-escalate-transcript.ts
function buildEscalateTranscript(messages) {
  return messages.filter(
    (m) => !m.ticketCreatedNotice && !m.isStaff && !m.isSystem && (m.role === "user" || m.role === "bot") && m.text.trim().length > 0
  ).map((m) => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.text.trim(),
    ...m.sortAt ? { at: m.sortAt } : {}
  }));
}
function lastUserMessageForEscalate(messages) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const m = messages[i];
    if (m.role === "user" && !m.faqLocal && m.text.trim()) {
      return m.text.trim();
    }
  }
  return "";
}

// src/lib/chat-backend.ts
function assertCompleteJwt(token, label = "Token") {
  const t = token.trim();
  const parts = t.split(".");
  if (parts.length !== 3 || parts.some((p) => !p.length)) {
    throw new Error(
      `${label} is not a complete JWT. Copy the full \`projectToken\` from the admin Projects screen (one long string with two dots, e.g. xxxxx.yyyyy.zzzzz \u2014 not just the first segment).`
    );
  }
}
async function postChatCompletion(params) {
  if (params.projectToken?.trim()) {
    assertCompleteJwt(params.projectToken, "VITE_PROJECT_TOKEN");
  }
  const base = params.apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: params.message,
      ...params.history?.length ? { history: params.history } : {},
      ...params.projectToken ? { token: params.projectToken } : {
        siteName: params.siteName ?? "N/A",
        websiteDescription: params.websiteDescription ?? "N/A"
      }
    })
  });
  const body = await res.json();
  if (!res.ok || body.success === false) {
    throw new Error(
      typeof body.message === "string" && body.message ? body.message : `Chat request failed (${res.status})`
    );
  }
  const d = body.data;
  if (typeof d === "string") return d;
  return String(d ?? "");
}

// src/lib/widget-config.ts
var FONT_SIZES = /* @__PURE__ */ new Set([23, 24, 26, 28]);
var POSITIONS = /* @__PURE__ */ new Set([
  "bottom-right",
  "bottom-left",
  "top-right",
  "top-left"
]);
var WidgetConfigError = class extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.name = "WidgetConfigError";
    this.status = status;
  }
};
function isWidgetConfigHardFailure(err) {
  if (err instanceof WidgetConfigError) {
    return err.status === 401 || err.status === 403;
  }
  const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
  return msg.includes("inactive") || msg.includes("no longer available") || msg.includes("has been removed") || msg.includes("not authorized") || msg.includes("invalid or revoked") || msg.includes("invalid or expired");
}
var DEFAULT_CAPABILITIES = {
  aiChatEnabled: true,
  agentSupportEnabled: true
};
function parseCapabilities(raw) {
  if (!raw || typeof raw !== "object") return DEFAULT_CAPABILITIES;
  const c = raw;
  return {
    aiChatEnabled: c.aiChatEnabled !== false,
    agentSupportEnabled: c.agentSupportEnabled !== false
  };
}
function parseFaqList(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const question = typeof item.question === "string" ? item.question.trim() : "";
    const ans = typeof item.ans === "string" ? item.ans.trim() : "";
    if (question && ans) out.push({ question, ans });
  }
  return out;
}
function parseAppearanceAttributes(a) {
  const out = {};
  if (typeof a.botName === "string" && a.botName.trim()) out.botName = a.botName.trim();
  if (typeof a.greetingMessage === "string") out.greetingMessage = a.greetingMessage;
  if (typeof a.isDarkMode === "boolean") out.isDarkMode = a.isDarkMode;
  if (typeof a.primaryColor === "string") out.primaryColor = a.primaryColor;
  if (typeof a.secondaryColor === "string") out.secondaryColor = a.secondaryColor;
  if (typeof a.isGradient === "boolean") out.isGradient = a.isGradient;
  const fontSizeBase = a.fontSizeBase;
  if (typeof fontSizeBase === "number" && FONT_SIZES.has(fontSizeBase)) {
    out.fontSizeBase = fontSizeBase;
  }
  const position = a.position;
  if (typeof a.position === "string" && POSITIONS.has(position)) {
    out.position = position;
  }
  if (typeof a.botAvatarUrl === "string" && a.botAvatarUrl.trim()) {
    out.botAvatarUrl = a.botAvatarUrl.trim();
  }
  return out;
}
async function fetchWidgetConfig(apiBaseUrl, projectToken) {
  assertCompleteJwt(projectToken, "projectToken");
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/v1/appearance/widget-config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: projectToken.trim() })
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    const status = res.status;
    const serverMsg = typeof json.message === "string" && json.message ? json.message : "";
    if (status === 403) {
      throw new WidgetConfigError(
        serverMsg || "This organisation is inactive. The chat widget is not available right now.",
        status
      );
    }
    if (status === 401) {
      throw new WidgetConfigError(
        serverMsg || "Project token is invalid or expired. Copy a fresh token from Admin \u2192 Projects.",
        status
      );
    }
    if (status === 503) {
      throw new WidgetConfigError(
        serverMsg || "Server cannot reach the database right now. Check MongoDB Atlas and your network, then refresh.",
        status
      );
    }
    throw new WidgetConfigError(serverMsg || `Widget config failed (${status})`, status);
  }
  const data = json.data;
  const attrs = data?.attributes ?? {};
  const appearance = parseAppearanceAttributes(attrs);
  const fromMeta = parseFaqList(json.meta?.faqs);
  const fromAttrs = parseFaqList(attrs.faqs);
  const faqs = fromMeta.length > 0 ? fromMeta : fromAttrs;
  const capabilities = parseCapabilities(
    json.meta?.capabilities
  );
  return { appearance, faqs, capabilities };
}

// src/widget-visitor-api.ts
function readEnvelope(json) {
  const data = json.data;
  const attrs = data?.attributes ?? {};
  const accessToken = attrs.accessToken;
  if (typeof accessToken !== "string" || !accessToken) {
    throw new Error("Unexpected response from server");
  }
  return {
    message: typeof json.message === "string" ? json.message : "OK",
    accessToken,
    ticketId: attrs.ticketId ?? null,
    email: typeof attrs.email === "string" ? attrs.email : void 0,
    name: typeof attrs.name === "string" ? attrs.name : void 0
  };
}
function apiErrorMessage(json, fallback) {
  const errors = json.errors;
  if (errors && typeof errors === "object" && !Array.isArray(errors)) {
    const map = errors;
    if (typeof map.email === "string" && map.email.trim()) return map.email.trim();
    const first = Object.values(map).find(
      (v) => typeof v === "string" && v.trim() && v.trim().toLowerCase() !== "validation error"
    );
    if (typeof first === "string") return first.trim();
  }
  if (typeof json.message === "string" && json.message.trim()) {
    const msg = json.message.trim();
    if (msg.toLowerCase() !== "validation error") return msg;
  }
  return fallback;
}
async function postVisitorIdentify(apiBaseUrl, body) {
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/v1/chat-bot/auth/identify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email.trim(),
      ...body.name?.trim() ? { name: body.name.trim() } : {},
      ...body.projectToken?.trim() ? { token: body.projectToken.trim() } : {}
    })
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(apiErrorMessage(json, `Identify failed (${res.status})`));
  }
  return readEnvelope(json);
}
function parseTicketMessages(json) {
  const data = json.data;
  const rows = Array.isArray(data) ? data : data ? [data] : [];
  return rows.map((row) => {
    const r = row;
    const attrs = r.attributes ?? {};
    const role = attrs.senderRole;
    return {
      id: String(r.id ?? ""),
      senderRole: role === "visitor" || role === "staff" || role === "bot" || role === "system" ? role : "unknown",
      senderLabel: typeof attrs.senderLabel === "string" ? attrs.senderLabel : "Support",
      senderAvatar: typeof attrs.senderAvatar === "string" && attrs.senderAvatar.trim() ? attrs.senderAvatar.trim() : null,
      text: typeof attrs.text === "string" ? attrs.text : "",
      createdAt: typeof attrs.createdAt === "string" ? attrs.createdAt : null
    };
  });
}
async function listVisitorTicketMessages(apiBaseUrl, ticketId, accessToken) {
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(
    `${base}/api/v1/chat-bot/auth/ticket/${encodeURIComponent(ticketId)}/messages`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message ? json.message : `Could not load conversation (${res.status})`
    );
  }
  return parseTicketMessages(json);
}
function parseVisitorTicketSummary(json) {
  const data = json.data;
  const attrs = data?.attributes ?? {};
  return {
    id: String(data?.id ?? ""),
    status: typeof attrs.status === "string" ? attrs.status : "open",
    rating: typeof attrs.rating === "number" && !Number.isNaN(attrs.rating) ? attrs.rating : null,
    ratedAt: typeof attrs.ratedAt === "string" ? attrs.ratedAt : null,
    canRate: attrs.canRate === true,
    hasAssignedAgent: attrs.hasAssignedAgent === true
  };
}
async function getVisitorTicket(apiBaseUrl, ticketId, accessToken) {
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(
    `${base}/api/v1/chat-bot/auth/ticket/${encodeURIComponent(ticketId)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message ? json.message : `Could not load conversation (${res.status})`
    );
  }
  return parseVisitorTicketSummary(json);
}
async function postVisitorTicketRating(apiBaseUrl, ticketId, accessToken, rating, comment) {
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(
    `${base}/api/v1/chat-bot/auth/ticket/${encodeURIComponent(ticketId)}/rating`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        rating,
        ...comment?.trim() ? { comment: comment.trim() } : {}
      })
    }
  );
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message ? json.message : `Could not submit rating (${res.status})`
    );
  }
  return parseVisitorTicketSummary(json);
}
async function postVisitorTicketMessage(apiBaseUrl, ticketId, accessToken, text) {
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(
    `${base}/api/v1/chat-bot/auth/ticket/${encodeURIComponent(ticketId)}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ text: text.trim() })
    }
  );
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message ? json.message : `Could not send message (${res.status})`
    );
  }
  const list = parseTicketMessages(json);
  if (!list[0]) throw new Error("Unexpected response from server");
  return list[0];
}
async function postVisitorTicketNotice(apiBaseUrl, ticketId, accessToken, kind) {
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(
    `${base}/api/v1/chat-bot/auth/ticket/${encodeURIComponent(ticketId)}/notices`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ kind })
    }
  );
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message ? json.message : `Could not record notice (${res.status})`
    );
  }
  const list = parseTicketMessages(json);
  return list[0] ?? null;
}
async function postVisitorSelfServeTranscript(apiBaseUrl, ticketId, accessToken, transcript) {
  if (!transcript.length) return;
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(
    `${base}/api/v1/chat-bot/auth/ticket/${encodeURIComponent(ticketId)}/self-serve`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ transcript })
    }
  );
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(
      typeof json.message === "string" && json.message ? json.message : `Could not sync self-serve chat (${res.status})`
    );
  }
}
async function postVisitorEscalate(apiBaseUrl, body) {
  assertCompleteJwt(body.projectToken, "projectToken");
  const base = apiBaseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/v1/chat-bot/auth/escalate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email.trim(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      token: body.projectToken,
      ...body.name?.trim() ? { name: body.name.trim() } : {},
      ...body.transcript?.length ? { transcript: body.transcript } : {}
    })
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(apiErrorMessage(json, `Escalate failed (${res.status})`));
  }
  return readEnvelope(json);
}

// src/lib/ticket-thread-ui.ts
function formatTime(iso) {
  if (!iso) {
    return (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function ticketMessageToWidgetMsg(m) {
  const sortAt = m.createdAt ?? (/* @__PURE__ */ new Date()).toISOString();
  const time = formatTime(m.createdAt);
  if (m.senderRole === "system") {
    return {
      id: m.id,
      role: "bot",
      text: m.text,
      time,
      sortAt,
      isSystem: true
    };
  }
  if (m.senderRole === "visitor") {
    return { id: m.id, role: "user", text: m.text, time, sortAt };
  }
  if (m.senderRole === "bot") {
    return {
      id: m.id,
      role: "bot",
      text: m.text,
      senderName: m.senderLabel || "AI Assistant",
      time,
      sortAt,
      isStaff: false,
      senderAvatar: null
    };
  }
  const label = m.senderLabel && m.senderLabel !== "Unknown sender" && m.senderLabel !== "System" ? m.senderLabel : "Support";
  return {
    id: m.id,
    role: "bot",
    text: m.text,
    senderName: parseStaffSenderName(label),
    isStaff: true,
    senderAvatar: m.senderAvatar ?? null,
    time,
    sortAt
  };
}
function faqExchangeToMsgs(exchange) {
  const base = Date.parse(exchange.askedAt) || Date.now();
  const qAt = new Date(base).toISOString();
  const aAt = new Date(base + 1).toISOString();
  return [
    {
      role: "user",
      text: exchange.question,
      time: formatTime(qAt),
      sortAt: qAt,
      faqLocal: true
    },
    {
      role: "bot",
      text: exchange.answer,
      time: formatTime(aAt),
      sortAt: aAt,
      faqLocal: true,
      faqForQuestion: exchange.question
    }
  ];
}
function compareMsgs(a, b) {
  const ta = a.sortAt ?? "";
  const tb = b.sortAt ?? "";
  if (ta !== tb) return ta.localeCompare(tb);
  if (a.isSystem !== b.isSystem) return a.isSystem ? -1 : 1;
  if (a.role !== b.role) return a.role === "user" ? -1 : 1;
  return 0;
}
function messageDedupeKey(m) {
  return `${m.role}|${m.text.trim().toLowerCase()}`;
}
function latestSortAt(messages) {
  let max = "";
  for (const m of messages) {
    const t = m.sortAt ?? "";
    if (t > max) max = t;
  }
  return max;
}
function buildVisitorThread(ticketMsgs, faqExchanges) {
  const faqMsgs = faqExchanges.flatMap(faqExchangeToMsgs);
  return [...ticketMsgs, ...faqMsgs].sort(compareMsgs);
}
var AGENT_ENTER_NOTICE = "You've reached our customer support agent";
var AGENT_EXIT_NOTICE = "You've left customer support";
function modeOfNotice(text) {
  const t = text.trim();
  if (t === AGENT_ENTER_NOTICE) return "enter";
  if (t === AGENT_EXIT_NOTICE) return "exit";
  return null;
}
function lastAgentModeNotice(messages) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const m = messages[i];
    if (!m?.isSystem) continue;
    const mode = modeOfNotice(String(m.text || ""));
    if (mode) return mode;
  }
  return null;
}
function mergeLocalIntoTicketThread(ticketThread, localMsgs) {
  if (!localMsgs.length) return ticketThread;
  const byId = new Set(
    ticketThread.map((m) => m.id).filter((id) => Boolean(id))
  );
  const seenText = new Set(ticketThread.map(messageDedupeKey));
  const ticketTip = latestSortAt(ticketThread);
  const extras = [];
  for (const m of localMsgs) {
    if (m.ticketCreatedNotice) continue;
    if (m.id && byId.has(m.id)) continue;
    if (m.isSystem && modeOfNotice(String(m.text || ""))) continue;
    if (m.localOnly && m.isSystem) continue;
    const key = messageDedupeKey(m);
    if (!m.text.trim()) continue;
    const newerThanTicket = Boolean(m.sortAt && ticketTip && m.sortAt > ticketTip);
    if (seenText.has(key) && !newerThanTicket) continue;
    seenText.add(key);
    extras.push(m);
  }
  if (!extras.length) return ticketThread;
  return dedupeAdjacentModeNotices([...ticketThread, ...extras].sort(compareMsgs));
}
function dedupeAdjacentModeNotices(messages) {
  const out = [];
  for (const m of messages) {
    const mode = m.isSystem ? modeOfNotice(String(m.text || "")) : null;
    if (mode && out.length > 0) {
      const prev = out[out.length - 1];
      if (prev?.isSystem && modeOfNotice(String(prev.text || "")) === mode) {
        continue;
      }
    }
    out.push(m);
  }
  return out;
}
function preservePendingModeNotices(ticketThread, liveMsgs) {
  if (!liveMsgs.length) return ticketThread;
  const byId = new Set(
    ticketThread.map((m) => m.id).filter((id) => Boolean(id))
  );
  const tip = latestSortAt(ticketThread);
  const ticketMode = lastAgentModeNotice(ticketThread);
  const pending = liveMsgs.filter((m) => {
    if (!m.isSystem) return false;
    const mode = modeOfNotice(String(m.text || ""));
    if (!mode) return false;
    if (m.id && byId.has(m.id)) return false;
    if (ticketMode === mode) return false;
    if (!m.id && m.sortAt && tip && m.sortAt <= tip) return false;
    if (!m.id && !m.sortAt) return false;
    return true;
  });
  if (!pending.length) return ticketThread;
  return dedupeAdjacentModeNotices(
    [...ticketThread, ...pending].sort(compareMsgs)
  );
}
function selfServeTurnsSinceLastExit(messages) {
  let start = 0;
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i]?.isSystem && modeOfNotice(String(messages[i].text || "")) === "exit") {
      start = i + 1;
      break;
    }
  }
  return messages.slice(start).filter(
    (m) => !m.isSystem && !m.isStaff && !m.ticketCreatedNotice && (m.role === "user" || m.role === "bot") && m.text.trim().length > 0
  ).map((m) => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.text.trim(),
    ...m.sortAt ? { at: m.sortAt } : {}
  }));
}

// src/lib/faq-transcript.ts
function storageKey(projectToken, ticketId) {
  return `chat-widget-faq-${widgetProjectStorageId(projectToken)}-${ticketId}`;
}
function loadFaqTranscript(projectToken, ticketId) {
  if (typeof window === "undefined" || !ticketId) return [];
  try {
    const raw = sessionStorage.getItem(storageKey(projectToken, ticketId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function appendFaqExchange(projectToken, ticketId, exchange) {
  const list = loadFaqTranscript(projectToken, ticketId);
  list.push(exchange);
  if (typeof window !== "undefined") {
    sessionStorage.setItem(storageKey(projectToken, ticketId), JSON.stringify(list));
  }
  return list;
}
function clearFaqTranscript(projectToken, ticketId) {
  if (typeof window === "undefined" || !ticketId) return;
  sessionStorage.removeItem(storageKey(projectToken, ticketId));
}

// src/lib/self-serve-transcript.ts
function storageKey2(projectToken, email) {
  const e = email.trim().toLowerCase();
  return `chat-widget-conversation-${widgetProjectStorageId(projectToken)}-${e}`;
}
function loadSelfServeTranscript(projectToken, email) {
  if (typeof window === "undefined" || !email?.trim()) return [];
  try {
    const raw = sessionStorage.getItem(storageKey2(projectToken, email));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function saveSelfServeTranscript(projectToken, email, messages) {
  if (typeof window === "undefined" || !email?.trim()) return;
  try {
    sessionStorage.setItem(
      storageKey2(projectToken, email),
      JSON.stringify(messages)
    );
  } catch {
  }
}
function clearSelfServeTranscript(projectToken, email) {
  if (typeof window === "undefined" || !email?.trim()) return;
  sessionStorage.removeItem(storageKey2(projectToken, email));
}

// src/lib/visitor-session.ts
function storageKey3(projectToken) {
  return `chat-widget-visitor-${widgetProjectStorageId(projectToken)}`;
}
function loadVisitorSession(projectToken) {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(storageKey3(projectToken));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}
function saveVisitorSession(visitor, projectToken) {
  if (typeof window === "undefined") return;
  const key = storageKey3(projectToken);
  if (!visitor?.email) {
    sessionStorage.removeItem(key);
    return;
  }
  sessionStorage.setItem(key, JSON.stringify(visitor));
}

// src/lib/widget-visitor-socket.ts
var import_socket = require("socket.io-client");
var socket = null;
var currentToken = null;
var currentBaseUrl = null;
var handlerSets = {
  "receive-message": /* @__PURE__ */ new Set(),
  "ticket-updated": /* @__PURE__ */ new Set()
};
function attachAllHandlers(s) {
  s.off("receive-message");
  s.off("ticket-updated");
  handlerSets["receive-message"].forEach((fn) => s.on("receive-message", fn));
  handlerSets["ticket-updated"].forEach((fn) => s.on("ticket-updated", fn));
}
function ensureVisitorSocket(apiBaseUrl, accessToken) {
  const base = apiBaseUrl.replace(/\/$/, "");
  if (!base || !accessToken) return null;
  if (socket?.connected && currentToken === accessToken && currentBaseUrl === base) {
    return socket;
  }
  socket?.disconnect();
  currentToken = accessToken;
  currentBaseUrl = base;
  socket = (0, import_socket.io)(base, {
    query: { token: accessToken },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 8
  });
  socket.on("connect", () => {
    if (socket) attachAllHandlers(socket);
  });
  attachAllHandlers(socket);
  return socket;
}
function subscribeVisitorSocket(event, handler) {
  handlerSets[event].add(handler);
  return () => {
    handlerSets[event].delete(handler);
  };
}
function disconnectVisitorSocket() {
  socket?.disconnect();
  socket = null;
  currentToken = null;
  currentBaseUrl = null;
  handlerSets["receive-message"].clear();
  handlerSets["ticket-updated"].clear();
}
function visitorTicketSummaryFromSocket(payload) {
  const ticketId = payload.ticketId != null ? String(payload.ticketId) : "";
  if (!ticketId) return null;
  return {
    id: ticketId,
    status: typeof payload.status === "string" ? payload.status : "open",
    rating: typeof payload.rating === "number" && !Number.isNaN(payload.rating) ? payload.rating : null,
    ratedAt: typeof payload.ratedAt === "string" ? payload.ratedAt : null,
    canRate: payload.canRate === true,
    hasAssignedAgent: payload.hasAssignedAgent === true
  };
}

// src/lib/chat-messages.ts
var AI_CHAT_UNAVAILABLE_MESSAGE = "AI chat is currently unavailable. Please use \u201CTalk to agent\u201D in the header to reach our support team.";
var RATE_LIMIT_CHAT_ERROR_MESSAGE = "We're busy right now. Please try again in a moment or contact support.";
var GENERIC_CHAT_ERROR_MESSAGE = "Something went wrong. Please try again in a moment.";
function isAiChatUnavailableError(message) {
  const lower = message.toLowerCase();
  return lower.includes("ai chat is not available") || lower.includes("ai chat is currently unavailable") || lower.includes("not available for this organisation");
}
function isTechnicalChatError(message) {
  const lower = message.toLowerCase();
  return lower.includes("429") || lower.includes("rate limit") || lower.includes("quota") || lower.includes("openai") || lower.includes("api-errors") || lower.includes("exceeded your current") || lower.includes("econnrefused") || lower.includes("fetch failed") || lower.includes("network error") || lower.includes("api key") || lower.includes("incorrect api key") || /\b(500|502|503|504)\b/.test(lower);
}
function userFacingChatError(message) {
  if (isAiChatUnavailableError(message)) return AI_CHAT_UNAVAILABLE_MESSAGE;
  const lower = message.toLowerCase();
  if (lower.includes("429") || lower.includes("rate limit") || lower.includes("quota") || lower.includes("exceeded your current")) {
    return RATE_LIMIT_CHAT_ERROR_MESSAGE;
  }
  if (isTechnicalChatError(message)) return GENERIC_CHAT_ERROR_MESSAGE;
  return message.trim() || GENERIC_CHAT_ERROR_MESSAGE;
}

// src/lib/widget-position.ts
function widgetPositionClass(position) {
  switch (position ?? "bottom-right") {
    case "bottom-left":
      return "bl";
    case "top-right":
      return "tr";
    case "top-left":
      return "tl";
    case "bottom-right":
    default:
      return "br";
  }
}

// src/lib/dismissed-tickets.ts
function storageKey4(projectToken) {
  return `chat-widget-dismissed-tickets-${widgetProjectStorageId(projectToken)}`;
}
function readSet(projectToken) {
  if (typeof window === "undefined") return /* @__PURE__ */ new Set();
  try {
    const raw = sessionStorage.getItem(storageKey4(projectToken));
    if (!raw) return /* @__PURE__ */ new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.map(String)) : /* @__PURE__ */ new Set();
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function writeSet(projectToken, ids) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(storageKey4(projectToken), JSON.stringify([...ids]));
}
function isTicketDismissed(projectToken, ticketId) {
  return readSet(projectToken).has(String(ticketId));
}
function dismissTicket(projectToken, ticketId) {
  const ids = readSet(projectToken);
  ids.add(String(ticketId));
  writeSet(projectToken, ids);
}

// src/lib/widget-api-base.ts
function resolveWidgetApiBase(apiBaseUrl) {
  if (typeof apiBaseUrl !== "string") return void 0;
  return apiBaseUrl.replace(/\/$/, "");
}
function hasWidgetApiBase(apiBaseUrl) {
  return typeof apiBaseUrl === "string";
}

// src/ChatWidget.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
function ChatWidget({
  title = "AI Chatbot",
  faqs: faqsProp,
  placeholder = "Type message here...",
  sendMessage,
  apiBaseUrl,
  projectToken,
  visitorGate,
  themeSettings: themeSettingsProp
}) {
  const apiBase = resolveWidgetApiBase(apiBaseUrl);
  const hasApi = hasWidgetApiBase(apiBaseUrl);
  const gateDefault = Boolean(hasApi && projectToken?.trim());
  const visitorGateEffective = visitorGate !== void 0 ? visitorGate : gateDefault;
  const [open, setOpen] = (0, import_react7.useState)(false);
  const [view, setView] = (0, import_react7.useState)(() => {
    if (!visitorGateEffective) return "welcome";
    return "prechat";
  });
  const [helpOpen, setHelpOpen] = (0, import_react7.useState)(false);
  const [messages, setMessages] = (0, import_react7.useState)([]);
  const [text, setText] = (0, import_react7.useState)("");
  const [awaitingBot, setAwaitingBot] = (0, import_react7.useState)(false);
  const [sending, setSending] = (0, import_react7.useState)(false);
  const [visitor, setVisitor] = (0, import_react7.useState)(null);
  const [prechatBusy, setPrechatBusy] = (0, import_react7.useState)(false);
  const [prechatError, setPrechatError] = (0, import_react7.useState)(null);
  const [escalateBusy, setEscalateBusy] = (0, import_react7.useState)(false);
  const [remoteFaqs, setRemoteFaqs] = (0, import_react7.useState)(null);
  const [capabilities, setCapabilities] = (0, import_react7.useState)({
    aiChatEnabled: true,
    agentSupportEnabled: true
  });
  const [ticketSummary, setTicketSummary] = (0, import_react7.useState)(null);
  const [ratingBusy, setRatingBusy] = (0, import_react7.useState)(false);
  const [ratingSkipped, setRatingSkipped] = (0, import_react7.useState)(false);
  const [allowResolvedReply, setAllowResolvedReply] = (0, import_react7.useState)(false);
  const [widgetUnavailable, setWidgetUnavailable] = (0, import_react7.useState)(null);
  const [configReady, setConfigReady] = (0, import_react7.useState)(() => {
    const needsRemoteConfig = Boolean(
      hasWidgetApiBase(apiBaseUrl) && projectToken?.trim()
    );
    return !needsRemoteConfig;
  });
  const [sessionReady, setSessionReady] = (0, import_react7.useState)(!visitorGateEffective);
  const [inTicketThread, setInTicketThread] = (0, import_react7.useState)(false);
  const interactionLockRef = (0, import_react7.useRef)(false);
  const [interactionLocked, setInteractionLocked] = (0, import_react7.useState)(false);
  const acquireInteractionLock = (0, import_react7.useCallback)(() => {
    if (interactionLockRef.current) return false;
    interactionLockRef.current = true;
    setInteractionLocked(true);
    return true;
  }, []);
  const releaseInteractionLock = (0, import_react7.useCallback)(() => {
    interactionLockRef.current = false;
    setInteractionLocked(false);
  }, []);
  const handleHelpOpenChange = (0, import_react7.useCallback)((open2) => {
    if (open2 && interactionLockRef.current) return;
    setHelpOpen(open2);
  }, []);
  const [themeSettings, setThemeSettings] = (0, import_react7.useState)({
    isDarkMode: false,
    primaryColor: "#006D77",
    secondaryColor: "#006D7738",
    fontSizeBase: 28,
    isGradient: false,
    position: "bottom-right"
  });
  (0, import_react7.useEffect)(() => {
    if (!themeSettingsProp) return;
    setThemeSettings((prev) => ({ ...prev, ...themeSettingsProp }));
  }, [themeSettingsProp]);
  const themeSettingsPropRef = (0, import_react7.useRef)(themeSettingsProp);
  themeSettingsPropRef.current = themeSettingsProp;
  (0, import_react7.useEffect)(() => {
    const tok = projectToken?.trim();
    if (!hasApi || apiBase === void 0 || !tok) {
      setConfigReady(true);
      setWidgetUnavailable(null);
      return;
    }
    let cancelled = false;
    setConfigReady(false);
    setWidgetUnavailable(null);
    const applyConfig = async (opts) => {
      const initial = opts?.initial === true;
      try {
        const config = await fetchWidgetConfig(apiBase, tok);
        if (cancelled) return;
        setThemeSettings((prev) => ({
          ...prev,
          ...config.appearance,
          ...themeSettingsPropRef.current ?? {}
        }));
        setRemoteFaqs(config.faqs);
        setCapabilities(config.capabilities);
        setWidgetUnavailable(null);
        setConfigReady(true);
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        if (initial || isWidgetConfigHardFailure(err)) {
          setRemoteFaqs([]);
          setWidgetUnavailable(msg || "Widget configuration unavailable");
          setConfigReady(false);
          setOpen(false);
        }
        console.warn(
          "[ChatWidget] Could not load widget config (appearance + FAQs). Check API URL, project embed token, project domain vs site origin, and that the backend is running.",
          err
        );
      }
    };
    void applyConfig({ initial: true });
    const intervalId = window.setInterval(() => {
      void applyConfig({ initial: false });
    }, 6e4);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void applyConfig({ initial: false });
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [apiBase, hasApi, projectToken]);
  const faqs = (0, import_react7.useMemo)(() => {
    if (faqsProp && faqsProp.length > 0) return faqsProp;
    return remoteFaqs ?? [];
  }, [faqsProp, remoteFaqs]);
  const panelRef = (0, import_react7.useRef)(null);
  const messagesEndRef = (0, import_react7.useRef)(null);
  const visitorRef = (0, import_react7.useRef)(visitor);
  visitorRef.current = visitor;
  const messagesRef = (0, import_react7.useRef)(messages);
  messagesRef.current = messages;
  const persistConversationRef = (0, import_react7.useRef)(true);
  const hasAiBackend = Boolean(sendMessage);
  const aiChatAvailable = capabilities.aiChatEnabled && hasAiBackend;
  const agentAvailable = Boolean(
    capabilities.agentSupportEnabled && hasApi && projectToken?.trim()
  );
  const activeTicketId = visitor?.ticketId ?? null;
  const viewingTicketThread = Boolean(activeTicketId && inTicketThread);
  const resumableTicketId = agentAvailable && activeTicketId && !inTicketThread ? activeTicketId : null;
  const canEscalate = Boolean(agentAvailable && !activeTicketId);
  const hasAnyWidgetSurface = faqs.length > 0 || aiChatAvailable || agentAvailable || Boolean(activeTicketId);
  const visitorAccessToken = visitor?.accessToken ?? null;
  const ticketSyncInFlightRef = (0, import_react7.useRef)(false);
  const ticketSyncQueuedRef = (0, import_react7.useRef)(false);
  const ticketSummaryRef = (0, import_react7.useRef)(ticketSummary);
  ticketSummaryRef.current = ticketSummary;
  const ticketSyncWantSummaryRef = (0, import_react7.useRef)(false);
  const ratingSkipStorageKey = (0, import_react7.useCallback)(
    (ticketId) => {
      return `chat-widget-rating-skipped-${widgetProjectStorageId(projectToken)}-${ticketId}`;
    },
    [projectToken]
  );
  const syncTicketThread = (0, import_react7.useCallback)(async (opts) => {
    const tid = visitorRef.current?.ticketId;
    const token = visitorRef.current?.accessToken;
    if (apiBase === void 0 || !tid || !token) return;
    if (opts?.refreshSummary) ticketSyncWantSummaryRef.current = true;
    if (ticketSyncInFlightRef.current) {
      ticketSyncQueuedRef.current = true;
      return;
    }
    ticketSyncInFlightRef.current = true;
    try {
      const wantSummary = ticketSyncWantSummaryRef.current || ticketSummaryRef.current == null;
      ticketSyncWantSummaryRef.current = false;
      const [rows, summary] = await Promise.all([
        listVisitorTicketMessages(apiBase, tid, token),
        wantSummary ? getVisitorTicket(apiBase, tid, token) : Promise.resolve(null)
      ]);
      const liveBeforeSync = messagesRef.current;
      const ticketMsgs = dedupeAdjacentModeNotices(
        rows.map(ticketMessageToWidgetMsg)
      );
      const faqExchanges = loadFaqTranscript(projectToken, tid);
      const ticketThread = preservePendingModeNotices(
        buildVisitorThread(ticketMsgs, faqExchanges),
        liveBeforeSync
      );
      const stored = loadSelfServeTranscript(
        projectToken,
        visitorRef.current?.email
      );
      const memory = messagesRef.current;
      const localMsgs = memory.length && stored.length ? mergeLocalIntoTicketThread(stored, memory) : memory.length ? memory : stored;
      const merged = mergeLocalIntoTicketThread(ticketThread, localMsgs);
      const thread = withTicketCreatedNotice(
        preservePendingModeNotices(
          dedupeAdjacentModeNotices(merged),
          messagesRef.current
        ),
        projectToken,
        String(tid),
        () => (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      setMessages(thread);
      saveSelfServeTranscript(
        projectToken,
        visitorRef.current?.email,
        thread
      );
      if (summary) setTicketSummary(summary);
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
  (0, import_react7.useEffect)(() => {
    if (!activeTicketId) {
      setTicketSummary(null);
      setRatingSkipped(false);
      setAllowResolvedReply(false);
      return;
    }
    const skipped = typeof window !== "undefined" && sessionStorage.getItem(ratingSkipStorageKey(activeTicketId)) === "1";
    setRatingSkipped(skipped);
  }, [activeTicketId, ratingSkipStorageKey]);
  (0, import_react7.useEffect)(() => {
    if (ticketSummary?.status !== "resolved") {
      setAllowResolvedReply(false);
    }
  }, [ticketSummary?.status]);
  (0, import_react7.useEffect)(() => {
    if (!visitorGateEffective) {
      setSessionReady(true);
      return;
    }
    let cancelled = false;
    setSessionReady(false);
    async function hydrateVisitorSession() {
      disconnectVisitorSocket();
      persistConversationRef.current = false;
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
        persistConversationRef.current = true;
        setSessionReady(true);
        return;
      }
      const tok = projectToken?.trim();
      let profile = {
        email: stored.email,
        name: stored.name,
        accessToken: stored.accessToken,
        ticketId: null
      };
      if (apiBase !== void 0 && tok) {
        try {
          const r = await postVisitorIdentify(apiBase, {
            email: stored.email,
            name: stored.name || void 0,
            projectToken: tok
          });
          profile = {
            email: r.email ?? stored.email,
            name: r.name ?? stored.name,
            accessToken: r.accessToken,
            ticketId: r.ticketId ?? null
          };
          if (profile.ticketId && isTicketDismissed(projectToken, profile.ticketId)) {
            profile.ticketId = null;
          }
        } catch {
          profile = {
            email: stored.email,
            name: stored.name,
            accessToken: stored.accessToken,
            ticketId: null
          };
        }
      }
      if (cancelled) return;
      setVisitor(profile);
      visitorRef.current = profile;
      saveVisitorSession(profile, projectToken);
      setInTicketThread(false);
      const restored = loadSelfServeTranscript(projectToken, profile.email);
      setMessages(restored);
      setView("main");
      setHelpOpen(false);
      if (apiBase !== void 0 && profile.ticketId && profile.accessToken) {
        try {
          const summary = await getVisitorTicket(
            apiBase,
            profile.ticketId,
            profile.accessToken
          );
          if (cancelled) return;
          setTicketSummary(summary);
          const stillInAgentMode = summary.status !== "resolved" && lastAgentModeNotice(restored) === "enter";
          if (summary.canRate || stillInAgentMode) {
            setRatingSkipped(false);
            setInTicketThread(true);
          }
        } catch {
        }
      }
      persistConversationRef.current = true;
      setSessionReady(true);
    }
    void hydrateVisitorSession();
    return () => {
      cancelled = true;
      disconnectVisitorSocket();
    };
  }, [visitorGateEffective, projectToken, apiBase]);
  (0, import_react7.useEffect)(() => {
    if (visitor) {
      saveVisitorSession(visitor, projectToken);
    }
  }, [visitor, projectToken]);
  (0, import_react7.useEffect)(() => {
    if (!persistConversationRef.current || !sessionReady) return;
    const email = visitorRef.current?.email;
    if (!email) return;
    saveSelfServeTranscript(projectToken, email, messages);
  }, [messages, sessionReady, projectToken]);
  (0, import_react7.useEffect)(() => {
    if (!sessionReady || !open || view !== "main" || !viewingTicketThread || !visitorAccessToken) return;
    void syncTicketThread();
    const id = window.setInterval(() => {
      void syncTicketThread();
    }, 12e3);
    return () => window.clearInterval(id);
  }, [sessionReady, open, view, viewingTicketThread, visitorAccessToken, syncTicketThread]);
  (0, import_react7.useEffect)(() => {
    const token = visitorAccessToken;
    if (apiBase === void 0 || !apiBase || !token) return;
    ensureVisitorSocket(apiBase, token);
    const unsubMsg = subscribeVisitorSocket("receive-message", (payload) => {
      const tid = visitorRef.current?.ticketId;
      const incomingTicketId = payload.ticketId != null ? String(payload.ticketId) : null;
      if (!tid || incomingTicketId && incomingTicketId !== tid) return;
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
            setInTicketThread(true);
            setHelpOpen(false);
            setView("main");
            void syncTicketThread();
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
  const collectIdentityOnEscalate = (0, import_react7.useMemo)(
    () => !visitor || !visitor.email,
    [visitor]
  );
  (0, import_react7.useEffect)(() => {
    function onDocClick(e) {
      if (!open) return;
      if (typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches) {
        return;
      }
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) {
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
  (0, import_react7.useEffect)(() => {
    if (!open || typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 640px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
  (0, import_react7.useEffect)(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, awaitingBot]);
  (0, import_react7.useEffect)(() => {
    if (!agentAvailable && view === "escalate") {
      setHelpOpen(false);
      setView(visitorGateEffective ? "main" : "welcome");
    }
  }, [agentAvailable, view, visitorGateEffective]);
  const nowTime = () => (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  function matchFaqAnswer(userText) {
    const q = userText.trim().toLowerCase();
    if (!q) return null;
    const exact = faqs.find((f) => f.question.toLowerCase() === q);
    if (exact) return exact.ans;
    const partial = faqs.find((f) => q.includes(f.question.toLowerCase()));
    return partial?.ans ?? null;
  }
  async function handleSend(e) {
    e?.preventDefault();
    if (!text.trim() || interactionLockRef.current) return;
    setHelpOpen(false);
    const tid = visitor?.ticketId;
    const token = visitor?.accessToken;
    const awaitingRating = ticketSummary?.status === "resolved" && ticketSummary?.canRate && !ratingSkipped;
    if (awaitingRating) {
      return;
    }
    if (!acquireInteractionLock()) return;
    try {
      if (apiBase !== void 0 && inTicketThread && tid && token) {
        const body = text.trim();
        const sentAt2 = (/* @__PURE__ */ new Date()).toISOString();
        setText("");
        const userMsg2 = {
          role: "user",
          text: body,
          time: nowTime(),
          sortAt: sentAt2
        };
        setMessages((m) => [...m, userMsg2]);
        setSending(true);
        try {
          await postVisitorTicketMessage(apiBase, tid, token, body);
          await syncTicketThread();
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          setMessages((m) => [
            ...m,
            { role: "bot", text: userFacingChatError(msg), time: nowTime() }
          ]);
        } finally {
          setSending(false);
        }
        return;
      }
      if (!aiChatAvailable && !matchFaqAnswer(text.trim())) {
        return;
      }
      const sentAt = (/* @__PURE__ */ new Date()).toISOString();
      const userMsg = {
        role: "user",
        text: text.trim(),
        time: nowTime(),
        sortAt: sentAt
      };
      setMessages((m) => [...m, userMsg]);
      setText("");
      setAwaitingBot(true);
      let reply;
      const fromFaq = matchFaqAnswer(userMsg.text);
      if (fromFaq) {
        reply = fromFaq;
      } else if (sendMessage && aiChatAvailable) {
        const history = messages.filter((m) => (m.role === "user" || m.role === "bot") && m.text.trim()).slice(-16).map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.text.trim()
        }));
        const r = sendMessage(userMsg.text, history);
        reply = typeof r === "string" ? r : await r;
      } else {
        reply = AI_CHAT_UNAVAILABLE_MESSAGE;
      }
      const botAt = (/* @__PURE__ */ new Date()).toISOString();
      const botMsg = {
        role: "bot",
        text: reply,
        time: nowTime(),
        sortAt: botAt,
        isStaff: false,
        senderAvatar: null,
        senderName: fromFaq ? void 0 : "AI Assistant",
        ...fromFaq ? { faqLocal: true, faqForQuestion: userMsg.text } : {}
      };
      setMessages((m) => {
        const next = [...m, botMsg];
        saveSelfServeTranscript(projectToken, visitorRef.current?.email, next);
        return next;
      });
      const openTid = visitorRef.current?.ticketId;
      const openTok = visitorRef.current?.accessToken;
      if (apiBase !== void 0 && openTid && openTok && !inTicketThread) {
        try {
          await postVisitorSelfServeTranscript(apiBase, openTid, openTok, [
            { role: "user", content: userMsg.text, at: sentAt },
            { role: "assistant", content: reply, at: botAt }
          ]);
        } catch (err) {
          console.warn("[ChatWidget] Could not sync AI turn to open ticket", err);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const reply = userFacingChatError(msg);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: reply,
          time: nowTime(),
          sortAt: (/* @__PURE__ */ new Date()).toISOString(),
          isStaff: false,
          senderAvatar: null,
          senderName: "AI Assistant"
        }
      ]);
    } finally {
      setAwaitingBot(false);
      releaseInteractionLock();
    }
  }
  async function handleSelectFAQ(f) {
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
    const askedAt = (/* @__PURE__ */ new Date()).toISOString();
    try {
      const ticketIsResolved = ticketSummary?.status === "resolved";
      if (apiBase !== void 0 && inTicketThread && tid && token && !ticketIsResolved) {
        appendFaqExchange(projectToken, tid, {
          question: f.question,
          answer: f.ans,
          askedAt
        });
        await syncTicketThread();
      } else {
        const userMsg = {
          role: "user",
          text: f.question,
          time: nowTime(),
          sortAt: askedAt,
          faqLocal: true
        };
        const botMsg = {
          role: "bot",
          text: f.ans,
          time: nowTime(),
          sortAt: new Date(Date.parse(askedAt) + 1).toISOString(),
          faqLocal: true,
          faqForQuestion: f.question
        };
        setMessages((m) => [...m, userMsg, botMsg]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages((m) => [
        ...m,
        { role: "bot", text: userFacingChatError(msg), time: nowTime() }
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
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }
  const INPUT_AREA_ESTIMATED_HEIGHT = 84;
  const widgetPosition = themeSettings.position ?? "bottom-right";
  function getAnchors(pos) {
    switch (pos) {
      case "bottom-left":
        return {
          btnPos: { bottom: 24, left: 24, top: "auto", right: "auto" },
          panelPos: { bottom: 100, left: 24, top: "auto", right: "auto" }
        };
      case "top-right":
        return {
          btnPos: { top: 24, right: 24, bottom: "auto", left: "auto" },
          panelPos: { top: 100, right: 24, bottom: "auto", left: "auto" }
        };
      case "top-left":
        return {
          btnPos: { top: 24, left: 24, bottom: "auto", right: "auto" },
          panelPos: { top: 100, left: 24, bottom: "auto", right: "auto" }
        };
      case "bottom-right":
      default:
        return {
          btnPos: { bottom: 24, right: 24, top: "auto", left: "auto" },
          panelPos: { bottom: 100, right: 24, top: "auto", left: "auto" }
        };
    }
  }
  const { btnPos, panelPos } = getAnchors(widgetPosition);
  const positionClass = widgetPositionClass(widgetPosition);
  const chatTitle = themeSettings.botName?.trim() || title;
  const formFontSize = widgetFormFontSize(themeSettings.fontSizeBase);
  const styles = {
    floatingButton: {
      position: "fixed",
      ...btnPos,
      height: 64,
      width: 64,
      borderRadius: "50%",
      background: themeSettings.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor ?? "#776b00ff",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      boxShadow: `0 8px 24px ${themeSettings.isGradient ? themeSettings.secondaryColor || themeSettings.primaryColor : themeSettings.primaryColor}`,
      cursor: "pointer",
      zIndex: 1e3,
      transition: "all 0.3s ease"
    },
    panel: {
      position: "fixed",
      ...panelPos,
      width: "min(480px, calc(100vw - 24px))",
      height: 650,
      maxWidth: "calc(100vw - 24px)",
      maxHeight: "min(650px, calc(100dvh - 128px))",
      boxSizing: "border-box",
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#f8f8f8",
      borderRadius: 20,
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
      overflow: "hidden",
      transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
      opacity: open ? 1 : 0,
      pointerEvents: open ? "auto" : "none",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 999,
      display: "flex",
      flexDirection: "column"
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 24px",
      background: themeSettings.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor ?? "#776b00ff",
      color: "white",
      flexShrink: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20
    },
    welcomeScreen: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      minHeight: 0,
      alignItems: "stretch",
      width: "100%"
    },
    welcomeHeader: {
      background: themeSettings.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor ?? "#776b00ff",
      padding: "40px 24px",
      color: "white",
      position: "relative",
      overflow: "hidden",
      width: "100%",
      flexShrink: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      boxSizing: "border-box"
    },
    faqContainer: {
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      padding: "24px",
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#f8f8f8",
      borderRadius: "10px",
      border: `1px solid ${themeSettings.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`
    },
    faqCard: {
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#fff",
      borderRadius: 12,
      marginBottom: 12,
      boxShadow: themeSettings?.isDarkMode ? "0 2px 8px rgba(0, 0, 0, 0.2)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease"
    },
    chatScreen: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#f8f8f8",
      minHeight: 0
    },
    messagesArea: {
      flex: 1,
      overflowY: "auto",
      padding: `20px 20px ${INPUT_AREA_ESTIMATED_HEIGHT + 12}px 20px`,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minHeight: 0
    },
    userMessageBubble: {
      background: themeSettings.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor ?? "#776b00ff",
      color: "white",
      padding: "12px 16px",
      borderRadius: "16px 16px 4px 16px",
      fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 4 : 16,
      lineHeight: 1.5,
      animation: "slideInRight 0.3s ease"
    },
    botMessageBubble: {
      background: themeSettings.isGradient ? `rgba(${hexToRgb(themeSettings.primaryColor)}, 0.6)` : themeSettings.secondaryColor ?? "#776b00ff",
      color: "#1a1a1a",
      padding: "12px 16px",
      borderRadius: "16px 16px 16px 4px",
      fontSize: themeSettings?.fontSizeBase ? themeSettings?.fontSizeBase / 2 + 4 : 14,
      lineHeight: 1.5,
      whiteSpace: "pre-wrap",
      animation: "slideInLeft 0.3s ease"
    },
    timeText: {
      fontSize: 11,
      opacity: 0.6,
      marginTop: 6,
      color: themeSettings?.isDarkMode ? "#fff" : "#0000"
    },
    inputArea: {
      padding: "16px 20px",
      flexShrink: 0,
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#f8f8f8",
      borderTop: `1px solid ${themeSettings.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      width: "100%"
    },
    inputWrapper: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      background: themeSettings?.isDarkMode ? "#333" : "#fff",
      borderRadius: 24,
      padding: "8px 12px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
    },
    input: {
      flex: 1,
      border: "none",
      background: "transparent",
      outline: "none",
      fontSize: 14,
      padding: "8px 12px",
      width: "0%",
      color: themeSettings?.isDarkMode ? "#fff" : "#1a1a1a"
    },
    sendButton: {
      background: themeSettings.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor ?? "#776b00ff",
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
      padding: "8px 16px"
    },
    formLabel: {
      display: "block",
      fontSize: formFontSize,
      fontWeight: 500,
      marginBottom: 4,
      color: themeSettings?.isDarkMode ? "#fff" : "#1a1a1a"
    },
    formInput: {
      width: "100%",
      border: `1px solid ${themeSettings.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      borderRadius: 8,
      padding: "12px 14px",
      fontSize: formFontSize,
      outline: "none",
      boxSizing: "border-box",
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#fff",
      color: themeSettings?.isDarkMode ? "#fff" : "#1a1a1a"
    },
    formTextarea: {
      width: "100%",
      border: `1px solid ${themeSettings.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
      borderRadius: 8,
      padding: "12px 14px",
      fontSize: formFontSize,
      lineHeight: 1.5,
      outline: "none",
      boxSizing: "border-box",
      height: 96,
      resize: "vertical",
      background: themeSettings?.isDarkMode ? "#2b2b2b" : "#fff",
      color: themeSettings?.isDarkMode ? "#fff" : "#1a1a1a"
    },
    sendPill: {
      background: themeSettings.isGradient ? `linear-gradient(90deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})` : themeSettings.primaryColor ?? "#776b00ff",
      color: "white",
      border: "none",
      borderRadius: 36,
      padding: "10px 30px",
      fontSize: 14,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s ease"
    }
  };
  async function onPreChatContinue(payload) {
    if (apiBase === void 0) {
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
        name: payload.name || void 0,
        projectToken: projectToken?.trim() || void 0
      });
      const profile = {
        email: r.email ?? payload.email,
        name: r.name ?? payload.name,
        accessToken: r.accessToken,
        ticketId: r.ticketId ?? null
      };
      setVisitor(profile);
      visitorRef.current = profile;
      saveVisitorSession(profile, projectToken);
      const restored = loadSelfServeTranscript(projectToken, profile.email);
      setMessages(restored);
      setTicketSummary(null);
      setHelpOpen(false);
      setView("main");
      setInTicketThread(false);
      if (apiBase !== void 0 && profile.ticketId && profile.accessToken) {
        try {
          const summary = await getVisitorTicket(
            apiBase,
            profile.ticketId,
            profile.accessToken
          );
          setTicketSummary(summary);
          const stillInAgentMode = summary.status !== "resolved" && lastAgentModeNotice(restored) === "enter";
          if (summary.canRate || stillInAgentMode) {
            setRatingSkipped(false);
            setInTicketThread(true);
          }
        } catch {
        }
      }
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
  async function handleRatingSubmit(rating) {
    const tid = visitorRef.current?.ticketId;
    const token = visitorRef.current?.accessToken;
    if (apiBase === void 0 || !tid || !token) return;
    setRatingBusy(true);
    try {
      const summary = await postVisitorTicketRating(apiBase, tid, token, rating);
      setTicketSummary(summary);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages((m) => [
        ...m,
        { role: "bot", text: userFacingChatError(msg), time: nowTime() }
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
    clearSelfServeTranscript(projectToken, current.email);
    const profile = {
      email: current.email,
      name: current.name,
      accessToken: current.accessToken,
      ticketId: null
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
  const appendModeNoticeFromApi = (0, import_react7.useCallback)((row) => {
    const mapped = ticketMessageToWidgetMsg(row);
    setMessages((m) => {
      if (mapped.id && m.some((x) => x.id === mapped.id)) return m;
      const next = dedupeAdjacentModeNotices([...m, mapped]);
      saveSelfServeTranscript(
        projectToken,
        visitorRef.current?.email,
        next
      );
      return next;
    });
  }, [projectToken]);
  async function handleResumeTicket() {
    if (!activeTicketId) return;
    if (!acquireInteractionLock()) return;
    const tid = activeTicketId;
    const token = visitorRef.current?.accessToken;
    setHelpOpen(false);
    saveSelfServeTranscript(
      projectToken,
      visitorRef.current?.email,
      messagesRef.current
    );
    try {
      const pending = selfServeTurnsSinceLastExit(messagesRef.current);
      if (apiBase !== void 0 && token && pending.length) {
        try {
          await postVisitorSelfServeTranscript(apiBase, tid, token, pending);
        } catch (err) {
          console.warn("[ChatWidget] Could not sync self-serve turns before resume", err);
        }
      }
      if (apiBase !== void 0 && token) {
        try {
          if (lastAgentModeNotice(messagesRef.current) !== "enter") {
            const notice = await postVisitorTicketNotice(
              apiBase,
              tid,
              token,
              "enter"
            );
            if (notice) appendModeNoticeFromApi(notice);
          }
        } catch (err) {
          console.warn("[ChatWidget] Could not record resume notice", err);
        }
      }
      setInTicketThread(true);
      await syncTicketThread();
    } finally {
      releaseInteractionLock();
    }
  }
  async function handleExitAgentChat() {
    if (!acquireInteractionLock()) return;
    const tid = visitorRef.current?.ticketId;
    const token = visitorRef.current?.accessToken;
    setHelpOpen(false);
    setAllowResolvedReply(false);
    try {
      if (apiBase !== void 0 && tid && token) {
        try {
          const notice = await postVisitorTicketNotice(apiBase, tid, token, "exit");
          if (notice) appendModeNoticeFromApi(notice);
        } catch (err) {
          console.warn("[ChatWidget] Could not record exit notice", err);
        }
      }
      setInTicketThread(false);
      await syncTicketThread();
    } finally {
      releaseInteractionLock();
    }
  }
  function handleContinueResolvedConversation() {
    setAllowResolvedReply(true);
  }
  async function onEscalateSubmit(payload) {
    const tok = projectToken?.trim();
    if (apiBase === void 0 || !tok) return;
    const email = payload.email ?? visitor?.email;
    if (!email) return;
    setEscalateBusy(true);
    try {
      const transcript = buildEscalateTranscript(messages);
      const r = await postVisitorEscalate(apiBase, {
        email,
        name: payload.name ?? visitor?.name,
        projectToken: tok,
        subject: payload.subject,
        message: payload.summary,
        ...transcript.length ? { transcript } : {}
      });
      setVisitor((v) => ({
        email: r.email ?? email,
        name: r.name ?? v?.name ?? payload.name ?? "",
        accessToken: r.accessToken,
        ticketId: r.ticketId ?? v?.ticketId ?? null
      }));
      visitorRef.current = {
        email: r.email ?? email,
        name: r.name ?? payload.name ?? "",
        accessToken: r.accessToken,
        ticketId: r.ticketId ?? null
      };
      if (r.ticketId && r.accessToken) {
        markTicketCreatedNotice(projectToken, String(r.ticketId));
        saveSelfServeTranscript(projectToken, email, messagesRef.current);
        setInTicketThread(true);
        setTicketSummary(null);
        setRatingSkipped(false);
        setAllowResolvedReply(false);
        await syncTicketThread({ refreshSummary: true });
      } else {
        setMessages((m) => [
          ...m,
          { role: "bot", text: r.message, time: nowTime() }
        ]);
      }
      setHelpOpen(false);
      if (view === "escalate") {
        setView(visitorGateEffective ? "main" : "chat");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setMessages((m) => [
        ...m,
        { role: "bot", text: userFacingChatError(msg), time: nowTime() }
      ]);
      setHelpOpen(false);
      if (view === "escalate") {
        setView(visitorGateEffective ? "main" : "chat");
      }
    } finally {
      setEscalateBusy(false);
    }
  }
  if (hasApi && projectToken?.trim() && (!configReady || widgetUnavailable)) {
    return null;
  }
  if (configReady && !hasAnyWidgetSurface) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(import_jsx_runtime15.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("style", { children: `
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
        /* Phones only \u2014 tablets (e.g. 768px) keep the floating popup */
        @media (max-width: 640px) {
          .chat-panel {
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            width: 100dvw !important;
            max-width: none !important;
            height: 100% !important;
            height: 100dvh !important;
            max-height: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          .chat-panel.chat-pos-br,
          .chat-panel.chat-pos-bl,
          .chat-panel.chat-pos-tr,
          .chat-panel.chat-pos-tl {
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
          }
          .chat-widget-sheet-header,
          .chat-widget-welcome-header {
            border-radius: 0 !important;
            border-top-left-radius: 0 !important;
            border-top-right-radius: 0 !important;
          }
          /* Close lives in the header on phones \u2014 hide the floating launcher while open */
          .chat-widget-floating-btn.is-open {
            display: none !important;
          }
          .chat-widget-floating-btn {
            width: 56px !important;
            height: 56px !important;
          }
          .chat-widget-floating-btn svg {
            width: 24px !important;
            height: 24px !important;
          }
          .chat-widget-floating-btn.chat-pos-br,
          .chat-widget-floating-btn.chat-pos-tr {
            right: max(16px, env(safe-area-inset-right, 0px)) !important;
            left: auto !important;
          }
          .chat-widget-floating-btn.chat-pos-bl,
          .chat-widget-floating-btn.chat-pos-tl {
            left: max(16px, env(safe-area-inset-left, 0px)) !important;
            right: auto !important;
          }
          .chat-widget-floating-btn.chat-pos-br,
          .chat-widget-floating-btn.chat-pos-bl {
            bottom: max(16px, env(safe-area-inset-bottom, 0px)) !important;
            top: auto !important;
          }
          .chat-widget-floating-btn.chat-pos-tr,
          .chat-widget-floating-btn.chat-pos-tl {
            top: max(16px, env(safe-area-inset-top, 0px)) !important;
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
          /* Pre-chat: keep welcome / greeting / fields in a tight scale */
          .chat-widget-prechat .chat-widget-welcome-header h2 {
            font-size: clamp(1.0625rem, 3.8vw, 1.1875rem) !important;
            line-height: 1.3 !important;
          }
          .chat-widget-prechat .chat-widget-welcome-header p {
            font-size: clamp(0.875rem, 3.4vw, 0.9375rem) !important;
            line-height: 1.5 !important;
          }
          .chat-widget-prechat-body {
            padding: 0 16px 20px !important;
          }
          .chat-widget-faq-container {
            padding: 20px !important;
          }
        }
        @media (min-width: 641px) and (max-height: 720px) {
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
        }
      ` }),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
      FloatingButton,
      {
        open,
        setOpen,
        styles,
        themeSettings,
        className: `chat-widget-floating-btn chat-pos-${positionClass}${open ? " is-open" : ""}`
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
      "div",
      {
        ref: panelRef,
        style: styles.panel,
        "data-theme": themeSettings.isDarkMode ? "dark" : "light",
        className: `chat-panel chat-pos-${positionClass}`,
        children: [
          view === "prechat" && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { style: { display: "flex", flexDirection: "column", flex: 1, width: "100%" }, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
            PreChatScreen,
            {
              styles,
              themeSettings,
              onContinue: onPreChatContinue,
              busy: prechatBusy,
              error: prechatError,
              onClose: () => setOpen(false)
            }
          ) }),
          view === "main" && visitorGateEffective ? /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
            WidgetMainView,
            {
              styles,
              title: chatTitle,
              messages,
              showTyping: awaitingBot || escalateBusy,
              sending: sending || escalateBusy,
              text,
              setText,
              onSend: handleSend,
              messagesEndRef,
              themeSettings,
              faqs,
              onSelectFAQ: handleSelectFAQ,
              helpOpen,
              onHelpOpenChange: handleHelpOpenChange,
              interactionLocked: interactionLocked || escalateBusy,
              hasActiveTicket: viewingTicketThread,
              activeTicketId: viewingTicketThread ? activeTicketId : null,
              ticketStatus: viewingTicketThread ? ticketSummary?.status ?? null : null,
              resumableTicketId,
              onResumeTicket: () => void handleResumeTicket(),
              onExitAgentChat: handleExitAgentChat,
              onClose: () => setOpen(false),
              ticketResolved: viewingTicketThread && ticketResolved,
              showRatingPrompt: viewingTicketThread && showRatingPrompt,
              ratingBusy,
              ratingSubmitted,
              onRatingSubmit: handleRatingSubmit,
              onRatingSkip: handleRatingSkip,
              onStartNewConversation: handleStartNewConversation,
              onContinueResolvedConversation: handleContinueResolvedConversation,
              allowResolvedReply,
              canEscalate,
              aiChatAvailable,
              onContactSupport: () => setView("escalate"),
              placeholder,
              apiBaseUrl: apiBase
            }
          ) : null,
          view === "welcome" && !visitorGateEffective ? /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
            WelcomeScreen,
            {
              styles,
              faqs,
              onSelectFAQ: handleSelectFAQ,
              interactionLocked,
              placeholder,
              text,
              setText,
              onSend: (e) => {
                e.preventDefault();
                setView("chat");
                handleSend(e);
              },
              themeSettings,
              canEscalate,
              aiChatAvailable,
              onCreateSupportTicket: () => setView("escalate"),
              onClose: () => setOpen(false)
            }
          ) : null,
          view === "chat" && !visitorGateEffective ? /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
            ChatScreen,
            {
              styles,
              title: chatTitle,
              messages,
              showTyping: awaitingBot,
              sending,
              text,
              setText,
              onSend: handleSend,
              onBack: handleBackToFAQs,
              interactionLocked,
              messagesEndRef,
              themeSettings,
              canEscalate,
              aiChatAvailable,
              onContactSupport: () => setView("escalate"),
              apiBaseUrl: apiBase,
              onClose: () => setOpen(false)
            }
          ) : null,
          view === "escalate" && agentAvailable ? /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
            EscalateScreen,
            {
              styles,
              themeSettings,
              title: chatTitle,
              onBack: () => {
                setHelpOpen(false);
                setView("main");
              },
              onSubmit: onEscalateSubmit,
              busy: escalateBusy,
              collectIdentity: collectIdentityOnEscalate,
              initialEmail: visitor?.email,
              initialName: visitor?.name,
              initialSummary: lastUserMessageForEscalate(messages),
              onClose: () => setOpen(false)
            }
          ) : null
        ]
      }
    )
  ] });
}

// src/createBackendSendMessage.ts
function createBackendSendMessage(opts) {
  return (message, history) => postChatCompletion({
    apiBaseUrl: opts.apiBaseUrl,
    message,
    history,
    projectToken: opts.projectToken,
    siteName: opts.siteName,
    websiteDescription: opts.websiteDescription
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChatWidget,
  assertCompleteJwt,
  createBackendSendMessage,
  postChatCompletion,
  postVisitorEscalate,
  postVisitorIdentify
});
