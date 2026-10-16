"use client";

import { ToonAvatar } from "./ToonAvatar";

export const YOUTUBE_AVATAR = "youtube";

/** The person's face on their roast: their YouTube picture, or the toon they picked. */
export function UserAvatar({
  choice,
  photo,
  size = 48,
  ring = true,
  className = "",
}: {
  /** "youtube" or a toon id. */
  choice: string;
  photo: string | null;
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  const ringClass = ring ? "ring-[3px] ring-paper" : "";
  if (choice === YOUTUBE_AVATAR && photo) {
    return (
      // A data URL from our own server; next/image adds nothing here and can't be captured.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt=""
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${ringClass} ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={`inline-block shrink-0 rounded-full ${ringClass} ${className}`}
      style={{ width: size, height: size }}
    >
      <ToonAvatar avatarId={choice} size={size} className="block" />
    </span>
  );
}
