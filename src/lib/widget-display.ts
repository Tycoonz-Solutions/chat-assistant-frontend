const DEFAULT_BOT_AVATAR = "https://i.pravatar.cc/150?img=32";

/**
 * Turn stored `/uploads/...` paths into browser URLs for `<img src>`.
 * On the admin demo site, prefer same-origin relative paths so Next `/uploads`
 * rewrites + CSP `img-src 'self'` work. Cross-origin embeds use the API origin.
 */
export function resolveWidgetAssetUrl(
  apiBaseUrl: string | undefined,
  path: string | null | undefined,
): string | null {
  if (!path?.trim()) return null;
  const raw = path.trim();
  if (/^https?:\/\//i.test(raw)) return raw;

  const normalized = raw.startsWith("/") ? raw : `/${raw}`;

  if (typeof window !== "undefined" && normalized.startsWith("/uploads")) {
    try {
      const apiOrigin = apiBaseUrl?.trim()
        ? new URL(apiBaseUrl, window.location.href).origin
        : "";
      if (!apiOrigin || apiOrigin === window.location.origin) {
        return normalized;
      }
      // Admin panel proxies /uploads — keep images same-origin (CSP-safe).
      if (
        window.location.pathname.includes("/demo-site") ||
        /localhost|127\.0\.0\.1/.test(window.location.hostname)
      ) {
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

export function widgetBotAvatarUrl(
  apiBaseUrl: string | undefined,
  botAvatarUrl: string | null | undefined,
): string {
  return resolveWidgetAssetUrl(apiBaseUrl, botAvatarUrl) ?? DEFAULT_BOT_AVATAR;
}

export { DEFAULT_BOT_AVATAR };

export function parseStaffSenderName(label: string | undefined): string {
  const raw = String(label || "").trim();
  if (!raw || raw === "Unknown sender" || raw === "System") return "Support";
  const match = raw.match(/^(.+?)\s*\((?:Agent|Owner|Support)\)$/);
  return match ? match[1].trim() : raw;
}
