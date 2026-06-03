import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, ImageOff } from "lucide-react";
import { ICONS, resolveIcon } from "@/lib/icons";
import { useContentStore } from "@/admin/store/content-store";
import { resolveMedia, type MediaItem } from "@/lib/media";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea value={value ?? ""} rows={rows} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/** Edit an array of strings, one row each (used for admission requirements etc). */
export function StringListField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const list = value ?? [];
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {list.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const next = [...list];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChange(list.filter((_, j) => j !== i))}
              data-testid={`button-remove-item-${i}`}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...list, ""])} className="hover-elevate">
          <Plus className="h-4 w-4 mr-1" /> Agregar
        </Button>
      </div>
    </div>
  );
}

/** Pick an icon name from the shared icon registry. */
export function IconPickerField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((name) => {
          const Icon = resolveIcon(name);
          const active = value === name;
          return (
            <Button
              key={name}
              type="button"
              variant={active ? "default" : "outline"}
              size="sm"
              className="hover-elevate"
              onClick={() => onChange(name)}
              data-testid={`icon-${name}`}
            >
              <Icon className="h-4 w-4 mr-1" />
              {name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

/** Pick a media item (or clear). Reads live media list from the content store. */
export function MediaPickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const mediaItems = useContentStore((s) => s.data.media.items as MediaItem[]);
  const current = mediaItems.find((m) => m.id === value);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 rounded border bg-muted/30 flex items-center justify-center overflow-hidden">
          {current ? (
            <img src={resolveMedia(value, mediaItems)} alt={current.alt} className="h-full w-full object-contain" />
          ) : (
            <ImageOff className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 text-sm text-muted-foreground truncate">
          {current ? current.name : "Sin imagen seleccionada"}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="hover-elevate" data-testid="button-pick-media">
              Elegir
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Biblioteca de Medios</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto">
              {mediaItems.map((m) => (
                <Card
                  key={m.id}
                  className={`cursor-pointer overflow-hidden hover-elevate ${value === m.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => {
                    onChange(m.id);
                    setOpen(false);
                  }}
                  data-testid={`media-option-${m.id}`}
                >
                  <img src={m.src} alt={m.alt} className="h-24 w-full object-cover" />
                  <div className="p-2 text-xs truncate">{m.name}</div>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
        {value && (
          <Button variant="ghost" size="icon" onClick={() => onChange("")} data-testid="button-clear-media">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}
