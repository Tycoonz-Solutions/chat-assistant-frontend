import React from "react";
import type { ThemeSettings } from "../../types";
import { splitGreetingMessage } from "../lib/greeting-message";
import {
  widgetBodyFontSize,
  widgetWelcomeHeadlineSize,
} from "../lib/widget-font-size";

export default function WelcomeMessagePanel({
  themeSettings,
  compact = false,
}: {
  themeSettings: ThemeSettings;
  compact?: boolean;
}) {
  const { headline, subtitle } = splitGreetingMessage(themeSettings.greetingMessage);
  const headlineSize = widgetWelcomeHeadlineSize(themeSettings.fontSizeBase);
  const bodySize = widgetBodyFontSize(themeSettings.fontSizeBase);
  const isDark = themeSettings.isDarkMode;

  return (
    <div
      style={{
        margin: compact ? "12px 16px 0" : "16px 16px 0",
        padding: compact ? "16px 18px" : "20px 22px",
        borderRadius: 16,
        background: themeSettings.isGradient
          ? `linear-gradient(135deg, ${themeSettings.primaryColor}, ${themeSettings.secondaryColor})`
          : themeSettings.primaryColor ?? "#006D77",
        color: "#fff",
        boxShadow: isDark
          ? "0 4px 16px rgba(0,0,0,0.25)"
          : "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          fontSize: compact ? headlineSize * 0.85 : headlineSize,
          fontWeight: 700,
          lineHeight: 1.25,
          marginBottom: subtitle ? 8 : 0,
        }}
      >
        {headline}
      </div>
      {subtitle ? (
        <p
          style={{
            margin: 0,
            fontSize: bodySize,
            lineHeight: 1.5,
            opacity: 0.95,
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
