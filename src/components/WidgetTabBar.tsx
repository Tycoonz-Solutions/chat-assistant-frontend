import type { CSSProperties } from "react";
import type { ThemeSettings } from "../types/index";

export type WidgetTab = "conversation" | "help";

type Props = {
  active: WidgetTab;
  onChange: (tab: WidgetTab) => void;
  themeSettings: ThemeSettings;
  showConversationBadge?: boolean;
};

export default function WidgetTabBar({
  active,
  onChange,
  themeSettings,
  showConversationBadge,
}: Props) {
  const primary = themeSettings.primaryColor ?? "#006D77";
  const isDark = themeSettings.isDarkMode;

  function tabStyle(tab: WidgetTab): CSSProperties {
    const isActive = active === tab;
    return {
      flex: 1,
      border: "none",
      borderRadius: 999,
      padding: "10px 12px",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      transition: "background 0.15s, color 0.15s",
      background: isActive ? primary : "transparent",
      color: isActive ? "#fff" : isDark ? "#cbd5e1" : "#475569",
      position: "relative",
    };
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        padding: "8px 16px 10px",
        background: isDark ? "#252525" : "#fff",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e8e8e8"}`,
      }}
    >
      <button type="button" style={tabStyle("conversation")} onClick={() => onChange("conversation")}>
        Messages
        {showConversationBadge && active !== "conversation" ? (
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 10,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: primary,
            }}
            aria-hidden
          />
        ) : null}
      </button>
      <button type="button" style={tabStyle("help")} onClick={() => onChange("help")}>
        Quick help
      </button>
    </div>
  );
}
