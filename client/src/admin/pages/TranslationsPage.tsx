import { EntityShell } from "@/admin/components/EntityShell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useContentStore } from "@/admin/store/content-store";

export default function TranslationsPage() {
  const data = useContentStore((s) => s.data.translations);
  const setEntity = useContentStore((s) => s.setEntity);

  const setValue = (section: string, key: string, value: string) => {
    setEntity("translations", {
      ...data,
      [section]: { ...data[section], [key]: value },
    });
  };

  return (
    <EntityShell title="Textos de Interfaz" description="Etiquetas fijas de la interfaz (botones, placeholders, estados vacíos). Agrupadas por sección." entityKeys={["translations"]}>
      {Object.entries(data).map(([section, entries]) => (
        <Card key={section} className="mb-4">
          <CardHeader><h3 className="font-semibold capitalize">{section}</h3></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(entries as Record<string, string>).map(([key, value]) => (
              <div key={key} className="grid grid-cols-[160px_1fr] items-center gap-3">
                <Label className="text-xs text-muted-foreground truncate" title={`${section}.${key}`}>{key}</Label>
                <Input value={value} onChange={(e) => setValue(section, key, e.target.value)} data-testid={`tr-${section}-${key}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </EntityShell>
  );
}
