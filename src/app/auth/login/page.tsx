'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Briefcase, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/types';

export default function LoginPage() {
  const { user, login, loginAsRole, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email wajib diisi');
      return;
    }

    const success = await login(email, password);
    if (success) {
      if (email.toLowerCase().includes('admin')) {
        router.push('/admin');
      } else if (email.toLowerCase().includes('organizer')) {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } else {
      setError('Email atau password salah');
    }
  };

  const handleRoleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
    if (role === 'admin') {
      router.push('/admin');
    } else if (role === 'organizer') {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
      {/* Left Column: Visual & Actors Explanation */}
      <div className="lg:col-span-5 bg-ground-dark text-ground p-8 md:p-12 xl:p-16 flex flex-col justify-between pt-24 lg:pt-16">
        <div>
          <Link href="/" className="font-display font-bold text-2xl tracking-tight text-white inline-block mb-10">
            EVENTKU
          </Link>

          <span className="text-caption text-accent font-medium tracking-wider uppercase block mb-2">
            Multi-Actor Architecture
          </span>
          <h2 className="font-display font-bold text-display-md tracking-tight text-white leading-tight">
            Tiga Peran,<br />Alur Terproteksi.
          </h2>
          <p className="text-body text-ground/70 mt-3 leading-relaxed">
            Sistem memisahkan batasan hak akses secara ketat antara Peserta, Penyelenggara, dan Administrator.
          </p>

          {/* Actor Role Summary Cards */}
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-white/5 border border-white/10">
              <div className="flex items-center gap-2.5 mb-1.5">
                <User className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-body-sm text-white">1. Peserta (Customer)</span>
              </div>
              <p className="text-caption text-ground/60 leading-normal">
                Eksplorasi acara, pemesanan tiket, pembayaran, penerbitan e-ticket dengan QR code, dan riwayat pesanan. Dilarang membuka dashboard organizer & panel admin.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-body-sm text-white">2. Penyelenggara (Organizer)</span>
              </div>
              <p className="text-caption text-ground/60 leading-normal">
                Buat dan terbitkan event baru, tentukan kuota & harga tiket multi-tier, pantau metrik penjualan, dan validasi tiket di pintu masuk via QR scanner. Dilarang mengakses moderasi admin.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10">
              <div className="flex items-center gap-2.5 mb-1.5">
                <Shield className="w-4 h-4 text-accent" />
                <span className="font-bold text-body-sm text-white">3. Administrator Platform (Admin)</span>
              </div>
              <p className="text-caption text-ground/60 leading-normal">
                Moderasi acara (setujui/tangguhkan/unggulan), manajemen peran pengguna (jadikan organizer/admin), dan pengaturan taksonomi kategori.
              </p>
            </div>
          </div>
        </div>

        <p className="text-caption text-ground/40 mt-8 hidden lg:block">
          © 2027 Eventku Platform · Arsitektur Role-Based Access Control
        </p>
      </div>

      {/* Right Column: Interactive Login & 1-Click Role Logins */}
      <div className="lg:col-span-7 p-6 sm:p-12 xl:p-16 flex items-center justify-center pt-24 lg:pt-16">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h1 className="font-display font-bold text-display-md text-ink">Masuk ke Akun</h1>
            <p className="text-body text-ink-muted mt-1.5">
              Pilih salah satu peran demo di bawah untuk masuk instan, atau ketik email Anda.
            </p>
          </div>

          {/* Quick Demo Login Buttons for Evaluator */}
          <div className="mb-8 p-5 bg-ground-muted border border-ground-subtle">
            <p className="text-body-sm font-bold text-ink mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              Pilih Peran Uji Coba Cepat (1-Click Login):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('user')}
                className="p-3 bg-ground border border-ground-subtle hover:border-ink text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <User className="w-4 h-4 text-emerald-600" />
                  <Badge variant="default">User</Badge>
                </div>
                <p className="font-bold text-body-sm text-ink group-hover:text-accent">Peserta</p>
                <p className="text-[11px] text-ink-muted mt-0.5 truncate">andi@example.com</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('organizer')}
                className="p-3 bg-ground border border-ground-subtle hover:border-ink text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  <Badge variant="warning">Organizer</Badge>
                </div>
                <p className="font-bold text-body-sm text-ink group-hover:text-accent">Penyelenggara</p>
                <p className="text-[11px] text-ink-muted mt-0.5 truncate">organizer@soundwave.id</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('admin')}
                className="p-3 bg-ground border border-ground-subtle hover:border-ink text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <Shield className="w-4 h-4 text-accent" />
                  <Badge variant="accent">Admin</Badge>
                </div>
                <p className="font-bold text-body-sm text-ink group-hover:text-accent">Administrator</p>
                <p className="text-[11px] text-ink-muted mt-0.5 truncate">admin@eventku.id</p>
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ground-subtle" />
            </div>
            <div className="relative flex justify-center text-caption uppercase">
              <span className="bg-ground px-3 text-ink-faint font-medium">Atau Ketik Email Manual</span>
            </div>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@domain.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {error && <p className="text-body-sm text-error font-medium">{error}</p>}

            <Button type="submit" fullWidth size="lg" loading={isLoading} className="mt-2">
              Masuk dengan Email Ini
            </Button>
          </form>

          <p className="text-body-sm text-ink-muted mt-6 text-center">
            Belum memiliki akun?{' '}
            <Link href="/auth/register" className="text-accent hover:text-accent-hover font-medium underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
