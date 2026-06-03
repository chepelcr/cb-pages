import { EntityShell } from "@/admin/components/EntityShell";
import { ListEditor, newId } from "@/admin/components/ListEditor";
import { TextField, TextAreaField, MediaPickerField } from "@/admin/components/fields";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContentStore } from "@/admin/store/content-store";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function GalleryAdminPage() {
  const data = useContentStore((s) => s.data.gallery);
  const setEntity = useContentStore((s) => s.setEntity);
  const update = (patch: Record<string, unknown>) => setEntity("gallery", { ...data, ...patch });

  return (
    <EntityShell title="Galería" description="Categorías e imágenes de la galería con filtro y modal." entityKeys={["gallery"]}>
      <Card>
        <CardHeader><h3 className="font-semibold">Textos de la sección</h3></CardHeader>
        <CardContent className="space-y-4">
          <TextField label="Etiqueta de sección" value={data.badge} onChange={(v) => update({ badge: v })} />
          <TextField label="Título" value={data.title} onChange={(v) => update({ title: v })} />
          <TextAreaField label="Descripción" value={data.description} onChange={(v) => update({ description: v })} />
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="font-semibold mb-3">Categorías</h3>
        <ListEditor
          items={data.categories}
          onChange={(categories) => update({ categories })}
          newItem={() => ({ id: newId("cat"), name: "", slug: "", order: 0 })}
          itemTitle={(it) => it.name || "Nueva categoría"}
          addLabel="Agregar categoría"
          renderItem={(item, upd) => (
            <>
              <TextField label="Nombre" value={item.name} onChange={(v) => upd({ name: v, slug: item.slug || slugify(v) })} />
              <TextField label="Slug" value={item.slug} onChange={(v) => upd({ slug: v })} />
            </>
          )}
        />
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-3">Imágenes</h3>
        <ListEditor
          items={data.items}
          onChange={(items) => update({ items })}
          newItem={() => ({ id: newId("gal"), title: "", description: "", image: "", thumbnail: "", categoryId: "", year: "", order: 0 })}
          itemTitle={(it) => it.title || "Nueva imagen"}
          addLabel="Agregar imagen"
          renderItem={(item, upd) => (
            <>
              <MediaPickerField label="Imagen" value={item.image} onChange={(v) => upd({ image: v })} />
              <MediaPickerField label="Miniatura (opcional)" value={item.thumbnail} onChange={(v) => upd({ thumbnail: v })} />
              <TextField label="Título" value={item.title} onChange={(v) => upd({ title: v })} />
              <TextAreaField label="Descripción" value={item.description} onChange={(v) => upd({ description: v })} />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select value={item.categoryId || "none"} onValueChange={(v) => upd({ categoryId: v === "none" ? "" : v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin categoría</SelectItem>
                      {data.categories.map((c: any) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <TextField label="Año" value={item.year} onChange={(v) => upd({ year: v })} />
              </div>
            </>
          )}
        />
      </div>
    </EntityShell>
  );
}
