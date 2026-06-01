import { HelpCircle, X } from "lucide-react";
import type { ThemeSettings } from "../types/index";

type Props = {
  active: boolean;
  onClick: () => void;
  themeSettings: ThemeSettings;
};

export default function HelpChip({ active, onClick, themeSettings }: Props) {
  const primary = themeSettings.primaryColor ?? "#006D77";
  const isDark = themeSettings.isDarkMode;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={active}
      aria-label={active ? "Back to messages" : "Browse quick help"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        border: `1px solid ${active ? primary : isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
        borderRadius: 999,
        padding: "7px 14px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        background: active ? primary : isDark ? "#333" : "#fff",
        color: active ? "#fff" : isDark ? "#e2e8f0" : "#334155",
        boxShadow: active
          ? "none"
          : isDark
            ? "0 1px 3px rgba(0,0,0,0.35)"
            : "0 1px 4px rgba(0,0,0,0.08)",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
      }}
    >
      {active ? <X size={16} aria-hidden /> : <HelpCircle size={16} aria-hidden />}
      {active ? "Back to chat" : "Quick help"}
    </button>
  );
}
