'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/lib/app-context';
import { formatTime, formatDateRange } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ETicketPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const [qrUrl, setQrUrl] = useState<string>('');

  const { tickets, events, ticketTypes, orders } = useAppContext();

  const ticket = tickets.find((t) => t.id === ticketId || t.ticket_code === ticketId);
  const event = ticket ? events.find((e) => e.id === ticket.event_id) : null;
  const ticketType = ticket ? ticketTypes.find((tt) => tt.id === ticket.ticket_type_id) : null;
  const order = ticket ? orders.find((o) => o.id === ticket.order_id) : null;

  useEffect(() => {
    if (ticket?.qr_data) {
      import('qrcode').then((QRCode) => {
        QRCode.toDataURL(ticket.qr_data, {
          width: 240,
          margin: 2,
          color: { dark: '#0A0A0A', light: '#FAFAF8' },
        }).then((url) => setQrUrl(url));
      });
    }
  }, [ticket?.qr_data]);

  if (!ticket || !event) {
    return (
      <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto text-center">
        <h1 className="font-display font-bold text-display-md">Tiket Tidak Ditemukan</h1>
        <p className="text-body text-ink-muted mt-4">E-ticket yang Anda cari tidak tersedia di sistem.</p>
        <Link href="/tickets">
          <Button className="mt-6">Kembali ke Tiket Saya</Button>
        </Link>
      </div>
    );
  }

  const statusVariant = ticket.status === 'valid' ? 'success' : ticket.status === 'used' ? 'default' : 'error';
  const statusLabel: Record<string, string> = {
    valid: 'Tiket Valid (Siap Check-in)',
    used: 'Sudah Digunakan (Check-in Selesai)',
    cancelled: 'Dibatalkan',
    expired: 'Kadaluarsa',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <Link href="/tickets" className="inline-flex items-center gap-2 text-body-sm text-ink-muted hover:text-ink transition-colors mb-8 print:hidden">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Tiket Saya
      </Link>

      <div className="max-w-lg mx-auto">
        {/* Status notification banner if used */}
        {ticket.status === 'used' && (
          <div className="mb-4 p-4 bg-ground-muted border border-ground-subtle text-body-sm text-ink-muted flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-ink-faint shrink-0" />
            <span>Tiket ini telah divalidasi di pintu masuk pada <strong>{ticket.checked_in_at || 'waktu sebelumnya'}</strong>.</span>
          </div>
        )}

        {/* E-ticket card */}
        <div className="bg-ground-muted print:bg-white border border-ground-subtle overflow-hidden shadow-sm" id="e-ticket">
          {/* Visual Header Banner */}
          <div className="relative aspect-[16/7] overflow-hidden bg-ground-dark">
            <img
              src={event.poster_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ground-muted via-transparent to-black/40" />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
              <span className="font-display font-bold text-body-lg tracking-tight drop-shadow-sm">EVENTKU</span>
              <Badge variant={statusVariant}>{statusLabel[ticket.status]}</Badge>
            </div>
          </div>

          {/* Top section */}
          <div className="p-6 md:p-8">
            <h1 className="font-display font-bold text-display-sm text-ink">{event.title}</h1>

            <div className="mt-4 flex flex-col gap-2 text-body-sm text-ink-muted">
              <p className="font-semibold text-ink">{formatDateRange(event.start_date, event.end_date)}</p>
              <p>{formatTime(event.start_time)} – {formatTime(event.end_time)} ({event.timezone})</p>
              <p>{event.venue_name}, {event.city}</p>
            </div>
          </div>

          {/* Dashed divider — ticket tear line */}
          <div className="relative px-6 md:px-8">
            <div className="border-t-2 border-dashed border-ink/15" />
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ground" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-ground" />
          </div>

          {/* Bottom section */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-caption text-ink-faint uppercase font-bold">Nama Peserta</p>
                <p className="text-body font-bold text-ink mt-0.5">{ticket.attendee_name}</p>
              </div>
              <div>
                <p className="text-caption text-ink-faint uppercase font-bold">Email</p>
                <p className="text-body-sm text-ink-muted mt-0.5 truncate">{ticket.attendee_email}</p>
              </div>
              <div>
                <p className="text-caption text-ink-faint uppercase font-bold">Jenis Tiket</p>
                <p className="text-body font-bold text-accent mt-0.5">{ticketType?.name || 'Tiket Terdaftar'}</p>
              </div>
              <div>
                <p className="text-caption text-ink-faint uppercase font-bold">Kode Pesanan</p>
                <p className="text-body-sm font-mono font-medium text-ink mt-0.5">{order?.order_code || 'ORD-EVT'}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center py-6 bg-ground border border-ground-subtle p-4">
              {qrUrl ? (
                <img src={qrUrl} alt="QR Code tiket" className="w-52 h-52 object-contain" />
              ) : (
                <div className="w-52 h-52 bg-ground-subtle animate-pulse flex items-center justify-center text-caption text-ink-faint">
                  Menyiapkan QR Code...
                </div>
              )}
              <p className="text-body-sm text-ink mt-3 font-mono font-bold tracking-wider">{ticket.ticket_code}</p>
              <p className="text-caption text-ink-faint mt-1">Tunjukkan QR code ini ke petugas di pintu masuk (gate)</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4 print:hidden">
          <Button variant="outline" fullWidth onClick={handlePrint} className="gap-2">
            <Download className="w-4 h-4" /> Unduh / Cetak E-Ticket
          </Button>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          header, footer, .print\\:hidden, nav { display: none !important; }
          body { background: white !important; }
          main { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
