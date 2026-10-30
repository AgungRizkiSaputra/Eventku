'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Calendar, MapPin, SlidersHorizontal, X } from 'lucide-react';
import { useAppContext } from '@/lib/app-context';
import { CITIES } from '@/lib/mock-data';
import { formatCurrency, formatDateRange, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CategoryIcon } from '@/components/ui/category-icon';

function EventsContent() {
  const searchParams = useSearchParams();
  const { events, categories, ticketTypes } = useAppContext();

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

  const getMinPrice = (eventId: string): number => {
    const tts = ticketTypes.filter((t) => t.event_id === eventId);
    if (tts.length === 0) return 0;
    return Math.min(...tts.map((t) => t.price));
  };

  const filteredEvents = useMemo(() => {
    let results = events.filter((e) => e.status === 'published');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.short_description.toLowerCase().includes(q) ||
          e.venue_name.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      results = results.filter((e) => selectedCategories.includes(e.category_id));
    }

    if (selectedCity) {
      results = results.filter((e) => e.city.toLowerCase() === selectedCity.toLowerCase());
    }

    if (dateFrom) {
      results = results.filter((e) => e.start_date >= dateFrom);
    }

    if (dateTo) {
      results = results.filter((e) => e.start_date <= dateTo);
    }

    if (priceMin || priceMax) {
      const min = priceMin ? parseInt(priceMin) : 0;
      const max = priceMax ? parseInt(priceMax) : Infinity;
      results = results.filter((e) => {
        const p = getMinPrice(e.id);
        return p >= min && p <= max;
      });
    }

    switch (sort) {
      case 'date_asc':
        results.sort((a, b) => a.start_date.localeCompare(b.start_date));
        break;
      case 'date_desc':
        results.sort((a, b) => b.start_date.localeCompare(a.start_date));
        break;
      case 'price_asc':
        results.sort((a, b) => getMinPrice(a.id) - getMinPrice(b.id));
        break;
      case 'price_desc':
        results.sort((a, b) => getMinPrice(b.id) - getMinPrice(a.id));
        break;
      default:
        results.sort((a, b) => a.start_date.localeCompare(b.start_date));
    }

    return results;
  }, [events, ticketTypes, searchQuery, selectedCategories, selectedCity, dateFrom, dateTo, priceMin, priceMax, sort]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
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

  const hasActiveFilters = selectedCategories.length > 0 || selectedCity || dateFrom || dateTo || priceMin || priceMax || searchQuery;

  const FiltersPanel = () => (
    <div className="flex flex-col gap-8">
      {/* Search Input */}
      <div>
        <label className="text-body-sm font-medium text-ink mb-2 block">Pencarian Acara</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nama event, artis, atau venue..."
          className="w-full bg-transparent border-b-2 border-ink/20 px-0 py-2.5 text-body text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
        />
      </div>

      {/* Categories Multi-Select with SVG Icons */}
      <div>
        <label className="text-body-sm font-medium text-ink mb-3 block">Kategori Acara</label>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
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
              <span className="flex items-center gap-2 text-body-sm text-ink">
                <CategoryIcon name={cat.icon} className="w-4 h-4 text-accent" />
                <span>{cat.name}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* City */}
      <div>
        <label className="text-body-sm font-medium text-ink mb-3 block">Kota</label>
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-2">
          {CITIES.map((city) => (
            <label key={city} className="flex items-center gap-3 cursor-pointer group py-1">
              <span
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors',
                  selectedCity === city ? 'bg-ink border-ink' : 'border-ink/30 group-hover:border-ink/50',
                )}
              >
                {selectedCity === city && <span className="w-1.5 h-1.5 rounded-full bg-ground" />}
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
        <label className="text-body-sm font-medium text-ink mb-2 block">Rentang Tanggal</label>
        <div className="flex gap-3">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="flex-1 bg-transparent border-b-2 border-ink/20 px-0 py-2 text-body-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
          <span className="text-ink-faint self-end pb-2">—</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="flex-1 bg-transparent border-b-2 border-ink/20 px-0 py-2 text-body-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="text-body-sm font-medium text-ink mb-2 block">Rentang Harga (IDR)</label>
        <div className="flex gap-3">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="Min"
            className="flex-1 bg-transparent border-b-2 border-ink/20 px-0 py-2 text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
          />
          <span className="text-ink-faint self-end pb-2">—</span>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Max"
            className="flex-1 bg-transparent border-b-2 border-ink/20 px-0 py-2 text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={resetFilters} className="text-body-sm text-accent hover:underline transition-colors text-left font-medium">
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
          Menemukan <strong className="text-ink">{filteredEvents.length}</strong> event terpublikasi
        </p>
      </div>

      {/* Sort & mobile filter button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => setFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 text-body-sm font-medium text-ink px-4 py-2 bg-ground-muted hover:bg-ground-subtle transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter Acara
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-accent text-white text-caption flex items-center justify-center font-bold">
              {selectedCategories.length + (selectedCity ? 1 : 0)}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-body-sm text-ink-muted">Urutkan:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent text-body-sm font-medium text-ink focus:outline-none cursor-pointer border-b border-ground-subtle pb-1"
          >
            <option value="date_asc">Tanggal Terdekat</option>
            <option value="date_desc">Tanggal Terjauh</option>
            <option value="price_asc">Harga Terendah</option>
            <option value="price_desc">Harga Tertinggi</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Desktop filters sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24">
            <h2 className="text-body font-bold text-ink mb-6 pb-2 border-b border-ground-subtle">
              Filter Pencarian
            </h2>
            <FiltersPanel />
          </div>
        </aside>

        {/* Events list */}
        <div className="lg:col-span-9">
          {filteredEvents.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-ground-subtle p-8">
              <p className="text-display-sm font-display font-bold text-ink-muted">Tidak Ada Event yang Sesuai</p>
              <p className="text-body text-ink-faint mt-2">Coba ubah kata kunci atau longgarkan filter pencarian Anda.</p>
              <button onClick={resetFilters} className="mt-6 px-6 py-2.5 bg-ink text-ground text-body-sm font-medium hover:bg-accent transition-colors">
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredEvents.map((event) => {
                const minPrice = getMinPrice(event.id);
                const category = categories.find((c) => c.id === event.category_id);

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className="group grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 py-6 border-b border-ground-subtle last:border-0 hover:bg-ground-muted/40 transition-colors -mx-4 px-4"
                  >
                    {/* Poster */}
                    <div className="sm:col-span-4 aspect-[16/10] sm:aspect-[4/3] relative overflow-hidden bg-ground-dark">
                      <img
                        src={event.poster_url}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 bg-ground-dark/80 backdrop-blur-sm text-white px-2.5 py-0.5 text-caption font-medium flex items-center gap-1.5">
                        <CategoryIcon name={category?.icon} className="w-3.5 h-3.5 text-accent" />
                        <span>{category?.name}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="sm:col-span-8 flex flex-col justify-between">
                      <div>
                        <span className="text-caption text-ink-faint uppercase tracking-wider font-semibold">
                          {category?.name}
                        </span>
                        <h3 className="font-display font-bold text-display-sm mt-1 group-hover:text-accent transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-body text-ink-muted mt-2 line-clamp-2">
                          {event.short_description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-4 text-body-sm text-ink-muted">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-accent" />
                          {formatDateRange(event.start_date, event.end_date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-accent" />
                          {event.venue_name}, {event.city}
                        </span>
                        <span className="font-bold text-ink ml-auto">
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
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-ground-subtle">
              <h2 className="font-display font-bold text-display-sm">Filter Acara</h2>
              <button onClick={() => setFiltersOpen(false)} className="p-2" aria-label="Tutup filter">
                <X className="w-6 h-6" />
              </button>
            </div>
            <FiltersPanel />
            <div className="mt-8 pt-6 border-t border-ground-subtle">
              <Button fullWidth onClick={() => setFiltersOpen(false)}>
                Tampilkan {filteredEvents.length} Event
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
    <Suspense
      fallback={
        <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
          <h1 className="font-display font-bold text-display-lg">Jelajahi Event</h1>
          <p className="text-body text-ink-muted mt-2">Memuat daftar acara...</p>
        </div>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
