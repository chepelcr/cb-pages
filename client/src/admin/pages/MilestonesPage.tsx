import { EntityShell } from "@/admin/components/EntityShell";
import { ListEditor, newId } from "@/admin/components/ListEditor";
import { TextField, TextAreaField, IconPickerField } from "@/admin/components/fields";
import { MILESTONE_ICONS } from "@/lib/icons";
import { useContentStore } from "@/admin/store/content-store";

export default function MilestonesPage() {
  const data = useContentStore((s) => s.data.milestones);
  const setEntity = useContentStore((s) => s.setEntity);
  const setItems = (items: any[]) => setEntity("milestones", { ...data, items });

  return (
    <EntityShell title="Hitos Históricos" description="Línea de tiempo de hitos importantes. Arrastra con las flechas para reordenar." entityKeys={["milestones"]}>
      <ListEditor
        items={data.items}
        onChange={setItems}
        newItem={() => ({ id: newId("milestone"), year: "", title: "", description: "", iconName: "Flag", order: 0 })}
        itemTitle={(it) => `${it.year || "—"} · ${it.title || "Nuevo hito"}`}
        addLabel="Agregar hito"
        renderItem={(item, update) => (
          <>
            <TextField label="Año" value={item.year} onChange={(v) => update({ year: v })} />
            <TextField label="Título" value={item.title} onChange={(v) => update({ title: v })} />
            <TextAreaField label="Descripción" value={item.description} onChange={(v) => update({ description: v })} />
            <IconPickerField label="Ícono" value={item.iconName} options={MILESTONE_ICONS} onChange={(v) => update({ iconName: v })} />
          </>
        )}
      />
    </EntityShell>
  );
}
