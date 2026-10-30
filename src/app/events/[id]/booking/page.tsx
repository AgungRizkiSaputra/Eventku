'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Check, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useAppContext } from '@/lib/app-context';
import { formatCurrency, formatDateRange, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';

function BookingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { events, ticketTypes, bookTickets } = useAppContext();

  const eventId = params.id as string;
  const eventData = events.find((e) => e.id === eventId || e.slug === eventId);
  const eventTicketTypes = ticketTypes.filter((tt) => tt.event_id === eventData?.id);

  // Parse initial ticket selections from URL
  const initialTickets: Record<string, number> = {};
  if (eventData) {
    eventTicketTypes.forEach((tt) => {
      const q = searchParams.get(tt.id);
      if (q) initialTickets[tt.id] = parseInt(q) || 0;
    });
  }

  const [step, setStep] = useState(1);
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>(initialTickets);
  const [contactName, setContactName] = useState(user?.full_name || 'Andi Pratama');
  const [contactEmail, setContactEmail] = useState(user?.email || 'andi@example.com');
  const [contactPhone, setContactPhone] = useState(user?.phone || '081234567890');
  const [attendees, setAttendees] = useState<{ name: string; email: string }[]>([]);
  const [sameAsContact, setSameAsContact] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderResult, setOrderResult] = useState<{ orderCode: string; tickets: { code: string; id: string }[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalTicketCount = useMemo(() => {
    return Object.values(selectedTickets).reduce((sum, q) => sum + q, 0);
  }, [selectedTickets]);

  const total = useMemo(() => {
    return eventTicketTypes.reduce((sum, tt) => {
      return sum + (selectedTickets[tt.id] || 0) * tt.price;
    }, 0);
  }, [selectedTickets, eventTicketTypes]);

  const orderSummaryItems = useMemo(() => {
    return eventTicketTypes
      .filter((tt) => (selectedTickets[tt.id] || 0) > 0)
      .map((tt) => ({
        ...tt,
        quantity: selectedTickets[tt.id],
        subtotal: selectedTickets[tt.id] * tt.price,
      }));
  }, [selectedTickets, eventTicketTypes]);

  if (!eventData) {
    return (
      <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto text-center">
        <h1 className="font-display font-bold text-display-md">Event tidak ditemukan</h1>
        <Link href="/events"><Button className="mt-8">Kembali ke Katalog</Button></Link>
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

  const goToStep2 = () => {
    if (totalTicketCount === 0) return;
    const atts: { name: string; email: string }[] = [];
    for (let i = 0; i < totalTicketCount; i++) {
      if (i === 0 && sameAsContact) {
        atts.push({ name: contactName || '', email: contactEmail || '' });
      } else {
        atts.push({ name: '', email: '' });
      }
    }
    setAttendees(atts);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!contactName.trim()) errs.contactName = 'Nama wajib diisi';
    if (!contactEmail.trim()) errs.contactEmail = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) errs.contactEmail = 'Format email tidak valid';
    if (!contactPhone.trim()) errs.contactPhone = 'Nomor telepon wajib diisi';

    attendees.forEach((att, i) => {
      if (!att.name.trim()) errs[`att-${i}-name`] = 'Nama peserta wajib diisi';
      if (!att.email.trim()) errs[`att-${i}-email`] = 'Email peserta wajib diisi';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(att.email)) errs[`att-${i}-email`] = 'Format email tidak valid';
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goToStep3 = () => {
    if (validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));

    const items = Object.entries(selectedTickets)
      .filter(([_, qty]) => qty > 0)
      .map(([ticket_type_id, quantity]) => ({ ticket_type_id, quantity }));

    // Book persistent tickets in central state
    const result = bookTickets({
      userId: user?.id || 'user-1',
      eventId: eventData.id,
      items,
      attendees,
      contactName,
      contactEmail,
      contactPhone,
      paymentMethod: 'bank_transfer',
    });

    setOrderResult({
      orderCode: result.order.order_code,
      tickets: result.tickets.map((t) => ({ code: t.ticket_code, id: t.id })),
    });

    setIsProcessing(false);
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateAttendee = (index: number, field: 'name' | 'email', value: string) => {
    setAttendees((prev) => prev.map((att, i) => (i === index ? { ...att, [field]: value } : att)));
  };

  const steps = ['Pilih Tiket', 'Data Peserta', 'Konfirmasi'];

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      {/* Back link */}
      <Link href={`/events/${eventData.id}`} className="inline-flex items-center gap-2 text-body-sm text-ink-muted hover:text-ink transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Kembali ke detail event
      </Link>

      {/* Event context */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-display-md">{eventData.title}</h1>
        <p className="text-body text-ink-muted mt-1">
          {formatDateRange(eventData.start_date, eventData.end_date)} · {eventData.venue_name}, {eventData.city}
        </p>
      </div>

      {/* Step indicator */}
      {step < 4 && (
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-ground-subtle">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={cn(
                'w-7 h-7 flex items-center justify-center text-body-sm font-medium',
                step > i + 1 ? 'bg-success text-white' : step === i + 1 ? 'bg-ink text-ground' : 'bg-ground-muted text-ink-faint',
              )}>
                {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
              </span>
              <span className={cn(
                'text-body-sm font-medium hidden sm:block',
                step === i + 1 ? 'text-ink' : 'text-ink-faint',
              )}>
                {s}
              </span>
              {i < steps.length - 1 && <span className="w-8 h-px bg-ground-subtle hidden sm:block" />}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main form flow */}
        <div className="lg:col-span-7 xl:col-span-8">
          {/* Step 1: Ticket selection */}
          {step === 1 && (
            <div>
              <h2 className="font-display font-bold text-display-sm mb-6">Pilih Tiket & Kuantitas</h2>
              <div className="flex flex-col gap-4">
                {eventTicketTypes.map((tt) => {
                  const remaining = tt.quota - tt.sold;
                  const isSoldOut = remaining <= 0;
                  const qty = selectedTickets[tt.id] || 0;

                  return (
                    <div key={tt.id} className={cn('p-5 bg-ground-muted border border-ground-subtle', isSoldOut && 'opacity-50')}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-body font-bold text-ink">{tt.name}</h3>
                          {tt.description && <p className="text-body-sm text-ink-muted mt-1">{tt.description}</p>}
                          <p className="text-body font-bold text-accent mt-2">
                            {tt.price > 0 ? formatCurrency(tt.price) : 'Gratis'}
                          </p>
                          <p className="text-caption text-ink-faint mt-1">
                            {isSoldOut ? 'Habis terjual' : `Tersisa ${remaining} tiket · Maks ${tt.max_per_order}/pesanan`}
                          </p>
                        </div>
                        {!isSoldOut && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => updateQuantity(tt.id, -1)} disabled={qty === 0}
                              className="w-9 h-9 flex items-center justify-center bg-ground hover:bg-ground-subtle disabled:opacity-30 transition-colors" aria-label="Kurangi">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-body font-bold">{qty}</span>
                            <button onClick={() => updateQuantity(tt.id, 1)} disabled={qty >= tt.max_per_order || qty >= remaining}
                              className="w-9 h-9 flex items-center justify-center bg-ground hover:bg-ground-subtle disabled:opacity-30 transition-colors" aria-label="Tambah">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <Button size="lg" onClick={goToStep2} disabled={totalTicketCount === 0}>
                  Lanjutkan ke Data Peserta ({totalTicketCount} Tiket)
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Attendee info */}
          {step === 2 && (
            <div>
              <h2 className="font-display font-bold text-display-sm mb-6">Data Pemesan & Peserta</h2>

              <div className="mb-8 p-6 bg-ground border border-ground-subtle">
                <h3 className="text-body font-bold text-ink mb-4">Informasi Kontak Pemesan</h3>
                <div className="flex flex-col gap-4">
                  <Input label="Nama Lengkap" value={contactName} onChange={(e) => setContactName(e.target.value)} error={errors.contactName} />
                  <Input label="Email Pemesan" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} error={errors.contactEmail} />
                  <Input label="Nomor WhatsApp / Telepon" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} error={errors.contactPhone} />
                </div>
              </div>

              <div>
                <h3 className="text-body font-bold text-ink mb-4">Identitas Tiket Peserta ({totalTicketCount} orang)</h3>

                <label className="flex items-center gap-3 mb-6 cursor-pointer">
                  <span className={cn(
                    'w-5 h-5 border-2 flex items-center justify-center transition-colors',
                    sameAsContact ? 'bg-ink border-ink' : 'border-ink/30',
                  )}>
                    {sameAsContact && <Check className="w-3 h-3 text-ground" />}
                  </span>
                  <input type="checkbox" checked={sameAsContact} onChange={(e) => {
                    setSameAsContact(e.target.checked);
                    if (e.target.checked && attendees.length > 0) {
                      updateAttendee(0, 'name', contactName);
                      updateAttendee(0, 'email', contactEmail);
                    }
                  }} className="sr-only" />
                  <span className="text-body-sm font-medium">Peserta pertama sama dengan kontak pemesan</span>
                </label>

                <div className="flex flex-col gap-6">
                  {attendees.map((att, i) => (
                    <div key={i} className="p-5 bg-ground-muted border border-ground-subtle">
                      <p className="text-body-sm font-bold text-ink mb-4">Tiket Peserta #{i + 1}</p>
                      <div className="flex flex-col gap-4">
                        <Input
                          label="Nama Lengkap Peserta"
                          value={i === 0 && sameAsContact ? contactName : att.name}
                          onChange={(e) => updateAttendee(i, 'name', e.target.value)}
                          disabled={i === 0 && sameAsContact}
                          error={errors[`att-${i}-name`]}
                        />
                        <Input
                          label="Email Peserta (Untuk Pengiriman E-Ticket)"
                          type="email"
                          value={i === 0 && sameAsContact ? contactEmail : att.email}
                          onChange={(e) => updateAttendee(i, 'email', e.target.value)}
                          disabled={i === 0 && sameAsContact}
                          error={errors[`att-${i}-email`]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button variant="outline" onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Kembali
                </Button>
                <Button onClick={goToStep3}>Lanjutkan ke Konfirmasi</Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div>
              <h2 className="font-display font-bold text-display-sm mb-6">Ringkasan & Konfirmasi Pesanan</h2>

              <div className="bg-ground-muted p-6 mb-6 border border-ground-subtle">
                <h3 className="text-body font-bold text-ink mb-4">Rincian Tiket yang Dipesan</h3>
                {orderSummaryItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-ground-subtle last:border-0">
                    <div>
                      <p className="text-body font-medium">{item.name}</p>
                      <p className="text-body-sm text-ink-muted">{item.quantity}× {formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-body font-bold">{formatCurrency(item.subtotal)}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-ground-subtle">
                  <p className="text-body font-bold">Total Pembayaran</p>
                  <p className="font-display font-bold text-display-sm text-accent">{formatCurrency(total)}</p>
                </div>
              </div>

              <div className="bg-ground p-6 mb-6 border border-ground-subtle">
                <h3 className="text-body font-bold text-ink mb-3">Kontak Penanggung Jawab</h3>
                <p className="text-body-sm font-medium">{contactName}</p>
                <p className="text-body-sm text-ink-muted">{contactEmail} · {contactPhone}</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-6 mb-8 text-emerald-900">
                <p className="text-body font-bold mb-1">Simulasi Pembayaran Terintegrasi</p>
                <p className="text-body-sm leading-relaxed">
                  Setelah menekan <strong>Konfirmasi Pesanan</strong>, tiket digital resmi ber-QR code unik akan langsung diterbitkan ke akun Anda dan dapat di-scan di gerbang acara.
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Kembali
                </Button>
                <Button onClick={handleConfirm} loading={isProcessing}>
                  Konfirmasi & Terbitkan Tiket
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success & Live E-Tickets */}
          {step === 4 && orderResult && (
            <div className="text-center py-10 bg-ground border border-ground-subtle p-8">
              <div className="w-16 h-16 bg-success text-white flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="font-display font-bold text-display-md text-ink">Pemesanan Berhasil!</h2>
              <p className="text-body text-ink-muted mt-2">Kode pesanan resmi Anda:</p>
              <p className="font-mono font-bold text-display-sm text-accent mt-1">{orderResult.orderCode}</p>

              <p className="text-body text-ink-muted mt-4 max-w-md mx-auto">
                {orderResult.tickets.length} E-Ticket digital ber-QR code unik telah diterbitkan dan tersimpan di akun Anda.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/tickets/${orderResult.tickets[0]?.id || ''}`}>
                  <Button size="lg">Buka E-Ticket Digital Sekarang</Button>
                </Link>
                <Link href="/tickets">
                  <Button variant="outline" size="lg">Lihat Semua Tiket Saya</Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        {step < 4 && (
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 bg-ground-muted p-6 border border-ground-subtle">
              <h3 className="text-body font-bold text-ink mb-3">Ringkasan Pesanan</h3>
              <p className="text-body-sm font-semibold">{eventData.title}</p>
              <p className="text-caption text-ink-muted mt-1">
                {formatDateRange(eventData.start_date, eventData.end_date)}
              </p>

              {orderSummaryItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-ground-subtle space-y-2">
                  {orderSummaryItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-body-sm">
                      <span>{item.quantity}× {item.name}</span>
                      <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-ground-subtle flex justify-between items-center">
                <span className="text-body font-bold">Total</span>
                <span className="font-display font-bold text-body-lg text-accent">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
        <p className="text-body text-ink-muted">Memuat halaman booking...</p>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
