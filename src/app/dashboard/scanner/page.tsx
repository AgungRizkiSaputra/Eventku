'use client';

import { useState } from 'react';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { useAppContext } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, CheckCircle2, XCircle, AlertCircle, UserCheck } from 'lucide-react';
import { Ticket } from '@/types';

export default function TicketScannerPage() {
  const { tickets, events, ticketTypes, checkInTicket } = useAppContext();

  const [ticketInput, setTicketInput] = useState('');
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
      // raw code
    }

    const found = tickets.find((t) => t.ticket_code === targetCode || t.id === targetCode);

    if (!found) {
      setScannedTicket(null);
      setScanStatus('invalid');
      setMessage(`Tiket dengan kode "${targetCode}" tidak terdaftar dalam sistem.`);
      return;
    }

    const event = events.find((e) => e.id === found.event_id);
    const ticketType = ticketTypes.find((tt) => tt.id === found.ticket_type_id);

    setScannedTicket({
      ticket: found,
      eventTitle: event?.title || 'Acara Terdaftar',
      ticketTypeName: ticketType?.name || 'Tiket Terdaftar',
    });

    if (found.status === 'used') {
      setScanStatus('already_used');
      setMessage(`Tiket SUDAH PERNAH DIGUNAKAN pada ${found.checked_in_at || 'sebelumnya'}. DILARANG MASUK DUA KALI.`);
    } else if (found.status === 'valid') {
      setScanStatus('success');
      setMessage('Tiket VALID. Peserta berhak masuk ke venue acara.');
    } else {
      setScanStatus('invalid');
      setMessage(`Status tiket: ${found.status.toUpperCase()}. Tidak dapat digunakan.`);
    }
  };

  const handleExecuteCheckIn = () => {
    if (!scannedTicket) return;
    const result = checkInTicket(scannedTicket.ticket.ticket_code);

    if (result.success && result.ticket) {
      setScannedTicket({
        ...scannedTicket,
        ticket: result.ticket,
      });
      setScanStatus('already_used');
      setMessage(result.message);
    } else {
      setScanStatus('already_used');
      setMessage(result.message);
    }
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
          Peralatan verifikasi QR Code dan tiket peserta di pintu masuk (gate) acara untuk staf penyelenggara.
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
            Pindai data QR atau ketik kode tiket unik (misalnya <code className="bg-ground-muted px-1.5 py-0.5 font-mono text-ink">TIX-XXXXXXXXXX</code>).
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
            <span className="text-caption text-ink-faint block mb-2 font-medium">Contoh Tiket untuk Uji Coba Gate Langsung:</span>
            <div className="flex flex-wrap gap-2">
              {tickets.slice(0, 4).map((t) => (
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
                <h3 className="font-display font-bold text-body-lg text-ink">Hasil Validasi Pintu Masuk</h3>
                {scanStatus === 'idle' && <Badge variant="default">Menunggu Input</Badge>}
                {scanStatus === 'success' && <Badge variant="success">Tiket VALID</Badge>}
                {scanStatus === 'already_used' && <Badge variant="warning">SUDAH CHECK-IN</Badge>}
                {scanStatus === 'invalid' && <Badge variant="error">TIDAK VALID</Badge>}
              </div>

              {scanStatus === 'idle' && (
                <div className="py-12 text-center text-ink-faint">
                  <QrCode className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-body-sm">Ketik kode tiket atau klik salah satu tiket uji coba di sebelah kiri.</p>
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
                      <p className="text-body-sm font-semibold">{message}</p>
                    </div>
                  </div>

                  {scannedTicket && (
                    <div className="space-y-4 p-4 bg-ground-muted border border-ground-subtle">
                      <div>
                        <span className="text-caption text-ink-faint block uppercase font-bold">Acara</span>
                        <p className="font-display font-bold text-body text-ink">{scannedTicket.eventTitle}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-caption text-ink-faint block uppercase font-bold">Nama Pemegang Tiket</span>
                          <p className="text-body-sm font-bold text-ink">{scannedTicket.ticket.attendee_name}</p>
                          <p className="text-caption text-ink-muted">{scannedTicket.ticket.attendee_email}</p>
                        </div>
                        <div>
                          <span className="text-caption text-ink-faint block uppercase font-bold">Kategori Tiket</span>
                          <p className="text-body-sm font-bold text-accent">{scannedTicket.ticketTypeName}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-ground-subtle">
                        <div>
                          <span className="text-caption text-ink-faint block uppercase font-bold">Kode Tiket</span>
                          <p className="font-mono text-body-sm text-ink font-bold">{scannedTicket.ticket.ticket_code}</p>
                        </div>
                        <div>
                          <span className="text-caption text-ink-faint block uppercase font-bold">Status Check-in</span>
                          <p className="text-body-sm text-ink font-semibold">
                            {scannedTicket.ticket.checked_in_at || 'Belum pernah check-in'}
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
                <Button size="lg" fullWidth onClick={handleExecuteCheckIn} className="gap-2 bg-success hover:bg-emerald-700">
                  <UserCheck className="w-5 h-5" /> Konfirmasi Masuk & Berikan Gelang Akses (Check-in)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
