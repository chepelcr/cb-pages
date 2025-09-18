import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield, Sun, Moon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onAdminClick?: () => void;
}

export default function Header({ darkMode, onToggleDarkMode, onAdminClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { label: 'Inicio', action: () => scrollToSection('home') },
    { label: 'Historia', action: () => scrollToSection('history') },
    { label: 'Liderazgo', action: () => scrollToSection('leadership') },
    { label: 'Galería', action: () => scrollToSection('gallery') },
    { label: 'Contacto', action: () => scrollToSection('contact') }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-primary" data-testid="logo-shield" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground" data-testid="text-title">
                Cuerpo de Banderas
              </h1>
              <p className="text-sm text-muted-foreground" data-testid="text-subtitle">
                Liceo de Costa Rica - Desde 1951
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="hover-elevate"
                onClick={item.action}
                data-testid={`link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="hover-elevate"
              data-testid="button-theme-toggle"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onAdminClick}
              className="hidden sm:inline-flex hover-elevate"
              data-testid="button-admin"
            >
              Admin
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover-elevate"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <Card className="md:hidden absolute top-16 left-4 right-4 p-4 bg-card" data-testid="mobile-menu">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="justify-start hover-elevate"
                  onClick={item.action}
                  data-testid={`mobile-link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                variant="outline"
                className="justify-start hover-elevate mt-2"
                onClick={onAdminClick}
                data-testid="mobile-button-admin"
              >
                Admin
              </Button>
            </nav>
          </Card>
        )}
      </div>
    </header>
  );
}