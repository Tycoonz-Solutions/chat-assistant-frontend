import React from "react";
import { X } from "lucide-react";

/** Header close control for mobile full-screen chat. */
export default function WidgetCloseButton({
  onClose,
  size = 22,
}: {
  onClose: () => void;
  size?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close chat"
      className="chat-widget-close-btn"
      style={{
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
        cursor: "pointer",
      }}
    >
      <X size={size} strokeWidth={2.25} />
    </button>
  );
}
