import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { GalleryItem, GalleryCategory } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Camera, Play, Image as ImageIcon, X } from 'lucide-react';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const { data: galleryItems, isLoading: itemsLoading } = useQuery<GalleryItem[]>({
    queryKey: ['/api/admin/gallery'],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<GalleryCategory[]>({
    queryKey: ['/api/admin/gallery-categories'],
  });

  const isLoading = itemsLoading || categoriesLoading;

  const sortedCategories = categories?.sort((a, b) => a.displayOrder - b.displayOrder) || [];
  
  const categoriesWithCounts = [
    { id: 'all', label: 'Todas', count: galleryItems?.length || 0 },
    ...sortedCategories.map(cat => ({
      id: cat.id,
      label: cat.name,
      count: galleryItems?.filter(item => item.categoryId === cat.id).length || 0
    }))
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems || []
    : galleryItems?.filter(item => item.categoryId === selectedCategory) || [];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const openModal = (item: GalleryItem) => {
    setSelectedItem(item);
  };

  const getCategoryName = (categoryId: string | null): string => {
    if (!categoryId) return '';
    const category = categories?.find(cat => cat.id === categoryId);
    return category?.name || '';
  };

  return (
    <section id="gallery" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4" data-testid="badge-section-gallery">
            Galería
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" data-testid="text-gallery-title">
            Momentos Memorables
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-gallery-description">
            Explora nuestra colección de fotografías y videos que capturan la esencia del
            Cuerpo de Banderas a través de los años.
          </p>
        </div>

        {/* Category Filter */}
        {categoriesLoading ? (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-9 w-32" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categoriesWithCounts.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => handleCategorySelect(category.id)}
                className="hover-elevate"
                data-testid={`button-category-${category.id}`}
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {itemsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-80 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <Card 
                    className="group cursor-pointer overflow-hidden hover-elevate transition-all duration-300"
                    onClick={() => openModal(item)}
                    data-testid={`card-gallery-${item.id}`}
                  >
                    <div className="relative">
                      <img 
                        src={item.thumbnailUrl || item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        data-testid={`img-gallery-${item.id}`}
                      />
                      
                      {/* Media Type Overlay */}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/70 text-white" data-testid={`badge-image-${item.id}`}>
                          <Camera className="h-3 w-3 mr-1" />
                          Foto
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
                      src={item.imageUrl} 
                      alt={item.title} 
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
            ))}
          </div>
        )}

        {/* Empty State */}
        {!itemsLoading && filteredItems.length === 0 && (
          <Card className="p-12 text-center" data-testid="card-empty-gallery">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No hay elementos en esta categoría</h3>
            <p className="text-muted-foreground">Selecciona otra categoría para ver más contenido</p>
          </Card>
        )}
      </div>
    </section>
  );
}
