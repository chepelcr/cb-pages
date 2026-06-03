import { EntityShell } from "@/admin/components/EntityShell";
import { ListEditor, newId } from "@/admin/components/ListEditor";
import { TextField, TextAreaField, MediaPickerField, StringListField } from "@/admin/components/fields";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useContentStore } from "@/admin/store/content-store";

export default function LeadershipAdminPage() {
  const data = useContentStore((s) => s.data.leadership);
  const setEntity = useContentStore((s) => s.setEntity);
  const update = (patch: Record<string, unknown>) => setEntity("leadership", { ...data, ...patch });
  const setPeriods = (periods: any[]) => update({ periods });

  return (
    <EntityShell title="Jefaturas" description="Recorrido histórico de jefes y subjefes del Cuerpo de Banderas." entityKeys={["leadership"]}>
      <Card>
        <CardHeader><h3 className="font-semibold">Textos de la sección</h3></CardHeader>
        <CardContent className="space-y-4">
          <TextField label="Etiqueta de sección" value={data.badge} onChange={(v) => update({ badge: v })} />
          <TextField label="Título" value={data.title} onChange={(v) => update({ title: v })} />
          <TextAreaField label="Descripción (usa {foundingYear})" value={data.description} onChange={(v) => update({ description: v })} />
          <TextField label="Título del líder destacado" value={data.featuredTitle} onChange={(v) => update({ featuredTitle: v })} />
          <TextAreaField label="Descripción del líder destacado" value={data.featuredDescription} onChange={(v) => update({ featuredDescription: v })} />
          <MediaPickerField label="Imagen del líder destacado" value={data.featuredImage} onChange={(v) => update({ featuredImage: v })} />
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="font-semibold mb-3">Períodos ({data.periods.length})</h3>
        <ListEditor
          items={data.periods}
          onChange={setPeriods}
          newItem={() => ({ id: newId("jefatura"), year: "", jefe: "", subjefes: [] as string[], image: "", order: 0 })}
          itemTitle={(it) => `${it.year || "—"} · ${it.jefe || "Nuevo período"}`}
          addLabel="Agregar período"
          renderItem={(item, upd) => (
            <>
              <TextField label="Año" value={item.year} onChange={(v) => upd({ year: v })} />
              <TextField label="Jefe" value={item.jefe} onChange={(v) => upd({ jefe: v })} />
              <StringListField label="Subjefes" value={item.subjefes} onChange={(v) => upd({ subjefes: v })} />
              <MediaPickerField label="Foto (opcional)" value={item.image} onChange={(v) => upd({ image: v })} />
            </>
          )}
        />
      </div>
    </EntityShell>
  );
}
