import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Crown, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import leaderImage from '@assets/generated_images/Honor_guard_leader_portrait_c2aeb102.png';

// todo: remove mock functionality - Historical leadership data from 1951-2022
const historicalLeadership = [
  { year: "1951", leaders: ["Acidos Castrio", "Mario Parra"] },
  { year: "1961", leaders: ["Franklin Perez", "Francisco I. Pastor"] },
  { year: "1970 - 1971", leaders: [] },
  { year: "1972", leaders: ["Orlando Gonzalez", "Alberto Lome Mateis"] },
  { year: "1973 - 1974", leaders: ["Gaspar Miranda Ortega", "Galgan I. Miranda O."] },
  { year: "1975 - 1976", leaders: ["Oscar Carvajal", "Gerardo Parez"] },
  { year: "1976 - 1978", leaders: ["Cristian Leon", "Frany Josef Korte"] },
  { year: "1978 - 1979", leaders: ["Cristian Leon", "Frany Josef Korte"] },
  { year: "1979 - 1981", leaders: ["Cristian Leon", "Frany Josef Korte"] },
  { year: "1982", leaders: ["Mauricio Hernandez", "Cristian Leon"] },
  { year: "1983 - 1985", leaders: ["Erica Mata", "Mauricio Hernandez"] },
  { year: "1986", leaders: ["Jose J. Garzon", "Gustavo Segrda"] },
  { year: "1986", leaders: ["Gustavo Segrda", "Erica Mata"] },
  { year: "1985 - 1986", leaders: ["Carlos Maas", "Erick Ortiz"] },
  { year: "1986 - 1987", leaders: ["Carlos Maas", "Jimmy Meza"] },
  { year: "1987", leaders: ["Carlos Maas", "Jimmy Meza"] },
  { year: "1987 - 1989", leaders: ["Raul Cuadra", "Carlos Maas"] },
  { year: "1990", leaders: ["Javier Cedeno", "Ronny Lopez"] },
  { year: "1990", leaders: ["Guillermo Silva", "Ronny Lopez"] },
  { year: "1991", leaders: ["Ramirez Castillo", "Manrique Fungula"] },
  { year: "1992 - 1993", leaders: ["Manrique Fungula", "Oscar Murillo"] },
  { year: "1993 - 1994 - 1995", leaders: ["Manrique Fungula", "Juan R. Bonilla"] },
  { year: "1996 - 1997", leaders: ["Ricardo Alotera", "Jose Pablo Calderon"] },
  { year: "1998", leaders: ["Ifrain Sait", "Warren Aragon"] },
  { year: "1999 - 2000 - 2001", leaders: ["Henry Salajar", "Esteban Cordoba"] },
  { year: "2002 - 2003 - 2004", leaders: ["Guillermo Mejia", "Carlos Andres Sanchez"] },
  { year: "2005 - 2006 - 2007", leaders: ["Edgar Talajar", "Isaac Pena"] },
  { year: "2008", leaders: ["Edgar Salazar", "Adrian Alvarez"] },
  { year: "2009", leaders: ["Ronald Mauricio Izaba", "Jorge Sosa"] },
  { year: "2010", leaders: ["Willy Meza", "Roger Altamirano"] },
  { year: "2011 - 2012", leaders: ["Jesus Cruz", "Eddie Sursing"] },
  { year: "2013 - 2014", leaders: ["Eddie Sursing"] },
  { year: "2015", leaders: ["Sebastian Sedo (No desfiló)"] },
  { year: "2015", leaders: ["Andrey Araya"] },
  { year: "2016 - 2017", leaders: ["Andres Quiros", "Luis Zelaya"] },
  { year: "2018 - 2019", leaders: ["Diego Zelaya"] },
  { year: "2020 - 2021 - 2022", leaders: ["Jouzel"] }
];

export default function Leadership() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter leadership data based on search
  const filteredData = historicalLeadership.filter(entry => 
    entry.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.leaders.some(leader => 
      leader.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    console.log('Searching for:', value);
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
            Un recorrido por la historia de nuestros líderes, desde 1951 hasta la actualidad.
            Cada generación ha contribuido al legado de honor y tradición.
          </p>
        </div>

        {/* Featured Leader */}
        <Card className="mb-16 overflow-hidden" data-testid="card-featured-leader">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="lg:order-2">
              <img 
                src={leaderImage} 
                alt="Líder destacado del Cuerpo de Banderas" 
                className="w-full h-full object-cover min-h-64"
                data-testid="img-featured-leader"
              />
            </div>
            <CardContent className="p-8 lg:order-1 flex flex-col justify-center">
              <Crown className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="text-featured-title">
                Tradición de Liderazgo
              </h3>
              <p className="text-muted-foreground mb-4" data-testid="text-featured-description">
                Desde 1951, el Cuerpo de Banderas ha sido dirigido por estudiantes excepcionales 
                que han demostrado los más altos estándares de disciplina, patriotismo y liderazgo.
              </p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">70+</div>
                  <div className="text-sm text-muted-foreground">Años</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">120+</div>
                  <div className="text-sm text-muted-foreground">Líderes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">35+</div>
                  <div className="text-sm text-muted-foreground">Períodos</div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
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
        </div>

        {/* Leadership Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedData.map((entry, index) => (
            <Card key={`${entry.year}-${index}`} className="hover-elevate transition-all duration-300" data-testid={`card-leadership-${entry.year}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <Badge variant="secondary" data-testid={`badge-year-${entry.year}`}>
                    {entry.year}
                  </Badge>
                </div>
                <CardTitle className="text-lg" data-testid={`text-year-title-${entry.year}`}>
                  Liderazgo {entry.year}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {entry.leaders.length > 0 ? (
                  <div className="space-y-2">
                    {entry.leaders.map((leader, leaderIndex) => (
                      <div 
                        key={leaderIndex} 
                        className="text-sm text-muted-foreground p-2 bg-muted/20 rounded"
                        data-testid={`text-leader-${entry.year}-${leaderIndex}`}
                      >
                        {leader}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic" data-testid={`text-no-leaders-${entry.year}`}>
                    Sin registros de liderazgo
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

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
        {filteredData.length === 0 && (
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