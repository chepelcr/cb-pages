import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SiteConfig } from '@shared/schema';
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
}

export default function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();

  const { data: siteConfig } = useQuery<SiteConfig>({
    queryKey: ['/api/admin/site-config'],
  });

  const siteName = siteConfig?.siteName || 'Cuerpo de Banderas';
  const siteSubtitle = siteConfig?.siteSubtitle || 'Liceo de Costa Rica';
  const logoUrl = siteConfig?.logoUrl || cbLogo;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string, sectionId?: string) => {
    if (path === '/' && location === '/') {
      if (sectionId) {
        scrollToSection(sectionId);
      }
    } else if (path === '/' && sectionId) {
      navigate('/');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 landscape:h-12">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              <img 
                src={logoUrl} 
                alt={`${siteName} Logo`}
                className="h-8 w-8 md:h-10 md:w-10 object-contain landscape:h-7 landscape:w-7"
                data-testid="logo-cb" 
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm md:text-lg lg:text-xl font-bold text-foreground truncate landscape:text-xs" data-testid="text-title">
                {siteName}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate landscape:text-[10px] landscape:leading-3" data-testid="text-subtitle">
                {siteSubtitle}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8 flex-shrink-0">
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
              <DropdownMenuContent className="bg-popover border-popover-border shadow-lg">
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
              <DropdownMenuContent className="bg-popover border-popover-border shadow-lg">
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
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="hover-elevate h-8 w-8 md:h-9 md:w-9"
              data-testid="button-theme-toggle"
            >
              {darkMode ? <Sun className="h-3 w-3 md:h-4 md:w-4" /> : <Moon className="h-3 w-3 md:h-4 md:w-4" />}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover-elevate h-8 w-8"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
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
            </nav>
          </Card>
        )}
      </div>
    </header>
  );
}
