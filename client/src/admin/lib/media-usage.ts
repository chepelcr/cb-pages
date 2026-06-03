import type { EntityKey } from "@/admin/store/content-store";
import { CONTENT_ENTITIES } from "@/lib/content-manifest";

export interface MediaUsage {
  entity: EntityKey;
  label: string;
  path: string;
}

const labelFor = (key: string): string =>
  CONTENT_ENTITIES.find((e) => e.key === key)?.label ?? key;

/** Recursively collect every string leaf value with its dotted path. */
function collectStringLeaves(
  value: unknown,
  path: string,
  out: { path: string; value: string }[],
) {
  if (typeof value === "string") {
    out.push({ path, value });
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => collectStringLeaves(v, `${path}[${i}]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      collectStringLeaves(v, path ? `${path}.${k}` : k, out);
    }
  }
}

/**
 * Find every place a media id is referenced across all content entities.
 * `data` is the live admin content store state. The media library itself is
 * skipped (it defines the media, it does not "use" it).
 */
export function findMediaUsage(
  mediaId: string,
  data: Record<string, any>,
): MediaUsage[] {
  const usages: MediaUsage[] = [];
  for (const [key, entity] of Object.entries(data)) {
    if (key === "media") continue;
    const leaves: { path: string; value: string }[] = [];
    collectStringLeaves(entity, "", leaves);
    for (const leaf of leaves) {
      if (leaf.value === mediaId) {
        usages.push({ entity: key as EntityKey, label: labelFor(key), path: leaf.path });
      }
    }
  }
  return usages;
}

/** Map of mediaId -> usage count, for badges in the media library. */
export function usageCounts(
  mediaIds: string[],
  data: Record<string, any>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const id of mediaIds) {
    counts[id] = findMediaUsage(id, data).length;
  }
  return counts;
}
