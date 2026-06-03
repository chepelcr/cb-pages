/**
 * Single manifest of every editable content entity. The admin sidebar, the
 * admin router, the Content Versions download page, and the local-CMS write-back
 * all derive from this list, so adding an entity in one place keeps them in sync.
 *
 * `file` is the path (relative to the Vite root `client/`) the local-CMS plugin
 * writes back to. `route` is the admin sub-route under `/admin`.
 */
export interface ContentEntity {
  key: string;
  file: string;
  label: string;
  route: string;
  icon: string;
  group: string;
}

export const CONTENT_ENTITIES: ContentEntity[] = [
  // Identidad
  { key: "identity", file: "src/content/branding.json", label: "Identidad del Sitio", route: "/admin/identity", icon: "Shield", group: "Identidad" },
  { key: "seo", file: "src/content/seo.json", label: "SEO y Metadatos", route: "/admin/seo", icon: "Star", group: "Identidad" },
  { key: "navigation", file: "src/content/navigation.json", label: "Navegación", route: "/admin/navigation", icon: "Menu", group: "Identidad" },

  // Página principal
  { key: "hero", file: "src/content/hero.json", label: "Portada (Hero)", route: "/admin/hero", icon: "Flag", group: "Página" },
  { key: "contact", file: "src/content/contact.json", label: "Contacto", route: "/admin/contact", icon: "Phone", group: "Página" },
  { key: "footer", file: "src/content/footer.json", label: "Pie de Página", route: "/admin/footer", icon: "Layout", group: "Página" },

  // Historia
  { key: "history", file: "src/content/history.json", label: "Historia (textos)", route: "/admin/history", icon: "Calendar", group: "Historia" },
  { key: "milestones", file: "src/content/milestones.json", label: "Hitos Históricos", route: "/admin/milestones", icon: "Calendar", group: "Historia" },
  { key: "historical-images", file: "src/content/historical-images.json", label: "Imágenes Históricas", route: "/admin/historical-images", icon: "Camera", group: "Historia" },
  { key: "leadership", file: "src/content/leadership.json", label: "Jefaturas", route: "/admin/leadership", icon: "Crown", group: "Historia" },

  // Multimedia
  { key: "shields", file: "src/content/shields.json", label: "Escudos", route: "/admin/shields", icon: "Shield", group: "Multimedia" },
  { key: "shield-values", file: "src/content/shield-values.json", label: "Valores del Escudo", route: "/admin/shield-values", icon: "Award", group: "Multimedia" },
  { key: "gallery", file: "src/content/gallery.json", label: "Galería", route: "/admin/gallery", icon: "Camera", group: "Multimedia" },

  // Sistema
  { key: "media", file: "src/content/media.json", label: "Biblioteca de Medios", route: "/admin/media", icon: "Camera", group: "Sistema" },
  { key: "themes", file: "src/content/themes.json", label: "Tema y Apariencia", route: "/admin/identity", icon: "Star", group: "Sistema" },
  { key: "translations", file: "src/content/translations/es.json", label: "Textos de Interfaz", route: "/admin/translations", icon: "Layout", group: "Sistema" },
  { key: "inventory", file: "src/content/inventory.json", label: "Inventario", route: "/admin/inventory", icon: "Layout", group: "Sistema" },
];

export const CONTENT_GROUPS = ["Identidad", "Página", "Historia", "Multimedia", "Sistema"];

/** Files offered for download in the Content Versions page (one per JSON file). */
export const VERSIONED_FILES = Array.from(
  new Map(CONTENT_ENTITIES.map((e) => [e.file, e])).values(),
).map((e) => ({ file: e.file, label: e.label }));
