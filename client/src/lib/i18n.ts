import es from "@/content/translations/es.json";

type Dict = Record<string, unknown>;

const translations: Dict = es as Dict;

/**
 * Resolve a dotted translation key (e.g. "leadership.pageOf") from the
 * fixed-UI-chrome dictionary, with optional {placeholder} interpolation.
 * Falls back to the key itself if missing so gaps are obvious in dev.
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Dict)) {
      return (acc as Dict)[part];
    }
    return undefined;
  }, translations);

  let str = typeof value === "string" ? value : key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}

export { translations };
