import { EntityShell } from "@/admin/components/EntityShell";
import { ListEditor, newId } from "@/admin/components/ListEditor";
import { TextField, TextAreaField, IconPickerField } from "@/admin/components/fields";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SOCIAL_ICONS } from "@/lib/icons";
import { useContentStore } from "@/admin/store/content-store";

export default function FooterAdminPage() {
  const data = useContentStore((s) => s.data.footer);
  const setEntity = useContentStore((s) => s.setEntity);
  const update = (patch: Record<string, unknown>) => setEntity("footer", { ...data, ...patch });

  // quickLinks and social have no order field; adapt them to ListEditor by
  // attaching a transient order based on index.
  const withOrder = (arr: any[]) => arr.map((x, i) => ({ order: i, ...x }));
  const stripOrder = (arr: any[]) => arr.map(({ order, ...rest }) => rest);

  return (
    <EntityShell title="Pie de Página" description="Descripción, enlaces rápidos, contacto y redes sociales del pie de página." entityKeys={["footer"]}>
      <Card>
        <CardHeader><h3 className="font-semibold">Textos</h3></CardHeader>
        <CardContent className="space-y-4">
          <TextAreaField label="Descripción" value={data.description} onChange={(v) => update({ description: v })} />
          <TextField label="Título de enlaces" value={data.quickLinksTitle} onChange={(v) => update({ quickLinksTitle: v })} />
          <TextField label="Título de contacto" value={data.contactTitle} onChange={(v) => update({ contactTitle: v })} />
          <TextField label="Resumen de entrenamientos" value={data.trainingSummary} onChange={(v) => update({ trainingSummary: v })} />
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="font-semibold mb-3">Enlaces rápidos</h3>
        <ListEditor
          items={withOrder(data.quickLinks)}
          onChange={(items) => update({ quickLinks: stripOrder(items) })}
          newItem={() => ({ id: newId("fl"), label: "", path: "/", order: 0 })}
          itemTitle={(it) => it.label || "Nuevo enlace"}
          addLabel="Agregar enlace"
          renderItem={(item, upd) => (
            <>
              <TextField label="Etiqueta" value={item.label} onChange={(v) => upd({ label: v })} />
              <TextField label="Ruta" value={item.path} onChange={(v) => upd({ path: v })} />
              <TextField label="Sección (scroll, opcional)" value={item.sectionId || ""} onChange={(v) => upd({ sectionId: v })} />
            </>
          )}
        />
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-3">Redes sociales</h3>
        <ListEditor
          items={withOrder(data.social)}
          onChange={(items) => update({ social: stripOrder(items) })}
          newItem={() => ({ id: newId("social"), name: "", iconName: "Facebook", url: "", order: 0 })}
          itemTitle={(it) => it.name || "Nueva red"}
          addLabel="Agregar red social"
          renderItem={(item, upd) => (
            <>
              <TextField label="Nombre" value={item.name} onChange={(v) => upd({ name: v })} />
              <TextField label="URL" value={item.url} onChange={(v) => upd({ url: v })} />
              <IconPickerField label="Ícono" value={item.iconName} options={SOCIAL_ICONS} onChange={(v) => upd({ iconName: v })} />
            </>
          )}
        />
      </div>
    </EntityShell>
  );
}
