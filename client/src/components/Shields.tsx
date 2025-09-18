import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, Star } from 'lucide-react';
import shieldImage from '@assets/image_1758164433004.png';

export default function Shields() {
  return (
    <section id="shields" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4" data-testid="badge-section-shields">
            Escudos e Insignias
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" data-testid="text-shields-title">
            Símbolos de Honor
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-shields-description">
            Los escudos e insignias que representan la tradición, honor y compromiso del
            Cuerpo de Banderas del Liceo de Costa Rica.
          </p>
        </div>

        {/* Main Shield Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="overflow-hidden" data-testid="card-main-shield">
            <div className="p-8 flex justify-center bg-gradient-to-br from-muted/50 to-muted/20">
              <img 
                src={shieldImage} 
                alt="Escudo oficial del Cuerpo de Banderas" 
                className="w-full max-w-sm object-contain"
                data-testid="img-main-shield"
              />
            </div>
          </Card>
          
          <Card className="" data-testid="card-shield-description">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-6 w-6 text-primary" />
                <Badge variant="secondary">Escudo Principal</Badge>
              </div>
              <CardTitle className="text-2xl" data-testid="text-shield-title">
                Escudo del Cuerpo de Banderas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground" data-testid="text-shield-main-description">
                El escudo oficial del Cuerpo de Banderas representa los valores fundamentales 
                de la institución: honor, disciplina y patriotismo.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground">Águila Central</h4>
                    <p className="text-sm text-muted-foreground">Símbolo de fuerza, nobleza y vigilancia</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground">Colores Patrios</h4>
                    <p className="text-sm text-muted-foreground">Azul, blanco y rojo representando Costa Rica</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground">Banderas</h4>
                    <p className="text-sm text-muted-foreground">Representan el honor y la tradición institucional</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shield Elements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center hover-elevate transition-all duration-300" data-testid="card-shield-honor">
            <CardHeader className="pb-4">
              <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg" data-testid="text-honor-title">
                Honor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm" data-testid="text-honor-description">
                El compromiso con la excelencia y la integridad en cada acción, 
                representando dignamente la institución.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-elevate transition-all duration-300" data-testid="card-shield-discipline">
            <CardHeader className="pb-4">
              <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg" data-testid="text-discipline-title">
                Disciplina
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm" data-testid="text-discipline-description">
                La formación del carácter a través del orden, la constancia 
                y el cumplimiento del deber.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-elevate transition-all duration-300" data-testid="card-shield-patriotism">
            <CardHeader className="pb-4">
              <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg" data-testid="text-patriotism-title">
                Patriotismo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm" data-testid="text-patriotism-description">
                El amor profundo por Costa Rica y el compromiso con 
                el servicio a la patria y sus valores.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}