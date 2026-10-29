'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, MapPin, SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { CATEGORIES, CITIES, searchEvents, getTicketTypesForEvent, getCategoryById } from '@/lib/mock-data';
import { formatCurrency, formatDateRange, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/search-bar';

const POSTER_COLORS = [
  'bg-[#1a1a2e]', 'bg-[#16213e]', 'bg-[#0f3460]', 'bg-[#533483]',
  'bg-[#e94560]', 'bg-[#2d4059]', 'bg-[#3c6255]', 'bg-[#a13333]',
  'bg-[#1b262c]', 'bg-[#4a0e0e]',
];

function EventsContent() {
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sort, setSort] = useState(searchParams.get('sort') || 'date_asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const filteredEvents = useMemo(() => {
    return searchEvents({
      search: searchQuery,
      category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
      city: selectedCity || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      price_min: priceMin ? parseInt(priceMin) : undefined,
      price_max: priceMax ? parseInt(priceMax) : undefined,
      sort,
    }).filter(e => {
      if (selectedCategories.length > 1) {
        return selectedCategories.includes(e.category_id);
      }
      return true;
    });
  }, [searchQuery, selectedCategories, selectedCity, dateFrom, dateTo, priceMin, priceMax, sort]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedCity('');
    setDateFrom('');
    setDateTo('');
    setPriceMin('');
    setPriceMax('');
    setSort('date_asc');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedCity || dateFrom || dateTo || priceMin || priceMax;

  const FiltersPanel = () => (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <div>
        <label className="text-body-sm font-medium text-ink mb-2 block">Pencarian</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari event..."
          className="w-full bg-transparent border-b-2 border-ink/20 px-0 py-2.5 text-body text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="text-body-sm font-medium text-ink mb-3 block">Kategori</label>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group py-1">
              <span
                className={cn(
                  'w-5 h-5 border-2 flex items-center justify-center transition-colors',
                  selectedCategories.includes(cat.id)
                    ? 'bg-ink border-ink'
                    : 'border-ink/30 group-hover:border-ink/50',
                )}
              >
                {selectedCategories.includes(cat.id) && (
                  <svg className="w-3 h-3 text-ground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="square" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="sr-only"
              />
              <span className="text-body-sm text-ink">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="text-body-sm font-medium text-ink mb-3 block">Kota</label>
        <div className="flex flex-col gap-2">
          {CITIES.map((city) => (
            <label key={city} className="flex items-center gap-3 cursor-pointer group py-1">
              <span
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                  selectedCity === city
                    ? 'bg-ink border-ink'
                    : 'border-ink/30 group-hover:border-ink/50',
                )}
              >
                {selectedCity === city && <span className="w-2 h-2 rounded-full bg-ground" />}
              </span>
              <input
                type="radio"
                name="city"
                checked={selectedCity === city}
                onChange={() => setSelectedCity(selectedCity === city ? '' : city)}
                className="sr-only"
              />
              <span className="text-body-sm text-ink">{city}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div>
        <label className="text-body-sm font-medium text-ink mb-2 block">Tanggal</label>
        <div className="flex gap-3">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="flex-1 bg-transparent border-b-2 border-ink/20 px-0 py-2 text-body-sm text-ink focus:outline-none focus:border-ink transition-colors" />
          <span className="text-ink-faint self-end pb-2">—</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="flex-1 bg-transparent border-b-2 border-ink/20 px-0 py-2 text-body-sm text-ink focus:outline-none focus:border-ink transition-colors" />
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="text-body-sm font-medium text-ink mb-2 block">Harga (IDR)</label>
        <div className="flex gap-3">
          <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="Min"
            className="flex-1 bg-transparent border-b-2 border-ink/20 px-0 py-2 text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors" />
          <span className="text-ink-faint self-end pb-2">—</span>
          <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="Max"
            className="flex-1 bg-transparent border-b-2 border-ink/20 px-0 py-2 text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors" />
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={resetFilters} className="text-body-sm text-accent hover:text-accent-hover transition-colors text-left">
          Reset semua filter
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display font-bold text-display-lg">Jelajahi Event</h1>
        <p className="text-body text-ink-muted mt-2">
          Menampilkan {filteredEvents.length} event
        </p>
      </div>

      {/* Sort & mobile filter button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 text-body-sm font-medium text-ink px-4 py-2 bg-ground-muted hover:bg-ground-subtle transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-accent text-white text-caption flex items-center justify-center">
              {selectedCategories.length + (selectedCity ? 1 : 0)}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-body-sm text-ink-muted">Urutkan:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent text-body-sm font-medium text-ink focus:outline-none cursor-pointer"
          >
            <option value="date_asc">Tanggal terdekat</option>
            <option value="date_desc">Tanggal terjauh</option>
            <option value="price_asc">Harga terendah</option>
            <option value="price_desc">Harga tertinggi</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Desktop filters sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <h2 className="text-body font-medium text-ink mb-6">Filter</h2>
            <FiltersPanel />
          </div>
        </aside>

        {/* Events list */}
        <div className="lg:col-span-9">
          {filteredEvents.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-display-sm font-display font-bold text-ink-muted">Tidak ada event</p>
              <p className="text-body text-ink-faint mt-2">Coba ubah filter pencarian Anda</p>
              <button onClick={resetFilters} className="mt-6 text-body text-accent hover:text-accent-hover transition-colors">
                Reset filter
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredEvents.map((event, i) => {
                const minPrice = Math.min(...getTicketTypesForEvent(event.id).map(t => t.price));
                const category = getCategoryById(event.category_id);
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 py-6 border-b border-ground-subtle last:border-0 hover:bg-ground-muted/50 transition-colors -mx-4 px-4"
                  >
                    {/* Poster */}
                    <div className="sm:col-span-4 aspect-[16/10] sm:aspect-[4/3] relative overflow-hidden bg-ground-dark">
                      <img
                        src={event.poster_url}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 bg-ground-dark/80 backdrop-blur-sm text-white px-2.5 py-0.5 text-caption font-medium">
                        {category?.name}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="sm:col-span-8 flex flex-col justify-between">
                      <div>
                        <span className="text-caption text-ink-faint">{category?.name}</span>
                        <h3 className="font-display font-bold text-display-sm mt-1 group-hover:text-accent transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-body text-ink-muted mt-2 line-clamp-2">
                          {event.short_description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-4 text-body-sm text-ink-muted">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {formatDateRange(event.start_date, event.end_date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {event.venue_name}, {event.city}
                        </span>
                        <span className="font-medium text-ink ml-auto">
                          {minPrice > 0 ? `Mulai ${formatCurrency(minPrice)}` : 'Gratis'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter overlay */}
      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-ground overflow-y-auto">
          <div className="page-padding py-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-bold text-display-sm">Filter</h2>
              <button onClick={() => setFiltersOpen(false)} className="p-2" aria-label="Tutup filter">
                <X className="w-6 h-6" />
              </button>
            </div>
            <FiltersPanel />
            <div className="mt-8 pt-6 border-t border-ground-subtle">
              <Button fullWidth onClick={() => setFiltersOpen(false)}>
                Tampilkan {filteredEvents.length} event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
        <h1 className="font-display font-bold text-display-lg">Jelajahi Event</h1>
        <p className="text-body text-ink-muted mt-2">Memuat...</p>
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}

