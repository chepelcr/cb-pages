import { content, type LeadershipPeriod } from "@/repositories/content.repository";

export function getLeadership() {
  return content.leadership;
}

export function getPeriods(): LeadershipPeriod[] {
  return [...content.leadership.periods].sort((a, b) => a.order - b.order);
}

function firstYear(year: string): number {
  const match = year.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : 0;
}

export interface PeriodQuery {
  search: string;
  sortOrder: "asc" | "desc";
}

export function filterAndSortPeriods(
  periods: LeadershipPeriod[],
  { search, sortOrder }: PeriodQuery,
): LeadershipPeriod[] {
  const term = search.trim().toLowerCase();
  const filtered = term
    ? periods.filter((p) => {
        const haystack = [p.year, p.jefe, ...p.subjefes].join(" ").toLowerCase();
        return haystack.includes(term);
      })
    : periods;
  return [...filtered].sort((a, b) =>
    sortOrder === "asc"
      ? firstYear(a.year) - firstYear(b.year)
      : firstYear(b.year) - firstYear(a.year),
  );
}

export function getLeadershipStats() {
  const periods = content.leadership.periods;
  const leaders = new Set(periods.map((p) => p.jefe)).size;
  return {
    years: new Date().getFullYear() - content.branding.foundingYear,
    leaders,
    periods: periods.length,
  };
}
