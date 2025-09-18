import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import History from "@/components/History";
import Leadership from "@/components/Leadership";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AdminLoginModal from "@/components/AdminLoginModal";

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <History />
      <Leadership />
      <Gallery />
      <Contact />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const handleAdminClick = () => {
    setAdminModalOpen(true);
    console.log('Admin panel opened');
  };

  return (
    <>
      <Header 
        darkMode={theme === 'dark'} 
        onToggleDarkMode={toggleTheme}
        onAdminClick={handleAdminClick}
      />
      <Router />
      <Footer />
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
