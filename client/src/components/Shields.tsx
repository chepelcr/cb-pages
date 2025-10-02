import { useQuery } from '@tanstack/react-query';
import type { Shield, ShieldValue } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield as ShieldIcon, Award, Star, Flag, Target, Heart } from 'lucide-react';

const iconMap = {
  'Award': Award,
  'ShieldIcon': ShieldIcon,
  'Star': Star,
  'Flag': Flag,
  'Target': Target,
  'Heart': Heart
};

export default function Shields() {
  const { data: shields, isLoading: shieldsLoading } = useQuery<Shield[]>({
    queryKey: ['/api/admin/shields'],
  });

  const { data: mainShield, isLoading: mainShieldLoading } = useQuery<Shield>({
    queryKey: ['/api/admin/shields/main'],
  });

  const { data: shieldValues, isLoading: valuesLoading } = useQuery<ShieldValue[]>({
    queryKey: ['/api/admin/shield-values'],
  });

  const sortedShields = shields?.sort((a, b) => a.displayOrder - b.displayOrder) || [];
  const sortedValues = shieldValues?.sort((a, b) => a.displayOrder - b.displayOrder) || [];
  const isLoading = shieldsLoading || mainShieldLoading;

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
        {mainShieldLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : mainShield ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="overflow-hidden" data-testid="card-main-shield">
              <div className="p-8 flex justify-center bg-gradient-to-br from-muted/50 to-muted/20">
                <img 
                  src={mainShield.imageUrl} 
                  alt={mainShield.title}
                  className="w-full max-w-sm object-contain"
                  data-testid="img-main-shield"
                />
              </div>
            </Card>
            
            <Card className="" data-testid="card-shield-description">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldIcon className="h-6 w-6 text-primary" />
                  <Badge variant="secondary">Escudo Principal</Badge>
                </div>
                <CardTitle className="text-2xl" data-testid="text-shield-title">
                  {mainShield.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground" data-testid="text-shield-main-description">
                  {mainShield.description}
                </p>
                
                {mainShield.symbolism && (
                  <div className="space-y-3">
                    {mainShield.symbolism.split('\n').map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Shield Values */}
        {valuesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-64 w-full" />
            ))}
          </div>
        ) : sortedValues.length === 0 ? (
          <Card className="p-8 text-center" data-testid="card-no-shield-values">
            <ShieldIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No hay valores registrados</h3>
            <p className="text-muted-foreground">Aún no se han agregado valores del escudo</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedValues.map((value) => {
              const IconComponent = iconMap[value.iconName as keyof typeof iconMap] || Award;
              return (
                <Card key={value.id} className="text-center hover-elevate transition-all duration-300" data-testid={`card-shield-value-${value.id}`}>
                  <CardHeader className="pb-4">
                    <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg" data-testid={`text-value-title-${value.id}`}>
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm" data-testid={`text-value-description-${value.id}`}>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
