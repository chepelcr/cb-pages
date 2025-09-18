import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield, Sun, Moon, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useLocation } from 'wouter';
import cbLogo from '@assets/cb logo_1758164197769.png';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onAdminClick?: () => void;
}

export default function Header({ darkMode, onToggleDarkMode, onAdminClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string, sectionId?: string) => {
    if (path === '/' && location === '/') {
      // If we're already on home page, scroll to section
      if (sectionId) {
        scrollToSection(sectionId);
      }
    } else if (path === '/' && sectionId) {
      // Navigate to home page then scroll to section
      navigate('/');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      // Navigate to different page
      navigate(path);
    }
    setMobileMenuOpen(false);
  };

  const historyItems = [
    { label: 'Historia', action: () => handleNavigation('/historia') },
    { label: 'Jefaturas', action: () => handleNavigation('/jefaturas') }
  ];

  const multimediaItems = [
    { label: 'Escudos', action: () => handleNavigation('/escudos') },
    { label: 'Galería', action: () => handleNavigation('/galeria') }
  ];

  const directMenuItems = [
    { label: 'Inicio', action: () => handleNavigation('/', 'home') },
    { label: 'Contacto', action: () => handleNavigation('/', 'contact') }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <img 
                src={cbLogo} 
                alt="Cuerpo de Banderas Logo" 
                className="h-10 w-10 object-contain"
                data-testid="logo-cb" 
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground" data-testid="text-title">
                Cuerpo de Banderas
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground" data-testid="text-subtitle">
                Liceo de Costa Rica
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button
              variant="ghost"
              className="hover-elevate"
              onClick={directMenuItems[0].action}
              data-testid="link-inicio"
            >
              {directMenuItems[0].label}
            </Button>

            {/* Historia Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover-elevate" data-testid="dropdown-historia">
                  Nuestra Historia
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border shadow-lg">
                {historyItems.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={item.action}
                    data-testid={`dropdown-item-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Multimedia Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hover-elevate" data-testid="dropdown-multimedia">
                  Multimedia
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border shadow-lg">
                {multimediaItems.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={item.action}
                    data-testid={`dropdown-item-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              className="hover-elevate"
              onClick={directMenuItems[1].action}
              data-testid="link-contacto"
            >
              {directMenuItems[1].label}
            </Button>
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
              <Button
                variant="ghost"
                className="justify-start hover-elevate"
                onClick={directMenuItems[0].action}
                data-testid="mobile-link-inicio"
              >
                {directMenuItems[0].label}
              </Button>
              
              <div className="space-y-1">
                <div className="text-sm font-semibold text-muted-foreground px-3 py-2">
                  Nuestra Historia
                </div>
                {historyItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="justify-start pl-6 hover-elevate"
                    onClick={item.action}
                    data-testid={`mobile-link-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-semibold text-muted-foreground px-3 py-2">
                  Multimedia
                </div>
                {multimediaItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className="justify-start pl-6 hover-elevate"
                    onClick={item.action}
                    data-testid={`mobile-link-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="ghost"
                className="justify-start hover-elevate"
                onClick={directMenuItems[1].action}
                data-testid="mobile-link-contacto"
              >
                {directMenuItems[1].label}
              </Button>

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