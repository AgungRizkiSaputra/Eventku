'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { MOCK_TICKETS, getEventById, MOCK_TICKET_TYPES } from '@/lib/mock-data';
import { formatDateRange, formatCurrency, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight } from 'lucide-react';

type FilterStatus = 'all' | 'valid' | 'used' | 'cancelled';

export default function TicketsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterStatus>('all');

  if (!user) {
    return (
      <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto text-center">
        <h1 className="font-display font-bold text-display-md">Tiket Saya</h1>
        <p className="text-body text-ink-muted mt-4">Anda perlu masuk untuk melihat tiket Anda.</p>
        <Link href="/auth/login" className="inline-block mt-6 bg-accent text-white px-6 py-3 text-body font-medium hover:bg-accent-hover transition-colors">
          Masuk
        </Link>
      </div>
    );
  }

  // In real app, filter by user.id. For demo, show all mock tickets.
  const allTickets = MOCK_TICKETS.map(ticket => {
    const event = getEventById(ticket.event_id);
    const ticketType = MOCK_TICKET_TYPES.find(tt => tt.id === ticket.ticket_type_id);
    return { ...ticket, event, ticketType };
  });

  const filteredTickets = filter === 'all'
    ? allTickets
    : allTickets.filter(t => t.status === filter);

  const statusVariant = (status: string): 'success' | 'default' | 'error' => {
    if (status === 'valid') return 'success';
    if (status === 'cancelled' || status === 'expired') return 'error';
    return 'default';
  };

  const statusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      valid: 'Aktif', used: 'Terpakai', cancelled: 'Dibatalkan', expired: 'Kadaluarsa',
    };
    return labels[status] || status;
  };

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <h1 className="font-display font-bold text-display-lg mb-8">Tiket Saya</h1>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-10 overflow-x-auto">
        {[
          { value: 'all' as FilterStatus, label: 'Semua' },
          { value: 'valid' as FilterStatus, label: 'Aktif' },
          { value: 'used' as FilterStatus, label: 'Terpakai' },
          { value: 'cancelled' as FilterStatus, label: 'Dibatalkan' },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'px-4 py-2 text-body-sm font-medium transition-colors whitespace-nowrap',
              filter === tab.value ? 'bg-ink text-ground' : 'bg-ground-muted text-ink-muted hover:text-ink',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-display-sm font-display font-bold text-ink-muted">Belum ada tiket</p>
          <p className="text-body text-ink-faint mt-2">Tiket yang Anda pesan akan muncul di sini</p>
          <Link href="/events" className="inline-block mt-6 bg-accent text-white px-6 py-3 text-body font-medium hover:bg-accent-hover transition-colors">
            Jelajahi Event
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTickets.map(ticket => (
            <Link
              key={ticket.id}
              href={`/tickets/${ticket.id}`}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-ground-muted hover:bg-ground-subtle transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="text-body font-medium group-hover:text-accent transition-colors">
                      {ticket.event?.title || 'Event'}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-body-sm text-ink-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {ticket.event ? formatDateRange(ticket.event.start_date, ticket.event.end_date) : ''}
                      </span>
                    </div>
                    <p className="text-body-sm text-ink-muted mt-1">
                      {ticket.ticketType?.name} · {ticket.attendee_name}
                    </p>
                    <p className="text-caption text-ink-faint mt-1 font-mono">{ticket.ticket_code}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={statusVariant(ticket.status)}>{statusLabel(ticket.status)}</Badge>
                <ArrowRight className="w-4 h-4 text-ink-faint group-hover:text-accent transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

