import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, UploadCloud, Save, ExternalLink, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useContentStore } from "@/admin/store/content-store";
import { useUiStore } from "@/admin/store/ui-store";
import { publish } from "@/admin/lib/persist";

export default function AdminTopbar() {
  const { theme, toggleTheme } = useTheme();
  const dirtyKeys = useContentStore((s) => s.dirtyKeys());
  const saveAll = useContentStore((s) => s.saveAll);
  const { publishState, publishMessage, setPublishState } = useUiStore();
  const [savingAll, setSavingAll] = useState(false);

  const handleSaveAll = async () => {
    setSavingAll(true);
    try {
      await saveAll();
    } catch (e) {
      // surfaced by per-page errors; keep topbar resilient
      console.error(e);
    } finally {
      setSavingAll(false);
    }
  };

  const handlePublish = async () => {
    setPublishState("publishing");
    try {
      if (dirtyKeys.length > 0) await saveAll();
      const res = await publish("chore(content): update site content via admin");
      setPublishState("done", res.output);
    } catch (e: any) {
      setPublishState("error", e?.message ?? "Error al publicar");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline">CMS local · solo desarrollo</Badge>
        {dirtyKeys.length > 0 && (
          <Badge variant="secondary" data-testid="badge-dirty-count">
            {dirtyKeys.length} sin guardar
          </Badge>
        )}
        {publishState === "done" && (
          <span className="flex items-center text-sm text-green-600"><CheckCircle2 className="h-4 w-4 mr-1" /> Publicado</span>
        )}
        {publishState === "error" && (
          <span className="flex items-center text-sm text-destructive" title={publishMessage}><AlertTriangle className="h-4 w-4 mr-1" /> Error</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover-elevate" data-testid="button-admin-theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <a href="/" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="hover-elevate" data-testid="button-view-site">
            <ExternalLink className="h-4 w-4 mr-1" /> Ver sitio
          </Button>
        </a>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveAll}
          disabled={dirtyKeys.length === 0 || savingAll}
          className="hover-elevate"
          data-testid="button-save-all"
        >
          {savingAll ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
          Guardar todo
        </Button>
        <Button
          size="sm"
          onClick={handlePublish}
          disabled={publishState === "publishing"}
          className="hover-elevate"
          data-testid="button-publish"
        >
          {publishState === "publishing" ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <UploadCloud className="h-4 w-4 mr-1" />}
          Publicar
        </Button>
      </div>
    </header>
  );
}
