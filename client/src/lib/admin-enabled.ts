/**
 * Single source of truth for whether the admin panel exists in this build.
 *
 * In a normal production build (`vite build` with VITE_ENABLE_ADMIN unset) this
 * folds to the constant `false`, so the admin router never registers, the navbar
 * hides the link, and Rollup tree-shakes the entire admin panel out of the bundle.
 *
 * The admin has NO authentication and must NEVER ship publicly. It is a local,
 * dev-only CMS that writes content JSON back to disk via the local-CMS Vite plugin.
 */
export const ADMIN_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_ADMIN === "true";
