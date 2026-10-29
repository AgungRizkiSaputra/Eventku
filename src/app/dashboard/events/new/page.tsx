'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { CATEGORIES, CITIES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Plus, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';

interface TicketTierInput {
  name: string;
  price: number;
  quota: number;
  description: string;
  max_per_order: number;
}

export default function NewEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('cat-1');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [city, setCity] = useState('Jakarta');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('22:00');

  const [tickets, setTickets] = useState<TicketTierInput[]>([
    { name: 'Early Bird', price: 150000, quota: 100, description: 'Akses masuk umum harga spesial', max_per_order: 4 },
    { name: 'Presale / Regular', price: 250000, quota: 500, description: 'Akses tiket umum', max_per_order: 4 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const addTicketTier = () => {
    setTickets([
      ...tickets,
      { name: 'VIP Pass', price: 500000, quota: 50, description: 'Akses panggung depan dan souvenir', max_per_order: 2 },
    ]);
  };

  const removeTicketTier = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const updateTicketTier = (index: number, field: keyof TicketTierInput, value: any) => {
    const updated = [...tickets];
    updated[index] = { ...updated[index], [field]: value };
    setTickets(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSuccess(true);

    setTimeout(() => {
      router.push('/dashboard/events');
    }, 2000);
  };

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/events" className="inline-flex items-center gap-1.5 text-body-sm text-ink-muted hover:text-ink transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Kelola Event
        </Link>
        <h1 className="font-display font-bold text-display-md">Buat Event Baru</h1>
        <p className="text-body text-ink-muted mt-1">Lengkapi informasi acara, jadwal, lokasi, dan tentukan kategori tiket.</p>
      </div>

      <DashboardNav />

      {success ? (
        <div className="bg-emerald-50 border border-emerald-200 p-8 text-center max-w-xl mx-auto my-12">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h2 className="font-display font-bold text-display-sm text-ink">Event Berhasil Dibuat!</h2>
          <p className="text-body text-ink-muted mt-2">
            Acara Anda telah didaftarkan dan siap dipublikasikan ke publik. Mengalihkan ke dashboard...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-10">
          {/* Section 1: Informasi Utama */}
          <div className="bg-ground border border-ground-subtle p-6 md:p-8 space-y-6">
            <h2 className="font-display font-bold text-body-lg text-ink pb-3 border-b border-ground-subtle">
              1. Informasi Utama Acara
            </h2>

            <Input
              label="Judul Event"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Jakarta Indie Music Festival 2027"
              required
            />

            <Select
              label="Kategori Event"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={CATEGORIES.map((c) => ({ value: c.id, label: c.name }))}
            />

            <div>
              <label className="text-body-sm font-medium text-ink mb-1.5 block">Ringkasan Singkat (Short Description)</label>
              <textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Deskripsi singkat yang tampil pada poster dan kartu event..."
                rows={2}
                className="w-full bg-transparent border-b-2 border-ink/20 px-0 py-2.5 text-body text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors resize-none"
                required
              />
            </div>

            <div>
              <label className="text-body-sm font-medium text-ink mb-1.5 block">Deskripsi Lengkap</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan rundown, pengisi acara, fasilitas, dan ketentuan peserta..."
                rows={5}
                className="w-full bg-transparent border-b-2 border-ink/20 px-0 py-2.5 text-body text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink transition-colors"
                required
              />
            </div>
          </div>

          {/* Section 2: Jadwal & Lokasi */}
          <div className="bg-ground border border-ground-subtle p-6 md:p-8 space-y-6">
            <h2 className="font-display font-bold text-body-lg text-ink pb-3 border-b border-ground-subtle">
              2. Jadwal & Lokasi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Tanggal Mulai"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <Input
                label="Tanggal Berakhir"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Waktu Mulai (WIB)"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              <Input
                label="Waktu Berakhir"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Nama Gedung / Venue"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="Contoh: Balai Sarbini / JIExpo Kemayoran"
                required
              />
              <Select
                label="Kota Penyelenggaraan"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                options={CITIES.map((c) => ({ value: c, label: c }))}
              />
            </div>

            <Input
              label="Alamat Lengkap Venue"
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              placeholder="Jl. Gatot Subroto No. XX, Jakarta Selatan"
              required
            />
          </div>

          {/* Section 3: Jenis Tiket & Kuota */}
          <div className="bg-ground border border-ground-subtle p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-ground-subtle">
              <h2 className="font-display font-bold text-body-lg text-ink">
                3. Jenis Tiket, Kuota & Harga
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={addTicketTier} className="gap-1.5">
                <Plus className="w-4 h-4" /> Tambah Kategori Tiket
              </Button>
            </div>

            <div className="space-y-6">
              {tickets.map((tier, idx) => (
                <div key={idx} className="p-5 bg-ground-muted relative border border-ground-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-body-sm text-ink">Tiket Tier #{idx + 1}</span>
                    {tickets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTicketTier(idx)}
                        className="text-error hover:text-error/80 p-1"
                        title="Hapus Tier"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Nama Tiket"
                      value={tier.name}
                      onChange={(e) => updateTicketTier(idx, 'name', e.target.value)}
                      placeholder="Contoh: VIP / Festival A"
                      required
                    />
                    <Input
                      label="Harga (IDR)"
                      type="number"
                      value={tier.price.toString()}
                      onChange={(e) => updateTicketTier(idx, 'price', parseInt(e.target.value) || 0)}
                      placeholder="0 untuk gratis"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Input
                      label="Kuota Tiket (Lembar)"
                      type="number"
                      value={tier.quota.toString()}
                      onChange={(e) => updateTicketTier(idx, 'quota', parseInt(e.target.value) || 0)}
                      required
                    />
                    <Input
                      label="Maksimal Tiket per Transaksi"
                      type="number"
                      value={tier.max_per_order.toString()}
                      onChange={(e) => updateTicketTier(idx, 'max_per_order', parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  <Input
                    label="Keterangan Fasilitas Tiket"
                    value={tier.description}
                    onChange={(e) => updateTicketTier(idx, 'description', e.target.value)}
                    placeholder="Contoh: Termasuk minuman, lanyard eksklusif, dan akses jalur cepat"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href="/dashboard/events">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            <Button type="submit" size="lg" loading={isSubmitting}>
              Terbitkan Event Sekarang
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

