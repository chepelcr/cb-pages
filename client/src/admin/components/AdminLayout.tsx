import { type ReactNode, useEffect } from "react";
import AdminSidebar from "@/admin/components/AdminSidebar";
import AdminTopbar from "@/admin/components/AdminTopbar";
import { useContentStore } from "@/admin/store/content-store";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const anyDirty = useContentStore((s) => s.anyDirty());

  // Unsaved-changes guard on full page unload / close.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (anyDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [anyDirty]);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <AdminTopbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
