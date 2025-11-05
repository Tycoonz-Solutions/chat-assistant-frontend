// components/chat-widget/components/FloatingButton.tsx
import { MessageCircle, X } from 'lucide-react';
import { ThemeSettings } from '../../types';

export default function FloatingButton({
  open,
  setOpen,
  styles,
  themeSettings
}: {
  open: boolean;
  setOpen: (v: boolean | ((s: boolean) => boolean)) => void;
  styles: any;
  themeSettings: ThemeSettings;
}) {
  return (
    <button
      style={styles.floatingButton}
      onClick={() => setOpen((s: boolean) => !s)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = `0 12px 32px ${themeSettings?.isGradient
            ? themeSettings.secondaryColor || themeSettings.primaryColor
            : themeSettings.primaryColor
          }`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${themeSettings?.isGradient
          ? themeSettings.secondaryColor || themeSettings.primaryColor
          : themeSettings.primaryColor}`;
      }}
      aria-label="Open chat"
    >
      {open ? <X size={28} /> : <MessageCircle size={28} />}
    </button>
  );
}
