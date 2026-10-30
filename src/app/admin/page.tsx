'use client';

import Link from 'next/link';
import { AdminNav } from '@/components/admin/admin-nav';
import { useAppContext } from '@/lib/app-context';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, ShoppingCart, DollarSign, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function AdminOverviewPage() {
  const { users, events, orders, ticketTypes, categories } = useAppContext();

  const totalUsers = users.length;
  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === 'published').length;
  const totalOrders = orders.length;

  let totalGrossRevenue = 0;
  ticketTypes.forEach((tt) => {
    totalGrossRevenue += tt.sold * tt.price;
  });

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-display-md">Panel Administrasi (Admin)</h1>
          <p className="text-body text-ink-muted mt-1">
            Pengawasan sistem terpusat, moderasi penerbitan event, manajemen pengguna, dan kesehatan platform.
          </p>
        </div>
      </div>

      <AdminNav />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-ground-muted p-5 border border-ground-subtle">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-body-sm font-medium">Pengguna Terdaftar</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="font-display font-bold text-display-sm text-ink">{totalUsers}</p>
          <p className="text-caption text-ink-faint mt-1">Akun aktif di seluruh sistem</p>
        </div>

        <div className="bg-ground-muted p-5 border border-ground-subtle">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-body-sm font-medium">Total Event</span>
            <Calendar className="w-4 h-4 text-accent" />
          </div>
          <p className="font-display font-bold text-display-sm text-ink">{totalEvents}</p>
          <p className="text-caption text-emerald-600 mt-1">{publishedEvents} terverifikasi tayang</p>
        </div>

        <div className="bg-ground-muted p-5 border border-ground-subtle">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-body-sm font-medium">Transaksi Tiket</span>
            <ShoppingCart className="w-4 h-4" />
          </div>
          <p className="font-display font-bold text-display-sm text-ink">{totalOrders}</p>
          <p className="text-caption text-ink-faint mt-1">Pesanan terkonfirmasi</p>
        </div>

        <div className="bg-ground-muted p-5 border border-ground-subtle">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-body-sm font-medium">Gross Merchandise Value</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-display font-bold text-display-sm text-ink truncate">
            {formatCurrency(totalGrossRevenue)}
          </p>
          <p className="text-caption text-ink-faint mt-1">Estimasi omset tiket keseluruhan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Event Moderation Queue Preview */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-body-lg text-ink">Moderasi Acara</h2>
            <Link href="/admin/events" className="text-body-sm text-accent hover:underline flex items-center gap-1">
              Buka Semua Moderasi <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-ground border border-ground-subtle divide-y divide-ground-subtle">
            {events.slice(0, 5).map((event) => {
              const category = categories.find((c) => c.id === event.category_id);
              return (
                <div key={event.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-caption text-ink-faint font-mono">{event.id}</span>
                      <Badge variant="default">{category?.name || 'Event'}</Badge>
                      <Badge variant={event.status === 'published' ? 'success' : 'default'}>
                        {event.status === 'published' ? 'Aktif' : event.status}
                      </Badge>
                      {event.is_featured && <Badge variant="accent">Featured</Badge>}
                    </div>
                    <h3 className="font-medium text-body text-ink">{event.title}</h3>
                    <p className="text-caption text-ink-muted mt-0.5">
                      {event.city} · Diajukan oleh Organizer ID: <span className="font-mono">{event.organizer_id}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/events/${event.id}`} target="_blank">
                      <Button variant="outline" size="sm">
                        Tinjau
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick User Role Stats */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-body-lg text-ink">Peran Pengguna</h2>
            <Link href="/admin/users" className="text-body-sm text-accent hover:underline">
              Kelola Pengguna →
            </Link>
          </div>

          <div className="bg-ground border border-ground-subtle divide-y divide-ground-subtle">
            {users.map((usr) => (
              <div key={usr.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-body-sm font-medium text-ink">{usr.full_name}</p>
                  <p className="text-caption text-ink-muted">{usr.email}</p>
                </div>
                <Badge
                  variant={
                    usr.role === 'admin'
                      ? 'accent'
                      : usr.role === 'organizer'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {usr.role.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-ground-muted p-4 border border-ground-subtle">
            <p className="text-body-sm font-medium text-ink flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent" />
              Sistem Keamanan & Audit Role
            </p>
            <p className="text-caption text-ink-muted mt-1">
              Setiap rute di bawah <code className="font-mono text-xs bg-ground px-1">/admin/*</code> dan <code className="font-mono text-xs bg-ground px-1">/dashboard/*</code> dilindungi oleh sistem proteksi peran (*RoleGuard*).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
