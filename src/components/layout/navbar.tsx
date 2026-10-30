'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Ticket, User as UserIcon, LayoutDashboard, LogOut, Shield, Calendar, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const isDark = pathname === '/' && !scrolled;

  const navLinks = [
    { href: '/events', label: 'Jelajahi Event' },
  ];

  const roleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="accent">Admin</Badge>;
      case 'organizer':
        return <Badge variant="warning">Organizer</Badge>;
      default:
        return <Badge variant="default">Peserta</Badge>;
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-ground/95 backdrop-blur-sm border-b border-ground-subtle shadow-sm'
          : isDark
            ? 'bg-transparent'
            : 'bg-ground',
      )}
    >
      <nav className="page-padding flex items-center justify-between h-16 md:h-20 max-w-wide mx-auto">
        <Link
          href="/"
          className={cn(
            'font-display font-bold text-xl md:text-2xl tracking-tight transition-colors flex items-center gap-2',
            isDark ? 'text-ground' : 'text-ink',
          )}
        >
          EVENTKU
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-body font-medium transition-colors relative py-1',
                isDark ? 'text-ground/80 hover:text-ground' : 'text-ink-muted hover:text-ink',
                pathname === link.href && (isDark ? 'text-ground' : 'text-ink'),
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent" />
              )}
            </Link>
          ))}

          {/* Direct Role Shortcut for logged in user */}
          {user?.role === 'organizer' && (
            <Link
              href="/dashboard"
              className={cn(
                'text-body-sm font-medium transition-colors flex items-center gap-1.5',
                isDark ? 'text-ground/90 hover:text-ground' : 'text-ink-muted hover:text-ink',
              )}
            >
              <LayoutDashboard className="w-4 h-4 text-accent" /> Dashboard
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className={cn(
                'text-body-sm font-medium transition-colors flex items-center gap-1.5',
                isDark ? 'text-ground/90 hover:text-ground' : 'text-ink-muted hover:text-ink',
              )}
            >
              <Shield className="w-4 h-4 text-accent" /> Panel Admin
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  'flex items-center gap-2.5 text-body font-medium transition-colors pl-2',
                  isDark ? 'text-ground/80 hover:text-ground' : 'text-ink-muted hover:text-ink',
                )}
              >
                <span className="w-9 h-9 bg-ink text-ground flex items-center justify-center text-body-sm font-bold border border-white/20">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
                <span className="text-body-sm font-medium text-left hidden lg:block">
                  <span className={cn('block leading-tight font-semibold', isDark ? 'text-ground' : 'text-ink')}>
                    {user.full_name.split(' ')[0]}
                  </span>
                  <span className="text-caption text-ink-faint block uppercase text-[10px]">
                    {user.role}
                  </span>
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-ground border border-ground-subtle py-2 z-50 shadow-xl">
                    <div className="px-4 py-3 border-b border-ground-subtle">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-body-sm font-bold text-ink truncate">{user.full_name}</p>
                        {roleBadge(user.role)}
                      </div>
                      <p className="text-caption text-ink-faint truncate">{user.email}</p>
                    </div>

                    {/* Links based on user role */}
                    {/* 1. All Users (Peserta, Organizer, Admin) */}
                    <Link
                      href="/tickets"
                      className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink hover:bg-ground-muted transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-accent" /> Tiket Saya
                    </Link>

                    {/* 2. Organizer Specific Links (Strictly blocked from Admin) */}
                    {user.role === 'organizer' && (
                      <>
                        <div className="border-t border-ground-subtle my-1" />
                        <span className="px-4 py-1 text-[10px] uppercase font-bold text-ink-faint block tracking-wider">
                          Menu Penyelenggara
                        </span>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink hover:bg-ground-muted transition-colors font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-ink-muted" /> Ringkasan Penjualan
                        </Link>
                        <Link
                          href="/dashboard/events"
                          className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink hover:bg-ground-muted transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-ink-muted" /> Kelola Event & Kuota
                        </Link>
                        <Link
                          href="/dashboard/scanner"
                          className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink hover:bg-ground-muted transition-colors"
                        >
                          <QrCode className="w-4 h-4 text-ink-muted" /> Scan Tiket di Pintu Masuk
                        </Link>
                      </>
                    )}

                    {/* 3. Admin Specific Links (Strictly for Admin) */}
                    {user.role === 'admin' && (
                      <>
                        <div className="border-t border-ground-subtle my-1" />
                        <span className="px-4 py-1 text-[10px] uppercase font-bold text-accent block tracking-wider">
                          Menu Administrator
                        </span>
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink hover:bg-ground-muted transition-colors font-medium"
                        >
                          <Shield className="w-4 h-4 text-accent" /> Panel Admin
                        </Link>
                        <Link
                          href="/admin/events"
                          className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink hover:bg-ground-muted transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-ink-muted" /> Moderasi Acara
                        </Link>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink hover:bg-ground-muted transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-ink-muted" /> Tinjau Dashboard Organizer
                        </Link>
                      </>
                    )}

                    <div className="border-t border-ground-subtle my-1" />
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-ink hover:bg-ground-muted transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-ink-muted" /> Profil & Ganti Peran
                    </Link>

                    <div className="border-t border-ground-subtle mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-body-sm text-error hover:bg-ground-muted transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Keluar dari Akun
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className={cn(
                  'text-body font-medium transition-colors',
                  isDark ? 'text-ground/80 hover:text-ground' : 'text-ink-muted hover:text-ink',
                )}
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="bg-accent text-white px-5 py-2.5 text-body-sm font-medium hover:bg-accent-hover transition-colors press-scale"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className={cn('md:hidden p-2', isDark ? 'text-ground' : 'text-ink')}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-ground z-30 overflow-y-auto">
          <div className="page-padding py-8 flex flex-col gap-6">
            <Link href="/events" className="text-display-sm font-display font-bold text-ink">
              Jelajahi Event
            </Link>

            <div className="border-t border-ground-subtle pt-6 mt-2">
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2 p-3 bg-ground-muted">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 bg-ink text-ground flex items-center justify-center text-body font-bold">
                        {user.full_name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-body font-medium">{user.full_name}</p>
                        <p className="text-caption text-ink-muted">{user.email}</p>
                      </div>
                    </div>
                    {roleBadge(user.role)}
                  </div>

                  <Link href="/tickets" className="text-body font-medium text-ink py-2 flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-accent" /> Tiket Saya
                  </Link>

                  {/* Organizer Mobile Links */}
                  {user.role === 'organizer' && (
                    <>
                      <div className="border-t border-ground-subtle pt-2">
                        <span className="text-[10px] uppercase font-bold text-ink-faint block mb-2">Area Penyelenggara</span>
                        <Link href="/dashboard" className="text-body font-medium text-ink py-2 block">
                          Dashboard Penyelenggara
                        </Link>
                        <Link href="/dashboard/events" className="text-body text-ink py-2 block">
                          Kelola Event
                        </Link>
                        <Link href="/dashboard/scanner" className="text-body text-ink py-2 block">
                          Scan Tiket Pintu Masuk (QR)
                        </Link>
                      </div>
                    </>
                  )}

                  {/* Admin Mobile Links */}
                  {user.role === 'admin' && (
                    <>
                      <div className="border-t border-ground-subtle pt-2">
                        <span className="text-[10px] uppercase font-bold text-accent block mb-2">Area Administrator</span>
                        <Link href="/admin" className="text-body font-medium text-ink py-2 block">
                          Panel Administrasi
                        </Link>
                        <Link href="/admin/events" className="text-body text-ink py-2 block">
                          Moderasi Acara
                        </Link>
                        <Link href="/admin/users" className="text-body text-ink py-2 block">
                          Kelola Pengguna
                        </Link>
                      </div>
                    </>
                  )}

                  <Link href="/profile" className="text-body font-medium text-ink py-2 border-t border-ground-subtle pt-4">
                    Profil Akun & Demo Role Switcher
                  </Link>
                  <button onClick={logout} className="text-body text-error py-2 text-left font-medium">
                    Keluar dari Akun
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/auth/login" className="text-body font-medium text-ink py-2">
                    Masuk
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-accent text-white px-6 py-3 text-body font-medium text-center hover:bg-accent-hover transition-colors"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
