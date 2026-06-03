import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import inventory from "@/content/inventory.json";

interface InventoryFile {
  path: string;
  type?: string;
  bytes?: number;
}

export default function InventoryPage() {
  const inv = inventory as { generatedAt: string; files: InventoryFile[] };
  const files = inv.files ?? [];

  const byType = files.reduce<Record<string, number>>((acc, f) => {
    const t = f.type ?? "other";
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventario del Proyecto</h1>
        <p className="text-muted-foreground mt-1">
          Archivos fuente registrados. Se regenera con <code>pnpm gen:inventory</code>.
          {inv.generatedAt ? ` Última generación: ${inv.generatedAt}.` : " Aún no se ha generado."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{files.length} archivos</Badge>
        {Object.entries(byType).map(([t, n]) => (
          <Badge key={t} variant="outline">{t}: {n}</Badge>
        ))}
      </div>

      <Card>
        <CardHeader><h3 className="font-semibold">Archivos</h3></CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground">El inventario está vacío. Ejecuta <code>pnpm gen:inventory</code>.</p>
          ) : (
            <ul className="text-xs font-mono space-y-1 max-h-[60vh] overflow-y-auto">
              {files.map((f) => (
                <li key={f.path} className="flex justify-between gap-3">
                  <span className="truncate">{f.path}</span>
                  {f.bytes != null && <span className="text-muted-foreground shrink-0">{f.bytes} B</span>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
