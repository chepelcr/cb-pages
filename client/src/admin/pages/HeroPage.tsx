import { EntityShell } from "@/admin/components/EntityShell";
import { TextField, TextAreaField, MediaPickerField } from "@/admin/components/fields";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useContentStore } from "@/admin/store/content-store";

export default function HeroPage() {
  const data = useContentStore((s) => s.data.hero);
  const setEntity = useContentStore((s) => s.setEntity);
  const update = (patch: Record<string, unknown>) => setEntity("hero", { ...data, ...patch });

  return (
    <EntityShell title="Portada (Hero)" description="Sección principal: imagen de fondo, título, descripción, botones y estadísticas." entityKeys={["hero"]}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <MediaPickerField label="Imagen de fondo" value={data.backgroundImage} onChange={(v) => update({ backgroundImage: v })} />
          <TextField label="Texto alternativo de la imagen" value={data.backgroundAlt} onChange={(v) => update({ backgroundAlt: v })} />
          <TextField label="Título" value={data.title} onChange={(v) => update({ title: v })} />
          <TextField label="Subtítulo" value={data.subtitle} onChange={(v) => update({ subtitle: v })} />
          <TextAreaField label="Descripción" value={data.description} onChange={(v) => update({ description: v })} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><h3 className="font-semibold">Botones de acción</h3></CardHeader>
        <CardContent className="space-y-4">
          {data.ctas.map((cta: any, i: number) => (
            <div key={cta.id} className="grid grid-cols-2 gap-3 border rounded-md p-3">
              <TextField label="Etiqueta" value={cta.label} onChange={(v) => {
                const ctas = [...data.ctas]; ctas[i] = { ...cta, label: v }; update({ ctas });
              }} />
              <TextField label="Ruta" value={cta.path} onChange={(v) => {
                const ctas = [...data.ctas]; ctas[i] = { ...cta, path: v }; update({ ctas });
              }} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><h3 className="font-semibold">Estadísticas</h3></CardHeader>
        <CardContent className="space-y-4">
          {data.stats.map((stat: any, i: number) => (
            <div key={stat.id} className="grid grid-cols-2 gap-3 border rounded-md p-3">
              <TextField label="Etiqueta" value={stat.label} onChange={(v) => {
                const stats = [...data.stats]; stats[i] = { ...stat, label: v }; update({ stats });
              }} />
              <div className="space-y-2">
                <Label>Valor {stat.computed ? <Badge variant="secondary" className="ml-1">automático</Badge> : null}</Label>
                <Input value={stat.value} disabled={!!stat.computed} placeholder={stat.computed ? "Se calcula automáticamente" : ""} onChange={(e) => {
                  const stats = [...data.stats]; stats[i] = { ...stat, value: e.target.value }; update({ stats });
                }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </EntityShell>
  );
}
