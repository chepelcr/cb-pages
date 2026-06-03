/**
 * Post-build SEO prerender. After `vite build`, this emits one static HTML file
 * per route (each is the SPA shell with route-specific <head> tags), a
 * sitemap.xml, robots.txt, and a noindex 404.html that boots the SPA for deep
 * links. No runtime server is involved.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const distDir = path.resolve(repoRoot, "dist/public");
const contentDir = path.resolve(repoRoot, "client/src/content");

async function readJson<T>(rel: string): Promise<T> {
  return JSON.parse(await fs.readFile(path.join(contentDir, rel), "utf-8")) as T;
}

interface SeoRoute { path: string; title: string; description: string }
interface Seo {
  lang: string; siteUrl: string; defaultTitle: string; defaultDescription: string;
  ogImage: string; twitterCard: string; routes: SeoRoute[];
}
interface MediaItem { id: string; src: string }

function headTags(seo: Seo, route: SeoRoute, ogImageUrl: string): string {
  const canonical = seo.siteUrl.replace(/\/$/, "") + (route.path === "/" ? "" : route.path);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seo.defaultTitle,
    url: seo.siteUrl,
    logo: ogImageUrl,
    description: route.description,
  };
  return [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    ogImageUrl ? `<meta property="og:image" content="${ogImageUrl}" />` : "",
    `<meta name="twitter:card" content="${seo.twitterCard}" />`,
    `<meta property="og:locale" content="${seo.lang}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ].filter(Boolean).join("\n    ");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function applyHead(template: string, head: string, lang: string): string {
  let html = template.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
  // Drop the static title + description, then inject route head before </head>.
  html = html.replace(/<title>[\s\S]*?<\/title>\s*/, "");
  html = html.replace(/<meta name="description"[^>]*>\s*/, "");
  return html.replace("</head>", `    ${head}\n  </head>`);
}

async function main() {
  const seo = await readJson<Seo>("seo.json");
  const media = await readJson<{ items: MediaItem[] }>("media.json");
  const ogItem = media.items.find((m) => m.id === seo.ogImage);
  const ogImageUrl = ogItem ? seo.siteUrl.replace(/\/$/, "") + ogItem.src : "";

  const template = await fs.readFile(path.join(distDir, "index.html"), "utf-8");

  for (const route of seo.routes) {
    const head = headTags(seo, route, ogImageUrl);
    const html = applyHead(template, head, seo.lang);
    if (route.path === "/") {
      await fs.writeFile(path.join(distDir, "index.html"), html, "utf-8");
    } else {
      const dir = path.join(distDir, route.path.replace(/^\//, ""));
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, "index.html"), html, "utf-8");
    }
    console.log(`prerendered ${route.path}`);
  }

  // sitemap.xml
  const urls = seo.routes
    .map((r) => {
      const loc = seo.siteUrl.replace(/\/$/, "") + (r.path === "/" ? "/" : r.path);
      return `  <url><loc>${loc}</loc></url>`;
    })
    .join("\n");
  await fs.writeFile(
    path.join(distDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    "utf-8",
  );

  // robots.txt
  await fs.writeFile(
    path.join(distDir, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${seo.siteUrl.replace(/\/$/, "")}/sitemap.xml\n`,
    "utf-8",
  );

  // noindex 404 that still boots the SPA for unknown deep links
  const notFound = applyHead(template, `<title>404 — ${escapeHtml(seo.defaultTitle)}</title>\n    <meta name="robots" content="noindex" />`, seo.lang);
  await fs.writeFile(path.join(distDir, "404.html"), notFound, "utf-8");

  console.log("sitemap.xml, robots.txt, 404.html written");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
