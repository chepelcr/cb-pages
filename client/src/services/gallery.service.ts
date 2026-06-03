import { content, type GalleryItem } from "@/repositories/content.repository";
import { t } from "@/lib/i18n";

export function getGalleryCopy() {
  return content.gallery;
}

export function getCategories() {
  return [...content.gallery.categories].sort((a, b) => a.order - b.order);
}

export function getItems(): GalleryItem[] {
  return [...content.gallery.items].sort((a, b) => a.order - b.order);
}

export interface CategoryWithCount {
  id: string;
  label: string;
  count: number;
}

export function getCategoriesWithCounts(): CategoryWithCount[] {
  const items = content.gallery.items;
  const all: CategoryWithCount = { id: "all", label: t("gallery.all"), count: items.length };
  const cats = getCategories().map((c) => ({
    id: c.id,
    label: c.name,
    count: items.filter((i) => i.categoryId === c.id).length,
  }));
  return [all, ...cats];
}

export function filterItems(selectedCategory: string): GalleryItem[] {
  const items = getItems();
  return selectedCategory === "all"
    ? items
    : items.filter((i) => i.categoryId === selectedCategory);
}

export function getCategoryName(categoryId: string | undefined): string {
  if (!categoryId) return "";
  return content.gallery.categories.find((c) => c.id === categoryId)?.name ?? "";
}
