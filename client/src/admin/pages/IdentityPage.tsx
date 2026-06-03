import { EntityShell } from "@/admin/components/EntityShell";
import { TextField, NumberField, MediaPickerField } from "@/admin/components/fields";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useContentStore } from "@/admin/store/content-store";
import { applyTheme } from "@/lib/brand-theme";

const PALETTE_KEYS: { key: string; label: string }[] = [
  { key: "primary", label: "Primario (marca)" },
  { key: "background", label: "Fondo" },
  { key: "foreground", label: "Texto" },
  { key: "accent", label: "Acento" },
];

export default function IdentityPage() {
  const branding = useContentStore((s) => s.data.branding);
  const themes = useContentStore((s) => s.data.themes);
  const setEntity = useContentStore((s) => s.setEntity);

  const updateBranding = (patch: Record<string, unknown>) => setEntity("branding", { ...branding, ...patch });

  const active = themes.themes.find((t: any) => t.id === themes.activeTheme) ?? themes.themes[0];
  const activeIndex = themes.themes.findIndex((t: any) => t.id === active.id);

  const updatePalette = (mode: "light" | "dark", key: string, value: string) => {
    const next = JSON.parse(JSON.stringify(themes));
    next.themes[activeIndex][mode][key] = value;
    setEntity("themes", next);
    applyTheme(next); // live preview
  };

  return (
    <EntityShell title="Identidad del Sitio" description="Nombre, logo, favicon y colores del tema. Los cambios de color se previsualizan al instante." entityKeys={["branding", "themes"]}>
      <Card>
        <CardHeader><h3 className="font-semibold">Marca</h3></CardHeader>
        <CardContent className="space-y-4">
          <TextField label="Nombre del sitio" value={branding.siteName} onChange={(v) => updateBranding({ siteName: v })} />
          <TextField label="Subtítulo" value={branding.siteSubtitle} onChange={(v) => updateBranding({ siteSubtitle: v })} />
          <TextField label="Prefijo de tradición" value={branding.traditionLabelPrefix} onChange={(v) => updateBranding({ traditionLabelPrefix: v })} />
          <NumberField label="Año de fundación" value={branding.foundingYear} onChange={(v) => updateBranding({ foundingYear: v })} />
          <MediaPickerField label="Logo" value={branding.logo} onChange={(v) => updateBranding({ logo: v })} />
          <MediaPickerField label="Favicon" value={branding.favicon} onChange={(v) => updateBranding({ favicon: v })} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <h3 className="font-semibold">Colores del tema</h3>
          <p className="text-sm text-muted-foreground">Valores HSL sin la función <code>hsl()</code>, p. ej. <code>9 75% 61%</code>.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {PALETTE_KEYS.map(({ key, label }) => (
            <div key={key} className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{label} · claro</Label>
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 rounded border" style={{ background: `hsl(${active.light[key]})` }} />
                  <input className="flex-1 rounded border bg-background px-3 py-2 text-sm" value={active.light[key]} onChange={(e) => updatePalette("light", key, e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{label} · oscuro</Label>
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 rounded border" style={{ background: `hsl(${active.dark[key]})` }} />
                  <input className="flex-1 rounded border bg-background px-3 py-2 text-sm" value={active.dark[key]} onChange={(e) => updatePalette("dark", key, e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </EntityShell>
  );
}
