import { useRef, useState } from "react";
import { EntityShell } from "@/admin/components/EntityShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Upload, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useContentStore } from "@/admin/store/content-store";
import { useToast } from "@/hooks/use-toast";
import { findMediaUsage, type MediaUsage } from "@/admin/lib/media-usage";
import { uploadAsset, deleteAsset } from "@/admin/lib/persist";
import { newId } from "@/admin/components/ListEditor";
import type { MediaItem } from "@/lib/media";

export default function MediaPage() {
  const data = useContentStore((s) => s.data.media);
  const allData = useContentStore((s) => s.data);
  const setEntity = useContentStore((s) => s.setEntity);
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ item: MediaItem; usages: MediaUsage[] } | null>(null);

  const items: MediaItem[] = data.items;
  const setItems = (next: MediaItem[]) => setEntity("media", { ...data, items: next });

  const updateItem = (id: string, patch: Partial<MediaItem>) =>
    setItems(items.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
      const { src } = await uploadAsset(safeName, dataUrl);
      const id = newId("media");
      setItems([
        ...items,
        { id, src, name: file.name.replace(/\.[^.]+$/, ""), alt: "", type: file.type || "image/*" },
      ]);
      toast({ title: "Imagen subida", description: `${src} — recuerda Guardar para registrar el cambio.` });
    } catch (e: any) {
      toast({ title: "Error al subir", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const requestDelete = (item: MediaItem) => {
    const usages = findMediaUsage(item.id, allData);
    setPendingDelete({ item, usages });
  };

  const confirmDelete = async (alsoDeleteFile: boolean) => {
    if (!pendingDelete) return;
    const { item } = pendingDelete;
    setItems(items.filter((m) => m.id !== item.id));
    if (alsoDeleteFile) {
      try {
        await deleteAsset(item.src);
      } catch {
        /* file may be referenced elsewhere; ignore */
      }
    }
    setPendingDelete(null);
  };

  return (
    <EntityShell title="Biblioteca de Medios" description="Todas las imágenes usadas en el sitio. Cada tarjeta muestra cuántas veces se usa." entityKeys={["media"]}>
      <div className="mb-4 flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          data-testid="input-media-upload"
        />
        <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="hover-elevate" data-testid="button-upload-media">
          {uploading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
          Subir imagen
        </Button>
        <span className="text-sm text-muted-foreground">{items.length} archivos</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const count = findMediaUsage(item.id, allData).length;
          return (
            <Card key={item.id} data-testid={`media-card-${item.id}`}>
              <img src={item.src} alt={item.alt} className="h-40 w-full object-contain bg-muted/30" />
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs text-muted-foreground truncate">{item.id}</code>
                  {count > 0 ? (
                    <Badge variant="secondary" data-testid={`usage-${item.id}`}>{count} uso{count === 1 ? "" : "s"}</Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">sin uso</Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Nombre</Label>
                  <Input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Texto alternativo</Label>
                  <Input value={item.alt} onChange={(e) => updateItem(item.id, { alt: e.target.value })} />
                </div>
                <Button variant="ghost" size="sm" className="text-destructive w-full hover-elevate" onClick={() => requestDelete(item)} data-testid={`button-delete-media-${item.id}`}>
                  <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {pendingDelete && pendingDelete.usages.length > 0 && <AlertTriangle className="h-5 w-5 text-destructive" />}
              Eliminar "{pendingDelete?.item.name}"
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                {pendingDelete && pendingDelete.usages.length > 0 ? (
                  <>
                    <p className="text-destructive font-medium">
                      ⚠️ Esta imagen se usa en {pendingDelete.usages.length} lugar(es). Si la eliminas, esas secciones del sitio quedarán sin imagen (se romperán):
                    </p>
                    <ul className="list-disc pl-5 text-sm max-h-40 overflow-y-auto">
                      {pendingDelete.usages.map((u, i) => (
                        <li key={i}><strong>{u.label}</strong> · <code>{u.path}</code></li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>Esta imagen no se usa en ninguna parte del sitio. Es seguro eliminarla.</p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDelete(true)} className="bg-destructive text-destructive-foreground" data-testid="button-confirm-delete">
              Eliminar de todos modos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </EntityShell>
  );
}
