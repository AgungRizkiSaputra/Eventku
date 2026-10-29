'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const { user, register, isLoading } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'organizer'>('user');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (user) {
    router.push('/');
    return null;
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Nama lengkap wajib diisi';
    if (!email.trim()) errs.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Format email tidak valid';
    if (!password) errs.password = 'Password wajib diisi';
    else if (password.length < 8) errs.password = 'Password minimal 8 karakter';
    if (password !== confirmPassword) errs.confirmPassword = 'Password tidak cocok';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await register({ email, password, full_name: fullName });
    if (success) router.push('/');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: brand */}
      <div className="hidden lg:flex bg-ground-dark text-ground items-end p-12 xl:p-16">
        <div>
          <h2 className="font-display font-bold text-display-xl tracking-tight">EVENTKU</h2>
          <p className="text-body-lg text-ground/50 mt-4 max-w-md">
            Buat dan kelola event, jangkau ribuan peserta, dan pantau penjualan tiket dari satu platform.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-8 pt-24 lg:pt-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="font-display font-bold text-xl tracking-tight lg:hidden mb-12 block">EVENTKU</Link>

          <h1 className="font-display font-bold text-display-md">Daftar</h1>
          <p className="text-body text-ink-muted mt-2">Buat akun baru untuk memulai</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <Input label="Nama Lengkap" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nama Anda" error={errors.fullName} />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" error={errors.email} />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 8 karakter" error={errors.password} />
            <Input label="Konfirmasi Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Ulangi password" error={errors.confirmPassword} />

            {/* Role selector */}
            <div>
              <label className="text-body-sm font-medium text-ink mb-3 block">Daftar sebagai</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'user' as const, label: 'Peserta', desc: 'Temukan dan hadiri event' },
                  { value: 'organizer' as const, label: 'Penyelenggara', desc: 'Buat dan kelola event' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={cn(
                      'p-4 text-left transition-colors',
                      role === opt.value ? 'bg-ink text-ground' : 'bg-ground-muted text-ink hover:bg-ground-subtle',
                    )}
                  >
                    <p className="text-body-sm font-medium">{opt.label}</p>
                    <p className={cn('text-caption mt-1', role === opt.value ? 'text-ground/60' : 'text-ink-faint')}>
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" fullWidth size="lg" loading={isLoading} className="mt-2">
              Daftar
            </Button>
          </form>

          <p className="text-body-sm text-ink-muted mt-6">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

