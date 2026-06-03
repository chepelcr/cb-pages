import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useContentStore, type EntityKey } from "@/admin/store/content-store";

export default function ContentExplorerPage() {
  const data = useContentStore((s) => s.data);
  const isDirty = useContentStore((s) => s.isDirty);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const keys = Object.keys(data) as EntityKey[];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-3">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Explorador de Contenido</h1>
        <p className="text-muted-foreground mt-1">Vista de solo lectura del JSON actual de cada entidad (incluye cambios sin guardar).</p>
      </div>

      {keys.map((key) => (
        <Card key={key}>
          <CardHeader
            className="flex flex-row items-center gap-2 py-3 cursor-pointer"
            onClick={() => setOpen((o) => ({ ...o, [key]: !o[key] }))}
            data-testid={`explorer-${key}`}
          >
            {open[key] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="font-mono text-sm">{key}</span>
            {isDirty(key) && <Badge variant="secondary">sin guardar</Badge>}
          </CardHeader>
          {open[key] && (
            <CardContent>
              <pre className="text-xs bg-muted/40 rounded p-3 overflow-x-auto max-h-[50vh] overflow-y-auto">
                {JSON.stringify(data[key], null, 2)}
              </pre>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
