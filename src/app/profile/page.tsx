'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types';
import { User, Shield, Briefcase, CheckCircle, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, switchRole } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '081234567890');
  const [savedMessage, setSavedMessage] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  if (!user) {
    return (
      <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto text-center">
        <h1 className="font-display font-bold text-display-md">Profil</h1>
        <p className="text-body text-ink-muted mt-4">Silakan masuk untuk mengakses halaman profil.</p>
        <Link href="/auth/login" className="inline-block mt-6">
          <Button>Masuk ke Akun</Button>
        </Link>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMessage('');

    if (!currentPassword) {
      setPasswordError('Password saat ini wajib diisi');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password baru minimal 8 karakter');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok');
      return;
    }

    setPasswordMessage('Password berhasil diperbarui');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const roleLabel: Record<UserRole, string> = {
    user: 'Peserta',
    organizer: 'Penyelenggara (Organizer)',
    admin: 'Administrator',
  };

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <div className="max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-ground-subtle">
          <div>
            <h1 className="font-display font-bold text-display-md">Profil Saya</h1>
            <p className="text-body text-ink-muted mt-1">Kelola data pribadi dan preferensi akun Anda</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-caption text-ink-muted">Peran:</span>
            <Badge variant="accent">{roleLabel[user.role]}</Badge>
          </div>
        </div>

        {/* Demo Switch Role Banner */}
        <div className="bg-ground-muted p-5 mb-10 border-l-4 border-accent">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-body-sm font-medium text-ink">Mode Pengujian Peran (Demo Switcher)</p>
              <p className="text-caption text-ink-muted mt-1">
                Ganti peran akun Anda seketika untuk menguji fitur Peserta, Dashboard Organizer, atau Dashboard Admin.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {(['user', 'organizer', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                className={`px-3 py-1.5 text-body-sm font-medium transition-colors ${
                  user.role === r
                    ? 'bg-ink text-ground'
                    : 'bg-ground text-ink hover:bg-ground-subtle border border-ground-subtle'
                }`}
              >
                {r === 'user' && <User className="w-3.5 h-3.5 inline mr-1.5" />}
                {r === 'organizer' && <Briefcase className="w-3.5 h-3.5 inline mr-1.5" />}
                {r === 'admin' && <Shield className="w-3.5 h-3.5 inline mr-1.5" />}
                {roleLabel[r]}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="bg-ground border border-ground-subtle p-6 md:p-8 mb-10">
          <h2 className="font-display font-bold text-display-sm mb-6">Informasi Akun</h2>

          <div className="flex flex-col gap-5">
            <Input
              label="Nama Lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama lengkap Anda"
            />

            <div>
              <label className="text-body-sm font-medium text-ink mb-1.5 block">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-ground-muted border-b-2 border-ink/10 px-3 py-2.5 text-body text-ink-muted cursor-not-allowed"
              />
              <p className="text-caption text-ink-faint mt-1">Email akun tidak dapat diubah</p>
            </div>

            <Input
              label="Nomor Telepon"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08123456789"
            />
          </div>

          {savedMessage && (
            <div className="mt-4 p-3 bg-emerald-50 text-success text-body-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Perubahan profil berhasil disimpan
            </div>
          )}

          <div className="mt-8">
            <Button type="submit">Simpan Perubahan</Button>
          </div>
        </form>

        {/* Password Form */}
        <form onSubmit={handleChangePassword} className="bg-ground border border-ground-subtle p-6 md:p-8 mb-10">
          <h2 className="font-display font-bold text-display-sm mb-6">Keamanan Akun</h2>

          <div className="flex flex-col gap-5">
            <Input
              label="Password Saat Ini"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="Password Baru"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
            />
            <Input
              label="Ulangi Password Baru"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi password baru"
            />
          </div>

          {passwordError && (
            <p className="mt-4 text-body-sm text-error">{passwordError}</p>
          )}

          {passwordMessage && (
            <div className="mt-4 p-3 bg-emerald-50 text-success text-body-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {passwordMessage}
            </div>
          )}

          <div className="mt-8">
            <Button type="submit" variant="outline">Perbarui Password</Button>
          </div>
        </form>

        {/* Logout area */}
        <div className="p-6 bg-red-50/50 border border-red-100 flex items-center justify-between">
          <div>
            <p className="text-body font-medium text-ink">Keluar dari Sesi</p>
            <p className="text-caption text-ink-muted">Akhiri sesi aktif Anda pada perangkat ini.</p>
          </div>
          <Button variant="danger" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Keluar
          </Button>
        </div>
      </div>
    </div>
  );
}

