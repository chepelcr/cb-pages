import mediaJson from "@/content/media.json";

export interface MediaItem {
  id: string;
  src: string;
  name: string;
  alt: string;
  type: string;
}

export const mediaItems: MediaItem[] = (mediaJson.items ?? []) as MediaItem[];

const bySource: Record<string, MediaItem> = Object.fromEntries(
  mediaItems.map((m) => [m.id, m]),
);

/**
 * Resolve a media reference (a media `id`) to a usable `src` path.
 * Returns "" for an empty/missing reference so callers can fall back gracefully.
 * Accepts a custom item list (used by the admin to resolve against live edits).
 */
export function resolveMedia(
  id: string | undefined | null,
  items: MediaItem[] = mediaItems,
): string {
  if (!id) return "";
  const found = items.find((m) => m.id === id);
  return found ? found.src : "";
}

export function resolveMediaAlt(
  id: string | undefined | null,
  fallback = "",
  items: MediaItem[] = mediaItems,
): string {
  if (!id) return fallback;
  const found = items.find((m) => m.id === id);
  return found?.alt || fallback;
}

export function getMediaItem(id: string): MediaItem | undefined {
  return bySource[id];
}
