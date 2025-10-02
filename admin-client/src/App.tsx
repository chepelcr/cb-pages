import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/AdminLayout";
import AdminGeneralSettings from "@/pages/AdminGeneralSettings";
import AdminJefaturas from "@/pages/AdminJefaturas";
import AdminEscudos from "@/pages/AdminEscudos";
import AdminGaleria from "@/pages/AdminGaleria";
import AdminHistoria from "@/pages/AdminHistoria";
import AdminHistoricalImages from "@/pages/AdminHistoricalImages";
import AdminShieldValues from "@/pages/AdminShieldValues";
import AdminLogin from "@/pages/AdminLogin";

function AdminRouter() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated && location !== '/login') {
    return <Redirect to="/login" />;
  }

  // Redirect to dashboard if authenticated and on login page
  if (isAuthenticated && location === '/login') {
    return <Redirect to="/admin/general" />;
  }

  // Login page (no layout)
  if (location === '/login') {
    return <AdminLogin />;
  }

  // Admin pages (with layout)
  return (
    <AdminLayout>
      <Switch location={location}>
        <Route path="/admin/general" component={AdminGeneralSettings} />
        <Route path="/admin/jefaturas" component={AdminJefaturas} />
        <Route path="/admin/escudos" component={AdminEscudos} />
        <Route path="/admin/galeria" component={AdminGaleria} />
        <Route path="/admin/historia" component={AdminHistoria} />
        <Route path="/admin/imagenes-historicas" component={AdminHistoricalImages} />
        <Route path="/admin/valores-escudo" component={AdminShieldValues} />
        <Route path="/">
          <Redirect to="/admin/general" />
        </Route>
      </Switch>
    </AdminLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AdminRouter />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
