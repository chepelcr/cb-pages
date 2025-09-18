import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Flag, Award } from 'lucide-react';
import historicalImage from '@assets/generated_images/Historical_1950s_ceremony_photo_1f17f679.png';
import paradeImage from '@assets/generated_images/Military_academy_parade_ground_c7bba0ab.png';

export default function History() {
  const milestones = [
    {
      year: '1951',
      title: 'Fundación del Cuerpo de Banderas',
      description: 'Se establece oficialmente el Cuerpo de Banderas en el Liceo de Costa Rica, adoptando ceremoniales chilenos adaptados a la cultura costarricense.',
      icon: Flag
    },
    {
      year: '1960s',
      title: 'Consolidación de Tradiciones',
      description: 'Se establecen los protocolos ceremoniales y se forman las primeras generaciones de líderes estudiantiles.',
      icon: Users
    },
    {
      year: '1970s-1980s',
      title: 'Expansión y Reconocimiento',
      description: 'El Cuerpo de Banderas participa en ceremonias nacionales y obtiene reconocimiento por su disciplina y patriotismo.',
      icon: Award
    },
    {
      year: '1990s-2000s',
      title: 'Modernización',
      description: 'Se actualiza el entrenamiento manteniendo la esencia tradicional, incorporando nuevas generaciones de estudiantes.',
      icon: Calendar
    }
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="overflow-hidden" data-testid="card-historical-image">
            <img 
              src={historicalImage} 
              alt="Ceremonia histórica de 1950s" 
              className="w-full h-64 object-cover"
              data-testid="img-historical-ceremony"
            />
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground">Primeras Ceremonias</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Imágenes históricas de las primeras ceremonias del Cuerpo de Banderas en la década de 1950.
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden" data-testid="card-parade-image">
            <img 
              src={paradeImage} 
              alt="Patio de ceremonias del Liceo" 
              className="w-full h-64 object-cover"
              data-testid="img-parade-ground"
            />
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground">Patio de Ceremonias</h3>
              <p className="text-sm text-muted-foreground mt-1">
                El icónico patio del Liceo donde se realizan las ceremonias patrióticas y entrenamientos.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-center text-foreground mb-12" data-testid="text-timeline-title">
            Hitos Importantes
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              return (
                <Card key={index} className="h-full hover-elevate transition-all duration-300" data-testid={`card-milestone-${milestone.year}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary" data-testid={`badge-year-${milestone.year}`}>
                        {milestone.year}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg" data-testid={`text-milestone-title-${index}`}>
                      {milestone.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground" data-testid={`text-milestone-description-${index}`}>
                      {milestone.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
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