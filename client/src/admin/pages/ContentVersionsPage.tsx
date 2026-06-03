import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { useContentStore, ENTITY_FILES, type EntityKey } from "@/admin/store/content-store";

/** Trigger a browser download of an object as a pretty-printed JSON file. */
function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2) + "\n"], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const LABELS: Record<EntityKey, string> = {
  branding: "Identidad / Marca",
  themes: "Tema y colores",
  seo: "SEO y metadatos",
  navigation: "Navegación",
  hero: "Portada (Hero)",
  contact: "Contacto",
  footer: "Pie de página",
  history: "Historia (textos)",
  milestones: "Hitos históricos",
  "historical-images": "Imágenes históricas",
  leadership: "Jefaturas",
  shields: "Escudos",
  "shield-values": "Valores del escudo",
  gallery: "Galería",
  media: "Biblioteca de medios",
  translations: "Textos de interfaz",
};

export default function ContentVersionsPage() {
  const store = useContentStore();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Versiones de Contenido</h1>
        <p className="text-muted-foreground mt-1">
          Descarga el estado actual (incluyendo cambios sin guardar) de cualquier archivo de contenido como respaldo o para versionarlo manualmente.
        </p>
      </div>

      <div className="space-y-2">
        {(Object.keys(ENTITY_FILES) as EntityKey[]).map((key) => {
          const file = ENTITY_FILES[key];
          const dirty = store.isDirty(key);
          return (
            <Card key={key}>
              <CardContent className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{LABELS[key]}</div>
                  <code className="text-xs text-muted-foreground">{file}</code>
                </div>
                <div className="flex items-center gap-2">
                  {dirty && <Badge variant="secondary">sin guardar</Badge>}
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover-elevate"
                    onClick={() => downloadJson(file.split("/").pop()!, store.data[key])}
                    data-testid={`download-${key}`}
                  >
                    <Download className="h-4 w-4 mr-1" /> Descargar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
