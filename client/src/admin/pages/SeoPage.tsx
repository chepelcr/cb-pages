import { EntityShell } from "@/admin/components/EntityShell";
import { TextField, TextAreaField, MediaPickerField } from "@/admin/components/fields";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useContentStore } from "@/admin/store/content-store";

export default function SeoPage() {
  const data = useContentStore((s) => s.data.seo);
  const setEntity = useContentStore((s) => s.setEntity);
  const update = (patch: Record<string, unknown>) => setEntity("seo", { ...data, ...patch });
  const updateRoute = (i: number, patch: Record<string, unknown>) => {
    const routes = [...data.routes];
    routes[i] = { ...routes[i], ...patch };
    update({ routes });
  };

  return (
    <EntityShell title="SEO y Metadatos" description="Títulos, descripciones e imagen social usados en el prerender y las etiquetas de cabecera." entityKeys={["seo"]}>
      <Card>
        <CardHeader><h3 className="font-semibold">General</h3></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Idioma" value={data.lang} onChange={(v) => update({ lang: v })} />
            <TextField label="URL del sitio" value={data.siteUrl} onChange={(v) => update({ siteUrl: v })} />
          </div>
          <TextField label="Título por defecto" value={data.defaultTitle} onChange={(v) => update({ defaultTitle: v })} />
          <TextField label="Plantilla de título (%s)" value={data.titleTemplate} onChange={(v) => update({ titleTemplate: v })} />
          <TextAreaField label="Descripción por defecto" value={data.defaultDescription} onChange={(v) => update({ defaultDescription: v })} />
          <MediaPickerField label="Imagen social (OG)" value={data.ogImage} onChange={(v) => update({ ogImage: v })} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><h3 className="font-semibold">Metadatos por página</h3></CardHeader>
        <CardContent className="space-y-4">
          {data.routes.map((route: any, i: number) => (
            <div key={route.path} className="border rounded-md p-3 space-y-3">
              <div className="text-xs uppercase text-muted-foreground">{route.path}</div>
              <TextField label="Título" value={route.title} onChange={(v) => updateRoute(i, { title: v })} />
              <TextAreaField label="Descripción" value={route.description} onChange={(v) => updateRoute(i, { description: v })} rows={2} />
            </div>
          ))}
        </CardContent>
      </Card>
    </EntityShell>
  );
}
