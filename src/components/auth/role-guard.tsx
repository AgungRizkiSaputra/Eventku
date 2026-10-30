'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import { ShieldAlert, Lock, ArrowRight, UserCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  moduleName?: string;
}

export function RoleGuard({ children, allowedRoles, moduleName = 'Halaman Khusus' }: RoleGuardProps) {
  const { user, switchRole, loginAsRole } = useAuth();

  // 1. If not logged in
  if (!user) {
    return (
      <div className="pt-28 md:pt-36 pb-section page-padding max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-ground-muted border border-ground-subtle flex items-center justify-center mx-auto mb-6 text-accent">
          <Lock className="w-8 h-8" />
        </div>
        <Badge variant="accent" className="mb-3">Autentikasi Diperlukan</Badge>
        <h1 className="font-display font-bold text-display-md text-ink">Silakan Masuk</h1>
        <p className="text-body text-ink-muted mt-3 max-w-md mx-auto">
          Untuk mengakses {moduleName}, Anda harus memiliki akun terdaftar dengan izin: {' '}
          <strong className="text-ink">{allowedRoles.join(' / ').toUpperCase()}</strong>.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/auth/login">
            <Button size="lg">Masuk ke Akun</Button>
          </Link>
          <button
            onClick={() => loginAsRole(allowedRoles[0])}
            className="px-6 py-3 border-2 border-ink text-body font-medium hover:bg-ink hover:text-ground transition-colors"
          >
            Masuk Cepat sebagai {allowedRoles[0].toUpperCase()}
          </button>
        </div>
      </div>
    );
  }

  // 2. If logged in but role is NOT allowed
  const isAllowed = allowedRoles.includes(user.role);

  if (!isAllowed) {
    const roleLabels: Record<UserRole, string> = {
      user: 'Peserta (Customer)',
      organizer: 'Penyelenggara (Organizer)',
      admin: 'Administrator Platform',
    };

    return (
      <div className="pt-28 md:pt-36 pb-section page-padding max-w-3xl mx-auto">
        <div className="bg-ground border-2 border-red-200 p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-red-100 text-error flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="error">403 — Akses Ditolak</Badge>
                <span className="text-caption text-ink-faint">Role-Based Access Control</span>
              </div>

              <h1 className="font-display font-bold text-display-sm md:text-display-md text-ink">
                Izin Tidak Mencukupi
              </h1>

              <div className="my-4 p-4 bg-ground-muted border border-ground-subtle">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-ink-muted">Akun Anda saat ini:</span>
                  <span className="font-medium text-ink">{user.full_name} ({user.email})</span>
                </div>
                <div className="flex items-center justify-between text-body-sm mt-1.5 pt-1.5 border-t border-ground-subtle">
                  <span className="text-ink-muted">Peran Anda:</span>
                  <Badge variant="default" className="font-semibold">{roleLabels[user.role]}</Badge>
                </div>
                <div className="flex items-center justify-between text-body-sm mt-1.5 pt-1.5 border-t border-ground-subtle">
                  <span className="text-ink-muted">Peran yang diizinkan untuk {moduleName}:</span>
                  <Badge variant="accent" className="font-semibold">{allowedRoles.map(r => roleLabels[r]).join(' atau ')}</Badge>
                </div>
              </div>

              <p className="text-body text-ink-muted leading-relaxed">
                {user.role === 'organizer' && allowedRoles.includes('admin') && (
                  <>
                    Akun <strong>Penyelenggara</strong> tidak memiliki akses ke <strong>Panel Admin</strong>. Panel Admin secara eksklusif dikhususkan untuk tim operasional platform untuk memoderasi event, mengatur pengguna, dan mengubah kategori.
                  </>
                )}
                {user.role === 'user' && allowedRoles.includes('organizer') && (
                  <>
                    Akun <strong>Peserta</strong> tidak memiliki akses ke <strong>Dashboard Penyelenggara</strong>. Dashboard ini ditujukan bagi promotor dan penyelenggara yang mengelola tiket, kuota, dan validasi gate.
                  </>
                )}
                {user.role === 'user' && allowedRoles.includes('admin') && (
                  <>
                    Akun <strong>Peserta</strong> tidak memiliki izin untuk membuka area administratif sistem.
                  </>
                )}
              </p>

              {/* Action buttons & Instant Switcher for Evaluator/Testing */}
              <div className="mt-8 pt-6 border-t border-ground-subtle flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href={user.role === 'organizer' ? '/dashboard' : '/'}>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Kembali ke Halaman {user.role === 'organizer' ? 'Dashboard' : 'Beranda'}
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={() => switchRole(allowedRoles[0])}
                  className="px-5 py-2.5 bg-ink text-ground text-body-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Beralih ke Peran {roleLabels[allowedRoles[0]]} (Demo Switch)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. User is authorized!
  return <>{children}</>;
}

