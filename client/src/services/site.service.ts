import { content } from "@/repositories/content.repository";

export function getBranding() {
  return content.branding;
}

export function getFoundingYear(): number {
  return content.branding.foundingYear;
}

export function getYearsOfTradition(): number {
  return new Date().getFullYear() - content.branding.foundingYear;
}

export function getHero() {
  const hero = content.hero;
  const years = getYearsOfTradition();
  const stats = hero.stats.map((s) => ({
    ...s,
    value: s.computed === "yearsOfTradition" ? `${years}+` : s.value,
  }));
  return { ...hero, stats };
}

export function getContact() {
  return content.contact;
}

export function getFooter() {
  return content.footer;
}

export function getNavigation() {
  return content.navigation;
}

export function getSeo() {
  return content.seo;
}

/** Replace {foundingYear} / {years} tokens in editable copy. */
export function interpolateYears(template: string): string {
  return template
    .replace(/\{foundingYear\}/g, String(getFoundingYear()))
    .replace(/\{years\}/g, String(getYearsOfTradition()));
}
