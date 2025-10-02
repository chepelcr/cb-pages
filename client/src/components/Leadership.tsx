import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { LeadershipPeriod, SiteConfig } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Crown, Users, Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import leaderImage from '@assets/image_1758163080578.png';

export default function Leadership() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 9;

  const { data: leadershipData, isLoading } = useQuery<LeadershipPeriod[]>({
    queryKey: ['/api/admin/leadership'],
  });

  const { data: siteConfig } = useQuery<SiteConfig>({
    queryKey: ['/api/admin/site-config'],
  });

  const foundingYear = siteConfig?.foundingYear || 1951;
  const currentYear = new Date().getFullYear();
  const yearsOfLeadership = currentYear - foundingYear;
  const leadershipTitle = siteConfig?.leadershipTitle || 'Tradición de Liderazgo';
  const leadershipDescription = siteConfig?.leadershipDescription || 'Desde 1951, el Cuerpo de Banderas ha sido dirigido por estudiantes excepcionales que han demostrado los más altos estándares de disciplina, patriotismo y liderazgo.';
  const leadershipImageUrl = siteConfig?.leadershipImageUrl || leaderImage;
  
  const numberOfLeaders = leadershipData?.length || 0;
  const numberOfPeriods = leadershipData?.length || 0;

  const getFirstYear = (yearString: string): number => {
    const yearMatch = yearString.match(/\d{4}/);
    return yearMatch ? parseInt(yearMatch[0]) : 0;
  };

  const filteredData = (leadershipData || [])
    .filter(entry => 
      entry.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.jefatura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.segundaVoz && entry.segundaVoz.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const yearA = getFirstYear(a.year);
      const yearB = getFirstYear(b.year);
      return sortOrder === 'asc' ? yearA - yearB : yearB - yearA;
    });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSortChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  return (
    <section id="leadership" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4" data-testid="badge-section-leadership">
            Liderazgo Histórico
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" data-testid="text-leadership-title">
            Líderes del Cuerpo de Banderas
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-leadership-description">
            Un recorrido por la historia de nuestros líderes, desde {foundingYear} hasta la actualidad.
            Cada generación ha contribuido al legado de honor y tradición.
          </p>
        </div>

        {/* Featured Leader */}
        <Card className="mb-16 overflow-hidden" data-testid="card-featured-leader">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="lg:order-2">
              <img 
                src={leadershipImageUrl} 
                alt="Líder destacado del Cuerpo de Banderas" 
                className="w-full h-full object-cover min-h-64"
                data-testid="img-featured-leader"
              />
            </div>
            <CardContent className="p-8 lg:order-1 flex flex-col justify-center">
              <Crown className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="text-featured-title">
                {leadershipTitle}
              </h3>
              <p className="text-muted-foreground mb-4" data-testid="text-featured-description">
                {leadershipDescription}
              </p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{yearsOfLeadership}+</div>
                  <div className="text-sm text-muted-foreground">Años</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{numberOfLeaders}+</div>
                  <div className="text-sm text-muted-foreground">Líderes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{numberOfPeriods}+</div>
                  <div className="text-sm text-muted-foreground">Períodos</div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Search and Sort Controls */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por año o nombre..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
                data-testid="input-leadership-search"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortOrder} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40" data-testid="select-sort-order">
                  <SelectValue placeholder="Ordenar por año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc" data-testid="option-sort-asc">
                    Año ascendente
                  </SelectItem>
                  <SelectItem value="desc" data-testid="option-sort-desc">
                    Año descendente
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Leadership Timeline */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(9)].map((_, index) => (
              <Skeleton key={index} className="h-40 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedData.map((entry, index) => (
              <Card key={entry.id} className="hover-elevate transition-all duration-300" data-testid={`card-leadership-${entry.year}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" data-testid={`badge-year-${entry.year}`}>
                      {entry.year}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div 
                      className="text-sm text-muted-foreground p-2 bg-muted/20 rounded"
                      data-testid={`text-leader-${entry.year}-0`}
                    >
                      <span className="font-semibold">Jefatura:</span> {entry.jefatura}
                    </div>
                    {entry.segundaVoz && (
                      <div 
                        className="text-sm text-muted-foreground p-2 bg-muted/20 rounded"
                        data-testid={`text-leader-${entry.year}-1`}
                      >
                        <span className="font-semibold">Segunda voz:</span> {entry.segundaVoz}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2" data-testid="pagination-controls">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="hover-elevate"
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm text-muted-foreground px-4" data-testid="text-page-info">
              Página {currentPage} de {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="hover-elevate"
              data-testid="button-next-page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* No Results */}
        {!isLoading && filteredData.length === 0 && (
          <Card className="p-8 text-center" data-testid="card-no-results">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron resultados</h3>
            <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
          </Card>
        )}
      </div>
    </section>
  );
}
