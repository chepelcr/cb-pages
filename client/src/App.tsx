import { Suspense, lazy, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
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
import PageTransition from "@/components/PageTransition";
import { ADMIN_ENABLED } from "@/lib/admin-enabled";

// The admin panel is dynamically imported behind the statically-foldable
// ADMIN_ENABLED constant. In a production build it folds to `false`, so this
// import() becomes dead code and Rollup tree-shakes the entire admin out.
const AdminApp = ADMIN_ENABLED
  ? lazy(() => import("@/admin/AdminApp"))
  : null;

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
    const search = window.location.search;
    if (search.startsWith("?/")) {
      const path = search.slice(2).split("&")[0].replace(/~and~/g, "&");
      const realPath = "/" + path;
      navigate(realPath);
      window.history.replaceState(null, "", realPath + window.location.hash);
    }
  }, [navigate]);

  return null;
}

function PublicRouter() {
  return (
    <>
      <GitHubPagesRouter />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/historia" component={HistoryPage} />
        <Route path="/jefaturas" component={LeadershipPage} />
        <Route path="/escudos" component={ShieldsPage} />
        <Route path="/galeria" component={GalleryPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();

  // Dev-only admin panel (own layout, no public chrome).
  if (ADMIN_ENABLED && AdminApp && location.startsWith("/admin")) {
    return (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    );
  }

  return (
    <>
      <Header darkMode={theme === "dark"} onToggleDarkMode={toggleTheme} />
      <PublicRouter />
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
