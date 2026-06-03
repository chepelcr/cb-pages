import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flag } from 'lucide-react';
import { getHistoryCopy, getMilestones, getHistoricalImages } from '@/services/history.service';
import { getYearsOfTradition, interpolateYears } from '@/services/site.service';
import { resolveMedia, resolveMediaAlt } from '@/lib/media';
import { resolveIcon } from '@/lib/icons';
import { t } from '@/lib/i18n';

export default function History() {
  const copy = getHistoryCopy();
  const milestones = getMilestones();
  const images = getHistoricalImages();
  const yearsOfTradition = getYearsOfTradition();

  return (
    <section id="history" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4" data-testid="badge-section-history">
            {copy.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" data-testid="text-history-title">
            {yearsOfTradition}+ {copy.titleSuffix}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-history-description">
            {interpolateYears(copy.description)}
          </p>
        </div>

        {/* Historical Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {images.map((image, index) => (
              <Card key={image.id} className="overflow-hidden" data-testid={`card-historical-image-${index}`}>
                <img
                  src={resolveMedia(image.image)}
                  alt={resolveMediaAlt(image.image, image.title)}
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
        )}

        {/* Timeline */}
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-center text-foreground mb-12" data-testid="text-timeline-title">
            {copy.milestonesTitle}
          </h3>

          {milestones.length === 0 ? (
            <Card className="p-8 text-center" data-testid="card-no-milestones">
              <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{t('history.emptyMilestonesTitle')}</h3>
              <p className="text-muted-foreground">{t('history.emptyMilestonesBody')}</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((milestone, index) => {
                const IconComponent = resolveIcon(milestone.iconName, Flag);
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
              {copy.missionTitle}
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-mission-statement">
              {copy.missionStatement}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
