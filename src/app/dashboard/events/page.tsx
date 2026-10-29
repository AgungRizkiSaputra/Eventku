'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { MOCK_EVENTS, MOCK_TICKET_TYPES, CATEGORIES } from '@/lib/mock-data';
import { formatCurrency, formatDateRange } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, ExternalLink, Calendar, MapPin, Eye } from 'lucide-react';

export default function ManageEventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const events = MOCK_EVENTS.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || e.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-display-md">Kelola Event</h1>
          <p className="text-body text-ink-muted mt-1">Daftar semua acara, status penerbitan, dan kuota tiket Anda.</p>
        </div>
        <Link href="/dashboard/events/new">
          <Button className="gap-2">
            <PlusCircle className="w-4 h-4" /> Buat Event Baru
          </Button>
        </Link>
      </div>

      <DashboardNav />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Cari nama event, venue, atau kota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-ground border border-ground-subtle pl-10 pr-4 py-2.5 text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'published', 'draft', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 text-body-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-ink text-ground'
                  : 'bg-ground-muted text-ink-muted hover:text-ink hover:bg-ground-subtle'
              }`}
            >
              {status === 'all' && 'Semua'}
              {status === 'published' && 'Tayang'}
              {status === 'draft' && 'Draf'}
              {status === 'completed' && 'Selesai'}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table / Card List */}
      <div className="bg-ground border border-ground-subtle overflow-hidden">
        <div className="divide-y divide-ground-subtle">
          {events.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-body text-ink-muted">Tidak ada event yang cocok dengan pencarian Anda.</p>
            </div>
          ) : (
            events.map((event) => {
              const category = CATEGORIES.find((c) => c.id === event.category_id);
              const tts = MOCK_TICKET_TYPES.filter((t) => t.event_id === event.id);
              const sold = tts.reduce((sum, t) => sum + t.sold, 0);
              const quota = tts.reduce((sum, t) => sum + t.quota, 0);
              const minPrice = tts.length > 0 ? Math.min(...tts.map((t) => t.price)) : 0;

              return (
                <div key={event.id} className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-ground-muted/30 transition-colors">
                  <div className="flex items-start gap-5 flex-1">
                    <div className="w-24 sm:w-28 aspect-[4/3] shrink-0 bg-ground-dark overflow-hidden relative border border-ground-subtle hidden sm:block">
                      <img
                        src={event.poster_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="default">{category?.name || 'Event'}</Badge>
                        <Badge variant={event.status === 'published' ? 'success' : 'default'}>
                          {event.status === 'published' ? 'Tayang' : event.status}
                        </Badge>
                        {event.is_featured && <Badge variant="accent">Unggulan</Badge>}
                      </div>

                      <h3 className="font-display font-bold text-display-sm text-ink mb-1">
                        {event.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-body-sm text-ink-muted mt-2">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-accent" />
                          {formatDateRange(event.start_date, event.end_date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-accent" />
                          {event.venue_name}, {event.city}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 mt-4 text-body-sm">
                        <div>
                          <span className="text-caption text-ink-faint block">Penjualan Tiket</span>
                          <span className="font-medium text-ink">
                            {sold.toLocaleString('id-ID')} / {quota.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div>
                          <span className="text-caption text-ink-faint block">Harga Mulai</span>
                          <span className="font-medium text-accent">
                            {minPrice > 0 ? formatCurrency(minPrice) : 'Gratis'}
                          </span>
                        </div>
                        <div>
                          <span className="text-caption text-ink-faint block">Tipe Tiket</span>
                          <span className="font-medium text-ink">{tts.length} Kategori</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-ground-subtle">
                    <Link href={`/events/${event.id}`} target="_blank">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Eye className="w-4 h-4" /> Lihat Halaman
                      </Button>
                    </Link>
                    <Link href="/dashboard/scanner">
                      <Button variant="secondary" size="sm" className="gap-1.5">
                        Scan QR
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

