import { useQuery } from '@tanstack/react-query';
import type { SiteConfig } from '@shared/schema';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import cbLogo from '@assets/cb logo_1758164197769.png';

export default function Footer() {
  const [location, navigate] = useLocation();

  const { data: siteConfig } = useQuery<SiteConfig>({
    queryKey: ['/api/admin/site-config'],
  });

  const siteName = siteConfig?.siteName || 'Cuerpo de Banderas';
  const siteSubtitle = siteConfig?.siteSubtitle || 'Liceo de Costa Rica';
  const logoUrl = siteConfig?.logoUrl || cbLogo;
  const contactEmail = siteConfig?.contactEmail || 'cuerpo.banderas@liceocostarica.ed.cr';
  const contactPhone = siteConfig?.contactPhone || '+506 2221-9358';
  const address = siteConfig?.address || 'Liceo de Costa Rica\nAvenida 6, Calle 7-9\nSan José, Costa Rica';

  const handleSocialClick = (platform: string) => {
    console.log(`Social media clicked: ${platform}`);
  };

  const handleContactClick = (type: string) => {
    console.log(`Footer contact clicked: ${type}`);
    if (type === 'email') {
      window.open(`mailto:${contactEmail}`);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
  };

  return (
    <footer className="bg-card border-t mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={logoUrl} 
                alt={`${siteName} Logo`}
                className="h-10 w-10 object-contain"
                data-testid="footer-logo" 
              />
              <div>
                <h3 className="text-xl font-bold text-foreground" data-testid="text-footer-title">
                  {siteName}
                </h3>
                <p className="text-sm text-muted-foreground" data-testid="text-footer-subtitle">
                  {siteSubtitle}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md" data-testid="text-footer-description">
              Formando jóvenes costarricenses con valores patrióticos, disciplina y honor desde 1951. 
              Una tradición de más de 70 años al servicio de la patria.
            </p>
            <Badge variant="outline" className="" data-testid="badge-footer-tradition">
              Tradición desde 1951
            </Badge>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="text-quick-links-title">
              Enlaces Rápidos
            </h4>
            <nav className="space-y-2">
              {[
                { label: 'Inicio', path: '/', sectionId: 'home' },
                { label: 'Historia', path: '/historia' },
                { label: 'Jefaturas', path: '/jefaturas' },
                { label: 'Escudos', path: '/escudos' },
                { label: 'Galería', path: '/galeria' },
                { label: 'Contacto', path: '/', sectionId: 'contact' }
              ].map((link) => (
                <button
                  key={link.path + (link.sectionId || '')}
                  onClick={() => {
                    handleNavigation(link.path, link.sectionId);
                    console.log(`Footer link clicked: ${link.label}`);
                  }}
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                  data-testid={`link-footer-${link.sectionId || link.path.replace('/', '')}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="text-contact-info-title">
              Información de Contacto
            </h4>
            <div className="space-y-3 text-sm">
              <div className="text-muted-foreground" data-testid="text-footer-address">
                <strong>Dirección:</strong><br />
                {address.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < address.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
              
              <div className="text-muted-foreground" data-testid="text-footer-phone">
                <strong>Teléfono:</strong><br />
                {contactPhone}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleContactClick('email')}
                className="p-0 h-auto justify-start text-muted-foreground hover:text-primary"
                data-testid="button-footer-email"
              >
                <Mail className="h-4 w-4 mr-2" />
                {contactEmail}
              </Button>
              
              <div className="text-muted-foreground" data-testid="text-footer-schedule">
                <strong>Entrenamientos:</strong><br />
                Martes y Jueves 2:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* Social Media and Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
              © {new Date().getFullYear()} {siteName} - {siteSubtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Síguenos:</span>
            {[
              { icon: Facebook, name: 'Facebook', color: 'hover:text-blue-600' },
              { icon: Instagram, name: 'Instagram', color: 'hover:text-pink-600' },
              { icon: Youtube, name: 'YouTube', color: 'hover:text-red-600' }
            ].map((social) => {
              const IconComponent = social.icon;
              return (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSocialClick(social.name)}
                  className={`p-2 text-muted-foreground ${social.color} transition-colors`}
                  data-testid={`button-social-${social.name.toLowerCase()}`}
                >
                  <IconComponent className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
