import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Camera, Play, Image as ImageIcon, X } from 'lucide-react';
import heroImage from '@assets/generated_images/Honor_guard_ceremony_hero_image_9a2900bc.png';
import historicalImage from '@assets/generated_images/Historical_1950s_ceremony_photo_1f17f679.png';
import paradeImage from '@assets/generated_images/Military_academy_parade_ground_c7bba0ab.png';
import leaderImage from '@assets/generated_images/Honor_guard_leader_portrait_c2aeb102.png';

interface GalleryItem {
  id: number;
  type: 'image' | 'video';
  src: string;
  title: string;
  description: string;
  category: string;
  year: string;
}

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // todo: remove mock functionality - Gallery items with generated images
  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      type: 'image',
      src: heroImage,
      title: 'Ceremonia Principal',
      description: 'Ceremonia oficial del Cuerpo de Banderas con la formación completa',
      category: 'ceremonias',
      year: '2024'
    },
    {
      id: 2,
      type: 'image',
      src: historicalImage,
      title: 'Primeras Ceremonias',
      description: 'Fotografías históricas de las ceremonias fundacionales de 1951',
      category: 'historicas',
      year: '1951'
    },
    {
      id: 3,
      type: 'image',
      src: paradeImage,
      title: 'Patio de Ceremonias',
      description: 'El icónico patio del Liceo donde se realizan los entrenamientos',
      category: 'entrenamientos',
      year: '2023'
    },
    {
      id: 4,
      type: 'image',
      src: leaderImage,
      title: 'Retrato de Líder',
      description: 'Retrato oficial de un líder del Cuerpo de Banderas',
      category: 'liderazgo',
      year: '2024'
    },
    {
      id: 5,
      type: 'video',
      src: heroImage,
      title: 'Entrenamiento Semanal',
      description: 'Video del entrenamiento semanal con pasos chilenos adaptados',
      category: 'entrenamientos',
      year: '2024'
    },
    {
      id: 6,
      type: 'image',
      src: historicalImage,
      title: 'Celebración Patria',
      description: 'Participación en celebraciones patrias nacionales',
      category: 'ceremonias',
      year: '2023'
    }
  ];

  const categories = [
    { id: 'all', label: 'Todas', count: galleryItems.length },
    { id: 'ceremonias', label: 'Ceremonias', count: galleryItems.filter(item => item.category === 'ceremonias').length },
    { id: 'entrenamientos', label: 'Entrenamientos', count: galleryItems.filter(item => item.category === 'entrenamientos').length },
    { id: 'historicas', label: 'Históricas', count: galleryItems.filter(item => item.category === 'historicas').length },
    { id: 'liderazgo', label: 'Liderazgo', count: galleryItems.filter(item => item.category === 'liderazgo').length }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log('Selected category:', categoryId);
  };

  const openModal = (item: GalleryItem) => {
    setSelectedItem(item);
    console.log('Opening modal for:', item.title);
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
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
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

        {/* Gallery Grid */}
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
                      src={item.src} 
                      alt={item.title} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      data-testid={`img-gallery-${item.id}`}
                    />
                    
                    {/* Media Type Overlay */}
                    <div className="absolute top-2 right-2">
                      {item.type === 'video' ? (
                        <Badge variant="secondary" className="bg-black/70 text-white" data-testid={`badge-video-${item.id}`}>
                          <Play className="h-3 w-3 mr-1" />
                          Video
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-black/70 text-white" data-testid={`badge-image-${item.id}`}>
                          <Camera className="h-3 w-3 mr-1" />
                          Foto
                        </Badge>
                      )}
                    </div>
                    
                    {/* Year Badge */}
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="bg-white/90" data-testid={`badge-year-${item.id}`}>
                        {item.year}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-1" data-testid={`text-title-${item.id}`}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground" data-testid={`text-description-${item.id}`}>
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl" data-testid={`modal-gallery-${item.id}`}>
                <div className="relative">
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className="w-full max-h-[70vh] object-contain"
                    data-testid={`modal-img-${item.id}`}
                  />
                  
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === 'video' ? (
                        <Play className="h-4 w-4 text-primary" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-primary" />
                      )}
                      <Badge variant="secondary">{item.year}</Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
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