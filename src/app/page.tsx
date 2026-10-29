'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { MOCK_EVENTS, CATEGORIES, getTicketTypesForEvent, getCategoryById } from '@/lib/mock-data';
import { formatCurrency, formatDateRange, getDaysUntil, cn } from '@/lib/utils';
import { SearchBar } from '@/components/ui/search-bar';
import { Button } from '@/components/ui/button';

function getMinPrice(eventId: string): number {
  const tts = getTicketTypesForEvent(eventId);
  if (tts.length === 0) return 0;
  return Math.min(...tts.map((t) => t.price));
}

export default function HomePage() {
  const featuredEvents = MOCK_EVENTS.filter((e) => e.is_featured && e.status === 'published');
  const upcomingEvents = [...MOCK_EVENTS]
    .filter((e) => e.status === 'published')
    .sort((a, b) => a.start_date.localeCompare(b.start_date));

  const nearestEvent = upcomingEvents[0];
  const daysUntilNearest = nearestEvent ? getDaysUntil(nearestEvent.start_date) : 0;

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-ground-dark text-ground min-h-screen flex items-end relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent pointer-events-none" />

        <div className="page-padding max-w-wide mx-auto w-full pb-16 md:pb-24 pt-32 md:pt-40 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Left: headline */}
            <div className="lg:col-span-7 stagger-children">
              <span className="text-body-sm font-medium tracking-wider text-accent uppercase mb-3 block">
                Platform Event & E-Ticketing Indonesia
              </span>
              <h1 className="font-display font-bold text-display-xl tracking-tight text-white">
                Temukan Event<br />Luar Biasa
              </h1>
              <p className="text-body-lg text-ground/70 mt-6 max-w-md">
                Konser akbar, festival musik, konferensi teknologi, dan workshop kreatif. Temukan acara impian dan dapatkan e-ticket instan ber-QR code resmi.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/events">
                  <Button size="lg" className="gap-2">
                    Jelajahi Event <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white hover:text-ink">
                    Buat Event Sendiri
                  </Button>
                </Link>
              </div>

              {/* Nearest event countdown */}
              {nearestEvent && daysUntilNearest > 0 && (
                <div className="mt-12 flex items-end gap-4 p-4 bg-white/5 border border-white/10 max-w-md">
                  <span className="font-display font-bold text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-accent">
                    {daysUntilNearest}
                  </span>
                  <div className="pb-1">
                    <p className="text-caption text-ground/50 uppercase tracking-wider">Hari menuju acara terdekat</p>
                    <p className="text-body font-medium text-ground truncate max-w-xs">{nearestEvent.title}</p>
                    <p className="text-caption text-ground/60 mt-0.5">{nearestEvent.city} · {formatDateRange(nearestEvent.start_date, nearestEvent.end_date)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: poster collage with real photography */}
            <div className="lg:col-span-5 relative h-[380px] md:h-[520px] hidden md:block">
              {featuredEvents.slice(0, 3).map((event, i) => {
                const positions = [
                  'absolute right-0 top-0 w-[68%] h-[72%] z-30 shadow-2xl',
                  'absolute right-[28%] bottom-0 w-[58%] h-[62%] z-20 shadow-xl',
                  'absolute left-0 top-[12%] w-[48%] h-[52%] z-10 shadow-lg',
                ];
                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.id}`}
                    className={cn(
                      positions[i],
                      'group overflow-hidden transition-all duration-400 hover:scale-[1.04] hover:z-40 border border-white/10',
                    )}
                  >
                    <img
                      src={event.poster_url}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                      <span className="text-caption text-accent font-medium">{getCategoryById(event.category_id)?.name}</span>
                      <h3 className="font-display font-bold text-body-lg text-white mt-1 leading-tight group-hover:text-accent transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-caption text-white/70 mt-1">
                        {event.city} · {formatDateRange(event.start_date, event.end_date)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH & CATEGORIES ── */}
      <section className="page-padding max-w-wide mx-auto py-section-sm border-b border-ground-subtle">
        <div className="max-w-2xl mb-8">
          <p className="text-caption text-ink-faint uppercase tracking-wider mb-2 font-medium">Pencarian Langsung</p>
          <SearchBar large placeholder="Cari konser, seminar, artis, atau kota favorit..." />
        </div>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/events?category=${cat.id}`}
              className="px-4 py-2 bg-ground-muted text-body-sm text-ink font-medium hover:bg-ink hover:text-ground transition-all flex items-center gap-2"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED EVENTS ── */}
      <section className="page-padding max-w-wide mx-auto py-section-sm">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-caption text-accent uppercase tracking-wider font-medium block">Pilihan Kurator</span>
            <h2 className="font-display font-bold text-display-md">Event Populer</h2>
          </div>
          <Link href="/events" className="text-body text-ink-muted hover:text-ink transition-colors flex items-center gap-1 font-medium">
            Lihat semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large card */}
          {featuredEvents[0] && (
            <Link
              href={`/events/${featuredEvents[0].id}`}
              className="lg:col-span-7 group block relative overflow-hidden bg-ground-dark"
            >
              <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden">
                <img
                  src={featuredEvents[0].poster_url}
                  alt={featuredEvents[0].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
                  <span className="text-caption text-accent font-medium tracking-wider uppercase">
                    {getCategoryById(featuredEvents[0].category_id)?.name}
                  </span>
                  <h3 className="font-display font-bold text-display-sm md:text-display-md text-white mt-2 group-hover:text-accent transition-colors leading-tight">
                    {featuredEvents[0].title}
                  </h3>
                  <p className="text-body text-white/75 mt-3 max-w-lg line-clamp-2">
                    {featuredEvents[0].short_description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-5 text-body-sm text-white/70">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-accent" />
                      {formatDateRange(featuredEvents[0].start_date, featuredEvents[0].end_date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-accent" />
                      {featuredEvents[0].venue_name}, {featuredEvents[0].city}
                    </span>
                  </div>
                  <p className="text-body-lg font-bold text-white mt-4">
                    Mulai {formatCurrency(getMinPrice(featuredEvents[0].id))}
                  </p>
                </div>
              </div>
            </Link>
          )}

          {/* Stacked smaller cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {featuredEvents.slice(1, 3).map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group block relative overflow-hidden bg-ground-dark flex-1"
              >
                <div className="relative aspect-[16/9] h-full overflow-hidden">
                  <img
                    src={event.poster_url}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 z-10">
                    <span className="text-caption text-accent font-medium uppercase tracking-wider">
                      {getCategoryById(event.category_id)?.name}
                    </span>
                    <h3 className="font-display font-bold text-body-lg md:text-display-sm text-white mt-1 group-hover:text-accent transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-body-sm text-white/70">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        {formatDateRange(event.start_date, event.end_date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        {event.city}
                      </span>
                    </div>
                    <p className="text-body-sm font-semibold text-white mt-2">
                      Mulai {formatCurrency(getMinPrice(event.id))}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS (HORIZONTAL REEL) ── */}
      <section className="py-section-sm bg-ground-muted border-y border-ground-subtle">
        <div className="page-padding max-w-wide mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-caption text-accent uppercase tracking-wider font-medium block">Kalender Acara</span>
              <h2 className="font-display font-bold text-display-md">Event Mendatang</h2>
            </div>
            <Link href="/events?sort=date_asc" className="text-body text-ink-muted hover:text-ink transition-colors flex items-center gap-1 font-medium">
              Lihat jadwal lengkap <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="page-padding max-w-wide mx-auto">
          <div
            className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'thin' }}
          >
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="snap-start shrink-0 w-[280px] md:w-[320px] group block bg-ground border border-ground-subtle overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-ground-dark">
                  <img
                    src={event.poster_url}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-ground-dark/80 backdrop-blur-sm text-white px-2.5 py-1 text-caption font-medium">
                    {getCategoryById(event.category_id)?.name}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display font-bold text-body-lg text-ink group-hover:text-accent transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-1.5 text-body-sm text-ink-muted">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    {formatDateRange(event.start_date, event.end_date)}
                  </div>
                  <div className="flex items-center gap-1.5 text-body-sm text-ink-muted mt-1">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    {event.venue_name}, {event.city}
                  </div>
                  <div className="mt-4 pt-3 border-t border-ground-subtle flex items-center justify-between">
                    <span className="text-caption text-ink-faint">Harga Tiket</span>
                    <span className="font-bold text-body-sm text-ink">
                      {getMinPrice(event.id) > 0 ? formatCurrency(getMinPrice(event.id)) : 'Gratis'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES (EDITORIAL LIST) ── */}
      <section className="page-padding max-w-wide mx-auto py-section">
        <div className="max-w-xl mb-12">
          <span className="text-caption text-accent uppercase tracking-wider font-medium block">Katalog Lengkap</span>
          <h2 className="font-display font-bold text-display-md">Jelajahi Berdasarkan Kategori</h2>
        </div>

        <div className="flex flex-col">
          {CATEGORIES.map((cat, i) => {
            const count = MOCK_EVENTS.filter((e) => e.category_id === cat.id && e.status === 'published').length;
            return (
              <Link
                key={cat.id}
                href={`/events?category=${cat.id}`}
                className={cn(
                  'group flex items-center justify-between py-6 md:py-8 transition-colors',
                  i < CATEGORIES.length - 1 && 'border-b border-ground-subtle',
                )}
              >
                <div className="flex items-center gap-6">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h3 className="font-display font-bold text-display-sm group-hover:text-accent transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-body-sm text-ink-muted mt-0.5 hidden sm:block">{cat.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-body-sm font-medium text-ink-faint">{count} event</span>
                  <ArrowRight className="w-5 h-5 text-ink-faint group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-ground-dark text-ground py-section relative overflow-hidden">
        <div className="page-padding max-w-wide mx-auto relative z-10">
          <div className="max-w-2xl">
            <span className="text-caption text-accent uppercase tracking-wider font-medium block mb-2">Untuk Penyelenggara</span>
            <h2 className="font-display font-bold text-display-lg leading-tight">
              Mulai Terbitkan Acara Anda Hari Ini
            </h2>
            <p className="text-body-lg text-ground/70 mt-4 max-w-lg leading-relaxed">
              Jangkau puluhan ribu peminat konser dan festival di seluruh Indonesia. Kelola kuota tiket, pantau penjualan waktu-nyata, dan validasi peserta di gerbang dengan scanner terintegrasi.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/auth/register">
                <Button size="lg">Daftar Sebagai Penyelenggara</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white hover:text-ink">
                  Buka Organizer Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
