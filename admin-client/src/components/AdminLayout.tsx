import { Link, useRoute, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Settings, Users, Shield, Image, Calendar, Home, LogOut, BookImage, Award } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "General Settings",
    url: "/admin/general",
    icon: Settings,
  },
  {
    title: "Jefaturas",
    url: "/admin/jefaturas",
    icon: Users,
  },
  {
    title: "Escudos",
    url: "/admin/escudos",
    icon: Shield,
  },
  {
    title: "Valores del Escudo",
    url: "/admin/valores-escudo",
    icon: Award,
  },
  {
    title: "Galería",
    url: "/admin/galeria",
    icon: Image,
  },
  {
    title: "Historia",
    url: "/admin/historia",
    icon: Calendar,
  },
  {
    title: "Imágenes Históricas",
    url: "/admin/imagenes-historicas",
    icon: BookImage,
  },
];

function AdminSidebar() {
  const [location] = useLocation();
  
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [, navigate] = useLocation();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleGoToMainPage = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center justify-between gap-2 p-4 border-b">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToMainPage}
                data-testid="button-go-to-main"
                className="hover-elevate"
              >
                <Home className="h-4 w-4 mr-2" />
                Ir a la página
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                data-testid="button-logout"
                className="hover-elevate"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
