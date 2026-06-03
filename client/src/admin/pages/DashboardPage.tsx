import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useContentStore } from "@/admin/store/content-store";
import { CONTENT_ENTITIES } from "@/lib/content-manifest";
import { resolveIcon } from "@/lib/icons";

export default function DashboardPage() {
  const data = useContentStore((s) => s.data);
  const dirtyKeys = useContentStore((s) => s.dirtyKeys());

  const stats = [
    { label: "Hitos históricos", value: data.milestones.items.length },
    { label: "Imágenes históricas", value: data["historical-images"].items.length },
    { label: "Jefaturas", value: data.leadership.periods.length },
    { label: "Escudos", value: data.shields.items.length },
    { label: "Valores del escudo", value: data["shield-values"].items.length },
    { label: "Categorías de galería", value: data.gallery.categories.length },
    { label: "Imágenes de galería", value: data.gallery.items.length },
    { label: "Archivos de medios", value: data.media.items.length },
  ];

  const groups = Array.from(new Set(CONTENT_ENTITIES.map((e) => e.group)));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground mt-1">
          CMS local del Cuerpo de Banderas. Edita el contenido, guárdalo en los archivos JSON y publica para desplegar en GitHub Pages.
        </p>
        {dirtyKeys.length > 0 && (
          <Badge variant="secondary" className="mt-2">{dirtyKeys.length} sección(es) con cambios sin guardar</Badge>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups.map((group) => (
        <div key={group} className="mb-6">
          <h2 className="text-sm uppercase tracking-wide text-muted-foreground mb-2">{group}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from(new Map(CONTENT_ENTITIES.filter((e) => e.group === group).map((e) => [e.route, e])).values()).map((e) => {
              const Icon = resolveIcon(e.icon);
              return (
                <Link key={e.route} href={e.route}>
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardHeader className="flex flex-row items-center gap-3 py-4">
                      <div className="p-2 bg-primary/10 rounded-lg"><Icon className="h-5 w-5 text-primary" /></div>
                      <span className="font-medium">{e.label}</span>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
