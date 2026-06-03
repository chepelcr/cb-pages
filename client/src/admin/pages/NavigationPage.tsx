import { EntityShell } from "@/admin/components/EntityShell";
import { TextField } from "@/admin/components/fields";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { newId } from "@/admin/components/ListEditor";
import { useContentStore } from "@/admin/store/content-store";

export default function NavigationPage() {
  const data = useContentStore((s) => s.data.navigation);
  const setEntity = useContentStore((s) => s.setEntity);
  const update = (patch: Record<string, unknown>) => setEntity("navigation", { ...data, ...patch });

  const updateGroup = (gi: number, patch: Record<string, unknown>) => {
    const groups = [...data.groups];
    groups[gi] = { ...groups[gi], ...patch };
    update({ groups });
  };
  const updateGroupItem = (gi: number, ii: number, patch: Record<string, unknown>) => {
    const groups = [...data.groups];
    const items = [...groups[gi].items];
    items[ii] = { ...items[ii], ...patch };
    groups[gi] = { ...groups[gi], items };
    update({ groups });
  };

  return (
    <EntityShell title="Navegación" description="Menús desplegables y enlaces directos del encabezado." entityKeys={["navigation"]}>
      {data.groups.map((group: any, gi: number) => (
        <Card key={group.id} className="mb-4">
          <CardHeader><TextField label="Etiqueta del menú" value={group.label} onChange={(v) => updateGroup(gi, { label: v })} /></CardHeader>
          <CardContent className="space-y-3">
            {group.items.map((item: any, ii: number) => (
              <div key={item.id} className="flex gap-2 items-end">
                <div className="flex-1"><TextField label="Etiqueta" value={item.label} onChange={(v) => updateGroupItem(gi, ii, { label: v })} /></div>
                <div className="flex-1"><TextField label="Ruta" value={item.path} onChange={(v) => updateGroupItem(gi, ii, { path: v })} /></div>
                <Button variant="ghost" size="icon" onClick={() => updateGroup(gi, { items: group.items.filter((_: any, j: number) => j !== ii) })}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="hover-elevate" onClick={() => updateGroup(gi, { items: [...group.items, { id: newId("nav"), label: "", path: "/" }] })}>
              <Plus className="h-4 w-4 mr-1" /> Agregar elemento
            </Button>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader><h3 className="font-semibold">Enlaces directos</h3></CardHeader>
        <CardContent className="space-y-3">
          {data.direct.map((item: any, ii: number) => (
            <div key={item.id} className="flex gap-2 items-end">
              <div className="flex-1"><TextField label="Etiqueta" value={item.label} onChange={(v) => {
                const direct = [...data.direct]; direct[ii] = { ...item, label: v }; update({ direct });
              }} /></div>
              <div className="flex-1"><TextField label="Sección" value={item.sectionId || ""} onChange={(v) => {
                const direct = [...data.direct]; direct[ii] = { ...item, sectionId: v }; update({ direct });
              }} /></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </EntityShell>
  );
}
