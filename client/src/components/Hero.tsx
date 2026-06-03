import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown } from 'lucide-react';
import { useLocation } from 'wouter';
import { getHero, getBranding, getFoundingYear } from '@/services/site.service';
import { resolveMedia } from '@/lib/media';

export default function Hero() {
  const [, navigate] = useLocation();
  const hero = getHero();
  const branding = getBranding();
  const foundingYear = getFoundingYear();
  const heroImage = resolveMedia(hero.backgroundImage);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt={hero.backgroundAlt}
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
          {branding.traditionLabelPrefix} {foundingYear}
        </Badge>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" data-testid="text-hero-title">
          {hero.title}
          <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2 text-primary">
            {hero.subtitle}
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed" data-testid="text-hero-description">
          {hero.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {hero.ctas.map((cta) =>
            cta.variant === 'primary' ? (
              <Button
                key={cta.id}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-primary hover-elevate px-8 py-3"
                onClick={() => navigate(cta.path)}
                data-testid="button-learn-history"
              >
                {cta.label}
              </Button>
            ) : (
              <Button
                key={cta.id}
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 hover-elevate px-8 py-3"
                onClick={() => navigate(cta.path)}
                data-testid="button-view-shields"
              >
                {cta.label}
              </Button>
            ),
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {hero.stats.map((stat) => (
            <Card key={stat.id} className="bg-white/10 backdrop-blur border-white/20 p-6 text-center" data-testid={`card-${stat.id}`}>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/80">{stat.label}</div>
            </Card>
          ))}
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
