import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { SiteConfig } from '@shared/schema';

export default function Contact() {
  const { data: config, isLoading } = useQuery<SiteConfig>({
    queryKey: ['/api/admin/site-config'],
  });

  const handleContactClick = (type: string, value: string) => {
    console.log(`Contact clicked: ${type} - ${value}`);
    
    if (type === 'email') {
      window.open(`mailto:${value}`);
    } else if (type === 'phone') {
      window.open(`tel:${value}`);
    } else if (type === 'location') {
      window.open('https://maps.google.com/?q=Liceo+de+Costa+Rica+San+José', '_blank');
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Ubicación',
      value: config?.siteName || 'Liceo de Costa Rica, San José',
      description: config?.address || 'Avenida 6, Calle 7-9, San José, Costa Rica',
      type: 'location',
      actionText: 'Ver en Maps'
    },
    {
      icon: Phone,
      label: 'Teléfono',
      value: config?.contactPhone || '+506 2221-9358',
      description: 'Secretaría del Liceo de Costa Rica',
      type: 'phone',
      actionText: 'Llamar'
    },
    {
      icon: Mail,
      label: 'Email',
      value: config?.contactEmail || 'cuerpo.banderas@liceocostarica.ed.cr',
      description: 'Coordinación Cuerpo de Banderas',
      type: 'email',
      actionText: 'Enviar Email'
    },
    {
      icon: Clock,
      label: 'Horario de Entrenamientos',
      value: config?.trainingSchedule || 'Martes y Jueves 2:00 PM',
      description: config?.trainingLocation || 'Patio principal del Liceo',
      type: 'schedule',
      actionText: 'Más Info'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4" data-testid="badge-section-contact">
            Contacto
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" data-testid="text-contact-title">
            Contáctanos
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-contact-description">
            ¿Interesado en formar parte del Cuerpo de Banderas? 
            Contáctanos para más información sobre el proceso de ingreso y entrenamientos.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <Card key={index} className="text-center hover-elevate transition-all duration-300" data-testid={`card-contact-${info.type}`}>
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
                    {info.actionText}
                    {info.type === 'location' && <ExternalLink className="ml-2 h-3 w-3" />}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Requirements Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="" data-testid="card-requirements">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid="text-requirements-title">
                <Badge variant="secondary">Requisitos</Badge>
                Proceso de Ingreso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">Ser estudiante activo del Liceo de Costa Rica</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">Mantener promedio académico mínimo de 80</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">Disponibilidad para entrenamientos regulares</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">Compromiso con los valores institucionales</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground">Participación en ceremonias patrias</p>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 hover-elevate" 
                onClick={() => handleContactClick('email', config?.contactEmail || 'cuerpo.banderas@liceocostarica.ed.cr')}
                data-testid="button-apply"
              >
                Solicitar Información
              </Button>
            </CardContent>
          </Card>

          <Card className="" data-testid="card-schedule">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid="text-schedule-title">
                <Badge variant="secondary">Horarios</Badge>
                Actividades y Entrenamientos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-foreground">Entrenamientos Regulares</h4>
                    <p className="text-sm text-muted-foreground">{config?.trainingSchedule || 'Martes y Jueves, 2:00 PM - 4:00 PM'}</p>
                    <p className="text-xs text-muted-foreground">{config?.trainingLocation || 'Patio principal del Liceo'}</p>
                  </div>
                  
                  <div className="border-l-4 border-secondary pl-4">
                    <h4 className="font-semibold text-foreground">Ceremonias Especiales</h4>
                    <p className="text-sm text-muted-foreground">{config?.ceremoniesSchedule || 'Fechas patrias y eventos institucionales'}</p>
                    <p className="text-xs text-muted-foreground">{config?.ceremoniesNotes || 'Se coordinan con anticipación'}</p>
                  </div>
                  
                  <div className="border-l-4 border-accent pl-4">
                    <h4 className="font-semibold text-foreground">Reuniones de Coordinación</h4>
                    <p className="text-sm text-muted-foreground">{config?.meetingsSchedule || 'Viernes, 3:00 PM - 4:00 PM'}</p>
                    <p className="text-xs text-muted-foreground">{config?.meetingsLocation || 'Aula de coordinación'}</p>
                  </div>
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full mt-4 hover-elevate"
                onClick={() => handleContactClick('phone', config?.contactPhone || '+506 2221-9358')}
                data-testid="button-schedule-info"
              >
                Consultar Horarios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}