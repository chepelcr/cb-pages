import { EntityShell } from "@/admin/components/EntityShell";
import { ListEditor, newId } from "@/admin/components/ListEditor";
import { TextField, TextAreaField, MediaPickerField } from "@/admin/components/fields";
import { useContentStore } from "@/admin/store/content-store";

export default function HistoricalImagesPage() {
  const data = useContentStore((s) => s.data["historical-images"]);
  const setEntity = useContentStore((s) => s.setEntity);
  const setItems = (items: any[]) => setEntity("historical-images", { ...data, items });

  return (
    <EntityShell title="Imágenes Históricas" description="Galería de imágenes históricas que se muestran en la sección de historia." entityKeys={["historical-images"]}>
      <ListEditor
        items={data.items}
        onChange={setItems}
        newItem={() => ({ id: newId("histimg"), title: "", description: "", image: "", order: 0 })}
        itemTitle={(it) => it.title || "Nueva imagen"}
        addLabel="Agregar imagen"
        renderItem={(item, update) => (
          <>
            <MediaPickerField label="Imagen" value={item.image} onChange={(v) => update({ image: v })} />
            <TextField label="Título" value={item.title} onChange={(v) => update({ title: v })} />
            <TextAreaField label="Descripción" value={item.description} onChange={(v) => update({ description: v })} />
          </>
        )}
      />
    </EntityShell>
  );
}
