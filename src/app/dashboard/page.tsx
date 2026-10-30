'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useAppContext } from '@/lib/app-context';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Ticket, DollarSign, TrendingUp, ArrowUpRight, PlusCircle } from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { events, ticketTypes, orders } = useAppContext();

  // Organizer events (or all events if demo)
  const organizerEvents = events;
  const activeEventsCount = organizerEvents.filter((e) => e.status === 'published').length;

  let totalTicketsSold = 0;
  let totalRevenue = 0;

  organizerEvents.forEach((event) => {
    const tts = ticketTypes.filter((tt) => tt.event_id === event.id);
    tts.forEach((tt) => {
      totalTicketsSold += tt.sold;
      totalRevenue += tt.sold * tt.price;
    });
  });

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-display-md">Dashboard Penyelenggara</h1>
          <p className="text-body text-ink-muted mt-1">
            Pantau performa penjualan tiket, kelola kuota acara, dan periksa pesanan masuk.
          </p>
        </div>
        <Link href="/dashboard/events/new">
          <Button size="md" className="gap-2">
            <PlusCircle className="w-4 h-4" /> Buat Event Baru
          </Button>
        </Link>
      </div>

      <DashboardNav />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-ground-muted p-5 border border-ground-subtle">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-body-sm font-medium">Total Acara Anda</span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="font-display font-bold text-display-sm text-ink">{organizerEvents.length}</p>
          <p className="text-caption text-ink-faint mt-1">{activeEventsCount} acara sedang aktif tayang</p>
        </div>

        <div className="bg-ground-muted p-5 border border-ground-subtle">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-body-sm font-medium">Tiket Terjual</span>
            <Ticket className="w-4 h-4 text-accent" />
          </div>
          <p className="font-display font-bold text-display-sm text-ink">
            {totalTicketsSold.toLocaleString('id-ID')}
          </p>
          <p className="text-caption text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 inline" /> Terakumulasi waktu-nyata
          </p>
        </div>

        <div className="bg-ground-muted p-5 border border-ground-subtle">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-body-sm font-medium">Estimasi Pendapatan Kotor</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-display font-bold text-display-sm text-ink truncate">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-caption text-ink-faint mt-1">Total omset tiket terjual</p>
        </div>

        <div className="bg-ground-muted p-5 border border-ground-subtle">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-body-sm font-medium">Rata-rata Terisi</span>
            <TrendingUp className="w-4 h-4 text-ink-muted" />
          </div>
          <p className="font-display font-bold text-display-sm text-ink">76.8%</p>
          <p className="text-caption text-ink-faint mt-1">Tingkat okupansi kuota</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Events Overview */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-body-lg text-ink">Acara & Keterisian Kuota</h2>
            <Link href="/dashboard/events" className="text-body-sm text-accent hover:underline flex items-center gap-1">
              Lihat Semua <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-ground border border-ground-subtle overflow-hidden">
            <div className="divide-y divide-ground-subtle">
              {organizerEvents.slice(0, 5).map((event) => {
                const tts = ticketTypes.filter((t) => t.event_id === event.id);
                const sold = tts.reduce((sum, t) => sum + t.sold, 0);
                const quota = tts.reduce((sum, t) => sum + t.quota, 0);
                const percentage = quota > 0 ? Math.round((sold / quota) * 100) : 0;

                return (
                  <div key={event.id} className="p-5 hover:bg-ground-muted/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div>
                        <Link href={`/events/${event.id}`} className="font-bold text-body hover:text-accent transition-colors">
                          {event.title}
                        </Link>
                        <p className="text-caption text-ink-muted mt-0.5">
                          {event.city} · {formatDateShort(event.start_date)}
                        </p>
                      </div>
                      <Badge variant={event.status === 'published' ? 'success' : 'default'}>
                        {event.status === 'published' ? 'Tayang' : event.status}
                      </Badge>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-caption text-ink-muted mb-1">
                        <span>Tiket Terjual: <strong className="text-ink">{sold.toLocaleString('id-ID')}</strong> dari {quota.toLocaleString('id-ID')} kuota</span>
                        <span className="font-bold text-ink">{percentage}%</span>
                      </div>
                      <div className="w-full bg-ground-muted h-2 rounded-none overflow-hidden border border-ground-subtle">
                        <div
                          className="bg-accent h-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Orders Side Column */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-body-lg text-ink">Pesanan Masuk</h2>
            <span className="text-caption text-ink-muted">Terbaru</span>
          </div>

          <div className="bg-ground border border-ground-subtle divide-y divide-ground-subtle">
            {orders.slice(0, 4).map((order) => {
              const matchedEvent = events.find((e) => e.id === order.event_id);
              return (
                <div key={order.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-caption text-accent font-semibold">{order.order_code}</span>
                    <Badge variant="success">Lunas</Badge>
                  </div>
                  <p className="text-body-sm font-semibold text-ink mt-1 truncate">
                    {matchedEvent?.title || 'Pesanan Tiket'}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-caption text-ink-muted">
                    <span className="font-bold text-ink">{formatCurrency(order.total_amount)}</span>
                    <span className="uppercase text-[10px] bg-ground-muted px-2 py-0.5">{order.payment_method?.replace('_', ' ')}</span>
                  </div>
                </div>
              );
            })}

            <div className="p-4 bg-ground-muted text-center">
              <Link href="/dashboard/scanner" className="text-body-sm text-accent hover:underline font-semibold block">
                Buka Pemindai QR Gate Masuk →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
