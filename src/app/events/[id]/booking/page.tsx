'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Check, ArrowLeft, Minus, Plus } from 'lucide-react';
import { getEventWithDetails } from '@/lib/mock-data';
import { formatCurrency, formatDateRange, formatTime, generateOrderCode, generateTicketCode, generateQRData, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';

function BookingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const eventId = params.id as string;
  const eventData = getEventWithDetails(eventId);

  // Parse initial ticket selections from URL
  const initialTickets: Record<string, number> = {};
  if (eventData) {
    eventData.ticket_types.forEach(tt => {
      const q = searchParams.get(tt.id);
      if (q) initialTickets[tt.id] = parseInt(q) || 0;
    });
  }

  const [step, setStep] = useState(1);
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>(initialTickets);
  const [contactName, setContactName] = useState(user?.full_name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [attendees, setAttendees] = useState<{ name: string; email: string }[]>([]);
  const [sameAsContact, setSameAsContact] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderResult, setOrderResult] = useState<{ orderCode: string; tickets: { code: string; id: string }[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalTicketCount = useMemo(() => {
    return Object.values(selectedTickets).reduce((sum, q) => sum + q, 0);
  }, [selectedTickets]);

  const total = useMemo(() => {
    if (!eventData) return 0;
    return eventData.ticket_types.reduce((sum, tt) => {
      return sum + (selectedTickets[tt.id] || 0) * tt.price;
    }, 0);
  }, [selectedTickets, eventData]);

  const orderSummaryItems = useMemo(() => {
    if (!eventData) return [];
    return eventData.ticket_types
      .filter(tt => (selectedTickets[tt.id] || 0) > 0)
      .map(tt => ({
        ...tt,
        quantity: selectedTickets[tt.id],
        subtotal: selectedTickets[tt.id] * tt.price,
      }));
  }, [selectedTickets, eventData]);

  if (!eventData) {
    return (
      <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto text-center">
        <h1 className="font-display font-bold text-display-md">Event tidak ditemukan</h1>
        <Link href="/events"><Button className="mt-8">Kembali</Button></Link>
      </div>
    );
  }

  const updateQuantity = (ticketTypeId: string, delta: number) => {
    const tt = eventData.ticket_types.find(t => t.id === ticketTypeId);
    if (!tt) return;
    const current = selectedTickets[ticketTypeId] || 0;
    const next = Math.max(0, Math.min(current + delta, tt.max_per_order, tt.quota - tt.sold));
    setSelectedTickets(prev => ({ ...prev, [ticketTypeId]: next }));
  };

  const goToStep2 = () => {
    if (totalTicketCount === 0) return;
    // Initialize attendees
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
    await new Promise(r => setTimeout(r, 1500));

    const orderCode = generateOrderCode();
    const tickets = attendees.map(() => {
      const code = generateTicketCode();
      return {
        code,
        id: `tix-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        qr: generateQRData(code, eventData.id),
      };
    });

    setOrderResult({ orderCode, tickets });
    setIsProcessing(false);
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateAttendee = (index: number, field: 'name' | 'email', value: string) => {
    setAttendees(prev => prev.map((att, i) => i === index ? { ...att, [field]: value } : att));
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
        {/* Main area */}
        <div className="lg:col-span-7 xl:col-span-8">
          {/* Step 1: Ticket selection */}
          {step === 1 && (
            <div>
              <h2 className="font-display font-bold text-display-sm mb-6">Pilih Tiket</h2>
              <div className="flex flex-col gap-4">
                {eventData.ticket_types.map(tt => {
                  const remaining = tt.quota - tt.sold;
                  const isSoldOut = remaining <= 0;
                  const qty = selectedTickets[tt.id] || 0;

                  return (
                    <div key={tt.id} className={cn('p-5 bg-ground-muted', isSoldOut && 'opacity-50')}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-body font-medium">{tt.name}</h3>
                          {tt.description && <p className="text-body-sm text-ink-muted mt-1">{tt.description}</p>}
                          <p className="text-body font-medium text-accent mt-2">
                            {tt.price > 0 ? formatCurrency(tt.price) : 'Gratis'}
                          </p>
                          <p className="text-caption text-ink-faint mt-1">
                            {isSoldOut ? 'Habis terjual' : `${remaining} tersisa · Maks ${tt.max_per_order}/pesanan`}
                          </p>
                        </div>
                        {!isSoldOut && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => updateQuantity(tt.id, -1)} disabled={qty === 0}
                              className="w-9 h-9 flex items-center justify-center bg-ground hover:bg-ground-subtle disabled:opacity-30 transition-colors" aria-label="Kurangi">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-body font-medium">{qty}</span>
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
                  Lanjutkan
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Attendee info */}
          {step === 2 && (
            <div>
              <h2 className="font-display font-bold text-display-sm mb-6">Data Peserta</h2>

              <div className="mb-8">
                <h3 className="text-body font-medium mb-4">Informasi Kontak</h3>
                <div className="flex flex-col gap-4">
                  <Input label="Nama Lengkap" value={contactName} onChange={e => setContactName(e.target.value)} error={errors.contactName} />
                  <Input label="Email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} error={errors.contactEmail} />
                  <Input label="Nomor Telepon" type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} error={errors.contactPhone} />
                </div>
              </div>

              <div>
                <h3 className="text-body font-medium mb-4">Data Peserta ({totalTicketCount} tiket)</h3>

                <label className="flex items-center gap-3 mb-6 cursor-pointer">
                  <span className={cn(
                    'w-5 h-5 border-2 flex items-center justify-center transition-colors',
                    sameAsContact ? 'bg-ink border-ink' : 'border-ink/30',
                  )}>
                    {sameAsContact && <Check className="w-3 h-3 text-ground" />}
                  </span>
                  <input type="checkbox" checked={sameAsContact} onChange={e => {
                    setSameAsContact(e.target.checked);
                    if (e.target.checked && attendees.length > 0) {
                      updateAttendee(0, 'name', contactName);
                      updateAttendee(0, 'email', contactEmail);
                    }
                  }} className="sr-only" />
                  <span className="text-body-sm">Peserta pertama sama dengan kontak</span>
                </label>

                <div className="flex flex-col gap-6">
                  {attendees.map((att, i) => (
                    <div key={i} className="p-5 bg-ground-muted">
                      <p className="text-body-sm font-medium mb-4">Peserta {i + 1}</p>
                      <div className="flex flex-col gap-4">
                        <Input
                          label="Nama"
                          value={i === 0 && sameAsContact ? contactName : att.name}
                          onChange={e => updateAttendee(i, 'name', e.target.value)}
                          disabled={i === 0 && sameAsContact}
                          error={errors[`att-${i}-name`]}
                        />
                        <Input
                          label="Email"
                          type="email"
                          value={i === 0 && sameAsContact ? contactEmail : att.email}
                          onChange={e => updateAttendee(i, 'email', e.target.value)}
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
                <Button onClick={goToStep3}>Lanjutkan</Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div>
              <h2 className="font-display font-bold text-display-sm mb-6">Konfirmasi Pesanan</h2>

              <div className="bg-ground-muted p-6 mb-6">
                <h3 className="text-body font-medium mb-4">Detail Pesanan</h3>
                {orderSummaryItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-ground-subtle last:border-0">
                    <div>
                      <p className="text-body">{item.name}</p>
                      <p className="text-body-sm text-ink-muted">{item.quantity}× {formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-body font-medium">{formatCurrency(item.subtotal)}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4 mt-2">
                  <p className="text-body font-medium">Total</p>
                  <p className="font-display font-bold text-display-sm text-accent">{formatCurrency(total)}</p>
                </div>
              </div>

              <div className="bg-ground-muted p-6 mb-6">
                <h3 className="text-body font-medium mb-3">Kontak</h3>
                <p className="text-body-sm">{contactName}</p>
                <p className="text-body-sm text-ink-muted">{contactEmail} · {contactPhone}</p>
              </div>

              <div className="bg-accent-muted p-6 mb-8">
                <p className="text-body font-medium text-accent mb-2">Informasi Pembayaran</p>
                <p className="text-body-sm text-ink">
                  Pembayaran akan diproses melalui payment gateway setelah Anda mengkonfirmasi pesanan.
                  Integrasi payment gateway (Midtrans/Xendit) perlu dikonfigurasi dengan API key yang valid.
                  Untuk demo, pesanan akan langsung dikonfirmasi.
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  Kembali
                </Button>
                <Button onClick={handleConfirm} loading={isProcessing}>
                  Konfirmasi Pesanan
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && orderResult && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-success text-white flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="font-display font-bold text-display-md">Pesanan Berhasil</h2>
              <p className="text-body text-ink-muted mt-2">Kode pesanan Anda:</p>
              <p className="font-display font-bold text-display-sm text-accent mt-2">{orderResult.orderCode}</p>
              <p className="text-body text-ink-muted mt-4 max-w-md mx-auto">
                E-ticket telah dibuat untuk setiap peserta. Anda dapat melihat tiket di halaman Tiket Saya.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tickets">
                  <Button>Lihat Tiket Saya</Button>
                </Link>
                <Link href="/events">
                  <Button variant="outline">Jelajahi Event Lain</Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        {step < 4 && (
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 bg-ground-muted p-6">
              <h3 className="text-body font-medium mb-4">Ringkasan</h3>
              <p className="text-body-sm font-medium">{eventData.title}</p>
              <p className="text-caption text-ink-muted mt-1">
                {formatDateRange(eventData.start_date, eventData.end_date)}
              </p>

              {orderSummaryItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-ground-subtle">
                  {orderSummaryItems.map(item => (
                    <div key={item.id} className="flex justify-between text-body-sm py-1">
                      <span>{item.quantity}× {item.name}</span>
                      <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-ground-subtle flex justify-between">
                <span className="text-body font-medium">Total</span>
                <span className="font-display font-bold text-body-lg">{formatCurrency(total)}</span>
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
        <p className="text-body text-ink-muted">Memuat...</p>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}

