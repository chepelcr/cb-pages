import { create } from "zustand";
import { writeContentFile } from "@/admin/lib/persist";

// Statically-bundled current content (the same JSON the public site reads).
import branding from "@/content/branding.json";
import themes from "@/content/themes.json";
import seo from "@/content/seo.json";
import navigation from "@/content/navigation.json";
import hero from "@/content/hero.json";
import contact from "@/content/contact.json";
import footer from "@/content/footer.json";
import history from "@/content/history.json";
import milestones from "@/content/milestones.json";
import historicalImages from "@/content/historical-images.json";
import leadership from "@/content/leadership.json";
import shields from "@/content/shields.json";
import shieldValues from "@/content/shield-values.json";
import gallery from "@/content/gallery.json";
import media from "@/content/media.json";
import translations from "@/content/translations/es.json";

export type EntityKey =
  | "branding"
  | "themes"
  | "seo"
  | "navigation"
  | "hero"
  | "contact"
  | "footer"
  | "history"
  | "milestones"
  | "historical-images"
  | "leadership"
  | "shields"
  | "shield-values"
  | "gallery"
  | "media"
  | "translations";

/** Each editable entity -> the file the local-CMS plugin writes back to. */
export const ENTITY_FILES: Record<EntityKey, string> = {
  branding: "src/content/branding.json",
  themes: "src/content/themes.json",
  seo: "src/content/seo.json",
  navigation: "src/content/navigation.json",
  hero: "src/content/hero.json",
  contact: "src/content/contact.json",
  footer: "src/content/footer.json",
  history: "src/content/history.json",
  milestones: "src/content/milestones.json",
  "historical-images": "src/content/historical-images.json",
  leadership: "src/content/leadership.json",
  shields: "src/content/shields.json",
  "shield-values": "src/content/shield-values.json",
  gallery: "src/content/gallery.json",
  media: "src/content/media.json",
  translations: "src/content/translations/es.json",
};

const SEED: Record<EntityKey, unknown> = {
  branding,
  themes,
  seo,
  navigation,
  hero,
  contact,
  footer,
  history,
  milestones,
  "historical-images": historicalImages,
  leadership,
  shields,
  "shield-values": shieldValues,
  gallery,
  media,
  translations,
};

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

interface ContentState {
  data: Record<EntityKey, any>;
  pristine: Record<EntityKey, any>;
  saving: EntityKey | null;
  setEntity: (key: EntityKey, value: unknown) => void;
  /** Shallow-merge a patch into an object entity. */
  patchEntity: (key: EntityKey, patch: Record<string, unknown>) => void;
  isDirty: (key: EntityKey) => boolean;
  dirtyKeys: () => EntityKey[];
  anyDirty: () => boolean;
  save: (key: EntityKey) => Promise<void>;
  saveAll: () => Promise<void>;
  reset: (key: EntityKey) => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  data: clone(SEED) as Record<EntityKey, any>,
  pristine: clone(SEED) as Record<EntityKey, any>,
  saving: null,

  setEntity: (key, value) =>
    set((s) => ({ data: { ...s.data, [key]: clone(value) } })),

  patchEntity: (key, patch) =>
    set((s) => ({ data: { ...s.data, [key]: { ...s.data[key], ...patch } } })),

  isDirty: (key) =>
    JSON.stringify(get().data[key]) !== JSON.stringify(get().pristine[key]),

  dirtyKeys: () =>
    (Object.keys(get().data) as EntityKey[]).filter((k) => get().isDirty(k)),

  anyDirty: () => get().dirtyKeys().length > 0,

  save: async (key) => {
    set({ saving: key });
    try {
      await writeContentFile(ENTITY_FILES[key], get().data[key]);
      set((s) => ({ pristine: { ...s.pristine, [key]: clone(s.data[key]) } }));
    } finally {
      set({ saving: null });
    }
  },

  saveAll: async () => {
    for (const key of get().dirtyKeys()) {
      await get().save(key);
    }
  },

  reset: (key) =>
    set((s) => ({ data: { ...s.data, [key]: clone(s.pristine[key]) } })),
}));
