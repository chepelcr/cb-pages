import { Link, useLocation } from "wouter";
import { CONTENT_ENTITIES, CONTENT_GROUPS } from "@/lib/content-manifest";
import { resolveIcon } from "@/lib/icons";
import { LayoutDashboard, FileDown, Activity, FolderTree, ChevronDown } from "lucide-react";
import { useUiStore } from "@/admin/store/ui-store";
import { useContentStore } from "@/admin/store/content-store";

interface NavLink {
  label: string;
  route: string;
  icon: string;
}

// Build groups from the content manifest, deduped by route (e.g. themes shares
// the Identity page), then append the system status/audit pages.
function buildGroups(): { group: string; links: NavLink[] }[] {
  const groups = CONTENT_GROUPS.map((group) => {
    const seen = new Set<string>();
    const links: NavLink[] = [];
    for (const e of CONTENT_ENTITIES) {
      if (e.group !== group) continue;
      if (seen.has(e.route)) continue;
      seen.add(e.route);
      links.push({ label: e.label, route: e.route, icon: e.icon });
    }
    return { group, links };
  });
  return groups;
}

export default function AdminSidebar() {
  const [location] = useLocation();
  const { collapsedGroups, toggleGroup } = useUiStore();
  const isDirty = useContentStore((s) => s.isDirty);

  const groups = buildGroups();
  const dirtyByRoute = (route: string) =>
    CONTENT_ENTITIES.some((e) => e.route === route && isDirty(e.key as any));

  const systemExtra: NavLink[] = [
    { label: "Versiones de Contenido", route: "/admin/versions", icon: "FileDown" },
    { label: "Diagnóstico", route: "/admin/diagnostics", icon: "Activity" },
    { label: "Explorador de Contenido", route: "/admin/explorer", icon: "FolderTree" },
  ];

  const extraIcon = (name: string) => {
    if (name === "FileDown") return FileDown;
    if (name === "Activity") return Activity;
    if (name === "FolderTree") return FolderTree;
    return resolveIcon(name);
  };

  return (
    <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground h-screen sticky top-0 overflow-y-auto">
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg" data-testid="link-admin-home">
          <LayoutDashboard className="h-5 w-5 text-sidebar-primary" />
          Panel CB
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Cuerpo de Banderas · CMS local</p>
      </div>

      <nav className="p-2 space-y-1">
        <Link
          href="/admin"
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm hover-elevate ${location === "/admin" ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""}`}
          data-testid="nav-dashboard"
        >
          <LayoutDashboard className="h-4 w-4" />
          Inicio
        </Link>

        {groups.map(({ group, links }) => {
          const collapsed = collapsedGroups[group];
          const allLinks = group === "Sistema" ? [...links, ...systemExtra] : links;
          return (
            <div key={group} className="pt-2">
              <button
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center justify-between px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground"
                data-testid={`group-${group}`}
              >
                {group}
                <ChevronDown className={`h-3 w-3 transition-transform ${collapsed ? "-rotate-90" : ""}`} />
              </button>
              {!collapsed &&
                allLinks.map((link) => {
                  const Icon = extraIcon(link.icon);
                  const active = location === link.route;
                  return (
                    <Link
                      key={link.route + link.label}
                      href={link.route}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm hover-elevate ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""}`}
                      data-testid={`nav-${link.route.replace("/admin/", "").replace("/admin", "home")}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1">{link.label}</span>
                      {dirtyByRoute(link.route) && <span className="h-2 w-2 rounded-full bg-primary" title="Cambios sin guardar" />}
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
