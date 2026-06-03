import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, RotateCcw } from "lucide-react";
import { useContentStore, type EntityKey } from "@/admin/store/content-store";
import { useToast } from "@/hooks/use-toast";

/**
 * Wraps an entity edit page: a header (title + description) and a floating save
 * button bound to one or more content-store entity keys. Save writes the JSON
 * file(s) back via the local-CMS plugin.
 */
export function EntityShell({
  title,
  description,
  entityKeys,
  children,
}: {
  title: string;
  description?: string;
  entityKeys: EntityKey[];
  children: ReactNode;
}) {
  const store = useContentStore();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const dirty = entityKeys.some((k) => store.isDirty(k));

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const k of entityKeys) {
        if (store.isDirty(k)) await store.save(k);
      }
      toast({ title: "Guardado", description: "Los cambios se escribieron en el archivo de contenido." });
    } catch (e: any) {
      toast({ title: "Error al guardar", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    entityKeys.forEach((k) => store.reset(k));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-28">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>

      {children}

      {dirty && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border bg-card p-2 shadow-lg">
          <Button variant="ghost" size="sm" onClick={handleReset} className="hover-elevate" data-testid="button-reset">
            <RotateCcw className="h-4 w-4 mr-1" /> Descartar
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="hover-elevate" data-testid="button-save">
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
            Guardar
          </Button>
        </div>
      )}
    </div>
  );
}
