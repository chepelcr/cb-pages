# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A **landing DXP** for the Cuerpo de Banderas of Liceo de Costa Rica: a fully
static React + Vite SPA deployed to **GitHub Pages**, paired with a **dev-only
admin CMS** that edits bundled JSON content and writes it back to disk. There is
**no runtime backend, no database, no AWS, no Cognito**. (The repo previously
had an Express/Drizzle/Neon server, a separate Cognito+S3 admin app, and AWS
Amplify — all removed in favor of this JSON-driven static model.)

Public URL: `https://banderas.jcampos.dev` (custom domain via `client/public/CNAME`).

## Hard invariants — keep all true

- **No runtime backend.** Content is statically imported JSON under
  `client/src/content/`. "Save" in the admin = the dev-only Vite middleware
  writes the JSON file back. Never reintroduce API fetches for content.
- **Admin gate folds to a constant.** `client/src/lib/admin-enabled.ts` →
  `ADMIN_ENABLED = import.meta.env.DEV || import.meta.env.VITE_ENABLE_ADMIN === "true"`.
  `App.tsx` lazy-imports `@/admin/AdminApp` only when `ADMIN_ENABLED`, so a normal
  prod build tree-shakes the entire admin out. The admin has **no auth** and must
  never ship publicly. The deploy workflow greps `dist/public/assets` to assert
  the local-CMS code is absent.
- **No hardcoded user-visible text.** Per-section copy → `content/<entity>.json`.
  Fixed UI chrome (button labels, placeholders, empty states) → `t("…")` from
  `content/translations/es.json`. The site is Spanish-only — do not add bilingual
  ternaries.
- **Icons are content.** Store an `iconName` string; resolve via
  `client/src/lib/icons.ts` (`resolveIcon`). Never hardcode an icon-per-id switch.
- **Media is referenced by id.** Image fields store a media `id` from
  `content/media.json`; components resolve via `resolveMedia(id)` (`lib/media.ts`).
  Files live in `client/public/media/`.
- **Content↔admin completeness.** Every editable entity has: an admin page, a
  sidebar entry, an admin route, and a Content Versions download row — all driven
  by `client/src/lib/content-manifest.ts`. Adding an entity means updating the
  manifest + `content-store.ts` (`ENTITY_FILES` + `SEED`).

## Architecture / data flow

```
content/<entity>.json → repositories/content.repository.ts (typed) → services/*.service.ts → components/* (public, read-only)
content/translations/es.json → lib/i18n.ts t()
lib/brand-theme.ts applies themes.json + branding to :root (called from main.tsx initBrand())

admin/ (dev only):
  store/content-store.ts  Zustand: loads every content JSON, dirty tracking, save() → writeContentFile()
  store/ui-store.ts       publish state machine + sidebar
  lib/persist.ts          POSTs to /__cms/* (write, upload, delete-asset, publish, status)
  lib/media-usage.ts      findMediaUsage(id) scans all content for a media id (powers delete warnings)
  components/EntityShell   page header + floating save bound to entity key(s)
  components/ListEditor    generic ordered add/edit/remove/reorder
  components/fields.tsx    Text/TextArea/Number/StringList/MediaPicker/IconPicker
  pages/*                  one per entity + status/audit pages
vite-plugin-local-cms.ts   dev-only (apply:"serve") middleware; localhost only
```

## Content entities

`branding`, `themes`, `seo`, `navigation`, `hero`, `contact`, `footer`,
`history`, `milestones`, `historical-images`, `leadership`, `shields`,
`shield-values`, `gallery`, `media`, `translations`, plus generated `inventory`.

Leadership (`leadership.json`, 40 periods) was mapped from `Hoja11` of
*CUERPO DE BANDERAS L.C.R JEFATURAS.xlsx* — each JEFE grouped with its SUB JEFE
rows by year (`jefe` + `subjefes[]`).

## Commands

```bash
pnpm dev            # dev server + admin at /admin (uses local-CMS middleware)
pnpm build          # vite build → dist/public, then scripts/prerender.ts (SEO)
pnpm check          # tsc
pnpm gen:inventory  # rebuild content/inventory.json after adding/removing src files
```

Package manager is **pnpm** (`pnpm` lives at `/e/node-tooling/pnpm-bin/pnpm` on
this machine). Do not use npm; there is no package-lock.json.

## Adding a content entity (checklist)

1. Create `client/src/content/<entity>.json`.
2. Add it to `repositories/content.repository.ts` (import + type + `content`).
3. Add a service in `services/` if it needs derived/sorted data.
4. Consume it in the relevant public component (no hardcoded text/assets).
5. Register in `lib/content-manifest.ts` (CONTENT_ENTITIES).
6. Add it to `admin/store/content-store.ts` (`EntityKey`, `ENTITY_FILES`, `SEED`).
7. Build an admin page under `admin/pages/` and route it in `admin/AdminApp.tsx`.
8. `pnpm gen:inventory`, then `pnpm check` and `pnpm build`.

## Deploy / DNS

- `.github/workflows/deploy.yml`: pnpm install → `pnpm build` (VITE_ENABLE_ADMIN
  unset) → assert admin excluded → publish `dist/public` to GitHub Pages.
- Custom domain `banderas.jcampos.dev` is set via `client/public/CNAME` and DNS
  in the `jcampos.dev` Route53 hosted zone (AWS profile `J-CAMPOS`): a
  `_github-pages-challenge-chepelcr.banderas` TXT verification record and a CNAME
  for `banderas` → `chepelcr.github.io`.

## SEO

`scripts/prerender.ts` runs after build: emits per-route static HTML (title,
description, canonical, OG, JSON-LD) from `seo.json`, plus `sitemap.xml`,
`robots.txt`, and a noindex `404.html` that boots the SPA for deep links.
