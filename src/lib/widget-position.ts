import type { ThemeSettings } from "../../types";

/** Short CSS suffix for widget anchor position (e.g. bottom-right → br). */
export function widgetPositionClass(
  position: ThemeSettings["position"] | undefined,
): string {
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
