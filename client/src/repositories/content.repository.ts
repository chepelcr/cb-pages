/**
 * Typed reader layer over the bundled content JSON. Public components never
 * import JSON directly — they go through a service, which reads from here.
 * There is NO runtime backend: every import below is statically bundled.
 */
import branding from "@/content/branding.json";
import hero from "@/content/hero.json";
import history from "@/content/history.json";
import milestones from "@/content/milestones.json";
import historicalImages from "@/content/historical-images.json";
import leadership from "@/content/leadership.json";
import shields from "@/content/shields.json";
import shieldValues from "@/content/shield-values.json";
import gallery from "@/content/gallery.json";
import contact from "@/content/contact.json";
import footer from "@/content/footer.json";
import navigation from "@/content/navigation.json";
import seo from "@/content/seo.json";

// ---- Types ----
export interface Branding {
  siteName: string;
  siteSubtitle: string;
  logo: string;
  favicon: string;
  foundingYear: number;
  traditionLabelPrefix: string;
}

export interface HeroCta {
  id: string;
  label: string;
  path: string;
  variant: "primary" | "outline";
}
export interface HeroStat {
  id: string;
  label: string;
  value: string;
  computed: string;
}
export interface Hero {
  backgroundImage: string;
  backgroundAlt: string;
  title: string;
  subtitle: string;
  description: string;
  ctas: HeroCta[];
  stats: HeroStat[];
}

export interface HistoryCopy {
  badge: string;
  titleSuffix: string;
  description: string;
  milestonesTitle: string;
  missionTitle: string;
  missionStatement: string;
}
export interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
}
export interface HistoricalImage {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
}

export interface LeadershipPeriod {
  id: string;
  year: string;
  jefe: string;
  subjefes: string[];
  image: string;
  order: number;
}
export interface Leadership {
  badge: string;
  title: string;
  description: string;
  featuredTitle: string;
  featuredDescription: string;
  featuredImage: string;
  periods: LeadershipPeriod[];
}

export interface ShieldItem {
  id: string;
  title: string;
  description: string;
  image: string;
  symbolism: string;
  isMain: boolean;
  order: number;
}
export interface Shields {
  badge: string;
  title: string;
  description: string;
  items: ShieldItem[];
}
export interface ShieldValue {
  id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
}
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  thumbnail: string;
  categoryId: string;
  year: string;
  order: number;
}
export interface Gallery {
  badge: string;
  title: string;
  description: string;
  categories: GalleryCategory[];
  items: GalleryItem[];
}

export interface ContactMethod {
  id: string;
  type: "location" | "phone" | "email" | "schedule";
  label: string;
  value: string;
  description: string;
}
export interface Contact {
  badge: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  mapsQuery: string;
  methods: ContactMethod[];
  admission: { badge: string; title: string; requirements: string[] };
  schedules: {
    badge: string;
    title: string;
    training: { title: string; schedule: string; location: string };
    ceremonies: { title: string; schedule: string; notes: string };
    meetings: { title: string; schedule: string; location: string };
  };
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  sectionId?: string;
}
export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}
export interface Navigation {
  groups: NavGroup[];
  direct: NavItem[];
}

export interface QuickLink {
  id: string;
  label: string;
  path: string;
  sectionId?: string;
}
export interface SocialLink {
  id: string;
  name: string;
  iconName: string;
  url: string;
}
export interface Footer {
  description: string;
  quickLinksTitle: string;
  quickLinks: QuickLink[];
  contactTitle: string;
  trainingSummary: string;
  social: SocialLink[];
}

export interface SeoRoute {
  path: string;
  title: string;
  description: string;
}
export interface Seo {
  lang: string;
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  ogImage: string;
  twitterCard: string;
  routes: SeoRoute[];
}

// ---- Typed accessors ----
export const content = {
  branding: branding as Branding,
  hero: hero as Hero,
  history: history as HistoryCopy,
  milestones: (milestones.items ?? []) as Milestone[],
  historicalImages: (historicalImages.items ?? []) as HistoricalImage[],
  leadership: leadership as Leadership,
  shields: shields as Shields,
  shieldValues: (shieldValues.items ?? []) as ShieldValue[],
  gallery: gallery as Gallery,
  contact: contact as Contact,
  footer: footer as Footer,
  navigation: navigation as Navigation,
  seo: seo as Seo,
};
