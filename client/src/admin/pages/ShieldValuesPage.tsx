import { EntityShell } from "@/admin/components/EntityShell";
import { ListEditor, newId } from "@/admin/components/ListEditor";
import { TextField, TextAreaField, IconPickerField } from "@/admin/components/fields";
import { SHIELD_VALUE_ICONS } from "@/lib/icons";
import { useContentStore } from "@/admin/store/content-store";

export default function ShieldValuesPage() {
  const data = useContentStore((s) => s.data["shield-values"]);
  const setEntity = useContentStore((s) => s.setEntity);
  const setItems = (items: any[]) => setEntity("shield-values", { ...data, items });

  return (
    <EntityShell title="Valores del Escudo" description="Valores (Honor, Disciplina, etc.) mostrados junto a los escudos." entityKeys={["shield-values"]}>
      <ListEditor
        items={data.items}
        onChange={setItems}
        newItem={() => ({ id: newId("value"), title: "", description: "", iconName: "Award", order: 0 })}
        itemTitle={(it) => it.title || "Nuevo valor"}
        addLabel="Agregar valor"
        renderItem={(item, update) => (
          <>
            <TextField label="Título" value={item.title} onChange={(v) => update({ title: v })} />
            <TextAreaField label="Descripción" value={item.description} onChange={(v) => update({ description: v })} />
            <IconPickerField label="Ícono" value={item.iconName} options={SHIELD_VALUE_ICONS} onChange={(v) => update({ iconName: v })} />
          </>
        )}
      />
    </EntityShell>
  );
}
