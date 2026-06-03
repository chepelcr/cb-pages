import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { useContentStore } from "@/admin/store/content-store";
import { usageCounts } from "@/admin/lib/media-usage";
import { gitStatus } from "@/admin/lib/persist";
import type { MediaItem } from "@/lib/media";

export default function DiagnosticsPage() {
  const data = useContentStore((s) => s.data);
  const dirtyKeys = useContentStore((s) => s.dirtyKeys());
  const [git, setGit] = useState<{ dirty: boolean; status: string; log: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setGit(await gitStatus());
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const media: MediaItem[] = data.media.items;
  const counts = usageCounts(media.map((m) => m.id), data);
  const orphans = media.filter((m) => counts[m.id] === 0);

  const checks = [
    { ok: dirtyKeys.length === 0, label: dirtyKeys.length === 0 ? "Todo el contenido está guardado" : `${dirtyKeys.length} sección(es) con cambios sin guardar` },
    { ok: orphans.length === 0, label: orphans.length === 0 ? "Todas las imágenes están en uso" : `${orphans.length} imagen(es) sin uso en la biblioteca` },
    { ok: data.shields.items.some((s: any) => s.isMain), label: data.shields.items.some((s: any) => s.isMain) ? "Hay un escudo principal definido" : "No hay un escudo marcado como principal" },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Diagnóstico</h1>
          <p className="text-muted-foreground mt-1">Estado del repositorio y comprobaciones de salud del contenido.</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="hover-elevate" data-testid="button-refresh-diagnostics">
          <RefreshCw className="h-4 w-4 mr-1" /> Actualizar
        </Button>
      </div>

      <Card>
        <CardHeader><h3 className="font-semibold">Comprobaciones de salud</h3></CardHeader>
        <CardContent className="space-y-2">
          {checks.map((c, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              {c.ok ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
              <span>{c.label}</span>
            </div>
          ))}
          {orphans.length > 0 && (
            <ul className="list-disc pl-6 text-xs text-muted-foreground pt-1">
              {orphans.map((o) => <li key={o.id}><code>{o.id}</code> — {o.name}</li>)}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="font-semibold">Estado de Git</h3>
          {git && <Badge variant={git.dirty ? "secondary" : "outline"}>{git.dirty ? "cambios pendientes" : "limpio"}</Badge>}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center text-muted-foreground text-sm"><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Consultando…</div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : git ? (
            <>
              <p className="text-xs uppercase text-muted-foreground mb-1">git status</p>
              <pre className="text-xs bg-muted/40 rounded p-3 overflow-x-auto whitespace-pre-wrap">{git.status || "(sin cambios)"}</pre>
              <p className="text-xs uppercase text-muted-foreground mt-3 mb-1">commits recientes</p>
              <pre className="text-xs bg-muted/40 rounded p-3 overflow-x-auto whitespace-pre-wrap">{git.log}</pre>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
