import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { getFooter, getBranding, getContact, getFoundingYear } from '@/services/site.service';
import { resolveMedia } from '@/lib/media';
import { resolveIcon } from '@/lib/icons';
import { t } from '@/lib/i18n';
import { ADMIN_ENABLED } from '@/lib/admin-enabled';

export default function Footer() {
  const [location, navigate] = useLocation();
  const footer = getFooter();
  const branding = getBranding();
  const contact = getContact();

  const siteName = branding.siteName;
  const siteSubtitle = branding.siteSubtitle;
  const logoUrl = resolveMedia(branding.logo);
  const foundingYear = getFoundingYear();
  const addressLines = contact.address.split('\n');

  const handleContactClick = (type: string) => {
    if (type === 'email') {
      window.open(`mailto:${contact.email}`);
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigation = (path: string, sectionId?: string) => {
    if (path === '/' && location === '/') {
      if (sectionId) scrollToSection(sectionId);
    } else if (path === '/' && sectionId) {
      navigate('/');
      setTimeout(() => scrollToSection(sectionId), 100);
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
              {footer.description}
            </p>
            <Badge variant="outline" data-testid="badge-footer-tradition">
              {branding.traditionLabelPrefix} {foundingYear}
            </Badge>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4" data-testid="text-quick-links-title">
              {footer.quickLinksTitle}
            </h4>
            <nav className="space-y-2">
              {footer.quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavigation(link.path, link.sectionId)}
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
              {footer.contactTitle}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="text-muted-foreground" data-testid="text-footer-address">
                <strong>{t('contact.addressLabel')}</strong><br />
                {addressLines.map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < addressLines.length - 1 && <br />}
                  </span>
                ))}
              </div>

              <div className="text-muted-foreground" data-testid="text-footer-phone">
                <strong>{t('contact.phoneLabel')}</strong><br />
                {contact.phone}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleContactClick('email')}
                className="p-0 h-auto justify-start text-muted-foreground hover:text-primary"
                data-testid="button-footer-email"
              >
                <Mail className="h-4 w-4 mr-2" />
                {contact.email}
              </Button>

              <div className="text-muted-foreground" data-testid="text-footer-schedule">
                <strong>{t('contact.trainingLabel')}</strong><br />
                {footer.trainingSummary}
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
            {ADMIN_ENABLED && (
              <>
                <span className="text-muted-foreground hidden sm:inline">|</span>
                <button
                  onClick={() => navigate('/admin')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-admin-login"
                >
                  {t('footer.admin')}
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">{t('footer.followUs')}</span>
            {footer.social.map((social) => {
              const IconComponent = resolveIcon(social.iconName);
              return (
                <Button
                  key={social.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => social.url && window.open(social.url, '_blank')}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
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
