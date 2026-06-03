import { EntityShell } from "@/admin/components/EntityShell";
import { TextField, TextAreaField } from "@/admin/components/fields";
import { Card, CardContent } from "@/components/ui/card";
import { useContentStore } from "@/admin/store/content-store";

export default function HistoryCopyPage() {
  const data = useContentStore((s) => s.data.history);
  const setEntity = useContentStore((s) => s.setEntity);
  const update = (patch: Record<string, unknown>) => setEntity("history", { ...data, ...patch });

  return (
    <EntityShell title="Historia (textos)" description="Textos de la sección de historia. Los hitos y las imágenes se gestionan en sus propias páginas." entityKeys={["history"]}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <TextField label="Etiqueta de sección" value={data.badge} onChange={(v) => update({ badge: v })} />
          <TextField label="Sufijo del título (tras los años)" value={data.titleSuffix} onChange={(v) => update({ titleSuffix: v })} />
          <TextAreaField label="Descripción (usa {foundingYear})" value={data.description} onChange={(v) => update({ description: v })} />
          <TextField label="Título de hitos" value={data.milestonesTitle} onChange={(v) => update({ milestonesTitle: v })} />
          <TextField label="Título de la misión" value={data.missionTitle} onChange={(v) => update({ missionTitle: v })} />
          <TextAreaField label="Declaración de misión" value={data.missionStatement} onChange={(v) => update({ missionStatement: v })} rows={5} />
        </CardContent>
      </Card>
    </EntityShell>
  );
}
