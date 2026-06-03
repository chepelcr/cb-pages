import { content, type ShieldItem } from "@/repositories/content.repository";

export function getShieldsCopy() {
  return content.shields;
}

export function getShields(): ShieldItem[] {
  return [...content.shields.items].sort((a, b) => a.order - b.order);
}

export function getMainShield(): ShieldItem | undefined {
  const items = content.shields.items;
  return items.find((s) => s.isMain) ?? items[0];
}

export function getSymbolismLines(symbolism: string | undefined): string[] {
  if (!symbolism) return [];
  return symbolism
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function getShieldValues() {
  return [...content.shieldValues].sort((a, b) => a.order - b.order);
}
