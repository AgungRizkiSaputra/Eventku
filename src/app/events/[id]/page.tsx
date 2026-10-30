'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, Clock, MapPin, Share2, Check, ArrowRight, Minus, Plus } from 'lucide-react';
import { useAppContext } from '@/lib/app-context';
import { formatCurrency, formatTime, formatDateRange, getRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CategoryIcon } from '@/components/ui/category-icon';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { events, categories, ticketTypes, users } = useAppContext();

  const eventData = events.find((e) => e.id === eventId || e.slug === eventId);
  const category = categories.find((c) => c.id === eventData?.category_id);
  const eventTicketTypes = ticketTypes.filter((tt) => tt.event_id === eventData?.id);
  const organizer = users.find((u) => u.id === eventData?.organizer_id) || {
    id: 'org-default',
    full_name: 'Penyelenggara Terverifikasi',
    email: 'contact@organizer.id',
    role: 'organizer',
  };

  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  const total = useMemo(() => {
    return eventTicketTypes.reduce((sum, tt) => {
      return sum + (selectedTickets[tt.id] || 0) * tt.price;
    }, 0);
  }, [selectedTickets, eventTicketTypes]);

  const hasSelection = Object.values(selectedTickets).some((q) => q > 0);

  if (!eventData) {
    return (
      <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto text-center">
        <h1 className="font-display font-bold text-display-md">Event Tidak Ditemukan</h1>
        <p className="text-body text-ink-muted mt-4">Acara yang Anda tuju mungkin telah dipindahkan atau dinonaktifkan.</p>
        <Link href="/events" className="inline-block mt-8">
          <Button>Kembali ke Katalog Event</Button>
        </Link>
      </div>
    );
  }

  const updateQuantity = (ticketTypeId: string, delta: number) => {
    const tt = eventTicketTypes.find((t) => t.id === ticketTypeId);
    if (!tt) return;
    const current = selectedTickets[ticketTypeId] || 0;
    const next = Math.max(0, Math.min(current + delta, tt.max_per_order, tt.quota - tt.sold));
    setSelectedTickets((prev) => ({ ...prev, [ticketTypeId]: next }));
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const relatedEvents = events
    .filter((e) => e.category_id === eventData.category_id && e.id !== eventData.id && e.status === 'published')
    .slice(0, 3);

  const bookingParams = new URLSearchParams();
  Object.entries(selectedTickets).forEach(([id, qty]) => {
    if (qty > 0) bookingParams.set(id, qty.toString());
  });

  return (
    <>
      {/* Hero with Cinematic Visual Backdrop */}
      <section className="pt-20 md:pt-24 relative overflow-hidden bg-ground-dark min-h-[460px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={eventData.poster_url}
            alt={eventData.title}
            className="w-full h-full object-cover filter blur-sm scale-105 opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ground-dark via-ground-dark/85 to-ground-dark/70" />
        </div>

        <div className="page-padding max-w-wide mx-auto py-12 md:py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 stagger-children">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="accent" className="flex items-center gap-1.5">
                  <CategoryIcon name={category?.icon} className="w-3.5 h-3.5" />
                  {category?.name}
                </Badge>
                {eventData.is_featured && <Badge variant="warning">Unggulan</Badge>}
              </div>

              <h1 className="font-display font-bold text-display-lg md:text-display-xl text-white">
                {eventData.title}
              </h1>

              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 text-body text-white/80">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  {formatDateRange(eventData.start_date, eventData.end_date)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  {formatTime(eventData.start_time)} – {formatTime(eventData.end_time)}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent" />
                  {eventData.venue_name}, {eventData.city}
                </span>
              </div>

              <p className="text-body text-white/50 mt-4">
                Diselenggarakan oleh <span className="text-white/80 font-medium">{organizer.full_name}</span> · {getRelativeTime(eventData.start_date)}
              </p>
            </div>

            {/* Poster thumbnail preview card */}
            <div className="md:col-span-4 hidden md:block">
              <div className="aspect-[3/4] relative overflow-hidden border border-white/20 shadow-2xl">
                <img
                  src={eventData.poster_url}
                  alt={eventData.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="page-padding max-w-wide mx-auto py-section-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div>
              <h2 className="font-display font-bold text-display-sm mb-6">Tentang Acara</h2>
              <div className="text-body text-ink leading-relaxed whitespace-pre-line">
                {eventData.description}
              </div>
            </div>

            {/* Tags */}
            {eventData.tags && eventData.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {eventData.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}

            {/* Schedule */}
            <div className="mt-section-sm">
              <h2 className="font-display font-bold text-display-sm mb-6">Jadwal & Waktu</h2>
              <div className="bg-ground-muted p-6 border border-ground-subtle">
                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-body font-bold text-ink">{formatDateRange(eventData.start_date, eventData.end_date)}</p>
                    <p className="text-body-sm text-ink-muted mt-1">
                      Pintu dibuka: {formatTime(eventData.start_time)} s/d {formatTime(eventData.end_time)} ({eventData.timezone})
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="mt-section-sm">
              <h2 className="font-display font-bold text-display-sm mb-6">Lokasi Acara</h2>
              <div className="bg-ground-muted p-6 border border-ground-subtle">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-body font-bold text-ink">{eventData.venue_name}</p>
                    <p className="text-body-sm text-ink-muted mt-1">{eventData.venue_address}, {eventData.city}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="mt-section-sm">
              <h2 className="font-display font-bold text-display-sm mb-6">Penyelenggara</h2>
              <div className="flex items-center gap-4 p-5 bg-ground border border-ground-subtle">
                <span className="w-12 h-12 bg-ink text-ground flex items-center justify-center text-body-lg font-bold shrink-0">
                  {organizer.full_name.charAt(0)}
                </span>
                <div>
                  <p className="text-body font-bold text-ink">{organizer.full_name}</p>
                  <p className="text-caption text-ink-muted">{organizer.email}</p>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="mt-section-sm">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-body-sm text-ink-muted hover:text-ink transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Tautan berhasil disalin!' : 'Bagikan acara ini'}
              </button>
            </div>
          </div>

          {/* Sticky Ticket Selector */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 bg-ground-muted p-6 md:p-8 border border-ground-subtle">
              <h2 className="font-display font-bold text-display-sm mb-6">Pilih Tiket</h2>

              <div className="flex flex-col gap-4">
                {eventTicketTypes.map((tt) => {
                  const remaining = tt.quota - tt.sold;
                  const isSoldOut = remaining <= 0;
                  const qty = selectedTickets[tt.id] || 0;

                  return (
                    <div
                      key={tt.id}
                      className={`p-4 bg-ground border border-ground-subtle transition-colors ${
                        isSoldOut ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-body font-bold text-ink">{tt.name}</h3>
                          {tt.description && (
                            <p className="text-caption text-ink-muted mt-1">{tt.description}</p>
                          )}
                          <p className="text-body font-bold text-accent mt-2">
                            {tt.price > 0 ? formatCurrency(tt.price) : 'Gratis'}
                          </p>
                          <p className="text-caption text-ink-faint mt-1">
                            {isSoldOut ? 'Tiket Habis' : `Tersisa ${remaining} tiket`}
                          </p>
                        </div>

                        {!isSoldOut && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => updateQuantity(tt.id, -1)}
                              disabled={qty === 0}
                              className="w-8 h-8 flex items-center justify-center bg-ground-muted hover:bg-ground-subtle disabled:opacity-30 transition-colors"
                              aria-label="Kurangi"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-body font-bold">{qty}</span>
                            <button
                              onClick={() => updateQuantity(tt.id, 1)}
                              disabled={qty >= tt.max_per_order || qty >= remaining}
                              className="w-8 h-8 flex items-center justify-center bg-ground-muted hover:bg-ground-subtle disabled:opacity-30 transition-colors"
                              aria-label="Tambah"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total calculation */}
              <div className="mt-6 pt-6 border-t border-ground-subtle">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-body text-ink-muted">Total Pembayaran</span>
                  <span className="font-display font-bold text-display-sm text-ink">
                    {formatCurrency(total)}
                  </span>
                </div>

                <Link
                  href={hasSelection ? `/events/${eventData.id}/booking?${bookingParams.toString()}` : '#'}
                  onClick={(e) => {
                    if (!hasSelection) e.preventDefault();
                  }}
                >
                  <Button fullWidth size="lg" disabled={!hasSelection}>
                    Pesan Tiket Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <section className="page-padding max-w-wide mx-auto py-section-sm border-t border-ground-subtle">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-caption text-accent uppercase tracking-wider font-medium block">Rekomendasi Terkait</span>
              <h2 className="font-display font-bold text-display-sm">Acara Serupa Lainnya</h2>
            </div>
            <Link href={`/events?category=${eventData.category_id}`} className="text-body-sm text-ink-muted hover:text-ink flex items-center gap-1">
              Lihat kategori ini <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedEvents.map((event) => {
              const tts = ticketTypes.filter((t) => t.event_id === event.id);
              const minPrice = tts.length > 0 ? Math.min(...tts.map((t) => t.price)) : 0;

              return (
                <Link key={event.id} href={`/events/${event.id}`} className="group block bg-ground border border-ground-subtle overflow-hidden">
                  <div className="aspect-[16/10] relative overflow-hidden bg-ground-dark">
                    <img
                      src={event.poster_url}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="font-display font-bold text-body text-white group-hover:text-accent transition-colors leading-tight">
                        {event.title}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 text-body-sm text-ink-muted">
                      <span>{formatDateRange(event.start_date, event.end_date)}</span>
                      <span>{event.city}</span>
                    </div>
                    <p className="text-body-sm font-semibold text-accent mt-2">
                      {minPrice > 0 ? `Mulai ${formatCurrency(minPrice)}` : 'Gratis'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
