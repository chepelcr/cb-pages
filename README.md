# Cuerpo de Banderas — Liceo de Costa Rica

Sitio web oficial del Cuerpo de Banderas del Liceo de Costa Rica. Es una
**SPA 100% estática** (React + Vite) que se publica en **GitHub Pages** y se
edita mediante un **panel de administración local** (CMS solo para desarrollo).
No hay servidor, ni base de datos, ni AWS, ni Cognito: **todo el contenido vive
en archivos JSON** que se empaquetan en tiempo de compilación.

🌐 Producción: <https://banderas.jcampos.dev>

## Arquitectura

```
JSON de contenido        capa de lectura        lógica            UI pública
client/src/content/*.json → repositories/  →  services/  →  components/*  (solo lectura)
client/src/content/translations/es.json   (textos fijos de interfaz vía t())

ADMIN (solo dev, se elimina del build de producción por tree-shaking):
  store Zustand carga todo el JSON → edita en memoria → "Guardar" reescribe el archivo
  vite-plugin-local-cms (apply:"serve") → write-back / subida de medios / publicar / git
```

Invariantes (no romper):

- **Sin backend en runtime.** El contenido es JSON importado estáticamente.
- **El panel admin se elimina en producción.** `client/src/lib/admin-enabled.ts`
  exporta `ADMIN_ENABLED = import.meta.env.DEV || VITE_ENABLE_ADMIN === "true"`.
  En un build normal es constante `false`, así que `/admin` no se registra y
  Rollup lo elimina del bundle. El admin **no tiene autenticación** y nunca debe
  publicarse.
- **Ningún texto visible está escrito en el código.** Todo proviene de JSON de
  contenido o de `translations/es.json`.
- **Regla de completitud:** cada entidad de contenido tiene página de admin +
  entrada en el menú + ruta + fila de descarga en "Versiones de Contenido".

## Comandos

```bash
pnpm install        # instalar dependencias (requiere pnpm)
pnpm dev            # servidor de desarrollo + panel admin en http://localhost:5000/admin
pnpm build          # build estático a dist/public + prerender SEO
pnpm preview        # previsualizar el build
pnpm check          # typecheck (tsc)
pnpm gen:inventory  # regenerar client/src/content/inventory.json
```

## Editar el contenido (panel admin)

1. `pnpm dev` y abre <http://localhost:5000/admin>.
2. Edita cualquier sección. Cada cambio queda "sin guardar" hasta que pulsas
   **Guardar** (reescribe el archivo JSON correspondiente vía el plugin local).
3. **Biblioteca de Medios:** muestra todas las imágenes y **cuántas veces se usa
   cada una**. Si intentas eliminar una imagen en uso, aparece una advertencia
   con la lista exacta de lugares que se romperían.
4. **Publicar:** guarda todo y hace `git commit` + `git push`, lo que dispara el
   despliegue a GitHub Pages.

### Secciones del panel

- **Identidad:** nombre, logo, favicon, año de fundación, colores del tema, SEO, navegación.
- **Página:** Portada (Hero), Contacto, Pie de página.
- **Historia:** textos, Hitos Históricos, Imágenes Históricas, Jefaturas.
- **Multimedia:** Escudos, Valores del Escudo, Galería (categorías + imágenes con modal).
- **Sistema:** Biblioteca de Medios, Tema, Textos de Interfaz, Inventario,
  Versiones de Contenido, Diagnóstico (estado de git + chequeos de salud),
  Explorador de Contenido.

## Datos de Jefaturas

Las jefaturas (`client/src/content/leadership.json`, 40 períodos desde 1959
hasta 2022) se mapearon desde la hoja `Hoja11` del archivo Excel
*CUERPO DE BANDERAS L.C.R JEFATURAS.xlsx*, agrupando cada jefe con sus subjefes
por año.

## Despliegue

`.github/workflows/deploy.yml` instala con pnpm, ejecuta `pnpm build`
(con `VITE_ENABLE_ADMIN` sin definir, para excluir el admin), verifica que el
admin no quedó en el bundle y publica `dist/public` en GitHub Pages. El dominio
personalizado se configura con `client/public/CNAME` (`banderas.jcampos.dev`).

## Estructura

```
client/
  index.html
  src/
    content/            # todos los datos del sitio (JSON) + translations/
    repositories/       # lectura tipada del contenido
    services/           # lógica/derivaciones para los componentes públicos
    components/         # UI pública (solo lectura)
    pages/              # páginas públicas (wouter)
    lib/                # admin-enabled, icons, media, i18n, brand-theme, manifest
    admin/              # panel CMS (solo dev): store, layout, páginas
scripts/                # prerender SEO + generador de inventario
vite-plugin-local-cms.ts  # middleware de escritura/medios/publicar (solo dev)
```
