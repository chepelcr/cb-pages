import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Camera, Image as ImageIcon } from 'lucide-react';
import {
  getGalleryCopy,
  getCategoriesWithCounts,
  filterItems,
  getCategoryName,
} from '@/services/gallery.service';
import { resolveMedia, resolveMediaAlt } from '@/lib/media';
import { t } from '@/lib/i18n';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const copy = getGalleryCopy();
  const categoriesWithCounts = getCategoriesWithCounts();
  const filteredItems = filterItems(selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4" data-testid="badge-section-gallery">
            {copy.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" data-testid="text-gallery-title">
            {copy.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-gallery-description">
            {copy.description}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categoriesWithCounts.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="hover-elevate"
              data-testid={`button-category-${category.id}`}
            >
              {category.label} ({category.count})
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const thumb = resolveMedia(item.thumbnail) || resolveMedia(item.image);
            const full = resolveMedia(item.image);
            return (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <Card
                    className="group cursor-pointer overflow-hidden hover-elevate transition-all duration-300"
                    data-testid={`card-gallery-${item.id}`}
                  >
                    <div className="relative">
                      <img
                        src={thumb}
                        alt={resolveMediaAlt(item.image, item.title)}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        data-testid={`img-gallery-${item.id}`}
                      />

                      {/* Media Type Overlay */}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/70 text-white" data-testid={`badge-image-${item.id}`}>
                          <Camera className="h-3 w-3 mr-1" />
                          {t('gallery.photoBadge')}
                        </Badge>
                      </div>

                      {/* Year Badge */}
                      {item.year && (
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="outline" className="bg-white/90" data-testid={`badge-year-${item.id}`}>
                            {item.year}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1" data-testid={`text-title-${item.id}`}>
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground" data-testid={`text-description-${item.id}`}>
                          {item.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="max-w-4xl" data-testid={`modal-gallery-${item.id}`}>
                  <div className="relative">
                    <img
                      src={full}
                      alt={resolveMediaAlt(item.image, item.title)}
                      className="w-full max-h-[70vh] object-contain"
                      data-testid={`modal-img-${item.id}`}
                    />

                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        {item.year && <Badge variant="secondary">{item.year}</Badge>}
                        {item.categoryId && <Badge variant="outline">{getCategoryName(item.categoryId)}</Badge>}
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                      {item.description && <p className="text-muted-foreground">{item.description}</p>}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <Card className="p-12 text-center" data-testid="card-empty-gallery">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('gallery.emptyTitle')}</h3>
            <p className="text-muted-foreground">{t('gallery.emptyBody')}</p>
          </Card>
        )}
      </div>
    </section>
  );
}
