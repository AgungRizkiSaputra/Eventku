'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/admin-nav';
import { useAppContext } from '@/lib/app-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateShort } from '@/lib/utils';
import { Star, Eye, Check, PauseCircle, Search, Trash2 } from 'lucide-react';

export default function AdminEventsModerationPage() {
  const { events, categories, toggleEventFeatured, updateEventStatus, deleteEvent } = useAppContext();
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleFeatured = (id: string, title: string, current: boolean) => {
    toggleEventFeatured(id);
    notify(`Status featured untuk "${title}" ${!current ? 'diaktifkan' : 'dinonaktifkan'}. Perubahan langsung aktif di homepage.`);
  };

  const handleToggleStatus = (id: string, title: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    updateEventStatus(id, nextStatus as any);
    notify(`Event "${title}" diubah statusnya menjadi ${nextStatus.toUpperCase()}.`);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus event "${title}" dari platform?`)) {
      deleteEvent(id);
      notify(`Event "${title}" berhasil dihapus dari platform.`);
    }
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
          Tinjau pengajuan event, setujui penayangan ke katalog publik, atau tandai sebagai event unggulan (featured).
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
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-ink-muted">Tidak ada event yang sesuai pencarian.</div>
          ) : (
            filtered.map((event) => {
              const category = categories.find((c) => c.id === event.category_id);

              return (
                <div
                  key={event.id}
                  className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-ground-muted/20 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-20 aspect-[4/3] bg-ground-dark overflow-hidden shrink-0 hidden sm:block">
                      <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover" />
                    </div>
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
                        {event.venue_name}, {event.city} · {formatDateShort(event.start_date)} · Diajukan oleh Organizer ID: <span className="font-mono text-ink">{event.organizer_id}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <Link href={`/events/${event.id}`} target="_blank">
                      <Button variant="outline" size="sm" className="gap-1.5" title="Lihat pratinjau">
                        <Eye className="w-4 h-4" /> Pratinjau
                      </Button>
                    </Link>

                    <Button
                      variant={event.is_featured ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleFeatured(event.id, event.title, event.is_featured)}
                      className="gap-1.5"
                    >
                      <Star className={`w-4 h-4 ${event.is_featured ? 'fill-accent text-accent' : ''}`} />
                      {event.is_featured ? 'Batal Unggulan' : 'Set Unggulan'}
                    </Button>

                    <Button
                      variant={event.status === 'published' ? 'ghost' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleStatus(event.id, event.title, event.status)}
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

                    <button
                      type="button"
                      onClick={() => handleDelete(event.id, event.title)}
                      className="p-2 text-ink-muted hover:text-error transition-colors"
                      title="Hapus Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
