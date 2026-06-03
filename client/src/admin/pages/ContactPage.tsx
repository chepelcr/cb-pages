import { EntityShell } from "@/admin/components/EntityShell";
import { TextField, TextAreaField, StringListField } from "@/admin/components/fields";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useContentStore } from "@/admin/store/content-store";

export default function ContactAdminPage() {
  const data = useContentStore((s) => s.data.contact);
  const setEntity = useContentStore((s) => s.setEntity);
  const update = (patch: Record<string, unknown>) => setEntity("contact", { ...data, ...patch });
  const updateMethod = (i: number, patch: Record<string, unknown>) => {
    const methods = [...data.methods];
    methods[i] = { ...methods[i], ...patch };
    update({ methods });
  };
  const updateSched = (key: string, patch: Record<string, unknown>) =>
    update({ schedules: { ...data.schedules, [key]: { ...data.schedules[key], ...patch } } });

  return (
    <EntityShell title="Contacto" description="Información de contacto, requisitos de ingreso y horarios." entityKeys={["contact"]}>
      <Card>
        <CardHeader><h3 className="font-semibold">Textos y datos</h3></CardHeader>
        <CardContent className="space-y-4">
          <TextField label="Etiqueta de sección" value={data.badge} onChange={(v) => update({ badge: v })} />
          <TextField label="Título" value={data.title} onChange={(v) => update({ title: v })} />
          <TextAreaField label="Descripción" value={data.description} onChange={(v) => update({ description: v })} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Email" value={data.email} onChange={(v) => update({ email: v })} />
            <TextField label="Teléfono" value={data.phone} onChange={(v) => update({ phone: v })} />
          </div>
          <TextAreaField label="Dirección (una línea por renglón)" value={data.address} onChange={(v) => update({ address: v })} rows={3} />
          <TextField label="Búsqueda en Google Maps" value={data.mapsQuery} onChange={(v) => update({ mapsQuery: v })} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><h3 className="font-semibold">Tarjetas de contacto</h3></CardHeader>
        <CardContent className="space-y-4">
          {data.methods.map((m: any, i: number) => (
            <div key={m.id} className="border rounded-md p-3 space-y-3">
              <div className="text-xs uppercase text-muted-foreground">{m.type}</div>
              <TextField label="Etiqueta" value={m.label} onChange={(v) => updateMethod(i, { label: v })} />
              <TextField label="Valor" value={m.value} onChange={(v) => updateMethod(i, { value: v })} />
              <TextField label="Descripción" value={m.description} onChange={(v) => updateMethod(i, { description: v })} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><h3 className="font-semibold">Proceso de ingreso</h3></CardHeader>
        <CardContent className="space-y-4">
          <TextField label="Etiqueta" value={data.admission.badge} onChange={(v) => update({ admission: { ...data.admission, badge: v } })} />
          <TextField label="Título" value={data.admission.title} onChange={(v) => update({ admission: { ...data.admission, title: v } })} />
          <StringListField label="Requisitos" value={data.admission.requirements} onChange={(v) => update({ admission: { ...data.admission, requirements: v } })} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><h3 className="font-semibold">Horarios</h3></CardHeader>
        <CardContent className="space-y-4">
          <TextField label="Etiqueta" value={data.schedules.badge} onChange={(v) => update({ schedules: { ...data.schedules, badge: v } })} />
          <TextField label="Título" value={data.schedules.title} onChange={(v) => update({ schedules: { ...data.schedules, title: v } })} />
          {(["training", "ceremonies", "meetings"] as const).map((key) => (
            <div key={key} className="border rounded-md p-3 space-y-3">
              <TextField label="Título" value={data.schedules[key].title} onChange={(v) => updateSched(key, { title: v })} />
              <TextField label="Horario" value={data.schedules[key].schedule} onChange={(v) => updateSched(key, { schedule: v })} />
              <TextField label={key === "ceremonies" ? "Notas" : "Ubicación"} value={key === "ceremonies" ? data.schedules[key].notes : data.schedules[key].location} onChange={(v) => updateSched(key, key === "ceremonies" ? { notes: v } : { location: v })} />
            </div>
          ))}
        </CardContent>
      </Card>
    </EntityShell>
  );
}
