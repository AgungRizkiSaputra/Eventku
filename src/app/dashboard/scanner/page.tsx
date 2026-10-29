'use client';

import { useState } from 'react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { MOCK_TICKETS, getEventById, MOCK_TICKET_TYPES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, CheckCircle2, XCircle, AlertCircle, RefreshCw, UserCheck } from 'lucide-react';
import { Ticket } from '@/types';

export default function TicketScannerPage() {
  const [ticketInput, setTicketInput] = useState('');
  const [ticketState, setTicketState] = useState<Ticket[]>(MOCK_TICKETS);
  const [scannedTicket, setScannedTicket] = useState<{
    ticket: Ticket;
    eventTitle: string;
    ticketTypeName: string;
  } | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'already_used' | 'invalid'>('idle');
  const [message, setMessage] = useState('');

  const handleVerify = (codeToVerify?: string) => {
    const rawCode = (codeToVerify || ticketInput).trim();
    if (!rawCode) return;

    let targetCode = rawCode;
    // Check if input is a base64 encoded QR payload
    try {
      if (rawCode.length > 20 && !rawCode.startsWith('TIX-')) {
        const decoded = JSON.parse(atob(rawCode));
        if (decoded && decoded.code) {
          targetCode = decoded.code;
        }
      }
    } catch {
      // Not base64 JSON, treat as raw ticket code
    }

    const found = ticketState.find((t) => t.ticket_code === targetCode || t.id === targetCode);

    if (!found) {
      setScannedTicket(null);
      setScanStatus('invalid');
      setMessage(`Tiket dengan kode "${targetCode}" tidak terdaftar di sistem.`);
      return;
    }

    const event = getEventById(found.event_id);
    const ticketType = MOCK_TICKET_TYPES.find((tt) => tt.id === found.ticket_type_id);

    setScannedTicket({
      ticket: found,
      eventTitle: event?.title || 'Event Terdaftar',
      ticketTypeName: ticketType?.name || 'Tiket Terdaftar',
    });

    if (found.status === 'used') {
      setScanStatus('already_used');
      setMessage(`Tiket sudah pernah digunakan pada ${found.checked_in_at || 'sebelumnya'}. DILARANG MASUK DUA KALI.`);
    } else if (found.status === 'valid') {
      setScanStatus('success');
      setMessage('Tiket VALID. Peserta berhak masuk ke venue acara.');
    } else {
      setScanStatus('invalid');
      setMessage(`Status tiket: ${found.status}. Tidak dapat digunakan.`);
    }
  };

  const handleCheckIn = () => {
    if (!scannedTicket || scannedTicket.ticket.status !== 'valid') return;

    const now = new Date().toLocaleString('id-ID');
    const updated = ticketState.map((t) =>
      t.id === scannedTicket.ticket.id
        ? { ...t, status: 'used' as const, checked_in_at: now }
        : t
    );

    setTicketState(updated);
    setScannedTicket({
      ...scannedTicket,
      ticket: {
        ...scannedTicket.ticket,
        status: 'used',
        checked_in_at: now,
      },
    });
    setScanStatus('already_used');
    setMessage(`BERHASIL CHECK-IN pada ${now}. Gelang / akses telah diberikan.`);
  };

  const resetScanner = () => {
    setTicketInput('');
    setScannedTicket(null);
    setScanStatus('idle');
    setMessage('');
  };

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-bold text-display-md">Validasi & Check-in Tiket (Gate Scanner)</h1>
        <p className="text-body text-ink-muted mt-1">
          Peralatan verifikasi QR Code dan tiket peserta di pintu masuk (gate) acara.
        </p>
      </div>

      <DashboardNav />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Verification Form */}
        <div className="lg:col-span-6 bg-ground border border-ground-subtle p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="w-5 h-5 text-accent" />
            <h2 className="font-display font-bold text-body-lg text-ink">Pindai / Masukkan Kode Tiket</h2>
          </div>

          <p className="text-body-sm text-ink-muted mb-6">
            Pindai data QR atau ketik kode tiket (misalnya <code className="bg-ground-muted px-1.5 py-0.5 font-mono text-ink">TIX-N5F7A2K9B3</code>).
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-body-sm font-medium text-ink mb-1.5 block">Kode Tiket / QR String</label>
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                placeholder="TIX-XXXXXXXXXX atau tempel payload QR"
                className="w-full bg-ground border-2 border-ink/20 px-4 py-3 font-mono text-body text-ink focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => handleVerify()} size="lg" className="flex-1">
                Verifikasi Tiket
              </Button>
              <Button variant="outline" size="lg" onClick={resetScanner}>
                Reset
              </Button>
            </div>
          </div>

          {/* Quick Test Demo Codes */}
          <div className="mt-8 pt-6 border-t border-ground-subtle">
            <span className="text-caption text-ink-faint block mb-2 font-medium">Contoh Tiket untuk Uji Coba Langsung:</span>
            <div className="flex flex-wrap gap-2">
              {ticketState.slice(0, 3).map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTicketInput(t.ticket_code);
                    handleVerify(t.ticket_code);
                  }}
                  className="px-2.5 py-1.5 bg-ground-muted hover:bg-ground-subtle text-caption font-mono text-ink border border-ground-subtle transition-colors text-left"
                >
                  {t.ticket_code} ({t.attendee_name} - {t.status === 'valid' ? 'Aktif' : 'Terpakai'})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Area */}
        <div className="lg:col-span-6">
          <div className="bg-ground border border-ground-subtle p-6 md:p-8 min-h-[380px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-ground-subtle">
                <h3 className="font-display font-bold text-body-lg text-ink">Hasil Validasi Gate</h3>
                {scanStatus === 'idle' && <Badge variant="default">Menunggu Input</Badge>}
                {scanStatus === 'success' && <Badge variant="success">Tiket VALID</Badge>}
                {scanStatus === 'already_used' && <Badge variant="warning">SUDAH CHECK-IN</Badge>}
                {scanStatus === 'invalid' && <Badge variant="error">TIDAK VALID</Badge>}
              </div>

              {scanStatus === 'idle' && (
                <div className="py-12 text-center text-ink-faint">
                  <QrCode className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-body-sm">Masukkan kode tiket atau klik salah satu tiket demo di sebelah kiri.</p>
                </div>
              )}

              {scanStatus !== 'idle' && (
                <div>
                  <div
                    className={`p-4 mb-6 flex items-start gap-3 ${
                      scanStatus === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : scanStatus === 'already_used'
                        ? 'bg-amber-50 border border-amber-200 text-amber-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}
                  >
                    {scanStatus === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-success" />}
                    {scanStatus === 'already_used' && <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-warning" />}
                    {scanStatus === 'invalid' && <XCircle className="w-5 h-5 shrink-0 mt-0.5 text-error" />}
                    <div>
                      <p className="text-body-sm font-medium">{message}</p>
                    </div>
                  </div>

                  {scannedTicket && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-caption text-ink-faint block">Acara</span>
                        <p className="font-display font-bold text-body text-ink">{scannedTicket.eventTitle}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-caption text-ink-faint block">Nama Pemegang Tiket</span>
                          <p className="text-body-sm font-medium text-ink">{scannedTicket.ticket.attendee_name}</p>
                          <p className="text-caption text-ink-muted">{scannedTicket.ticket.attendee_email}</p>
                        </div>
                        <div>
                          <span className="text-caption text-ink-faint block">Kategori Tiket</span>
                          <p className="text-body-sm font-medium text-accent">{scannedTicket.ticketTypeName}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <span className="text-caption text-ink-faint block">Kode Tiket</span>
                          <p className="font-mono text-body-sm text-ink">{scannedTicket.ticket.ticket_code}</p>
                        </div>
                        <div>
                          <span className="text-caption text-ink-faint block">Waktu Check-in</span>
                          <p className="text-body-sm text-ink font-medium">
                            {scannedTicket.ticket.checked_in_at || 'Belum pernah'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {scannedTicket && scannedTicket.ticket.status === 'valid' && (
              <div className="pt-6 mt-6 border-t border-ground-subtle">
                <Button size="lg" fullWidth onClick={handleCheckIn} className="gap-2 bg-success hover:bg-emerald-700">
                  <UserCheck className="w-5 h-5" /> Konfirmasi Masuk & Berikan Akses (Check-in)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

