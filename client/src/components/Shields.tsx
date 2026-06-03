import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield as ShieldIcon, Award } from 'lucide-react';
import {
  getShieldsCopy,
  getMainShield,
  getShieldValues,
  getSymbolismLines,
} from '@/services/shields.service';
import { resolveMedia, resolveMediaAlt } from '@/lib/media';
import { resolveIcon } from '@/lib/icons';
import { t } from '@/lib/i18n';

export default function Shields() {
  const copy = getShieldsCopy();
  const mainShield = getMainShield();
  const values = getShieldValues();

  return (
    <section id="shields" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4" data-testid="badge-section-shields">
            {copy.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" data-testid="text-shields-title">
            {copy.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-shields-description">
            {copy.description}
          </p>
        </div>

        {/* Main Shield Display */}
        {mainShield && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="overflow-hidden" data-testid="card-main-shield">
              <div className="p-8 flex justify-center bg-gradient-to-br from-muted/50 to-muted/20">
                <img
                  src={resolveMedia(mainShield.image)}
                  alt={resolveMediaAlt(mainShield.image, mainShield.title)}
                  className="w-full max-w-sm object-contain"
                  data-testid="img-main-shield"
                />
              </div>
            </Card>

            <Card data-testid="card-shield-description">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldIcon className="h-6 w-6 text-primary" />
                  <Badge variant="secondary">{t('shields.mainShieldBadge')}</Badge>
                </div>
                <CardTitle className="text-2xl" data-testid="text-shield-title">
                  {mainShield.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground" data-testid="text-shield-main-description">
                  {mainShield.description}
                </p>

                {getSymbolismLines(mainShield.symbolism).length > 0 && (
                  <div className="space-y-3">
                    {getSymbolismLines(mainShield.symbolism).map((item, index) => (
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
        )}

        {/* Shield Values */}
        {values.length === 0 ? (
          <Card className="p-8 text-center" data-testid="card-no-shield-values">
            <ShieldIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('shields.emptyValuesTitle')}</h3>
            <p className="text-muted-foreground">{t('shields.emptyValuesBody')}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value) => {
              const IconComponent = resolveIcon(value.iconName, Award);
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
