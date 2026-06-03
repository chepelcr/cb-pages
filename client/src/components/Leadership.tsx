import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Crown, Users, Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import {
  getLeadership,
  getPeriods,
  filterAndSortPeriods,
  getLeadershipStats,
} from '@/services/leadership.service';
import { interpolateYears } from '@/services/site.service';
import { resolveMedia, resolveMediaAlt } from '@/lib/media';
import { t } from '@/lib/i18n';

export default function Leadership() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 9;

  const leadership = getLeadership();
  const stats = getLeadershipStats();
  const leadershipImageUrl = resolveMedia(leadership.featuredImage);

  const filteredData = filterAndSortPeriods(getPeriods(), { search: searchTerm, sortOrder });
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order as 'asc' | 'desc');
    setCurrentPage(1);
  };

  return (
    <section id="leadership" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4" data-testid="badge-section-leadership">
            {leadership.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6" data-testid="text-leadership-title">
            {leadership.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-leadership-description">
            {interpolateYears(leadership.description)}
          </p>
        </div>

        {/* Featured Leader */}
        <Card className="mb-16 overflow-hidden" data-testid="card-featured-leader">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="lg:order-2">
              <img
                src={leadershipImageUrl}
                alt={resolveMediaAlt(leadership.featuredImage, leadership.featuredTitle)}
                className="w-full h-full object-cover min-h-64"
                data-testid="img-featured-leader"
              />
            </div>
            <CardContent className="p-8 lg:order-1 flex flex-col justify-center">
              <Crown className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4" data-testid="text-featured-title">
                {leadership.featuredTitle}
              </h3>
              <p className="text-muted-foreground mb-4" data-testid="text-featured-description">
                {leadership.featuredDescription}
              </p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.years}+</div>
                  <div className="text-sm text-muted-foreground">{t('leadership.statYears')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.leaders}+</div>
                  <div className="text-sm text-muted-foreground">{t('leadership.statLeaders')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.periods}+</div>
                  <div className="text-sm text-muted-foreground">{t('leadership.statPeriods')}</div>
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
                placeholder={t('leadership.searchPlaceholder')}
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
                  <SelectValue placeholder={t('leadership.sortPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc" data-testid="option-sort-asc">
                    {t('leadership.sortAsc')}
                  </SelectItem>
                  <SelectItem value="desc" data-testid="option-sort-desc">
                    {t('leadership.sortDesc')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Leadership Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedData.map((entry) => (
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
                    <span className="font-semibold">{t('leadership.jefaturaLabel')}</span> {entry.jefe}
                  </div>
                  {entry.subjefes.length > 0 && (
                    <div
                      className="text-sm text-muted-foreground p-2 bg-muted/20 rounded"
                      data-testid={`text-leader-${entry.year}-1`}
                    >
                      <span className="font-semibold">{t('leadership.segundaVozLabel')}</span> {entry.subjefes.join(', ')}
                    </div>
                  )}
                </div>
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="hover-elevate"
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-muted-foreground px-4" data-testid="text-page-info">
              {t('leadership.pageOf', { current: currentPage, total: totalPages })}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('leadership.noResultsTitle')}</h3>
            <p className="text-muted-foreground">{t('leadership.noResultsBody')}</p>
          </Card>
        )}
      </div>
    </section>
  );
}
