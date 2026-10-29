'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/admin-nav';
import { MOCK_EVENTS, CATEGORIES } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateShort } from '@/lib/utils';
import { Star, Eye, Check, PauseCircle, Search } from 'lucide-react';
import { Event } from '@/types';

export default function AdminEventsModerationPage() {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleFeatured = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextFeatured = !e.is_featured;
          notify(`Status featured untuk "${e.title}" ${nextFeatured ? 'diaktifkan' : 'dinonaktifkan'}.`);
          return { ...e, is_featured: nextFeatured };
        }
        return e;
      })
    );
  };

  const toggleStatus = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextStatus = e.status === 'published' ? 'draft' : 'published';
          notify(`Event "${e.title}" diubah menjadi status ${nextStatus.toUpperCase()}.`);
          return { ...e, status: nextStatus as any };
        }
        return e;
      })
    );
  };

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-display-md">Moderasi Event</h1>
        <p className="text-body text-ink-muted mt-1">
          Tinjau pengajuan event, setujui penayangan ke katalog utama, atau sorot sebagai event unggulan (featured).
        </p>
      </div>

      <AdminNav />

      {notification && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-body-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-success" />
          {notification}
        </div>
      )}

      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Cari event untuk dimoderasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-ground border border-ground-subtle pl-10 pr-4 py-2.5 text-body-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
          />
        </div>
      </div>

      <div className="bg-ground border border-ground-subtle overflow-hidden">
        <div className="divide-y divide-ground-subtle">
          {filtered.map((event) => {
            const category = CATEGORIES.find((c) => c.id === event.category_id);

            return (
              <div
                key={event.id}
                className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-ground-muted/20 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-caption text-ink-faint">{event.id}</span>
                    <Badge variant="default">{category?.name}</Badge>
                    <Badge variant={event.status === 'published' ? 'success' : 'default'}>
                      {event.status === 'published' ? 'Tayang (Approved)' : 'Draf (Ditangguhkan)'}
                    </Badge>
                    {event.is_featured && <Badge variant="accent">Unggulan (Featured)</Badge>}
                  </div>

                  <h3 className="font-display font-bold text-body-lg text-ink">
                    {event.title}
                  </h3>

                  <p className="text-body-sm text-ink-muted mt-1">
                    {event.venue_name}, {event.city} · {formatDateShort(event.start_date)} · Diajukan oleh Organizer ({event.organizer_id})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/events/${event.id}`} target="_blank">
                    <Button variant="outline" size="sm" className="gap-1.5" title="Lihat pratinjau">
                      <Eye className="w-4 h-4" /> Pratinjau
                    </Button>
                  </Link>

                  <Button
                    variant={event.is_featured ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => toggleFeatured(event.id)}
                    className="gap-1.5"
                  >
                    <Star className={`w-4 h-4 ${event.is_featured ? 'fill-accent text-accent' : ''}`} />
                    {event.is_featured ? 'Batal Unggulan' : 'Set Unggulan'}
                  </Button>

                  <Button
                    variant={event.status === 'published' ? 'ghost' : 'primary'}
                    size="sm"
                    onClick={() => toggleStatus(event.id)}
                    className="gap-1.5"
                  >
                    {event.status === 'published' ? (
                      <>
                        <PauseCircle className="w-4 h-4 text-warning" /> Tangguhkan
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Setujui & Tayangkan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

