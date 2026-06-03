import themesJson from "@/content/themes.json";
import { content } from "@/repositories/content.repository";
import { resolveMedia } from "@/lib/media";

interface Palette {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}
interface Theme {
  id: string;
  name: string;
  radius: string;
  fontSans: string;
  light: Palette;
  dark: Palette;
}
interface ThemesDoc {
  activeTheme: string;
  themes: Theme[];
}

const camelToKebab = (s: string) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

function paletteToVars(p: Palette): string {
  return Object.entries(p)
    .map(([k, v]) => `--${camelToKebab(k)}: ${v};`)
    .join("\n  ");
}

const STYLE_ID = "brand-theme-vars";

/** Apply a theme's palette (light + dark) as CSS variables on :root / .dark. */
export function applyTheme(doc: ThemesDoc = themesJson as ThemesDoc) {
  if (typeof document === "undefined") return;
  const theme = doc.themes.find((t) => t.id === doc.activeTheme) ?? doc.themes[0];
  if (!theme) return;

  const css = `:root {
  ${paletteToVars(theme.light)}
  --radius: ${theme.radius};
  --font-sans: ${theme.fontSans};
}
.dark {
  ${paletteToVars(theme.dark)}
}`;

  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

/** Apply favicon + document title from branding/SEO content. */
export function applyBranding() {
  if (typeof document === "undefined") return;
  const favicon = resolveMedia(content.branding.favicon);
  if (favicon) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = favicon;
  }
  if (content.seo.defaultTitle) {
    document.title = content.seo.defaultTitle;
  }
  document.documentElement.lang = content.seo.lang || "es";
}

/** Called once from main.tsx before render. */
export function initBrand() {
  applyTheme();
  applyBranding();
}
