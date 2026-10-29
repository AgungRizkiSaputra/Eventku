'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email wajib diisi'); return; }
    if (!password.trim()) { setError('Password wajib diisi'); return; }

    const success = await login(email, password);
    if (success) {
      router.push('/');
    } else {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: brand */}
      <div className="hidden lg:flex bg-ground-dark text-ground items-end p-12 xl:p-16">
        <div>
          <h2 className="font-display font-bold text-display-xl tracking-tight">EVENTKU</h2>
          <p className="text-body-lg text-ground/50 mt-4 max-w-md">
            Temukan dan hadiri event terbaik di seluruh Indonesia. Konser, festival, seminar, dan lainnya.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-8 pt-24 lg:pt-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="font-display font-bold text-xl tracking-tight lg:hidden mb-12 block">EVENTKU</Link>

          <h1 className="font-display font-bold text-display-md">Masuk</h1>
          <p className="text-body text-ink-muted mt-2">Masuk ke akun Anda untuk melanjutkan</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" autoComplete="email" />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />

            {error && <p className="text-body-sm text-error">{error}</p>}

            <Button type="submit" fullWidth size="lg" loading={isLoading} className="mt-2">
              Masuk
            </Button>
          </form>

          <p className="text-body-sm text-ink-muted mt-6">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-accent hover:text-accent-hover font-medium transition-colors">
              Daftar
            </Link>
          </p>

          <p className="text-caption text-ink-faint mt-8 p-3 bg-ground-muted">
            Demo: gunakan email apapun dengan password apapun untuk masuk. Coba <span className="font-medium">andi@example.com</span> (user), <span className="font-medium">organizer@soundwave.id</span> (organizer), atau <span className="font-medium">admin@eventku.id</span> (admin).
          </p>
        </div>
      </div>
    </div>
  );
}

