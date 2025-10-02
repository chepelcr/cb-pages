import { useQuery } from '@tanstack/react-query';
import type { HistoricalMilestone, HistoricalImage } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users, Flag, Award, Image as ImageIcon } from 'lucide-react';

const iconMap = {
  'Flag': Flag,
  'Users': Users,
  'Award': Award,
  'Calendar': Calendar
};

export default function History() {
  const { data: milestones, isLoading: milestonesLoading } = useQuery<HistoricalMilestone[]>({
    queryKey: ['/api/admin/history'],
  });

  const { data: historicalImages, isLoading: imagesLoading } = useQuery<HistoricalImage[]>({
    queryKey: ['/api/admin/historical-images'],
  });

  const sortedMilestones = milestones?.sort((a, b) => a.displayOrder - b.displayOrder) || [];
  const sortedImages = historicalImages?.sort((a, b) => a.displayOrder - b.displayOrder) || [];

  return (
    <section id="history" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4" data-testid="badge-section-history">
            Nuestra Historia
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" data-testid="text-history-title">
            73 Años de Tradición y Honor
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-history-description">
            Desde 1951, el Cuerpo de Banderas del Liceo de Costa Rica ha mantenido viva la tradición
            de formar jóvenes con valores patrióticos, disciplina y amor por la patria.
          </p>
        </div>

        {/* Historical Images */}
        {imagesLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {[...Array(2)].map((_, index) => (
              <Skeleton key={index} className="h-80 w-full" />
            ))}
          </div>
        ) : sortedImages.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {sortedImages.map((image, index) => (
              <Card key={image.id} className="overflow-hidden" data-testid={`card-historical-image-${index}`}>
                <img 
                  src={image.imageUrl} 
                  alt={image.title} 
                  className="w-full h-64 object-cover"
                  data-testid={`img-historical-${index}`}
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground" data-testid={`text-image-title-${index}`}>
                    {image.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1" data-testid={`text-image-description-${index}`}>
                    {image.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        {/* Timeline */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-center text-foreground mb-12" data-testid="text-timeline-title">
            Hitos Importantes
          </h3>
          
          {milestonesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-64 w-full" />
              ))}
            </div>
          ) : sortedMilestones.length === 0 ? (
            <Card className="p-8 text-center" data-testid="card-no-milestones">
              <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No hay hitos registrados</h3>
              <p className="text-muted-foreground">Aún no se han agregado hitos históricos importantes</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedMilestones.map((milestone, index) => {
                const IconComponent = iconMap[milestone.iconName as keyof typeof iconMap] || Flag;
                return (
                  <Card key={milestone.id} className="h-full hover-elevate transition-all duration-300 flex flex-col" data-testid={`card-milestone-${milestone.year}`}>
                    <CardHeader className="pb-4 flex-shrink-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="secondary" data-testid={`badge-year-${milestone.year}`}>
                          {milestone.year}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg min-h-[4.5rem] flex items-center" data-testid={`text-milestone-title-${index}`}>
                        {milestone.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex items-start">
                      <p className="text-sm text-muted-foreground text-justify" data-testid={`text-milestone-description-${index}`}>
                        {milestone.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Mission Statement */}
        <Card className="mt-16 bg-primary/5 border-primary/20" data-testid="card-mission">
          <CardContent className="p-8 text-center">
            <Flag className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="text-mission-title">
              Nuestra Misión
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-mission-statement">
              Formar estudiantes con valores patrióticos, disciplina militar y amor por Costa Rica,
              manteniendo viva la tradición de honor que nos ha caracterizado por más de siete décadas.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
