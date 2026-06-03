import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Clock, ExternalLink, type LucideIcon } from 'lucide-react';
import { getContact } from '@/services/site.service';
import { t } from '@/lib/i18n';

const methodIcons: Record<string, LucideIcon> = {
  location: MapPin,
  phone: Phone,
  email: Mail,
  schedule: Clock,
};

const methodActions: Record<string, string> = {
  location: t('common.viewOnMaps'),
  phone: t('common.call'),
  email: t('common.sendEmail'),
  schedule: t('common.moreInfo'),
};

export default function Contact() {
  const contact = getContact();

  const handleContactClick = (type: string, value: string) => {
    if (type === 'email') {
      window.open(`mailto:${value}`);
    } else if (type === 'phone') {
      window.open(`tel:${value}`);
    } else if (type === 'location') {
      window.open(`https://maps.google.com/?q=${encodeURIComponent(contact.mapsQuery)}`, '_blank');
    }
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4" data-testid="badge-section-contact">
            {contact.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" data-testid="text-contact-title">
            {contact.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-contact-description">
            {contact.description}
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contact.methods.map((info) => {
            const IconComponent = methodIcons[info.type] ?? MapPin;
            return (
              <Card key={info.id} className="text-center hover-elevate transition-all duration-300" data-testid={`card-contact-${info.type}`}>
                <CardHeader className="pb-4">
                  <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg" data-testid={`text-contact-label-${info.type}`}>
                    {info.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="font-semibold text-foreground" data-testid={`text-contact-value-${info.type}`}>
                    {info.value}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-contact-description-${info.type}`}>
                    {info.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactClick(info.type, info.value)}
                    className="hover-elevate w-full"
                    data-testid={`button-contact-${info.type}`}
                  >
                    {methodActions[info.type]}
                    {info.type === 'location' && <ExternalLink className="ml-2 h-3 w-3" />}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Requirements Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card data-testid="card-requirements">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid="text-requirements-title">
                <Badge variant="secondary">{contact.admission.badge}</Badge>
                {contact.admission.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {contact.admission.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground" data-testid={`text-requirement-${index}`}>{requirement}</p>
                  </div>
                ))}
              </div>

              <Button
                className="w-full mt-4 hover-elevate"
                onClick={() => handleContactClick('email', contact.email)}
                data-testid="button-apply"
              >
                {t('contact.applyButton')}
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-schedule">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid="text-schedule-title">
                <Badge variant="secondary">{contact.schedules.badge}</Badge>
                {contact.schedules.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-semibold text-foreground">{contact.schedules.training.title}</h4>
                  <p className="text-sm text-muted-foreground">{contact.schedules.training.schedule}</p>
                  <p className="text-xs text-muted-foreground">{contact.schedules.training.location}</p>
                </div>

                <div className="border-l-4 border-secondary pl-4">
                  <h4 className="font-semibold text-foreground">{contact.schedules.ceremonies.title}</h4>
                  <p className="text-sm text-muted-foreground">{contact.schedules.ceremonies.schedule}</p>
                  <p className="text-xs text-muted-foreground">{contact.schedules.ceremonies.notes}</p>
                </div>

                <div className="border-l-4 border-accent pl-4">
                  <h4 className="font-semibold text-foreground">{contact.schedules.meetings.title}</h4>
                  <p className="text-sm text-muted-foreground">{contact.schedules.meetings.schedule}</p>
                  <p className="text-xs text-muted-foreground">{contact.schedules.meetings.location}</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 hover-elevate"
                onClick={() => handleContactClick('phone', contact.phone)}
                data-testid="button-schedule-info"
              >
                {t('contact.scheduleButton')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
