import { siDiscord, siInstagram, siTelegram, siWhatsapp, siX } from "simple-icons";

export type Platform = "x" | "whatsapp" | "instagram" | "discord" | "slack" | "telegram";

export const PLATFORM_NAME: Record<Platform, string> = {
  x: "X",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  discord: "Discord",
  slack: "Slack",
  telegram: "Telegram",
};

const SIMPLE = {
  x: siX,
  whatsapp: siWhatsapp,
  instagram: siInstagram,
  discord: siDiscord,
  telegram: siTelegram,
};

/** Brand marks in their own colors, on a tile. Slack isn't in simple-icons, so it's drawn here. */
export function PlatformIcon({ platform, size = 22 }: { platform: Platform; size?: number }) {
  if (platform === "slack") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
        <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" />
        <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" />
        <path fill="#ECB22E" d="M15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z" />
      </svg>
    );
  }
  const icon = SIMPLE[platform];
  // X's mark is black; flip it to white so it shows on the dark tiles.
  const color = platform === "x" ? "#FFFFFF" : `#${icon.hex}`;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={icon.path} fill={color} />
    </svg>
  );
}
