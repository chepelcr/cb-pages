import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDown } from 'lucide-react';
import heroImage from '@assets/image_1758163215007.png';
import { useQuery } from '@tanstack/react-query';
import type { SiteConfig } from '@shared/schema';

export default function Hero() {
  const { data: config, isLoading } = useQuery<SiteConfig>({
    queryKey: ['/api/admin/site-config'],
  });

  const foundingYear = config?.foundingYear || 1951;
  const yearsOfTradition = new Date().getFullYear() - foundingYear;

  const navigateToHistory = () => {
    window.location.href = '/historia';
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Cuerpo de Banderas ceremony" 
          className="w-full h-full object-cover object-top"
          data-testid="img-hero-background"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Badge 
          variant="secondary" 
          className="mb-6 bg-white/10 backdrop-blur text-white border-white/20"
          data-testid="badge-tradition"
        >
          Tradición desde {foundingYear}
        </Badge>
        
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-3/4 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-24 w-full mx-auto mb-8 bg-white/20" />
          </>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" data-testid="text-hero-title">
              {config?.siteName || 'Cuerpo de Banderas'}
              <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2 text-primary">
                {config?.siteSubtitle || 'Liceo de Costa Rica'}
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed" data-testid="text-hero-description">
              {config?.heroDescription || 'Honor, disciplina y patriotismo. Formando jóvenes costarricenses con pasos chilenos adaptados a nuestra cultura nacional.'}
            </p>
          </>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary hover-elevate px-8 py-3"
            onClick={navigateToHistory}
            data-testid="button-learn-history"
          >
            Conoce Nuestra Historia
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 hover-elevate px-8 py-3"
            onClick={() => window.location.href = '/escudos'}
            data-testid="button-view-shields"
          >
            Ver Escudos
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Card className="bg-white/10 backdrop-blur border-white/20 p-6 text-center" data-testid="card-stat-years">
            <div className="text-3xl font-bold text-white mb-2">{yearsOfTradition}+</div>
            <div className="text-white/80">Años de Tradición</div>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur border-white/20 p-6 text-center" data-testid="card-stat-leaders">
            <div className="text-3xl font-bold text-white mb-2">120+</div>
            <div className="text-white/80">Líderes Formados</div>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur border-white/20 p-6 text-center" data-testid="card-stat-ceremonies">
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-white/80">Ceremonias Realizadas</div>
          </Card>
        </div>

        {/* Scroll indicator */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-white hover:bg-white/10 animate-bounce"
          data-testid="button-scroll-down"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}