'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useAppContext } from '@/lib/app-context';
import { formatDateRange, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, QrCode } from 'lucide-react';

type FilterStatus = 'all' | 'valid' | 'used' | 'cancelled';

export default function TicketsPage() {
  const { user } = useAuth();
  const { tickets, events, ticketTypes } = useAppContext();
  const [filter, setFilter] = useState<FilterStatus>('all');

  if (!user) {
    return (
      <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto text-center">
        <h1 className="font-display font-bold text-display-md">Tiket Saya</h1>
        <p className="text-body text-ink-muted mt-4">Silakan masuk ke akun Anda untuk melihat tiket digital.</p>
        <Link href="/auth/login" className="inline-block mt-6 bg-accent text-white px-6 py-3 text-body font-medium hover:bg-accent-hover transition-colors">
          Masuk ke Akun
        </Link>
      </div>
    );
  }

  // Enrich tickets with event and ticketType from app context
  const allTickets = tickets.map((ticket) => {
    const event = events.find((e) => e.id === ticket.event_id);
    const ticketType = ticketTypes.find((tt) => tt.id === ticket.ticket_type_id);
    return { ...ticket, event, ticketType };
  });

  const filteredTickets = filter === 'all'
    ? allTickets
    : allTickets.filter((t) => t.status === filter);

  const statusVariant = (status: string): 'success' | 'default' | 'error' => {
    if (status === 'valid') return 'success';
    if (status === 'cancelled' || status === 'expired') return 'error';
    return 'default';
  };

  const statusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      valid: 'Aktif (Siap Pakai)',
      used: 'Sudah Digunakan',
      cancelled: 'Dibatalkan',
      expired: 'Kadaluarsa',
    };
    return labels[status] || status;
  };

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-display-lg text-ink">Tiket Saya</h1>
          <p className="text-body text-ink-muted mt-1">
            Daftar seluruh e-ticket digital terdaftar atas nama akun Anda.
          </p>
        </div>
        <Link href="/events" className="text-body-sm font-medium text-accent hover:underline flex items-center gap-1">
          Beli Tiket Acara Baru <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { value: 'all' as FilterStatus, label: 'Semua Tiket' },
          { value: 'valid' as FilterStatus, label: 'Aktif' },
          { value: 'used' as FilterStatus, label: 'Sudah Check-in' },
          { value: 'cancelled' as FilterStatus, label: 'Dibatalkan' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'px-4 py-2 text-body-sm font-medium transition-colors whitespace-nowrap',
              filter === tab.value
                ? 'bg-ink text-ground'
                : 'bg-ground-muted text-ink-muted hover:text-ink border border-ground-subtle',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-ground-subtle p-8">
          <QrCode className="w-12 h-12 text-ink-faint mx-auto mb-3 opacity-40" />
          <p className="text-display-sm font-display font-bold text-ink-muted">Belum Ada Tiket</p>
          <p className="text-body text-ink-faint mt-2">Tiket yang Anda pesan akan langsung tersimpan di sini dengan QR code resmi.</p>
          <Link href="/events" className="inline-block mt-6 bg-accent text-white px-6 py-3 text-body font-medium hover:bg-accent-hover transition-colors">
            Jelajahi Event Sekarang
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/tickets/${ticket.id}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 md:p-6 bg-ground border border-ground-subtle hover:border-ink transition-all shadow-sm"
            >
              <div className="flex items-start gap-4 flex-1">
                {ticket.event?.poster_url && (
                  <div className="w-20 aspect-[4/3] bg-ground-dark overflow-hidden shrink-0 hidden sm:block">
                    <img src={ticket.event.poster_url} alt={ticket.event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={statusVariant(ticket.status)}>{statusLabel(ticket.status)}</Badge>
                    <span className="text-caption font-mono text-accent font-semibold">{ticket.ticket_code}</span>
                  </div>
                  <h3 className="text-body-lg font-bold text-ink group-hover:text-accent transition-colors">
                    {ticket.event?.title || 'Acara Terdaftar'}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-body-sm text-ink-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      {ticket.event ? formatDateRange(ticket.event.start_date, ticket.event.end_date) : ''}
                    </span>
                    <span>·</span>
                    <span>{ticket.ticketType?.name || 'Tiket'}</span>
                  </div>
                  <p className="text-caption text-ink-faint mt-1">
                    Peserta: <strong className="text-ink">{ticket.attendee_name}</strong> ({ticket.attendee_email})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-ground-subtle">
                <span className="text-body-sm font-semibold text-accent group-hover:underline flex items-center gap-1">
                  Buka E-Ticket QR <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
