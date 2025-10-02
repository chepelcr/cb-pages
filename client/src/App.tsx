import { useState, useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HistoryPage from "@/pages/HistoryPage";
import LeadershipPage from "@/pages/LeadershipPage";
import GalleryPage from "@/pages/GalleryPage";
import ShieldsPage from "@/pages/ShieldsPage";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AdminLoginModal from "@/components/AdminLoginModal";
import PageTransition from "@/components/PageTransition";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminGeneralSettings from "@/pages/admin/AdminGeneralSettings";
import AdminJefaturas from "@/pages/admin/AdminJefaturas";
import AdminEscudos from "@/pages/admin/AdminEscudos";
import AdminGaleria from "@/pages/admin/AdminGaleria";
import AdminHistoria from "@/pages/admin/AdminHistoria";

function HomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Hero />
        <Contact />
      </div>
    </PageTransition>
  );
}

// GitHub Pages SPA routing handler
function GitHubPagesRouter() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Handle GitHub Pages SPA routing - check for ?/ in URL
    const search = window.location.search;
    if (search.startsWith('?/')) {
      // Extract the real path from GitHub Pages redirect
      const path = search.slice(2).split('&')[0].replace(/~and~/g, '&');
      const realPath = '/' + path;
      
      // Navigate to the real path and clean up the URL
      navigate(realPath);
      window.history.replaceState(null, '', realPath + window.location.hash);
    }
  }, [navigate]);

  return null;
}

function AdminRouter() {
  const [location] = useLocation();

  return (
    <AdminLayout>
      <Switch location={location}>
        <Route path="/admin/general" component={AdminGeneralSettings} />
        <Route path="/admin/jefaturas" component={AdminJefaturas} />
        <Route path="/admin/escudos" component={AdminEscudos} />
        <Route path="/admin/galeria" component={AdminGaleria} />
        <Route path="/admin/historia" component={AdminHistoria} />
        <Route path="/admin">
          <Redirect to="/admin/general" />
        </Route>
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  return (
    <>
      <GitHubPagesRouter />
      {isAdminRoute ? (
        <AdminRouter />
      ) : (
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/historia" component={HistoryPage} />
          <Route path="/jefaturas" component={LeadershipPage} />
          <Route path="/escudos" component={ShieldsPage} />
          <Route path="/galeria" component={GalleryPage} />
          <Route component={NotFound} />
        </Switch>
      )}
    </>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  const handleAdminClick = () => {
    setAdminModalOpen(true);
    console.log('Admin panel opened');
  };

  return (
    <>
      {!isAdminRoute && (
        <Header 
          darkMode={theme === 'dark'} 
          onToggleDarkMode={toggleTheme}
          onAdminClick={handleAdminClick}
        />
      )}
      <Router />
      {!isAdminRoute && <Footer />}
      <AdminLoginModal 
        isOpen={adminModalOpen} 
        onOpenChange={setAdminModalOpen} 
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
