import { EntityShell } from "@/admin/components/EntityShell";
import { ListEditor, newId } from "@/admin/components/ListEditor";
import { TextField, TextAreaField, MediaPickerField } from "@/admin/components/fields";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useContentStore } from "@/admin/store/content-store";

export default function ShieldsAdminPage() {
  const data = useContentStore((s) => s.data.shields);
  const setEntity = useContentStore((s) => s.setEntity);
  const update = (patch: Record<string, unknown>) => setEntity("shields", { ...data, ...patch });

  const setMain = (id: string) =>
    update({ items: data.items.map((it: any) => ({ ...it, isMain: it.id === id })) });

  return (
    <EntityShell title="Escudos" description="Escudos e insignias. El escudo marcado como principal se muestra de forma destacada." entityKeys={["shields"]}>
      <Card>
        <CardHeader><h3 className="font-semibold">Textos de la sección</h3></CardHeader>
        <CardContent className="space-y-4">
          <TextField label="Etiqueta de sección" value={data.badge} onChange={(v) => update({ badge: v })} />
          <TextField label="Título" value={data.title} onChange={(v) => update({ title: v })} />
          <TextAreaField label="Descripción" value={data.description} onChange={(v) => update({ description: v })} />
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="font-semibold mb-3">Escudos</h3>
        <ListEditor
          items={data.items}
          onChange={(items) => update({ items })}
          newItem={() => ({ id: newId("shield"), title: "", description: "", image: "", symbolism: "", isMain: false, order: 0 })}
          itemTitle={(it) => it.title || "Nuevo escudo"}
          addLabel="Agregar escudo"
          renderItem={(item, upd) => (
            <>
              <div className="flex items-center gap-2">
                {item.isMain ? (
                  <Badge>Escudo Principal</Badge>
                ) : (
                  <Button variant="outline" size="sm" className="hover-elevate" onClick={() => setMain(item.id)} data-testid={`button-set-main-${item.id}`}>
                    Establecer como principal
                  </Button>
                )}
              </div>
              <MediaPickerField label="Imagen" value={item.image} onChange={(v) => upd({ image: v })} />
              <TextField label="Título" value={item.title} onChange={(v) => upd({ title: v })} />
              <TextAreaField label="Descripción" value={item.description} onChange={(v) => upd({ description: v })} />
              <TextAreaField label="Simbolismo (una línea por viñeta)" value={item.symbolism} onChange={(v) => upd({ symbolism: v })} rows={4} />
            </>
          )}
        />
      </div>
    </EntityShell>
  );
}
