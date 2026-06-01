import React from "react";
import { ChevronRight, List } from "lucide-react";
import type { FAQ, ThemeSettings } from "../types/index";

type Props = {
  styles: Record<string, React.CSSProperties>;
  faqs: FAQ[];
  themeSettings: ThemeSettings;
  onSelectFAQ: (f: FAQ) => void;
  compact?: boolean;
};

export default function FaqListPanel({
  styles,
  faqs,
  themeSettings,
  onSelectFAQ,
  compact = false,
}: Props) {
  return (
    <div
      className="hide-scrollbar"
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        padding: compact ? "12px 16px 16px" : "16px 20px 20px",
        background: themeSettings?.isDarkMode ? "#2b2b2b" : "#f8f8f8",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <List size={18} color={themeSettings.primaryColor ?? "#006D77"} />
        <h3
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: themeSettings?.isDarkMode ? "#fff" : "#1a1a1a",
          }}
        >
          Quick questions
        </h3>
      </div>

      {faqs.length === 0 ? (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: themeSettings?.isDarkMode ? "#aaa" : "#64748b",
            textAlign: "center",
            padding: "24px 8px",
          }}
        >
          No FAQs yet. Start a conversation and our team will help you.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {faqs.map((faq, index) => (
            <button
              key={`${faq.question}-${index}`}
              type="button"
              style={{
                ...styles.faqCard,
                width: "100%",
                border: `1px solid ${
                  themeSettings.isDarkMode
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.06)"
                }`,
                cursor: "pointer",
                textAlign: "left",
              }}
              onClick={() => onSelectFAQ(faq)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: themeSettings?.isDarkMode ? "#f1f5f9" : "#1a1a1a",
                    flex: 1,
                  }}
                >
                  {faq.question}
                </span>
                <ChevronRight
                  size={18}
                  color={themeSettings.primaryColor ?? "#006D77"}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
