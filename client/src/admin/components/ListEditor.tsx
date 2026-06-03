import { type ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export interface ListItem {
  id: string;
  order: number;
  [key: string]: unknown;
}

/**
 * Generic ordered list editor: renders each item as a card with the fields
 * supplied by `renderItem`, plus add / remove / move-up / move-down. Items are
 * shown sorted by `order`; reordering rewrites the `order` fields.
 */
export function ListEditor<T extends ListItem>({
  items,
  onChange,
  newItem,
  renderItem,
  itemTitle,
  addLabel = "Agregar",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  itemTitle: (item: T, index: number) => string;
  addLabel?: string;
}) {
  const sorted = [...items].sort((a, b) => a.order - b.order);

  const update = (id: string, patch: Partial<T>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const remove = (id: string) => onChange(items.filter((it) => it.id !== id));

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((it, i) => ({ ...it, order: i })));
  };

  const add = () => {
    const item = newItem();
    onChange([...items, { ...item, order: items.length }]);
  };

  return (
    <div className="space-y-4">
      {sorted.map((item, index) => (
        <Card key={item.id} data-testid={`list-item-${item.id}`}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 py-3">
            <span className="font-medium truncate">{itemTitle(item, index)}</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" disabled={index === 0} onClick={() => move(index, -1)} data-testid={`button-up-${item.id}`}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" disabled={index === sorted.length - 1} onClick={() => move(index, 1)} data-testid={`button-down-${item.id}`}>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(item.id)} data-testid={`button-delete-${item.id}`}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderItem(item, (patch) => update(item.id, patch))}
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={add} className="hover-elevate" data-testid="button-add-item">
        <Plus className="h-4 w-4 mr-1" /> {addLabel}
      </Button>
    </div>
  );
}

/** Generate a reasonably-unique id for a new list item without Math.random. */
export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`;
}
